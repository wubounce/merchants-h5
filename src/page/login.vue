<template>
<div class="login" v-title="'企鹅商家管理平台'">
  <div class="header">
    <h1 class="logo">
      <img src="../../static/logo.png"/>
    </h1>
  </div>
  <div class="form">
    <form ref="loginForm" :model="form">
      <div class="form-group input" v-if="loginPwd">
        <div class="userName">
          <label class="title">账号</label><input type="text" v-model.trim="form.userName" v-on:input="userinputFunc" @focus="isuser=true" placeholder="请输入用户名">
          <span class="open-eyes eyes iconfont icon-guanbi" v-show="isuser"  @click="form.userName='';isuser=false;disabled=true;form.password='';searchPhone=false"></span>
        </div>
        <div class="passWord">
          <label class="title">密码</label><input type="text" v-model.trim="form.password" v-if="typepwd" v-on:input="pwdinputFunc" @focus="isuser=false"  placeholder="请输入密码" autocomplete="off">
          <input type="password" v-model.trim="form.password" v-on:input="pwdinputFunc" placeholder="请输入密码" @focus="isuser=false" autocomplete="off" v-else>
          <div @click="openpwd" class="open-eyes">
            <span  class="eyes iconfont icon-yanjing" v-if="typepwd"></span>
            <span  class="eyes iconfont icon-biyanjing" v-else></span>
          </div>
        </div>
        <div class="phone-list" v-if="searchPhone&&searchPhoneList.length>0">
          <p v-for="(item,index) in searchPhoneList" :key="index" @click="checkPhone(item.userName)">{{item.userName}}</p>
        </div>
      </div>
      <div class="form-group input" v-if="!loginPwd">
        <div class="userName">
          <label class="title">手机号</label>
          <input type="text" v-model.trim="form.phone" placeholder="请输入手机号">
        </div>
        <div class="passWord relative">
          <label class="title">验证码</label>
          <input type="text" v-model.trim="form.code" placeholder="请输入验证码" autocomplete="off">
        </div>
        <div class="verificode">
          <p class="countdown" v-if="!btn">{{time}}s后重新获取</p>
          <p class="sendcode" @click="sendcode" v-if="btn">获取验证码</p>
        </div>
      </div>
      <div class="form-group">
        <p class="rememberPwd" @click="isRemember" v-if="loginPwd">
          <span class="iconfont" :class="isCheckCLass"></span>
          <span class="rememberText">记住密码</span>
        </p>
        <mt-button type="primary" class="btn-blue" @click.prevent ="handleSubmit" :disabled="!(form.userName&&form.password)" v-if="loginPwd">登录</mt-button>
        <mt-button type="primary" class="btn-validate" @click.prevent ="checkoutLogin" v-if="loginPwd">短信验证码登录</mt-button>
        <mt-button type="primary" class="btn-blue" @click.prevent ="phoneHandleSubmit" :disabled="!(form.phone&&form.code)" v-if="!loginPwd">登录</mt-button>
        <mt-button type="primary" class="btn-validate" @click.prevent ="checkoutLogin" v-if="!loginPwd">账号密码登录</mt-button>
        
      </div>
    </form>
  </div>
  <footer class="company">
    <div class="handleBox">      
      <span @click="goToReset" class="reset">忘记密码?</span>
      <span class="between">|</span>
      <span @click="goToRegister" class="register">立即注册</span>
    </div>
    <p class="company-name"> 企鹅商家管理平台</p>
  </footer>
</div>
</template>

