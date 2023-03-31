import axios from "axios"
import {Bill, Commodity, Shop, ShopAccount} from "../types"
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

export async function getShopAccount(shopCode: string, accountCode: string): Promise<ShopAccount> {
    return await axios.get(`/shops/${shopCode}/accounts/${accountCode}`)
}

export async function listShopAccounts(shopCode: string, keyword: string): Promise<PagedResponse<ShopAccount>> {
    return await axios.get(`/shops/${shopCode}/accounts`, {params: {keyword: keyword}})
}

export interface AddShopAccountParams {
    name: string
    gender: string
    phoneNumber: string
    balance: number
}

export async function addShopAccount(shopCode: string, params: AddShopAccountParams): Promise<ShopAccount> {
    return await axios.post(`/shops/${shopCode}/accounts`, params)
}

export async function listCommodities(shopCode: string): Promise<PagedResponse<Commodity>> {
    return await axios.get(`/shops/${shopCode}/commodities`)
}

export interface AddCommodityParams {
    name: string
    price: number
}

export async function addCommodity(shopCode: string, params: AddCommodityParams): Promise<Commodity> {
    return await axios.post(`/shops/${shopCode}/commodities`, params)
}

export async function listBills(shopCode: string, accountCode: string): Promise<PagedResponse<Bill>> {
    return await axios.get(`/shops/${shopCode}/accounts/${accountCode}/bills`)
}

export async function topUp(shopCode: string, accountCode: string, amount: number) {
    return await axios.post(`/shops/${shopCode}/accounts/${accountCode}/top-up`, {amount})
}

export const shop = {
    listShops,
    addShop,
    getShopAccount,
    listShopAccounts,
    addShopAccount,
    listCommodities,
    addCommodity,
    listBills,
    topUp,
}

export default shop