<template>
	<div class="home-wrap" v-title="title">
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
      title: '编辑店铺',
      shopId:'',
      special:'',
      isuser:false
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
        input: "keyword"//使用联想输入的input的id
      };
      var autocomplete= new AMap.Autocomplete(autoOptions);
      var placeSearch = new AMap.PlaceSearch({
            map:map
      });

      AMap.event.addListener(autocomplete, "select", function(e){
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);

        var geocoder = new AMap.Geocoder({
          radius: 1000 //范围，默认：500
        });
        geocoder.getLocation(e.poi.name, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                _this.lat  = result.geocodes[0].location.lat;
                _this.lng  = result.geocodes[0].location.lng;
                _this.getLatLng("editShop",_this.shopId,_this.lat,_this.lng,e.poi.name);
            }
            else {
              console.log('获取经纬度错误');
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
          input {
            padding-top: 0.2rem;
            padding-bottom: 0.22rem;
          }
          ::-webkit-input-placeholder {
            color: #999999;
            font-size: 16px;
            padding-top: 0.1rem; 
          }
          :-moz-placeholder {
            /* Firefox 18- */
            color: #999999;
            font-size: 16px;
            padding-top: 0.1rem;
          }
          ::-moz-placeholder {
            /* Firefox 19+ */
            color: #999999;
            font-size: 16px;
            padding-top: 0.1rem;
          }
          :-ms-input-placeholder {
            color: #999999;
            font-size: 16px;
            padding-top: 0.1rem;
          }
          .eyes {
            color:#979797;
          }
      }
    }
  }
</style>
