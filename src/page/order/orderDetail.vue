<template>
<div class="order-detail">
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
              <p class="con-type">{{detail.machineFunctionName}}<span style="padding:0 0.346667rem" v-if="detail.isESource === 0">|</span><span v-if="detail.isESource === 0">时长{{detail.markMinutes}}分钟</span></p>
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
    <section class="detail-list">
      <div>
        <span class="title">用户账号：</span><span class="content">{{detail.phone}}</span>
      </div>
    </section>
    <section class="detail-list">
      <div>
      <span class="title">订单编号：</span><span class="content">{{detail.orderNo}}</span>
      </div>
    </section>
    <section class="detail-list" v-cloak v-if="detail.orderStatus === 2|| detail.orderStatus === 5">
      <div>
        <span class="title">支付方式：</span><span class="content">{{detail.payType | PayType}}</span>
      </div>
    </section>
    <section class="detail-list">
      <div>
        <span class="title">下单时间：</span><span class="content">{{detail.createTime}}</span>
      </div>
    </section>
    <div v-if="detail.orderStatus === 5">
        <section class="detail-list" v-if="detail.refundName">
          <div>
            <span class="title">退款人：</span><span class="content">{{detail.refundName}}</span>
          </div>
        </section>
        <section class="detail-list">
          <div>
            <span class="title">退款时间：</span><span class="content">{{detail.refundTime}}</span>
          </div>
        </section>
        <section class="detail-list">
          <div>
            <span class="title">备注：</span><span class="content">{{detail.refundRemark.replace(',null','')}}</span>
          </div>
        </section>
    </div>


     <section class="listaction" v-cloak v-if="detail.orderStatus === 2"> 
      <mt-button @click="orderRefund(detail.orderNo,detail.payPrice)" v-has="'mer:order:refund,mer:order:info'" :disabled="refundDisabled">退款</mt-button>
      <mt-button @click="machineBoot(detail.id)" v-has="'mer:order:start,mer:order:info'" v-if="detail.isESource === 0 || detail.isESource === null">启动</mt-button>
      <mt-button @click="machineReset(detail.orderNo,detail.machineId)" v-has="'mer:order:reset,mer:order:info'" v-if="detail.isESource === 0 || detail.isESource === null  || detail.isDrinking === 0">复位</mt-button>
    </section>
  </div>
</div>
</template>
<script>
import { orderStatus, PayType } from '@/utils/mapping';
import { ordeRrefundFun, orderDetailFun, machineResetFun, machineBootFun } from '@/service/order';
import { MessageBox } from 'mint-ui';
export default {
  data() {
    return {
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
      let payload = {orderNo:orderNo};
      let res = await orderDetailFun(payload);
      this.detail = res;
    },
    machineReset(orderNo,machineId){ //设备复位
      MessageBox.confirm(`您确定要复位${this.detail.machineName}？`,'').then(async () => {
          let query = this.$route.query;
          let payload = {machineId:machineId,orderNo:orderNo};
          let res = await machineResetFun(payload);
          this.$toast({message: '复位成功' });
      });
      
    },
    machineBoot(id){ //设备启动
      MessageBox.confirm(`您确定要启动${this.detail.machineName}？`,'').then(async () => {
        let query = this.$route.query;
        let payload = {orderId:id};
        let res = await machineBootFun(payload);
        this.$toast({message: '启动成功' });
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
        let res = await ordeRrefundFun(payload);
        this.$toast({message: '退款成功' });
        this.$router.push({name:'order'});
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
<style>
  @media screen and (max-width: 360px) {
    .order-title {  font-size: 15px !important; }
    .detail-list .title {
      width: 2.3rem !important;
    }
    .detail-list .content {
      width: 6.5rem !important;
    }
  }
</style>
