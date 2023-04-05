import axios from "axios"
import auth from "./auth"
import shop from "./shop"

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
axios.defaults.withCredentials = true
axios.defaults.xsrfCookieName = "XSRF-TOKEN"
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN"
axios.interceptors.response.use(
    (res) => {
        return res.data
    },
)

export type {Pageable, PagedResponse} from "./base"
export type {AddShopParams, AddCommodityParams} from "./shop"

export default {
    auth,
    shop,
}