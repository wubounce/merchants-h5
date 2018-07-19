/**
 *  登录
 */
import { fetch } from './baseService';

const shopListApi = 'shop/list';                                            // 登录 method 'get'

// 登录
export const shopList = (payload) => fetch.get(shopListApi,  { params: payload });

