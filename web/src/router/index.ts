import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router"
import Accounts from "../views/Accounts.vue"
import AddAccount from "../views/AddAccount.vue"
import AccountDetail from "../views/AccountDetail.vue"
import AddShop from "../views/AddShop.vue"
import {useAuth} from "../store/auth"

const routes: RouteRecordRaw[] = [
    {path: "/", redirect: "/accounts"},
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

router.beforeEach((to) => {
    const store = useAuth()
    const needAuthentication = !doesNotNeedAuthenticationPath.includes(to.path)
    const authenticated = store.authenticated === "Authenticated"
    if (needAuthentication && !authenticated) {
        return {path: "/login"}
    }
})

export default router