window.addEventListener('load', () => {
  // TODO: delete when clear method implemented
  //chrome.storage.sync.clear();
  // TODO: split when button implemented
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
  });
  // TODO: split when button implemented
  chrome.storage.sync.get('data', (items) => {
    const textArea = document.getElementById('test');
    textArea.textContent = items.data.reduce((result, item) => {
      return `${result}[${item.title}](${item.url})\n`
    }, '');
    textArea.select();
    document.execCommand('copy');
  });
});
