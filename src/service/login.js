/**
 *  登录
 */
import { fetch } from './baseService';

const loginApi = 'account/login';                                            // 登录 method 'post'
const userDatilApi = 'account/getOperator';                                            // 登录 method 'post'

// 登录
export const login = (payload) => fetch.get(loginApi,  { params: payload });


// 用户详情
export const getDEtail = (payload) => fetch.get(userDatilApi, { params: payload });
