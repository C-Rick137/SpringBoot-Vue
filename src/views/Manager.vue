<template>
    <div>
        <div style="height: 60px; display: flex; align-items: center; background-color: #3c7fff">
            <div style="width: 200px; display: flex; align-items: center; padding-left: 15px">
                <img alt="" src="../assets/production.svg" style="width: 40px;margin-left: 10px">
                <span style=" font-size: 22px; color: white; margin-left: 10px">员工管理系统</span>
            </div>
            <div style="flex: 1"></div>
            <div style="width: fit-content; display: flex; align-items: center; padding-right: 10px">
                <img :src="data.user.avatar || '../assets/6b75f059423b186fd89fe2d7ce6fbc6.jpg'" alt=""
                     style="width: 40px; height: 40px; border-radius: 50%;">
                <span style="color:white; margin-left: 5px">{{ data.user.name }}</span>
            </div>
        </div>
        <div style="display: flex; height: calc(100vh - 60px)">
            <div style="width: 200px; border-right: 1px solid #ddd; overflow-y: auto; height: 100%">
                <el-menu :default-active="router.currentRoute.value.path" router
                         style="border: 0">
                    <el-menu-item index="/manager/home">
                        <el-icon>
                            <House/>
                        </el-icon>
                        系统首页
                    </el-menu-item>
                    <el-menu-item index="/manager/data">
                        <el-icon>
                            <DataAnalysis/>
                        </el-icon>
                        数据统计
                    </el-menu-item>
                    <el-menu-item v-if="data.user.role==='ADMIN'" index="/manager/article">
                        <el-icon>
                            <Reading/>
                        </el-icon>
                        文章管理
                    </el-menu-item>
                    <el-menu-item v-if="data.user.role==='ADMIN'" index="/manager/department">
                        <el-icon>
                            <OfficeBuilding/>
                        </el-icon>
                        部门管理
                    </el-menu-item>
                    <el-sub-menu v-if="data.user.role==='ADMIN'" index="1">
                        <template #title>
                            <el-icon>
                                <User/>
                            </el-icon>
                            <span>用户管理</span>
                        </template>
                        <el-menu-item index="/manager/admin">管理员信息</el-menu-item>
                        <el-menu-item index="/manager/employee">员工信息</el-menu-item>
                    </el-sub-menu>
                    <el-menu-item index="/manager/person">
                        <el-icon>
                            <UserFilled/>
                        </el-icon>
                        个人信息
                    </el-menu-item>
                    <el-menu-item index="/manager/password">
                        <el-icon>
                            <Lock/>
                        </el-icon>
                        修改密码
                    </el-menu-item>
                    <el-menu-item @click="logout">
                        <el-icon>
                            <SwitchButton/>
                        </el-icon>
                        退出登录
                    </el-menu-item>
                </el-menu>
            </div>
            <div style="flex: 1; background-color: #f8f8ff; padding: 10px; overflow-y: auto; max-height: calc(100vh - 70px)">
                <RouterView @updateUser="updateUser"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import {reactive} from "vue";
import {
    DataAnalysis,
    House,
    Lock,
    OfficeBuilding,
    Reading,
    SwitchButton,
    User,
    UserFilled,
} from "@element-plus/icons-vue";
import router from "@/router/index.js";

const data = reactive({
    user: JSON.parse(localStorage.getItem('springBoot-Vue-user')),
})
const logout = () => {
    localStorage.removeItem('springBoot-Vue-user')
    location.href = '/login'
}
const updateUser = () => {
    data.user = JSON.parse(localStorage.getItem('springBoot-Vue-user'))
}
</script>

<style>
.el-menu .is-active {
    background-color: #e6ecf7 !important;
}

.el-sub-menu__title {
    background-color: white !important;
}
</style>