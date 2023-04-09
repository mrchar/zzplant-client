<script lang="ts" setup>
import {ShoppingCart, ShoppingCartFull} from "@element-plus/icons-vue"
import ZzTitle from "../components/ZzTitle.vue"
import {useCommodity} from "../composables/commodity"
import {computed, onBeforeMount, onMounted, ref} from "vue"
import {useShop} from "../store/shop"
import {useRoute, useRouter} from "vue-router"
import {storeToRefs} from "pinia"
import {BillCommodity, Commodity} from "../types"
import {ElMessage} from "element-plus"
import api from "../api"

const route = useRoute()

const router = useRouter()

const billCode = ref("")

const billCommodities = ref<BillCommodity[]>([])

function getBillCommodityQuantity(code: string): number {
    const billCommodity = billCommodities.value.find(item => item.code === code)
    if (billCommodity) {
        return billCommodity.quantity
    }

    return 0
}

function setBillCommodityQuantity(code: string, quantity: number) {
    if (quantity < 0) {
        quantity = 0
    }

    let billCommodity = billCommodities.value.find(item => item.code === code)
    if (!billCommodity) {
        const commodity = commodities.value.find(item => item.code === code) as Commodity
        billCommodity = {...commodity, amount: 0, quantity: 0}
        billCommodities.value.push(billCommodity)
    }

    billCommodity.quantity = quantity
    billCommodity.amount = billCommodity.price * billCommodity.quantity

    // 移除所有数量为0的商品
    billCommodities.value = billCommodities.value.filter(item => item.quantity !== 0)
}

const {shop} = storeToRefs(useShop())

const {keyword, pagination, commodities, listCommodities} = useCommodity(shop)


const amount = computed(() => {
    return billCommodities.value
        .map(item => item.amount)
        .reduce((total, amount) => total + amount, 0)
})

const showPaymentDialog = ref(false)

function onClickSubmit() {
    api.shop.pay(shop.value.code, billCode.value, billCommodities.value, amount.value)
        .then(() => {
            showPaymentDialog.value = false
            router.go(-1)
        })
        .catch(err => {
            ElMessage.error("支付失败")
        })
}

function onClickDelete() {
    api.shop.deleteBill(shop.value.code, billCode.value)
        .then(() => {
            ElMessage.success("删除成功！")
            router.go(-1)
        })
        .catch(err => {
            ElMessage.error("删除失败")
            console.error("删除失败", err)
        })
}

onBeforeMount(() => {
    billCode.value = route.query.billCode as string
    if (!billCode) {
        ElMessage.error("缺少订单参数")
        return
    }

    api.shop.getBill(shop.value.code, billCode.value)
        .then(res => {
            billCommodities.value = res.commodities
        })
})

onMounted(() => {
    listCommodities()
})

</script>
<template>
    <div class="w-full h-full flex flex-col gap-4">
        <zz-title title="开单"/>
        <div class="flex-1 overflow-y-auto">
            <div class="flex flex-col gap-2">
                <el-card v-for="commodity in commodities" :key="commodity.code">
                    <el-descriptions :title="commodity.name" :extra="commodity.code" :column="2">
                        <el-descriptions-item label="编号:">{{ commodity.code }}</el-descriptions-item>
                        <el-descriptions-item label="名称:">{{ commodity.name }}</el-descriptions-item>
                        <el-descriptions-item label="价格:">￥{{ commodity.price }}</el-descriptions-item>
                    </el-descriptions>
                    <el-form>
                        <el-form-item label="数量:">
                            <div class="absolute right-0">
                                <el-input-number
                                        :model-value="getBillCommodityQuantity(commodity.code)"
                                        @change="(number:number)=>{setBillCommodityQuantity(commodity.code, number)}"
                                />
                            </div>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
        </div>
        <el-pagination
                background
                v-model:page-size="pagination.pageSize"
                v-model:current-page="pagination.currentPage"
                :total="pagination.totalElements"
                layout="prev, pager, next, jumper, ->, total"
                @size-change="listCommodities()"
                @current-change="listCommodities()">
        </el-pagination>
        <div class="mt-4 flex justify-between items-center">
            <div class="flex gap-6">
                <el-icon class="shopping-cart">
                    <ShoppingCart v-if="billCommodities.length===0"/>
                    <ShoppingCartFull v-else/>
                </el-icon>
                <div class="text-2xl">
                    ￥{{ amount }}
                </div>
            </div>
            <div>
                <el-button size="large" @click="onClickDelete()">删除</el-button>
                <el-button
                        size="large"
                        type="primary"
                        :disabled="billCommodities.length===0"
                        @click="showPaymentDialog = true"
                >
                    开单
                </el-button>
            </div>
        </div>
        <el-drawer v-model="showPaymentDialog" direction="btt" size="50%">
            <template #header>
                <zz-title title="开单"/>
            </template>
            <el-table :data="billCommodities">
                <el-table-column label="名称" prop="name"/>
                <el-table-column label="单价" prop="price"/>
                <el-table-column label="小计" prop="amount"/>
            </el-table>
            <template #footer>
                <div class="w-full flex justify-between items-center">
                    <div class="text-2xl">总价：￥{{ amount }}</div>
                    <el-button size="large" type="primary" @click="onClickSubmit">
                        确认
                    </el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<style scoped>
.shopping-cart {
    font-size: 32px;
}

:deep(.el-table) {
    @apply text-base;
}
</style>