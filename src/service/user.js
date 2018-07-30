/**
 *  登录
 */
import { fetch } from './baseService';

const getOperatorApi = 'operatorBalanceLog/getOperator';                             // 我的 method 'post'
const getApplyFinanceApi = 'operatorBalanceLog/getApplyFinance';                     // 获取商户可提现余额 method 'post
const getApplyaccountApi = 'operatorBalanceLog/getMoneySubmit';                     // 获取支付宝账号和余额 method 'post

const applyMoneySubmitApi = 'operatorBalanceLog/applyMoneySubmit';                   // 提交提现申请 method 'post'
const getApplyListApi = 'operatorBalanceLog/getApplyList';                           // 收支明细 method 'post'
const getOrderDetailApi = 'order/getOrderDetail';                                    // 收支明细界面获取支付订单，退款订单详情 method 'post'
const getMoneySubmitDetailApi = 'order/getMoneySubmitDetail';                        // 提现记录界面获取提现订单详情 method 'post'


// 我的
export const getOperatorFun = (payload) => fetch.post(getOperatorApi,payload);

// 获取商户可提现余额
export const getApplyFinanceFun = (payload) => fetch.post(getApplyFinanceApi,payload);

// 获取支付宝账号和余额
export const getApplyaccountFun = (payload) => fetch.post(getApplyaccountApi,payload);

// 提交提现申请
export const applyMoneySubmitFun = (payload) => fetch.post(applyMoneySubmitApi,payload);

// 收支明细
export const getApplyListFun = (payload) => fetch.post(getApplyListApi,payload);

// 退款订单详情
export const getOrderDetailFun = (payload) => fetch.post(getOrderDetailApi,payload);

// 获取提现订单详情
export const getMoneySubmitDetailFun = (payload) => fetch.post(getMoneySubmitDetailApi,payload);


   