<template>
<section class="marketing" v-title="title">
  <div class="add-form">
    <div class="input-group">
        <div class="form-title"><span>账号</span><span class="forward">{{item.phone}}</span></div>
    </div>

    <div class="input-group">
      <div class="form-title"><span>姓名</span><span class="forward">{{item.realName}}</span></div>
    </div>

    <div class="input-group" @click="chooseArea">
      <div class="form-title"><span>所在地区</span><span class="forward iconfont icon-nextx"></span>
        <span class="forward">
          {{item.address.length>12 ? item.address.slice(0,12) + '...' : item.address}}
        </span>
      </div>
    </div>
  </div>

  <!-- 所在地区 -->
    <mt-popup v-model="placeVisible" position="bottom" class="mint-popup">
      <div class="prop-bd">
        <div class="page-picker-wrapper">
          <mt-picker :slots="addressSlots" @change="onAddressChange" :showToolbar="true"><p class="toolBar"><span @click="cancel">取消</span><span>所在地区</span><span @click="confirmNews">确定</span></p></mt-picker>
        </div>
      </div>
    </mt-popup>
</section>
</template>
<script>
import qs from "qs";
import { areaListFun } from '@/service/shop';
import { getPersonalInfoFun } from '@/service/user';
import { updateOperatorFun } from '@/service/user';
export default {
  data() {
    return {
      title: '个人信息',
      item: {},
      noRealName:'',
      placeVisible: false,
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
      x: '',
      y: '',
      z: ''
    };
  },
  mounted() {
    
  },
  created(){
    this.getArea();
    this.getPersonalInfo();
  },
  methods: {
    async getPersonalInfo() {
      let res = await getPersonalInfoFun();
      this.item = res.data;
      this.noRealName = res.data.realName;
      let arr = [];
      //设置隐藏名字
      if(this.noRealName != ''  && this.noRealName != null ) {
        for(let i=0; i< this.noRealName.length;i++) {
          arr.push(this.noRealName[i]);
        }
        for(let i=0; i< arr.length;i++) {
          if(i>0&&i<arr.length-1) {
            arr[i] = '*';
          }
        }
        this.item.realName = arr.join('');
      }

      //默认地址
      this.item.address = res.data.address;
      console.log(this.item.address.split('自治区'));
      // if(this.item.address.split('省').length == 1 && this.item.address.split('自治区').length != 1  ) {
      //   console.log(1);
      // }
    },
    chooseArea() {
      this.placeVisible = true;
    },
    cancel() {
      //取消
      this.placeVisible = false;
    },
    async confirmNews() {
      //确定
      this.placeVisible = false;
      if(this.provinceName == this.cityName.slice(0,2)) {     
        this.item.address = this.cityName + this.districtName;
      }
      else {
        this.item.address = this.provinceName + this.cityName + this.districtName;
      }
      //往后台传值
      let objUpdate = {
        address: this.item.address
      };
      let res = await updateOperatorFun(qs.stringify(objUpdate));

    },
    async onAddressChange(picker,values) {


      //市
      for(let i=0;i<this.provinceArray.length;i++) {
        if(values[0] == this.provinceArray[i].areaName) {
          let city ={
            parentId: this.provinceArray[i].areaId
          };
          let resCity = await areaListFun(qs.stringify(city));
          if(resCity.code===0) {
            let chooseCity = resCity.data.map((c)=> {
              return c.areaName;
            });
            this.cityArray = resCity.data;
            picker.setSlotValues(1, chooseCity); //设置市
          }
        }
      }
      
      //区
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
      //传区的id
      for(let j=0;j<this.districtArray.length;j++) {
        if(values[2] == this.districtArray[j].areaName) {
          this.districtId = this.districtArray[j].areaId;
        }
      }

      this.provinceName = values[0];
      this.cityName = values[1];
      this.districtName = values[2];
    },
    async getArea() {
      let obj = {
        parentId: '0'
      };
      let resProvince = await areaListFun(qs.stringify(obj));
      if(resProvince.code===0) {
        this.provinceArray = resProvince.data;        
        for(let i=0;i<resProvince.data.length;i++) {
          this.addressSlots[0].values.push(resProvince.data[i].areaName);
        }
      }
      else {
        MessageBox.alert(resProvince.msg);
      }
    }
  },
  components:{
    
  }
};
</script>
<style type="text/css" lang="scss" scoped>
 .add-form {
    padding: 0 0.4rem;
    background: #fff;
    .input-group {
      height: 1.17rem;
      line-height: 1.17rem;
      border-bottom:1px solid #E5E5E5;
      font-size: 16px;
    }
    .input-group:last-child {
      border:none;
    }
    .forward {
      float: right;
      color: #999;
    }
  }
  .toolBar {
    display: flex;
    justify-content: center;
    padding-top: 0.2rem;
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
</style>
