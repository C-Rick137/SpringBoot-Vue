<template>
    <el-card class="card" style="height: 820px; padding: 20px">
        <el-row gutter="20">
            <el-col :span="24">
                <div style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px">{{ data.articleList.title }}</div>
            </el-col>
            <el-col :span="24">
                <div style="text-align: center; font-size: 16px; color: #999; margin-bottom: 20px">{{ data.articleList.time }}</div>
            </el-col>
            <el-col :span="24">
                <div style="line-height: 1.8; font-size: 16px" v-html="data.articleList.content"></div>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import {reactive} from 'vue';
import {useRoute} from 'vue-router';
import request from "@/utils/request.js";

const data = reactive({
    articleList: {},
});

const route = useRoute();
const articleId = route.query.id;

request.get('/article/selectById/' + articleId).then(res => {
    if (res.code === '200') {
        data.articleList = res.data;
        console.log(data.articleList);
    }
});
</script>

<style scoped>

</style>