<template>
<div class="mang">
  <div class="permissions" v-if="$store.getters.has('mer:shop:list')&&$store.getters.has('mer:machine:list')&&$store.getters.has('mer:order:list')&&$store.getters.has('mer:schedule:list')&&$store.getters.has('mer:marketing:list')&&$store.getters.has('mer:marketing:vip:list')&&$store.getters.has('mer:person:list')">暂无相关页面权限</div>
  <div v-else>
      <div class="alllist" v-has="'mer:shop:list'">
        <router-link :to="{ name: 'shopList'}">
          <section class="order-list">  
              <div class="detail">  
                <div class="orderpic"><img src="../../../static/image/management/shop@2x.png" alt=""></div>
                <div class="content">
                    <p class="con-title">店铺管理</p>
                    <p class="con-type">新增、修改、删除店铺及相关信息</p>
                </div>
                <div class="order-action iconfont icon-nextx"></div>
              </div>
          </section>
        </router-link>
      </div>
      <div class="alllist" v-has="'mer:machine:list'">
        <router-link :to="{ name: 'deviceMange'}">
          <section class="order-list">  
              <div class="detail">  
                <div class="orderpic"><img src="../../../static/image/management/machine@2x.png" alt=""></div>
                <div class="content">
                    <p class="con-title">设备管理</p>
                    <p class="con-type">新增、修改设备及对应设备功能</p>
                </div>
                <div class="order-action iconfont icon-nextx"></div>
              </div>
          </section>
        </router-link>
      </div>
      <div class="alllist" v-has="'mer:order:list'">
        <router-link :to="{ name: 'order'}">
          <section class="order-list">  
              <div class="detail">  
                <div class="orderpic"><img src="../../../static/image/management/order@2x.png" alt=""></div>
                <div class="content">
                    <p class="con-title">订单管理</p>
                    <p class="con-type order-mang">顾客订单信息，退款、补偿、启动、复位设备</p>
                </div>
                <div class="order-action iconfont icon-nextx"></div>
              </div>
          </section>
        </router-link>
      </div>
      <div class="alllist" v-has="'mer:schedule:list'">
        <router-link :to="{ name: 'todolist'}">
          <section class="order-list">  
              <div class="detail">  
                <div class="orderpic  todo"><img src="../../../static/image/management/todo@2x.png" alt=""></div>
                <div class="content">
                    <p class="con-title">待办事项</p>
                    <p class="con-type">管理设备批量启动事项</p>
                </div>
                <div class="order-action iconfont icon-nextx"></div>
              </div>
          </section>
        </router-link>
      </div>
      <div class="alllist" v-if="!$store.getters.has('mer:marketing:list') || !$store.getters.has('mer:marketing:vip:list') || !$store.getters.has('mer:voucher')">
        <router-link :to="{ name: 'marketing'}">
          <section class="order-list">  
              <div class="detail">  
                <div class="orderpic"><img src="../../../static/image/management/market@2x.png" alt=""></div>
                <div class="content">
                    <p class="con-title">营销管理</p>
                    <p class="con-type">店铺活动、VIP卡、优惠券相关管理</p>
                </div>
                <div class="order-action iconfont icon-nextx"></div>
              </div>
          </section>
        </router-link>
      </div>
      <div class="alllist"  v-has="'mer:person:list'">
        <router-link :to="{ name: 'member'}">
          <section class="order-list" style="border:none">  
              <div class="detail">  
                <div class="orderpic"><img src="../../../static/image/management/member@2x.png" alt=""></div>
                <div class="content">
                    <p class="con-title">人员管理</p>
                    <p class="con-type">子管理员账号创建及管理</p>
                </div>
                <div class="order-action iconfont icon-nextx"></div>
              </div>
          </section>
        </router-link>
      </div>
      <div style="width:100%;height:1.73rem;"></div>
  </div>

</div>
</template>
<script>
import QHeader from '@/components/header';
export default {
  data() {
    return {
    };
  },
  mounted() {
    
  },
  methods: {
    
  },
  components:{
    QHeader,
  }
};
</script>
<style type="text/css" lang="scss" scoped>
  @import "../../assets/scss/management";
</style>
<style>
  @media screen and (max-width: 360px) {
    .order-mang {
      bottom: -0.27rem !important;
    }
  }
</style>