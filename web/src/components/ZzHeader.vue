<script lang="ts" setup>
import {computed} from "vue"
import {useDark, useToggle} from "@vueuse/core"
import {useRoute, useRouter} from "vue-router"
import {ArrowLeft, Moon, Setting, Sunny} from "@element-plus/icons-vue"
import I18n from "./I18n.vue"
import {useShop} from "../store/shop"
import {useLanguage} from "../store/language"
import {storeToRefs} from "pinia"

const isDark = useDark()
const toggleDark = useToggle(isDark)

const shopStore = useShop()
const shop = computed(() => {
  if (shopStore.selected) {
    return shopStore.selected
  }
  return null
})

const languageStore = useLanguage()
const {language} = storeToRefs(languageStore)

const route = useRoute()
const router = useRouter()

const isHomePage = computed(() => {
  if (route.path === "/shop-accounts") {
    return true
  }
  return false
})
</script>

<template>
  <div class="p-4 flex justify-between">
    <div class="flex gap-2">
      <el-icon v-if="!isHomePage" @click="router.go(-1)">
        <ArrowLeft/>
      </el-icon>
      <div v-if="shop" class="header-title" @click="router.push('/shop-accounts')">
        {{ shop.name }}
      </div>
      <div v-else class="header-title" @click="router.push('/shops')">
        未选择
      </div>
    </div>
    <div class="flex gap-4">
      <el-icon @click="toggleDark()">
        <Moon v-show="isDark"/>
        <Sunny v-show="!isDark"/>
      </el-icon>
      <el-dropdown size="large">
        <el-icon>
          <I18n/>
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
                :disabled="language==='ZhCN'"
                @click="languageStore.setLanguage('ZhCN')"
            >
              中文
            </el-dropdown-item>
            <el-dropdown-item
                :disabled="language==='EN'"
                @click="languageStore.setLanguage('EN')"
            >
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown size="large">
        <el-icon>
          <Setting/>
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="router.push('/shops/detail')">店铺设置</el-dropdown-item>
            <el-dropdown-item @click="router.push('/shops')">切换店铺</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-icon) {
  @apply text-xl leading-4;
}

.header-title {
  @apply text-xl leading-none;
}
</style>