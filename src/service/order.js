/**
 *  订单
 */
import { fetch } from './baseService';

const orderListApi = '/order/getOrderList';                                            // 订单列表 method 'post'
const orderRefundApi = '/order/refund';                                                // 订单退款 method 'post'
const machineResetApi = '/machine/reset';                                              // 订单列表，复位 method 'post'
const machineBootApi = '/machine/boot';                                                // 订单列表，启动 method 'post'
      
// 订单列表
export const orderListFun = (payload) => fetch.post(orderListApi, payload);

//订单退款
export const ordeRrefundFun = (payload) => fetch.post(orderRefundApi, payload);

//订单列表，复位
export const machineResetFun = (payload) => fetch.post(machineResetApi, payload);

// 订单列表，启动
export const machineBootFun = (payload) => fetch.post(machineBootApi, payload);


