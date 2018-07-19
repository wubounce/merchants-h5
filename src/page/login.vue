<template>
<div class="login">
  <div class="header">
    <h1 class="logo">
      <img src="../../static/logo.png"/>
    </h1>
  </div>
  <div class="form">
    <form ref="loginForm" :model="form">
      <div class="form-group input">
        <p class="userName">
          <input type="text" v-model.trim="form.userName" v-on:input="userinputFunc" placeholder="请输入手机号码" style="width:90%">
          <span class="eyes iconfont icon-delx" v-if="isuser" @click="form.userName='';isuser=false"></span>
        </p>
        <div class="passWord">
          <div class="pwdshow">
            <input type="text" v-model.trim="form.passWord" v-if="typepwd" >
            <input type="password" v-model.trim="form.passWord" v-on:input="pwdinputFunc" placeholder="请输入密码" v-else>
          </div>
          <div class="eyes iconfont icon-nextx"  @click="openpwd"></div>
        </div>
      </div>
      <div class="form-group">
        <p @click="goToReset" class="reset">忘记密码?</p>
        <mt-button type="primary" class="btn-blue" @click.prevent ="handleSubmit">登录</mt-button>
      </div>
    </form>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex';
import { removeToken, removeUser } from '@/utils/tool';
import { validatPhone } from '@/utils/validate';
import { login, getDEtail } from '@/service/login';
import { MessageBox } from 'mint-ui';
import Button from "@/components/Button/Button";
export default {
    name: 'page-field',
    data () {
      return {
        form: {
          userName: '18923842668',
          passWord: '123456'
        },
        isuser:false,
        typepwd:false,
        disabled:true
      };
    },
    created () {
      // 每次登录之前清理缓存数据
      removeToken();
      removeUser();
    },
    computed: {
      
    },
    methods: {
      ...mapActions([
        'login','getUser'
      ]),
      validate() {
        if (this.form.userName === '') {
          this.$toast({message: "请输入手机号码" });
          return false;
        }else if (!validatPhone(this.form.userName)) {
          this.$toast({message: "请输入正确的手机号码" });
          return false;
        } 
        if (this.form.passWord === '') {
          this.$toast({message: "请输入密码"  });
          return false;
        }
        return true;
      },
      async handleSubmit () {
        if (this.validate()) {
          let loginInfo = Object.assign({},this.form);
          let res = await login(loginInfo);
          if (res.code===0) {
              this.login(res.data.token);
              let userinfor = await getDEtail();
              this.getUser(userinfor.data);
              this.$router.push('/index');
          }else {
              MessageBox.alert(res.msg);
          }
        }
      },
      userinputFunc(){
        this.isuser = true;
        this.disabled = false;
      },
      pwdinputFunc(){
        this.ispwd = true;
      },
      openpwd(){
        this.typepwd = !this.typepwd;
      },
      goToReset() {
        console.log(32142342);
        this.$router.push({name:'reset'});
      }
    },
    components: {
      Button
    }
  };
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  background: #fff;
  .header {
    text-align: center;
  }
  .logo {
    width: 3.61rem;
    display: inline-block;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    img {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }
  .form {
    margin: 0 0.92rem;
    .form-group {
      .userName , .passWord {
        height: 1.57rem;
        border-bottom:1px solid rgba(229,229,229,1);
        input {
          height: 1.57rem;
          font-size: 16px;
          color: #1890FF;
        }
      }
      .passWord, .userName {
        display: flex;
      }
      .pwdshow {
        width: 90%;
      }
      .eyes {
        line-height: 1.57rem;
        color:#979797;
      }
      .reset {
        font-size: 0.24rem;
        line-height: 1;
        color: #999;
        margin-top: 0.27rem;
        margin-bottom: 0.67rem;
        text-align: right;
      }
    }
  }
}
</style>
<style lang="scss">
  .login .mint-button-text {
    font-size: 16px;
  }
  .login .mint-button--primary {
    display: block;
    width: 100%;
  }
</style>
