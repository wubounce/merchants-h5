<template>
  <section class="personal">
    <ul class="personal-list">
      <p class="shopname-p"><span>店铺名称</span><span><input  @change="blur" type="text" class='addressInput' v-model="shopName"  placeholder="请填写店铺名称"></span></p>
      <li class="personal-item" @click="chooseShopType">店铺类型<span>{{shopTypeName}}</span></li>
      <place :area='areaValue' @chooseArea='getThreeArea'></place>
      <li class="personal-item" @click="chooseMap">小区/大厦/学校<span>{{school}}</span></li>
      <p class="shopname-p"><span>详细地址</span><span><input  type="text" class='addressInput' v-model="address"  placeholder="请填写详细地址"></span></p>
    </ul>
    <div class="second">
      <p class="isReserve device">
        <span>预约功能</span>
        <span><mt-switch class="check-switch" v-model="isReserve" @change="editTime(isReserve)"></mt-switch></span>
      </p>
      <p class="reserveTime">
        <span>预约时长(分钟)</span>
        <span>
          <input  v-model="orderLimitMinutes" :disabled="noEdit" :placeholder="placeholdercontent"  maxlength='1'>
        </span>
      </p>
      <li class="business" @click="chooseTime">营业时间<span>{{addBusinessTime}}</span></li>
    </div>
    <p class="blank"></p>
    <button class="submit" @click="submit">提交</button>
    <!-- 店铺类型 -->
    <mt-popup v-model="popupVisible" position="bottom" class="mint-popup">
      <div class="prop-bd">
        <div class="page-picker-wrapper">
          <mt-picker class="picker" :slots="slots" @change="valuesChange" :showToolbar="true" ><p class="toolBar"><span @click="cancelShopType">取消</span><span>店铺类型</span><span @click="sureShopType">确定</span></p></mt-picker>
        </div>
      </div>
    </mt-popup>
    <!-- 营业时间 -->
    <mt-popup v-model="timeVisible" position="bottom" class="mint-popup">
       <mt-picker class="picker"  :slots="slotsTime" @change="changeTime" :showToolbar="true"><p class="toolBar"><span @click="cancelWorkTime">取消</span><span @click="chooseDay" id="allDay">全天</span><span @click="sureWorkTime">确定</span></p></mt-picker>
    </mt-popup>
  </section>
</template>

