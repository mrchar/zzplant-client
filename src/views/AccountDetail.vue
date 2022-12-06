<script lang="ts" setup>
import {onBeforeMount, ref} from "vue"
import {Account} from "../types/account"
import {minerId, shopId, useStore} from "../store"
import {useRoute} from "vue-router"
import {Search} from "@element-plus/icons-vue"
import {Bill} from "../types/bill"
import {Transaction} from "../types/transaction"

const nameSuffix = {"male": "先生", "female": "女士"}

const store = useStore()
const route = useRoute()

const keyword = ref("")

const accountName = ref<string>("")

const account = ref<Account>({
  id: "",
  password: "",
  profile: {
    id: "",
    name: "",
    gender: "",
    mobileNumber: "",
  },
  balance: 0,
})

const getAccount = () => {
  store.getAccount(accountName.value)
      .then((res) => {
        if (res) {
          account.value = res
        }
      })
}

const bills = ref<Array<Bill>>([])

const listAllBills = () => {
  store.listAllBills(accountName.value)
      .then(res => {
        res.forEach(item => {
          item.datetime = new Date(item.datetime)
        })
        bills.value = res
      })
}

const transactions = ref<Array<Transaction>>([])
const listAllTransactions = () => {
  store.listAllTransactions(accountName.value)
      .then(res => {
        res.forEach(item => {
          item.datetime = new Date(item.datetime)
        })
        transactions.value = res
      })
}

const pagination = ref({
  pageSize: 10,
  currentPage: 1,
  totalElements: 100,
})

const showAddCreditsDialog = ref(false)
const balanceToAdd = ref(0)
const addCredits = () => {
  store.transfer(minerId, account.value.id, balanceToAdd.value)
      .then(() => {
        listAllBills()
        listAllTransactions()
      })
      .finally(() => {
        balanceToAdd.value = 0
        showAddCreditsDialog.value = false
      })
}

const showConsumeDialog = ref(false)
const balanceToPay = ref(0)
const consume = () => {
  store.transfer(account.value.id, shopId, balanceToPay.value)
      .then(() => {
        listAllBills()
        listAllTransactions()
      })
      .finally(() => {
        balanceToPay.value = 0
        showConsumeDialog.value = false
      })
}

onBeforeMount(() => {
  const name = route.query.name as string
  if (name) {
    accountName.value = name
    getAccount()
    listAllBills()
    listAllTransactions()
  }
})

</script>
<template>
  <div class="w-full h-full box-border p-6 flex flex-col gap-6">
    <div class="w-full">
      <el-descriptions size="large">
        <template #title>
          <div class="font-bold">会员信息</div>
        </template>
        <el-descriptions-item label="称呼">
          {{ account.profile.name + (" " + nameSuffix[account.profile.gender] || "") }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号码">
          {{ account.profile.mobileNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="账户余额">
          {{ "￥" + account.balance }}
        </el-descriptions-item>
        <template #extra>
          <el-button size="large" type="success" @click="showAddCreditsDialog=true">充值</el-button>
          <el-button size="large" type="primary" @click="showConsumeDialog=true">消费</el-button>
        </template>
      </el-descriptions>
    </div>
    <div class="font-bold">账单记录</div>
    <el-input
        v-model="keyword"
        placeholder="输入消费日期或订单号搜索"
        size="large"
        class="max-w-lg"
        @keyup.enter="$message('正在开发中...')"
    >
      <template #append>
        <el-button :icon="Search" @click="$message('正在开发中...')"/>
      </template>
    </el-input>
    <el-table :data="bills" border stripe>
      <el-table-column label="时间">
        <template #default="{row}">
          {{ row.datetime.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="订单号">
        <template #default="{row}">
          {{ transactions.find(item => item.id === row.transactionId).number }}
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template #default="{row}">
          {{ row.amount > 0 ? "充值" : "消费" }}
        </template>
      </el-table-column>
      <el-table-column label="金额(￥)" prop="amount">
      </el-table-column>
      <el-table-column label="余额(￥)" prop="currentBalance"></el-table-column>
    </el-table>
    <el-pagination
        background
        v-model:page-size="pagination.pageSize"
        v-model:current-page="pagination.currentPage"
        :total="pagination.totalElements"
        layout="sizes, prev, pager, next, jumper, ->, total">
    </el-pagination>
    <el-dialog v-model="showAddCreditsDialog">
      <el-form label-width="60">
        <el-form-item label="金额">
          <el-input v-model="balanceToAdd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addCredits">充值</el-button>
          <el-button @click="showAddCreditsDialog=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="showConsumeDialog">
      <el-form label-width="60">
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

