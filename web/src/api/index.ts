import axios from "axios"
import auth from "./auth"
import shop from "./shop"

const sessionIdHeaderKey = "X-Auth-Token"

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

axios.interceptors.request.use((config) => {
    const sessionId = window.localStorage.getItem(sessionIdHeaderKey)
    if (sessionId) {
        config.headers.set(sessionIdHeaderKey, sessionId)
    }
    return config
})

axios.interceptors.response.use((res) => {
        // @ts-ignore
        if (res.headers.has(sessionIdHeaderKey)) {
            // @ts-ignore
            window.localStorage.setItem(sessionIdHeaderKey, res.headers.get(sessionIdHeaderKey))
        }
        return res.data
    },
)

export type {Pageable, PagedResponse} from "./base"
export type {AddShopParams, AddCommodityParams} from "./shop"

export default {
    auth,
    shop,
}