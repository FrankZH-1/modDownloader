chrome.runtime.onInstalled.addListener(() => {
  console.log("已装载");
});

let urls = [];
let id = [];

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.action === "getTabUrls") {
      sendResponse(filterUrl())
    }
    urls = [];
  }
);

function filterUrl() {
  chrome.tabs.query({}, (tabs) => {
    const filteredTabs = tabs.filter(
      (tab) => {
        return /^https?:\/\/(www\.)?nexusmods\.com/.test(
          tab.url
        );
      }
    );
    filteredTabs.forEach((element) => {
      urls.push(element.url);
    });
  });
  console.log("got your quest~");
  if (urls.length)
    return { outcome: urls };
  else return { outcome: "failed" }
}
