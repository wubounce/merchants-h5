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
        <span><mt-switch class="check-switch" v-model="isReserve" @change="editTime(isReserve)"></mt-switch></span>
      </p>
      <p class="reserveTime">
        <span>预约时长(分钟)</span>
        <span>
          <input v-model="orderLimitMinutes" :disabled="noEdit" :placeholder="placeholdercontent" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" maxlength='1'>
        </span>
      </p>
      <li class="business" @click="chooseTime">营业时间<span>{{addBusinessTime}}</span></li>
      <p class="picture">
        <span>店铺照片</span>
        <span>
          <UploadImg :id="imgId.a" :defaultPicture="imgId.defaultPicture" :isStatus="imgId.isStatus" @onImgFiles="UpdatedImgFiles"></UploadImg>
        </span>
      </p>
    </div>
    <p class="blank"></p>
    <button class="submit" @click="submit">确定</button>

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
      <div v-show="deviceDetail"  class="machine-hiden">
        <p class="toolBar"><span @click="cancel">取消</span><span>设备类型</span><span @click="confirmNews">确定</span></p>
        <mt-checklist align="right" :options="options" v-model="machine"></mt-checklist>
      </div>
    <!-- 设备类型自带背景 -->
    <div :class="{'machine-background':isbgc}" >
      
    </div>

    <!-- 营业时间 -->
    <mt-popup v-model="timeVisible" position="bottom" class="mint-popup">
       <mt-picker class="picker"  :slots="slotsTime" @change="changeTime" :showToolbar="true"><p class="toolBar"><span @click="cancel">取消</span><span @click="chooseDay" id="allDay">全天</span><span @click="confirmNews">确定</span></p></mt-picker>
    </mt-popup>

  </section>
</template>

