<template>
  <div class="reset">
    <q-header :title="title"></q-header>
    <form ref="resetForm" :model="reset">
    <div class="form-group">
      <input type="password" placeholder="请输入旧密码" v-model="reset.oldPassword">
    </div>
    <div class="form-group">
      <input type="password" placeholder="请输入新密码" v-model="reset.password">
    </div>
    </form>
    <p class="btn">
       <mt-button type="primary" class="btn-blue" @click.prevent="changePwdConfirm">确定</mt-button>
    </p>
  </div>
</template>

<script>
  import { updatePwdFun } from '@/service/resetPwd';
  import qs from 'qs';
  import QHeader from '@/components/header';
  export default {
    data() {
      return {
        reset: {
          oldPassword: '',
          password: '',
        },
        timer: null,
        time: 60,
        btn: true,
        title:'重置密码'
      };
    },
    created(){
    },
    methods: {
      validate() {
        if (this.reset.oldPassword === '') {
          this.$toast({message: "请输入旧密码" });
          return false;
        }
        if (this.reset.password === '') {
          this.$toast({message: "请输入新密码" });
          return false;
        }
        if (this.reset.oldPassword === this.reset.password) {
          this.$toast({message: " 旧密码和新密码不允许相同" });
          return false;
        }
        return true;
      },
      async changePwdConfirm() {
        if (this.validate()) {
          let payload = Object.assign({},this.reset);
          let res = await updatePwdFun(qs.stringify(payload));
          if (res.code===0) {
               this.countdown();
          }else {
             this.$toast({
              message: res.msg,
              position: "bottom",
              duration: 3000
            });
          }
        }
      },
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
  .reset .mint-header {
    background: #F2F2F2 !important;
  }
</style>
