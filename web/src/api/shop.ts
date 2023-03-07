import axios from "axios"
import {Shop} from "../types"
import {PagedResponse} from "./base"

export async function getShop(): Promise<PagedResponse<Shop>> {
    return await axios.get("/shops")
}

export interface AddShopParams {
    name: string
    address: string
}

export async function addShop(params: AddShopParams): Promise<Shop> {
    return await axios.post("/shops", params)
}

export const shop = {
    getShop,
    addShop,
}

export default shop