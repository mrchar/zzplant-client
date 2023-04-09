<script lang="ts" setup>
import {ref} from "vue"
import api from "../../api"
import {ElMessage} from "element-plus"
import ZzTitle from "../ZzTitle.vue"

const {shopCode, shopAccountCode} = defineProps({
    shopCode: {type: String, required: true},
    shopAccountCode: {type: String, required: true},
})

const emits = defineEmits(["success"])

const showTopUpDialog = ref(false)
const balanceToAdd = ref(0)

function topUp() {
    api.shop.topUp(shopCode, shopAccountCode, balanceToAdd.value)
        .then(res => {
            ElMessage.success("充值成功！")
            emits("success")
        })
        .catch(err => {
            ElMessage.error("充值失败！")
        })
        .finally(() => {
            showTopUpDialog.value = false
        })
}
</script>

<template>
    <el-button type="success" @click.stop="showTopUpDialog=true">充值</el-button>
    <el-drawer v-model="showTopUpDialog" direction="btt" size="40%" :append-to-body="true">
        <template #header>
            <zz-title title="充值"/>
        </template>
        <el-form label-width="60" label-position="top">
            <el-form-item label="金额">
                <el-input v-model="balanceToAdd">
                    <template #prefix>
                        ￥
                    </template>
                </el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="topUp()">充值</el-button>
            <el-button @click="showTopUpDialog=false">取消</el-button>
        </template>
    </el-drawer>
</template>