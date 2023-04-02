<script lang="ts" setup>
import {computed, onBeforeMount, ref} from "vue"
import {useRoute, useRouter} from "vue-router"
import {Search} from "@element-plus/icons-vue"
import api from "../api"
import {ElMessage, ElMessageBox} from "element-plus"
import {Bill, Shop, ShopAccount} from "../types"
import ZzTitle from "../components/ZzTitle.vue"
import {useShop} from "../store/shop"

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
    return bills && bills.value.length > 0
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
            console.error("获取交易记录失败", err)
            ElMessage.error("获取交易记录失败")
        })
}

const pagination = ref({
    pageSize: 10,
    currentPage: 1,
    totalElements: 0,
})

const showTopUpDialog = ref(false)
const balanceToAdd = ref(0)

function topUp() {
    api.shop.topUp(shop.value.code, shopAccount.value.code, balanceToAdd.value)
        .then(res => {
            ElMessage.success("充值成功！")
            getShopAccount()
        })
        .catch(err => {
            ElMessage.error("充值失败！")
        })
        .finally(() => {
            showTopUpDialog.value = false
        })
}

function onClickAddBill() {
    api.shop.addBill(shop.value.code, shopAccount.value.code, new Map<string, number>())
        .then((res) => {
            router.push({name: "AddBill", query: {billCode: res.code}})
        })
        .catch((err) => {
            ElMessage.error("创建订单失败")
            console.error("创建订单失败", err)
        })
}

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
                    listBills()
                })
                .catch(err => {
                    ElMessage.error("删除失败")
                    console.error("删除失败", err)
                })
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
                    {{ shopAccount.name + (" " + nameSuffix.get(shopAccount.gender.toLowerCase()) || "") }}
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
                <el-button type="success" @click="showTopUpDialog=true">充值</el-button>
                <el-button type="primary" @click="onClickAddBill">开单</el-button>
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
        <el-empty v-if="!hasBills" description="还没有任何交易"></el-empty>
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
                        <el-button type="primary" @click="ElMessage('正在开发中...')">支付</el-button>
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
        <el-drawer v-model="showTopUpDialog" direction="btt" size="40%">
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
                <el-button type="primary" @click="topUp">处理</el-button>
                <el-button @click="showTopUpDialog=false">取消</el-button>
            </template>
        </el-drawer>
    </div>
</template>
