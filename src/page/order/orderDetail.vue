<template>
<div class="order-detail" v-title="title">
<div class="permissions" v-cloak v-if="$store.getters.has('mer:order:info')">暂无相关页面权限</div>
  <div v-else>
    <div class="order-status">{{detail.orderStatus | orserStatus}}</div>
    <div class="order-detil-info">
      <div class="order-title">{{detail.shopName}}</div>
      <section class="order-list">  
        <div class="detail">  
          <div class="orderpic"><img :src="detail.imageId" alt=""></div>
          <div class="content">
              <p class="con-title">{{detail.machineName}}</p>
              <p class="con-type">{{detail.machineFunctionName}}<span style="padding:0 0.346667rem">|</span>时长{{detail.markMinutes}}分钟</p>
              <p class="con-price" v-cloak v-if="detail.orderType !== 2 && detail.orderStatus !==1 || detail.orderType !==2 && detail.orderStatus !==0">{{'¥'+ detail.markPrice}}</p>
          </div>
          <div class="order-action" v-cloak v-if="detail.isReserve === 1">预约</div>
        </div>
      </section>
    </div>
    <section class="total-wrap">
      <div class="total-border" v-cloak v-if="detail.discountType===1 && detail.discountPrice>0">
        <div class="vip"><span class="viptag"><img src="../../../static/image/vip/VIP@2x.png" alt=""></span>VIP会员卡</div>
        <div class="discount">-¥{{detail.discountPrice}}</div>
      </div>
      <div class="total-border" v-cloak v-if="detail.discountType===2&&detail.discountPrice>0 || detail.discountType===null&&detail.discountPrice>0">
        <div class="vip"><span class="viptag"><img src="../../../static/image/vip/discount@2x.png" alt=""></span>限时优惠</div>
        <div class="discount">-¥{{detail.discountPrice}}</div>
      </div>
      <div class="total-border"  v-cloak v-if="detail.voucherType===0&&detail.voucherPrice>0">
        <div class="vip"><span class="viptag"><img src="../../../static/image/vip/coupons@2x.png" alt=""></span>通用优惠券</div>
        <div class="discount" style="color:#333">¥{{detail.voucherPrice}}</div>
      </div>
      <div class="total-border"  v-cloak v-if="detail.voucherType===1&&detail.voucherPrice>0">
        <div class="vip"><span class="viptag"><img src="../../../static/image/vip/coupons@2x.png" alt=""></span>店铺优惠券</div>
        <div class="discount">-¥{{detail.voucherPrice}}</div>
      </div>
    </section>
    <section class="money-wrap"  v-cloak v-if="detail.orderType !== 2 && detail.orderStatus !==1 || detail.orderType !==2 && detail.orderStatus !==0">
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
    <section class="total-wrap" v-cloak v-if="detail.orderStatus === 2|| detail.orderStatus === 5">
      <div class="total-border">
        <div class="vip">支付方式：{{detail.payType | PayType}}</div>
      </div>
    </section>
    <section class="oder-time">
      <span>下单时间：{{detail.createTime}}</span>
    </section>
     <section class="listaction" v-cloak v-if="detail.orderStatus === 2"> 
      <mt-button @click="orderRefund(detail.orderNo,detail.payPrice)" v-has="'mer:order:refund,mer:order:info'" :disabled="refundDisabled">退款</mt-button>
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
      detail:{markPrice:''},
      refundDisabled:false,
    };
  },
  mounted() {
    
  },
  created(){
    let query = this.$route.query?this.$route.query:{};
    this.getDetail(query.orderNo);
  },
  methods: {
    async getDetail(orderNo){
      let res = await orderDetailFun(qs.stringify({orderNo:orderNo}));
      if (res.code === 0) {
          this.detail = res.data;
      }
    },
    machineReset(orderNo,machineId){ //设备复位
      MessageBox.confirm(`您确定要复位${this.detail.machineName}？`,'').then(async () => {
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
      MessageBox.confirm(`您确定要启动${this.detail.machineName}？`,'').then(async () => {
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
      this.refundDisabled = true;
      MessageBox.confirm('',{ 
        message: '确定发起退款？', 
        closeOnClickModal:false
      }).then(async () => {
        let query = this.$route.query;
        let payload = {orderNo:orderNo,refundMoney:payPrice};
        let res = await ordeRrefundFun(qs.stringify(payload));
        if (res.code === 0) {
          this.$toast({message: '退款成功' });
          this.$router.push({name:'order'});
        } else {
          this.$toast(res.msg);
          this.$router.push({name:'order'});
        }
        this.refundDisabled = false;

      }).catch(err => { 
         this.refundDisabled = false;
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
<style type="text/css" lang="scss" scoped>
 @import "../../assets/scss/order/orderDetail";
</style>
