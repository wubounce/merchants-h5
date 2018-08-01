<template>
  <div class="bind-main" v-title="title">
    <section class="bind-tip">为了您的账户安全，请您绑定手机号</section>
    <form ref="resetForm" :model="bindPhone">
    <div class="form-group">
      <input type="text" placeholder="请输入手机号码" v-model="bindPhone.phone" require @input="disbaledBtn">
    </div>
    <div class="form-group">
      <input type="text" placeholder="请输入验证码" v-model="bindPhone.code" require @input="disbaledBtn">
      <div class="verificode">
        <p class="countdown" v-if="!btn">{{time}}s后重新获取</p>
        <p class="sendcode" @click="sendcode" v-if="btn">获取验证码</p>
      </div>
    </div>
    </form>
    <p class="btn">
       <mt-button type="primary" class="btn-blue" :disabled="disabled" @click.prevent="gotonext">确定</mt-button>
    </p>
  </div>
</template>

<script>
  import { smscodeFun, validateCodeFun, bindPhoneFun } from '@/service/resetPwd';
  import { validatPhone } from '@/utils/validate';
  import qs from 'qs';
  export default {
    data() {
      return {
        bindPhone: {
          phone: '',
          code: '',
        },
        timer: null,
        time: 60,
        btn: true,
        disabled:true,
        title:'绑定手机'
      };
    },
    methods: {
      validatePhone() {
        if (this.bindPhone.phone === '') {
          this.$toast({message: "请输入手机号码" });
          return false;
        }else if (!validatPhone(this.bindPhone.phone)) {
          this.$toast({message: "请输入正确的手机号码" });
          return false;
        } 
        return true;
      },          
      async sendcode() {
        if (this.validatePhone()) {
          let res = await smscodeFun(qs.stringify({phone:this.bindPhone.phone}));
          if (res.code===0) {
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
          if (this.bindPhone.code === '') {
            this.$toast({message: "请输入验证码" });
            return false;
          }
          let payload = Object.assign({},this.bindPhone,{username:''});
          let res = await validateCodeFun(qs.stringify(payload));
          if (res.code===0) {
            let bindpayload = Object.assign({},this.bindPhone);
            let bindres = await bindPhoneFun(qs.stringify(bindpayload));
            if (bindres.code ===0) {
              this.$toast('绑定手机号成功');
              this.$router.push({name:'index'});
            }
          }else {
             this.$toast(res.msg);
          }
        }
      },
      disbaledBtn(){
        if (this.bindPhone.phone !== '' ||this.bindPhone.code !== '') this.disabled = false;
      },
    },
    components: {
    }
  };
</script>

<style lang="scss" scoped>
  .bind-main {
    background: #fff;
    height: 100%;
    .bind-tip {
      height:0.96rem;
      line-height: 0.96rem;
      background:rgba(253,252,236,1);
      font-size:14px;
      color:#FF5F5F;
      padding-left: 0.4rem;
    }
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
    .btn {
      margin:1.47rem 0.92rem;
    }
  }
</style>
<style lang="scss">
  .bind-main .mint-button-text {
    font-size: 16px;
  }
  .bind-main .mint-button--primary {
    display: block;
    width: 100%;
  }
</style>