<script>
import { MessageBox } from 'mint-ui';
import qs from "qs";
import UploadImg from "@/components/UploadImg/UploadImg";
import { addOrEditShopFun } from '@/service/shop';
import { areaListFun } from '@/service/shop';
import { listParentTypeFun } from '@/service/shop';
import { uploadFileFun } from '@/service/shop';
import { manageListFun } from '@/service/shop';
export default {
  data() {
    return {
      index:'',
      isbgc:false,
      deviceDetail:false,
      shopName:'',
      arrName:[],
      address:'',
      machineName:'',
      machineTypeIds:'',
      machineArray: [],
      machineTypeIdsArray:'',
      orderLimitMinutes:'',
      addBusinessTime:'',
      noEdit:true,
      placeholdercontent:'开启预约功能后可填',
      title:'新增店铺',
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
          value: ""
        }
      ],
      shopType: "",
      shopTypeString:'',
      popupVisible:false,
      placeVisible:false,
      mapVisible:false,
      slots: [
        {
          flex: 1,
          values: ['学校', '公寓', '流动人口社区', '酒店', '医院', '养老院','工厂','浴场','其他'],
          className: 'shop-type',
          textAlign: 'center',
          position:'bottom',
          name:'店铺类型',
          defaultIndex:2
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
        a: "a",
        defaultPicture:'../../../static/image/shop/add.png',
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
      if(e.target.value.length>3 && e.target.value.length<41) {
        this.shopName = e.target.value;
      }
      else {
        e.target.value = '';
        MessageBox.alert("请输入4到40字符的店铺名称");
      }
      //校验重名
      for(let i=0; i<this.arrName.length; i++) {
        if(e.target.value == this.arrName[i]) {
          e.target.value = '';
          MessageBox.alert("该店铺名称已存在，请换一个店铺名称输入哦");
        }
      }
    },
    //设置预约相关
    editTime(i) {
      if(i) {
        this.noEdit =false;
        this.placeholdercontent = "请填写预约有效时长";
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
      console.log('index:',this.index);
      switch (value) {
        case 0:
          this.popupVisible = true;
          this.isClass = true;
          break;
        case 1:
          this.placeVisible = true;
          this.getArea();
          break;
        case 2:{
          this.goMap("mapSearch",this.cityName,this.shopName,this.shopType,
                      this.list[1].value,this.provinceId, this.cityId, this.districtId,this.address,this.machineName,this.machineTypeIdsArray,
                      this.isReserve,this.orderLimitMinutes,this.addBusinessTime,
                      this.imageId);
          this.mapVisible = true;
          break;
        }
      }
    },
   //跳转传值
    goMap(x,y,name,type,place,provinceId,cityId,districtId,address,machineName,machinetype,isReserve,LimitMinutes,worktime,img) {
      this.$router.push({
        name:x,
        query: {
          city:this.cityName,
          name:name,
          type:type,
          place:place,
          provinceId: provinceId,
          cityId: cityId,
          districtId: districtId,
          address:address,
          machineName:machineName,
          machinetype:machinetype,
          isReserve:isReserve,
          LimitMinutes:LimitMinutes,
          worktime:worktime,
          img:img
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
        //设备管理修改
        case 3: {
          this.deviceDetail = false;
          this.isbgc = false;
          if(this.machine.join(' , ').length > 20 ) {
            this.machineName = this.machine.join(' , ').slice(0,20) + '...';
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
          console.log(this.machineTypeIdsArray);
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
          this.isbgc = false;
          this.deviceDetail = false;
          break;
        case 4:
          this.timeVisible = false;
          break;
      }
    },
    async  onAddressChange(picker, values) {
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
      let obj = {
        onlyMine: false
      };
      let res = await listParentTypeFun(qs.stringify(obj));
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
        console.log(msg.substring(0,22));
        msg = msg.replace("data:image/png;base64,","");
      }
      else if(msg.substring(0,23)=="data:image/jpeg;base64,") {
        console.log(msg.substring(0,23));
        msg = msg.replace("data:image/jpeg;base64,","");
      }
      let obj = { files:msg };
      let res = await uploadFileFun(qs.stringify(obj));
      if(res.code ===0 ) {
        this.imageId = res.data[0].url;
        console.log(this.imageId);
      }
      else {
        this.$toast(res.msg);
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
    async submit() {
      //console.log(this.cityName);
      let changeisReserve = (this.isReserve==true)? 0 :1;
      let _this = this;
      //判断信息是否完整
      
      let obj = {
        shopId: '  ',
        shopName: this.shopName,
        shopType: this.shopType,
        provinceId: this.provinceId,
        cityId: this.cityId,
        districtId: this.districtId,
        address: this.address,
        lat:this.$route.query.lat,
        lng:this.$route.query.lng,
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
          message: '添加成功',
          iconClass: 'mint-toast-icon mintui mintui-success'
        });
        setTimeout(() => {
          instance.close();
        }, 1000);
        this.$router.push({
          name:'shopList'
        });
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
    async getShoplist() {
      let res = await manageListFun();
      if(res.code === 0 ) {
        this.arrName = res.data.map((i) => {
          return i.shopName;
        });
      }
    },
    //从mapSearch里取数据
    getFromValue(data) {
      this.list[2].value = this.$route.query.special;
      this.shopName = (this.$route.query.name == '') ? '' : this.$route.query.name;
      switch(this.$route.query.type) {
        case 1:
          this.list[0].value = '学校';
          break;
        case 2:
          this.list[0].value = '公寓';
          break;
        case 3:
          this.list[0].value = '流动人口社区';
          break;
        case 4:
          this.list[0].value = '酒店';
          break;
          case 5:
          this.list[0].value = '医院';
          break;
        case 6:
          this.list[0].value = '养老院';
          break;
          case 7:
          this.list[0].value = '工厂';
          break;
        case 8:
          this.list[0].value = '浴场';
          break;
        case 9:
          this.list[0].value = '其他';
          break;
        default:
          this.list[0].value = '';
          break;
      }
      this.list[1].value = (this.$route.query.place == '') ? '' : this.$route.query.place;
      this.provinceId = (this.$route.query.provinceId == '') ? '' : this.$route.query.provinceId;
      this.cityId = (this.$route.query.cityId == '') ? '' : this.$route.query.cityId;
      this.districtId = (this.$route.query.districtId == '') ? '' : this.$route.query.districtId;

      this.address = (this.$route.query.address == '') ? '' : this.$route.query.address;
      this.machineName = (this.$route.query.machineName == '') ? '' : this.$route.query.machineName;
      this.isReserve = (this.$route.query.isReserve == true) ? true : false;
      this.orderLimitMinutes = (this.$route.query.LimitMinutes == '') ? '' : this.$route.query.LimitMinutes;
      this.addBusinessTime = (this.$route.query.worktime == '') ? '' : this.$route.query.worktime;
      if(this.$route.query.img != "" && this.$route.query.img != undefined) {
        this.imgId.defaultPicture = this.$route.query.img;
      }
      else {
        this.imgId.defaultPicture = '../../../static/image/shop/add.png';
      }
      
    }
  },
  created() {
    this.getShoplist();
    this.getFromValue();
  },
  components:{
    UploadImg
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
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      padding: 0.3rem;
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
        font-size: 15px;
        color: #999999;
      }
      &:nth-child(2) {
        font-size: 16px;
        margin: 0 2.7rem;
        color: #666666;
      }
      &:nth-child(3) {
        font-size: 15px;
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
