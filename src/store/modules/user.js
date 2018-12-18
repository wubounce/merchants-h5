import { getMenu, removeToken, removeNavTabIndex, removeMenu } from '@/utils/tool';
import { getOperatorFun } from '@/service/user';
import router from '@/router';
const user = {
  state: {
    menu:[],
    userInfo: null
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
    // 获取用户信息
    getUserInfo({ commit }){
      return new Promise(resolve =>{
        getOperatorFun().then((res) => {
              commit("setUserInfo", res);
              resolve(res);
          });
      });
  },
    // 前端 登出
    LogOut({ commit }) {
      return new Promise(resolve => {
        commit('setMenu', []);
        commit('setUserInfo', null);
        removeToken();
        removeNavTabIndex();
        removeMenu();
        resolve();
      });
    }
  }
};

export default user;
