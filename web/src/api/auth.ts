import axios from "axios"
import {Profile} from "../types"

export interface LoginParams {
    phoneNumber: string
    password: string
}

export async function register(data: LoginParams): Promise<void> {
    return await axios.post("/register", data)
}

export async function login(phoneNumber: string, password: string): Promise<void> {
    const formData = new FormData()
    formData.set("phoneNumber", phoneNumber)
    formData.set("password", password)
    return await axios.post("/login", formData)
}

export async function getProfile(): Promise<Profile> {
    return axios.get("/self/profile")
}

export const auth = {
    register,
    login,
    getProfile,
}

export default auth