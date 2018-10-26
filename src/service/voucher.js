/**
 *  优惠券
 */
import { fetch } from './baseService';

const listApi = 'voucher/list';                                        // 优惠券列表 method 'post'
const detailApi = 'voucher/detail';                                    // 优惠券详情 method 'post'
const countApi = 'voucher/count';                                    // 优惠券详情 method 'post'


// 优惠券列表
export const voucherListFun = (payload) => fetch.post(listApi, payload);

// 优惠券详情
export const voucherDetailFun = (payload) => fetch.post(detailApi, payload);

// 优惠券数量
export const voucherCountFun = (payload) => fetch.post(countApi, payload);


