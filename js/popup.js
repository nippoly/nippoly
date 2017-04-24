window.addEventListener('load', () => {
  let cancelBtn = document.getElementById("cancel");
  let okBtn = document.getElementById("ok");
  let copyBtn = document.getElementById("copys");
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
      items.data = (items.data || []).filter(item => new Date(item.created_at) >= new Date(Date.now() - 60 * 1000));
      items.data.push({title: pageTitle.value, url: pageUrl.textContent, created_at: new Date().toString()});
      chrome.storage.sync.set(items, () => {
        let status = document.getElementById('status-bar');
        status.textContent = '追加しました。'
        resolve();
      });
    })).then(() => {
      chrome.storage.sync.get('data', (items) => {
        const textArea = document.getElementById('test');
        const item = items.data[items.data.length - 1];
        textArea.textContent = `[${item.title}](${item.url})\n`
        textArea.select();
        document.execCommand('copy');
        window.close();
      });
    });
  });


  copyBtn.addEventListener('click', function (e) {
    chrome.storage.sync.get('data', (items) => {
      const textArea = document.getElementById('test');
      textArea.textContent = items.data.reduce((result, item) => {
        return `${result}- [${item.title}](${item.url})\n`
      }, '');
      textArea.select();
      document.execCommand('copy');
      window.close();
    });
  });

  // TODO: if clear button is needed, use this.
  /*
  clearBtn.addEventListener('click', () => {
    chrome.storage.sync.clear();
  });*/
});
