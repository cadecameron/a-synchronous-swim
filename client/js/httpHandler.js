(function () {

  const serverUrl = 'http://127.0.0.1:3000';

  //
  // TODO: build the swim command fetcher here
  // GET request function that sends the request
  // the function will be on a setTimer, so that the client continually
  // asks the server for any commands it needs to action.
  //

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

  // .ajax...
  //   success: (command) => {
  // SwimTeam.move(command)
  }

  window.startRandomSwimming = () => {
    const randomSwimming = setInterval(() => {
      window.ajaxRandomCommand()
    }, 1000);
    return randomSwimming; // return process ID to enable clearInterval() function
  }

  /////////////////////////////////////////////////////////////////////
  // The ajax file uploader is provided for your convenience!
  // Note: remember to fix the URL below.
  /////////////////////////////////////////////////////////////////////

  const ajaxFileUpload = (file) => {
  var formData = new FormData();
  formData.append('file', file);
  $.ajax({
    type: 'POST',
    data: formData,
    url: serverUrl,
    cache: false,
    contentType: false,
    processData: false,
    success: () => {
      // reload the page
      window.location = window.location.href;
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

  ajaxFileUplaod(file);
});

}) ();

//HTMLInputElementObject.addEventListener('input', (e) => console.log(e));