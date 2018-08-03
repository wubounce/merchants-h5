<template>
  <section v-title="title">
    <p class="shopname-p">
      <span>支付宝账号</span><span>
        <input type="text" class='addressInput' onkeyup="value=value.replace(/[\u4E00-\u9FA5]/g,'')" v-model="account"  placeholder="请填写支付宝账号" @input="disbaledBtn">
      </span>
    </p>
    <p class="alipay-btn" @click="submitAlipay">
      <mt-button type="primary" class="btn-blue" :disabled="disabled">确定</mt-button>
    </p>
  </section>
</template>
<script>
import qs from 'qs';
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
      if(this.account.length <6 ) {
        this.$toast({
          message: "支付宝帐号不符合规则",
          position: "bottom",
          duration: 3000
        });
      }
      else {
        let obj ={
          alipayAccount: this.account
        };
        let res = await updateOperatorFun(qs.stringify(obj));
        if(res.code === 0 ) {
          this.$router.push({
            name: 'accountSet'
          });
          let instance = this.$toast({
            message: '支付宝账号修改成功',
            iconClass: 'mint-toast-icon mintui mintui-success'
          });
          setTimeout(() => {
            instance.close();
          }, 2000);
        }
        else {
          this.$toast(res.msg);
        }
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
section{
  .shopname-p {
    background-color: #fff;
    font-size: 16px;
    border-bottom: 1px solid #F8F8F8;
    padding: 0.06rem;
    margin-top: 0.3rem;
    span {
      display: inline-block;
      &:first-child {
        margin-left: 0.3rem;
      }
      input {
        margin-left:0.5rem;
        height: 1rem;
      }
      ::-webkit-input-placeholder {
        color: #999999;
        font-size: 16px;
      }
      :-moz-placeholder {
        /* Firefox 18- */
        color: #999999;
        font-size: 16px;
      }
      ::-moz-placeholder {
        /* Firefox 19+ */
        color: #999999;
        font-size: 16px;
      }
      :-ms-input-placeholder {
        color: #999999;
        font-size: 16px;
      }
    }
    &:last-child {
      border-bottom: 1px solid #fff;
    }
  }
  .alipay-btn {
    .btn-blue {
      margin-top: 0.67rem;
      margin-left: 0.4rem;
      width: 90%;
      height: 1.17rem;
    }
  }
}
</style>