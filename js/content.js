(function() {
  if (window.isAlreadyPrepared) return;
  window.isAlreadyPrepared = true;
  // popupでsendMessegeしつつ呼び出すと発火するはず....
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // if (!!request.status) {
    //
    // }
    modal();
  });

  function modal() {
    showModal();
    // 何秒後かにhideModal();
  }

  function showModal() {
    document.write('<link href="style/modal.css" rel="stylesheet" />');
    var rect = document.createElement('div');
    rect.id = "Rectangle-2";
    var oval = document.createElement('div');
    var layer = document.createElement('div');
    oval.id = "Oval";
    layer.id = "layer";
    layer.innerHTML = "クリップボードに保存しました。";
    rect.appendChild(oval);
    rect.appendChild(layer);
    document.body.appendChild(rect);
  }

  function hideModal() {
    var rect = document.getElementById('Rectangle-2');
    document.body.removeChild(rect);
  }

})();
