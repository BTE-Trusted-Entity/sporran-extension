# Integration of websites with the Sporran extension

We need to provide JS api for the websites to be able to interact with the extension.
Apparently the only way for an extension to do that is to inject a script into
the webpage which will create that API.

We also need to show some extension UI in the response to the API calls.
The browsers intentionally prevent JS code from showing the standard extension popup.
Luckily the extension has an internal URI and its UI can be shown in a normal browser
window (or popup window). However only the code running in the extension background
process or popup process can do this. The browsers intentionally prevent JS code
on websites, in injected scripts, as well as in the content scripts from accessing
the extension UI URIs.

Finally, we also need to pass the API call data to the extension UI.
The UI uses internally an in-memory router which is unaware about the actual URI.

This is how the system has to work in such environment:

1. The extension API is exposed to the website JS by an injected script.
   In response to the API calls this script passes messages to the content script.
1. The content script injects the injected script into the webpage.
   It also listens for the messages from it and passes them on to the background process.
1. The background process listens to the messages from the content script.
   When a message is received, it constructs an internal extension URI and
   encodes in it the parameters of the call. Then it opens this URI
   in a new browser window.
1. When the extension UI initializes it detects that it is shown in the browser window,
   not in the extension popup. In that case it takes the parameters encoded in the URI,
   and transforms them for use in the internal router.
