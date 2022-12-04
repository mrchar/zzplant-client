<script lang="ts" setup>
import {ref} from "vue";
import {AddAccountParams} from "../types/account";
import {useStore} from "../store";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";

const store = useStore()
const router = useRouter()

const addForm = ref<AddAccountParams>({
  name: "",
  gender: "male",
  mobileNumber: "",
  initBalance: 0,
})

const addAccount = () => {
  store.addAccount(addForm.value)
      .then((res) => {
        router.push("/accounts/detail?name=" + encodeURI(res.profile.name))
      })
      .catch(error => {
        console.error("添加账户失败", error)
        ElMessage({message: "添加账户失败", type: error})
      })
}
</script>

<template>
  <div class="w-full h-full box-border p-6 pr-12">
    <el-form class="max-w-lg mx-auto" label-width="100px">
      <el-form-item label="称呼">
        <el-input v-model="addForm.name" placeholder="请输入会员姓名">
          <template #append>
            <el-radio-group v-model="addForm.gender">
              <el-radio label="male">先生</el-radio>
              <el-radio label="female">女士</el-radio>
            </el-radio-group>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="addForm.mobileNumber" placeholder="请输入会员手机号码">
          <template #prepend>
            <el-select class="w-20" model-value="+86">
              <el-option value="+86">+86</el-option>
            </el-select>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="初始额度">
        <el-input v-model="addForm.initBalance" placeholder="请输入创建会账户初始额度">
          <template #prepend>
            <div class="w-10">￥</div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="addAccount" type="primary">添加</el-button>
        <el-button @click="router.go(-1)||router.push('/accounts')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>