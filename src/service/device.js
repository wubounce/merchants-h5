/**
 *  设备相关接口
 */
import {
  fetch
} from './baseService';

//api
const loginApi = 'account/login'; // 登录 method 'post'


// 登录
export const login = (payload) => fetch.get(loginApi, {
  params: payload
});



