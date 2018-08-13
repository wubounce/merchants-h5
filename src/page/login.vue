<template>
<div class="login" v-title="'企鹅共享商家端'">
  <div class="header">
    <h1 class="logo">
      <img src="../../static/logo.png"/>
    </h1>
  </div>
  <div class="form">
    <form ref="loginForm" :model="form">
      <div class="form-group input">
        <p class="userName">
          <input type="text" v-model.trim="form.userName" v-on:input="userinputFunc" placeholder="请输入用户名/手机号">
          <span class="open-eyes eyes iconfont icon-guanbi" v-if="isuser" @click="form.userName='';isuser=false;disabled=true"></span>
        </p>
        <div class="passWord">
          <input type="text" v-model.trim="form.password" v-if="typepwd" v-on:input="pwdinputFunc" autocomplete="off">
          <input type="password" v-model.trim="form.password" v-on:input="pwdinputFunc" placeholder="请输入密码" autocomplete="off" v-else>
          <div @click="openpwd" class="open-eyes">
            <span  class="eyes iconfont icon-yanjing" v-if="typepwd"></span>
            <span  class="eyes iconfont icon-biyanjing" v-else></span>
          </div>
        </div>
      </div>
      <div class="form-group">
        <p @click="goToReset" class="reset">忘记密码?</p>
        <mt-button type="primary" class="btn-blue" @click.prevent ="handleSubmit" :disabled="disabled">登录</mt-button>
      </div>
    </form>
  </div>
  <footer class="company">企鹅商家管理后台</footer>
</div>
</template>

<script>
import qs from "qs";
import { mapActions } from 'vuex';
import { getToken, removeToken, removeUser, removeMenu, removeNavTabIndex, getNavTabIndex } from '@/utils/tool';
import { login } from '@/service/login';
import Button from "@/components/Button/Button";
export default {
    name: 'page-login',
    beforeRouteEnter(to, from, next) {
      // 已登录直接返回首页
      if (getToken()) {
        let localData = getNavTabIndex();
        localData = localData?localData:'/index';
        next(localData);
        return;
      }
      // 测试环境不验证
      if (process.env.NODE_ENV === 'development') { 
        next();
        return;
      }
      next();
    },
    data () {
      return {
        form: {
          userName: '',
          password: ''
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
      removeMenu();
      removeNavTabIndex();
    },
    computed: {
      
    },
    methods: {
      ...mapActions([
        'login','getUser','getMenu'
      ]),
      validate() {
        if (this.form.userName === '') {
          this.$toast({message: "请输入用户名" });
          return false;
        }
        if (this.form.password === '') {
          this.$toast({message: "请输入密码"  });
          return false;
        }
        return true;
      },
      async handleSubmit () {
        if (this.validate()) {
          let loginInfo = Object.assign({},this.form);
          let res = await login(qs.stringify(loginInfo));
          if (res.code===0) {
              this.login(res.data.token);
              this.getMenu();
              if(res.data.code === 8002){
                this.$router.push({name:'bindPhone'});
              }else {
                this.$router.push({name:'index'});
              }
          }else {
             this.$toast(res.msg);
          }
        }
      },
      userinputFunc(){
        this.isuser = true;
        if (!this.form.userName || !this.form.password) {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
      },
      pwdinputFunc(){
        this.ispwd = true;
        if (!this.form.userName || !this.form.password) {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
      },
      openpwd(){
        this.typepwd = !this.typepwd;
      },
      goToReset() {
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
  min-height: 100%;
  background: #fff;
  .header {
    text-align: center;
  }
  .logo {
    width: 4.32rem;
    height: 1.2rem;
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
    margin: 1rem 0.92rem;
    .form-group {
      background: #fff;
      .userName , .passWord {
        height:1.55rem;
        border-bottom:1px solid rgba(229,229,229,1);
        input {
          width: 90%;
          padding-top: 0.49rem;
          padding-bottom: 0.48rem;
          height:1.55rem;
          font-size: 16px;
          color: #1890FF;
        }
      }
      .open-eyes {
        float: right;
      }
      .eyes {
        line-height:1.55rem;
        color:#979797;
      }
      .reset {
        font-size: 14px;
        line-height: 1;
        color: #999;
        margin-top: 0.27rem;
        margin-bottom: 0.67rem;
        text-align: right;
      }
    }
  }
}
.company {
  background: #fff;
  text-align: center;
  font-size:14px;
  color:#999;
  margin-top: 5.0rem;
}
.form-group button {
  height: 1.17rem;
  line-height: 1.17rem;
  width: 8.13rem;
  padding:0;
  border-radius:0.13rem;
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
