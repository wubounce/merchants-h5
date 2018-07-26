/**
 *  时段营销
 */
import { fetch } from './baseService';

const timeMarketListApi = '/timeMarket/list';                                            // 获取时段营销列表 method 'post'

// 获取时段营销列表
export const timeMarketListFun = (payload) => fetch.post(timeMarketListApi,  payload);

