<template>
  <section class="personal">
    <ul class="personal-list">
      <p class="shopname-p"><span>店铺名称</span><span><input  @change="blur" type="text" class='addressInput' v-model="shopName"  placeholder="请填写店铺名称"></span></p>
      <li v-for="(item,index) in list" :key="index" class="personal-item" @click="toDetail(index)">
        {{item.title}}
        <span>{{item.value == ''|| item.value==null? '' : item.value}}</span>
      </li>
      <p class="shopname-p"><span>详细地址</span><span><input  type="text" class='addressInput' v-model="address"  placeholder="请填写详细地址"></span></p>
    </ul>
    <div class="second">
      <p class="isReserve device">
        <span>预约功能</span>
        <span>
          <mt-switch @change="editTime(isReserve)" class="check-switch" v-model="isReserve">
          </mt-switch>
        </span>
      </p>
      <p class="reserveTime">
        <span>预约时长(分钟)</span>
        <span>
          <input  v-model="orderLimitMinutes" :disabled="noEdit" :placeholder="placeholdercontent"   type='text' maxlength="1">
        </span>
      </p>
      <li class="business" @click="chooseTime">营业时间<span>{{addBusinessTime}}</span></li>
    </div>
    <p class="blank"></p>
    <button  class="submit" @click="submit">提交</button>

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
          <mt-picker :slots="addressSlots"  @change="onAddressChange" :showToolbar="true"><p class="toolBar"><span @click="cancel">取消</span><span>所在地区</span><span @click="confirmNews">确定</span></p></mt-picker>
        </div>
      </div>
    </mt-popup>
    <!-- 营业时间 -->
    <mt-popup v-model="timeVisible" position="bottom" class="mint-popup">
       <mt-picker class="picker"  :slots="slotsTime"  @change="changeTime" :showToolbar="true"><p class="toolBar"><span @click="cancel">取消</span><span @click="chooseDay" id="allDay">全天</span><span @click="confirmNews">确定</span></p></mt-picker>
    </mt-popup>

  </section>
</template>

