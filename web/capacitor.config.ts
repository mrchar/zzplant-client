import {CapacitorConfig} from "@capacitor/cli"

const config: CapacitorConfig = {
    appId: "net.mrchar.zzplant",
    appName: "发财树",
    webDir: "dist",
    bundledWebRuntime: false,
    android: {
        path: "../android",
    },
    ios: {
        path: "../ios",
    },
}

export default config
