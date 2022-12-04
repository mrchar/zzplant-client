<script lang="ts" setup>
import {onBeforeMount, onMounted, ref} from "vue"
import Account from "../types/account"
import {Search} from "@element-plus/icons-vue"

const allAccounts: Array<Account> = []

onBeforeMount(() => {
  for (let i: number = 0; i < 100; i++) {
    allAccounts.push(
        {
          id: i.toString(),
          password: "xxxxx",
          profile: {
            id: i.toString(),
            name: "用户" + (i + 1),
            gender: "男",
            mobileNumber: "133333333" + i.toString().padStart(2, '0')
          },
          balance: i * 10
        }
    )
  }
})

const filteredAccounts = ref<Array<Account>>([])

const keyword = ref("")

const accounts = ref<Array<Account>>([])

const pagination = ref({
  pageSize: 10,
  currentPage: 1,
})

const listAllAccounts = () => {
  if (!keyword) {
    filteredAccounts.value = allAccounts;
  } else {
    filteredAccounts.value = allAccounts.filter(item => {
      if (item.profile.mobileNumber.includes(keyword.value)) {
        return true
      } else if (item.profile.name.includes(keyword.value)) {
        return true
      }

      return false;
    })
  }

  const pageSize = pagination.value.pageSize
  const currentPage = pagination.value.currentPage
  const start = (currentPage - 1) * pageSize
  const end = start + pageSize
  accounts.value = filteredAccounts.value.slice(start, end)
}

onMounted(() => {
  listAllAccounts()
})
</script>

<template>
  <div class="w-full h-full box-border p-4 flex flex-col justify-start gap-4">
    <!--Header-->
    <div class="flex gap-4 justify-between">
      <el-input
          v-model="keyword"
          placeholder="输入名称或手机号码进行搜索"
          size="large"
          class="max-w-lg"
          @keyup.enter="listAllAccounts"
      >
        <template #append>
          <el-button @click="listAllAccounts" :icon="Search"/>
        </template>
      </el-input>
      <el-button type="primary" size="large" @click="$message('正在开发中...')">添加</el-button>
    </div>
    <!--Table-->
    <div class="w-full max-h-fit overflow-auto">
      <el-table stripe border :data="accounts">
        <el-table-column label="序号" type="index" width="80"></el-table-column>
        <el-table-column label="名称" prop="profile.name"></el-table-column>
        <el-table-column label="手机号码">
          <template #default="{row}">
            {{ row.profile.mobileNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3") }}
          </template>
        </el-table-column>
        <el-table-column label="余额">
          <template #default="{row}">
            {{ `￥${row.balance}` }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" @click="$message('正在开发中...')">查看</el-button>
          <el-button @click="$message('正在开发中...')">编辑</el-button>
        </el-table-column>
      </el-table>
    </div>
    <!--Pagination-->
    <el-pagination
        background
        v-model:page-size="pagination.pageSize"
        v-model:current-page="pagination.currentPage"
        :total="filteredAccounts.length"
        layout="sizes, prev, pager, next, jumper, ->, total"
        @size-change="listAllAccounts"
        @current-change="listAllAccounts">
    </el-pagination>
  </div>
</template>