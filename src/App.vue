<template>
  <div id="app">
    <!-- <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" /> -->
    <router-view />
  </div>
</template>

<script>
  import Web from '@/utils/Web';
  export default {
    name: 'App',
    data() {
      return {};
    },
    mounted(){
      // document.body.addEventListener('touchmove', function (e) {
      //     e.preventDefault();// 阻止默认的处理方式(阻止下拉滑动的效果)
      // }, {passive: false}); // passive 参数不能省略，用来兼容ios和android
    },
    methods: {
      // 如果是微信，在每次路由改变的时候，重新获取config
      initWechat() {
        if (Web.getUA() === 'wechat') {
          Web.initWechat();
        }
      }
    },
    watch: {
      '$route' () {
        this.initWechat();
      }
    },
  };

</script>

<style>
  @import "../static/sass/base.scss";
  #app {
    font-family: "PingFang SC", 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
  }

</style>
