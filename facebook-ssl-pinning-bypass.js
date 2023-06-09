//https://github.com/Eltion/Facebook-SSL-Pinning-Bypass
'use strict'

function patch_x86(library) {
    let found = false;
    const pattern = "74 ?? 8b ?? d4 01 00 00";
    Memory.scan(library.base, library.size, pattern, {
        onMatch(address, size) {
            found = true;
            Memory.patchCode(address, 1, code => {
                const cw = new X86Writer(code);
                cw.putBytes([0x75]);
                cw.flush();
            });
            logger(`[*][+] Patched libcoldstart.so`);
            return 'stop';
        },
        onComplete() {
            if (!found) {
                logger(`[*][-] Failed to find pattern: ${pattern}`);
            }
        }
    });
}

function patch_arm(library) {
    let found = false;
    const pattern = "84 b1 ?? f8 dc 01";
    Memory.scan(library.base, library.size, pattern, {
        onMatch(address, size) {
            found = true;
            Memory.patchCode(address, 4, code => {
                const cw = new ArmWriter(code);
                cw.putBytes([0x84, 0xb9, 0x95, 0xf8 ]);
                cw.flush();
            });
            logger(`[*][+] Patched libcoldstart.so`);
            //return 'stop';
        },
        onComplete() {
            if (!found) {
                logger(`[*][-] Failed to find pattern: ${pattern}`);
            }
        }
    });
}

function patch_arm64(library) {
    let found = false;
    const pattern = "ff ff 01 a9 ?? ?? 00 b4 80 82 4c 39";
    Memory.scan(library.base, library.size, pattern, {
        onMatch(address, size) {
            found = true;
            Memory.patchCode(address, 12, code => {
                console.log(address.readByteArray(16));
                const cw = new Arm64Writer(code);
                cw.skip(6);
                cw.putBytes([0x00, 0xb5, 0x80, 0x82]);
                cw.flush();
            });
            logger(`[*][+] Patched libcoldstart.so`);
            return 'stop';
        },
        onComplete() {
            if (!found) {
                logger(`[*][-] Failed to find pattern: ${pattern}`);
            }
        }
    });
}

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

const libs = ["libcoldstart_1.so","libcoldstart.so", "libliger-native.so"]

logger("[*][*] Waiting for library...");
waitForModules(libs).then((lib) => {
    logger(`[*][+] Found ${lib.name} at: ${lib.base}`)
    hook_proxygen_SSLVerification(lib);
    if (Process.arch == "arm64") {
        patch_arm64(lib)
    } else if (Process.arch == "ia32") {
        patch_x86(lib)
    } else if (Process.arch == "arm") {
        patch_arm(lib);
    }
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
    } catch (e) {
        logger("[*][-] Failed to hook checkTrustedRecursive")
    }
});
