<template>
<section class="marketing">
  <q-header :title="title"></q-header>
  <div class="add-form">
    <div class="input-group">
        <div class="form-title"><span>账号</span><span class="forward">157 2669 4131</span></div>
    </div>

    <div class="input-group">
      <div class="form-title"><span>姓名</span><span class="forward">张*高</span></div>
    </div>

    <div class="input-group" @click="chooseArea">
      <div class="form-title"><span>所在地区</span><span class="forward iconfont icon-nextx"></span><span class="forward">{{address}}</span></div>
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
import QHeader from '@/components/header';
export default {
  data() {
    return {
      title: '个人信息',
      address: '',
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
      districtId:''
    };
  },
  mounted() {
    
  },
  created(){
  },
  methods: {
    chooseArea() {
      this.placeVisible = true;
    },
    async onAddressChange(picker, values) {
      //选择地区
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
    cancel() {
      //取消
    },
    confirmNews() {
      //确定
    },
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
  components:{
    QHeader
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
