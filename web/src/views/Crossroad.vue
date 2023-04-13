<script lang="ts" setup>
import {useShop} from "../store/shop"
import api from "../api"
import {useRoute, useRouter} from "vue-router"
import {onMounted, ref} from "vue"
import {useAuth} from "../store/auth"
import {ElMessage} from "element-plus"

const auth = useAuth()
const store = useShop()
const route = useRoute()
const router = useRouter()

const loading = ref(true)

async function getProfile() {
    try {
        const profile = await api.auth.getProfile()
        auth.setProfile(profile)
        auth.setAuthenticated("Authenticated")
    } catch (error) {
        console.debug("获取用户信息失败，将登录状态设置为未验证")
        auth.setAuthenticated("Unauthenticated")
    }
}

function selectRoute() {
    if (auth.authenticated !== "Authenticated") {
        router.push({path: "/login"})
        return
    }

    // 如果当前没有选择店铺
    api.shop.listShops()
        .then(res => {
            if (res.empty) {
                // 还没有创建店铺，跳转到新增页面
                store.selectShop(null)
                router.push({path: "/shops/add"})
                return
            }

            // 更新商铺列表
            const shops = res.content
            store.setShops(shops)

            // 如果没有选择商铺，跳转到商铺选择页面
            const selected = store.selected
            if (selected == null) {
                router.push({path: "/shops"})
                return
            }

            // 查找商铺信息，如果不存在，重新选择商铺
            const refreshed = shops.find(item => item.code === selected.code)
            if (!refreshed) {
                store.selectShop(null)
                router.push({path: "/shops"})
                return
            }

            // 如果商铺信息存在，更新商铺信息
            store.selectShop(refreshed)

            // 否则跳转到店铺主页
            router.push("/shop-accounts")
        })
        .catch((err) => {
            console.error("获取商铺列表失败", err)
            ElMessage.error("获取商铺列表失败，可以重新登录后再次尝试")
        })
        .finally(() => {
            loading.value = false
        })
}

onMounted(async () => {
    if (auth.authenticated === "Unknown") {
        await getProfile()
    }

    selectRoute()
})
</script>

<template>
    <div v-loading.fullscreen="loading">
    </div>
</template>