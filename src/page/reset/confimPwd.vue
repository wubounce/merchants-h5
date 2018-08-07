<template>
  <div class="reset" v-title="title">
    <form ref="resetForm" :model="reset">
    <div class="form-group">
      <input type="password" placeholder="请输入新密码" v-model="reset.password" @input="disabledBtn" autocomplete="off">
    </div>
    <div class="form-group">
      <input type="password" placeholder="请确认新密码" v-model="reset.repassword" @input="disabledBtn" autocomplete="off">
    </div>
    </form>
    <p class="btn">
       <mt-button type="primary" class="btn-blue" @click.prevent="changePwdConfirm" :disabled="disabled">确定</mt-button>
    </p>
  </div>
</template>

<script>
import qs from 'qs';
import { forgetPwdFun } from '@/service/resetPwd';
import { validatPwd } from '@/utils/validate';
  export default {
    data() {
      return {
        reset: {
          password: '',
          repassword: '',
        },
        timer: null,
        time: 60,
        btn: true,
        title:'重置密码',
        disabled:true
      };
    },
    created(){
    },
    methods: {
      disabledBtn(){
        if (!this.reset.password || !this.reset.repassword) {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
      },
      validate() {
        if (this.reset.password === '') {
          this.$toast({message: "请输入新密码"});
          return false;
        }else if (!validatPwd(this.reset.password)) {
          this.$toast({message: "密码6-20位，支持英文字母和数字" });
          return false;
        }

        if (this.reset.repassword === '') {
          this.$toast({message: "请确认新密码"});
          return false;
        }else if (!validatPwd(this.reset.repassword)) {
          this.$toast({message: "密码6-20位，支持英文字母和数字" });
          return false;
        } 

        if (this.reset.password !== this.reset.repassword) {
          this.$toast({message: "两次输入密码不一致"});
          return false;
        }
        return true;
      },
      async changePwdConfirm() {
        if (this.validate()) {
          let phone = this.$route.query ? this.$route.query.phone:'';
          let payload = Object.assign({},{password:this.reset.password,phone:phone});
          let res = await forgetPwdFun(qs.stringify(payload));
          if (res.code===0) {
            this.$router.push({name:'login'});
          }else {
             this.$toast(res.msg);
          }
        }
      },
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
  .reset .mint-header {
    background: #F2F2F2 !important;
  }
</style>
