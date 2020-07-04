adb forward tcp:9222 localabstract:chrome_devtools_remote
curl http://localhost:9222/json/list > tabs.json
adb forward --remove tcp:9222

node index.js
