import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  token: '',
  userInfo: {},
  projectId: '',
  editContainerProjectId: '',
  containerId :'',
  host_addr:'192.168.100.110:9999',
  serviceId:'',
  currentMirrorId:'',
  unreadMessageNum:0,
  networkId:''
};

const mutations = {
  SET_CONTAINER_ID(state, containerId){
    state.containerId = containerId;
  },

  SET_TOKEN(state, token) {
    state.token = token;
    sessionStorage.token = token
  },
  DEL_TOKEN(state) {
    state.token = '';
    sessionStorage.removeItem('token');
  },
  CHANGE_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  },
  SET_PROJECT_ID(state, projectId) {
    state.projectId = projectId
  },
  SET_EDIT_CONTAINER_PROJECT_ID(state, editContainerId) {
    state.editContainerProjectId = editContainerId
  },
  SET_SERVICE_ID(state,serviceId){
    state.serviceId = serviceId
  },
  SET_CURRENT_MIRROR_ID(state,mirrorId){
    state.currentMirrorId = mirrorId;
  },
  SET_UNREAD_MESSAGE_NUM(state,num){
    state.unreadMessageNum = num;
  },
  SET_NETWORK_ID(state,networkId){
    state.networkId = networkId;
  }
}
const actions = {
  changeUserInfo({commit}, userInfo) {
    commit('CHANGE_USER_INFO', userInfo)
  },
  setProjectId({commit}, projectId) {
    commit("SET_PROJECT_ID", projectId)
  },
  setEditContainerProjectId({commit}, id) {
    commit("SET_EDIT_CONTAINER_PROJECT_ID", id)
  },
  setContainerId({commit},containerId){
    commit("SET_CONTAINER_ID",containerId)
  },
  saveServiceId({commit},id){
    commit("SET_SERVICE_ID",id)
  },
  setUnreadMessageNum({commit},num){
    commit('SET_UNREAD_MESSAGE_NUM',num);
  }
}
const getters = {
  getUserInfo(state) {
    return state.userInfo
  },
  getProjectId(state) {
    return state.projectId;
  },
  getEditContainerProjectId(state) {
    return state.editContainerProjectId;
  },
  getContainerId(state){
    return state.containerId;
  },
  getHostAddr(state){
    return state.host_addr;
  },
  getServiceId(state){
    return state.serviceId;
  },
  getCurrentMirrorId(state){
    return state.currentMirrorId;
  },
  getToken(state){
    return state.token;
  },
  getUnreadMessageNum(state){
    return state.unreadMessageNum;
  },
  getNetworkId(state){
    return state.networkId;
  }
};
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
