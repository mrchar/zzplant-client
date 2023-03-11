<script lang="ts" setup>
import {computed, ref} from "vue"
import api, {AddCommodityParams} from "../api"
import {useShop} from "../store/shop"
import {Shop} from "../types"
import {useRouter} from "vue-router"
import {ElMessage} from "element-plus"

const store = useShop()

const router = useRouter()

const shop = computed((): Shop => {
  if (store.selected) {
    return store.selected
  }
  return {address: "", code: "", company: "", name: "", owner: ""}
})

const formData = ref<AddCommodityParams>({name: "", price: 0})

const addCommodity = () => {
  api.shop.addCommodity(shop.value.code, formData.value)
      .then(() => {
        router.push("/shops/detail")
      })
      .catch((err) => {
        ElMessage.error("添加商品失败")
        console.error("添加商品失败", err)
      })
}

</script>

<template>
  <div class="text-xl my-4">添加商品</div>
  <el-form label-position="top">
    <el-form-item label="名称">
      <el-input v-model="formData.name"/>
    </el-form-item>
    <el-form-item label="价格">
      <el-input v-model.number="formData.price"/>
    </el-form-item>
    <el-form-item>
      <el-button class="w-full" type="primary" @click="addCommodity">
        添加
      </el-button>
    </el-form-item>
  </el-form>
</template>