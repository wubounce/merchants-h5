/**
 *  店铺列表
 */
import { fetch } from './baseService';

const areaListApi = 'area/list'; //获取区域列表 method 'post'
const manageListApi = '/shop/manageList'; //店铺列表，店铺名称  method 'post'
const detailApi = '/shop/detail'; //店铺详情  method 'post'
const addOrEditShopApi = '/shop/addOrEdit'; //新增或编辑店铺 method 'post'

const listParentTypeApi = '/machine/listParentType'; //获取一级类型 method 'post'

export const areaListFun = (payload) => fetch.post(areaListApi, payload); //获取区域列表
export const manageListFun = (payload) => fetch.post(manageListApi, payload); //店铺列表
export const shopDetailFun = (payload) => fetch.post(detailApi, payload); //店铺详情
export const addOrEditShopFun = (payload) => fetch.post(addOrEditShopApi, payload); //新增或编辑店铺
export const listParentTypeFun = (payload) => fetch.post(listParentTypeApi, payload); //获取区域列表
