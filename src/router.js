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
    },
    {
      path: '/personal',
      meta: {
          title: '个人中心'
      },
      component: (resolve) => require(['./views/personal.vue'], resolve)
    },
    {
      path: '/information',
      meta: {
          title: '更多信息'
      },
      component: (resolve) => require(['./views/information.vue'], resolve)
    },
    {
      path: '/404',
      meta: {
        title: '404页面'
      },
      component: (resolve) => require(['./views/notFound.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
];
export default routers;
