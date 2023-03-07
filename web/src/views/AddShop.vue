<script lang="ts" setup>
import {ref} from "vue"
import {useRouter} from "vue-router"
import {ElMessage} from "element-plus"
import api, {AddShopParams} from "../api"
import {useShop} from "../store/shop"

const store = useShop()

const router = useRouter()

const addForm = ref<AddShopParams>({
  name: "",
  address: "",
})

const addAccount = () => {
  api.shop.addShop(addForm.value)
      .then((added) => {
        store.selectShop(added)
        router.push("/crossroad")
      })
      .catch(error => {
        console.error("创建店铺失败", error)
        ElMessage({message: "添加店铺失败", type: error})
      })
}
</script>

<template>
  <div class="w-full h-full box-border p-6 pr-12 flex flex-col gap-6">
    <div class="max-w-lg mx-auto font-bold">请创建店铺</div>
    <div class="max-w-lg pl-8 pr-4 mx-auto text-center">
      在开始一切之前，您必须先创建店铺，随后不断为您的店铺添加会员。
    </div>
    <el-form class="max-w-lg mx-auto" label-width="100px">
      <el-form-item label="店铺名称">
        <el-input v-model="addForm.name" placeholder="请输入店铺的名字"/>
      </el-form-item>
      <el-form-item label="所在地址">
        <el-input v-model="addForm.address" type="textarea" placeholder="请输入店铺所在的地址"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addAccount">创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>