<script lang="ts" setup>
import {computed} from "vue"
import {useDark, useToggle} from "@vueuse/core"
import {useRouter} from "vue-router"
import {Moon, Setting, Sunny} from "@element-plus/icons-vue"
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

const router = useRouter()
</script>

<template>
  <div class="p-4 flex justify-between">
    <div v-if="shop" @click="router.push('/shop-accounts')">
      {{ shop.name }}
    </div>
    <div v-else @click="router.push('/shops')">
      未选择
    </div>
    <div class="flex gap-4">
      <el-icon size="1.25rem" @click="toggleDark()">
        <Moon v-show="isDark"/>
        <Sunny v-show="!isDark"/>
      </el-icon>
      <el-dropdown size="large">
        <el-icon size="1.25rem">
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
        <el-icon size="1.25rem">
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