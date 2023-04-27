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
        }
      );
    });
  }
);



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

      console.log(url)

      if (mainfiles) {

        const optfiles = doc.querySelector(
          "#file-container-optional-files"
        );

        const idArr = new Array();
        var eleArr = new Array();
        if (mainfiles.querySelectorAll(
          ".btn.inline-flex.popup-btn-ajax"
        )) {
          let node_list =
            mainfiles.querySelectorAll(
              ".btn.inline-flex.popup-btn-ajax"
            );
          let regex = /\?id=\d+/;
          eleArr = Array.from(node_list);
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
        }

        else {
          let node_list =
            mainfiles.querySelectorAll(
              ".btn.inline-flex"
            );
          let regex = /\&file_id=\d+/;
          eleArr = Array.from(node_list);
          if (optfiles) {
            optfiles
              .querySelectorAll(
                ".btn.inline-flex"
              )
              .forEach((element) => {
                eleArr.push(element);
              });
          }
          eleArr.forEach((element) => {
            let matchResult =
              element.href.match(regex);
            idArr.push(
              matchResult[0].split("&file_id=")[1]
            );
          });
        }

        const result = [...new Set(idArr)];

        console.log(result);

        chrome.runtime.sendMessage(
          {
            action: "download",
            data: result
          },
        );
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
