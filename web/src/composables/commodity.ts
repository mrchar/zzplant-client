import {Ref, ref} from "vue"
import {Commodity, Shop} from "../types"
import api from "../api"
import {ElMessage, ElMessageBox} from "element-plus"

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

    function deleteShopCommodity(code: string) {
        ElMessageBox.confirm("删除操作不可恢复，确定要删除该商品吗？", "确定要删除商品吗？",
            {
                confirmButtonText: "删除",
                confirmButtonClass: "el-button--danger",
                cancelButtonText: "取消",
                showCancelButton: true,
                showClose: false,
            })
            .then(() => {
                api.shop.deleteShopCommodity(shop.value.code, code)
                    .then(() => {
                        ElMessage.success("删除商品成功！")
                        listCommodities()
                    })
                    .catch((err) => {
                        ElMessage.error("删除商品失败！")
                        console.error("删除商品失败", err)
                    })
            })

    }

    return {
        keyword,
        pagination,
        commodities,
        listCommodities,
        deleteShopCommodity,
    }
}