import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router"
import Accounts from "../views/Accounts.vue"
import AddAccount from "../views/AddAccount.vue"
import AccountDetail from "../views/AccountDetail.vue"
import AddShop from "../views/AddShop.vue"

const routes: RouteRecordRaw[] = [
    {path: "/", redirect: "/accounts"},
    {name: "Accounts", path: "/accounts", component: Accounts},
    {name: "AddAccount", path: "/accounts/add", component: AddAccount},
    {name: "AccountDetail", path: "/accounts/detail", component: AccountDetail},
    {name: "AddShop", path: "/shops/add", component: AddShop},
]

export default createRouter({
    routes: routes,
    history: createWebHashHistory(),
})