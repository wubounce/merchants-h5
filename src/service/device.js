/**
 *  设备相关接口
 */
import {
  fetch
} from './baseService';

//api
const deviceApi = 'account/login'; // 登录 method 'post'


// 登录
export const device = (payload) => fetch.get(deviceApi, {
  params: payload
});



