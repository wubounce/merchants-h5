import { getToken, setToken, setNavTabIndex, setMenu, removeMenu, getMenu, removeToken, removeMember } from '@/utils/tool';
import { menuSelectFun } from '@/service/member';
import router from '@/router';
const user = {
  state: {
    menu:[],
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
    },
  },
  mutations: {
    setMenu: (state, menu) => {
      state.menu = menu;
    },
  },

  actions: {
    // 登录
    login({ commit }, token) {
      setToken(token);
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
