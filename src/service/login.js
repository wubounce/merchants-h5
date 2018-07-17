/**
 *  登录
 */
import { fetch } from './baseService';

const loginApi = 'sys/login';                                            // 登录 method 'post'

// 登录
export const login = (payload) => fetch.post(loginApi, payload);
