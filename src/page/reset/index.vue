<!-- <template>
  <div class="reset">
    <mt-header title="忘记密码">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="form-group">
      <input type="text" placeholder="请输入手机号码" v-model="reset.phone">
    </div>
    <div class="form-group">
      <input type="text" placeholder="请输入手机验证码" v-model="reset.code">
      <div class="r">
        <p class="countdown" v-if="!btn">{{time}}s</p>
        <p class="sendcode" @click="sendcode" v-if="btn">发送验证码</p>
      </div>
    </div>
    <div class="form-group">
      <input type="text" placeholder="请输入新登录密码" v-model="reset.passWord">
    </div>
    <p class="btn">
      <Button @confirm="updatedConfirm" btn-type="default" btn-color="blue">确认修改并返回登录</Button>
    </p>
  </div>
</template>

<script>
  import {
    api
  } from "@/api/api";
  import Button from "@/components/Button/Button";
  export default {
    data() {
      return {
        reset: {
          phone: "",
          code: "",
          passWord: ""
        },
        timer: null,
        time: 60,
        btn: true
      };
    },
    methods: {
      updatedConfirm() {},
      sendcode() {
        this.http
          .post(api.sendCode, {
            phone: this.reset.phone,
            type: 3,
            templateId: "resetpwd"
          })
          .then(it => {
            if (it.data.success) {
              this.countdown();
            } else {
              this.$toast({
                message: it.data.message,
                position: "bottom",
                duration: 3000
              });
            }
          })
          .catch(() => {
            this.$toast({
              message: "后台接口错误",
              position: "bottom",
              duration: 3000
            });
          });
      },
      countdown() {
        this.timer = setInterval(() => {
          if (--this.time <= 0) {
            clearInterval(this.timer);
            this.btn = true;
          }
        }, 1000);
      }
    },
    components: {
      Button
    }
  };
</script>

<style lang="scss" scoped>
  .reset {
    .form-group {
      position: relative;
      border-bottom: 1px solid #dedede;
      input {
        padding: 0.24rem;
      }
      .r {
        position: absolute;
        right: 0.24rem;
        top: .07rem;
        p {
          padding: 0.16rem;
          margin: 0;
          border-radius: 0.08rem;
          line-height: 1;
        }
        .countdown {
          border: 1px solid #7f7f7f;
          color: #7f7f7f;
        }
        .sendcode {
          border: 1px solid #2c92fb;
          color: #2c92fb;
        }
      }
    }
    .btn {
      margin: 0.5rem 0.55rem 0;
    }
  }
</style>
 -->