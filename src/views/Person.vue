<template>
    <div class="card" style="margin-left: 300px;width: 50%; padding: 40px 20px">
        <el-form ref="formRef" :model="data.form" :rules="data.rules" label-width="80px"
                 style="padding-right: 40px; padding-top: 20px">
            <div style="display: flex;width: 100%; justify-content: center; margin-bottom: 20px">
                <el-upload
                    :on-success="handleAvatarSuccess"
                    :show-file-list="false"
                    action="http://localhost:9090/files/upload"
                    class="avatar-uploader"
                >
                    <img v-if="data.form.avatar" :src="data.form.avatar" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </div>
            <el-form-item label="账号" prop="username">
                <el-input v-model="data.form.username" autocomplete="off" disabled placeholder="请输入账号"/>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="data.form.name" autocomplete="off" placeholder="请输入名称"/>
            </el-form-item>
            <div v-if="data.form.role === 'EMP'">
                <el-form-item label="性别">
                    <el-radio-group v-model="data.form.sex">
                        <el-radio label="男"/>
                        <el-radio label="女"/>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="工号" prop="no">
                    <el-input v-model="data.form.no" autocomplete="off" disabled placeholder="请输入工号"/>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input-number v-model="data.form.age" :min="18" autocomplete="off" placeholder="请输入年龄"
                                     style="width: 180px"/>
                </el-form-item>
                <el-form-item label="个人介绍">
                    <el-input v-model="data.form.description" :rows="3" autocomplete="off" placeholder="请输入个人介绍"
                              type="textarea"/>
                </el-form-item>
            </div>
            <div style="text-align: center">
                <el-button style="padding: 20px 30px;" type="primary" @click="updateUser">更新个人信息</el-button>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import request from "@/utils/request.js";
import {Plus} from "@element-plus/icons-vue";

const formRef = ref()
const data = reactive({
    user: JSON.parse(localStorage.getItem('springBoot-Vue-user')),
    form: {},
    rules: {
        username: [
            {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
        ],
        no: [
            {required: true, message: '请输入工号', trigger: 'blur'},
        ]
    }
})

const emit = defineEmits(['updateUser'])
if (data.user.role === 'EMP') {
    request.get('/employee/selectById/' + data.user.id).then(res => {
        data.form = res.data
    })
} else {
    data.form = data.user
}
const updateUser = () => {
    if (data.user.role === 'EMP') {
        request.put('employee/update', data.form).then(res => {
            if (res.code === '200') {
                ElMessage.success('更新成功')
                localStorage.setItem('springBoot-Vue-user', JSON.stringify(data.form))
                emit('updateUser', data.form)
            } else {
                ElMessage.error(res.msg)
            }
        })
    } else {
        request.put('admin/update', data.form).then(res => {
            if (res.code === '200') {
                ElMessage.success('更新成功')
                localStorage.setItem('springBoot-Vue-user', JSON.stringify(data.form))
                emit('updateUser', data.form)
            } else {
                ElMessage.error(res.msg)
            }
        })
    }
}
const handleAvatarSuccess = (res) => {
    data.form.avatar = res.data
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 50px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    text-align: center;
}

.avatar {
    max-width: 100px;
    max-height: 100px;
    object-fit: cover;
}
</style>