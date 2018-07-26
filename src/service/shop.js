/**
 *  店铺列表
 */
import { fetch } from './baseService';

const areaListApi = 'area/list'; //获取区域列表 method 'get'
const manageListApi = '/shop/manageList'; //店铺列表，店铺名称  method 'post'
const detailApi = '/shop/detail'; //店铺详情  method 'post'
const addShopApi = '/shop/addOrEdit'; //添加店铺 method 'post'

export const areaListFun = (payload) => fetch.post(areaListApi, payload); //获取区域列表
export const manageListFun = (payload) => fetch.post(manageListApi, payload); //店铺列表
export const shopDetailFun = (payload) => fetch.post(detailApi, payload); //店铺详情
export const addShopFun = (payload) => fetch.post(addShopApi, payload); //新增店铺
