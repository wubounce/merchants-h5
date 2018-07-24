/* eslint-disable */
import Vue from 'vue';
import Api from '@/utils/Api';
import store from '@/store';

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

  // 初始化wechat
  initWechat() {
    // alert("调用接口的url:" + this.getSignUrl())
    return Vue.axios.post(Api.WECHAT_SIGN, {
      url: this.getSignUrl()
    }).then(config => {
      wx.config({
        debug: process.env.NODE_ENV === 'development', // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: config.appId, // 必填，公众号的唯一标识
        timestamp: config.timeStamp, // 必填，生成签名的时间戳
        nonceStr: config.nonceStr, // 必填，生成签名的随机串
        signature: config.sign, // 必填，签名
        jsApiList: ['chooseWXPay', 'scanQRCode', 'checkJsApi', 'getLocation'] // 必填，需要使用的JS接口列表
      })
    })
  },

  // 获取签名用的url，ios和andriod不同
  getSignUrl() {
    // 如果没有store，初始化store
    // alert(window.__wxjs_is_wkwebview === true ? "是IOS微信" : "不是IOS微信")
    let url = window.location.href.split('#')[0]
    if (!store.state.url) {
      store.commit('updataUrl', url)
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
        cb("http://haiyaxiyi.cn/Wash/skip?NQT=84e5397409274f718ec52509f0be91f2&Company=youfang&CommunicateType=0&Ver=3")
        alert('暂不支持，请使用支付宝生活号或微信公众号')
    }
  }
}

export default Web
