//https://github.com/Eltion/Facebook-SSL-Pinning-Bypass
'use strict'

function hook_proxygen_SSLVerification(library) {
    const functionName = "_ZN8proxygen15SSLVerification17verifyWithMetricsEbP17x509_store_ctx_stRKNSt6__ndk212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPNS0_31SSLFailureVerificationCallbacksEPNS0_31SSLSuccessVerificationCallbacksERKNS_15TimeUtilGenericINS3_6chrono12steady_clockEEERNS_10TraceEventE";
    try {
        const f = Module.getExportByName(library.name, functionName);
        Interceptor.attach(f, {
            onLeave: function (retvalue) {
                retvalue.replace(1);
            }
        });
        logger(`[*][+] Hooked function: ${functionName}`);
    } catch (err) {
        logger(`[*][-] Failed tp hook function: ${functionName}`);
        logger(err.toString())
    }

}

function waitForModules(modules) {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            for (const m of modules) {
                const module = Process.findModuleByName(m);
                if (module != null) {
                    clearInterval(interval);
                    resolve(module);
                }
            }
        }, 300);
    });
}

function logger(message) {
    console.log(message);
    Java.perform(function () {
        var Log = Java.use("android.util.Log");
        Log.v("FACEBOOK_SSL_PINNING_BYPASS", message);
    });
}

const libs = ["libcoldstart.so", "libliger-native.so"]

logger("[*][*] Waiting for library...");
waitForModules(libs).then((lib) => {
    logger(`[*][+] Found ${lib.name} at: ${lib.base}`)
    hook_proxygen_SSLVerification(lib);
});

//Universal Android SSL Pinning Bypass #2
Java.perform(function () {
    try {
        var array_list = Java.use("java.util.ArrayList");
        var ApiClient = Java.use('com.android.org.conscrypt.TrustManagerImpl');
        if (ApiClient.checkTrustedRecursive) {
            logger("[*][+] Hooked checkTrustedRecursive")
            ApiClient.checkTrustedRecursive.implementation = function (a1, a2, a3, a4, a5, a6) {
                var k = array_list.$new();
                return k;
            }
        } else {
            logger("[*][-] checkTrustedRecursive not Found")
        }
    } catch(e) {
        logger("[*][-] Failed to hook checkTrustedRecursive")
    }
});