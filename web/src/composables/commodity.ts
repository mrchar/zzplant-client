import {Ref, ref} from "vue"
import {Commodity, Shop} from "../types"
import api from "../api"

export function useCommodity(shop: Ref<Shop>) {
    const keyword = ref("")

    const pagination = ref({
        pageSize: 10,
        currentPage: 1,
        totalElements: 0,
    })

    const commodities = ref<Commodity[]>([])

    function listCommodities() {
        api.shop.listCommodities(shop.value.code)
            .then(res => {
                commodities.value = res.content
                pagination.value.totalElements = res.totalElements
            })
            .catch(err => {
                console.error("获取商品列表时发生错误", err)
            })
    }

    return {
        keyword,
        pagination,
        commodities,
        listCommodities,
    }
}