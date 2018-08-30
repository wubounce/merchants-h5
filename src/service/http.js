import axios from 'axios';
import { Indicator, MessageBox, Toast } from 'mint-ui';
import store from '../store';
import { getToken, removeMenu,get_sign } from '@/utils/tool';

import { menuSelectFun } from '@/service/member';
const baseUrl = process.env.NODE_ENV === 'production' ? 'http://192.168.5.10:8089/merchant/' : 'http://192.168.4.70:8089/merchant/'; 
// 创建axios实例
const http = axios.create({
  baseURL: baseUrl, // api的base_url
  timeout: 30000 // 请求超时时间
});

// request拦截器
http.interceptors.request.use(config => {
  //由于省市区三级联动调用三次接口，避免闪屏现象，如下操作
  if(config.url != 'area/list' && config.url != '/common/uploadFile' && config.url !='operator/updateOperator') {
    Indicator.open({
      text: "加载中",
      spinnerType: "fading-circle"
    });
  }
  if( config.url == '/common/uploadFile') {
    Indicator.open({
      text: "图片上传中",
      spinnerType: "fading-circle"
    });
  }
  
  let token = getToken();
  let _timestamp = (new Date()).getTime();
  if (config.method === 'post' && config.headers['Content-Type'] !== 'multipart/form-data') {
    config.headers['content-type'] = 'application/x-www-form-urlencoded';
  }
  if (token && config.headers['Content-Type'] !== 'multipart/form-data') {
    console.log(config.data);
    config.data = config.data ? config.data + `&token=${token}`:`token=${token}`;
    // 添加签名
    let _sign = get_sign(config.data,_timestamp);
    config.data = config.data + `&_sign=${_sign}`+`&_timestamp=${_timestamp}`;
  }
  else if( !token && config.headers['Content-Type'] !== 'multipart/form-data' ){
    let _sign = get_sign(config.data,_timestamp);
    config.data =  config.data + `&_sign=${_sign}` + `&_timestamp=${_timestamp}`;
  }
  return config;
}, error => {
  MessageBox.alert('加载超时');
  Promise.reject(error);
});

// respone拦截器
http.interceptors.response.use(
  response => {
    Indicator.close();
    if (response.status === 200) {
      // 时间验证 & 把时间放到vuex中
      if (response.data.t > 0) {
        let offset = response.data.t - new Date().getTime();
        if (Math.abs(offset) > 10 * 60 * 1000) {
          MessageBox.alert('客户端时间不合法，会影响正常业务使用[t: ' + offset + ']', '注意');
        }
        store.commit('setServerTimeOffset', parseInt(offset / 1000));
      }
      //11:Token 过期了;
      if (response.data.code === 11) {
        store.dispatch('LogOut').then(() => {
          location.reload();
        });
      }
      if (response.data.code === 7004) {
        store.dispatch('LogOut').then(() => {
          location.reload();
        });
      }
      return Promise.resolve(response.data);

    }else {
      Toast(response.data.msg);
      return Promise.reject(response.data);
    }
  },
  error => {
    Indicator.close();
    if (error.message.includes('timeout')) {
      MessageBox.alert('请求超时，请重新操作', '提示', {type: 'warning'});
    }else {
      MessageBox.alert("服务器开小差了", '错误', {type: 'error'});
    }
    return Promise.reject(error);
  }
);

export default http;
