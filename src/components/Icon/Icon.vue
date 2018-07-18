<template>
  <div class="icon" :style="{ backgroundImage: 'url(' + image + ')' }">
    <slot>
      <span>{{fontSize}}</span>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    fontSize: {
      type:  Number
    },
    image: {
      type: String,
    }
  },
  data() {
    return {};
  },
  mounted() {
    console.log(this.image)
  }
};
</script>

<style lang="scss" scoped>
</style>

