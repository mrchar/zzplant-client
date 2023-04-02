<script lang="ts" setup>
import {onMounted, ref} from "vue"
import {useRouter} from "vue-router"
import {ElMessage} from "element-plus"
import api from "../api"
import {AddShopAccountParams} from "../api/shop"
import {useShop} from "../store/shop"

const router = useRouter()

const store = useShop()

const addForm = ref<AddShopAccountParams>({
    name: "",
    gender: "unknown",
    phoneNumber: "",
    balance: 0,
})

const addAccount = () => {
    if (!store.selected) {
        ElMessage.error("请先选择店铺！")
        return
    }

    const addShopAccountParams: AddShopAccountParams = {
        name: addForm.value.name,
        gender: addForm.value.gender,
        phoneNumber: addForm.value.phoneNumber,
        balance: Number(addForm.value.balance), // 引入ElInput只能写入字符串，需要转换为数字
    }

    api.shop.addShopAccount(store.selected.code, addShopAccountParams)
        .then((res) => {
            router.push(`/shop-accounts/detail?shop=${res.shop}&code=${res.code}`)
        })
        .catch(error => {
            console.error("添加账户失败", error)
            ElMessage({message: "添加账户失败", type: error})
        })
}

onMounted(() => {
    if (!store.selected) {
        ElMessage.error("请先选择店铺！")
        router.push("/shops")
    }
})
</script>

<template>
    <div class="max-w-lg w-full h-full mx-auto box-border p-6 pr-12">
        <div class="text-xl my-4">添加会员</div>
        <el-form class="max-w-lg mx-auto" label-position="top" label-suffix=":">
            <el-form-item label="称呼">
                <el-input v-model="addForm.name" placeholder="请输入会员姓名">
                </el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio-group v-model="addForm.gender">
                    <el-radio label="male">先生</el-radio>
                    <el-radio label="female">女士</el-radio>
                    <el-radio label="unknown">不愿透露</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="手机号码">
                <el-input v-model="addForm.phoneNumber" placeholder="请输入会员手机号码">
                    <template #prepend>
                        <el-select class="w-20" model-value="+86">
                            <el-option value="+86">+86</el-option>
                        </el-select>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="初始额度">
                <el-input v-model="addForm.balance" placeholder="请输入创建会账户初始额度">
                    <template #prepend>
                        <div class="w-10">￥</div>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="addAccount" type="primary">添加</el-button>
                <el-button @click="router.push('/shop-accounts')">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>