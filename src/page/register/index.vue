<template>
  <section class="register">
    <div ref="registerForm" :model="register" class="register-form">
    <div class="form-group">
      <input type="number" placeholder="请输入手机号" v-model="register.phone" @input="disabledBtn" @blur="checkPhone" required>
    </div>
    <div class="form-group">
      <div> 
        <input type="text" placeholder="请输入验证码" v-model="register.vcode" @input="disabledBtn" required>
      </div>
      <div class="verificode">
        <p class="countdown" v-if="!btn">{{time}}s后重新获取</p>
        <p class="sendcode" @click="sendcode" v-if="btn">获取验证码</p>
      </div>
    </div>
    <div class="form-group">
        <input type="password" placeholder="请输入密码（6-20位）" v-model="register.code" @input="disabledBtn" required>
    </div>
    <div class="form-group">
        <input type="password" placeholder="请再次输入密码" v-model="register.sureCode" @input="disabledBtn" required>
    </div>
    </div>
    <div class="clickBtn">
    <mt-button type="primary" class="btn-blue" @click.prevent="goToNext" :disabled="disabled">下一步</mt-button>
    </div>
  </section>
</template>

<script>
  import { smscodeFun, checkRegInfoFun, checkPhoneFun} from '@/service/resetPwd';
  import { validatPhone , validatName , validatPwd } from '@/utils/validate';
  import { sendLoginCodeFun} from '@/service/login';
  export default{
    data() {
      return {
        register: {
          phone: '',
          vcode: '',
          code: '',
          sureCode: ''
        },
        disabled:true,
        timer: null,
        time: 0,
        btn: true
      };
    },
    methods: {
      async sendcode() {  //发送验证码
        if (this.validatePhone()) {
          let res = await smscodeFun({phone:this.register.phone,mark:true});
            this.time = 60;
            this.btn = false;
            this.countdown();
        }
      },
      async checkPhone() {
        if (this.validatePhone()) {
          let res = await checkPhoneFun({phone:this.register.phone});
          if(res.exist) {
            this.$toast({message: "该号码已注册，请更换手机号" });
          }
        }
      },
      countdown() { //重新发送验证码倒计时
        this.btn = false;
        this.timer = setInterval(() => {
          if (--this.time <= 0) {
            clearInterval(this.timer);
            this.btn = true;
          }
        }, 1000);
      },
      disabledBtn() {  //输入框未填完，按钮不可点击
        if(!this.register.phone || !this.register.vcode || !this.register.code || !this.register.sureCode) {
          this.disabled = true;
        }else {
          this.disabled = false;
        }
      },
      validatePhone() { //验证手机
        if (this.register.phone === '') {
          this.$toast({message: "请输入手机号码" });
          return false;
        }else if(!validatPhone(this.register.phone)) {
          this.$toast({message: "请输入正确的手机号码" });
          return false;
        } 
        return true;
      }, 
      validateName() {  //验证用户名
        if (this.register.name === '') {
          this.$toast({message: "请输入用户名"});
          return false;
        }else if(!validatName(this.register.name)) {
          this.$toast({message: "用户名2-20个字符，支持中文和英文" });
          return false;
        }
        return true;
      },
      validateCode() {  //验证密码
        if (this.register.code === '') {
          this.$toast({message: "请输入密码"});
          return false;
        }else if(!validatPwd(this.register.code)) {
          this.$toast({message: "密码6-20个字符，只支持数字和英文" });
          return false;
        }
        return true;
      },

      validateSureCode() { //验证确认密码
        if (this.register.sureCode === '') {
          this.$toast({message: "请输入密码"});
          return false;
        }else if (!validatPwd(this.register.sureCode)) {
          this.$toast({message: "密码6-20个字符，只支持数字和英文" });
          return false;
        }else if (this.register.code !== this.register.sureCode){
          this.$toast({message: "两次输入的密码不一致"});
          return false;
        }
        return true;
      },

      async goToNext() {  //提交
        if(!this.validatePhone()) return false;
        if(!this.validateCode()) return false;
        if(!this.validateSureCode()) return false;
        let payload = {
          phone: this.register.phone,
          code: this.register.vcode,
        };
        let res = await checkRegInfoFun(payload);
        this.$router.push({
          name: "referee",
          query: ({phone:this.register.phone,password:this.register.code})
        });
      }
    },
    mounted() {

    },
  };
</script>
<style lang="scss" scoped>
  .register {
    background: #fff;
    height: 100%;
    .register-form {
      padding: 0 0.93rem;
      .form-group {
        height: 1.57rem;
        font-size: 0.43rem;
        box-sizing: border-box;
        position: relative;
        .verificode {
          position: absolute;
          right: 0rem;
          top: 0.46rem;
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
        input {
          height: 1.57rem;
          border-bottom: 0.01rem solid #e5e5e5;
          color: #1890FF;
        }

      }
    }
    .clickBtn {
      margin: 1.47rem 0.93rem;
      .btn-blue {
        width: 100%;
        height: 1.17rem;
        line-height: 1.17rem;
        border-radius: 0.13rem;
      }
    }
  }
  
</style>
