// script.js

async function go() {
  const input = document.getElementById('url');
  const output = document.getElementById('output');

  const target = input.value.trim();

  if (!target) {
    output.textContent = 'Please enter a URL';
    return;
  }

  try {
    output.textContent = 'Loading...';

    const res = await fetch(`/api/this?url=${encodeURIComponent(target)}`);

    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await res.json();
      output.textContent = JSON.stringify(data, null, 2);
    } else {
      const text = await res.text();

      // If it's HTML, show it in an iframe for better preview
      if (contentType.includes('text/html')) {
        output.innerHTML = '';

        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '500px';
        iframe.style.border = '1px solid #ccc';

        output.appendChild(iframe);

        iframe.srcdoc = text;
      } else {
        output.textContent = text;
      }
    }
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
}

// Optional: allow pressing Enter
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('url');

  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        go();
      }
    });
  }
});
