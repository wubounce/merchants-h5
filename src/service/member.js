/**
 *  人员管理
 */
import { fetch } from './baseService';

const operatorListApi = 'operator/listOperator';                                            // 获取管理员列表 method 'post'
const addOperatorApi = 'operator/addOperator';                                              // 新增管理员 method 'post'
const getOperatorInfoApi = 'operator/getOperatorInfo';                                      // 查询管理员详情 method 'post'
const updateOperatorInfoApi = 'operator/updateOperatorInfo';                                // 更新管理员 method 'post'
const shopListApi = '/shop/listShop';                                                           // 店铺列表 method 'post'
      
// 获取管理员列表
export const operatorListFun = (payload) => fetch.post(operatorListApi, payload);

//新增管理员
export const addOperatorFun = (payload) => fetch.post(addOperatorApi, payload);

//查询管理员详情
export const getOperatorInfoFun = (payload) => fetch.post(getOperatorInfoApi, payload);

// 更新管理员
export const updateOperatorInfoFun = (payload) => fetch.post(updateOperatorInfoApi, payload);

//店铺列表
export const shopListFun = (payload) => fetch.post(shopListApi, payload);


