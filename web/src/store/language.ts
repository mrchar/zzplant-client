import {defineStore} from "pinia"
import {computed, ref} from "vue"
import {en, zhCn} from "element-plus/es/locale/index"

export type Language = "ZhCN" | "EN"

export const useLanguage = defineStore("language", () => {
    const language = ref<Language>("ZhCN")

    const setLanguage = (params: Language) => {
        language.value = params
    }

    const locale = computed(() => {
        if (language.value === "ZhCN") return zhCn
        if (language.value === "EN") return en
    })

    return {
        language,
        setLanguage,
        locale,
    }
})