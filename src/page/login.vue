<!-- <template>
  <div class="page-field">
    <div class="page-part">
      <form ref="loginForm" :model="form">
        <mt-field placeholder="登录邮箱" v-model="form.username" ref="input"></mt-field>
        <div class="mint-msgbox-errormsg" :style="{ visibility: !!errorArr.nameErrorMsg ? 'visible' : 'hidden' }">{{ errorArr.nameErrorMsg }}</div>
        <mt-field placeholder="密码" type="password" v-model="form.password"></mt-field>
        <div class="mint-msgbox-errormsg" :style="{ visibility: !!errorArr.pwdErrorMsg ? 'visible' : 'hidden' }">{{ errorArr.pwdErrorMsg }}</div>
        <mt-button type="primary" size="small" @click.prevent="handleSubmit()">登录</mt-button>
      </form>
    </div>
  </div>
</template>

<script>
  import qs from 'qs';
  import { mapActions } from 'vuex';
  import { removeToken, removeUser } from '@/utils/tool';
  import { login } from '@/service/login';
  import { MessageBox } from 'mint-ui';

  export default {
    name: 'page-field',
    data () {
      return {
        errorArr:{
          nameErrorMsg:'',
          pwdErrorMsg:''
        },
        form: {
          username: '',
          password: ''
        }
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
        'login'
      ]),
      validate() {
          if (this.form.username === '') {
            this.errorArr.nameErrorMsg = '请输入账号!';
            return false;
          }
          if (this.form.password === '') {
            this.errorArr.pwdErrorMsg = '请输入密码!';
            return false;
          }
          return true;
      },
      async handleSubmit () {
        if (this.validate()) {
          let loginInfo = Object.assign({},this.form);
          let res = await login(qs.stringify(loginInfo));
          if (res.code===0) {
              this.login(res.data);
              console.log(this.$route.query);
              // this.$router.push(this.$route.query.redirect);
              this.$router.push('/');
          }else {
              MessageBox.alert(res.msg);
          }
        }
      }
    }
  };
</script>
<style type="text/css" lang="less">
  .mint-cell-wrapper:after {
    height: 1px;
    content: '';
    width: 100%;
    border-top: 1px solid #ddd;
    position: absolute;
    bottom: -1px;
    right: 0;
    transform: scaleY(0.5);
    -webkit-transform: scaleY(0.5)
  }
</style>
 -->

 <template>
  <div class="login-wrapper">
    <div class="main-img">
      <img src="../assets/img/home/bg_big.png" />
    </div>
    <div class="login-con">
    <form ref="loginForm" :model="form">
      <div class="user-phone input-t">
        <input type="text" placeholder="请输入手机号码" v-model="form.username" />
        
      </div>
      <div class="user-code input-t">
        <input type="number" placeholder="请输入验证码" v-model="form.password" />
      </div>
      </form>
    </div>
    <button type="button" class="login" @click="handleSubmit">登录</button>
  </div>
</template>

<script>
  import qs from 'qs';
  import { mapActions } from 'vuex';
  import { removeToken, removeUser } from '@/utils/tool';
  import { login } from '@/service/login';
  import { MessageBox } from 'mint-ui';

  export default {
    name: 'page-field',
    data () {
      return {
        errorArr:{
          nameErrorMsg:'',
          pwdErrorMsg:''
        },
        form: {
          username: '',
          password: ''
        }
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
        'login'
      ]),
      validate() {
          if (this.form.username === '') {
            this.errorArr.nameErrorMsg = '请输入账号!';
            return false;
          }
          if (this.form.password === '') {
            this.errorArr.pwdErrorMsg = '请输入密码!';
            return false;
          }
          return true;
      },
      async handleSubmit () {
        if (this.validate()) {
          let loginInfo = Object.assign({},this.form);
          let res = await login(qs.stringify(loginInfo));
          if (res.code===0) {
              this.login(res.data);
              console.log(this.$route.query);
              // this.$router.push(this.$route.query.redirect);
              this.$router.push('/index');
          }else {
              MessageBox.alert(res.msg);
          }
        }
      }
    }
  };
</script>

<style lang="less">
  .login-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #FFFFFF;
    .main-img {
      width: 2.77rem;
      height: 2.845rem;
      margin: 1rem auto 0;
      img {
            width: 100%;
      }
    }
    .login-con {
      margin-top: 1.06rem;
      .input-t {
        width: 90%;
        height: 1.16rem;
        line-height: 1.16rem;
        border: .01rem solid #DFE6FF;
        border-radius: .1rem;
        margin: 0 auto;
        padding: .01rem .3rem;
        input {
          width: 100%;
          height: 80%;
          border-radius: 0.133333rem;
        }
        input::-webkit-input-placeholder {
          color: #BAC0D2;
        }
      }
      .user-phone {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: .5rem;
      }
      .user-code {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .code {
          color: #4E6DFF;
        }
      }
    }
    .login {
      width: 6.6rem;
      height: .96rem;
      margin: .7rem .45rem 0;
      background: linear-gradient(-131.3deg, rgba(101, 122, 255, 1), rgba(91, 105, 255, 1));
      border-radius: .61rem;
      border: .01rem solid #4E6DFF;
      font-size: .36rem;
      color: #FFFFFF;
      line-height: .5rem;
    }
  }
</style>