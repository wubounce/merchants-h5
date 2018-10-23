<template>
  <section class="coupondetail-wrap">
    <div class="coupon-list">
      <div class="coupon-content">
        <div class="price-content">
          <p><span class="yang">¥</span><span class="inter">1</span><span class="float">.50</span></p>
          <p class="full">满8元可用</p>
        </div>
        <div class="rules-content">
          <p class="title">补偿券</p>
          <p>限手机号18768227970使用</p>
          <p>发放时间2018.08.28 23:24</p>
        </div>
      </div>
      <div class="time">1.有效期：2018.10.15-2018.10.22 2.限时段：8:00-22:00</div>
    </div>
    <div class="coupon-type">
      <p class="type">适用类型：洗衣机</p>
      <p>适用店铺：企鹅一号店企鹅一号店我是一个很长很长的店铺名称</p>
    </div>
    <section class="detail-wrap">
      <p><span class="title">补偿订单号：</span><span class="content">18767567866</span></p>
      <p><span class="title">使用订单号：</span><span class="content">18767567866</span></p>
      <p><span class="title">发放人：</span><span class="content">18767567866</span></p>
    </section>
  </section>
</template>

<script type='text/ecmascript-6'>
  export default {
    data () {
      return {
      };
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