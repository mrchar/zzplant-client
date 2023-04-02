<script lang="ts" setup>
import {useShop} from "../store/shop"
import {storeToRefs} from "pinia"
import {useRouter} from "vue-router"
import {Shop} from "../types"
import {onMounted, ref} from "vue"
import {Search} from "@element-plus/icons-vue"
import api from "../api"

const store = useShop()
const router = useRouter()

const keyword = ref("")

const {shops} = storeToRefs(store)

const listShops = () => {
    if (!store.shops || store.shops.length === 0) {
        api.shop.listShops()
            .then(res => {
                if (res.empty) {
                    router.push("/shops/add")
                    return
                }

                const shops = res.content
                store.setShops(shops)
            })
    }
}

const onSelectShop = (shop: Shop) => {
    store.selectShop(shop)
    router.push("/crossroad")
}

onMounted(() => {
    listShops()
})
</script>

<template>
    <div class="w-full h-full flex flex-col gap-4">
        <div class="flex gap-2 justify-between">
            <el-input
                    v-model="keyword"
                    placeholder="输入名称或手机号码进行搜索"
                    size="large"
                    class="max-w-lg"
                    @keyup.enter="listShops()"
            >
                <template #append>
                    <el-button @click="listShops()" :icon="Search"/>
                </template>
            </el-input>
            <el-button size="large" type="primary" @click="router.push('/shops/add')">
                添加
            </el-button>
        </div>
        <div class="flex-1 flex flex-col gap-4 overflow-y-auto">
            <el-card
                    v-for="shop in shops"
                    :key="shop.code"
                    @click="onSelectShop(shop)"
            >
                <el-descriptions :column="1">
                    <el-descriptions-item label="名称:">
                        {{ shop.name }}
                    </el-descriptions-item>
                    <el-descriptions-item label="地址:">
                        {{ shop.address }}
                    </el-descriptions-item>
                </el-descriptions>
            </el-card>
        </div>
    </div>
</template>

<style scoped>
.el-button + .el-button {
    margin-left: 0px;
}
</style>