<template>
  <section>
      <q-header :title="title"></q-header>
      <router-link :to="{name:'changePwd'}">
        <p class="user business">修改密码<span>{{user.password}}</span></p>
      </router-link>
      <router-link :to="{name:'setAlipay'}">
        <p class="user business">绑定支付宝<span>{{user.Alipay}}</span></p>
      </router-link>
      <router-link :to="{name:'realName'}">
        <p class="user business">实名认证<span>{{user.status}}</span></p>
      </router-link>
  </section>
</template>
<script>
import QHeader from '@/components/header';
export default {
  data() {
    return {
      title: '账号设置',
      user:{
        password:'',
        Alipay:'未绑定',
        status:'未认证'
      }
    };
  },
  components:{
    QHeader
  }
};
</script>
<style  type="text/css" lang="scss" scoped>
section {
  background-color: #fff;
  .user {
    margin-top: 0.3rem;
    display: flex;
    justify-content: space-between;
  }
  .business {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    padding: 0.3rem;
    background-color: #fff;
    border-bottom: 1px solid #F8F8F8;
    background: url("../../../static/shop/right.png") no-repeat right
      0.3rem center;
    background-size: 0.16rem 0.27rem;
    span {
      color: #1890FF;
      font-size: 16px;
      margin-right: 0.3rem;
    }
  }
}
</style>


