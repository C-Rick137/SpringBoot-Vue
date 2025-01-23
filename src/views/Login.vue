<template>
    <div class="login-container">
        <div class="login-box">
            <div style="padding: 50px 30px; background-color: white; margin-left: 100px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2)">
                <el-form ref="formRef" :model="data.form" :rules="data.rules" style="width: 300px">
                    <div style="margin-bottom: 30px; text-align: center; font-size: 24px; color: #3c7fff; font-weight: bold">
                        欢迎登录员工管理系统
                    </div>
                    <el-form-item prop="username">
                        <el-input v-model="data.form.username" placeholder="请输入账号" prefix-icon="User"
                                  size="large"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="data.form.password" placeholder="请输入密码" prefix-icon="Lock" show-password
                                  size="large"></el-input>
                    </el-form-item>
                    <el-form-item prop="role">
                        <el-select v-model="data.form.role" size="large" style="width: 100%;">
                            <el-option label="管理员" value="ADMIN"></el-option>
                            <el-option label="员工" value="EMP"></el-option>
                        </el-select>
                    </el-form-item>
                    <div style="margin-bottom: 20px">
                        <el-button size="large" style="width: 100%" type="primary" @click="login">登 录</el-button>
                    </div>
                    <div style="text-align: right">还没有账号？请<a href="/register"
                                                                   style="color: #3c7fff; text-decoration: none">注册</a></div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {User, Lock} from "@element-plus/icons-vue";
import request from "@/utils/request.js";
import {ElMessage} from "element-plus";

const data = reactive({
    form: {
        role: 'ADMIN'
    },
    rules: {
        username: [
            {
                required: true, message: '请输入账号', trigger: 'blur'
            }
        ],
        password: [
            {
                required: true, message: '请输入密码', trigger: 'blur'
            }
        ]
    }
})
const formRef = ref()
const login = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            request.post('/login', data.form).then(res => {
                if (res.code === '200') {
                    ElMessage.success('登录成功')
                    localStorage.setItem('springBoot-Vue-user', JSON.stringify(res.data))
                    setTimeout(() => {
                        location.href = '/manager/home'
                    }, 500)
                } else {
                    ElMessage.error(res.msg)
                }
            })
        }
    })
}
</script>

<style scoped>
.login-container {
    height: 100vh;
    overflow: hidden;
    background-image: url("../assets/5a407418ed91d.jpg");
    background-size: cover;
}

.login-box {
    position: absolute;
    display: flex;
    align-items: center;
    width: 50%;
    right: 0;
    height: 100%;
}
</style>