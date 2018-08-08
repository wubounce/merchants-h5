<template>
  <section class="personal" v-title="title">
    <ul class="personal-list">
      <p class="shopname-p"><span>店铺名称</span><span><input @change="blur" type="text" class='addressInput' v-model="shopName" maxlength="40" placeholder="请填写店铺名称"></span></p>
      <li v-for="(item,index) in list" :key="index" class="personal-item" @click="toDetail(index)">
        {{item.title}}
        <span>{{item.value == ''|| item.value==null? '' : item.value}}</span>
      </li>
      <p class="shopname-p"><span>详细地址</span><span><input type="text" class='addressInput' v-model="address" maxlength="12" placeholder="请填写详细地址"></span></p>
    </ul>
    <div class="second">
      <li class="device business" @click="addDevice">设备类型<span>{{machineName}}</span></li>
      <p class="isReserve">
        <span>预约功能</span>
        <span>
          <mt-switch @change="editTime(isReserve)" class="check-switch" v-model="isReserve">
          </mt-switch>
        </span>
      </p>
      <p class="reserveTime">
        <span>预约时长(分钟)</span>
        <span>
          <input v-model="orderLimitMinutes" :disabled="noEdit" :placeholder="placeholdercontent" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" maxlength='1'>
        </span>
      </p>
      <!-- <li class="business" @click="chooseTime">营业时间<span>{{addBusinessTime}}</span></li> -->
    </div>
    <p class="blank"></p>
    <button class="submit" @click="submit">提交</button>

    <!-- 店铺类型 -->
    <mt-popup v-model="popupVisible" position="bottom" class="mint-popup">
      <div class="prop-bd">
        <div class="page-picker-wrapper">
          <mt-picker class="picker" :slots="slots" @change="valuesChange" :showToolbar="true" ><p class="toolBar"><span @click="cancel">取消</span><span>店铺类型</span><span @click="confirmNews">确定</span></p></mt-picker>
        </div>
      </div>
    </mt-popup>
    
    <!-- 所在地区 -->
    <mt-popup v-model="placeVisible" position="bottom" class="mint-popup">
      <div class="prop-bd">
        <div class="page-picker-wrapper">
          <mt-picker :slots="addressSlots" @change="onAddressChange" :showToolbar="true"><p class="toolBar"><span @click="cancel">取消</span><span>所在地区</span><span @click="confirmNews">确定</span></p></mt-picker>
        </div>
      </div>
    </mt-popup>
    
    <!-- 设备类型 -->
    <div v-show="deviceDetail" class="machine-hiden">
      <p class="toolBar"><span @click="cancel">取消</span><span>设备类型</span><span @click="confirmNews">确定</span></p>
      <mt-checklist align="right" :options="options" v-model="machine"></mt-checklist>
    </div>
    <!-- 设备类型自带背景 -->
    <div :class="{'machine-background':isbgc}" >
      
    </div>

    <!-- 营业时间 -->
    <!-- <mt-popup v-model="timeVisible" position="bottom" class="mint-popup">
       <mt-picker class="picker"  :slots="slotsTime" @change="changeTime" :showToolbar="true"><p class="toolBar"><span @click="cancel">取消</span><span @click="chooseDay" id="allDay">全天</span><span @click="confirmNews">确定</span></p></mt-picker>
    </mt-popup> -->

  </section>
</template>

