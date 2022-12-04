import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router"
import Accounts from "../views/Accounts.vue";

const routes: RouteRecordRaw[] = [
    {path: "/", redirect: "/accounts"},
    {name: "Accounts", path: "/accounts", component: Accounts}
]

export default createRouter({
    routes: routes,
    history: createWebHashHistory()
})