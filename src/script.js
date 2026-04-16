export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Serve index.html for root path
    if (url.pathname === '/') {
      try {
        const indexHtml = await env.ASSETS.fetch(new Request('https://example.com/index.html'));
        return new Response(indexHtml.body, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        });
      } catch (error) {
        // Fallback if ASSETS binding doesn't work
        return new Response(`
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Corslet</title>
  <meta name="description" content="Corslet is a simple CORS proxy with an in-website testing tool." />
  <style>
    :root {
      --bg: #07111f;
      --panel: rgba(255, 255, 255, 0.06);
      --border: rgba(255, 255, 255, 0.12);
      --text: #eaf2ff;
      --muted: #a8b3c7;
      --brand: #7c3aed;
      --brand2: #22d3ee;
      --max: 1040px;
      --input: rgba(255, 255, 255, 0.05);
      --inputBorder: rgba(255, 255, 255, 0.14);
      --success: #34d399;
      --error: #fb7185;
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      padding: 0;
      background: radial-gradient(circle at top, #13203a 0, var(--bg) 45%);
      color: var(--text);
      font-family: Inter, system-ui, sans-serif;
    }

    a { color: inherit; text-decoration: none; }

    .wrap {
      max-width: var(--max);
      margin: 0 auto;
      padding: 28px 24px 48px;
    }

    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 54px;
      gap: 16px;
      flex-wrap: wrap;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 800;
      font-size: 18px;
      letter-spacing: 0.2px;
    }

    .mark {
      width: 34px;
      height: 34px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--brand), var(--brand2));
      box-shadow: 0 10px 30px rgba(124, 58, 237, 0.35);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 14px 18px;
      border-radius: 14px;
      font-weight: 700;
      border: 1px solid transparent;
      transition: transform 0.2s ease, opacity 0.2s ease;
      cursor: pointer;
      background: transparent;
      color: var(--text);
    }

    .btn:hover {
      transform: translateY(-1px);
      opacity: 0.95;
    }

    .primary {
      background: linear-gradient(135deg, var(--brand), var(--brand2));
      color: white;
    }

    .ghost {
      border-color: var(--inputBorder);
      background: rgba(255, 255, 255, 0.03);
    }

    .card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      padding: 24px;
    }

    .hero {
      text-align: center;
      padding: 36px 0 42px;
    }

    h1 {
      font-size: clamp(44px, 6vw, 76px);
      line-height: 0.95;
      margin: 0 0 16px;
      letter-spacing: -2px;
    }

    .lead {
      max-width: 62ch;
      margin: 0 auto;
      font-size: 18px;
      line-height: 1.7;
      color: var(--muted);
    }

    .cta {
      margin-top: 28px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 14px;
    }

    .section {
      padding: 18px 0;
    }

    .section h2 {
      font-size: 30px;
      margin: 0 0 14px;
    }

    .section p.sub {
      color: var(--muted);
      margin: 0 0 18px;
      line-height: 1.7;
    }

    .usebox,
    .testbox {
      padding: 22px;
    }

    pre {
      margin: 0;
      padding: 0;
      white-space: pre-wrap;
      word-break: break-word;
      color: #dff8ff;
      font-size: 13px;
      line-height: 1.7;
      overflow-x: auto;
    }

    .input {
      width: 100%;
      padding: 14px 16px;
      border-radius: 14px;
      border: 1px solid var(--inputBorder);
      background: var(--input);
      color: var(--text);
      outline: none;
      font-size: 15px;
    }

    .input::placeholder {
      color: #8f9ab0;
    }

    .row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }

    .status {
      font-size: 14px;
      color: var(--muted);
      min-height: 20px;
    }

    .status.ok { color: var(--success); }
    .status.err { color: var(--error); }

    .result {
      min-height: 260px;
      max-height: 500px;
      overflow: auto;
      background: rgba(0, 0, 0, 0.22);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 16px;
      white-space: pre-wrap;
      word-break: break-word;
      color: #dff8ff;
      font-size: 13px;
      line-height: 1.7;
    }

    .footer {
      text-align: center;
      padding-top: 32px;
      color: var(--muted);
      font-size: 14px;
    }

    @media (max-width: 700px) {
      .nav { margin-bottom: 34px; }
      .hero { padding: 18px 0 30px; }
      .card, .usebox, .testbox { padding: 20px; }
      h1 { letter-spacing: -1.5px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header class="nav">
      <div class="logo">
        <div class="mark"></div>
        Corslet
      </div>

      <a class="btn primary" href="https://github.com/ethhhh/Corslet-Proxy/" target="_blank" rel="noopener noreferrer">Source Code</a>
    </header>

    <section class="hero">
      <h1>Corslet</h1>
      <p class="lead">100% Free CORS proxy for developers to use.</p>
    </section>

    <section class="section" id="use">
      <h2>Usage</h2>
      <p class="sub">Use this API to bypass CORS restrictions:</p>
      <div class="card usebox">
        <pre>https://corslet.ethh.workers.dev/?url=https://example.com/</pre>
      </div>
    </section>

    <section class="section" id="tester">
      <h2>Test the API</h2>
      <p class="sub">Write a URL and the result will load through the proxy below.</p>

      <div class="card" style="display:grid; gap:14px;">
        <input id="testUrl" class="input" type="url" placeholder="https://example.com/" autocomplete="off" spellcheck="false" />

        <div class="row">
          <button class="btn primary" id="runTest" type="button">Test</button>
          <button class="btn ghost" id="loadExample" type="button">Load Example</button>
          <button class="btn ghost" id="clearResult" type="button">Clear</button>
        </div>

        <div id="status" class="status">Ready.</div>
        <pre id="result" class="result">Response will appear here</pre>
      </div>
    </section>

    <div class="footer">Corslet — CORS proxy made simple.</div>
  </div>

  <script>
    const input = document.getElementById('testUrl');
    const result = document.getElementById('result');
    const statusEl = document.getElementById('status');
    const runBtn = document.getElementById('runTest');
    const exampleBtn = document.getElementById('loadExample');
    const clearBtn = document.getElementById('clearResult');

    const proxyBase = 'https://corslet.ethh.workers.dev/api?url=';

    function setStatus(text, type = '') {
      statusEl.textContent = text;
      statusEl.className = 'status' + (type ? ' ' + type : '');
    }

    function normalizeUrl(value) {
      const t = value.trim();
      if (!t) return '';
      return /^https?:\/\//i.test(t) ? t : 'https://' + t;
    }

    async function runTest() {
      const target = normalizeUrl(input.value);
      if (!target) {
        setStatus('Enter a URL first.', 'err');
        result.textContent = '';
        return;
      }

      const proxyUrl = proxyBase + encodeURIComponent(target);
      setStatus('Loading through proxy...', '');
      result.textContent = proxyUrl + '\n\nLoading...';

      try {
        const res = await fetch(proxyUrl);
        const text = await res.text();
        setStatus(`Done. HTTP ${res.status}`, res.ok ? 'ok' : 'err');
        result.textContent = text || '(Empty response)';
      } catch (err) {
        setStatus('Request failed.', 'err');
        result.textContent = String(err && err.message ? err.message : err);
      }
    }

    exampleBtn.addEventListener('click', () => {
      input.value = 'https://example.com/';
      setStatus('Example loaded.');
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      result.textContent = 'Response will appear here';
      setStatus('Cleared.');
    });

    runBtn.addEventListener('click', runTest);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') runTest();
    });
  </script>
</body>
</html>
        `, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        });
      }
    }

    // CORS proxy only runs on /api path
    if (url.pathname === '/api') {
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
    }

    // 404 for other paths
    return new Response('Not Found', { status: 404 });
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
    return match.slice(0, -1) + proxyOrigin + '/api?url=' + encodeURIComponent(targetOrigin) + '/';
  });

  html = html.replace(/src=["'](?!(?:https?:|\/\/|data:|javascript:))/g, (match) => {
    return match.slice(0, -1) + proxyOrigin + '/api?url=' + encodeURIComponent(targetOrigin) + '/';
  });

  html = html.replace(/(?:href|src)=["'](\/[^"']*)/g, (match, path) => {
    return match.split('=')[0] + '="' + proxyOrigin + '/api?url=' + encodeURIComponent(targetOrigin + path);
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
