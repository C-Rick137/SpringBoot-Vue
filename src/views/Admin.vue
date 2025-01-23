<template>
    <div>
        <div class="card" style="margin-bottom: 5px">
            <el-input v-model="data.name" placeholder="请输入名称查询" prefix-icon="Search"
                      style="width: 240px; margin-right: 10px"></el-input>
            <el-button type="primary" @click="load">查 询</el-button>
            <el-button type="warning" @click="reset">重 置</el-button>
        </div>
        <div class="card" style="margin-bottom: 5px">
            <el-button type="primary" @click="handleAdd">新 增</el-button>
            <el-button type="danger" @click="delBatch">批量删除</el-button>
        </div>
        <div class="card" style="margin-bottom: 5px">
            <el-table :data="data.tableData" stripe @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"/>
                <el-table-column label="账号" prop="username"/>
                <el-table-column label="头像">
                    <template #default="scope">
                        <img v-if="scope.row.avatar" :src="scope.row.avatar" alt=""
                             style="display: block; width: 40px;height: 40px; border-radius: 50%;"/>
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="name"/>
                <el-table-column label="操作" width="120">
                    <template #default="scope">
                        <el-button :icon="Edit" circle type="primary" @click="handleUpdate(scope.row)"></el-button>
                        <el-button :icon="Delete" circle type="danger" @click="del(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 15px">
                <el-pagination
                        v-model:current-page="data.pageNum"
                        v-model:page-size="data.pageSize"
                        :page-sizes="[5, 10, 15, 20]"
                        :total="data.total"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="load"
                        @current-change="load"
                />
            </div>
        </div>
        <el-dialog v-model="data.formVisible" destroy-on-close title="管理员信息" width="500">
            <el-form ref="formRef" :model="data.form" :rules="data.rules" label-width="80px"
                     style="padding-right: 40px; padding-top: 20px">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="data.form.username" :disabled="data.form.id" autocomplete="off"
                              placeholder="请输入账号"/>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload
                            :on-success="handleAvatarSuccess"
                            action="http://localhost:9090/files/upload"
                            list-type="picture"
                    >
                        <el-button type="primary">上传头像</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="data.form.name" autocomplete="off" placeholder="请输入名称"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="data.formVisible = false">取 消</el-button>
                    <el-button type="primary" @click="save">保 存</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {Delete, Edit} from "@element-plus/icons-vue";
import request from '@/utils/request';
import {ElMessage, ElMessageBox} from "element-plus";

const data = reactive({
    name: null,
    tableData: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    formVisible: false,
    form: {},
    ids: [],
    rules: {
        username: [
            {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
        ],

    }
})

const formRef = ref()
const load = () => {
    request.get('/admin/selectPage', {
        params: {
            pageNum: data.pageNum,
            pageSize: data.pageSize,
            name: data.name
        }
    }).then(res => {
        data.tableData = res.data.list
        data.total = res.data.total
    })
}
load()
const reset = () => {
    data.name = null
    load()
}
const handleAdd = () => {
    data.formVisible = true
    data.form = {}

}
const save = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            data.form.id ? update() : add()
        }
    })
}
const add = () => {
    request.post('/admin/add', data.form).then(res => {
        if (res.code === '200') {
            data.formVisible = false
            ElMessage.success('操作成功')
            load()
        } else {
            ElMessage.error(res.msg)
        }
    })
}
const update = () => {
    request.put('/admin/update', data.form).then(res => {
        if (res.code === '200') {
            data.formVisible = false
            ElMessage.success('操作成功')
            load()
        } else {
            ElMessage.error(res.msg)
        }
    })
}
const handleUpdate = (row) => {
    data.form = JSON.parse(JSON.stringify(row))
    data.formVisible = true

}
const del = (id) => {
    ElMessageBox.confirm('删除数据后无法恢复，您确认删除吗？', '删除确认', {type: 'warning'}).then(() => {
        request.delete('/admin/deleteById/' + id).then(res => {
            if (res.code === '200') {
                data.formVisible = false
                ElMessage.success('操作成功')
                load()
            } else {
                ElMessage.error(res.msg)
            }
        })
    }).catch()
}
const handleSelectionChange = (rows) => {
    data.ids = rows.map(row => row.id)
}
const delBatch = () => {
    if (data.ids.length === 0) {
        ElMessage.warning('请选择数据')
        return
    }
    ElMessageBox.confirm('删除数据后无法恢复，您确认删除吗？', '删除确认', {type: 'warning'}).then(() => {
        request.delete('/admin/deleteBatch', {data: data.ids}).then(res => {
            if (res.code === '200') {
                data.formVisible = false
                ElMessage.success('操作成功')
                load()
            } else {
                ElMessage.error(res.msg)
            }
        })
    }).catch()
}
const handleAvatarSuccess = (res) => {
    data.form.avatar = res.data
}
</script>