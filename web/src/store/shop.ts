import {defineStore} from "pinia"
import {computed, ref} from "vue"
import {Shop} from "../types"

export const useShop = defineStore("shop", () => {
    const shops = ref<Shop[] | null>()

    const setShops = (params: Shop[]) => {
        shops.value = params
    }

    const saveSelected = () => {
        sessionStorage.setItem("selectedShop", JSON.stringify(selected.value))
    }

    const loadSelected = () => {
        const loaded = sessionStorage.getItem("selectedShop")
        if (loaded) {
            selected.value = JSON.parse(loaded) as Shop
        }
    }

    const selected = ref<Shop | null>()

    const shop = computed<Shop>((): Shop => {
        if (selected.value) {
            return selected.value
        }
        return {address: "", code: "", company: "", name: "", owner: ""}
    })

    const selectShop = (params: Shop | null) => {
        selected.value = params
        saveSelected()
    }

    loadSelected()

    return {
        shops,
        setShops,
        selected,
        shop,
        selectShop,
    }
})