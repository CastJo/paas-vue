import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import ECharts from "vue-echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/line";
Vue.component('EChart', ECharts)
Vue.config.productionTip = false
Vue.use(ElementUI);
var axios = require("axios");
axios.defaults.baseURL = "http://localhost:8004";
// http request 拦截器
axios.interceptors.request.use(
    config => {
      if (store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Authorization = `token ${store.state.token}`;
      }
      return config;
    },
    err => {
      return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // 返回 401 清除token信息并跳转到登录页面
            store.commit('logout');
            router.push({
              path: 'login',
            })
        }
      }
      return Promise.reject(error.response.data)   // 返回接口返回的错误信息
    });

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        console.log(store.state.token)
        if (store.state.token == null)
            next({
                path: '/login',
            })
        else {
            axios
                .post(`/auth/check_token?token=${store.state.token}`)
                .then(() => {
                    next()
                }).catch(() => {
                    next({
                        path: '/login'
                    })
                })
        }
    } else {
        next()
    }
})

Vue.prototype.$axios = axios;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
