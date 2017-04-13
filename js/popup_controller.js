// TO-DO: Windowがロードされたタイミングで呼び出したい
//     let url = document.getElementById('page-url');
//     let title = document.getElementById('page-title');
//     url.textContent = tab.url;
//     title.value = tab.title;

var cancelBtn = document.getElementById('cancel');
cancelBtn.addEventListener('click', function (e) {
  window.close();
});

var okBtn = document.getElementById('ok');
okBtn.addEventListener('click', function (e) {
  // クリップボードコピーを呼ぶ
  // modalを出す。
  window.close();
});
