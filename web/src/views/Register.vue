<script lang="ts" setup>
import {ref} from "vue"
import api from "../api"
import {useRouter} from "vue-router"

const router = useRouter()

const formData = ref({phoneNumber: "", password: ""})

const register = () => {
  api.auth.register(formData.value)
      .then(() => {
        showDialog.value = true
      })
}

const showDialog = ref(false)
</script>

<template>
  <div class="px-8">
    <div class="text-xl my-4">注册</div>
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
  <div v-show="showDialog" class="absolute inset-0 p-4 backdrop-blur-3xl">
    <el-card class="absolute bottom-80 inset-x-4" header="注册成功">
      <div class="flex flex-col gap-8">
        <div>🎉注册成功，现在就去登录！</div>
        <el-button class="w-full"
                   type="primary"
                   @click="router.push('/login')"
        >
          👌好的
        </el-button>
      </div>
    </el-card>
  </div>
</template>