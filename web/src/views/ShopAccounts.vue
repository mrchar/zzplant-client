<script lang="ts" setup>
import {onMounted, ref} from "vue"
import {Search} from "@element-plus/icons-vue"
import {useRouter} from "vue-router"
import api, {ApiError} from "../api"
import {ElMessage} from "element-plus"
import {useShop} from "../store/shop"
import {ShopAccount} from "../types"

const store = useShop()

const router = useRouter()

const keyword = ref("")

const accounts = ref<Array<ShopAccount>>([])

const pagination = ref({
  pageSize: 10,
  currentPage: 1,
  totalElements: 0,
})

const listAllAccounts = (shopCode: string) => {
  api.shop.listShopAccounts(shopCode)
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

onMounted(() => {
  if (!store.selected) {
    router.push("/shops/select")
    return
  }

  listAllAccounts(store.selected.code)
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
      <el-button type="primary" size="large" @click="router.push('/shop-accounts/add')">添加</el-button>
    </div>
    <!--Table-->
    <el-table stripe border :data="accounts">
      <el-table-column label="会员码" prop="code"/>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="手机号码">
        <template #default="{row}">
          {{ row.phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3") }}
        </template>
      </el-table-column>
      <el-table-column label="余额">
        <template #default="{row}">
          {{ `￥${row.balance}` }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{row}">
          <el-button
              type="primary"
              @click="router.push(`/shop-accounts/detail?shop=${row.shop}&code=${encodeURI(row.code)}`)"
          >
            查看
          </el-button>
          <el-button @click="ElMessage('正在开发中...')">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--Pagination-->
    <el-pagination
        background
        v-model:page-size="pagination.pageSize"
        v-model:current-page="pagination.currentPage"
        :total="pagination.totalElements"
        layout="sizes, prev, pager, next, jumper, ->, total"
        @size-change="listAllAccounts"
        @current-change="listAllAccounts">
    </el-pagination>
  </div>
</template>