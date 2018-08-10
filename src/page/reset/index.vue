<template>
  <div class="reset" v-title="title">
    <form ref="resetForm" :model="reset" class="rest-form">
    <div class="form-group">
      <input type="text" placeholder="请输入手机号码" v-model="reset.phone" @input="disabledBtn" require>
    </div>
    <div class="form-group">
      <input type="text" placeholder="请输入验证码" v-model="reset.code" @input="disabledBtn" require>
      <div class="verificode">
        <p class="countdown" v-if="!btn">{{time}}s后重新获取</p>
        <p class="sendcode" @click="sendcode" v-if="btn">获取验证码</p>
      </div>
    </div>
    </form>
    <p class="reset-pwd-btn">
       <mt-button type="primary" class="btn-blue" @click.prevent="gotonext" :disabled="disabled">下一步</mt-button>
    </p>
  </div>
</template>

<script>
  import { smscodeFun, validateCodeFun } from '@/service/resetPwd';
  import { validatPhone } from '@/utils/validate';
  import qs from 'qs';
  export default {
    data() {
      return {
        title:'重置密码',
        reset: {
          phone: '',
          code: '',
        },
        timer: null,
        time: 0,
        btn: true,
        disabled:true
      };
    },
    methods: {
      disabledBtn(){
        if (!this.reset.phone || !this.reset.code) {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
      },
      validatePhone() {
        if (this.reset.phone === '') {
          this.$toast({message: "请输入手机号码" });
          return false;
        }else if (!validatPhone(this.reset.phone)) {
          this.$toast({message: "请输入正确的手机号码" });
          return false;
        } 
        return true;
      },          
      async sendcode() {
        if (this.validatePhone()) {
          let res = await smscodeFun(qs.stringify({phone:this.reset.phone,mark:false}));
          if (res.code===0) {
              this.time = 60;
              this.btn = false;
              this.countdown();
          }else {
             this.$toast(res.msg);
          }
        }
      },
      countdown() {
        this.btn = false;
        this.timer = setInterval(() => {
          if (--this.time <= 0) {
            clearInterval(this.timer);
            this.btn = true;
          }
        }, 1000);
      },
      async gotonext(){
        if (this.validatePhone()) {
          if (this.reset.code === '') {
            this.$toast({message: "请输入验证码" });
            return false;
          }
          let payload = Object.assign({},this.reset);
          let res = await validateCodeFun(qs.stringify(payload));
          if (res.code===0) {
            this.$router.push({name:'confimPwd',query:{phone:this.reset.phone}});
          }else {
             this.$toast(res.msg);
          }
        }
      }
    },
    components: {
    }
  };
</script>

<style lang="scss" scoped>
  .reset {
    background: #fff;
    height: 100%;
    .rest-form {
      width: 8.13rem;
      margin:0 auto;
    }
    .form-group {
      position: relative;
      height: 1.57rem;
      border-bottom:1px solid rgba(229,229,229,1);
      input {
        padding-top: 0.49rem;
        padding-bottom: 0.48rem;
        font-size: 16px;
        color: #1890FF;
      }
      .verificode {
        position: absolute;
        right: 0;
        top: 0.49rem;
        font-size: 16px;
        .countdown {
          color: #999;
        }
        .sendcode {
          color: #1890FF;
        }
      }
    }
    .reset-pwd-btn button {
      width: 8.13rem;
      height: 1.17rem;
      margin:1.47rem auto;
      padding:0;
      border-radius:0.13rem;
    }
  }
</style>
<style lang="scss">
  .reset .mint-button-text {
    font-size: 16px;
  }
  .reset .mint-button--primary {
    display: block;
    width: 100%;
  }
  .reset .mint-header {
    background: #F2F2F2 !important;
  }
</style>
