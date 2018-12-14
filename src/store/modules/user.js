import { getMenu, removeToken } from '@/utils/tool';

const user = {
  state: {
    menu:[],
    userInfo: {}
  },
  getters:{
    has: (state) => (value) => {
      let isExist = false;
      let buttonpermsStr = getMenu();
      if(buttonpermsStr==undefined || buttonpermsStr==null){
        return false;
      }
      for(let i=0;i<buttonpermsStr.length;i++){
        if(buttonpermsStr[i].perms.includes(String(value))){
          isExist = true;
          break;
        }
      }
      return isExist;
    },
  },
  mutations: {
    setMenu: (state, menu) => {
      state.menu = menu;
    },
    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo;
    }
  },

  actions: {
    // 前端 登出
    LogOut({ commit }) {
      return new Promise(resolve => {
        commit('setMenu', []);
        commit('userInfo', {});
        removeToken();
        resolve();
      });
    }
  }
};

export default user;
