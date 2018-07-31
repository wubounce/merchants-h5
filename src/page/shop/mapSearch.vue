<template>
	<div class="home-wrap" v-title="title">
    <div id="container" class="mymap"></div>
    <div class="home-search">
			<i class=" iconfont icon-IconSearch"></i>
			<p class="search-shop"><input type="text" v-model="place" id="keyword" name="keyword" placeholder="查找小区/大厦/学校等" onfocus='this.value=""'></p>
		</div>
	</div>
</template>
<script>

export default {
  data() {
    return {
      title: '新增店铺',
      place:''
    };
  },
  mounted() {
    let _this = this;
    var map = new AMap.Map("container", {
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
        city: "北京", //城市，默认全国
        input: "keyword"//使用联想输入的input的id
      };
      var autocomplete= new AMap.Autocomplete(autoOptions);
      var placeSearch = new AMap.PlaceSearch({
            city:'北京',
            map:map
      });
      AMap.event.addListener(autocomplete, "select", function(e){
          //TODO 针对选中的poi实现自己的功能
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name);
          //正向地理编码
          // var geocoder = new AMap.Geocoder({
          //   city: "010", //城市，默认：“全国”
          //   radius: 1000 //范围，默认：500
          // });
          //地理编码,返回地理编码结果
          // geocoder.getLocation(e.poi.name, function(status, result) {
          //     if (status === 'complete' && result.info === 'OK') {
          //         geocoder_CallBack(result);
          //     }
          // });

          //往新增店铺页面传值
          _this.$router.push({
            name:'addShop',
            query:{
              place: e.poi.name
            }
          });
      });
    });
  }
};
</script>
<style type="text/css" lang="scss" scoped>
.home-wrap {
    .mymap {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
    }
    .home-search {
      position: fixed;
      left: 0.35rem;
      top: 0.4rem;
      z-index: 999;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      width: 9rem;
      height: 1rem;
      line-height: 1rem;
      padding-left: .3rem;
      border-radius: 0.2rem;
      background: white;
      -webkit-box-shadow: 0 0.04rem 0.1rem 0 rgba(186, 192, 210, 0.3);
      box-shadow: 0 0.04rem 0.1rem 0 rgba(186, 192, 210, 0.3);
      i {
          font-size: 16px;
          color: #8A8FAB;
      }
      .search-shop {
          flex: 1;
          padding-right: 0;
          padding-left: 10px;
          color: #BAC0D2;
          border-radius: .1rem;
          font-size: 16px;
      }
    }
  }
</style>
