# Tabs Backup
If you are using **Chrome on your Android device** and tend to have many open tabs (like me) you can use this tool to
create an HTML file which you can save or import into the favorites/bookmarks of the web browser of your choice.

*Disclaimer:* This uses dev tools I already have installed on my device anyway, otherwise different dev tools could
probably make more sense.

## Prerequisites
- [Android Command Line Tools](https://developer.android.com/studio#command-tools)
- [Node.js](https://nodejs.org/)

Your Android device has to be in Developer's Mode and connected with a USB cable. Also, the path to the Android platform
tools has to be part of your PATH variable. (e.g. `/Users/<username>/Library/Android/sdk/platform-tools`) 

## Run the script
**MacOS/Linux:**
```
./export.sh
```

The script creates the HTML file `tabs.html` which includes all your open tabs. You can import the file into the
favorites/bookmarks of your web browser.

## References
[When you never close tabs on your mobile Chrome browser (dev.to)](https://dev.to/piczmar_0/when-you-never-close-tabs-on-your-mobile-chrome-browser-2boj)
