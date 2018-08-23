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
 .add-form {
    padding: 0 0.4rem;
    background: #fff;
    .input-group {
      height: 1.17rem;
      line-height: 1.17rem;
      border-bottom:1px solid #f9f8ff;
      font-size: 16px;
    }
    .input-group:last-child {
      border:none;
    }
    .forward {
      float: right;
      color: #999;
    }
  }
  .deleteShop {
      button {
        display: block;
        margin: 0.7rem auto;
        width: 92%;
        background-color:#1890FF;
        border: none;
        border-radius: 5px;
        color:#fff;
        font-size:16px;
        padding: 0.35rem 0;
      }
    }
</style>
