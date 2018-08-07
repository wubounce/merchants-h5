import axios from 'axios';
import { Indicator, MessageBox } from 'mint-ui';
import store from '../store';
import { getToken } from '@/utils/tool';
const baseUrl = process.env.NODE_ENV === 'production' ? 'http://192.168.5.10:8089/merchant/' : 'http://192.168.5.10:8089/merchant/'; 
// 创建axios实例
const http = axios.create({
  baseURL: baseUrl, // api的base_url
  timeout: 50000 // 请求超时时间
});

// request拦截器
http.interceptors.request.use(config => {
  //console.log(config.url);
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
  if (config.method === 'post' && config.headers['Content-Type'] !== 'multipart/form-data') {
    config.headers['content-type'] = 'application/x-www-form-urlencoded';
  }
  if (token && config.headers['Content-Type'] !== 'multipart/form-data') {
      config.data = config.data ? config.data + `&token=${token}`:`token=${token}`;
    }
  return config;
}, error => {
  MessageBox.alert('加载超时');
  Promise.reject(error);
});

// respone拦截器
http.interceptors.response.use(
  response => {
    if (response.status === 200) {
      Indicator.close();
      // 时间验证 & 把时间放到vuex中
      if (response.data.t > 0) {
        let offset = response.data.t - new Date().getTime();
        if (Math.abs(offset) > 10 * 60 * 1000) {
          console.log(offset);
          MessageBox.alert('客户端时间不合法，会影响正常业务使用[t: ' + offset + ']', '注意');
        }

        store.commit('setServerTimeOffset', parseInt(offset / 1000));

      }
      return Promise.resolve(response.data);
    }else {
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (response.data.code === 50008 || response.data.code === 50012 || response.data.code === 50014) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload();// 为了重新实例化vue-router对象 避免bug
          });
        });
      }
      return Promise.reject(response.data);
    }
  },
  error => {
    Indicator.close();
    MessageBox.alert('服务器开小差了');
    return Promise.reject(error);
  }
);

export default http;
