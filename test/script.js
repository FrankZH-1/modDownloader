const url =
  "https://www.nexusmods.com/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl";
let file_id = 11361;
let game_id = 4095;
let button = document.querySelector(".button");
let clickBool = 0;

console.log("injected");

function connect(file_id, game_id) {
  let params = `fid=${file_id}&game_id=${game_id}`;
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
  console.log(123);
  xhr.send(params);
}
