<script lang="ts" setup>
import {computed, ref} from "vue"
import api from "../api"
import {useShop} from "../store/shop"
import {Shop} from "../types"
import {useRouter} from "vue-router"
import {ElMessage} from "element-plus"
import ZzTitle from "../components/ZzTitle.vue"

const store = useShop()

const router = useRouter()

const shop = computed((): Shop => {
    if (store.selected) {
        return store.selected
    }
    return {address: "", code: "", company: "", name: "", owner: ""}
})

const name = ref("")
const price = ref<number | null>(0)

function onBalanceInputBlur() {
    if (price.value === null) {
        price.value = 0
    }
}

const addCommodity = () => {
    if (price.value === null) {
        ElMessage.warning("请输入价格")
        return
    }

    api.shop.addCommodity(shop.value.code, {name: name.value, price: price.value})
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
    <div class="max-w-lg w-full h-full mx-auto flex flex-col gap-4">
        <zz-title title="添加商品"/>
        <el-form size="large" label-position="top">
            <el-form-item label="名称">
                <el-input v-model="name"/>
            </el-form-item>
            <el-form-item label="价格">
                <el-input-number v-model.number="price"
                                 :max="9999999" :min="0"
                                 :precision="2"
                                 :value-on-clear="0"
                                 @focus="price=null"
                                 @blur="onBalanceInputBlur()"/>
            </el-form-item>
            <el-form-item>
                <el-button class="w-full" type="primary" @click="addCommodity">
                    添加
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>