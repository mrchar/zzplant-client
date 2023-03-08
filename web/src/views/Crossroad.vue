<script lang="ts" setup>
import {useShop} from "../store/shop"
import api from "../api"
import {useRouter} from "vue-router"
import {ElMessage} from "element-plus"
import {onMounted, ref} from "vue"

const store = useShop()
const router = useRouter()

const loading = ref(true)

onMounted(() => {
  // 如果当前没有选择店铺
  api.shop.listShops()
      .then(res => {
        if (res.empty) {
          // 还没有创建店铺，跳转到新增页面
          store.selectShop(null)
          router.push("/shops/add")
          return
        }

        // 更新商铺列表
        const shops = res.content
        store.setShops(shops)

        // 如果没有选择商铺，跳转到商铺选择页面
        const selected = store.selected
        if (selected == null) {
          router.push("/shops/select")
          return
        }

        // 查找商铺信息
        const refreshed = shops.find(shop => shop.code === selected.code)
        if (!refreshed) {
          store.selectShop(null)
          router.push("/shop/select")
          return
        }

        // 如果商铺信息存在，更新商铺信息
        store.selectShop(refreshed)
        router.push("/shop-accounts")
      })
      .catch((err) => {
        console.error("获取商铺列表失败", err)
        ElMessage.error("获取商铺列表失败，可以重新登录后再次尝试")
      })
      .finally(() => {
        loading.value = false
      })
})
</script>

<template>
  <div v-loading.fullscreen="loading">
  </div>
</template>