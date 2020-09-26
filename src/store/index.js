import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo:{
      avatarUrl: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      username: "用户A"
    },
    userid: sessionStorage.getItem("userId"),
    roles: [],
    token: sessionStorage.getItem("token"),
    monitorInfo:JSON.parse(sessionStorage.getItem("monitorInfo")),
  },
  mutations: {
    setUser(state, val) {
      state.userid = val.id;
      state.roles = val.roles;
      state.token = val.token;
      sessionStorage.setItem("userId", val.id);
      sessionStorage.setItem("token", val.token);
    },
    setUserInfo(state, val) {
      state.userInfo = val;
      console.log(val);
    },
    logout(state) {
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

  },
  getters:{

  }
})
