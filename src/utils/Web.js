/* eslint-disable */
import Vue from 'vue';
import qs from "qs";
import Api from '@/utils/Api';
import store from '@/store';
import axios from 'axios';
import { getWxconfigFun } from '@/service/device';

// 页面相关工具类
const Web = {
  getUA() {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      //判断是不是微信
      return "wechat";
    } else if (ua.match(/AlipayClient/i) == 'alipayclient') {
      //判断是不是支付宝
      return "alipay";
    } else {
      //哪个都不是
      return false;
    }
  },
  getAppUA(){
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {  //判断iPhone|iPad|iPod|iOS
        return true;
    } else if (/(Android)/i.test(navigator.userAgent)) {   
        return false;
    }
  },

  // 第三方授权
  authorize (redirect_uri) {
		switch (this.getUA()) {
			case 'wechat' : 
				window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6a29be6729902389&redirect_uri=' + encodeURIComponent(redirect_uri) + '&response_type=code&scope=snsapi_userinfo#wechat_redirect'
				return
			case 'alipay' :
			default: 
				window.location.href = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2018031202359867&scope=auth_user,auth_life_msg&redirect_uri=' + encodeURIComponent(redirect_uri)
		}
	},
  // 初始化wechat
  initWechat() {
    // alert("调用接口的url:" + this.getSignUrl())
    let payload = {
      url: this.getSignUrl()
    };
    getWxconfigFun(qs.stringify(payload)).then(config => {
      console.log(config)
      wx.config({
        debug: process.env.NODE_ENV === 'development', // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: config.data.appId, // 必填，公众号的唯一标识
        timestamp: config.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: config.data.nonceStr, // 必填，生成签名的随机串
        signature: config.data.signature, // 必填，签名
        jsApiList: ['chooseWXPay', 'scanQRCode', 'checkJsApi', 'getLocation'] // 必填，需要使用的JS接口列表
      })
      wx.error(err => {
				 window.location.reload() 
        // alert(url)
				 alert(JSON.stringify(err))
			})
    })
  },

  // 获取签名用的url，ios和andriod不同
  getSignUrl() {
    // 如果没有store，初始化store
    // alert(window.__wxjs_is_wkwebview === true ? "是IOS微信" : "不是IOS微信")
    let url = window.location.href.split('#')[0]
    if (!store.state.url) {
      store.commit('setUrl', url)
    }
    return window.__wxjs_is_wkwebview === true ? store.state.url : url
  },


  // 调用扫一扫，兼容支付宝和微信
  scanQRCode(cb) {
    switch (this.getUA()) {
      case 'wechat':
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          success: function (res) {
            cb(res.resultStr)
          }
        });
        return
      case 'alipay':
        ap.scan(function (res) {
          cb(res.code)
        });
        return
      default:
        alert('暂不支持，请使用支付宝生活号或微信公众号')
    }
  }
}

export default Web
