(async () => {
  const collectedByUrl = {};

  function isSameDomainOrSubdomain(url) {
    try {
      const urlObj = new URL(url);
      const currentDomain = location.hostname;
      const targetDomain = urlObj.hostname;
      return (
        targetDomain === currentDomain ||
        targetDomain.endsWith('.' + currentDomain)
      );
    } catch {
      return false;
    }
  }

  function extractParamsFromUrl(url) {
    if (!isSameDomainOrSubdomain(url)) return [];

    try {
      const params = new URL(url).searchParams;
      const keys = [];
      for (const [key] of params) keys.push(key);
      return keys;
    } catch {
      return [];
    }
  }

  // Collect from page URL
  collectedByUrl[location.href] = extractParamsFromUrl(location.href);

  // Collect from links and forms
  document.querySelectorAll('a[href], form[action]').forEach(el => {
    const href = el.tagName === 'FORM' ? el.action : el.href;
    if (!collectedByUrl[href]) collectedByUrl[href] = [];
    collectedByUrl[href].push(...extractParamsFromUrl(href));
    // Remove duplicates:
    collectedByUrl[href] = [...new Set(collectedByUrl[href])];
  });

  // Collect from same-domain JS files
  const scripts = [...document.querySelectorAll('script[src]')].map(s => s.src);
  for (const src of scripts) {
    if (!isSameDomainOrSubdomain(src)) continue;
    try {
      const res = await fetch(src);
      const jsText = await res.text();
      const matches = jsText.match(/([?&])([a-zA-Z0-9_]+)=/g) || [];
      const params = matches.map(m => m.replace(/[^a-zA-Z0-9_]/g, ''));
      if (!collectedByUrl[src]) collectedByUrl[src] = [];
      collectedByUrl[src].push(...params);
      collectedByUrl[src] = [...new Set(collectedByUrl[src])];
    } catch {}
  }

  chrome.runtime.sendMessage({ type: 'paramsGrouped', data: collectedByUrl }, () => {});
})();
