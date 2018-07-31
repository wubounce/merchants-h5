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




export const device = (payload) => fetch.get(deviceApi, {params: payload}); //登录
export const deviceListFun = (payload) => fetch.post(deviceList, payload); //获取设备列表
export const countDeviceFun = (payload) => fetch.post(countDevice,payload); // 获取机器统计
export const detailDeviceListFun = (payload) => fetch.post(detailDevice,payload); //获取设备管理详情
export const deleteDeviceFun = (payload) => fetch.post(deleteDevice ,payload);  //设备删除
export const manageResetDeviceFun = (payload) => fetch.post(manageResetDevice ,payload);  //设备复位
export const tzjDeviceFun = (payload) => fetch.post(tzjDevice ,payload); //设备桶自洁



