<template>
  <section v-title="title">
      <router-link :to="{name:'changePwd'}">
        <p class="user business">修改密码<span>{{user.password}}</span></p>
      </router-link>
      <router-link :to="{name:'setAlipay'}" v-has="'mer:me:aplipay'">
        <p class="user business">绑定支付宝<span>{{ user.alipayAccount ? user.alipayAccount : '未绑定' | replaceAliply}}</span></p>
      </router-link>
      <!-- <router-link :to="{name:'realName',  query:{ alipayAccount:user.alipayAccount }}"> -->
        <p class="user business"  v-has="'mer:me:real'" @click="toRealName" >实名认证<span>{{user.status}}</span></p>
      <!-- </router-link> -->
  </section>
</template>
<script>
import qs from 'qs';
import { getAliAndStatusFun } from '@/service/setAlipayAndStatus';
export default {
  data() {
    return {
      title: '账户设置',
      isBlue:true,
      isStatus:true,
      user:{
        password:'',
        alipayAccount:'未绑定',
        status:''
      }
    };
  },
  methods: {
    toRealName() {
      if( this.user.alipayAccount == '未绑定') {
        this.$toast({
          message:'请先绑定支付宝，再进行实名认证'
        });
      }
      else {
        if( this.user.status == "未认证" || this.user.status == "未通过" ) {
          this.$router.push({
            name: 'realName',
            query:{
              alipayAccount: this.user.alipayAccount,
              status: this.user.status
            }
          });
        }
        else {
          this.$router.push({
            name: 'realNameGet',
          });
        }
      }
    },
    async getAliAndStatus() {
      let res = await getAliAndStatusFun();
      if(res.code ===0) {
        this.user = res.data;
        this.isBlue = res.data.alipayAccount == "" || res.data.alipayAccount == null ? true : false;

        //判断认证情况
        switch(res.data.status) {
              case 0: 
                this.user.status = '未认证';
                break;
              case 1:
                this.user.status = '审核中';
                break;
              case 2:
                this.user.status = '已认证';
                this.isStatus = false;
                break;
              case 3:
                this.user.status = '未通过';
                break;
            }
      }
    }
  },
  filters:{
    replaceAliply(value){
        return String(value).replace(/^(\d{4})\d{4}(\d+)/,"$1****$2");
    }
  },
  created() {
    this.getAliAndStatus();
  },
  components:{
    
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
    background: url("../../../static/image/shop/right.png") no-repeat right
      0.3rem center;
    background-size: 0.16rem 0.27rem;
    span {
      font-size: 16px;
      margin-right: 0.3rem;
      color:#999999;
    }
  }
}
</style>


