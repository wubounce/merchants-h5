<template>
<div class="addmember">
  <q-header :title="title"></q-header>
  <div class="add-form">
    <div class="input-group">
      <div class="form-title">用户名</div>
      <div class="form-input">hahadhadf</div>
    </div>
    <div class="input-group">
      <div class="form-title">用户名</div>
      <div class="form-input">hahadhadf</div>
    </div>
    <div class="input-group">
      <div class="form-title">手机</div>
      <div class="form-input">19976890235</div>
    </div>
    <div class="input-group">
      <div class="form-title">负责店铺</div>
      <div class="form-input">企鹅一号店</div>
    </div>
    <div class="input-group" style="border:none">
      <div class="form-title">权限</div>
      <div class="form-input">首页，报表，店铺新增，首页，报表，店铺新增</div>
    </div>

  </div>
  <div class="input-group createtime">
    <div class="form-title">创建时间</div>
    <div class="form-input">2018-04-05 14:00</div>
  </div>
  <div class="footer">
    <span class="edit">编辑</span>
    <span class="del">删除</span>
  </div>
</div>
</template>
<script>
import QHeader from '@/components/header';
export default {
  data() {
    return {
      title: '新增人员',
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
<style type="text/css" lang="less" scoped>
  .add-form {
    padding-left: 0.4rem;
    background: #fff;
  }
  .input-group {
    display: flex;
    border-bottom:1px solid rgba(223,230,255,1);
    font-size: 16px;
    padding: 0.53rem 0;
  }
  .form-title {
    width: 30%;
    color:#999;
  }
  .form-input {
    width: 66%;
    text-align: right;
    color: #333;
  }
  .createtime {
    padding-left: 0.4rem;
    border:none;
    margin-top:0.4rem;
    background:#fff
  }
  .footer {
    width: 100%;
    background: #fff;
    position: fixed;
    bottom: 0;
    font-size: 14px;
    padding: 0.28rem 0;
    > span {
      float: right;
      width: 2.4rem;
      height: 0.8rem;
      line-height: 0.8rem;
      border-radius: 0.11rem;
      text-align: center;
      margin-right: 0.4rem;
    }
    .del {
      border: 1px solid rgba(216,216,216,1);
    }
    .edit {
      border: 1px solid  #1890FF;
      color: #1890FF;
    }
  }
</style>
<style lang="scss">
  .addmember .mint-header {
    background: #fff !important;
    border-bottom: 1px solid #DCE0E6;
  }
</style>
