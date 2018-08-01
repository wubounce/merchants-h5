/**
 *  重置密码
 */
import { fetch } from './baseService';

const smscodeApi = 'operator/smsCode';                                        // 忘记密码模块发送模版消息  method 'post'
const updatePwdApi = 'operator/updatePwd';                                    // 个人中心 修改密码  method 'post'
const validateCodeApi = 'operator/validateCode';                              // 忘记密码模块 验证验证码  method 'post'
const forgetPwdApi = 'operator/changePwd';                                    // 忘记密码模块 修改密码  method 'post'
const bindPhoneApi = 'operator/bindPhone';                                     // 绑定手机  method 'post'

// 忘记密码模块发送模版消息
export const smscodeFun = (payload) => fetch.post(smscodeApi, payload);

// 个人中心 修改密码
export const updatePwdFun = (payload) => fetch.post(updatePwdApi, payload);

// 验证码是否过期
export const validateCodeFun = (payload) => fetch.post(validateCodeApi, payload);

//  忘记密码模块 修改密码
export const forgetPwdFun = (payload) => fetch.post(forgetPwdApi, payload);

//  绑定手机
export const bindPhoneFun = (payload) => fetch.post(bindPhoneApi, payload);
