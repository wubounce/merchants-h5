<template>
  <div class="reset">
    <q-header :title="title"></q-header>
    <div class="form-group">
      <input type="text" placeholder="请输入新密码" v-model="reset.password">
    </div>
    <div class="form-group">
      <input type="text" placeholder="请确认新密码" v-model="reset.newpassword">
    </div>
    <p class="btn">
       <mt-button type="primary" class="btn-blue" @click.prevent="updatedConfirm">确定</mt-button>
    </p>
  </div>
</template>

<script>
  import { validatPhone } from '@/utils/validate';
  import QHeader from '@/components/header';
  export default {
    data() {
      return {
        reset: {
          password: '',
          newpassword: '',
        },
        timer: null,
        time: 60,
        btn: true,
        title:'重置密码'
      };
    },
    created(){
      // let query = this.$route.query;
      // console.log(query);
    },
    methods: {
      validate() {
        if (this.reset.password === '') {
          this.$toast({message: "请输入新密码" });
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
