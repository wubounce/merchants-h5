<template>
<div class="member">
  <q-header :title="title"></q-header>
  <div class="momber-wrap">
    <div class="name">Janet</div>
    <div class="phone">
      <div>19420441735 </div>
      <div><mt-switch v-model="value" class="check-switch"></mt-switch></div>
    </div>
  </div>
  <div class="momber-wrap">
    <div class="name">Janet</div>
    <div class="phone">
      <div>19420441735 </div>
      <div><mt-switch v-model="value" class="check-switch"></mt-switch></div>
    </div>
  </div>
  <div class="momber-wrap">
    <div class="name">Janet</div>
    <div class="phone">
      <div>19420441735 </div>
      <div><mt-switch v-model="value" class="check-switch"></mt-switch></div>
    </div>
  </div>
  <div class="momber-wrap">
    <div class="name">Janet</div>
    <div class="phone">
      <div>19420441735 </div>
      <div><mt-switch v-model="value" class="check-switch"></mt-switch></div>
    </div>
  </div>
  <div class="addmember">
    <span class="order-action iconfont icon-nextx"></span><br>
    <span>人员</span>
  </div>
</div>
</template>
<script>
import QHeader from '@/components/header';
export default {
  data() {
    return {
      title: '人员管理',
      value: false,
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
  .momber-wrap {
    height: 1.65rem;
    line-height: 1.65rem;
    display: flex;
    padding:0 0.4rem;
    font-size: 16px;
    color: #333;
    background: #fff;
    margin-bottom: 0.13rem;
    > div {
      flex: 1;
    }
  }
  .phone {
    display: flex;
    >div {
      flex: 1;
    }
  }
  .check-switch {
    margin-top: 0.37rem;
    margin-left: 0.27rem;
  }
  .addmember {
    width:1.49rem;
    height:1.49rem;
    background:#1890FF;
    border-radius: 50%;
    font-size:12px;
    font-family:PingFangSC-Regular;
    color:rgba(255,255,255,1);
    text-align: center;
    -moz-box-shadow:0px 0.03rem 0.4rem rgba(24,144,255,0.75); 
    -webkit-box-shadow:0px 0.03rem 0.4rem rgba(24,144,255,0.75);
    box-shadow: 0px 0.03rem 0.4rem rgba(24,144,255,0.75);
    position: fixed;
    bottom:0.55rem;
    right: 0.64rem;
    .order-action {
      display: inline-block;
      margin-top: 0.2rem;
      font-size: 16px;
      color: #fff;
    }
  }
</style>
<style>
  .member .mint-header {
    background: #fff !important;
    border-bottom: 1px solid #DCE0E6;
  }
  .member .mint-switch-input:checked + .mint-switch-core {
    border-color: #4DD865;
    background-color: #4DD865;
  }
</style>
