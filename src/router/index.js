import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {path: '/', redirect: '/login'},
        {
            path: '/manager', component: () => import('../views/Manager.vue'), children: [
                {
                    path: 'home', name: 'home', meta: {title: '主页'}, component: () => import('../views/Home.vue'),
                },
                {
                    path: 'data', name: 'data', meta: {title: '数据展示'}, component: () => import('../views/Data.vue'),
                },
                {
                    path: 'employee',
                    name: 'employee',
                    meta: {title: '员工信息'},
                    component: () => import('../views/Employee.vue'),
                },
                {
                    path: 'admin',
                    name: 'admin',
                    meta: {title: '管理员信息'},
                    component: () => import('../views/Admin.vue'),
                },
                {
                    path: 'password',
                    name: 'password',
                    meta: {title: '修改密码'},
                    component: () => import('../views/Password.vue'),
                },
                {
                    path: 'person',
                    name: 'person',
                    meta: {title: '个人信息'},
                    component: () => import('../views/Person.vue'),
                },
                {
                    path: 'article',
                    name: 'article',
                    meta: {title: '文章信息'},
                    component: () => import('../views/Article.vue'),
                },
                {
                    path: 'department',
                    name: 'department',
                    meta: {title: '部门信息'},
                    component: () => import('../views/Department.vue'),
                },
                {
                    path: 'detail',
                    name: 'detail',
                    meta: {title: '文章详情'},
                    component: () => import('../views/Detail.vue'),
                },
            ]
        },
        {
            path: '/login', name: 'Login', meta: {title: '登录系统'}, component: () => import('../views/Login.vue'),
        },
        {
            path: '/register',
            name: 'Register',
            meta: {title: '欢迎注册'},
            component: () => import('../views/Register.vue'),
        },
        {
            path: '/404', name: 'NotFound', meta: {title: '404找不到页面'}, component: () => import('../views/404.vue'),
        },
        {
            path: '/:pathMatch(.*)', redirect: '/404'
        },
    ],
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
})
export default router
