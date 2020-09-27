import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:{
      userId: "",
      username: "",
      email: "",
      roleId: 1,
      avatarUrl: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    },
    token: localStorage.getItem("token"),
    monitorInfo:JSON.parse(sessionStorage.getItem("monitorInfo")),
  },
  mutations: {
    setUser(state, val) {
        state.user = val;
    },
    login(state, data) {
      localStorage.setItem('token', data);
      state.token = data;
    },
    logout(state) {
      localStorage.removeItem('token');
      state.token = null;
      state.userInfo = {};
    },
    setMonitorInfo(state, val){
      sessionStorage.setItem("monitorInfo",JSON.stringify(val))
      state.monitorInfo=val;
    },
    pushMonitorInfo(state, val){
      let tmp=state.monitorInfo
      if(tmp===null){
        tmp=[]
      }
      tmp.push(val)
      sessionStorage.setItem("monitorInfo",JSON.stringify(tmp))
      state.monitorInfo=tmp
    },
    clearMonitorInfo(state){
      sessionStorage.removeItem("monitorInfo")
      state.monitorInfo=[]
    }
  },
  actions: {
  },
  modules: {
  }
})
