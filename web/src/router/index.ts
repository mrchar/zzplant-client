import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router"
import {useAuth} from "../store/auth"
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

const doesNotNeedAuthenticationPath: string[] = ["/register", "/login", "/crossroad"]

router.beforeEach(async (to) => {
    console.debug("go to", to)

    // 如果不需要登录直接跳转
    const needAuthentication = !doesNotNeedAuthenticationPath.includes(to.path)
    if (!needAuthentication) {
        return
    }

    const auth = useAuth()
    // 如果登录状态是Unknown，跳转到crossroad
    if (auth.authenticated === "Unknown") {
        return {path: "/crossroad"}
    }

    // 如果需要登录但是没有登录，跳转到登陆页面
    const authenticated = auth.authenticated === "Authenticated"
    if (needAuthentication && !authenticated) {
        return {path: "/login"}
    }
})

export default router