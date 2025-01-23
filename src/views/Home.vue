<template>
    <div class="card" style="margin-bottom: 10px; display: flex; align-items: center; justify-content: flex-start">
        <el-input v-model="data.title" placeholder="请输入标题查询" prefix-icon="Search"
                  style="width: 240px; margin-right: 10px"></el-input>
        <el-button style="margin-right: 10px" type="primary" @click="load">查 询</el-button>
        <el-button type="warning" @click="reset">重 置</el-button>
    </div>
    <div style="margin-bottom: 20px; margin-right: 20px">
        <el-card v-for="article in data.articleList" :key="article.id" class="card"
                 style="margin-bottom: 10px; display: flex; flex-direction: column; height: 200px; width: 100%; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); transition: box-shadow 0.3s ease;">
            <div slot="header"
                 style="display: flex; align-items: center; justify-content: space-between; padding: 10px; box-sizing: border-box; height: 60px; border-bottom: 1px solid #eaeaea;">
                <span
                        :class="{ 'hovered': article.isHovered }"
                        style="font-size: 16px; font-weight: bold; cursor: pointer; flex-grow: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #333; transition: color 0.3s ease; margin-bottom: 25px"
                        @click="() => gotoDetail(article.id)"
                        @mouseleave="article.isHovered = false"
                        @mouseover="article.isHovered = true"
                >
                    {{ article.title }}
                </span>
                <img :class="{ 'hovered': article.isHovered }"
                     :src="article.img"
                     style="margin-bottom: 30px;width: 60px; height: 60px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease;"
                     @mouseleave="article.isHovered = false"
                     @mouseover="article.isHovered = true"/>
            </div>
            <div style="flex-grow: 1; overflow: hidden; padding: 10px; box-sizing: border-box; display: flex; flex-direction: row; align-items: center; background-color: #fff;">
                <img :class="{ 'hovered': article.isHovered }"
                     :src="article.img"
                     style="width: 100px; height: 100px; border-radius: 5px; margin-right: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease;"
                     @mouseleave="article.isHovered = false"
                     @mouseover="article.isHovered = true"/>
                <div style="flex-grow: 1; overflow: hidden;">
                    <el-row>
                        <el-col :span="24">
                            <div style="font-size: 14px; color: #333;white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                {{ article.description }}
                            </div>
                            <div style="font-size: 12px; color: #666; margin-top: 70px;">{{ article.time }}</div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-card>
    </div>
    <div style="display: flex; justify-content: left; margin-top: 20px">
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
</template>

<script setup>
import {onMounted, reactive} from 'vue';
import {useRouter} from 'vue-router';
import request from "@/utils/request.js";

const data = reactive({
    articleList: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    title: null,
});

const router = useRouter();

const load = () => {
    request.get('/article/selectPage', {
        params: {
            pageNum: data.pageNum,
            pageSize: data.pageSize,
            title: data.title,
        }
    }).then(res => {
        data.articleList = res.data.list.map(article => ({
            ...article,
            isHovered: false
        }));
        data.total = res.data.total;
    });
}

const reset = () => {
    data.title = null;
    data.pageNum = 1;
    load();
}

const gotoDetail = (articleId) => {
    router.push({path: '/manager/detail', query: {id: articleId}});
}

onMounted(load);
</script>

<style scoped>
.hovered {
    color: #0066bc !important;
    cursor: pointer;
}
</style>