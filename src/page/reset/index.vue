<template>
  <div class="reset">
    <q-header :title="title"></q-header>
    <div class="form-group">
      <input type="text" placeholder="请输入手机号码" v-model="reset.phone">
    </div>
    <div class="form-group">
      <input type="text" placeholder="请输入验证码" v-model="reset.code">
      <div class="verificode">
        <p class="countdown" v-if="!btn">{{time}}s后重新获取</p>
        <p class="sendcode" @click="sendcode" v-if="btn">获取验证码</p>
      </div>
    </div>
    <p class="btn">
       <mt-button type="primary" class="btn-blue" @click.prevent="updatedConfirm">下一步</mt-button>
    </p>
  </div>
</template>

<script>
  // import {
  //   api
  // } from "@/api/api";
  import { validatPhone } from '@/utils/validate';
  import QHeader from '@/components/header';
  export default {
    data() {
      return {
        reset: {
          phone: "",
          code: "",
        },
        timer: null,
        time: 60,
        btn: true,
        title:'重置密码'
      };
    },
    methods: {
      validate() {
        if (this.reset.phone === '') {
          this.$toast({message: "请输入手机号码" });
          return false;
        }else if (!validatPhone(this.form.userName)) {
          this.$toast({message: "请输入正确的手机号码" });
          return false;
        } 
        return true;
      },
      sendcode() {
        if (this.validate()) {
          // this.http
          //   .post(api.sendCode, {
          //     phone: this.reset.phone,
          //     type: 3,
          //     templateId: "resetpwd"
          //   })
          //   .then(it => {
          //     if (it.data.success) {
          //       this.countdown();
          //     } else {
          //       this.$toast({
          //         message: it.data.message,
          //         position: "bottom",
          //         duration: 3000
          //       });
          //     }
          //   })
          //   .catch(() => {
          //     this.$toast({
          //       message: "后台接口错误",
          //       position: "bottom",
          //       duration: 3000
          //     });
          //   });
        }
      },
      countdown() {
        this.timer = setInterval(() => {
          if (--this.time <= 0) {
            clearInterval(this.timer);
            this.btn = true;
          }
        }, 1000);
      }
    },
    components: {
      QHeader
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
    .btn {
      margin:1.47rem 0.92rem;
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
</style>
