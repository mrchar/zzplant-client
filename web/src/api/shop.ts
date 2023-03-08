import axios from "axios"
import {Shop, ShopAccount} from "../types"
import {PagedResponse} from "./base"

export async function listShops(): Promise<PagedResponse<Shop>> {
    return await axios.get("/shops")
}

export interface AddShopParams {
    name: string
    address: string
}

export async function addShop(params: AddShopParams): Promise<Shop> {
    return await axios.post("/shops", params)
}

export async function listShopAccounts(shopCode: string): Promise<PagedResponse<ShopAccount>> {
    return await axios.get(`/shops/${shopCode}/accounts`)
}


export const shop = {
    listShops,
    addShop,
    listShopAccounts,
}

export default shop