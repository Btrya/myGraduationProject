const routers = [
    {
        path: '/',
        meta: {
            title: '首页'
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
    {
        path: '/register',
        meta: {
            title: '注册'
        },
        component: (resolve) => require(['./views/register.vue'], resolve)
    },
    {
        path: '/login',
        meta: {
            title: '登录'
        },
        component: (resolve) => require(['./views/login.vue'], resolve)
    },
    {
        path: '/publish',
        meta: {
            title: '发布'
        },
        component: (resolve) => require(['./views/publish.vue'], resolve)
    }
];
export default routers;
