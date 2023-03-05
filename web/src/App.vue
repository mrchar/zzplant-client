<script lang="ts" setup>

import {computed, ref} from "vue"
import {useDark} from "@vueuse/core"
import {Setting} from "@element-plus/icons-vue"
import {en, zhCn} from "element-plus/es/locale/index"
import {ElMessage} from "element-plus"
import I18n from "./components/I18n.vue"

const isDark = useDark()

const language = ref("zh-cn")

const locale = computed(() => {
  if (language.value === "zh-cn") return zhCn
  if (language.value === "en") return en
})


</script>

<template>
  <el-config-provider :locale="locale">
    <div class="w-screen h-screen overflow-hidden flex flex-col gap-2 bg-zinc-100">
      <div class="box-border p-4 w-full flex justify-between bg-white">
        <div>
          Logo
        </div>
        <div class="flex gap-4">
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
      <div class="flex-1 w-full h-96 max-w-7xl mx-auto bg-white">
        <router-view/>
      </div>
    </div>
  </el-config-provider>
</template>
