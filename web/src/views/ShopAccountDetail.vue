<script lang="ts" setup>
import {computed, onBeforeMount, ref} from "vue"
import {useRoute, useRouter} from "vue-router"
import {Search} from "@element-plus/icons-vue"
import api from "../api"
import {ElMessage} from "element-plus"
import {Invoice, Shop, ShopAccount} from "../types"
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

const invoices = ref<Invoice[]>([])

const hasInvoices = computed((): boolean => {
  if (invoices && invoices.value.length > 0) {
    return true
  }
  return false
})

const listInvoices = () => {
  api.shop.listInvoices(shop.value.code, shopAccountCode.value)
      .then((res) => {
        invoices.value = res.content
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

const showAddCreditsDialog = ref(false)
const balanceToAdd = ref(0)


const showConsumeDialog = ref(false)
const balanceToPay = ref(0)

onBeforeMount(() => {
  const code = route.query.code as string

  if (!code) {
    ElMessage.error("缺少会员参数")
    router.push("/shop-accounts")
    return
  }

  shopAccountCode.value = code
  getShopAccount()
  listInvoices()
})

</script>

<template>
  <div class="w-full h-full flex flex-col gap-2">
    <div class="w-full">
      <zz-title title="会员信息">
        <template #extra>
          <el-button type="success" @click="showAddCreditsDialog=true">充值</el-button>
          <el-button type="primary" @click="showConsumeDialog=true">消费</el-button>
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
          {{ "￥" + shopAccount.balance }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <zz-title title="账单记录"/>
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
    <el-empty v-if="!hasInvoices" description="还没有任何交易"></el-empty>
    <div class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-start">
        <el-card v-for="invoice in invoices">
          <el-descriptions :title="invoice.code" :extra="invoice.datetime">
            <el-descriptions-item label="类型">
              {{ invoice.amount > 0 ? "充值" : "消费" }}
            </el-descriptions-item>
            <el-descriptions-item label="金额(￥)">
              {{ invoice.amount }}
            </el-descriptions-item>
            <el-descriptions-item label="余额(￥)">
              {{ invoice.currentBalance }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>
    </div>
    <el-pagination
        background
        v-model:page-size="pagination.pageSize"
        v-model:current-page="pagination.currentPage"
        :total="pagination.totalElements"
        layout="prev, pager, next, jumper, ->, total"
        @current-change="listInvoices"
        @size-change="listInvoices"
    >
    </el-pagination>
    <el-dialog v-model="showAddCreditsDialog" fullscreen>
      <zz-title title="充值"/>
      <el-form label-width="60" label-position="top">
        <el-form-item label="金额">
          <el-input v-model="balanceToAdd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addCredits">充值</el-button>
          <el-button @click="showAddCreditsDialog=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="showConsumeDialog" fullscreen>
      <zz-title title="消费"/>
      <el-form label-position="top">
        <el-form-item label="金额">
          <el-input v-model="balanceToPay"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="consume">支付</el-button>
          <el-button @click="showConsumeDialog=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

