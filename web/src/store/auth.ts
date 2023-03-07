import {defineStore} from "pinia"
import {ref} from "vue"
import api from "../api"
import {Profile} from "../types"

export type AuthenticationStatus = "Unknown" | "Authenticated" | "Unauthenticated"

export const useAuth = defineStore("auth", () => {
    let interval: NodeJS.Timeout | string | number | undefined

    const profile = ref<Profile | null>(null)

    const setProfile = (data: Profile) => {
        profile.value = data
    }

    const authenticated = ref<AuthenticationStatus>("Unknown")

    const setAuthenticated = (status: AuthenticationStatus) => {
        if (status === "Authenticated") {
            authenticated.value = "Authenticated"

            interval = setInterval(() => {
                api.auth.getProfile()
                    .then(res => {
                        profile.value = res
                        authenticated.value = "Authenticated"
                    })
                    .catch(() => {
                        clearInterval(interval)
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
        setProfile,
        authenticated,
        setAuthenticated,
    }
})