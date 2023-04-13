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
const balanceToAdd = ref<number | null>(0)

function onInputBlur() {
    if (balanceToAdd.value === null) {
        balanceToAdd.value = 0
    }
}

function topUp() {
    if (!balanceToAdd.value) {
        ElMessage.warning("请输入充值的金额")
        return
    }

    api.shop.topUp(shopCode, shopAccountCode, balanceToAdd.value)
        .then(res => {
            balanceToAdd.value = 0
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
        <el-form label-width="60">
            <el-form-item size="large" label="金额：">
                <el-input-number size="large"
                                 v-model="balanceToAdd"
                                 :max="9999999" :min="0"
                                 :precision="2"
                                 :value-on-clear="0"
                                 @focus="balanceToAdd=null"
                                 @blur="onInputBlur()"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button size="large" type="primary" @click="topUp()">充值</el-button>
            <el-button size="large" @click="showTopUpDialog=false">取消</el-button>
        </template>
    </el-drawer>
</template>