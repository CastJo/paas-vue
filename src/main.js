import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import store from './store/index'
import echarts from "echarts"

Vue.prototype.$echarts = echarts;

Vue.use(ElementUI, { size: 'small' });

//axios全局配置
Vue.prototype.$axios = axios;
axios.defaults.baseURL = '/api';

Vue.config.productionTip = false;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
