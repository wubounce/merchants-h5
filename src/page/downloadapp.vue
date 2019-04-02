<template>
  <div class="download-page">
    <img class="logo" src="https://static.qiekj.com/merchants-h5/logo@3x.png" alt="">
    <a target="_blank" href="https://qiekj-static.oss-cn-shanghai.aliyuncs.com/soft/qiekj_merchant.apk" v-if="android">
      <img class="downbtn" src="https://static.qiekj.com/merchants-h5/downbtn.png" alt="" @click="godownload">
    </a>
    <a target="_blank" href="https://itunes.apple.com/cn/app/id1454770632?mt=8" v-if="ios">
      <img class="downbtn" src="https://static.qiekj.com/merchants-h5/downbtn.png" alt="" @click="godownload">
    </a>
    <img class="downbg" src="https://static.qiekj.com/merchants-h5/downbg.png" alt="">
    <div class="an-download-wrap" v-if="browser">
      <img class="arrow" src="https://static.qiekj.com/merchants-h5/arrow.png" alt="">
      <p class="browser">请点击右上角用浏览器打开下载</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      ios: false,
      android: false,
      browser: false,
    };
  },
  components: {

  },
  mounted () {
    this.godownload();
  },
  methods: {
    godownload () {
      var u = navigator.userAgent, app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        this.android = true;
        this.browser = true;
      }
      if (isIOS) {
        this.ios = true;
      }
    }
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.download-page {
  background: #fff;
  height: 100%;
  img {
    display: block;
  }
  .logo {
    width: 5rem;
    height: 5.58rem;
    margin: 0 auto;
    padding-top: 1.4rem;
  }
  .downbtn {
    width: 5.6rem;
    height: 1rem;
    margin: 0 auto;
    padding-top: 2.25rem;
  }
  .downbg {
    width: 10rem;
    height: 4.4rem;
    position: fixed;
    bottom: 0;
  }
}
.an-download-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 19999999;
  padding-top: 1.33rem;
}
.arrow {
  display: block;
  width: 2.5rem;
  height: 2rem;
  position: absolute;
  top: 0.64rem;
  right: 0.7rem;
}
.browser {
  color: #fff;
  text-align: center;
  margin-top: 4.4rem;
  font-size: 14px;
}
</style>
