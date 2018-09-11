<template>
  <section>
      <router-link :to="{name:'changePwd'}">
        <p class="user business">修改密码<span>{{user.password}}</span></p>
      </router-link>
      <router-link :to="{name:'setAlipay'}" v-has="'mer:me:aplipay'">
        <p class="user business">绑定支付宝<span>{{ user.alipayAccount ? user.alipayAccount : '未绑定' | replaceAliply}}</span></p>
      </router-link>
      <p class="user business"  id="border-top" v-has="'mer:me:real'" @click="toRealName" >实名认证<span>{{user.status}}</span></p>
  </section>
</template>
<script>
import { getAliAndStatusFun } from '@/service/setAlipayAndStatus';
export default {
  data() {
    return {
      isBlue:true,
      isStatus:true,
      user:{
        password:'',
        alipayAccount:'未绑定',
        status:''
      },
      isAlipay:''
    };
  },
  methods: {
    toRealName() {
      if(!this.isAlipay) {
        this.$toast({
          message:'请先绑定支付宝，再进行实名认证'
        });
      }
      else {
        if( this.user.status == "未认证" || this.user.status == "未通过" || this.user.status == "审核中" ) {
          this.$router.replace({
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
      
        this.user = res;
        this.isBlue = res.alipayAccount == "" || res.alipayAccount == null ? true : false;
        this.isAlipay = res.alipayAccount;
        //判断认证情况
        switch(res.status) {
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
@import '../../assets/scss/setting/accountSet';
</style>


