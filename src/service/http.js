import axios from 'axios';
import { Indicator, MessageBox, Toast } from 'mint-ui';
import { getToken, filterData, get_sign } from '@/utils/tool';
import qs from 'qs';
import router from '@/router';
import store from '@/store';

// 创建axios实例
const http = axios.create({
  baseURL: process.env.API_URL, // api的base_url
  timeout: 30000, // 请求超时时间
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'brackets' });
  }
});
// http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// request拦截器
http.interceptors.request.use(config => {
  //由于省市区三级联动调用三次接口，避免闪屏现象，如下操作
  let urlWhite = [ 'area/list','/common/uploadFile','operator/updateOperator','operator/checkPhone'];
  if(urlWhite.indexOf(config.url) === -1) {
    Indicator.open({
      text: "加载中",
      spinnerType: "fading-circle"
    });
  }
  if(config.url == '/common/uploadFile') {
    Indicator.open({
      text: "图片上传中",
      spinnerType: "fading-circle"
    });
  }

  config.data = filterData(config.data);//格式化参数;
  let token = getToken();
  let _timestamp = (new Date()).getTime();
  if (token) {
    // 阻止转义
    if(store.state.user.userInfo){
      config.data = config.data ? config.data + `&token=${token}&uid=${store.state.user.userInfo.id}`:`&token=${token}&uid=${store.state.user.userInfo.id}`;
    }else {
      config.data = config.data ? config.data + `&token=${token}`:`&token=${token}`;
    }
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
  Indicator.close();
  MessageBox.alert('请求超时，请重新操作', '提示', {type: 'warning'});
  Promise.reject(error);
});

// respone拦截器
http.interceptors.response.use(
  response => {
    Indicator.close();
    if (response.status === 200 && response.data.code===0) {
      return Promise.resolve(response.data.data);
    }else if (response.status === 200 && response.data.code === 11) { //11:Token 过期了;
      store.dispatch('LogOut').then(() => {
        location.reload();
      });
    }else if (response.status === 200 && response.data.code === 7004) {  //11:无权限;
        store.dispatch('LogOut').then(() => {
          location.reload();
        });
    }else if (response.status === 200 && response.data.code === 8002) {  //11:运营商不存在;
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
    Indicator.close();
    if (error.message.includes('timeout')) {
      MessageBox.alert('请求超时，请重新操作', '提示', {type: 'warning'});
    }else if(error.message.includes('Network Error')){
      MessageBox.alert("网络不给力，试试看刷新页面", '提示', {type: 'warning'});
    }else {
      MessageBox.alert("服务器开小差了", '错误', {type: 'error'});
    }
    return Promise.reject(error);
  }
);

export default http;
