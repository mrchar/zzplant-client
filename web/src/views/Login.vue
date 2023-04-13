<script lang="ts" setup>
import {ref} from "vue"
import api from "../api"
import {useRouter} from "vue-router"
import {useAuth} from "../store/auth"
import {ElMessage} from "element-plus"
import ZzTitle from "../components/ZzTitle.vue"

const router = useRouter()

const auth = useAuth()
auth.setAuthenticated("Unauthenticated")

const formData = ref({phoneNumber: "", password: ""})

const login = () => {
    api.auth.login(formData.value.phoneNumber, formData.value.password)
        // TODO: 对接REST登录方式
        .then(() => {
            console.debug("登录成功")
            auth.setAuthenticated("Authenticated")
            router.push({path: "/"})
        })
        .catch((err) => {
            console.error("登录失败", err)
            auth.setAuthenticated("Unauthenticated")
            ElMessage.error("用户名或密码错误")
        })
}
</script>

<template>
    <div class="max-w-lg mx-auto">
        <zz-title title="登录"/>
        <el-form label-position="top">
            <el-form-item label="手机号码">
                <el-input v-model="formData.phoneNumber"/>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="formData.password" show-password/>
            </el-form-item>
            <el-form-item>
                <el-button class="w-full mt-2" type="primary" @click="login()">
                    登录
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-button class="w-full" @click="router.push('/register')">
                    注册
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>