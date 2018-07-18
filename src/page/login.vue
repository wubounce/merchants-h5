<template>
  <section>
    <div class="login">
      <h1 class="logo">
        <img src="../assets/img/home/bg_big.png" />
      </h1>
      <div class="form">
      <form ref="loginForm" :model="form">
        <div class="form-group input">
          <p class="userName"><input type="text" v-model="form.userName" placeholder="用户名"></p>
          <p class="passWord"><input type="password" v-model="form.passWord" placeholder="密码"></p>
        </div>
        <div class="form-group">
          <Button  class="login-button" @confirm="handleSubmit" btn-type="default" btn-color="blue" >登录</Button>
          <p @click="goToReset" class="reset">忘记密码?</p>
        </div>
        </form>
      </div>
    </div>

  </section>
</template>

<script>
import { mapActions } from 'vuex';
import { removeToken, removeUser } from '@/utils/tool';
import { login, getDEtail } from '@/service/login';
import { MessageBox } from 'mint-ui';
import Button from "@/components/Button/Button";
export default {
    name: 'page-field',
    data () {
      return {
        form: {
          userName: '',
          passWord: ''
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
        'login','getUser'
      ]),
      validate() {
          if (this.form.userName === '') {
            this.$toast({message: "请输入账号"  });
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
      goToReset() {
        this.$router.push({name: "reset"});
      }
    },
    components: {
      Button
    }
  };
</script>

<style lang="scss" scoped>
body{
  
.login {
  text-align: center;
  height: 100vh;
  background: #fff;
  .logo {
    width: 3.24rem;
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
    margin: 0 0.55rem;
    .form-group {
      margin-bottom: 1rem;
      p {
        margin: 0;
        
        &:first-child {
          border-bottom: 1px solid #dedede;
          border-radius: 0.1rem 0.1rem 0 0;
        }
        input {
          font-size: 0.3rem;
          line-height: 1;
          padding: 0.24rem;
          box-sizing: border-box;
          color: #7f7f7f;
          display: inline-block;
          width: 100%;
          border: 0;
        }
      }
      .login-button{
        font-size: .32rem;
      }
      .userName {
        input {
          border-radius: 0.1rem 0.1rem 0 0;
        }
      }
      .passWord {
        input {
          border-radius: 0 0 0.1rem 0.1rem;
        }
      }
      .reset {
        font-size: 0.24rem;
        line-height: 1;
        color: #2c92fb;
        margin-top: 0.45rem;

      }
    }
    .input {
      border: 1px solid #dedede;
      border-radius: 0.1rem;
    }
  }
}
}

</style>
