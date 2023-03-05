import {defineStore} from "pinia"
import {ref} from "vue"
import api from "../api"
import {Profile} from "../types"

export type AuthenticationStatus = "Unknown" | "Authenticated" | "Unauthenticated"

export const useAuth = defineStore("auth", () => {
    let interval: NodeJS.Timeout | string | number | undefined
    const profile = ref<Profile | null>(null)
    const authenticated = ref<AuthenticationStatus>("Unknown")
    const setAuthenticated = async (status: AuthenticationStatus) => {
        if (status === "Authenticated") {
            profile.value = await api.auth.getProfile()
            authenticated.value = "Authenticated"
            interval = setInterval(() => {
                api.auth.getProfile()
                    .then(res => {
                        profile.value = res
                    })
                    .catch(() => {
                        profile.value = null
                        authenticated.value = "Unauthenticated"
                    })
            }, 60000)
        }

        profile.value = null
        authenticated.value = status
        clearInterval(interval)
    }

    return {
        profile,
        authenticated,
        setAuthenticated,
    }
})