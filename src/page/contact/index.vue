<template>
  <div class="contant" v-title="title">
    <div class="erweima">
      <img src="../../../static/image/user/Bitmap@2x.png">
    </div>
    <p class="gaunzhu">关注公众号联系“在线客服”</p>
    <div class="work-time">
      <p>服务时间：周一至周日 08:00-22:30</p>
      <p>我们会尽快回复您的问题</p>
    </div>
  </div>
</template>

<script>
  import QHeader from '@/components/header';
  export default {
    data() {
      return {
        title:'联系客服'
      };
    },
    created(){
    },
    methods: {
     
    },
    components: {
      QHeader
    }
  };
</script>

<style lang="scss" scoped>
.contant {
  background: #fff;
  height: 100%;
  .erweima {
    width:6.0rem;
    height:6.0rem;
    padding: 1.33rem 2.0rem 0;
    img {
      display: block;
      width: 100%;
    }
  }
  .gaunzhu {
    font-size: 14px;
    text-align: center;
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

