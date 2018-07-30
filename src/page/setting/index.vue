<template>
<div class="marketing">
  <q-header :title="title"></q-header>
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
    <router-link :to="{name:'login'}">
      <button>退出登录</button>
    </router-link>
  </div>
</div>
</template>
<script>
import QHeader from '@/components/header';
import Button from "@/components/Button/Button";
export default {
  data() {
    return {
      title: '设置',
    };
  },
  mounted() {
    
  },
  created(){
 
  },
  methods: {
    
  },
  components:{
    QHeader
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
      border-bottom:1px solid #E5E5E5;
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
