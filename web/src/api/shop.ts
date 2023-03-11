import axios from "axios"
import {Commodity, Invoice, Shop, ShopAccount} from "../types"
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

export async function listInvoices(shopCode: string, accountCode: string): Promise<PagedResponse<Invoice>> {
    return await axios.get(`/shops/${shopCode}/accounts/${accountCode}/invoices`)
}

export const shop = {
    listShops,
    addShop,
    getShopAccount,
    listShopAccounts,
    addShopAccount,
    listCommodities,
    addCommodity,
    listInvoices,
}

export default shop