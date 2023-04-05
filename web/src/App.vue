<script lang="ts" setup>
import {storeToRefs} from "pinia"
import {useLanguage} from "./store/language"
import ZzHeader from "./components/ZzHeader.vue"
import "element-plus/theme-chalk/dark/css-vars.css"
import VConsole from "vconsole"

const store = useLanguage()

const {locale} = storeToRefs(store)

const vConsole = new VConsole()

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
