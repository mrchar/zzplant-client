<script lang="ts" setup>
import {useShop} from "../store/shop"
import {storeToRefs} from "pinia"
import {useRouter} from "vue-router"
import {Shop} from "../types"

const store = useShop()
const router = useRouter()

const {shops} = storeToRefs(store)

if (!store.shops || store.shops.length === 0) {
  router.push("/crossroad")
}

const onSelectShop = (shop: Shop) => {
  store.selectShop(shop)
  router.push("/crossroad")
}

</script>

<template>
  <div class="px-8 py-16 flex flex-col gap-2 overflow-y-auto">
    <el-button
        class="w-full"
        size="large"
        v-for="shop in shops"
        :key="shop.code"
        @click="onSelectShop(shop)"
    >
      {{ shop.name }}
    </el-button>
    <el-button class="w-full" size="large" @click="router.push('/shops/add')">
      新增
    </el-button>
  </div>
</template>

<style scoped>
.el-button + .el-button {
  margin-left: 0px;
}
</style>