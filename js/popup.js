window.addEventListener('load', () => {
  let cancelBtn = document.getElementById("cancel");
  let okBtn = document.getElementById("ok");
  let pageTitle = document.getElementById("page-title");
  let pageUrl = document.getElementById("page-url");
  chrome.tabs.getSelected(null, (tab) => {
    pageTitle.value = tab.title;
    pageUrl.textContent = tab.url;
  });
  cancelBtn.addEventListener('click', function (e) {
    window.close();
  });
  okBtn.addEventListener('click', function (e) {
    new Promise((resolve, reject) => {
      chrome.storage.sync.get('data', resolve);
    }).then((items) => new Promise((resolve, reject) => {
      items.data = items.data.filter(item => new Date(item.created_at) >= new Date(Date.now() - 60 * 1000)) || [];
      items.data.push({title: pageTitle.value, url: pageUrl.textContent, created_at: new Date().toString()});
      chrome.storage.sync.set(items, () => {
        let status = document.getElementById('status-bar');
        status.textContent = 'DONE'
        resolve();
      });
    })).then(() => {
      chrome.storage.sync.get('data', (items) => {
        const textArea = document.getElementById('test');
        textArea.textContent = items.data.reduce((result, item) => {
          return `${result}[${item.title}](${item.url})\n`
        }, '');
        textArea.select();
        document.execCommand('copy');
        //window.close();
      });
    });
  });

  // TODO: if clear button is needed, use this.
  /*
  clearBtn.addEventListener('click', () => {
    chrome.storage.sync.clear();
  });*/
});
