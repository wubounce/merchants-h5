/**
 *  帮助中心
 */
import { fetch } from './baseService';

const listApi = 'help/list';                                        // 帮助中心列表 method 'post'


// 帮助中心列表
export const helpListFun = (payload) => fetch.post(listApi, payload);
