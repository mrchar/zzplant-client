export interface Shop {
    code: string
    name: string
    address: string
    owner: string
    company: string
}

export interface ShopAccount {
    code: string
    name: string
    gender: string
    phoneNumber: string
    balance: number
    shop: string
}

export interface Commodity {
    code: string
    name: string
    price: number
}

export interface BillCommodity {
    code: string
    name: string
    price: number
    quantity: number
    amount: number
}

export interface Bill {
    code: string
    createDateTime: Date
    commodities: BillCommodity[]
    amount: number
    currentBalance: number
    shopAccount: string
    shop: string
}