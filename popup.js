// Risk scoring function (same as before)
function getRiskScore(name) {
  const patterns = [
    [/token|auth|access/, 'Auth Bypass', 90, 'high'],
    [/redirect|url/, 'Open Redirect', 85, 'high'],
    [/id|user|account/, 'IDOR', 75, 'medium'],
    [/callback|jsonp/, 'XSS via JSONP', 85, 'high'],
    [/search|query|q/, 'Reflected XSS', 70, 'medium'],
    [/debug|test/, 'Debug Exposure', 60, 'medium']
  ];
  for (let [regex, type, score, riskClass] of patterns) {
    if (regex.test(name)) return { type, score, riskClass };
  }
  return { type: 'Low Risk', score: 30, riskClass: 'low' };
}

// Store all params grouped by URL
let paramData = {};  // { url: [param1, param2, ...] }

function createParamElement(name) {
  const score = getRiskScore(name);
  const el = document.createElement('div');
  el.className = `param-item ${score.riskClass}`;
  el.textContent = `${name} → ${score.score}% (${score.type})`;
  return el;
}

function createUrlSection(url, params) {
  const section = document.createElement('div');
  section.className = 'url-section';

  const header = document.createElement('div');
  header.className = 'url-header';
  header.textContent = url;

  // Add toggle icon
  const toggleIcon = document.createElement('span');
  toggleIcon.className = 'toggle-icon';
  toggleIcon.textContent = '▼';
  header.appendChild(toggleIcon);

  const paramsContainer = document.createElement('div');
  params.forEach(param => {
    paramsContainer.appendChild(createParamElement(param));
  });

  header.addEventListener('click', () => {
    if (paramsContainer.style.display === 'none') {
      paramsContainer.style.display = 'block';
      toggleIcon.textContent = '▼';
    } else {
      paramsContainer.style.display = 'none';
      toggleIcon.textContent = '►';
    }
  });

  section.appendChild(header);
  section.appendChild(paramsContainer);

  return section;
}

function renderParamData(searchText = '') {
  const container = document.getElementById('param-list');
  container.innerHTML = '';

  let foundAny = false;
  for (const [url, params] of Object.entries(paramData)) {
    const filteredParams = params.filter(p => p.toLowerCase().includes(searchText.toLowerCase()));
    if (filteredParams.length === 0) continue;

    foundAny = true;
    container.appendChild(createUrlSection(url, filteredParams));
  }

  if (!foundAny) {
    container.textContent = 'No parameters found.';
  }
}

// Request params from background, grouped by URL
function fetchParamsGrouped() {
  chrome.runtime.sendMessage({ type: 'getGroupedParams' }, res => {
    if (!res || !res.groupedParams) {
      document.getElementById('param-list').textContent = 'No parameters found or background script not responding.';
      return;
    }
    paramData = res.groupedParams;
    renderParamData();
  });
}

// Clear stored data in background and reset popup
function clearData() {
  chrome.runtime.sendMessage({ type: 'clearParams' }, res => {
    paramData = {};
    renderParamData();
  });
}

document.getElementById('refresh').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs.length === 0) return;
    chrome.tabs.reload(tabs[0].id, {}, () => {
      setTimeout(fetchParamsGrouped, 2500);
    });
  });
});

document.getElementById('clear').addEventListener('click', clearData);

document.getElementById('search-box').addEventListener('input', (e) => {
  renderParamData(e.target.value);
});

// On load
fetchParamsGrouped();
