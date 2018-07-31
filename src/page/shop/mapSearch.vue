<template>
  <section v-title="title">
    <div id="tip">
      <input type="text" id="keyword" name="keyword" value="查找小区/大厦/学校等" onfocus='this.value=""'/>
    </div>
    <div id="mapContainer"></div>
  </section>
</template>
<script>
/*eslint-disable*/
export default {
  data() {
    return {
      title: '新增店铺'
    };
  },
  methods: {
    loadMap() {
      var map = new AMap.Map("mapContainer", {
        resizeEnable: true,
        zoom: 13,//地图显示的缩放级别
        keyboardEnable: false
      });

      map.plugin('AMap.Geolocation',function() {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
      });

      AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
      var autoOptions = {
        input: "keyword"//使用联想输入的input的id
      };
      autocomplete= new AMap.Autocomplete(autoOptions);
      var placeSearch = new AMap.PlaceSearch({
          city:'北京',
          map:map
      })
      
      
      AMap.event.addListener(autocomplete, "select", function(e){
          //TODO 针对选中的poi实现自己的功能
          console.log(123);
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name)
        });
      });
    }
  },
  mounted() {
    this.loadMap();
  },
  components:{
    
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
      line-height: 1rem;
    } 
    ::-webkit-input-placeholder {
      font-size: 16px;
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
  #mapContainer {
    width: 100%;
    height: 6rem;
  }
}
</style>

