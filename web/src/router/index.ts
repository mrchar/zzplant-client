import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router"
import AddAccount from "../views/AddAccount.vue"
import AccountDetail from "../views/AccountDetail.vue"
import {useAuth} from "../store/auth"
import api from "../api"
import Crossroad from "../views/Crossroad.vue"

const routes: RouteRecordRaw[] = [
    {name: "Home", path: "/", redirect: "/crossroad"},
    {name: "Login", path: "/login", component: () => import("../views/Login.vue")},
    {name: "Register", path: "/register", component: () => import("../views/Register.vue")},
    {name: "Crossroad", path: "/crossroad", component: Crossroad},
    {name: "AddShop", path: "/shops/add", component: () => import("../views/AddShop.vue")},
    {name: "SelectShop", path: "/shops/select", component: () => import("../views/SelectShop.vue")},
    {name: "ShopAccounts", path: "/shop-accounts", component: () => import("../views/ShopAccounts.vue")},
    {name: "AddShopAccounts", path: "/shop-accounts/add", component: AddAccount},
    {name: "ShopAccountDetail", path: "/shop-accounts/detail", component: AccountDetail},
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