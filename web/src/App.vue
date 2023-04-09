<script lang="ts" setup>
import {storeToRefs} from "pinia"
import {useLanguage} from "./store/language"
import ZzHeader from "./components/ZzHeader.vue"
import "element-plus/theme-chalk/dark/css-vars.css"
import VConsole from "vconsole"
import {App} from "@capacitor/app"
import {useRouter} from "vue-router"
import {ElMessage} from "element-plus"

const store = useLanguage()
const router = useRouter()

const {locale} = storeToRefs(store)

let canExit = false
App.addListener("backButton", (canGoBack) => {
    // 如果可以返回上一下
    if (canGoBack) {
        return router.back()
    }

    // 不过不能退出App，修改标记并提示
    if (!canExit) {
        canExit = true
        ElMessage("再次点击返回键退出应用!")

        setTimeout(() => {
            canExit = false
        }, 500)
        return
    }

    if (canExit) {
        App.exitApp()
    }
})
if (!import.meta.env.PROD) {
    const vConsole = new VConsole()
}

</script>

<template>
    <el-config-provider :locale="locale">
        <div class="full-screen flex flex-col gap-2">
            <zz-header class="max-w-7xl w-full mx-auto"/>
            <main class="content-container">
                <router-view/>
            </main>
        </div>
    </el-config-provider>
</template>

<style scoped>
.full-screen {
    @apply w-screen h-screen p-2 overflow-hidden;
}

.content-container {
    @apply flex-1 max-w-7xl w-full h-full mx-auto p-2 overflow-hidden;
}

:deep(.el-drawer__header) {
    margin-bottom: 0;
}
</style>
