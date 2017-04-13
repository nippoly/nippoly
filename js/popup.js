window.addEventListener('load', () => {
  chrome.tabs.getSelected(null, (tab) => {
    // FIXME: temporary code
    let url = document.getElementById('page-url');
    let title = document.getElementById('page-title');
    url.textContent = tab.url;
    title.textContent = tab.title;
  });
});
