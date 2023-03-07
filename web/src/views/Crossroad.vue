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
  if (store.selected != null) {
    router.push("/accounts")
    return
  }

  // 如果当前没有选择店铺
  api.shop.getShop()
      .then(res => {
        if (!res.empty) {
          store.setShops(res.content)
          router.push("/shops/select")
          return
        }

        // 还没有创建店铺，跳转到新增页面
        router.push("/shops/add")
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