import axios from 'axios';
import { Indicator, MessageBox, Toast } from 'mint-ui';
import store from '../store';
import { getToken, filterData, get_sign } from '@/utils/tool';
import qs from 'qs';
import router from '@/router';
 const baseUrl = process.env.NODE_ENV === 'production' ? 'http://192.168.5.10:8089/merchant/' : 'http://192.168.5.10:8089/merchant/'; 

//const baseUrl = process.env.NODE_ENV === 'production' ? 'https://api.qiekj.com/merchant/' : 'http://192.168.5.10:8089/merchant/'; 

// 创建axios实例
const http = axios.create({
  baseURL: baseUrl, // api的base_url
  timeout: 30000, // 请求超时时间
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'brackets' });
  }
});
// http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
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

  config.data = filterData(config.data);//格式化参数;
  let token = getToken();
  let _timestamp = (new Date()).getTime();
  //const whiteList = ['shop/vip/save']; // 解决添加接口表单重复添加问题
  if (token) {
    // if (whiteList.indexOf(config.url) !== -1) {
    //   console.log(123123);
    //   // next();
    //   // http.post('common/getRequestId', {token:token}).then(res=>{
    //   //   console.log(res);
    //   // });
    // }else {
    // }
    // 阻止转义
    config.data = config.data ? config.data + `&token=${token}`:`token=${token}`;
    if(config.url == '/batchExecutePlan/updateBatchStart' || config.url == '/batchExecutePlan/add' ) {
      config.data = config.data.split('+').join(' ');
    }
    // 添加签名
    let _sign = get_sign(config.data,_timestamp);
    config.data = config.data + `&_sign=${_sign}`+`&_timestamp=${_timestamp}`;
  }else{
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
    if (response.status === 200 && response.data.code===0) {
      // 时间验证 & 把时间放到vuex中
      if (response.data.t > 0) {
        let offset = response.data.t - new Date().getTime();
        if (Math.abs(offset) > 10 * 60 * 1000) {
          MessageBox.alert('客户端时间不合法，会影响正常业务使用[t: ' + offset + ']', '注意');
        }
        store.commit('setServerTimeOffset', parseInt(offset / 1000));
      }
      return Promise.resolve(response.data.data);

    }else if (response.status === 200 && response.data.code === 11) { //11:Token 过期了;
      store.dispatch('LogOut').then(() => {
        location.reload();
      });
    }else if (response.status === 200 && response.data.code === 7004) {  //11:无权限;
        store.dispatch('LogOut').then(() => {
          location.reload();
        });
    }else {
      if (response.data.code === 10) {
        store.dispatch('LogOut').then(() => {
          location.reload();
        });
      } else {
        Toast(response.data.msg);
        return Promise.reject(response.data);
      }

    }
  },
  error => {
    MessageBox.alert(error);
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
