<script lang="ts" setup>
import {ref} from "vue"
import Account from "../types/account"
import {Search} from "@element-plus/icons-vue"

const searchKey = ref("mobileNumber")

const accounts = ref<Array<Account>>([
  {
    id: "1111",
    password: "xxxxx",
    profile: {id: "11111", name: "用户1", gender: "男", mobileNumber: "13333333333"},
    balance: 100
  }
])
</script>

<template>
  <div class="w-full h-full box-border p-4 flex flex-col gap-4">
    <div class="flex gap-4 justify-between">
      <el-input
          placeholder="输入名称或手机号码进行搜索"
          size="large"
          class="max-w-lg"
      >
        <template #append>
          <el-button :icon="Search"/>
        </template>
      </el-input>
      <el-button type="primary" size="large" @click="$message('正在开发中...')">添加</el-button>
    </div>
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
</template>