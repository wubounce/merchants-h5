<template>
<div class="member" v-title="title">
  <div class="no-discount-list" v-if="list.lenght<=0">暂无二级管理账号</div>
  <div class="meber-list" v-for="(item,index) in list" :key="index">
    <div class="momber-wrap">
      <div class="name">
        <router-link :to="{name:'detailMember',query:{ id:item.id }}">
          <p>{{item.userName}}</p><p class="phonenum">{{item.phone}}</p>
        </router-link>
      </div>
      <div class="phone">
        <div class="right"><mt-switch v-model="item.isLock" class="check-switch"></mt-switch></div>
      </div>
    </div>
    <!-- <p class="memberdesc">权限：首页，报表，店铺新增</p> -->
  </div>
  <div class="addmember" @click="addmemeber">
    <span class="order-action iconfont icon-tianjia"></span><br>
    <span>人员</span>
  </div>
</div>
</template>
<script>
import { operatorListFun } from '@/service/member';
import { memberIsLock } from '@/utils/mapping';
export default {
  data() {
    return {
      title: '人员管理',
      value: false,
      list:[]
    };
  },
  mounted() {
    
  },
  created(){
    this.getMemberList();
  },
  methods: {
    async getMemberList(){
      let res = await operatorListFun();
      res.data.forEach((item)=>{
        if (item.isLock === 0) {
          item.isLock = true;
        } else {
          item.isLock = false;
        }
      });
      this.list = res.data;
    },
    addmemeber(){
      this.$router.push({name:'addMember'});
    }
  },
  components:{
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
    margin-top: 0.11rem;
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
