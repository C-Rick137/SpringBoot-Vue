<template>
    <div class="card" style="width: 50%; padding: 40px 20px;margin-left: 300px">
        <el-form ref="formRef" :model="data.form" :rules="data.rules" label-width="100px"
                 style="padding-right: 40px; padding-top: 20px">
            <el-form-item label="原密码" prop="password">
                <el-input v-model="data.form.password" autocomplete="off" placeholder="请输入原密码" show-password/>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="data.form.newPassword" autocomplete="off" placeholder="请输入新密码" show-password/>
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
                <el-input v-model="data.form.confirmPassword" autocomplete="off" placeholder="请再次确认新密码"
                          show-password/>
            </el-form-item>
            <div style="text-align: center">
                <el-button style="padding: 20px 30px;" type="primary" @click="updatePassword">立即修改</el-button>
            </div>
        </el-form>

    </div>
</template>

<script setup>
import {reactive, ref} from 'vue'
import request from "@/utils/request.js";
import {ElMessage} from "element-plus";


const validatePass = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请再次确认新密码'))
    } else if (value !== data.form.newPassword) {
        callback(new Error('两次输入密码不一致'))
    } else {
        callback()
    }
}
const formRef = ref()
const data = reactive({
    form: {},
    rules: {
        password: [
            {
                required: true,
                message: '请输入原密码',
                trigger: 'blur'
            }
        ],
        newPassword: [
            {
                required: true,
                message: '请输入新密码',
                trigger: 'blur'
            }
        ],
        confirmPassword: [
            {
                required: true,
                validator: validatePass,
                trigger: 'blur'
            }
        ]
    },
    user: JSON.parse(localStorage.getItem('springBoot-Vue-user')),
})
const updatePassword = () => {
    data.form.id = data.user.id
    data.form.role = data.user.role
    formRef.value.validate((valid) => {
        if (valid) {
            request.put('updatePassword', data.form).then(res => {
                if (res.code === '200') {
                    ElMessage.success('修改成功')
                    localStorage.removeItem('springBoot-Vue-user')
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

<style>

</style>