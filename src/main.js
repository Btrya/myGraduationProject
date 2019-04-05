import Vue from 'vue'
import iView from 'iview'
import VueRouter from 'vue-router'
import Routers from './router'
import Util from './libs/util'
import App from './app.vue'
import store from './store'
import './libs/animate.css'
import 'iview/dist/styles/iview.css'
import './theme/index.less'
import './styles/flexible.css' // px2rem
import "./styles/js/flexible.js" // px2rem
// import VueParticles from 'vue-particles' // 动态颗粒
// 引入mavon编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// Vue.use(VueParticles)
Vue.use(VueRouter)
Vue.use(iView)
Vue.use(mavonEditor)
// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    if (to.meta.needLogin) {
      if (!localStorage.getItem('lfuser')){
        next({
          path: '/login'
        })
      }
    }
    next();
});

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

new Vue({
    el: '#app',
    router: router,
    store,
    render: h => h(App)
});
