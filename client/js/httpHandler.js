(function () {

  const serverUrl = 'http://127.0.0.1:3000';

  window.ajaxRandomCommand = () => {
    $.ajax({
      url: serverUrl + '/random',
      type: 'GET',
      success: (directionString) => {
        SwimTeam.move(directionString);
      }
    })
  }

  window.serverPost = () => {
    $.ajax({
      url: serverUrl + '/queue',
      type: 'GET',
      success: (directionString) => {
        SwimTeam.move(directionString);
      },
      complete: () => {
        window.serverPost(); // complete property used when server eventually sends data
      },
      timeout: 10000 // timeout before running the complete property function
    })
  }

  window.startRandomSwimming = () => {
    const randomSwimming = setInterval(() => {
      window.ajaxRandomCommand()
    }, 1000);
    return randomSwimming; // return process ID to enable clearInterval() function
  }

  window.startPolling = () => {
    $.ajax({
      url: serverUrl + '/queue',
      type: 'GET',
      success: (directionString) => {
        console.log('polling')
        if (['left','right','up','down'].includes(directionString)){
          SwimTeam.move(directionString)
          startPolling()
        } else {
          setTimeout(startPolling, 1000)
        }
      },
      error: (response) => {
        console.log('Polling Error', response)
      }
    })
  }

  const requestDefaultImage = () => {
    $.ajax({
      url: serverUrl + '/background',
      type: "GET",
      success: (image) => {
        $('.pool').css('background-image', `url(data:image/jpeg;base64,${image})`);
      },
      error: (response) => {
        console.log('IMAGE ERROR', response.status);
      }
    })
  }

  requestDefaultImage();

  const ajaxFileUpload = (file) => {
  var formData = new FormData();
  formData.append('file', file);
  $.ajax({
    type: 'POST',
    data: formData,
    url: serverUrl + "/upload",
    cache: false,
    contentType: false,
    processData: false,
    success: () => {
      window.location = window.location.href; // reload the page
    }
  });
};

$('form').on('submit', function (e) {
  e.preventDefault();

  var form = $('form .file')[0];
  if (form.files.length === 0) {
    console.log('No file selected!');
    return;
  }

  var file = form.files[0];
  if (file.type !== 'image/jpeg') {
    console.log('Not a jpg file!');
    return;
  }

  ajaxFileUpload(file);
});

}) ();
