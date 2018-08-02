<template>
  <div class="contant" v-title="title">
    <div class="erweima">
      <img src="../../../static/image/user/logo@2x.png">
    </div>
     <div class="work-time">
      <p>服务时间：周一至周日 08:00-22:30</p>
    </div>
    <p class="gaunzhu">服务热线：400 668 9966</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        title:'合作热线'
      };
    },
    created(){
    },
    methods: {
     
    },
    components: {
    }
  };
</script>

<style lang="scss" scoped>
.contant {
  background: #fff;
  height: 100%;
  text-align: center;
  .erweima {
    width:2.96rem;
    height:2.52rem;
    padding-top: 2.12rem;
    margin:0 auto;
    background: #fff;
    img {
      display: block;
      width: 100%;
    }
  }
  .gaunzhu {
    font-size: 18px;
    text-align: center;
    margin-top: 0.4rem;
  }
  .work-time {
    margin-top: 1.33rem;
    font-size: 14px;
    color: #999;
    text-align: center;
    line-height: 0.64rem;
  }
}
</style>

