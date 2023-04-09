<script lang="ts" setup>
import api from "../../api"
import {ElMessage} from "element-plus"
import {useRouter} from "vue-router"

const router = useRouter()

const {shopCode, shopAccountCode} = defineProps({
    shopCode: {type: String, required: true},
    shopAccountCode: {type: String, required: true},
})

function onClickAddBill() {
    api.shop.addBill(shopCode, shopAccountCode, [])
        .then((res) => {
            router.push({name: "AddBill", query: {billCode: res.code}})
        })
        .catch((err) => {
            ElMessage.error("创建订单失败")
            console.error("创建订单失败", err)
        })
}
</script>

<template>
    <el-button type="primary" @click="onClickAddBill">开单</el-button>
</template>