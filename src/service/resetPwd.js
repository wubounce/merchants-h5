/**
 *  重置密码
 */
import { fetch } from './baseService';

const smscodeApi = 'operator/smsCode';                                        // 发送验证码  method 'post'
const updatePwdApi = 'operator/updatePwd';                                   // 修改密码  method 'post'
const forgetPwdApi = 'operator/forgetPwd';                                   // 验证码是否过期  method 'post'


// 发送验证码
export const smscodeFun = (payload) => fetch.post(smscodeApi, payload);


// 修改密码
export const updatePwdFun = (payload) => fetch.post(updatePwdApi, payload);


// 验证码是否过期
export const forgetPwdFun = (payload) => fetch.post(forgetPwdApi, payload);
