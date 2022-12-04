import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router"
import Accounts from "../views/Accounts.vue";
import AddAccount from "../views/AddAccount.vue";

const routes: RouteRecordRaw[] = [
    {path: "/", redirect: "/accounts"},
    {name: "Accounts", path: "/accounts", component: Accounts},
    {name: "AddAccount", path: "/accounts/add", component: AddAccount}
]

export default createRouter({
    routes: routes,
    history: createWebHashHistory()
})