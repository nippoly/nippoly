window.addEventListener('load', () => {
  // TODO: delete when clear method implemented
  //chrome.storage.sync.clear();
  let cancelBtn = document.getElementById('cancel');
  let okBtn = document.getElementById('ok');
  cancelBtn.addEventListener('click', function (e) {
    window.close();
  });
  okBtn.addEventListener('click', function (e) {
    new Promise((resolve, reject) => {
      chrome.tabs.getSelected(null, resolve);
    }).then((tab) => new Promise((resolve, reject) => {
      chrome.storage.sync.get('data', (items) => resolve([items, tab]));
    })).then((args) => new Promise((resolve, reject) => {
      let items = args[0];
      let tab = args[1];
      items.data = items.data || [];
      items.data.push({title: tab.title, url: tab.url});
      chrome.storage.sync.set(items, () => {
        let status = document.getElementById('status-bar');
        status.textContent = 'DONE'
        resolve();
      })
    })).then(() => {
      chrome.storage.sync.get('data', (items) => {
        const textArea = document.getElementById('test');
        textArea.textContent = items.data.reduce((result, item) => {
          return `${result}[${item.title}](${item.url})\n`
        }, '');
        textArea.select();
        document.execCommand('copy');
        window.close();
      });
    });
  });
});
