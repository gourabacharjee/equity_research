const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const jsTargetRegex = /\/\/ 4\. Fetch Authentic Market News directly from Node\.js Aggregator Proxy[\s\S]*?\/\/ Initialize UI and API calls/m;

const newJsContent = `// 4. Fetch Authentic Market News directly from Node.js Aggregator Proxy
    async function loadNewsCategory(category) {
      ['india', 'global', 'nifty', 'stocks', 'sector'].forEach(cat => {
        const btn = document.getElementById('tab-' + cat);
        if (btn) btn.className = (cat === category) ? 'btn btn-primary' : 'btn btn-secondary';
      });

      const grid = document.getElementById('dynamic-news-grid');
      if(!grid) return;
      grid.innerHTML = '<div style="grid-column: span 3; text-align: center; padding: 2rem; color: var(--text-muted);"><span style="display:inline-block; animation: pulseLive 1.5s infinite;">⏳ Fetching genuine ' + category + ' news...</span></div>';

      try {
        // Automatically determine backend IP for mobile local network testing
        const backendHost = (window.location.hostname && window.location.hostname !== '') ? window.location.hostname : 'localhost';
        const backendUrl = \`http://\${backendHost}:3000/api/news?category=\${category}\`;
        
        const response = await fetch(backendUrl);
        if (response.ok) {
          const data = await response.json();
          const items = data.items;
          
          if (items.length === 0) {
              grid.innerHTML = '<div style="grid-column: span 3; text-align: center; color: var(--text-muted);">No news found for this category right now.</div>';
              return;
          }
          
          grid.innerHTML = items.map(item => {
            const pubDate = new Date(item.pubDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            
            const industryTag = item.industry ? \`<span style="background: rgba(56, 189, 248, 0.15); color: var(--blue); padding: 2px 8px; border-radius: 4px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase;">\${item.industry}</span>\` : '';
            
            // Render an attractive image thumbnail if provided by the backend, else fallback
            const imgThumbnail = item.image ? \`<div style="width: 80px; height: 80px; flex-shrink: 0; border-radius: 6px; overflow: hidden; margin-left: 12px;"><img src="\${item.image}" alt="News Image" style="width: 100%; height: 100%; object-fit: cover;"></div>\` : \`<div style="width: 80px; height: 80px; flex-shrink: 0; border-radius: 6px; background: rgba(56, 189, 248, 0.1); margin-left: 12px; display: flex; align-items: center; justify-content: center; color: var(--blue); font-size: 1.5rem;">📰</div>\`;
            
            return \`
              <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div style="flex-grow: 1;">
                    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                      \${industryTag}
                    </div>
                    <h3 style="font-size: 1.05rem; line-height: 1.4; margin-bottom: 10px;">
                      <a href="\${item.link}" target="_blank" style="color: inherit; text-decoration: none;">\${item.title}</a>
                    </h3>
                  </div>
                  \${imgThumbnail}
                </div>
                <div style="margin-top: 15px; font-size: 0.7rem; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 10px;">
                  <span style="font-weight: 700;">Source: \${item.source}</span>
                  <span>\${pubDate}</span>
                </div>
              </div>
            \`;
          }).join('');
        } else {
          grid.innerHTML = '<div style="grid-column: span 3; text-align: center; color: var(--red);">Backend API Error fetching news data. Is server.js running?</div>';
        }
      } catch (e) {
        grid.innerHTML = '<div style="grid-column: span 3; text-align: center; color: var(--red);">Failed to connect to genuine source. Ensure backend is running.</div>';
      }
    }

    // Initialize UI and API calls`;

// Also need to update fetchLiveBackendData to use dynamic IP
const backendFetchRegex = /\/\/ 3\. Fetch 100% Accurate Live Data from our Local Node\.js Backend Proxy[\s\S]*?async function fetchLiveBackendData\(\) {[\s\S]*?try {[\s\S]*?const response = await fetch\('http:\/\/localhost:3000\/api\/ticker'\);/;
const newBackendFetch = `// 3. Fetch 100% Accurate Live Data from our Local Node.js Backend Proxy
    async function fetchLiveBackendData() {
      try {
        const backendHost = (window.location.hostname && window.location.hostname !== '') ? window.location.hostname : 'localhost';
        const response = await fetch(\`http://\${backendHost}:3000/api/ticker\`);`;

html = html.replace(jsTargetRegex, newJsContent);
html = html.replace(backendFetchRegex, newBackendFetch);

fs.writeFileSync('index.html', html);
console.log('Successfully updated index.html for dynamic mobile URLs and Image support.');
