import { getToken, setToken, removeToken } from '@/utils/tool';
import { menuSelectFun } from '@/service/member';
const user = {
  state: {
    menu:[],
    timeOffset: 0,
    firstRoute:{},
  },
  getters:{
    has: (state) => (value) => {
      let isExist = true;
      let buttonpermsStr = state.menu;
      if(buttonpermsStr==undefined || buttonpermsStr==null){
        return false;
      }
      for(let i=0;i<buttonpermsStr.length;i++){
        if(buttonpermsStr[i].perms.includes(String(value))){
          isExist = false;
          break;
        }
      }
      return isExist;
    },
    // 获取服务器时间（毫秒）
    getServerTime: state => () => {
      return state.timeOffset * 1000 + new Date().getTime();
    }
  },
  mutations: {
    setMenu: (state, menu) => {
      state.menu = menu;
    },
    setServerTimeOffset (state, data) {
      state.timeOffset = data;
    },
    setFirstRoute (state, data) {
      state.firstRoute = data;
    },
  },

  actions: {
    // 登录
    login({ commit }, token) {
      setToken(token);
    },
    getMenu({ commit, state }){
      menuSelectFun().then((data) => {
        commit('setMenu', data);
        let parentRoute = data.filter(item=>Number(item.parentId)===0);
        commit('setFirstRoute',parentRoute[0]);
      });
      return Promise.resolve(state.firstRoute);
    },
    // 前端 登出
    LogOut({ commit }) {
      return new Promise(resolve => {
        commit('setMenu', []);
        removeToken();
        resolve();
      });
    }
  }
};

export default user;
