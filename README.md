# Facebook SSL Pinning Bypass

Bypass Facebook SSL pinning on Android devices.  
Supported ABIs: `x86`, `x86_64`, `armeabi-v7a`, `arm64-v8a`

## Patched APK (No Root)

[facebook-v373.0.0.31.112-x86](https://github.com/Eltion/Facebook-SSL-Pinning-Bypass/releases/download/v373.0.0.31.112/facebook-v373.0.0.31.112-x86.apk)

[facebook-v373.0.0.31.112-armeabi-v7a](https://github.com/Eltion/Facebook-SSL-Pinning-Bypass/releases/download/v373.0.0.31.112/facebook-v373.0.0.31.112-armeabi-v7a.apk)

[facebook-v373.0.0.31.112-arm64-v8a](https://github.com/Eltion/Facebook-SSL-Pinning-Bypass/releases/download/v373.0.0.31.112/facebook-v373.0.0.31.112-arm64-v8a.apk)

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
