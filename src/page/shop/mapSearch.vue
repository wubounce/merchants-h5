<template>
  <section>
    <q-header :title="title"></q-header>
    <div id="tip">
      <input type="text" id="keyword" name="keyword" placeholder="查找小区/大厦/学校等" onfocus='this.value=""'/>
    </div>
    <div class="map">
       <el-amap vid="amapDemo"></el-amap>
    </div>
  </section>
</template>
<script>
/*eslint-disable*/
import QHeader from '@/components/header';
import VueAMap from 'vue-amap';
export default {
  data() {
    return {
      title: '新增店铺'
    };
  },
  methods: {
    loadmap() {
      var windowsArr = [];
      var marker = [];
      var map = new AMap.Map("amapDemo", {
        resizeEnable: true,
        center: [116.397428, 39.90923],//地图中心点
        zoom: 13,//地图显示的缩放级别
        keyboardEnable: false,
      });
    }
  },
  mounted() {
    this.loadmap();
    console.log(1234);
  },
  components:{
    QHeader
  }
};
/*eslint-enable*/
</script>
<style lang="scss" scoped>
section {
  #tip {
    width: 100%;
    text-align: center;
    input[type="text"] 
    {
      width: 93%;
      margin-top: 0.3rem;
      font-size: 0.43rem;
      line-height: 0.7rem;
    } 
    ::-webkit-input-placeholder {
      font-size: 0.35rem;
    }
    :-moz-placeholder {
      /* Firefox 18- */
      font-size: 0.35rem;
    }
    ::-moz-placeholder {
      /* Firefox 19+ */
      font-size: 0.35rem;
    }
    :-ms-input-placeholder {
      font-size: 0.35rem;
    }
  }
  .map {
    width: 90%;
    height: 5rem;
    margin: 0.3rem auto;
  }
}
</style>

