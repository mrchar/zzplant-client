<script lang="ts" setup>
import {useShop} from "../store/shop"
import {computed, onMounted, ref} from "vue"
import {Commodity, Shop} from "../types"
import {useRouter} from "vue-router"
import {Search} from "@element-plus/icons-vue"
import api from "../api"

const store = useShop()

const router = useRouter()

const shop = computed<Shop>((): Shop => {
  if (store.selected) {
    return store.selected
  }
  return {address: "", code: "", company: "", name: "", owner: ""}
})

const keyword = ref("")

const commodities = ref<Commodity[]>([])

const pagination = ref({
  pageSize: 10,
  currentPage: 1,
  totalElements: 0,
})

const listCommodities = () => {
  api.shop.listCommodities(shop.value.code)
      .then(res => {
        commodities.value = res.content
        pagination.value.totalElements = res.totalElements
      })
      .catch(err => {
        console.error("获取商品列表时发生错误", err)
      })
}


onMounted(() => {
  listCommodities()
})


</script>

<template>
  <div class="w-full h-full flex flex-col gap-4">
    <el-descriptions :column="1">
      <template #title>
        <div class="text-lg my-1">商铺详情</div>
      </template>
      <template #extra>
        <el-button link>编辑</el-button>
      </template>
      <el-descriptions-item label="编号:">
        {{ shop.code }}
      </el-descriptions-item>
      <el-descriptions-item label="名称:">
        {{ shop.name }}
      </el-descriptions-item>
      <el-descriptions-item label="地址:">
        {{ shop.address }}
      </el-descriptions-item>
    </el-descriptions>
    <div class="text-lg bold my-1">商品列表</div>
    <div class="flex gap-4 justify-between">
      <el-input
          v-model="keyword"
          placeholder="输入名称或手机号码进行搜索"
          size="large"
          class="max-w-lg"
          @keyup.enter="listCommodities()"
      >
        <template #append>
          <el-button @click="listCommodities()" :icon="Search"/>
        </template>
      </el-input>
      <el-button type="primary" size="large" @click="router.push('/commodities/add')">添加</el-button>
    </div>
    <div class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-start">
        <el-card v-for="commodity in commodities">
          <el-descriptions
              :column="2"
              :title="commodity.name"
              :extra="commodity.code"
          >
            <el-descriptions-item label="编号:">
              {{ commodity.code }}
            </el-descriptions-item>
            <el-descriptions-item label="名称:">
              {{ commodity.name }}
            </el-descriptions-item>
            <el-descriptions-item label="价格:">
              {{ '￥' + commodity.price }}
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
        @size-change="listCommodities()"
        @current-change="listCommodities()">
    </el-pagination>
  </div>
</template>