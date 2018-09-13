<template>
<div class="login" v-title="'企鹅商家管理平台'">
  <div class="header">
    <h1 class="logo">
      <img src="../../static/logo.png"/>
    </h1>
  </div>
  <div class="form">
    <form ref="loginForm" :model="form">
      <div class="form-group input">
        <div class="userName">
          <label class="title">账号</label><input type="text" v-model.trim="form.userName" v-on:input="userinputFunc" placeholder="请输入用户名/手机号">
          <span class="open-eyes eyes iconfont icon-guanbi"  v-show="isuser" @click="form.userName='';isuser=false;disabled=true;searchPhone=false"></span>
        </div>
        <div class="passWord">
          <label class="title">密码</label><input type="text" v-model.trim="form.password" v-if="typepwd" v-on:input="pwdinputFunc" placeholder="请输入密码" autocomplete="off">
          <input type="password" v-model.trim="form.password" v-on:input="pwdinputFunc" placeholder="请输入密码" autocomplete="off" v-else>
          <div @click="openpwd" class="open-eyes">
            <span  class="eyes iconfont icon-yanjing" v-if="typepwd"></span>
            <span  class="eyes iconfont icon-biyanjing" v-else></span>
          </div>
        </div>
        <div class="phone-list" v-if="searchPhone&&searchPhoneList.length>0">
          <p v-for="(item,index) in searchPhoneList" :key="index" @click="checkPhone(item)">{{item}}</p>
        </div>
      </div>
      <div class="form-group">
        <mt-button type="primary" class="btn-blue" @click.prevent ="handleSubmit" :disabled="disabled">登录</mt-button>
        <div class="handleBox">      
          <p @click="goToReset" class="reset">忘记密码?</p>
          <p @click="goToRegister" class="register">立即注册</p>
        </div>
      </div>
    </form>
  </div>
  <footer class="company">企鹅商家管理平台</footer>
</div>
</template>

