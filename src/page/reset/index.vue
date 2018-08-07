<template>
  <div class="reset" v-title="title">
    <form ref="resetForm" :model="reset">
    <div class="form-group">
      <input type="text" placeholder="请输入手机号码" v-model="reset.phone" @input="disabledBtn" require>
    </div>
    <div class="form-group">
      <input type="text" placeholder="请输入验证码" v-model="reset.code" @input="disabledBtn" require>
      <div class="verificode">
        <p class="sendcode" @click="sendcode" v-if="btn">获取验证码</p>
        <p class="countdown" v-else>{{time}}s后重新获取</p>
      </div>
    </div>
    </form>
    <p class="btn">
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
          let res = await smscodeFun(qs.stringify({phone:this.reset.phone}));
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
          if (res.code===1) {
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
    .form-group {
      position: relative;
      margin: 0 0.92rem;
      height: 1.57rem;
      border-bottom:1px solid rgba(229,229,229,1);
      input {
        height: 1.57rem;
        font-size: 16px;
        color: #1890FF;
      }
      .verificode {
        position: absolute;
        right: 0.24rem;
        top: .07rem;
        p {
          line-height: 1.57rem;
          font-size: 16px;
        }
        .countdown {
          color: #999;
        }
        .sendcode {
          color: #1890FF;
        }
      }
    }
    .btn button {
      width: 8.13rem;
      height: 1.17rem;
      margin:1.47rem auto;
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
