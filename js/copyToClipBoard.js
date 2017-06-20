chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const textArea = document.createElement("textarea");
  textArea.textContent = request.md;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
});

// TO-DO: ここでコマンドを呼び出せば完了
chrome.commands.onCommand.addListener(function(command) {
  switch (command) {
    case "read-page":

      break;
    case "collect-page":

      break;
    case "remove-page":

      break;
  }
});