<script>
import qs from "qs";
import UploadImg from "@/components/UploadImg/UploadImg";
import { shopDetailFun } from '@/service/shop';
import { addOrEditShopFun } from '@/service/shop';
import { areaListFun } from '@/service/shop';
import { listParentTypeFun } from '@/service/shop';
import { uploadFileFun } from '@/service/shop';
import { manageListFun } from '@/service/shop';
import { MessageBox } from 'mint-ui';
export default {
  data() {
    return {
      index:'',
      shopId:'',
      isbgc:false,
      deviceDetail:false,
      shopName:'',
      oldName:'',
      noEdit: false,
      placeholdercontent:'开启预约功能后可填',
      address:'',
      machineName:'',
      machineTypeIds:'',
      machineArray: [],
      machineTypeIdsArray:'',
      orderLimitMinutes:'',
      addBusinessTime:'',
      title:'编辑店铺',
      arrName:[],
      list: [
        {
          title: "店铺类型",
          value: ""
        },
        {
          title: "所在地区",
          value: ""
        },
        {
          title: "小区/大厦/学校",
          value: this.$route.query.special
        }
      ],
      shopType: "",
      shopTypeString:'',
      popupVisible:false,
      placeVisible:false,
      mapVisible:false,
      lng:'',
      lat:'',
      slots: [
        {
          flex: 1,
          values: ['学校', '公寓', '流动人口社区', '酒店', '医院', '养老院','工厂','浴场','其他'],
          className: 'shop-type',
          textAlign: 'center',
          position:'bottom',
          name:'店铺类型'
        }
      ],
      addressSlots:[
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot2"
        },
        {
          flex: 1,
          values: [],
          className: "slot3",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot4"
        },
        {
          flex: 1,
          values: [],
          className: "slot5",
          textAlign: "center"
        }
      ],
      provinceArray:[],
      cityArray:[],
      districtArray:[],
      provinceId:'',
      cityId:'',
      districtId:'',
      
      provinceName:'',
      cityName:'',
      districtName:'',

      areaName:'',
      imgId: {
        a: "b",
        defaultPicture:'',
        isStatus:true
      },
      url:'',
      machine: [],
      arrLabel:[],
      options: [
        {
          label: '洗衣机',
          value: '洗衣机'
        }
      ],
      shopTime: {
        startTime: "",
        endTime: ""
      },
      slotsTime: [
        {
          flex: 1,
          values: ['00 时','01 时', '02 时', '03 时', '04 时', '05 时', '06 时','07 时','08 时', '09 时', '10 时', '11 时', '12 时', '13 时','14 时','15 时','16 时','17 时','18 时','19 时','20 时','21 时','22 时','23 时'],
          className: 'slot1',
          textAlign: 'right',
          defaultIndex:4
        },
        {
          divider: true,
          content: ':',
          className: 'slot2'
        },
        {
          flex: 1,
          values: ['00 分','01 分', '02 分', '03 分', '04 分', '05 分', '06 分','07 分','08 分', '09 分', '10 分', '11 分', '12 分', '13 分','14 分','15 分','16 分','17 分','18 分','19 分','20 分','21 分','22 分','23 分','24 分','25 分','26 分','27 分','28 分','29 分',
          '30 分','31 分', '32 分', '33 分', '34 分', '35 分', '36 分','37 分','38 分', '39 分', '40 分', '41 分', '42 分', '43 分','44 分','45 分','46 分','47 分','48 分','49 分','50 分','51 分','52 分','53 分','54 分','55 分','56 分','57 分','58 分','59 分'],
          className: 'slot3',
          textAlign: 'left',
          defaultIndex:30
        },
        {
          divider: true,
          content: '—',
          className: 'slot2'
        },
        {
          flex: 1,
          values: ['00 时','01 时', '02 时', '03 时', '04 时', '05 时', '06 时','07 时','08 时', '09 时', '10 时', '11 时', '12 时', '13 时','14 时','15 时','16 时','17 时','18 时','19 时','20 时','21 时','22 时','23 时'],
          className: 'slot1',
          textAlign: 'right',
          defaultIndex:20
        },
        {
          divider: true,
          content: ':',
          className: 'slot2'
        },
        {
          flex: 1,
          values: ['00 分','01 分', '02 分', '03 分', '04 分', '05 分', '06 分','07 分','08 分', '09 分', '10 分', '11 分', '12 分', '13 分','14 分','15 分','16 分','17 分','18 分','19 分','20 分','21 分','22 分','23 分','24 分','25 分','26 分','27 分','28 分','29 分',
          '30 分','31 分', '32 分', '33 分', '34 分', '35 分', '36 分','37 分','38 分', '39 分', '40 分', '41 分', '42 分', '43 分','44 分','45 分','46 分','47 分','48 分','49 分','50 分','51 分','52 分','53 分','54 分','55 分','56 分','57 分','58 分','59 分'],
          className: 'slot3',
          textAlign: 'left',
          defaultIndex:30
        }
      ],
      timeVisible: false,
      isTime:true,
      isReserve:true
    };
  },
  methods:{
     blur(e) {
      //校验字符长度
      if(e.target.value.length>1 && e.target.value.length<21) {
        this.shopName = e.target.value;
      }
      else {
        this.shopName = this.oldName;
        MessageBox.alert("请输入2到20字符的店铺名称");
      }

      //校验名字的特殊字符'-'和'_'
      let arr = e.target.value.split('');
      for (let i=0; i<e.target.value.length; i++) {
        if(arr[i] == '-' || arr[i] == '_' || arr[i] == '——') {
          if(arr[i+1] == '-' || arr[i+1] == '_' || arr[i] == '——') {
            MessageBox.alert('店铺名称不符合规范，请重新输入');
          }
        }
      }
      //校验重名
      for(let i=0; i<this.arrName.length; i++) {
        if(e.target.value == this.arrName[i]) {
          this.shopName = this.oldName;
          MessageBox.alert("该店铺名称已存在，请换一个店铺名称输入哦");
        }
      }
    },
    //设置预约相关
    editTime(i) {
      if(i) {
        this.noEdit =false;
        this.placeholdercontent = "请填个位数的时长";
      }
      else {
        this.noEdit =true;
        this.orderLimitMinutes = "";
        this.placeholdercontent = "开启预约功能后可填";
      }
    },
    valuesChange(picker, values) {
      this.shopTypeString = values[0];
      switch(values[0]) {
        case '学校':
          this.shopType = 1;
          break;
        case '公寓':
          this.shopType = 2;
          break;
        case '流动人口社区':
          this.shopType = 3;
          break;
        case '酒店':
          this.shopType = 4;
          break;
          case '医院':
          this.shopType = 5;
          break;
        case '养老院':
          this.shopType = 6;
          break;
          case '工厂':
          this.shopType = 7;
          break;
        case '浴场':
          this.shopType = 8;
          break;
        case '其他':
          this.shopType = 9;
          break;
      }
    },
    toDetail(value) {
      this.index = value;
      switch (value) {
        case 0:
          this.popupVisible = true;
          this.isClass = true;
          break;
        case 1:
          this.placeVisible = true;
          this.getArea();
          break;
        case 2:
          this.goMap("editMap",this.shopId);
          this.mapVisible = true;
          break;
      }
    },
    
    //跳转传值
    goMap(x,shopId) {
      this.$router.push({
        name:x,
        query: {
          shopId: shopId
        }
      });
    },
    //确认按钮
    confirmNews() {
      this.isClass = false;
      switch(this.index) {
        case 0:
          this.popupVisible = false;
          this.list[0].value = this.shopTypeString;
          break;
        case 1:
          this.placeVisible = false;
          if(this.provinceName == this.cityName.slice(0,2)) {
            
            this.list[1].value = this.cityName + this.districtName;
          }
          else {
            this.list[1].value = this.provinceName + this.cityName + this.districtName;
          }
          break;
        //经纬度
        case 2:
          break;
        //设备管理
        case 3: {
          this.deviceDetail = false;
          this.isbgc = false;
          if(this.machine.join(' , ').length > 15 ) {
            this.machineName = this.machine.join(' , ').slice(0,15) + '...';
          }
          else {
            this.machineName = this.machine.join(' , ');   
          }
          let arr = [];
          for(let i=0;i<this.machine.length;i++) {
            for(let j=0;j<this.machineArray.length;j++) {
              if(this.machine[i] == this.machineArray[j].name) {
                arr.push(this.machineArray[j].id);
              }
            }
          }
          this.machineTypeIdsArray = arr.join(',');
          break;
        }
        case 4:
          this.timeVisible = false;
          if(parseInt(this.shopTime.startTime.slice(0,2)) < parseInt(this.shopTime.endTime.slice(0,2))) {
            this.addBusinessTime = this.shopTime.startTime + '-' + this.shopTime.endTime;
          }
          else {
            if(parseInt(this.shopTime.startTime.slice(0,2)) == parseInt(this.shopTime.endTime.slice(0,2))) {
              if(parseInt(this.shopTime.startTime.slice(3,5)) < parseInt(this.shopTime.endTime.slice(3,5))) {
                this.addBusinessTime = this.shopTime.startTime + '-' + this.shopTime.endTime;
              }
              else {
                this.$toast({
                  message: '营业的开始时间不得小于结束时间',
                  position: "middle",
                  duration: 3000
                });
              }
            }
            else {
              this.$toast({
                message: '营业的开始时间不得小于结束时间',
                position: "middle",
                duration: 3000
              });
            }
          }
          break;
      }
    },
    cancel() {
      this.isClass = false;
      switch(this.index) {
        case 0:
          this.popupVisible = false;
          break;
        case 1:
          this.placeVisible = false;
          break;
        case 2:
          break;
        case 3:
          this.deviceDetail = false;
          this.isbgc = false;
          break;
        case 4:
          this.timeVisible = false;
          break;
      }
    },
    async onAddressChange(picker, values) {
      //根据省，找出与之对应的市
      for(let i=0;i<this.provinceArray.length;i++) {
        if(values[0] == this.provinceArray[i].areaName) {
          let city = { parentId: this.provinceArray[i].areaId };
          this.provinceId = this.provinceArray[i].areaId;
          let res = await areaListFun(qs.stringify(city));
          if(res.code===0) {
            let chooseCity = res.data.map((c)=> {
              return c.areaName;
            });

            this.cityArray = res.data;
            picker.setSlotValues(1, chooseCity); //设置市
          }
        }
      }

      //根据市，找出与之对应的区
      for(let j=0;j<this.cityArray.length;j++) {
        if(values[1] == this.cityArray[j].areaName) {
          let district = { parentId: this.cityArray[j].areaId };
          this.cityId = this.cityArray[j].areaId;
          let resDistrict = await areaListFun(qs.stringify(district));
          if(resDistrict.code===0) {
            let chooseDistrict = resDistrict.data.map((d)=> {
              return d.areaName;
            });

            this.districtArray = resDistrict.data;
            picker.setSlotValues(2, chooseDistrict); //设置市
          }
        }
      }

      for(let j=0;j<this.districtArray.length;j++) {
        if(values[2] == this.districtArray[j].areaName) {
          this.districtId = this.districtArray[j].areaId;
        }
      }

      this.provinceName = values[0];
      this.cityName = values[1];
      this.districtName = values[2];

    },
    async addDevice() {
      this.index = 3;
      this.isClass = true;
      this.isbgc = true;
      this.deviceDetail = true;
      let res = await listParentTypeFun();
      if(res.code ===0 ) {
        this.machineArray = res.data;
        let arr = [];
        arr = JSON.parse(JSON.stringify(res.data).replace(/name/g,"label"));
        this.options = JSON.parse(JSON.stringify(arr).replace(/id/g,"value"));
        for(let i=0;i<this.options.length;i++) {
          this.options[i]['value'] = this.options[i]['label'];
        }
      }
    },
    async UpdatedImgFiles(msg) {
      //判断图片类型
      if(msg.substring(0,22)=="data:image/png;base64,") {
        msg = msg.replace("data:image/png;base64,","");
      }
      else if(msg.substring(0,23)=="data:image/jpeg;base64,") {
        msg = msg.replace("data:image/jpeg;base64,","");
      }
      let obj = { files:msg };
      let res = await uploadFileFun(qs.stringify(obj));
      if(res.code ===0 ) {
        this.imageId = res.data[0].url;
      }
      else {
        MessageBox.alert(res.msg);
      }
      this.imgId.defaultPicture = this.imageId;
    },
    changeTime(picker, values) {
      this.shopTime.startTime = values[0].slice(0,2) + ':' +values[1].slice(0,2);
      this.shopTime.endTime = values[2].slice(0,2) + ':' +values[3].slice(0,2);
    },
    chooseDay() {
      this.slotsTime[0].defaultIndex = 0;
      this.slotsTime[2].defaultIndex = 0;
      this.slotsTime[4].defaultIndex = 23;
      this.slotsTime[6].defaultIndex = 59;
    },
    chooseTime() {
      this.index = 4;
      this.timeVisible = true;
      this.isClass = true;
    },
    //提交修改信息
    async submit() {
      let changeisReserve = (this.isReserve==true)? 0 :1;
      let obj = {
        shopId: this.$route.query.shopId,
        shopName: this.shopName,
        shopType: this.shopType,
        provinceId: this.provinceId,
        cityId: this.cityId,
        districtId: this.districtId,
        address: this.address,
        lat:this.lat,
        lng:this.lng,
        machineTypeIds: this.machineTypeIdsArray,
        isReserve: changeisReserve,
        orderLimitMinutes: this.orderLimitMinutes,
        workTime: this.addBusinessTime,
        imageId: this.imageId
      };

      let res = await addOrEditShopFun(qs.stringify(obj));
      if(res.code===0) {
        //成功后的操作
        let instance = this.$toast({
          message: '编辑成功',
          iconClass: 'mint-toast-icon mintui mintui-success'
        });
        setTimeout(() => {
          instance.close();
        }, 1000);
        this.$router.push({
          name:'shopList'
        });
      }
      else {
        MessageBox.alert(res.msg);
      }
    },
    //省市区联动
    async getArea() {
      let obj = { parentId: 0 };
      let res = await areaListFun(qs.stringify(obj));
      this.provinceArray = res.data;
      if(res.code===0) {
        for(let i=0;i<res.data.length;i++) {
          this.addressSlots[0].values.push(res.data[i].areaName);
        }
      }
      else {
        MessageBox.alert(res.msg);
      }
    },
    async getShopDetail() {
      let obj = { shopId: this.$route.query.shopId };
      let res = await shopDetailFun(qs.stringify(obj));
      if(res.code===0) {
        this.shopId = res.data.shopId;
        this.shopName = res.data.shopName; //店铺名称
        this.oldName = res.data.shopName; //旧店铺名称
        this.list[0].value = res.data.shopType; //店铺类型
        //店铺地址
        if(res.data.province == res.data.city.slice(0,2)) {
          this.list[1].value = res.data.city + res.data.district;
        }
        else {
          this.list[1].value = res.data.province + res.data.city + res.data.district;
        }
        //经纬度
        this.lng = res.data.lng;
        this.lat = res.data.lat;
        //详细地址
        this.address = res.data.address;
        //设备类型        
        if(res.data.machineTypeNames.length > 15) {
          this.machineName = res.data.machineTypeNames.slice(0,10) + '...';
        }
        else {
          this.machineName = res.data.machineTypeNames;
        }       
        //预约功能
        this.isReserve = res.data.isReserve == 0 ? true : false;
        this.noEdit = res.data.isReserve == 0 ? false :true;
        //预约时长
        this.orderLimitMinutes = res.data.orderLimitMinutes;
        //营业时间
        this.addBusinessTime = res.data.workTime;      
        //逆地理坐标
        let lnglatXY = [this.lng, this.lat]; //已知点坐标
        let _this = this;
        AMap.plugin('AMap.Geocoder',function() {
          var geocoder = new AMap.Geocoder({
            extensions: "all"
          });
          geocoder.getAddress(lnglatXY, function(status, result) {
              if(status === 'complete' && result.info === 'OK') {
                  _this.geocoder_CallBack(result.regeocode.formattedAddress);
              }
              else {
                MessageBox.alert('定位有问题');
              }
          });        
        });

        this.geocoder_CallBack();
        
        //省
        let objPro = { parentId: 0 };
        let resPro = await areaListFun(qs.stringify(objPro));
        for(let x=0;x<resPro.data.length;x++) {
          if(res.data.province == resPro.data[x].areaName) {
            this.provinceId = resPro.data[x].areaId;  //获取初始化的省级单位
          }
        }
        //市
        let objCity = { parentId: this.provinceId };
        let resCity = await areaListFun(qs.stringify(objCity));
        for(let x=0;x<resCity.data.length;x++) {
          if(res.data.city == resCity.data[x].areaName) {
            this.cityId = resCity.data[x].areaId; //获取初始化的市级单位
          }
        }
        //区
        let objDis = { parentId: this.cityId };
        let resDis = await areaListFun(qs.stringify(objDis));
        for(let x=0;x<resDis.data.length;x++) {
          if(res.data.district == resDis.data[x].areaName) {
            this.districtId = resDis.data[x].areaId; //获取初始化的区级单位
          }
        }
        //设备类型
        let resMachine = await listParentTypeFun();
        if(resMachine.code ===0 ) {
          let arrmachine = res.data.machineTypeNames.split(',');
          let arr = [];
          for(let i=0;i<arrmachine.length;i++) {
            for(let j=0;j<resMachine.data.length;j++) {
              if(arrmachine[i] == resMachine.data[j].name) {
                arr.push(resMachine.data[j].id);
              }
            }
          }
          this.machineTypeIdsArray = arr.join(',');
        }
      }
    },
    async getShoplist() {
      let res = await manageListFun();
    },
    geocoder_CallBack(data) {
      this.list[2].value = data;
      if(this.list[1].value) {
        if(this.list[2].value) {
          if(this.list[2].value.slice(this.list[1].value.length).length >9 ) {
            this.list[2].value = this.list[2].value.slice(this.list[1].value.length).slice(0,10) + '...';
          }
          else {
            this.list[2].value = this.list[2].value.slice(this.list[1].value.length);
          }
        }
      }
     }
  },
  created() {
    this.getShopDetail();
    this.getShoplist();
  },
  mounted() {
  },
  watch: {
    $route(to,from) {
      if(from.name == 'editMap') {
        this.list[2].value = this.$route.query.special.length >9 ? this.$route.query.special.slice(0,10) +'...' : this.$route.query.special;
        this.lng = this.$route.query.lng;
        this.lat = this.$route.query.lat;
      }
      else if(from.name == 'shopDetail'){
        location.reload();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.personal {
  .showHide {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
    z-index:2008;
  }
  .personal-list {
    background-color: #fff;
    .shopname-p {
      font-size: 16px;
      border-bottom: 1px solid #F8F8F8;
      padding: 0.06rem;
      span {
        display: inline-block;
        &:first-child {
          margin-left: 0.3rem;
        }
        input {
          margin-left:0.5rem;
          height: 1rem;
        }
        ::-webkit-input-placeholder {
          color: #999999;
          font-size: 16px;
        }
        :-moz-placeholder {
          /* Firefox 18- */
          color: #999999;
          font-size: 16px;
        }
        ::-moz-placeholder {
          /* Firefox 19+ */
          color: #999999;
          font-size: 16px;
        }
        :-ms-input-placeholder {
          color: #999999;
          font-size: 16px;
        }
      }
      &:last-child {
        border-bottom: 1px solid #fff;
      }
    }
    .personal-item {
      font-size: 16px;
      padding: 0.3rem;
      border-bottom: 1px solid #F8F8F8;
      background: url("../../../static/image/shop/right.png") no-repeat right
        0.3rem center;
      background-size: 0.16rem 0.27rem;
      span {
        float: right;
        color: #7f7f7f;
        font-size: 16px;
        margin-right: 0.3rem;
      }
    }
  }
  .second {
    background-color: #fff;
    .device {
      margin-top: 0.3rem;
      display: flex;
      justify-content: space-between;
    }
    .business {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      padding: 0.3rem;
      background-color: #fff;
      border-bottom: 1px solid #F8F8F8;
      background: url("../../../static/image/shop/right.png") no-repeat right
        0.3rem center;
      background-size: 0.16rem 0.27rem;
      span {
        
        color: #7f7f7f;
        font-size: 16px;
        margin-right: 0.3rem;
      }
    }
    .isReserve {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      border-bottom: 1px solid #F8F8F8;
      padding: 0.1rem;
      span {
        &:first-child {
          padding-left:0.23rem;
          line-height:1rem;
        }
      }
    }
    .reserveTime {
      font-size: 16px;
      border-bottom: 1px solid #F8F8F8;
      padding: 0.06rem;
      span {
        display: inline-block;
        &:first-child {
          margin-left: 0.3rem;
        }
        input {
          margin-left:0.5rem;
          height: 1rem;
          background-color: #fff;
        }
        ::-webkit-input-placeholder {
          color: #999999;
          font-size: 16px;
        }
        :-moz-placeholder {
          /* Firefox 18- */
          color: #999999;
          font-size: 16px;
        }
        ::-moz-placeholder {
          /* Firefox 19+ */
          color: #999999;
          font-size: 16px;
        }
        :-ms-input-placeholder {
          color: #999999;
          font-size: 16px;
        }
      }
    }
    .picture {
      display: flex;
      margin-top: 0.18rem;
      justify-content: space-between;
      span {
        &:first-child {
          font-size: 16px;
          line-height: 2rem;
          padding-left: 0.3rem;
        }
        &:last-child {
          padding-right: 0.3rem;
        }
      }
    }
  }
  .submit {
    width: 100%;
    position: fixed;
    bottom: 0;
    border: none;
    padding: 0.45rem 0;
    background-color: #1890FF;
    color: #fff;
    font-size: 18px;
  }
  .blank {
    height:2rem;
  }
  .toolBar {
    display: flex;
    justify-content: center;
    padding-top: 0.2rem;
    #allDay {
      color: #fff;
      background-color: #1890FF;
      font-size: 0.45rem;
      padding: 0.05rem 0.2rem;
      padding-top: -1rem;
      border-radius: 5px;
    }
    span {
      &:nth-child(1) {
        font-size: 0.45rem;
        color: #999999;
      }
      &:nth-child(2) {
        font-size: 0.5rem;
        margin: 0 2.7rem;
        color: #666666;
      }
      &:nth-child(3) {
        font-size: 0.45rem;
        color: #1890FF;
      }
    }
  }
  .mint-popup {
    width: 100%;
    .prop-bd {
      padding: 0.3rem;
    }
  }
  .machine-background{
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2018;
  }
  .machine-hiden {
    position: absolute;
    top: 10rem;
    background-color: rgb(255, 255, 255);
    width: 100%;
    z-index: 2020;
  }
}
</style>
<style>
.mint-switch-input:checked + .mint-switch-core {
  border-color: #4DD865;
  background-color: #4DD865;
}
</style>
