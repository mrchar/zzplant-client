import axios from "axios"
import {Bill, BillCommodity, Commodity, Shop, ShopAccount} from "../types"
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

/**
 * 获取商铺会员的所有订单
 * @param shopCode
 * @param accountCode
 */
export async function listBillsOfShopAccount(shopCode: string, accountCode: string): Promise<PagedResponse<Bill>> {
    return await axios.get(`/shops/${shopCode}/accounts/${accountCode}/bills`)
}

/**
 * 获取商铺中指定的订单
 * @param shopCode
 * @param billCode
 */
export async function getBill(shopCode: string, billCode: string): Promise<Bill> {
    return await axios.get(`/shops/${shopCode}/bills/${billCode}`)
}

export async function topUp(shopCode: string, accountCode: string, amount: number): Promise<void> {
    return await axios.post(`/shops/${shopCode}/accounts/${accountCode}/top-up`, {amount})
}

export async function addBill(shopCode: string, accountCode: string, commodities: BillCommodity[]): Promise<Bill> {
    return await axios.post(`/shops/${shopCode}/bills`, {accountCode, commodities})
}

export async function deleteBill(shopCode: string, billCode: string): Promise<void> {
    return await axios.delete(`/shops/${shopCode}/bills/${billCode}`)
}

export async function pay(shopCode: string, billCode: string, commodities: BillCommodity[], amount: number) {
    return await axios.post(`/shops/${shopCode}/payment`, {
        billCode,
        commodities: commodities.map(item => ({code: item.code, quantity: item.quantity})),
        amount,
    })
}

export const shop = {
    listShops,
    addShop,
    getShopAccount,
    listShopAccounts,
    addShopAccount,
    listCommodities,
    addCommodity,
    listBillsOfShopAccount,
    getBill,
    topUp,
    addBill,
    deleteBill,
    pay,
}

export default shop