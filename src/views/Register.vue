<template>
    <div class="login-container">
        <div class="login-box">
            <div style="padding: 50px 30px; background-color: white; margin-left: 100px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2)">
                <el-form ref="formRef" :model="data.form" :rules="data.rules" style="width: 300px">
                    <div style="margin-bottom: 30px; text-align: center; font-size: 24px; color: #3c7fff; font-weight: bold">
                        欢 迎 注 册
                    </div>
                    <el-form-item prop="username">
                        <el-input v-model="data.form.username" placeholder="请输入账号" prefix-icon="User"
                                  size="large"></el-input>
                    </el-form-item>
                    <el-form-item prop="no">
                        <el-input v-model="data.form.no" placeholder="请输入工号" prefix-icon="User"
                                  size="large"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="data.form.password" placeholder="请输入密码" prefix-icon="Lock" show-password
                                  size="large"></el-input>
                    </el-form-item>
                    <el-form-item prop="confirmPassword">
                        <el-input v-model="data.form.confirmPassword" placeholder="请确认密码" prefix-icon="Lock" show-password
                                  size="large"></el-input>
                    </el-form-item>
                    <div style="margin-bottom: 20px">
                        <el-button size="large" style="width: 100%" type="primary" @click="register">登 录</el-button>
                    </div>
                    <div style="text-align: right">已有账号？请<a href="/login"
                                                                 style="color: #3c7fff; text-decoration: none">登录</a></div>
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

const validatePass = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请再次确认密码'))
    } else if (value !== data.form.password) {
        callback(new Error('两次输入密码不一致'))
    } else {
        callback()
    }
}
const data = reactive({
    form: {},
    rules: {
        username: [
            {
                required: true, message: '请输入账号', trigger: 'blur'
            }
        ],
        no: [
            {
                required: true, message: '请输入工号', trigger: 'blur'
            }
        ],
        password: [
            {
                required: true, message: '请输入密码', trigger: 'blur'
            }
        ],
        confirmPassword: [
            {
                validator: validatePass, trigger: 'blur'
            }
        ]
    }
})
const formRef = ref()


const register = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            request.post('/register', data.form).then(res => {
                if (res.code === '200') {
                    ElMessage.success('注册成功')
                    setTimeout(() => {
                        location.href = '/login'
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