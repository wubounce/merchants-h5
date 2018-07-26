<template>
<div class="marketing">
  <q-header :title="title"></q-header>
    <div class="add-form">
    <div class="input-group">
        <div class="form-title"><span>账号</span><span class="forward">157 2669 4131</span></div>
    </div>
    <div class="input-group">
      <div class="form-title"><span>姓名</span><span class="forward">张*高</span></div>
    </div>
     <div class="input-group">
      <div class="form-title"><span>所在地区</span><span class="forward iconfont icon-nextx"></span><span class="forward">ewrtertertwertre</span></div>
    </div>
  </div>
</div>
</template>
<script>
import QHeader from '@/components/header';
export default {
  data() {
    return {
      title: '个人信息',
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
