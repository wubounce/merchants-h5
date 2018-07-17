import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '@/utils/tool';

const user = {
  state: {
    token: getToken(),
    name: '',
    roles: [],
    userInfo: getUser()
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
    }
  },

  actions: {
    // 登录
    login({ commit }, userInfo) {
      setToken(userInfo.token);
      setUser(userInfo.user);
      commit('SET_TOKEN', userInfo.token);
      commit('SET_NAME', userInfo.fullName);
      commit('SET_ROLES', userInfo.roles);
      commit('setUserInfo', userInfo.user);
      return Promise.resolve();
    },

    // 获取用户信息
    getUser ({ state }) {
      return Promise.resolve(state.userInfo);
    },
    // 前端 登出
    LogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_NAME', '');
        commit('SET_ROLES', '');
        commit('setUserInfo', '');
        removeToken();
        removeUser();
        resolve();
      });
    }
  }
};

export default user;
