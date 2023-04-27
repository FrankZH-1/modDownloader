document.addEventListener(
  "DOMContentLoaded",
  () => {
    const button =
      document.querySelector(".button");
    button.addEventListener("click", () => {
      chrome.runtime.sendMessage(
        { action: "getTabUrls" },
        (response) => {
          // 处理URL列表，例如展示在弹出窗口中
          console.log(
            "this is the outcome",
            response.outcome
          );
          if (response) {
            response.outcome.forEach((item) => {
              getPage(item);
            });
          }

        }
      );
    });
  }
);

const gameId = { monsterhunterrise: 4095 };
const urlHead =
  "https://www.nexusmods.com/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl";

function substringFromEnd(string, targetChar) {
  const index = string.lastIndexOf(targetChar);
  return index !== -1 ? string.slice(index) : string;
}

function getPage(url) {
  const xhr = new XMLHttpRequest();
  const requestURL = url + "?tab=files";
  // 设置请求方法和URL
  xhr.open("GET", requestURL);
  // 设置响应类型为文本
  xhr.responseType = "text";
  // 注册加载完成事件处理函数
  xhr.onload = () => {
    if (xhr.status === 200) {
      // 成功获取响应数据
      const html = xhr.responseText;
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        html,
        "text/html"
      );
      const title = doc.title.split("at")[0]
      const mainfiles = doc.querySelector(
        "#file-container-main-files"
      );

      console.log(url)

      if (mainfiles) {
        let optfiles = doc.querySelector(
          "#file-container-optional-files"
        );
        let filelist = mainfiles.querySelectorAll("dt")
        let fileArr = Array.from(filelist)
        if (optfiles) {
          let optlist = optfiles.querySelectorAll("dt")
          let optArr = Array.from(optlist)
          fileArr = fileArr.concat(optArr);
        }

        let eleArr = new Array();
        fileArr.forEach((item) => {
          let element = {};
          element.id = item.getAttribute('data-id');
          element.subtitle = item.querySelector('p').innerHTML
          element.title = title
          eleArr.push(element);
        })

        console.log(eleArr)

        eleArr.forEach((item) => {
          let params =
            `fid=${item.id}` + `&game_id=${gameId.monsterhunterrise}`;
          const xhrDown = new XMLHttpRequest();
          xhrDown.open("POST", urlHead, true);
          xhrDown.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );
          xhrDown.onreadystatechange = function () {
            if (
              xhrDown.readyState === 4 &&
              xhrDown.status === 200
            ) {
              const response = xhrDown.responseText;
              item.downloadUrl = JSON.parse(response).url.slice(0, -3) + Math.floor(Math.random() * 256)

              // console.log(item)
              let end = substringFromEnd(item.downloadUrl.split('?')[0], '.')
              let name = item.title + item.subtitle + end
              console.log(item, name)
              // chrome.downloads.download({
              //   url: item.downloadUrl,
              //   filename: name
              // })
            }
          };
          xhrDown.send(params);
        })
      }
      else
        console.log("not a compatible page")
    } else {
      // 请求失败，处理错误
      console.error("请求失败：", xhr.status);
    }
  };
  // 发送请求
  xhr.send();
}
