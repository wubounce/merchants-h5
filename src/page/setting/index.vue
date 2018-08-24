<template>
<div class="marketing" v-title="title">
  <div class="add-form">
    <div class="input-group">
      <router-link :to="{name:'personalSet'}">
          <div class="form-title"><span>个人信息</span><span class="forward iconfont icon-nextx"></span></div>
      </router-link>
    </div>
    <div class="input-group">
      <router-link :to="{name:'accountSet'}">
          <div class="form-title"><span>账户设置</span><span class="forward iconfont icon-nextx"></span></div>
      </router-link>
    </div>
  </div>
  <div class="deleteShop">
    <button @click="logOut()">退出登录</button>
  </div>
</div>
</template>
<script>
import Button from "@/components/Button/Button";
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      title: '设置',
    };
  },
  mounted() {
    //注释
  },
  created(){
 
  },
  methods: {
    ...mapActions(['LogOut']),
    logOut () {
      this.LogOut();
      this.$router.push({name:'login'});
    },
  }
};
</script>
<style type="text/css" lang="scss" scoped>
 @import '../../assets/scss/setting/index';
</style>
