<template>
  <transition name='fade' mode="out-in">
    <div class="alert" v-if="showAlert">
      <div class="wrap">
        <div class="head">{{title}}</div>
        <div class="body">
          <slot>
            <p>{{message}}</p>
          </slot>
        </div>
        <div class="foot">
          <div v-if="type === 'confirm'" class="confirm">
            <button class="btn-base" @click="confirm">确定</button>
            <button class="btn-gray" @click="cancel">取消</button>
          </div>
          <div v-else-if="type === 'inform'" class="inform">
            <button class="btn-base" @click="cancel">知道了</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    showAlert: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "提示"
    },
    message: {
      type: String,
      default: "提示的内容"
    },
    type: {
      type: String,
      default: "confirm",
      validator(value) {
        return value === "confirm" || value === "inform";
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    confirm() {
      this.$emit("confirm", true);
    },
    cancel() {
      this.$emit("cancel", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.alert {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  .wrap {
    position: absolute;
    z-index: 1002;
    min-width: 5.4rem;
    background: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 0.26rem;
    text-align: center;
    .head {
      padding: 0.25rem;
      border-bottom: 1px solid #dedede;
      color: #333;
      font-weight: bold;
      font-size: 0.34rem;
      line-height: 1;
    }
    .foot {
      border-top: 1px solid #dedede;
      button {
        margin: 0;
        padding: 0.25rem;
        border: 0;
        background: transparent;
      }
      .confirm {
        overflow: hidden;
        button {
          width: 50%;
          float: left;
          border-right: 1px solid #dedede;
          &:last-child {
            border: 0;
          }
        }
      }
    }
  }
}
</style>

