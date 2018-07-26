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
      <div class="form-title"><span>账户设置</span><span class="forward iconfont icon-nextx"></span></div>
    </div>
  </div>
</div>
</template>
<script>
import QHeader from '@/components/header';
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
    QHeader,

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
</style>
