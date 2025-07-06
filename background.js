let paramStore = {}; // { url: Set(params) }

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'paramsGrouped') {
    // msg.data = { url: [param1, param2, ...], ... }
    for (const [url, params] of Object.entries(msg.data)) {
      if (!paramStore[url]) paramStore[url] = new Set();
      params.forEach(p => paramStore[url].add(p));
    }
    sendResponse({ status: 'stored' });
    return true;
  }

  if (msg.type === 'getGroupedParams') {
    const groupedParams = {};
    for (const url in paramStore) {
      groupedParams[url] = Array.from(paramStore[url]);
    }
    sendResponse({ groupedParams });
    return true;
  }

  if (msg.type === 'clearParams') {
    paramStore = {};
    sendResponse({ status: 'cleared' });
    return true;
  }
});
