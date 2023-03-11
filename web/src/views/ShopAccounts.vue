<script lang="ts" setup>
import {computed, onMounted, ref} from "vue"
import {Search} from "@element-plus/icons-vue"
import {useRouter} from "vue-router"
import api, {ApiError} from "../api"
import {ElMessage} from "element-plus"
import {useShop} from "../store/shop"
import {ShopAccount} from "../types"

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
        <el-card v-for="account in accounts" :key="account.code">
          <el-descriptions :title="account.name" :extra="account.code" :column="2">
            <el-descriptions-item label="手机号码:">
              {{ account.phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3") }}
            </el-descriptions-item>
            <el-descriptions-item label="余额:">
              {{ `￥${account.balance}` }}
            </el-descriptions-item>
          </el-descriptions>
          <el-button
              type="primary"
              @click="router.push(`/shop-accounts/detail?shop=${account.shop}&code=${encodeURI(account.code)}`)"
          >
            查看
          </el-button>
          <el-button @click="ElMessage('正在开发中...')">编辑</el-button>
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