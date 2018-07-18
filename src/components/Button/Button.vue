<template>
  <button type="button" :class="[computedSize,computedType,computedColor]" @click="confirm">
    <slot>
      <span>{{name}}</span>
    </slot>
  </button>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: "确定"
    },
    btnColor: {
      type: String,
      default: ""
    },
    btnType: {
      type: String,
      default: ""
    },
    btnSize: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {
    computedSize() {
      return this.btnSize ? `btn-${this.btnSize}` : "";
    },
    computedColor() {
      return this.btnColor ? `btn-${this.btnColor}` : ""; 
    },
    computedType() {
      return this.btnType ? `${this.btnType}` : "";
    }
  },
  methods: {
    confirm() {
      this.$emit("confirm");
    }
  }
};
</script>

<style lang="scss" scoped>
.default {
  border-radius: 0.08rem;
  border: 0;
  padding: 0.3rem;
  display: block;
  width: 100%;
}
.btn-blue {
  background: #2c92fb;
  color: #fff;
}
.btn-green {
  background: #24C62A;
  color: #fff;
}
.btn-orange {
  background: #FF6E23;
  color: #fff;
}
.btn-red {
  background: #FF3E3E;
  color: #fff;
}
.btn-yellow {
  background: #EEDD00;
  color: #fff;
}
.btn-lock {
  background: #7F7F7F;
  color: #fff;
}
.small {
  border-radius: 0.05rem;
  font-size: 0.28rem;
  line-height: 1;
  width: 1rem;
  height: 0.45rem;
  display: inline-block;
  text-align: center;
  line-height: 0.45rem;
  border: 0;
  vertical-align: middle;
  margin: 0;
  padding: 0;
}
.btn-spe {
  border: 1px solid #2c92fb;
  color: #2c92fb;
  background: transparent;
}
.btn-red {
  border: 1px solid red;
  color: red;
  background: transparent;
}
</style>
