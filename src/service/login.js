/**
 *  登录
 */
import { fetch } from './baseService';

const loginApi = 'operator/login';                                            // 登录 method 'post'
const userDatilApi = 'operator/getOperator';                                   // 登录 method 'post'
const codeLoginApi = 'operator/codeLogin';                                    // 手机验证码登录 method 'post'

// 登录
export const login = (payload) => fetch.post(loginApi,  payload);


// 用户详情
export const getDEtail = (payload) => fetch.post(userDatilApi, { params: payload });

//  手机验证码登录
export const codeLogin = (payload) => fetch.post(codeLoginApi, payload);
