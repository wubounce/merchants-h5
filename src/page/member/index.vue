<template>
<div class="member">
  <q-header :title="title"></q-header>
  <div class="meber-list">
    <div class="momber-wrap">
      <div class="name">
        <router-link :to="{name:'detailMember'}">
          <p>Janet</p><p class="phonenum">19420441735 </p>
        </router-link>
      </div>
      <div class="phone">
        <div class="right"><mt-switch v-model="value" class="check-switch"></mt-switch></div>
      </div>
    </div>
    <p class="memberdesc">权限：首页，报表，店铺新增</p>
  </div>
  <div class="meber-list">
    <div class="momber-wrap">
      <div class="name">
        <router-link :to="{name:'detailMember'}">
          <p>Janet</p><p class="phonenum">19420441735 </p>
        </router-link>
      </div>
      <div class="phone">
        <div class="right"><mt-switch v-model="value" class="check-switch"></mt-switch></div>
      </div>
    </div>
    <p class="memberdesc">权限：首页，报表，店铺新增</p>
  </div>


  <div class="addmember" @click="addmemeber">
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
    addmemeber(){
      this.$router.push({name:'addMember'});
    }
  },
  components:{
    QHeader,
  }
};
</script>
<style type="text/css" lang="less" scoped>
  .meber-list {
    padding:0.21rem 0.4rem;
    background: #fff;
    margin-bottom: 0.21rem;
  }
  .momber-wrap {
    display: flex;
    font-size: 16px;
    color: #333;
    background: #fff;
    margin-bottom: 0.21rem;
    .name , .phone {
      flex: 1;
    }
  }
  .name a {
    color: #333;
  }
  .phone {
    .right {
      float: right;
    }
  }
  .phonenum {
    font-size: 16px;
    color: #999;
  }
  .memberdesc {
    border-top:1px solid #DFE6FF;
    font-size: 14px;
    color: #999;
    padding-top: 0.17rem;
  }
  .check-switch {
    margin-top: 0.16rem;
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
