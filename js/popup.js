window.addEventListener('load', () => {
  // TODO: delete when clear method implemented
  //chrome.storage.sync.clear();
  new Promise((resolve, reject) => {
    chrome.tabs.getSelected(null, resolve);
  }).then((tab) => new Promise((resolve, reject) => {
    chrome.storage.sync.get('data', (items) => resolve([items, tab]));
  })).then((args) => {
    let items = args[0];
    let tab = args[1];
    items.data = items.data || [];
    items.data.push({title: tab.title, url: tab.url});
    chrome.storage.sync.set(items, () => {
      let status = document.getElementById('status-bar');
      status.textContent = 'DONE'
    });
  })
});
