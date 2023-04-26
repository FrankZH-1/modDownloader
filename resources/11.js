function getSetTimeout() {
  const frame = document.createElement('iframe');
  document.body.appendChild(frame);
  const newTimeout = frame.contentWindow.setTimeout.bind(self);
  document.body.removeChild(frame);
  return newTimeout;
}
$(function () {
  const caemiernrltuatekstobtetomhratdewo = getSetTimeout();
  caemiernrltuatekstobtetomhratdewo(function () {
      $(document).scrollTop($('.page-layout').offset().top - 70);
  }, 500);
  const file_id = 11361;
  const game_id = 4095;
  const timeout = 5;
  const isNmmDownload = false;
  const isPremium = false;

  $('#slowDownloadButton').click(function () {
      const downloadUrl = $(this).data('download-url');
      $('.subheader, .table').hide();

      $('.donation-wrapper').show();

      countdown(timeout, function () {
          startDownload(downloadUrl);
      });
  });

  $('#startDownloadButton').click(function () {
      const downloadUrl = $(this).data('download-url');
      startDownload(downloadUrl);
  });

  function startDownload(downloadUrl) {
      if (isNmmDownload) {
          download(downloadUrl);
      } else {
          $.ajax(
              {
                  type: "POST",
                  url: "/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl",
                  data: {
                      fid: file_id,
                      game_id: game_id,
                  },
                  success: function (data) {
                      if (data && data.url) {
                          download(data.url);
                      } else {
                          setError();
                      }
                  },
                  error: function () {
                      setError();
                  }
              }
          );
      }
  }

  function download(downloadUrl) {
      window.nexusDataLayer.push({
          event: 'mod_download',
          file_id,
          download_method: isNmmDownload ? 'Vortex' : 'Manual',
      });
      window.location.href = downloadUrl;
      $('.donation-wrapper > p').html('<p>Your download has started</p><p>If you are having trouble, <a href="' + downloadUrl + '">click here</a> to download manually</p>');
  }

  function setError() {
      console.log('An error occurred');
  }

