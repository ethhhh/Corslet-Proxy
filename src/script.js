export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle root path requests
    if (url.pathname === '/' && !url.searchParams.get('url')) {
      return new Response(
        JSON.stringify({ 
          message: 'CORS Proxy is running',
          usage: 'Add ?url=https://example.com to proxy a website',
          example: 'https://corslet.ethh.workers.dev/?url=https://example.com'
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing ?url= param in the link!' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!isValidUrl(targetUrl)) {
      return new Response(
        JSON.stringify({ error: 'Wrong URL format' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') || '*',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
      let body = null;
      if (!['GET', 'HEAD'].includes(request.method)) {
        body = await request.text();
      }

      const forwardRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: body,
      });

      const response = await fetch(forwardRequest);
      let responseBody = await response.text();

      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('text/html')) {
        responseBody = rewriteUrls(responseBody, targetUrl, request.url);
        responseBody = injectMetaTag(responseBody);
      }

      const responseHeaders = new Headers(response.headers);
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, *');

      return new Response(responseBody, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (error) {
      console.error('Proxy error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  },
};

function isValidUrl(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

function rewriteUrls(html, targetUrl, proxyUrl) {
  const targetOrigin = new URL(targetUrl).origin;
  const proxyOrigin = new URL(proxyUrl).origin;

  html = html.replace(/href=["'](?!(?:https?:|\/\/|data:|javascript:|mailto:))/g, (match) => {
    return match.slice(0, -1) + proxyOrigin + '/?url=' + encodeURIComponent(targetOrigin) + '/';
  });

  html = html.replace(/src=["'](?!(?:https?:|\/\/|data:|javascript:))/g, (match) => {
    return match.slice(0, -1) + proxyOrigin + '/?url=' + encodeURIComponent(targetOrigin) + '/';
  });

  html = html.replace(/(?:href|src)=["'](\/[^"']*)/g, (match, path) => {
    return match.split('=')[0] + '="' + proxyOrigin + '/?url=' + encodeURIComponent(targetOrigin + path);
  });

  return html;
}

function injectMetaTag(html) {
  const metaTag = '<meta name="google-site-verification" content="QZePxQi84t70H06b6jHGiZ51fbfFsvLCQTZ7drDH3DA" />';

  if (html.includes('<head>')) {
    return html.replace('<head>', '<head>\n    ' + metaTag);
  }

  if (html.includes('<html>')) {
    return html.replace('<html>', '<html>\n  ' + metaTag);
  }

  return metaTag + '\n' + html;
}
