<template>
<div class="order-detail" v-title="title">
<div class="permissions" v-if="$store.getters.has('mer:order:info')">暂无相关页面权限</div>
  <div v-else>
    <div class="order-status">{{detail.orderStatus | orserStatus}}</div>
    <div class="order-title">{{detail.shopName}}</div>
    <div class="alllist">
      <section class="order-list">  
        <div class="detail">  
          <div class="orderpic"><img :src="detail.imageId" alt=""></div>
          <div class="content">
              <p class="con-title">{{detail.machineName}}</p>
              <p class="con-type">{{detail.machineFunctionName}}<span style="padding:0 0.346667rem">|</span>时长{{detail.markMinutes}}分钟</p>
              <p class="con-price" v-if="!detail.orderType ===2 && !detail.orderStatus ===1 || !detail.orderType ===2 && !detail.orderStatus ===0">¥{{detail.markPrice}}</p>
          </div>
        </div>
      </section>
    </div>
    <section class="total-wrap">
      <div class="total-border" v-if="detail.discountType===1 && detail.discountPrice>0">
        <div class="vip"><span class="viptag">vip</span>VIP会员卡</div>
        <div class="discount">-¥{{detail.discountPrice}}</div>
      </div>
       <div class="total-border" v-if="detail.discountType===2&&detail.discountPrice>0">
        <div class="vip">优惠券</div>
        <div class="discount">-¥{{detail.discountPrice}}</div>
      </div>
    </section>
    <section class="money-wrap" v-if="!detail.orderType ===2 && !detail.orderStatus ===1 || !detail.orderType ===2 && !detail.orderStatus ===0">
      <span class="heji">合计：</span>
      <span class="money">¥{{detail.payPrice}}</span>
    </section>
    <section class="total-wrap">
      <div class="total-border">
        <div class="vip">用户账号：{{detail.phone}}</div>
      </div>
    </section>
    <section class="total-wrap">
      <div class="total-border">
        <div class="vip">订单编号：{{detail.orderNo}}</div>
      </div>
    </section>
    <section class="total-wrap" v-if="detail.orderStatus === 2|| detail.orderStatus === 5">
      <div class="total-border">
        <div class="vip">支付方式：{{detail.payType | PayType}}</div>
      </div>
    </section>
    <section class="oder-time" style="margin-bottom:1.3rem;">
      <span>下单时间：{{detail.createTime}}</span>
    </section>
     <section class="listaction" v-if="detail.orderStatus === 2"> 
      <mt-button @click="orderRefund(detail.orderNo,detail.payPrice)" v-has="'mer:order:refund,mer:order:info'">退款</mt-button>
      <mt-button @click="machineBoot(detail.id)" v-has="'mer:order:start,mer:order:info'">启动</mt-button>
      <mt-button @click="machineReset(detail.orderNo,detail.machineId)" v-has="'mer:order:reset,mer:order:info'">复位</mt-button>
    </section>
  </div>
</div>
</template>
<script>
import qs from 'qs';
import { orderStatus, PayType } from '@/utils/mapping';
import { ordeRrefundFun, orderDetailFun, machineResetFun, machineBootFun } from '@/service/order';
import { MessageBox } from 'mint-ui';
export default {
  data() {
    return {
      title: '订单详情',
      detail:{}
    };
  },
  mounted() {
    
  },
  created(){
    let query = this.$route.query;
    this.getDetail(query.orderNo);
  },
  methods: {
    async getDetail(orderNo){
      let res = await orderDetailFun(qs.stringify({orderNo:orderNo}));
      this.detail = res.data;
    },
    machineReset(orderNo,machineId){ //设备复位
      MessageBox.confirm(`确定复位${this.detail.machineName}？`).then(async () => {
          let query = this.$route.query;
          let payload = {machineId:machineId,orderNo:orderNo};
          let res = await machineResetFun(qs.stringify(payload));
          if (res.code === 0) {
            this.$toast({message: '复位成功' });
          } else {
            this.$toast({message: res.msg });
          }
      });
      
    },
    machineBoot(id){ //设备启动
      MessageBox.confirm(`您确定要启动${this.detail.machineName}？`).then(async () => {
        let query = this.$route.query;
        let payload = {orderId:id};
        let res = await machineBootFun(qs.stringify(payload));
        if (res.code === 0) {
          this.$toast({message: '启动成功' });
        } else {
          this.$toast({message: res.msg });
        }
      });
      
    },
    orderRefund(orderNo,payPrice){ //退款
      MessageBox.confirm('确定发起退款？').then(async () => {
        let query = this.$route.query;
        let payload = {orderNo:orderNo,refundMoney:payPrice};
        let res = await ordeRrefundFun(qs.stringify(payload));
        if (res.code === 0) {
          this.$toast({message: '退款成功' });
          this.$router.push({name:'order'});
        } else {
          this.$toast(res.msg);
        }
      });
    },
  },
  filters: {
    orserStatus: function (value) {
      return orderStatus(value);
    },
    PayType:function(value){
      return PayType(value);
    }
  },
  components:{
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
    padding: 0.35rem 0.4rem;
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
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 0.133333rem;
      }
    }
    .content {
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
    .viptag {
      display: inline-block;
      width:0.53rem;
      height:0.41rem;
      line-height: 0.41rem;
      text-align: center;
      background:linear-gradient(-138.4deg,rgba(251,154,73,1),rgba(245,88,35,1));
      border-radius:0.05rem;
      font-size: 10px;
      color: #fff;
      margin-right: 0.27rem;
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
    button {
      float: right;
      width:2.133333rem;
      height:0.8rem;
      border-radius:0.106667rem;
      border:0.026667rem solid rgba(216,216,216,1);
      font-size: 14px;
      color: #333;
      text-align: center;
      margin:0 0.133333rem;
      background: #fff;
      box-shadow: none;
    }
  }
</style>
<style>
  .order-detail .mint-header {
    background: #fff !important;
  }
</style>
