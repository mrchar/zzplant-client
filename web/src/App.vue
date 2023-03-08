<script lang="ts" setup>

import {computed, ref} from "vue"
import {useDark, useToggle} from "@vueuse/core"
import {Moon, Setting, Sunny} from "@element-plus/icons-vue"
import {en, zhCn} from "element-plus/es/locale/index"
import {ElMessage} from "element-plus"
import I18n from "./components/I18n.vue"
import "element-plus/theme-chalk/dark/css-vars.css"
import {useShop} from "./store/shop"
import {useRouter} from "vue-router"

const store = useShop()
const shop = computed(() => {
  if (store.selected) {
    return store.selected
  }
  return null
})

const router = useRouter()

const isDark = useDark()
const toggleDark = useToggle(isDark)

const language = ref("zh-cn")

const locale = computed(() => {
  if (language.value === "zh-cn") return zhCn
  if (language.value === "en") return en
})
</script>

<template>
  <el-config-provider :locale="locale">
    <div class="w-screen h-screen overflow-hidden flex flex-col gap-2">
      <div class="box-border p-4 w-full flex justify-between">
        <div v-if="shop">
          {{ shop.name }}
        </div>
        <el-button v-else link @click="router.push('/shops/select')">
          选择商铺
        </el-button>
        <div class="flex gap-4">
          <el-icon class="text-2xl text-zinc-800" @click="toggleDark()">
            <Moon v-show="isDark"/>
            <Sunny v-show="!isDark"/>
          </el-icon>
          <el-dropdown size="large">
            <el-icon class="text-2xl text-zinc-800">
              <I18n/>
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                    :disabled="language==='zh-cn'"
                    @click="language='zh-cn'"
                >
                  中文
                </el-dropdown-item>
                <el-dropdown-item
                    :disabled="language==='en'"
                    @click="language='en'"
                >
                  English
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown size="large">
            <el-icon class="text-2xl text-zinc-800">
              <Setting/>
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="ElMessage('正在开发中...')">店铺设置</el-dropdown-item>
                <el-dropdown-item @click="ElMessage('正在开发中...')">切换店铺</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="flex-1 w-full h-96 max-w-7xl mx-auto">
        <router-view/>
      </div>
    </div>
  </el-config-provider>
</template>
