import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import web from './modules/web';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    web
  },
  getters,
 
});

export default store;
