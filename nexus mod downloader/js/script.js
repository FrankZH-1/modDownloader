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
          response.outcome.forEach((item) => {
            getPage(item);
          });
          if (response.outcome != "failed") {
            handleUrl(response.outcome);
          }
        }
      );
    });
  }
);

function handleUrl(urls) {
  // const regex = /mods\/\d+/;
  // urls.forEach((element) => {
  //   element.split("/monsterhunterrise/");
  //   if (regex.test(element[1])) {
  //     let modId = element[1].split("mods/")[1];
  //   }
  // });
}

const url =
  "https://www.nexusmods.com/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl";
let fileId = 11361;
const gameId = { monsterhunterrise: 4095 };
const totalId = [];
function connect(file_id, game_id) {
  let params =
    `fid=${file_id}` + `&game_id=${game_id}`;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );

  xhr.onreadystatechange = function () {
    if (
      xhr.readyState === 4 &&
      xhr.status === 200
    ) {
      // 请求成功，处理响应数据
      const response = xhr.responseText;
      console.log(response);

      // 对响应数据进行处理，例如解析JSON数据
      const jsonResponse = JSON.parse(response);
    }
  };
  xhr.send(params);
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

      const mainfiles = doc.querySelector(
        "#file-container-main-files"
      );

      const optfiles = doc.querySelector(
        "#file-container-optional-files"
      );

      const node_list =
        mainfiles.querySelectorAll(
          ".btn.inline-flex.popup-btn-ajax"
        );

      const eleArr = Array.from(node_list);
      const idArr = new Array();
      const regex = /\?id=\d+/;

      if (optfiles) {
        optfiles
          .querySelectorAll(
            ".btn.inline-flex.popup-btn-ajax"
          )
          .forEach((element) => {
            eleArr.push(element);
          });
      }
      eleArr.forEach((element) => {
        let matchResult =
          element.href.match(regex);
        idArr.push(
          matchResult[0].split("?id=")[1]
        );
      });

      const result = [...new Set(idArr)];
      console.log(result);
      totalId.concat(result);
      // const index = html.indexOf("Old files");
      // if (index > 0) {
      //   const result = html.substring(0, index);
      // }
    } else {
      // 请求失败，处理错误
      console.error("请求失败：", xhr.status);
    }
  };
  // 发送请求
  xhr.send();
}
