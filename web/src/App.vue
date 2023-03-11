<script lang="ts" setup>
import {storeToRefs} from "pinia"
import {useLanguage} from "./store/language"
import ZzHeader from "./components/ZzHeader.vue"
import "element-plus/theme-chalk/dark/css-vars.css"

const store = useLanguage()

const {locale} = storeToRefs(store)

</script>

<template>
  <el-config-provider :locale="locale">
    <div class="full-screen flex flex-col gap-2">
      <zz-header/>
      <main class="content-container">
        <router-view/>
      </main>
    </div>
  </el-config-provider>
</template>

<style scoped>
.full-screen {
  @apply w-screen h-screen overflow-hidden;
}

.content-container {
  @apply flex-1 max-w-7xl w-full h-full mx-auto p-4 overflow-hidden;
}
</style>
