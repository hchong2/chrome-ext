console.log(1)

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'outerBounds': {
      'width': 400,
      'height': 500
    }
  });
});



chrome.tts.speak("Hello Charles this is Jarvis")
// chrome.tts.speak("Maybe I didn't love you")
// chrome.tts.speak("Quite as often as I could have")
// chrome.tts.speak("And maybe I didn't treat you")
// chrome.tts.speak("Quite as good as I should have")
