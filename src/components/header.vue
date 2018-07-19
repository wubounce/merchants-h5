<template>
  <div>
    
    <div class="page-header-main">
      <mt-header :title="title">
        <router-link to="router.go(-1)" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button slot="right" icon="more"></mt-button>
      </mt-header>
    </div>

  </div>
</template>

<script>
export default {
  name: 'component-header',
   props: {
    title: {
      type: String,
      default: ""
    },
    path: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
    };
  },
  methods: {
   
  }
};
</script>

<style lang="css">
.mint-header{
  background-color: #fff;
  color: #333;
}
</style>