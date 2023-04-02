import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router"
import {useAuth} from "../store/auth"
import api from "../api"
import Crossroad from "../views/Crossroad.vue"

const routes: RouteRecordRaw[] = [
    {name: "Home", path: "/", redirect: "/crossroad"},
    {name: "Login", path: "/login", component: () => import("../views/Login.vue")},
    {name: "Register", path: "/register", component: () => import("../views/Register.vue")},
    {name: "Crossroad", path: "/crossroad", component: Crossroad},
    {name: "AddShop", path: "/shops/add", component: () => import("../views/AddShop.vue")},
    {name: "Shops", path: "/shops", component: () => import("../views/Shops.vue")},
    {name: "ShopDetail", path: "/shops/detail", component: () => import("../views/ShopDetail.vue")},
    {name: "AddBill", path: "/bills/add", component: () => import("../views/AddBill.vue")},
    {name: "AddCommodity", path: "/commodities/add", component: () => import("../views/AddCommodity.vue")},
    {name: "ShopAccounts", path: "/shop-accounts", component: () => import("../views/ShopAccounts.vue")},
    {name: "AddShopAccounts", path: "/shop-accounts/add", component: () => import("../views/AddShopAccount.vue")},
    {
        name: "ShopAccountDetail",
        path: "/shop-accounts/detail",
        component: () => import("../views/ShopAccountDetail.vue"),
    },
]

export const router = createRouter({
    routes: routes,
    history: createWebHistory(),
})

const doesNotNeedAuthenticationPath: string[] = ["/register", "/login"]

router.beforeEach(async (to) => {
    const store = useAuth()

    if (store.authenticated === "Unknown") {
        try {
            const profile = await api.auth.getProfile()
            store.setProfile(profile)
            store.setAuthenticated("Authenticated")
        } catch (error) {
            console.debug("获取用户信息失败，将登录状态设置为未验证")
            store.setAuthenticated("Unauthenticated")
        }
    }

    const needAuthentication = !doesNotNeedAuthenticationPath.includes(to.path)
    const authenticated = store.authenticated === "Authenticated"
    if (needAuthentication && !authenticated) {
        return {path: "/login"}
    }

    if (!needAuthentication && authenticated) {
        if (to.query && to.query.referer) {
            return {path: to.query.referer as string}
        }
        return {path: "/"}
    }
})

export default router