<script>
import store from '@/store';
import { mapState, mapActions, mapMutations } from 'vuex';
import { setToken, getToken, removeToken, setMenu, removeMenu, removeNavTabIndex,setNavTabIndex, getNavTabIndex, setPhoneCode, getPhoneCode, getIsRemember, setIsRemember, getUserNameKey, setUserNameKey } from '@/utils/tool';
import { login, codeLogin, sendLoginCodeFun} from '@/service/login';
import JsEncrypt from 'jsencrypt';
import { menuSelectFun } from '@/service/member';
import { validatPhone, validatMessageCode} from '@/utils/validate';
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
          password: '',
          phone: '',
          code: ''
        },
        loginPwd: true,
        btn: true,
        time: 0,
        isCheckCLass: 'icon-weixuan',
        isuser:false,
        typepwd:false,
        disabled:true,
        disabledCode:true,
        phoneArray: getUserNameKey()? getUserNameKey():[],
        iphoneArr: getPhoneCode()? getPhoneCode():[],
        searchPhone:false,
        searchPhoneList: [],
      };
    },
    created () {
      // 每次登录之前清理缓存数据
      removeToken();
      removeNavTabIndex();
      removeMenu();
      this.form.userName = getUserNameKey() ? getUserNameKey()[0].userName:''; //最新一个用户名
      this.form.password = getUserNameKey() ? getUserNameKey()[0].password:'';
      this.isCheckCLass = getIsRemember() ? getIsRemember(): 'icon-weixuan';
      this.form.phone = getPhoneCode() ? getPhoneCode()[0]:'';
    },
    computed: {
        
    },
    methods: {
      ...mapActions([
        'getUserInfo'
      ]),
      checkoutLogin() {
        this.loginPwd = !this.loginPwd;
      },
      //验证手机号
      validatePhone() {
        if (this.form.phone === '') {
          this.$toast({message: "请输入手机号码" });
          return false;
        }else if (!validatPhone(this.form.phone)) {
          this.$toast({message: "请输入正确的手机号码" });
          return false;
        } 
        return true;
      },      
      async sendcode() {
        if (this.validatePhone()) {
          let res = await sendLoginCodeFun({phone:this.form.phone});
              this.time = 60;
              this.btn = false;
              this.countdown();
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
      isRemember() { //是否记住密码
        this.isCheckCLass = this.isCheckCLass === 'icon-weixuan'?'icon-yixuan':'icon-weixuan';
      },
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
      //手机验证码登录
      async phoneHandleSubmit() {
        if(this.validatePhone()) {
            let phone = this.form.phone;
            let code = this.form .code;
            let payload = {
            userName: phone,
            code: code
            };
            let res = await codeLogin(payload);
            setToken(res.token);
            this.getUserInfo();
            this.iphoneArr = [this.form.phone,...this.iphoneArr];
            this.iphoneArr = Array.from(new Set([...this.iphoneArr]));//去重
            setPhoneCode(this.iphoneArr); //保存登录过的手机号
            if(res.code === 8002){
              this.$router.push({name:'bindPhone'});     
            }else {
              menuSelectFun().then((data) => {
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
      //账号密码登录
      async handleSubmit () {
        if (this.validate()) {
          let userName = this.encryptSend(this.form.userName);
          let password = this.encryptSend(this.form.password);
          let payload = {
            password:password,
            userName:userName
          };
          let res = await login(payload);
          setToken(res.token);
          this.getUserInfo();
          let remPassword = this.isCheckCLass === 'icon-yixuan'?this.form.password:'';
          let obj = {
            password:remPassword,
            userName:this.form.userName
          };
          this.phoneArray = [obj,...this.phoneArray];
          let hash = {};
          this.phoneArray = this.phoneArray.reduce(function(item, next) {
            hash[next.userName] ? '' : hash[next.userName] = true && item.push(next);
            return item;
          }, []);
          setIsRemember(this.isCheckCLass);
          setUserNameKey(this.phoneArray); //保存登录过的用户名
         if(res.code === 8002){
            this.$router.push({name:'bindPhone'});     
          }else {
            menuSelectFun().then((data) => {
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
        this.form.userName ? this.searchPhone = true:this.searchPhone = false;
        this.searchPhoneList = this.phoneArray.filter(item => item.userName.startsWith(this.form.userName));
        if(this.form.userName.length<1) {
          this.form.password = '';
          this.isuser = false;
        }
      },
      pwdinputFunc(){
        this.ispwd = true;
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
      .relative {
        position: relative;
      }
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
      .verificode {
        position: absolute;
        right: 0rem;
        top: 2.0rem;
        p {
          font-size: 12px;
          border: 1px solid #1890FF;
          padding: 0.15rem;
          border-radius: 5px
        }
        .countdown {
          border: 1px solid #999;
          color: #999;
        }
        .sendcode {
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
      .btn-validate {
        margin-top:.4rem;
        background-color: #ffffff;
        color: rgba(24, 144, 255, 1);
        border: 1px solid #1890ff;
      }
      .reset {
        font-size: 14px;
        line-height: 1;
        color: #999;
        margin-top: 0.27rem;
        margin-bottom: 0.67rem;
        text-align: right;
      }
      .rememberPwd {    
        line-height: 1;
        margin-top: 0.27rem;
        margin-bottom: 0.67rem;
        text-align: right;
        color: rgba(24, 144, 255, 1);
        .icon-weixuan {     
          font-size: 12px;
        }
        .icon-yixuan {
          font-size: 12px;
        }
        .rememberText {
          font-size: 12px;
        }
      }

      input::-webkit-input-placeholder {
        font-size: 0.43rem;
        line-height: 0.78rem;
      }
    
      input::-moz-placeholder {
        font-size: 0.43rem;
        line-height: 0.78rem;
      }
    
      input :-ms-input-placeholder {
        font-size: 0.43rem;
        line-height: 0.78rem;
      }
      
    }
  }
}
.company {
  background: #fff;
  text-align: center;
  font-size:12px;
  color:#999;
  margin-top: 2.0rem;
  margin-bottom: 0.53rem;
  .between {
    margin: 0 0.32rem;
  }
  .company-name {
    margin-top: 0.67rem;
  }
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
