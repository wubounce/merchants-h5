<template>
  <section class="personal">
    <q-header :title="title"></q-header>
    <ul class="personal-list">
      <p class="shopname-p"><span>店铺名称</span><span><input type="text" class='addressInput' v-model="shopName" maxlength="12" placeholder="请填写店铺名称"></span></p>
      <li v-for="(item,index) in list" :key="index" class="personal-item" @click="toDetail(index)">
        {{item.title}}
        <span>{{item.value == ''|| item.value==null? '' : item.value}}</span>
      </li>
      <p class="shopname-p"><span>详细地址</span><span><input type="text" class='addressInput' v-model="address" maxlength="12" placeholder="请填写详细地址"></span></p>
    </ul>
    <div class="second">
      <li class="device business" @click="addDevice">设备类型<span>{{machineName}}</span></li>
      <p class="isReserve"><span>预约功能</span><span><mt-switch class="check-switch" v-model="isReserve"></mt-switch></span></p>
      <p class="reserveTime"><span>预约时长</span><span><input type="text" class='timeInput' v-model="orderLimitMinutes" maxlength="2" placeholder="请填写预约有效时长"></span></p>
      <li class="business" @click="chooseTime">营业时间<span>{{addBusinessTime}}</span></li>
      <p class="picture">
        <span>店铺照片</span>
        <span>
          <UploadImg :id="imgId.a" @onImgFiles="UpdatedImgFiles"></UploadImg>
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
    <mt-popup v-model="deviceDetail" position="bottom" class="mint-popup">
      <p class="toolBar"><span @click="cancel">取消</span><span>设备类型</span><span @click="confirmNews">确定</span></p>
      <mt-checklist align="right" :options="options" v-model="machine"></mt-checklist>
    </mt-popup>

    <!-- 营业时间 -->
    <mt-popup v-model="timeVisible" position="bottom" class="mint-popup">
       <mt-picker class="picker"  :slots="slotsTime" @change="changeTime" :showToolbar="true"><p class="toolBar"><span @click="cancel">取消</span><span @click="chooseDay" id="allDay">全天</span><span @click="confirmNews">确定</span></p></mt-picker>
    </mt-popup>

  </section>
</template>

<script>
import qs from "qs";
import QHeader from '@/components/header';
import UploadImg from "@/components/UploadImg/UploadImg";
import { addShopFun } from '@/service/shop';
import { areaListFun } from '@/service/shop';
export default {
  data() {
    return {
      index:'',
      deviceDetail:false,
      shopName:'',
      address:'',
      machineName:'',
      machineTypeIds:'',
      orderLimitMinutes:'',
      addBusinessTime:'',
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
        a: "a"
      },
      url:'',
      machine: [],
      arrLabel:[],
      options: [
        {
          label: '洗衣机',
          value: '洗衣机'
        },
        {
          label: '吹风机',
          value: '吹风机'
        },
        {
          label: '充电桩',
          value: '充电桩'
        },
        {
          label: '万能充',
          value: '万能充'
        },
        {
          label: '缝纫机',
          value: '缝纫机'
        },
        {
          label: '洗鞋机',
          value: '洗鞋机'
        },
        {
          label: '修理机',
          value: '修理机'
        },
        {
          label: '战斗机',
          value: '战斗机'
        },
        {
          label: '想不到了',
          value: '想不到了'
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
        case 2:
          this.go("mapSearch");
          this.mapVisible = true;
          break;
      }
    },
    go(msg) {
      this.$router.push({
        name: msg
      });
    },
    confirmNews() {
      this.isClass = false;
      switch(this.index) {
        case 0:
          this.popupVisible = false;
          this.list[0].value = this.shopTypeString;
          break;
        case 1:
          this.placeVisible = false;
          //console.log(this.provinceName == this.cityName.slice(0,2));
          if(this.provinceName == this.cityName.slice(0,2)) {
            
            this.list[1].value = this.cityName + this.districtName;
          }
          else {
            this.list[1].value = this.provinceName + this.cityName + this.districtName;
          }
          
          break;
        case 2:
          alert('功能暂无');
          break;
        case 3:
          this.deviceDetail = false;
          this.machineName = this.machine.join(' , ');
          break;
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
    addDevice() {
      this.index = 3;
      console.log('index:',this.index);
      this.isClass = true;
      this.deviceDetail = true;
    },
    UpdatedImgFiles(msg) {
      this.url = msg;
      //console.log(this.url);
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
      let changeisReserve = (this.isReserve==true)? 0 :1;
      let obj = {
        shopId: '  ',
        shopName: this.shopName,
        shopType: this.shopType,
        provinceId:'130000',
        cityId:'130100',
        districtId:'130102',
        address: this.address,
        lat:'33.564',
        lng:'134.456',
        machineTypeIds: 'c9892cb4-bd78-40f6-83c2-ba73383b090a',
        isReserve: changeisReserve,
        orderLimitMinutes: this.orderLimitMinutes,
        workTime: this.addBusinessTime,
        imageId: 'http://fileupload.haiyaxiyi.cn/Upload/Shop/292f6b9c-782e-432b-aa0e-d720837026f7.jpg'
      };

      let res = await addShopFun(qs.stringify(obj));
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
    }
  },
  created() {
    //this.getArea();
  },
  components:{
    QHeader,
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
      font-size: 0.35rem;
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
          font-size: 0.35rem;
        }
        :-moz-placeholder {
          /* Firefox 18- */
          color: #999999;
          font-size: 0.35rem;
        }
        ::-moz-placeholder {
          /* Firefox 19+ */
          color: #999999;
          font-size: 0.35rem;
        }
        :-ms-input-placeholder {
          color: #999999;
          font-size: 0.35rem;
        }
      }
      &:last-child {
        border-bottom: 1px solid #fff;
      }
    }
    .personal-item {
      font-size: 0.35rem;
      padding: 0.3rem;
      border-bottom: 1px solid #F8F8F8;
      background: url("../../../static/shop/right.png") no-repeat right
        0.3rem center;
      background-size: 0.16rem 0.27rem;
      span {
        float: right;
        color: #7f7f7f;
        font-size: 0.28rem;
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
      font-size: 0.35rem;
      padding: 0.3rem;
      background-color: #fff;
      border-bottom: 1px solid #F8F8F8;
      background: url("../../../static/shop/right.png") no-repeat right
        0.3rem center;
      background-size: 0.16rem 0.27rem;
      span {
        
        color: #7f7f7f;
        font-size: 0.28rem;
        margin-right: 0.3rem;
      }
    }
    .isReserve {
      display: flex;
      justify-content: space-between;
      font-size: 0.35rem;
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
      font-size: 0.35rem;
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
          font-size: 0.35rem;
        }
        :-moz-placeholder {
          /* Firefox 18- */
          color: #999999;
          font-size: 0.35rem;
        }
        ::-moz-placeholder {
          /* Firefox 19+ */
          color: #999999;
          font-size: 0.35rem;
        }
        :-ms-input-placeholder {
          color: #999999;
          font-size: 0.35rem;
        }
      }
    }
    .picture {
      display: flex;
      margin-top: 0.18rem;
      justify-content: space-between;
      span {
        &:first-child {
          font-size: 0.35rem;
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
    font-size: 0.5rem;
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
}
</style>
<style>
.mint-switch-input:checked + .mint-switch-core {
  border-color: #4DD865;
  background-color: #4DD865;
}
</style>