<script>
import store from '@/store';
import { mapState, mapActions, mapMutations } from 'vuex';
import { getToken, removeToken, setMenu, removeMenu, removeNavTabIndex,setNavTabIndex, getNavTabIndex, setPhone, getPhone, removeMember } from '@/utils/tool';
import { login } from '@/service/login';
import JsEncrypt from 'jsencrypt';
import { menuSelectFun } from '@/service/member';
export default {
    name: 'page-login',
    beforeRouteEnter(to, from, next) {
      // 已登录直接返回首页
      if (getToken()) {
        if (getNavTabIndex()) {
          let localData = getNavTabIndex();
          next(localData);
        } else {
          menuSelectFun().then((data) => {
            store.commit('setMenu', data);
            setMenu(data);
            let pac = data.find(item=>item.name === '首页' || item.name === '报表');
            let url = data.length >0 ? data[0].url:'user';
            let path = pac ? pac.url : url;
            setNavTabIndex('/'+ path);
             next(path);
          });
        }
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
        disabled:true,
        phoneArray: getPhone()? getPhone():[],
        searchPhone:false,
        searchPhoneList:[],
      };
    },
    created () {
      // 每次登录之前清理缓存数据
      removeToken();
      removeNavTabIndex();
      removeMember();
      removeMenu();
      this.form.userName = getPhone() ? getPhone()[0]:''; //最新一个用户名
    },
     computed: {
        ...mapState({
            firstRoute: state => state.user.firstRoute
        }),
    },
    methods: {
      ...mapActions([
        'login','getMenu'
      ]),
      ...mapMutations([ 
          'setMenu',
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
          let userName = this.encryptSend(this.form.userName);
          let password = this.encryptSend(this.form.password);
          let payload = {
            password:password,
            userName:userName
          };
          let res = await login(payload);
          this.login(res.token);
          this.phoneArray = [this.form.userName,...this.phoneArray];
          this.phoneArray = Array.from(new Set([...this.phoneArray]));//去重
          setPhone(this.phoneArray); //保存登录过的手机号
         if(res.code === 8002){
            this.$router.push({name:'bindPhone'});     
          }else {
            menuSelectFun().then((data) => {
              this.setMenu(data);
              setMenu(data);
              let pac = data.find(item=>item.name === '首页' || item.name === '报表');
              let url = data.length >0 ? data[0].url:'user';
              let path = pac ? pac.url : url;
              setNavTabIndex('/'+ path);
              this.$router.push(path);
            });
          }
        }
      },
      encryptSend(data) {
        let jsencrypt = new JSEncrypt();
        let publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAh/dHI4eSGQU55+WY2QIWguZ8got/aCairVO+8fMj6dHPWPb3AAhvfNZ7BrUaKUrPQqpt2QVRmV+UZp/bot6ukNEZMFMaSjGf4FFtRNbjIn+5jo8sC3rn6+9k2XNvAMydTDtU0P8Ebhbm1gg6O+gg+iRIAX3awWZajy2senYD7zSDguqyL8xuh6S9RG2wjPsN8LNuKd3klD1rw3kmX0Q672kSW6vm+GHzWun6jYaWac2w936NlvnbQI1P1lFjcgv0OgFBm/4yoLMhx6wZD9KTKG2S7wZRNmbzEaXyrTTdJ+Q1NE4+gqHCAFfHKrzB2zvY2I0v8QL7JLMpCevChRgEcwIDAQAB';
        jsencrypt.setPublicKey(publicKey);
        return jsencrypt.encrypt(data);

      },
      userinputFunc(){
        this.isuser = true;
        this.form.userName ? this.searchPhone = true:this.searchPhone = false;
        this.searchPhoneList = this.phoneArray.filter(item => item.startsWith(this.form.userName));
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
      checkPhone(item){
        this.form.userName = item;
        this.searchPhone = false;
      },
      openpwd(){
        this.typepwd = !this.typepwd;
      },
      goToReset() {
        this.$router.push({name:'reset'});
      },
      goToRegister() {
        this.$router.push({name:'register'});
      }
    },
    components: {
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
    margin: 1rem 0.93rem;
    .form-group {
      background: #fff;
      position: relative;
      .userName , .passWord {
        font-size: 0.43rem;
        border-bottom: 1px solid rgba(229,229,229,1);
        .title {
          width: 1.92rem;
          display: inline-block;
          line-height: 1.55rem;
        }
        input {
          width: 5rem;
          height: 1.55rem;
          padding-top: 0.49rem;
          padding-bottom: 0.48rem;
          font-size: 16px;
          color: #1890FF;
        }
      }
      .open-eyes {
        width: 0.6rem;
        float: right;
      }
      .eyes {
        line-height:1.55rem;
        color:#979797;
      }
      .btn-blue {
        margin-top: 0.67rem;
      }
      .handleBox {
        display: flex;
        .reset {
          flex: 1;
          font-size: 14px;
          line-height: 1;
          color: #666666;
          margin-top: 0.67rem;
          margin-bottom: 0.67rem;
        }
        .register {
          flex: 1;
          font-size: 14px;
          line-height: 1;
          color: #666666;
          margin-top: 0.67rem;
          margin-bottom: 0.67rem;
          text-align: right;
        }
      }
    }
  }
}
.company {
  background: #fff;
  text-align: center;
  font-size:14px;
  color:#999;
  margin-top: 4.0rem;
  margin-bottom: 0.53rem;
}
.form-group button {
  height: 1.17rem;
  line-height: 1.17rem;
  width: 8.13rem;
  padding:0;
  border-radius:0.13rem;
}
.phone-list {
  width: 6.24rem;
  position: absolute;
  z-index: 2;
  background: #fff;
  padding-left: 1.92rem;
  top:1.6rem;
  min-height: 6.67rem;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  p {
    font-size: 16px;
    color: #999;
    line-height: 1.17rem;
    border-bottom: 1px solid rgba(229,229,229,1);
    &:last-child{
      border: none;
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
    height: 1.17rem;
  }
</style>
