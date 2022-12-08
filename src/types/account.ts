import Profile from "./profile"

export interface Account {
    id: string,
    password: string,
    profile: Profile
    balance: number
}