<template>
    <section>
      <li class="personal-item" @click='open()'>
        {{areaName}}
        <span>{{area}}</span>
      </li>
      <!-- 弹窗 -->
      <mt-popup v-model="placeVisible" position="bottom" class="mint-popup">
      <div class="prop-bd">
        <div class="page-picker-wrapper">
          <mt-picker :slots="addressSlots" @change='addressChange' :showToolbar="true"><p class="toolBar"><span @click='cancel'>取消</span><span>所在地区</span><span @click='sure'>确定</span></p></mt-picker>
        </div>
      </div>
    </mt-popup>
    </section>
</template>
<script>
import { areaListFun } from '@/service/shop';
export default {
  props: {
    areaName: {
      type: String
    },
    area: {
      type: String
    }
  },
 data() {
  return {
      areaValue:'',
      placeVisible:false,
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
      provinceArray: [], // 存addressSlots[0].values的areaname和areaid
      cityArray: [], // 存addressSlots[2].values的areaname和areaid
      districtArray: [],
      provinceName: '',
      cityName: '',
      districtName: '',
      place: '',
      provinceId:'',
      cityId:'',
      districtId:'',
      message:''
    };
  },
  methods: {
    open() {
      this.placeVisible = true;
    },
    cancel() {
      this.placeVisible = false;
      this.addressSlots[0].defaultIndex = 0;
      
    },
    sure() {
      this.placeVisible = false;
      if(!this.districtName) {
        this.districtName = '';
        this.districtId = this.cityId;
      }
      if(this.cityName) {
        if(this.provinceName == this.cityName.slice(0,2)) {
          this.place = this.cityName + this.districtName;
        }
        else {
          this.place = this.provinceName + this.cityName + this.districtName;
        }
      }
      if(this.place) {
        this.place = this.place.length>10? this.place.slice(0,10)+'...' : this.place;
      }

      // 传给父组件的值由地址，省ID，市ID，区ID,省名，市名，区名拼接而成，以逗号分割，例如：'河北省石家庄市长安区,130000,130100,130102'
      this.message = this.place + ',' + this.provinceId + ',' + this.cityId + ',' + this.districtId + ',' + this.provinceName + ',' + this.cityName + ',' + this.districtName;
      this.$emit('chooseArea',this.message); 
    },
    async addressChange(picker,values) {
      let obj = { parentId: '0' };
      let res = await areaListFun(obj);
      this.provinceArray = res;
      let choosePro = res.map((p)=> {
        return p.areaName;
      });
      picker.setSlotValues(0, choosePro); //设置省

      for(let i=0;i<this.provinceArray.length;i++) {
        if( values[0] === this.provinceArray[i].areaName ) {
          let city = { parentId: this.provinceArray[i].areaId };
          this.provinceId = this.provinceArray[i].areaId;
          let resCity = await areaListFun(city);
          this.cityArray = resCity;
          let chooseCity = resCity.map((c)=> {
            return c.areaName;
          });
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
    }
  },
  watch: {
    placeVisible: function () {
      if (this.placeVisible) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    }
  }
};
</script>

<style lang="scss" scoped >
section {
  .personal-item {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    padding: 0.53rem;
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
  .mint-popup {
    width: 100%;
    .toolBar {
      display: flex;
      justify-content: center;
      line-height: 1rem;
      background-color: #fbfbfc;
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
    .resp-shop-wrap {
      height: 10.67rem;
      overflow-y: scroll;
      margin-bottom: 0.5rem;
    }
  }
}
</style>
