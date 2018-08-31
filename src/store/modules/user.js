import { getToken, setToken, removeToken, setMenu, removeMenu, getMenu } from '@/utils/tool';
import { menuSelectFun } from '@/service/member';
const user = {
  state: {
    token: getToken(),
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
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
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
      commit('SET_TOKEN', token);
    },
    getMenu({ commit }, menu){
      menuSelectFun().then((data) => {
        commit('setMenu', data);
        commit('setFirstRoute',data[0]);
        setMenu(data);
      });
    },
    // 前端 登出
    LogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('setMenu', []);
        removeToken();
        removeMenu();
        resolve();
      });
    }
  }
};

export default user;
