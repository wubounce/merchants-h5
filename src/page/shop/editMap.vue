<template>
	<div class="home-wrap">
    <div id="container" class="mymap"></div>
    <div class="home-search">
			<i class=" iconfont icon-IconSearch"></i>
			<p class="search-shop">
        <input type="text" v-model.trim="special" v-on:input="inputFunc" id="keyword" name="keyword" style="width:90%" placeholder="查找小区/大厦/学校等" onfocus='this.value=""'>
        <span class="eyes iconfont icon-guanbi" v-if="isuser" @click="closeInput"></span>
      </p>
		</div>
	</div>
</template>
<script>

export default {
  data() {
    return {
      shopId:'',
      special:'',
      isuser:false,
      mapCity:''
    };
  },
  methods: {
    getLatLng(x,shopId,y,z,p) {
      this.$router.push({
        name:x,
        query: {
          shopId: shopId,
          lat:y,
          lng:z,
          special:p
        }
      });
    },
    inputFunc(){
      this.isuser = true;
      if (!this.special) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
    closeInput() {
      this.special = '';
      this.isuser = false;
    }
  },
  created() {
    this.shopId = this.$route.query.shopId;
    this.mapCity = this.$route.query.mapCity;
    if(this.mapCity) {
      this.mapCity = this.mapCity.slice(0,this.mapCity.length-1);
      console.log(this.mapCity);
    }
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
    AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch','AMap.Geocoder'],function(){
      var autoOptions = {
        city: _this.mapCity,
        input: "keyword",    //使用联想输入的input的id
        citylimit:true
      };
      var autocomplete= new AMap.Autocomplete(autoOptions);

      AMap.event.addListener(autocomplete, "select", function(e){
        console.log(e);
        _this.getLatLng("editShop",_this.shopId,e.poi.location.lat,e.poi.location.lng,e.poi.name);
      });
    });
  }
};
</script>
<style type="text/css" lang="scss" scoped>
@import '../../assets/scss/shop/map';
</style>
