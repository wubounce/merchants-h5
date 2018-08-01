import { getToken, setToken, removeToken, getUser, setUser, removeUser, setMenu, removeMenu, getMenu } from '@/utils/tool';

const user = {
  state: {
    token: getToken(),
    name: '',
    roles: [],
    userInfo: getUser(),
    menu:[]
  },
  getters:{
    has: (state) => (value) => {
      let isExist = true;
      let buttonpermsStr = getMenu();
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
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    setMenu: (state, menu) => {
      state.menu = menu;
    }
  },

  actions: {
    // 登录
    login({ commit }, token) {
      setToken(token);
      commit('SET_TOKEN', token);
    },
    getMenu({ commit }, menu){
      setMenu(menu);
      commit('setMenu', menu);
    },
    // 获取用户信息
    getUser ({ commit, state },userInfo) {
      setUser(userInfo);
      commit('SET_NAME', userInfo.userName);
      commit('SET_ROLES', userInfo.roles);
      commit('setUserInfo', userInfo);
      return Promise.resolve(state.userInfo);
    },

    // 前端 登出
    LogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_NAME', '');
        commit('SET_ROLES', '');
        commit('setUserInfo', '');
        commit('setMenu', []);
        removeToken();
        removeUser();
        removeMenu();
        resolve();
      });
    }
  }
};

export default user;
