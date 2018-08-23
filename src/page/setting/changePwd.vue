<template>
  <div class="change-pwd" v-title="title">
    <form ref="resetForm" :model="reset">
      <div class="resetForm">
        <div class="form-group">
          <span class="title">旧密码</span><input type="password" placeholder="请输入旧密码" autocomplete="off" v-model="reset.oldPassword" @input="disbaledBtn">
        </div>
        <div class="form-group">
          <span class="title">新密码</span><input type="password" placeholder="请输入新密码" autocomplete="off" v-model="reset.password" @input="disbaledBtn">
        </div>
        <div class="form-group">
          <span class="title">确认新密码</span><input type="password" placeholder="请再次确认新密码" autocomplete="off" v-model="reset.checkpassword" @input="disbaledBtn">
        </div>
      </div>
    </form>
    <p class="change-pwd-btn">
       <mt-button type="primary" class="btn-blue" @click.prevent="changePwdConfirm" :disabled="disabled">确定</mt-button>
    </p>
  </div>
</template>

<script>
  import { updatePwdFun } from '@/service/resetPwd';
  import qs from 'qs';
  import { validatPwd } from '@/utils/validate';
  import { removeToken, removeNavTabIndex } from '@/utils/tool';
  export default {
    data() {
      return {
        reset: {
          oldPassword: '',
          password: '',
          checkpassword:''
        },
        disabled: true,
        title:'修改密码'
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
        }else if (!validatPwd(this.reset.password)) {
          this.$toast({message: "新密码6-20位，支持英文字母和数字" });
          return false;
        } 

        if (this.reset.oldPassword === this.reset.password) {
          this.$toast({message: " 旧密码和新密码不允许相同" });
          return false;
        }
        if (this.reset.checkpassword === '') {
          this.$toast({message: "请再次确认新密码" });
          return false;
        }else if (!validatPwd(this.reset.checkpassword)) {
          this.$toast({message: "新密码6-20位，支持英文字母和数字" });
          return false;
        } else if (this.reset.password !== this.reset.checkpassword) {
          this.$toast({message: "两次输入的新密码不一致" });
          return false;
        }
        return true;
      },
      disbaledBtn(){
        if (this.reset.oldPassword !== '' && this.reset.password !== '' && this.reset.checkpassword !== '') {
          this.disabled = false;
        }
      },
      async changePwdConfirm() {
        if (this.validate()) { 
          let payload = Object.assign({},this.reset);
          delete payload.checkpassword;
          let res = await updatePwdFun(qs.stringify(payload));
          if (res.code===0) {
            removeNavTabIndex();
            removeToken();
            this.$router.push({name:'login'});
          }else {
            this.$toast({
              message: "您输入的旧密码有误",
              position: "middle",
              duration: 3000
            });
          }
        }
      },
    },
    components: {
      
    }
  };
</script>

<style lang="scss" scoped>
  .change-pwd {
    height: 100%;
    .resetForm {
      padding-left: 0.4rem;
      background: #fff;
      margin-top: 0.27rem;
    }
    .form-group {
      position: relative;
      height:1.17rem;
      line-height: 1.17rem;
      border-bottom:1px solid #f9f8ff;
      font-size: 16px;
      display: flex;
      .title {
        width: 3.6rem;
      }
      input {
        height:1.17rem;
        font-size: 16px;
      }
    }
    .form-group:last-child {
      border: none;
    }
    .change-pwd-btn button {
      display: block;
      width: 9.2rem;
      height: 1.17rem;
      line-height: 1.17rem;
      margin:0.67rem auto;
      padding: 0;
    }
  }
</style>
<style lang="scss">

</style>
