<script lang="ts" setup>
import {ref} from "vue"
import api from "../api"
import {useRouter} from "vue-router"
import {useAuth} from "../store/auth"
import {ElMessage} from "element-plus"

const router = useRouter()

const store = useAuth()

const formData = ref({phoneNumber: "", password: ""})

const login = () => {
  api.auth.login(formData.value.phoneNumber, formData.value.password)
      // TODO: 对接REST登录方式
      .then(() => {
        console.debug("登录成功")
        store.setAuthenticated("Authenticated")
        router.push({path: "/"})
      })
      .catch((err) => {
        console.error("登录失败", err)
        store.setAuthenticated("Unauthenticated")
        ElMessage.error("用户名或密码错误")
      })
}
</script>

<template>
  <div class="px-8">
    <div class="text-xl my-4">注册</div>
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