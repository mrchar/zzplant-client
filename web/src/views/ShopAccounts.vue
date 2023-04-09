<script lang="ts" setup>
import {computed, onMounted, ref} from "vue"
import {Search} from "@element-plus/icons-vue"
import {useRouter} from "vue-router"
import api from "../api"
import {useShop} from "../store/shop"
import {ShopAccount} from "../types"
import ZzTitle from "../components/ZzTitle.vue"
import {ApiError} from "../api/base"
import TopUpButton from "../components/shop/TopUpButton.vue"
import AddBillButton from "../components/shop/AddBillButton.vue"

const store = useShop()

const router = useRouter()

const keyword = ref("")

const shopCode = computed((): string => {
    if (store.selected) {
        return store.selected.code
    }
    return ""
})

const accounts = ref<Array<ShopAccount>>([])

const hasAccounts = computed(() => {
    return accounts.value != null && accounts.value.length !== 0
})

const pagination = ref({
    pageSize: 10,
    currentPage: 1,
    totalElements: 0,
})

const listShopAccounts = () => {
    api.shop.listShopAccounts(shopCode.value, keyword.value)
        .then(res => {
            accounts.value = res.content
            pagination.value.totalElements = res.totalElements
        })
        .catch(error => {
            if (error instanceof ApiError && error.message === "读取用户信息失败") {
                router.push("/shops/add")
                return
            }

            throw error
        })
}

function toDetails(account: ShopAccount) {
    router.push(`/shop-accounts/detail?shop=${account.shop}&code=${encodeURI(account.code)}`)
}

onMounted(() => {
    if (!store.selected) {
        router.push("/shops")
        return
    }

    listShopAccounts()
})
</script>

<template>
    <div class="w-full h-full flex flex-col justify-start gap-4">
        <!--Header-->
        <zz-title title="会员列表"/>
        <div class="flex gap-4 justify-between">
            <el-input
                    v-model="keyword"
                    placeholder="输入名称或手机号码进行搜索"
                    size="large"
                    class="max-w-lg"
                    @keyup.enter="listShopAccounts()"
            >
                <template #append>
                    <el-button @click="listShopAccounts()" :icon="Search"/>
                </template>
            </el-input>
            <el-button type="primary" size="large" @click="router.push('/shop-accounts/add')">添加</el-button>
        </div>
        <el-empty
                v-if="!hasAccounts"
                description="点击按钮添加会员"
        />
        <!--List-->
        <div class="flex-1 overflow-y-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-start">
                <el-card v-for="account in accounts" :key="account.code" @click="toDetails(account)">
                    <el-descriptions :title="account.name" :extra="account.code" :column="2">
                        <el-descriptions-item label="手机号码:">
                            {{ account.phoneNumber.replace(/(\d{3})(\d{4})(\d+)/, "$1****$3") }}
                        </el-descriptions-item>
                        <el-descriptions-item label="余额:">
                            {{ `￥${account.balance}` }}
                        </el-descriptions-item>
                    </el-descriptions>
                    <div class="flex justify-end">
                        <top-up-button :shop-code="shopCode"
                                       :shop-account-code="account.code"
                                       @success="listShopAccounts()"/>
                        <add-bill-button :shop-code="shopCode"
                                         :shop-account-code="account.code"/>
                    </div>
                </el-card>
            </div>
        </div>
        <!--Pagination-->
        <el-pagination
                background
                v-model:page-size="pagination.pageSize"
                v-model:current-page="pagination.currentPage"
                :total="pagination.totalElements"
                layout="prev, pager, next, jumper, ->, total"
                @size-change="listShopAccounts()"
                @current-change="listShopAccounts()">
        </el-pagination>
    </div>
</template>