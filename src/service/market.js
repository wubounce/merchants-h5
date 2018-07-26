/**
 *  时段营销
 */
import { fetch } from './baseService';

const timeMarketListApi = '/timeMarket/list';                                            // 获取时段营销列表 method 'post'
const addOruPdateApi = '/timeMarket/saveTimeMarket';                                     // 添加/更新时段营销 method 'post'
const delMarketApi = '/timeMarket/deleteTimeMarket';                                     // 删除时段营销 method 'post'

// 获取时段营销列表
export const timeMarketListFun = (payload) => fetch.post(timeMarketListApi,  payload);

// 添加/更新时段营销 
export const addOruPdateFun = (payload) => fetch.post(addOruPdateApi,  payload);

// 删除时段营销
export const delMarketFun = (payload) => fetch.post(delMarketApi,  payload);

