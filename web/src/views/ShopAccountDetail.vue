<script lang="ts" setup>
import {computed, onBeforeMount, ref} from "vue"
import {useRoute, useRouter} from "vue-router"
import {Search} from "@element-plus/icons-vue"
import api from "../api"
import {ElMessage, ElMessageBox} from "element-plus"
import {Bill, Shop, ShopAccount} from "../types"
import ZzTitle from "../components/ZzTitle.vue"
import {useShop} from "../store/shop"
import TopUpButton from "../components/shop/TopUpButton.vue"
import AddBillButton from "../components/shop/AddBillButton.vue"

const nameSuffix = new Map([["male", "先生"], ["female", "女士"]])

const store = useShop()
const shop = computed((): Shop => {
    if (store.selected) {
        return store.selected
    }
    return {address: "", code: "", company: "", name: "", owner: ""}
})

const route = useRoute()
const router = useRouter()

const keyword = ref("")

const shopAccountCode = ref<string>("")
const shopAccount = ref<ShopAccount>({
    code: "",
    name: "",
    gender: "",
    phoneNumber: "",
    shop: "",
    balance: 0,
})

const getShopAccount = () => {
    api.shop.getShopAccount(shop.value.code, shopAccountCode.value)
        .then((res) => {
            if (res) {
                shopAccount.value = res
            }
        })
}

const bills = ref<Bill[]>([])

const hasBills = computed((): boolean => {
    return bills.value && bills.value.length > 0
})

const listBills = () => {
    api.shop.listBillsOfShopAccount(shop.value.code, shopAccountCode.value)
        .then((res) => {
            bills.value = res.content.map(item => {
                item.createDateTime = new Date(item.createDateTime)
                return item
            })
            pagination.value.totalElements = res.totalElements
        })
        .catch((err) => {
            console.error("获取订单记录失败", err)
            ElMessage.error("获取订单记录失败")
        })
}

const pagination = ref({
    pageSize: 10,
    currentPage: 1,
    totalElements: 0,
})

function onClickDelete(billCode: string) {
    ElMessageBox.confirm("当前操作无法撤销，确定要删除这个订单吗", "确定要删除这个订单吗？",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "error",
        })
        .then(() => {
            api.shop.deleteBill(shop.value.code, billCode)
                .then(() => {
                    ElMessage.success("删除成功！")
                })
                .catch(err => {
                    ElMessage.error("删除失败")
                    console.error("删除失败", err)
                })
                .finally(() => [
                    listBills(),
                ])
        })

}

onBeforeMount(() => {
    const code = route.query.code as string

    if (!code) {
        ElMessage.error("缺少会员参数")
        router.push("/shop-accounts")
        return
    }

    shopAccountCode.value = code
    getShopAccount()
    listBills()
})

</script>

<template>
    <div class="w-full h-full flex flex-col gap-2">
        <div class="w-full">
            <zz-title title="会员信息">
                <template #extra>
                    <el-button link @click="ElMessage('正在开发中...')">更多</el-button>
                </template>
            </zz-title>
            <el-descriptions :column="1">
                <el-descriptions-item label="称呼">
                    {{ shopAccount.name + " " + (nameSuffix.get(shopAccount.gender.toLowerCase()) || "") }}
                </el-descriptions-item>
                <el-descriptions-item label="手机号码">
                    {{ shopAccount.phoneNumber }}
                </el-descriptions-item>
                <el-descriptions-item label="账户余额">
                    <el-button link @click="()=>{ElMessage.info('正在开发中...')}">
                        {{ "￥" + shopAccount.balance }}
                    </el-button>
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <zz-title title="消费记录">
            <template #extra>
                <top-up-button :shop-code="shop.code"
                               :shop-account-code="shopAccountCode"
                               @success="getShopAccount()"/>
                <add-bill-button :shop-code="shop.code"
                                 :shop-account-code="shopAccountCode"/>
            </template>
        </zz-title>
        <el-input
                v-model="keyword"
                placeholder="输入消费日期或订单号搜索"
                size="large"
                class="max-w-lg"
                @keyup.enter="ElMessage('正在开发中...')"
        >
            <template #append>
                <el-button :icon="Search" @click="ElMessage('正在开发中...')"/>
            </template>
        </el-input>
        <el-empty v-if="!hasBills" description="还没有任何订单"/>
        <div class="flex-1 overflow-y-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-start">
                <el-card v-for="bill in bills">
                    <el-descriptions :column="1">
                        <el-descriptions-item label="订单号:">
                            {{ bill.code }}
                        </el-descriptions-item>
                        <el-descriptions-item label="商品列表:">
                            {{ bill.commodities[0] ? bill.commodities[0].name + "..." : "暂无" }}
                        </el-descriptions-item>
                        <el-descriptions-item label="创建时间:">
                            {{ bill.createDateTime.toLocaleString() }}
                        </el-descriptions-item>
                        <el-descriptions-item label="金额:">
                            ￥ {{ bill.amount }}
                        </el-descriptions-item>
                    </el-descriptions>
                    <div class="text-right">
                        <el-button
                                v-if="!bill.transaction" type="primary"
                                @click="router.push({name:'AddBill', query:{billCode:bill.code}})"
                        >
                            处理
                        </el-button>
                        <el-button type="danger" @click="onClickDelete(bill.code)">删除</el-button>
                    </div>
                </el-card>
            </div>
        </div>
        <el-pagination
                background
                v-model:page-size="pagination.pageSize"
                v-model:current-page="pagination.currentPage"
                :total="pagination.totalElements"
                layout="prev, pager, next, jumper, ->, total"
                @current-change="listBills"
                @size-change="listBills"
        >
        </el-pagination>
    </div>
</template>
