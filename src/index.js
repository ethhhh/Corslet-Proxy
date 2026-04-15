
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing "url" query parameter' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate URL format
    if (!isValidUrl(targetUrl)) {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Handle CORS preflight requests
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
      // Determine if request has a body
      let body = null;
      if (!['GET', 'HEAD'].includes(request.method)) {
        body = await request.text();
      }

      // Create forward request
      const forwardRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: body,
      });

      // Fetch the target
      const response = await fetch(forwardRequest);
      let responseBody = await response.text();

      // Rewrite URLs in HTML responses and inject meta tag
      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('text/html')) {
        responseBody = rewriteUrls(responseBody, targetUrl, request.url);
        responseBody = injectMetaTag(responseBody);
      }

      // Build response headers with CORS
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

  // Rewrite href attributes
  html = html.replace(/href=["'](?!(?:https?:|\/\/|data:|javascript:|mailto:))/g, (match) => {
    return match.slice(0, -1) + proxyOrigin + '/?url=' + encodeURIComponent(targetOrigin) + '/';
  });

  // Rewrite src attributes
  html = html.replace(/src=["'](?!(?:https?:|\/\/|data:|javascript:))/g, (match) => {
    return match.slice(0, -1) + proxyOrigin + '/?url=' + encodeURIComponent(targetOrigin) + '/';
  });

  // Rewrite absolute URLs starting with /
  html = html.replace(/(?:href|src)=["'](\/[^"']*)/g, (match, path) => {
    return match.split('=')[0] + '="' + proxyOrigin + '/?url=' + encodeURIComponent(targetOrigin + path);
  });

  return html;
}

function injectMetaTag(html) {
  const metaTag = '<meta name="google-site-verification" content="QZePxQi84t70H06b6jHGiZ51fbfFsvLCQTZ7drDH3DA" />';
  
  // Try to inject after <head> tag
  if (html.includes('<head>')) {
    return html.replace('<head>', '<head>\n    ' + metaTag);
  }
  
  // If no <head> tag, try to inject before <html>
  if (html.includes('<html>')) {
    return html.replace('<html>', '<html>\n  ' + metaTag);
  }
  
  // If neither, just prepend to the document
  return metaTag + '\n' + html;
}
