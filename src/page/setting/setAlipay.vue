<template>
  <section v-title="title">
    <p class="shopname-p">
      <span>支付宝账号</span><span>
        <input type="text" class='addressInput' v-model="account"  placeholder="请填写支付宝账号" @input="disbaledBtn">
      </span>
    </p>
    <p class="alipay-btn" @click="submitAlipay">
      <mt-button type="primary" class="btn-blue" :disabled="disabled">确定</mt-button>
    </p>
  </section>
</template>
<script>
import { updateOperatorFun } from '@/service/user';
export default {
  data() {
    return {
      title: '绑定支付宝',
      account: '',
      disabled: true
    };
  },
  methods: {
    disbaledBtn() {
      this.disabled = false;
    },
    async submitAlipay() {
      //校验邮箱
      let emali = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      //校验手机号
      let phone = /^1[3456789]\d{9}$/;
      //判断支付宝账号是否符合规范
      if(emali.test(this.account) || phone.test(this.account) ) {
        let obj ={
          alipayAccount: this.account
        };
        let res = await updateOperatorFun(obj);
        
          this.$router.push({
            name: 'accountSet'
          });
          let instance = this.$toast({
            message: '操作成功',
            iconClass: 'mint-toast-icon mintui mintui-success'
          });
          setTimeout(() => {
            instance.close();
          }, 2000);

      }
      else {
        this.$toast({
          message: "支付宝帐号不符合规则",
          position: "bottom",
          duration: 3000
        });
      }
    }
  },
  created() {
  },
  components:{
    
  }
};
</script>
<style  type="text/css" lang="scss" scoped>
@import '../../assets/scss/setting/setAlipay';
</style>