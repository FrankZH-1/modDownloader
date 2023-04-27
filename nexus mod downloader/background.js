chrome.runtime.onInstalled.addListener(() => {
  console.log("已装载");
});

let urls = [];
let id = [];
let count = 0;
let current = 0;
let urlList = [];
const gameId = { monsterhunterrise: 4095 };
const urlHead =
  "https://www.nexusmods.com/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl";

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.action === "getTabUrls") {
      sendResponse(filterUrl())
    }
    else if (request.action === 'download') {
      {
        sendResponse(download(request.data))
        // sendResponse({ response: "123" })
      }
    }
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
  count = urls.length
  if (urls.length)
    return { outcome: urls };
  else return { outcome: "failed" }
}

function gatherDownloadUrl(data) {
  urlList.concat(data)
}



function download(data) {
  console.log(current);

  if (current < count) {
    gatherDownloadUrl(data)
    current++;
  }
  else {
    count = 0
    startDonwload()
  }
}

function startDonwload() {
  console.log("download started", urlList)
  return { response: "download started" }
}