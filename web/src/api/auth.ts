import axios from "axios"
import {Profile} from "../types"

export async function getProfile(): Promise<Profile> {
    return axios.get("/self/profile")
}

export const auth = {
    getProfile,
}

export default auth