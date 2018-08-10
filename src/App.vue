<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
  import Web from '@/utils/Web';
  export default {
    name: 'App',
    data() {
      return {};
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
