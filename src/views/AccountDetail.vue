<script lang="ts" setup>
import {onBeforeMount, ref} from "vue"
import Account from "../types/account"
import {useStore} from "../store";
import {useRoute} from "vue-router";
import {Search} from "@element-plus/icons-vue";

const nameSuffix = {"male": "先生", "female": "女士"}

const store = useStore()
const route = useRoute()

const account = ref<Account>({
  id: "",
  password: "",
  profile: {
    id: "",
    name: "",
    gender: "",
    mobileNumber: ""
  },
  balance: 0,
})

const keyword = ref("")

const records = ref<any>([])

for (let i = 0; i < 100; i++) {
  records.value.push({
    datetime: new Date(),
    orderNumber: "xxxxxxxx",
    type: "decrease", // increase | decrease
    amount: -48,
    balance: 100,
    operatorName: "服务员1"
  },)
}

const pagination = ref({
  pageSize: 10,
  currentPage: 1,
  totalElements: 100,
})

onBeforeMount(() => {
  const name = route.query.name as string
  if (name) {
    store.getAccount(name)
        .then((res) => {
          if (res) {
            account.value = res
          }
        })
  }

})
</script>
<template>
  <div class="w-full h-full box-border p-6 flex flex-col gap-6">
    <div class="w-full  ">
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
          <el-button size="large" type="success" @click="$message('正在开发中...')">充值</el-button>
          <el-button size="large" type="primary" @click="$message('正在开发中...')">消费</el-button>
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
    <el-table :data="records" border stripe>
      <el-table-column label="时间">
        <template #default="{row}">
          {{ row.datetime.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="orderNumber"></el-table-column>
      <el-table-column label="类型">
        <template #default="{row}">
          {{ {"increase": "充值", "decrease": "消费"}[row.type] }}
        </template>
      </el-table-column>
      <el-table-column label="金额(￥)" prop="amount">
      </el-table-column>
      <el-table-column label="余额(￥)" prop="balance"></el-table-column>
      <el-table-column label="记账人员" prop="operatorName"></el-table-column>
    </el-table>
    <el-pagination
        background
        v-model:page-size="pagination.pageSize"
        v-model:current-page="pagination.currentPage"
        :total="pagination.totalElements"
        layout="sizes, prev, pager, next, jumper, ->, total">
    </el-pagination>
  </div>
</template>