<script>
import place from '@/components/Area/Area';
import { MessageBox } from 'mint-ui';
import { addOrEditShopFun , areaListFun , listParentTypeFun , manageListFun } from '@/service/shop';
export default {
  data() {
    return {
      areaValue: '',
      buttonHide:true,
      shopName:'',
      shopTypeName:'',
      school:'',
      arrName:[],
      address:'',
      machineName:'',
      lastMachine: [],
      machineTypeIds:'',
      machineArray: [],
      machineTypeIdsArray:'',
      orderLimitMinutes:'',
      addBusinessTime:'',
      noEdit:true,
      placeholdercontent:'开启预约功能后可填',
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
      isReserve:false,
      lat:'',
      lng:'',
      mapCity:'',
      organization:''
    };
  },
  methods:{
    getThreeArea(msg) {
      if(msg) {
        let param = msg.split(',');
        //console.log(param);
        this.areaValue = param[0];
        this.provinceId = param[1];
        this.cityId = param[2];
        this.districtId = param[3];
        this.mapCity = param[5];
        //清空小区...，详细地址的信息
        this.lat = '';
        this.lng = '';
        this.school = '';
        this.organization = '';
        this.address = '';
      }
    },
    //置空
    setNull() {
      this.shopName = '';
      this.shopType = '';
      this.list[0].value = '';
      this.list[1].value = '';
      this.list[2].value = '';
      this.provinceId = '';
      this.cityId = '';
      this.districtI = '';
      this.address = '';
      this.lat = '';
      this.lng = '';
      this.isReserve = false;
      this.orderLimitMinutes = '';
      this.addBusinessTime = '';
      this.organization = '';
    },
    disbaledBtn() {
      this.buttonHide = false;
    },
    showBtn() {
      this.buttonHide = true;
    },
    blur(e) {
      //校验字符长度
      if(e.target.value.length>1 && e.target.value.length<21) {
        this.shopName = e.target.value;
      }
      else {
        this.shopName = '';
        this.$toast({
            message: '请输入2到20字符的店铺名称',
            position: 'top',
            duration: 3000
          });
      }
      //校验重名
      for(let i=0; i<this.arrName.length; i++) {
        if(e.target.value == this.arrName[i]) {
          e.target.value = '';
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

    // 选择店铺类型
    chooseShopType() {
      this.popupVisible = true;
      this.isClass = true;
    },
    sureShopType() {
      this.popupVisible = false;
      this.shopTypeName = this.shopTypeString;
      //console.log(this.shopType);
    },
    cancelShopType() {
      this.popupVisible = false;
    },

    // 选择小区/大厦/学校
    chooseMap() {
      if(this.areaValue) {
        this.goMap("mapSearch",this.mapCity);
      }
      else {
        this.$toast({
          message: '请您先选择所在地区，再选择小区/大厦/学校',
          position: 'middle',
          duration: 3000
        });
      }
    },
   //跳转传值
    goMap(x,mapCity) {
      this.$router.push({
        name:x,
        query:{
          mapCity:mapCity
        }
      });
    },

    // 营业时间
    changeTime(picker, values) {
      this.shopTime.startTime = values[0].slice(0,2) + ':' +values[1].slice(0,2);
      this.shopTime.endTime = values[2].slice(0,2) + ':' +values[3].slice(0,2);
      //console.log('values[0]:',values[0]);
    },
    chooseDay() {
      // 点击全天直接获取全天并且退出弹框
      this.timeVisible = false;
      this.addBusinessTime = '00:00-23:59';
    },
    chooseTime() {
      this.timeVisible = true;
      this.isClass = true;
    },
    sureWorkTime() {
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
    },
    cancelWorkTime() {
      this.timeVisible = false;
    },

    // 提交按钮
    async submit() {
      //console.log(this.lng);
      if(this.shopName!=false && this.shopType!=false && this.provinceId != false && this.cityId !=false && this.provinceId != false && this.address != false && this.lat !=false && this.lng != false && this.lat !=undefined && this.lng != undefined && this.addBusinessTime != false) {
        if(this.orderLimitMinutes) {
          //在判断
          let reg=/^[1-9]+\d*$/;
          //console.log(reg.test(this.orderLimitMinutes));
          if(reg.test(this.orderLimitMinutes) &&parseInt(this.orderLimitMinutes) >0 && parseInt(this.orderLimitMinutes) <10) {
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
              message: '添加成功',
              iconClass: 'mint-toast-icon mintui mintui-success'
            });
            setTimeout(() => {
              instance.close();
              }, 1000);
              this.$router.push({
                name:'shopList'
              });
           
            //上面是传值
          }
          else {
            //提示
            this.$toast({
              message:'请输入个位数的时长',
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
            isReserve: changeisReserve,
            orderLimitMinutes: this.orderLimitMinutes,
            workTime: this.addBusinessTime,
            organization: this.organization
          };
          let res = await addOrEditShopFun(obj);
          
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
        
      }else if(!this.shopName) {
        this.$toast({
            message: '请填写店铺名称',
            position: 'middle',
            duration: 3000
          });
      }else if(!this.shopTypeName) {
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
      }else if(!this.lat || !this.lng) {
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
      }
      else if(!this.addBusinessTime) {
        this.$toast({
            message: '请选择营业时间',
            position: 'middle',
            duration: 3000
          });
      }
    },
    async getShoplist() {
      let res = await manageListFun();
      this.arrName = res.items.map((i) => {
        return i.shopName;
      });
    }
  },
  created() {
    this.getShoplist();
  },
  // 背景滚动
  watch: {
    $route(to,from) {
      if(from.name == 'mapSearch') {
        if(this.$route.query.special) {
          this.school = this.$route.query.special.length >9 ? this.$route.query.special.slice(0,10) +'...' : this.$route.query.special;
          this.organization = this.$route.query.special;
          this.lng = this.$route.query.lng;
          this.lat = this.$route.query.lat;
        }
      }
      else if(from.name == 'shopList'){
        location.reload();
        //置空，解决keepAlive造成的保留上次
        //this.setNull();  
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
  },
  components: {
    place
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
