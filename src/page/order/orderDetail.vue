<template>
<div class="order-detail">
  <q-header :title="title"></q-header>
   <div class="order-status">{{'已支付' | orserStatus}}</div>
    <div class="order-title">紫金港路浙江大学时湖校区西区C4号</div>
  <div class="alllist">
    <section class="order-list">  
     
      <div class="detail">  
        <div class="orderpic"><img src="../../assets/img/home/icon_near2x.png" alt=""></div>
        <div class="content">
            <p class="con-title">海尔8KgFh069Fd2F</p>
            <p class="con-type">标准洗<span style="padding:0 0.346667rem">|</span>时长40分钟</p>
            <p class="con-price">¥560</p>
        </div>
      </div>
    </section>
  </div>

  <section class="total-wrap">
    <div class="total-border">
      <div class="vip">VIP会员卡</div>
      <div class="discount">-¥2.4</div>
    </div>
  </section>
  <section class="money-wrap">
    <span class="heji">合计：</span>
    <span class="money">¥5.60</span>
  </section>
  <section class="total-wrap">
    <div class="total-border">
      <div class="vip">用户账号：18767567866</div>
    </div>
  </section>
  <section class="oder-time" style="margin-bottom:1.3rem;">
    <span>下单时间：2018-06-13 11:08</span>
  </section>
   <section class="listaction"> 
    <span @click="orderRefund">退款</span>
    <span @click="machineBoot">启动</span>
    <span @click="machineReset">复位</span>
  </section>
</div>
</template>
<script>
import qs from 'qs';
import QHeader from '@/components/header';
import { orderStatus } from '@/utils/mapping';
import { ordeRrefundFun, machineResetFun, machineBootFun } from '@/service/order';
import { MessageBox } from 'mint-ui';
export default {
  data() {
    return {
      title: '订单管理',
      searchData:''
    };
  },
  mounted() {
    
  },
  created(){

  },
  methods: {
    machineReset(){ //设备复位
      MessageBox.confirm('确定复位企鹅1号机？').then(async () => {
          let query = this.$route.query;
          let payload = {machineId:query.machineId,orderNo:query.orderNo};
          let res = await machineResetFun(qs.stringify(payload));
          console.log(res);
      });
      
    },
    async machineBoot(){ //设备启动
      MessageBox.confirm('确定启动企鹅1号机？').then(async () => {
        let query = this.$route.query;
        let payload = {orderId:query.orderNo};
        let res = await machineBootFun(qs.stringify(payload));
         console.log(res);
      });
      
    },
    async orderRefund(){ //退款
      MessageBox.confirm('确定退款？').then(async () => {
        let query = this.$route.query;
        let payload = {orderNo:query.orderNo};
        let res = await ordeRrefundFun(qs.stringify(payload));
         console.log(res);
      });
      
    },
  },
  filters: {
    orserStatus: function (value) {
      return orderStatus(value);
    },
  },
  components:{
    QHeader,
  }
};
</script>
<style type="text/css" lang="less" scoped>
  .order-status {
    width:1005;
    height:1.33rem;
    line-height: 1.33rem;
    background:rgba(24,144,255,1);
    font-size: 16px;
    color: #fff;
    font-weight: 600;
    font-family:PingFangSC-Medium;
    padding-left: 0.4rem;
  }
  .alllist {
     margin-bottom: 0.266667rem;
  }
  .order-title {
    font-size: 16px;
    color: #333;
    background: #fff;
    padding-left: 0.4rem;
    height: 1.31rem;
    line-height: 1.31rem;
  }
  .order-list {
    padding:0.4rem;
    background:rgba(248,252,255,1);
    .detail {
      display: flex;
      padding-top:0.373333rem; 
    }
    .orderpic {
      width:1.84rem;
      height:1.786667rem;
      border-radius:0.133333rem;
      background: #ccc;
      img {
        width: 100%;
      }
    }
    .content {
      width: 6.293333rem;
      height: 2.653333rem;
      padding-left: 0.266667rem; 
      .con-title {
          font-size: 16px;
      }
      .con-type{
          font-size: 12px;
          color: #999999;
          padding-top: 0.106667rem;
          padding-bottom:0.1rem;
      }
      .con-price{
        font-size: 18px;
        color: #FF5F5F
      }
    }
  }
  .total-wrap {
    background: #fff;
    line-height: 1.35rem;
    padding:0 0.4rem;
    font-size: 14px;
  }
  .total-border {
    display: flex;
    border-bottom:1px solid rgba(223,230,255,1);
    > div {
      flex: 1;
    }
    .vip {
      color: #333;
    }
    .discount {
      text-align: right;
      color: #FF5F5F;
    }
    }
    
  .money-wrap {
    text-align: right;
    background: #fff;
    line-height: 1.35rem;
    padding:0 0.4rem;
    font-family:PingFangSC-Medium;
    margin-bottom: 0.266667rem;
    .heji {
      color: #25265E;
      font-size: 17px;
      font-weight: 600;;
    }
    .money {
      font-size: 18px;
      color: #FF5F5F;
    }
  }
  .oder-time {
    background: #fff;
    line-height: 1.35rem;
    padding:0 0.4rem;
    font-family:PingFangSC-Medium;
    margin-bottom: 0.266667rem;
    font-size: 14px;
  }
  .order-action {
    width:1.066667rem;
    height:0.453333rem;
    line-height:0.453333rem;
    background:rgba(236,245,255,1);
    border-radius:0.053333rem;
    border:1px solid rgba(179,217,255,1);
    font-size: 12px;
    color: #3F9EFF;
    text-align: center;
  }
  .listaction {
    background: #fff;
    overflow: hidden;
    padding: 0.266667rem;
    position: fixed;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    span {
      float: right;
      width:2.133333rem;
      height:0.8rem;
      line-height: 0.8rem;
      border-radius:0.106667rem;
      border:0.026667rem solid rgba(216,216,216,1);
      font-size: 14px;
      color: #333;
      text-align: center;
      margin:0 0.133333rem;
    }
  }
</style>
<style>
  .order-detail .mint-header {
    background: #fff !important;
  }
</style>
