/**
 *  首页
 */
import { fetch } from './baseService';

const listParentTypeApi = 'machine/listParentType';                          // 设备监控 method 'post'
const countMachineApi = 'machine/countMachine';                              // 设备监控 method 'post'
const totalProfitApi = 'order/totalProfit';                                  // 总收益 method 'post'
const timeProfitApi = 'order/timeProfit';                                    // 收益数据 method 'post'
const typeProfitApi = 'order/typeProfit';                                    // 收益分布 method 'post'

// 设备监控
export const ParentTypeFun = (payload) => fetch.post(listParentTypeApi, payload);

// 设备监控
export const countMachineFun = (payload) => fetch.post(countMachineApi, payload);

// 总收益
export const totalProfitFun = (payload) => fetch.post(totalProfitApi, payload);

// 收益数据
export const timeProfitFun = (payload) => fetch.post(timeProfitApi, payload);

// 收益分布
export const typeProfitFun = (payload) => fetch.post(typeProfitApi, payload);
