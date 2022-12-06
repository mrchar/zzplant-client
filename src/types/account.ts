import Profile from "./profile";

export interface AddAccountParams {
    name: string,
    gender: string,
    mobileNumber: string,
    initBalance: number
}

export interface ListAccountsResponse {
    content: Array<Account>,
    page: number,
    size: number,
    total: number
}

export interface Account {
    id: string,
    password: string,
    profile: Profile
    balance: number
}