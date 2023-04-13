<script lang="ts" setup>
import {ref} from "vue"
import api from "../api"
import {useRouter} from "vue-router"
import ZzTitle from "../components/ZzTitle.vue"
import {ElMessage} from "element-plus"
import {useAuth} from "../store/auth"

const router = useRouter()

const auth = useAuth()
auth.setAuthenticated("Unauthenticated")

const formData = ref({phoneNumber: "", password: ""})

const register = () => {
    api.auth.register(formData.value)
        .then(() => {
            showDialog.value = true
        })
        .catch((err) => {
            ElMessage.error("注册失败!")
            console.error("注册失败:", err.message)
        })
}

const showDialog = ref(false)
</script>

<template>
    <div class="max-w-lg mx-auto">
        <zz-title title="注册"/>
        <el-form label-position="top">
            <el-form-item label="手机号码">
                <el-input v-model="formData.phoneNumber"/>
            </el-form-item>
            <el-form-item v-if="false" label="验证码">
                <div class="w-full flex gap-2">
                    <el-input class="w-2/3"/>
                    <el-button class="w-1/3">获取验证码</el-button>
                </div>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="formData.password" show-password/>
            </el-form-item>
            <el-form-item>
                <el-button class="w-full" type="primary" @click="register()">
                    注册
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-button class="w-full" link @click="router.push('/login')">
                    已有账号？马上登录！
                </el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-drawer
            v-model="showDialog"
            direction="btt"
            :close-on-click-modal="false"
            :show-close="false"
            title="注册成功"
    >
        <div>🎉注册成功，现在就去登录！</div>
        <template #footer>
            <el-button class="w-full" type="primary" @click="router.push('/login')">
                👌好的
            </el-button>
        </template>
    </el-drawer>
</template>