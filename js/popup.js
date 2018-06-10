window.addEventListener('load', () => {
  let clearBtn = document.getElementById("delete");
  let okBtn = document.getElementById("ok");
  let copyBtn = document.getElementById("copys");
  let pageTitle = document.getElementById("page-title");
  let pageUrl = document.getElementById("page-url");
  let pageComment = document.getElementById("page-comment");

  chrome.tabs.getSelected(null, (tab) => {
    pageTitle.value = tab.title;
    pageUrl.textContent = tab.url;
  });

  okBtn.addEventListener('click', function (e) {
    new Promise((resolve, reject) => {
      chrome.storage.sync.get('data', resolve);
    }).then((items) => new Promise((resolve, reject) => {
      let newItem = {title: pageTitle.value,comment: pageComment.value, url: pageUrl.textContent, created_at: new Date().toString()};
      items.data = items.data || [];
      items.data.push(newItem);
      items.data = items.data.filter((item, p) => p == items.data.findIndex(item2 => item.url == item2.url));
      chrome.storage.sync.set(items, () => {
        if (document.getElementById('Rectangle-2') != null) {
          let befRect = document.getElementById('Rectangle-2');
          document.body.removeChild(befRect);
        }
        var rect = document.createElement('div');
        rect.id = "Rectangle-2";
        var oval = document.createElement('div');
        var layer = document.createElement('div');
        oval.id = "Oval";
        layer.id = "layer";
        layer.innerHTML = "このページをストックしました。";
        rect.appendChild(oval);
        rect.appendChild(layer);
        document.body.appendChild(rect);
        resolve(newItem);
      });
    })).then((item) => {
      chrome.runtime.sendMessage({
        md: `[${item.title}](${item.url})${item.comment}\n`,
        closeWindow: false
      });
    });
  });


  copyBtn.addEventListener('click', function (e) {
    chrome.storage.sync.get('data', (items) => {
      const md = items.data.reduce((result, item) => {
        if (item.comment !== ""){
          return `${result}- [${item.title}](${item.url})\n${item.comment}\n`
        }else{
          return `${result}- [${item.title}](${item.url})\n`
        }
      }, '');
      chrome.runtime.sendMessage({
        md: md
      });
      if (document.getElementById('Rectangle-2') != null) {
        let befRect = document.getElementById('Rectangle-2');
        document.body.removeChild(befRect);
      }
      var rect = document.createElement('div');
      rect.id = "Rectangle-2";
      var oval = document.createElement('div');
      var layer = document.createElement('div');
      oval.id = "Oval";
      layer.id = "layer";
      layer.innerHTML = "クリップボードにまとめました。";
      rect.appendChild(oval);
      rect.appendChild(layer);
      document.body.appendChild(rect);
      chrome.storage.sync.clear();
    });
  });

  clearBtn.addEventListener('click', () => {
    if (document.getElementById('Rectangle-2') != null) {
      let befRect = document.getElementById('Rectangle-2');
      document.body.removeChild(befRect);
    }
    var rect = document.createElement('div');
    rect.id = "Rectangle-2";
    var oval = document.createElement('div');
    var layer = document.createElement('div');
    oval.id = "Oval";
    layer.id = "layer";
    layer.innerHTML = "読んだものを削除しました。";
    rect.appendChild(oval);
    rect.appendChild(layer);
    document.body.appendChild(rect);
    chrome.storage.sync.clear();
  });
});
