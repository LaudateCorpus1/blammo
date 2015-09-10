# blammo
Chrome Plugin pulling logentries into the browser 

blammo in your Chrome DevTools!

# How to configure
To configure the extension for a specific logentries account and environment, the configuration variables at the beginning of `js/background.js` must be modified. As well, the `manifest.json` file must be configured for the hosts being logged.

1. Edit the `accountKey` variable to the account key for your logentries account.
1. Edit the `domainToLogs` variable to the pages you want to log in the following format:  
 `"server.tld":["/path/to/log1/", "path/to/log2/", ...]`

1. Add the hostnames to log to `manifest.json` under the `"permissions"` key, between the `"webRequest"` and `"https://pull.logentries.com/*"` entries.

# How to install

1. Clone this repository locally.
1. Open [chrome://extensions](chrome://extensions) and check the checkbox labeled "Developer Mode".
1. Click on "Load unpacked extension...".
1. Select the directory where you cloned the repository.
1. Now you should be able to see a new tab named Logger in your DevTools.

# Opening DevTools
There are multiple ways for opening DevTools in chrome.

1. Right Click on any page and click on Inspect Element (Last Option).
1. Shortcut for opening DevTools is Command + Option(alt) + I.
1. Click on customize and control google chrome -> Go to More Tools -> Click on Developer Tools.