<script>
import { shopDetailFun , addOrEditShopFun , shopTypeListFun , areaListFun   , manageListFun } from '@/service/shop';
import { MessageBox } from 'mint-ui';
export default {
  data() {
    return {
      buttonHide:true,
      index:'',
      shopId:'',
      isbgc:false,
      shopName:'',
      shopTypeList: [],
      oldName:'',
      noEdit: false,
      placeholdercontent:'开启预约功能后可填',
      address:'',
      machineName:'',
      lastMachine: '',    // 修改bug
      machineTypeIds:'',
      machineArray: [],
      machineTypeIdsArray:'',
      orderLimitMinutes:'',
      addBusinessTime:'',
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
          values: [], //'学校', '公寓', '流动人口社区', '酒店', '医院', '养老院','工厂','浴场','其他'
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
          textAlign: 'right'
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
          textAlign: 'left'
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
          textAlign: 'right'
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
          textAlign: 'left'
        }
      ],
      timeVisible: false,
      isTime:true,
      isReserve:true,
      machine_typeNames:[],
      sort:[],
      proIndex:1,
      cityIndex:2,
      disIndex:3,
      mapCity:''
    };
  },
  methods:{
    disbaledBtn() {
      this.buttonHide = false;
    },
    blur(e) {
      //校验字符长度
      if(e.target.value.length>1 && e.target.value.length<21) {
        this.shopName = e.target.value;
      }
      else {
        this.shopName = this.oldName;
        this.$toast({
            message: '请输入2到20字符的店铺名称',
            position: 'top',
            duration: 3000
          });
      }

      //校验重名
      for(let i=0; i<this.arrName.length; i++) {
        if(e.target.value == this.arrName[i]) {
          this.shopName = this.oldName;
          this.$toast({
            message: '该店铺名称已存在，请您换一个店铺名称输入',
            position: 'top',
            duration: 3000
          });
        }
      }
    },
    //设置预约相关
    editTime(i) {
      if(i) {
        this.noEdit =false;
        this.placeholdercontent = "请填写1到9的数字";
      }
      else {
        this.noEdit =true;
        this.orderLimitMinutes = "";
        this.placeholdercontent = "开启预约功能后可填";
      }
    },
    valuesChange(picker, values) {
      this.shopTypeString = values[0];
      for(let i=0;i<this.shopTypeList.length;i++) {
        if(values[0] === this.shopTypeList[i].name) {
          this.shopType = this.shopTypeList[i].id;
        }
      }
    },
    async toDetail(value) {
      this.index = value;
      switch (value) {
        case 0:
          this.popupVisible = true;
          this.isClass = true;
          break;
        case 1:
          {
            this.placeVisible = true;
            this.getArea();
          }
          break;
        case 2:
          this.goMap("editMap",this.shopId,this.mapCity);
          this.mapVisible = true;
          break;
      }
    },
    
    //跳转传值
    goMap(x,shopId,mapCity) {
      this.$router.replace({
        name:x,
        query: {
          shopId: shopId,
          mapCity: mapCity
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
          for(let i=0;i<this.shopTypeList.length;i++) {
            if(this.shopTypeString === this.shopTypeList[i].name) {
              this.shopType = this.shopTypeList[i].id;
            }
          }
          break;
        case 1:
          this.placeVisible = false;
          this.mapCity = this.cityName;
          if(!this.districtName) {
            this.districtName = '';
            this.districtId = this.cityId;
          }
          if(this.provinceName == this.cityName.slice(0,2)) {
            
            this.list[1].value = this.cityName + this.districtName;
          }
          else {
            this.list[1].value = this.provinceName + this.cityName + this.districtName;
          }
          if(this.list[1].value) {
            this.list[1].value = this.list[1].value.length>10? this.list[1].value.slice(0,10)+'...' : this.list[1].value;
          }
          this.lat = '';
          this.lng = '';
          this.list[2].value = '';
          this.address = '';
          break;
        //经纬度
        case 2:
          break;
        //设备管理
        case 3: {
          this.deviceDetail = false;
          this.isbgc = false;
          this.sort = [];
          for(let i=0; i<this.options.length;i++) {
            for(let j=0; j<this.machine.length;j++) {
              if(this.options[i].value == this.machine[j]) {
                this.sort.push(this.options[i].value);
              }
            }
          }
          this.machine = this.sort;
          //console.log('确认：',this.machine);
          this.lastMachine = [].concat(this.machine); // 修改bug
          // console.log('确认lastMachine',this.lastMachine); // 修改bug
          if(this.machine.join(' , ').length > 10 ) {
            this.machineName = this.machine.join(' , ').slice(0,10) + '...';
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
        //营业时间
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
          this.machine = [].concat(this.lastMachine); 
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
          let res = await areaListFun(city);
          let chooseCity = res.map((c)=> {
            return c.areaName;
          });

          this.cityArray = res;
          picker.setSlotValues(1, chooseCity); //设置市
        }
      }

      //根据市，找出与之对应的区
      for(let j=0;j<this.cityArray.length;j++) {
        if(values[1] == this.cityArray[j].areaName) {
          let district = { parentId: this.cityArray[j].areaId };
          this.cityId = this.cityArray[j].areaId;
          let resDistrict = await areaListFun(district);
          let chooseDistrict = resDistrict.map((d)=> {
            return d.areaName;
          });

          this.districtArray = resDistrict;
          picker.setSlotValues(2, chooseDistrict); //设置市
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
    changeTime(picker, values) {
      this.shopTime.startTime = values[0].slice(0,2) + ':' +values[1].slice(0,2);
      this.shopTime.endTime = values[2].slice(0,2) + ':' +values[3].slice(0,2);
    },
    chooseDay() {
      // 点击全天直接获取全天并且退出弹框
      this.timeVisible = false;
      this.addBusinessTime = '00:00-23:59';
    },
    chooseTime() {
      this.index = 4;
      this.timeVisible = true;
      this.isClass = true;
      this.slotsTime[0].defaultIndex = parseInt(this.addBusinessTime.slice(0,2));
      this.slotsTime[2].defaultIndex = parseInt(this.addBusinessTime.slice(3,5));
      this.slotsTime[4].defaultIndex = parseInt(this.addBusinessTime.slice(6,8));
      this.slotsTime[6].defaultIndex = parseInt(this.addBusinessTime.slice(9,11));
    },
    //提交修改信息
    async submit() {
      // console.log(this.lng);
      if(this.shopName!=false && this.shopType!=false && this.provinceId != false && this.cityId !=false && this.provinceId != false && this.address != false && this.lat !=undefined &&this.lat != false && this.lng != false&& this.lng != undefined && this.organization!=false && this.addBusinessTime !=false ) {
        if(this.orderLimitMinutes) {
          //在判断
          let reg=/^[1-9]+\d*$/;
          if(parseInt( this.orderLimitMinutes) >0 && parseInt(this.orderLimitMinutes) <10 && reg.test(this.orderLimitMinutes) ) {
            //传值
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
              //machineTypeIds: this.machineTypeIdsArray,
              isReserve: changeisReserve,
              orderLimitMinutes: this.orderLimitMinutes,
              workTime: this.addBusinessTime,
              organization: this.organization
            };
            let res = await addOrEditShopFun(obj);
            
            //成功后的操作
            let instance = this.$toast({
              message: '编辑成功',
              iconClass: 'mint-toast-icon mintui mintui-success'
            });
            setTimeout(() => {
              instance.close();
              }, 1000);
              this.$router.go(-2);
            //上面是传值
          }
          else {
            //提示
            this.$toast({
              message:'请填写1到9的数字',
              position:'middle',
              duration:3000
            });
          }
        }
        else {
          //直接传值
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
            //machineTypeIds: this.machineTypeIdsArray,
            isReserve: changeisReserve,
            orderLimitMinutes: this.orderLimitMinutes,
            workTime: this.addBusinessTime,
            organization: this.organization
          };
          let res = await addOrEditShopFun(obj);
          
          //成功后的操作
          let instance = this.$toast({
            message: '编辑成功',
            iconClass: 'mint-toast-icon mintui mintui-success'
          });
          setTimeout(() => {
            instance.close();
            }, 1000);
            this.$route.query.issearch == true ? this.$router.go(-3) : this.$router.go(-2);
        }
        
      }else if(!this.list[0].value) {
        this.$toast({
            message: '请填写店铺类型',
            position: 'middle',
            duration: 3000
          });
      }else if(!this.provinceId || !this.cityId || !this.districtId) {
        this.$toast({
            message: '请选择所在地区',
            position: 'middle',
            duration: 3000
          });
      }else if(!this.lat || !this.lng || !this.organization) {
        this.$toast({
            message: '请选择小区/大厦/学校等具体地点',
            position: 'middle',
            duration: 3000
          });
      }else if(!this.address) {
        this.$toast({
            message: '请填写详细地址',
            position: 'middle',
            duration: 3000
          });
      }else if(this.isReserve == true && !this.orderLimitMinutes ) {
        this.$toast({
            message: '预约时长为空',
            position: 'middle',
            duration: 3000
          });
      }else if(!this.addBusinessTime) {
        this.$toast({
            message: '请选择营业时间',
            position: 'middle',
            duration: 3000
          });
      }
    },
    //省市区联动
    async getArea() {
      let obj = { parentId: 0 };
      let res = await areaListFun(obj);
      this.provinceArray = res;
      for(let i=0;i<res.length;i++) {
        this.addressSlots[0].values.push(res[i].areaName);
      }
    },
    async setShopTypeList() {
      let obj = {};
      let res = await shopTypeListFun(obj);
      this.shopTypeList = res;
      let arr = [];
      for(let i=0;i<this.shopTypeList.length;i++) {
        arr.push(this.shopTypeList[i].name);
      }
      this.slots[0].values = arr;
    },
    async getShopDetail() {
      let payload = { shopId: this.$route.query.shopId };
      let res = await shopDetailFun(payload);
      this.shopId = res.shopId;
      this.mapCity = res.cityName;  //初始的传到地图界面的城市的值
      this.shopName = res.shopName; //店铺名称
      this.oldName = res.shopName; //旧店铺名称
      this.list[0].value = res.shopTypeName;
      this.shopType = res.shopTypeId;
      //判断区是否存在
      if(res.cityName == res.districtName) {
        res.districtName = '';
      }
      //所在地区
      if(res.cityName) {
        if(res.provinceName == res.cityName.slice(0,2)) {
          this.list[1].value = res.cityName + res.districtName;
        }
        else {
          this.list[1].value = res.provinceName + res.cityName + res.districtName;
        }
      }
      if(this.list[1].value) {
        this.list[1].value = this.list[1].value.length>10? this.list[1].value.slice(0,10)+'...' : this.list[1].value;
      }
      //经纬度
      this.lng = res.lng;
      this.lat = res.lat;
      this.organization = res.organization;
      //详细地址
      this.address = res.address;
      //设备类型
      this.machine = res.machineTypeNames;
      if(this.machine) {
        this.machine = this.machine.split(','); 
        this.lastMachine = [].concat(this.machine); // 修改bug
        // console.log('初始值：',this.lastMachine); // 修改bug
      } 
      if(res.machineTypeNames) {
        if(res.machineTypeNames.length > 10) {
          this.machineName = res.machineTypeNames.slice(0,10) + '...';
        }
        else {
          this.machineName = res.machineTypeNames;
        }  
      }           
      //预约功能
      this.isReserve = res.isReserve == 0 ? true : false;
      if(this.isReserve) {
        this.placeholdercontent = '请填写1到9的数字';
      }
      else {
        this.placeholdercontent = '开启预约功能后可填';
      }
      this.noEdit = res.isReserve == 0 ? false :true;
      //预约时长
      this.orderLimitMinutes = res.orderLimitMinutes;
      //营业时间
      this.addBusinessTime = res.workTime;      
      if(res.organization) {
        if(res.organization.length>5) {
          this.list[2].value = res.organization.slice(0,5) + '...';
        }
        else {
          this.list[2].value = res.organization;
        }
      }

      //省、市、区
      this.provinceId = res.provinceId;
      this.cityId = res.cityId;
      this.districtId = res.districtId;
      this.provinceName = res.provinceName;
      this.cityName = res.cityName;
      this.districtName = res.districtName;
    }
  },
  created() {
    this.setShopTypeList();
    this.getShopDetail();
  },
  mounted() {
    
  },
  watch: {
    $route(to,from) {
      if(from.name == 'editMap') {
        if(this.$route.query.special) {
          this.list[2].value = this.$route.query.special.length >9 ? this.$route.query.special.slice(0,10) +'...' : this.$route.query.special;
          this.organization = this.$route.query.special;
          this.lng = this.$route.query.lng;
          this.lat = this.$route.query.lat;
        }
      }
      else if(from.name === 'shopDetail'){
        if(to.name !== 'shopList') {
          this.getShopDetail();
        }
      }
    },
    popupVisible: function () {
      if (this.popupVisible) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    },
    placeVisible: function () {
      if (this.placeVisible) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    },
    timeVisible: function () {
      if (this.timeVisible) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../assets/scss/shop/addOrEditShop';
</style>
<style>
.mint-switch-input:checked + .mint-switch-core {
  border-color: #4DD865;
  background-color: #4DD865;
}
.mint-checklist-title {
  margin: 0;
}
</style>
