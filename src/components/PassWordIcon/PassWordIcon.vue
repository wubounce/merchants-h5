<template>
  <p :class="{'showpassword': types === 'text','hidepassword': types === 'password'}" @click="change"></p>
</template>

<script>
export default {
  props: {
    types: {
      type: String
    }
  },
  data() {
    return {};
  },
  methods: {
    change() {
      this.$emit('onChange')
    }
  }
};
</script>

<style lang="scss" scoped>
.showpassword,
.hidepassword {
  position: absolute;
  right: 0.3rem;
  top: 0.4rem;
  width: 0.3rem;
  height: 0.22rem;
}
.showpassword {
  background: url("../../../static/image/user/show.png") no-repeat;
  background-size: contain;
}
.hidepassword {
  background: url("../../../static/image/user/hide.png") no-repeat;
  background-size: contain;
}
</style>
