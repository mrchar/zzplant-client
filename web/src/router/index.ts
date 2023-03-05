import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router"
import Accounts from "../views/Accounts.vue"
import AddAccount from "../views/AddAccount.vue"
import AccountDetail from "../views/AccountDetail.vue"
import AddShop from "../views/AddShop.vue"
import {useAuth} from "../store/auth"
import api from "../api"

const routes: RouteRecordRaw[] = [
    {path: "/", redirect: "/accounts"},
    {path: "/login", component: () => import("../views/Login.vue")},
    {path: "/register", component: () => import("../views/Register.vue")},
    {name: "Accounts", path: "/accounts", component: Accounts},
    {name: "AddAccount", path: "/accounts/add", component: AddAccount},
    {name: "AccountDetail", path: "/accounts/detail", component: AccountDetail},
    {name: "AddShop", path: "/shops/add", component: AddShop},
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