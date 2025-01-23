<template>
    <div>
        <div class="card" style="margin-bottom: 5px">
            <el-input v-model="data.title" placeholder="请输入标题查询" prefix-icon="Search"
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
                <el-table-column label="标题" prop="title"/>
                <el-table-column label="封面">
                    <template #default="scope">
                        <el-image v-if="scope.row.img" :preview-src-list=[scope.row.img]
                                  :src="scope.row.img" alt="" preview-teleported="preview-teleported"
                                  style="display: block; width: 100px;height: 60px;"/>
                    </template>
                </el-table-column>
                <el-table-column label="简介" prop="description" show-overflow-tooltip="show-overflow-tooltip"/>
                <el-table-column label="内容">
                    <template #default="scope">
                        <el-button type="primary" @click="view(scope.row.content)">查看内容</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="发布时间" prop="time"/>
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
        <el-dialog v-model="data.formVisible" destroy-on-close title="文章信息" width="50%">
            <el-form ref="formRef" :model="data.form" label-width="80px"
                     style="padding-right: 40px; padding-top: 20px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="data.form.title" autocomplete="off" placeholder="请输入标题"/>
                </el-form-item>
                <el-form-item label="封面">
                    <el-upload
                            :on-success="handleImgSuccess"
                            action="http://localhost:9090/files/upload"
                            list-type="picture"
                    >
                        <el-button type="primary">上传封面</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="简介" prop="description">
                    <el-input v-model="data.form.description" autocomplete="off" placeholder="请输入简介" rows="3"
                              type="textarea"/>
                </el-form-item>
                <el-form-item label="内容">
                    <div style="border: 1px solid #ccc; width: 100%;">
                        <Toolbar
                                :editor="editorRef"
                                :mode="mode"
                                style="border-bottom: 1px solid #ccc"
                        />
                        <Editor
                                v-model="data.form.content"
                                :defaultConfig="editorConfig"
                                :mode="mode"
                                style="height: 500px; overflow-y: hidden;"
                                @onCreated="handleCreated"
                        />
                    </div>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="data.formVisible = false">取 消</el-button>
                    <el-button type="primary" @click="save">保 存</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="data.viewVisible" :close-on-click-modal="false" destroy-on-close title="内容" width="50%">
            <div class="editor-content-view" style="padding: 20px" v-html="data.content"></div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="data.viewVisible = false">关 闭</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import {onBeforeUnmount, reactive, shallowRef} from 'vue'
import {Delete, Edit} from "@element-plus/icons-vue";
import request from '@/utils/request';
import {ElMessage, ElMessageBox} from "element-plus";
import '@wangeditor/editor/dist/css/style.css'
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import '../assets/view.css'


const baseUrl = 'http://localhost:9090'
const editorRef = shallowRef()
const mode = 'default'
const editorConfig = {MENU_CONF: {}}
editorConfig.MENU_CONF['uploadImage'] = {
    server: baseUrl + '/files/wang/upload',
    fieldName: 'file',
}
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})
const handleCreated = (editor) => {
    editorRef.value = editor
}
const data = reactive({
    title: null,
    tableData: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    formVisible: false,
    form: {},
    ids: [],
    content: null,
    viewVisible: false,
})

const view = (content) => {
    data.content = content
    data.viewVisible = true
}
const load = () => {
    request.get('/article/selectPage', {
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
    data.form.id ? update() : add()
}
const add = () => {
    request.post('/article/add', data.form).then(res => {
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
    request.put('/article/update', data.form).then(res => {
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
        request.delete('/article/deleteById/' + id).then(res => {
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
        request.delete('/article/deleteBatch', {data: data.ids}).then(res => {
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
const handleImgSuccess = (res) => {
    data.form.img = res.data
}
</script>