<template>
  <section class="coupondetail-wrap">
    <div class="coupon-list">
      <div class="coupon-content">
        <div class="price-content">
          <p><span :class="['yang',{'expieed':data.status ===2||data.status ===1}]">¥</span><span :class="['inter',{'expieed':data.status ===2||data.status ===1}]">{{data.firstMOney}}</span><span :class="['float',{'expieed':data.status ===2||data.status ===1}]">.{{data.secondMOney}}</span></p>
          <p class="full">满{{data.minGcoins}}元可用</p>
        </div>
        <div class="rules-content">
          <p class="title">补偿券</p>
          <p>限手机号{{data.phone}}使用</p>
          <p>发放时间{{data.createTime}}</p>
        </div>
        <span class="tag" v-if="data.status === 2"><img src="../../../static/image/market/exirped@.png" alt=""></span>
        <span class="tag" v-if="data.status === 1"><img src="../../../static/image/market/used.png" alt=""></span>
      </div>
      <div class="time">1.有效期：{{data.startDate}}-{{data.endDate}} 2.限时段：{{data.startTime}}-{{data.endTime}}</div>
    </div>
    <div class="coupon-type">
      <p class="type">适用类型：{{data.parentType}}</p>
      <p>适用店铺：{{data.shopName}}</p>
    </div>
    <section class="detail-wrap">
      <p><span class="title">补偿订单号：</span><span class="content">{{data.fromOrderNo}}</span></p>
      <p v-if="data.status === 2"><span class="title">使用订单号：</span><span class="content">{{data.orderNo}}</span></p>
      <p><span class="title">发放人：</span><span class="content">{{data.realName?data.realName:data.userName}}</span></p>
    </section>
  </section>
</template>

<script type='text/ecmascript-6'>
  import { voucherDetailFun } from '@/service/voucher';
  export default {
    data () {
      return {
        data:{}
      };
    },
    created() {
      this.getDetail();
    },
    methods:{
      async getDetail(){
        let payload = {id:this.$route.query?this.$route.query.id:''};
        let res = await voucherDetailFun(payload);
        this.data = res;
        let temp = this.data.faceValue.split('.');
        this.data['firstMOney'] = temp[0];
        this.data['secondMOney'] = temp[1];
      }
    }
  };
</script>

<style lang='scss' scoped type='text/css'>
  @import '../../assets/scss/marketing/couponDetail';
</style>
<style>
  @media screen and (max-width: 360px) {
    .coupondetail-wrap .detail-wrap .title {
      width: 2.8rem !important;
    }
  }
</style>