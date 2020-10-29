chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const textArea = document.createElement("textarea");
  textArea.textContent = request.md;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
});
