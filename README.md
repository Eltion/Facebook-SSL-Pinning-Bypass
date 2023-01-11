# Facebook SSL Pinning Bypass

Bypass Facebook SSL pinning on Android devices.  
Supported ABIs: `x86`, `x86_64`, `armeabi-v7a`, `arm64-v8a`  
Latest version: `v396.1.0.28.104`

If you like this project:  
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/eltimusa4q)  

**Bitcoin**: bc1q6kvvun3cfm5kadesxflntszp8z9lqesra35law  
**Ethereum**: 0x47633Ef59b0F765b7f8047b0A56230cfeBB34027

## Patched APK (No Root)

[facebook-v396.1.0.28.104-x86.apk](https://github.com/Eltion/Facebook-SSL-Pinning-Bypass/releases/download/v396.1.0.28.104/facebook-v396.1.0.28.104-x86.apk)

[facebook-v396.1.0.28.104-armeabi-v7a.apk](https://github.com/Eltion/Facebook-SSL-Pinning-Bypass/releases/download/v396.1.0.28.104/facebook-v396.1.0.28.104-armeabi-v7a.apk)

[facebook-v396.1.0.28.104-arm64-v8a.apk](https://github.com/Eltion/Facebook-SSL-Pinning-Bypass/releases/download/v396.1.0.28.104/facebook-v396.1.0.28.104-arm64-v8a.apk)

[See all versions](https://github.com/Eltion/Facebook-SSL-Pinning-Bypass/releases/)

Note: You need to uninstall the Facebook app before trying to install it, if Facebook is installed as a system app then you can not uninstall it without root so this method will not work in that case.

## Run using Frida (Requires Root)

This method requires frida-tools and also frida-server running in the device
```
frida -U -l .\facebook-ssl-pinning-bypass.js -f com.facebook.katana --no-pause
```

## Intercept network traffic

You can use a tool like mitmproxy or Burp Suite to intercept the network.

1. Install patched APK in the device
2. Install [mitmproxy](https://mitmproxy.org/) or [Burp Suite](https://portswigger.net/burp)
3. Set up proxy for wifi settings or run: `adb shell settings put global http_proxy <proxy>`

Now you should be able to see the network traffic.

## View script logs
To view the logcat run:
```
adb logcat -s "FACEBOOK_SSL_PINNING_BYPASS:V"
```

[#leftenter](#leftenter)
