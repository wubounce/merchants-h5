<template>
<section class="discountCoupon">
  <div class="discountCoupon-head">
    <div class="search-header">
      <section class="sarch-wrap">
        <div class="search">
            <form action="" target="frameFile" v-on:submit.prevent="">
              <span class="iconfont icon-IconSearch"></span><input type="text" value='搜索' v-model.trim="searchData" @keyup.enter="searchOrder" @input="clearSearch" placeholder="请输入用户手机号" class="serch">
              <iframe name='frameFile' style="display: none;"></iframe>
              <span class="select-back" @click="searchOrder">搜索</span>
            </form>
        </div>
        <div class="coupon-date"><span class="iconfont icon-rili"></span></div>
      </section>
      <div class="hidden-tab">  
        <section class="order-status">
          <div v-for="(item,index) in titleArr" @click="titleClick(index)"><span :class="{current: titleIndex === index}">{{item.lable}}</span></div>
        </section>
      </div>
    </div>
    <div class="device-status">
      <div>
        <p class="current">全部</p>
        <span class="current">99</span>
      </div>
      <div>
        <p>未使用</p>
        <span>99</span>
      </div>
      <div> 
        <p>已使用</p>
        <span>999</span>
      </div>
      <div>
        <p>已过期</p>
        <span>999</span>
      </div>
    </div>
    <div class="coupon-content">
      <ul>
        <li class="list">
          <router-link :to="{name:'couponDetail'}">
            <div class="price-content">
              <span class="yang">¥</span><span class="inter">1</span><span class="float">.50</span>
            </div>
            <div class="rules-content">
              <p class="title">补偿券</p>
              <p>限手机号18768227970使用</p>
              <p>发放时间2018.08.28 23:24</p>
            </div>
          </router-link>
        </li>
        <li class="list">
          <router-link :to="{name:'couponDetail'}">
            <div class="price-content">
              <span class="yang">¥</span><span class="inter">1</span><span class="float">.50</span>
            </div>
            <div class="rules-content">
              <p class="title">补偿券</p>
              <p>限手机号18768227970使用</p>
              <p>发放时间2018.08.28 23:24</p>
            </div>
          </router-link>
        </li>
        <li class="list">
          <router-link :to="{name:'couponDetail'}">
            <div class="price-content">
              <span class="yang expieed">¥</span><span class="inter expieed">1</span><span class="float expieed">.50</span>
            </div>
            <div class="rules-content">
              <p class="title">补偿券</p>
              <p>限手机号18768227970使用</p>
              <p>发放时间2018.08.28 23:24</p>
            </div>
            <span class="tag"><img src="../../../static/image/market/exirped@.png" alt=""></span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
   
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
@import '../../assets/scss/marketing/discountCoupon';
</style>