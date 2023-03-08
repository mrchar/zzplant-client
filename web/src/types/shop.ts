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
    phoneNumber: string
    balance: number
    shop: string
}