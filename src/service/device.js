/**
 *  设备相关接口
 */
import {
  fetch
} from './baseService';

//api
const deviceApi = 'account/login'; // 登录 method 'post'
const deviceList = '/machine/manageList'; //获取设备列表 method 'post'
const countDevice = '/machine/countMachine';  //获取机器统计 method 'post'
const detailDevice = '/machine/detail'; //设配管理详情
const deleteDevice = '/machine/delete'; //删除设备
const manageResetDevice = '/machine/manageReset' ;//设备复位
const tzjDevice = '/machine/tzj'; //桶自洁
const getWxConfig = '/common/getWxConfig'; //获取微信接口配置信息
const getShop = '/shop/manageList'; // 店铺管理 method 'post'
const getlistParentType = '/machine/listParentType'; //一级类型 method 'post'
const getlistSubType = '/machine/listSubType'; //二级类型 method 'post'
const getFunctionSetList = '/machine/functionList'; //功能设置列表 method 'post'
const deviceAddorEdit = '/machine/addOrEdit'; //设备编辑 method 'post'
const batchFunctionSetList = '/batchExecutePlan/getFunctionList'; //批量获取功能列表 method ‘post'
const batchEdit = '/machine/batchEdit'; //批量编辑


export const device = (payload) => fetch.get(deviceApi, {params: payload}); //登录
export const deviceListFun = (payload) => fetch.post(deviceList, payload); //获取设备列表
export const countDeviceFun = (payload) => fetch.post(countDevice,payload); // 获取机器统计
export const detailDeviceListFun = (payload) => fetch.post(detailDevice,payload); //获取设备管理详情
export const deleteDeviceFun = (payload) => fetch.post(deleteDevice ,payload);  //设备删除
export const manageResetDeviceFun = (payload) => fetch.post(manageResetDevice ,payload);  //设备复位
export const tzjDeviceFun = (payload) => fetch.post(tzjDevice ,payload); //设备桶自洁
export const getWxconfigFun = (payload) => fetch.post(getWxConfig,payload); //获取微信接口配置信息
export const getShopFun = (payload) => fetch.post(getShop,payload); //获取店铺列表
export const getlistParentTypeFun = (payload) => fetch.post(getlistParentType,payload); //获取一级类型
export const getlistSubTypeFun = (payload) => fetch.post(getlistSubType,payload); //获取二级类型
export const getFunctionSetListFun = (payload) => fetch.post(getFunctionSetList,payload); //获取功能列表
export const deviceAddorEditFun = (payload) => fetch.post(deviceAddorEdit,payload); //设备编辑添加
export const batchFunctionSetListFun = (payload) => fetch.post(batchFunctionSetList,payload); //批量回能功能列表
export const batchEditFun = (payload) => fetch.post(batchEdit,payload); //批量编辑




