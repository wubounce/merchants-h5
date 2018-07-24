<template>
  <section class="personal">
    <div :class="{'showHide': isClass}"></div>
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
      <p class="isReserve"><span>预约功能</span><span><mt-switch class="check-switch"></mt-switch></span></p>
      <p class="reserveTime"><span>预约时长</span><span><input type="text" class='timeInput'  maxlength="2" placeholder="请填写预约有效时长"></span></p>
      <li class="business" @click="addTime">营业时间<span>{{addBusinessTime}}</span></li>
      <p class="picture">
        <span>店铺照片</span>
        <span>
          <UploadImg :id="imgId.a" @onImgFiles="UpdatedImgFiles"></UploadImg>
        </span>
      </p>
    </div>
    <p class="blank"></p>
    <button class="submit">确定</button>
    <mt-picker class="picker" v-if="popupVisible" :slots="slots" @change="valuesChange" :showToolbar="true" ><p class="toolBar"><span @click="cancel">取消</span><span>店铺类型</span><span @click="confirmNews">确定</span></p></mt-picker>
    <section class="deviceDetail" v-if="deviceDetail">
      <p class="toolBar"><span @click="cancel">取消</span><span>店铺类型</span><span @click="confirmNews">确定</span></p>
      <mt-checklist align="right" :options="options" v-model="machine"></mt-checklist>
    </section>
  </section>
</template>
<script>
import QHeader from '@/components/header';
import UploadImg from "@/components/UploadImg/UploadImg";
export default {
  data() {
    return {
      index:'',
      isClass:false,
      deviceDetail:false,
      shopName:'',
      address:'',
      machineName:'',
      machineTypeIds:'',
      addBusinessTime:'',
      title:'编辑店铺',
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
      shopType: 1,
      shopTypeString:'',
      popupVisible:false,
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
      imgId: {
        a: "a"
      },
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
      ]
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
          alert('该功能的实现依赖接口,接口暂无T^T');
          break;
        case 2:
          this.go("mapSearch");
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
          alert('功能暂无');
          break;
        case 2:
          alert('功能暂无');
          break;
        case 3:
          this.deviceDetail = false;
          this.machineName = this.machine.join(' , ');
          break;
        case 4:
          alert('功能暂无');
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
          alert('功能暂无');
          break;
        case 2:
          alert('功能暂无');
          break;
        case 3:
          this.deviceDetail = false;
          break;
        case 4:
          alert('功能暂无');
          break;
      }
    },
    addDevice() {
      this.index = 3;
      console.log('index:',this.index);
      this.isClass = true;
      this.deviceDetail = true;
    },
    addTime() {
      this.index = 4;
      console.log('index:',this.index);
    },
    UpdatedImgFiles(msg) {
      console.log(msg);
    }
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
  .picker {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    z-index:2018;
  }
  .toolBar {
    span {
      &:nth-child(1) {
        font-size: 0.45rem;
        color: #999999;
        padding-left: 0.42rem;
      }
      &:nth-child(2) {
        font-size: 0.5rem;
        padding: 0 2.7rem;
        color: #666666;
      }
      &:nth-child(3) {
        font-size: 0.45rem;
        color: #1890FF;
      }
    }
  }
  .deviceDetail {
    position: fixed;
    bottom: 0;
    z-index: 2018;
    width: 100%;
    background-color: #fff;
  }
}
</style>
<style>
.mint-switch-input:checked + .mint-switch-core {
  border-color: #4DD865;
  background-color: #4DD865;
}
</style>
