<template>
<div class="addmarket">
  <q-header :title="title"></q-header>
  <div class="addvip-header">
    <p>所属店铺<span class="addvip-con">{{shopCurrentTags?shopCurrentTags.shopName:''}}<span class="order-action iconfont icon-nextx" @click="shopVisible=true"></span></span></p>
    <p>优惠期开始<span class="addvip-con">{{addmarket.startTime}}<span class="order-action iconfont icon-nextx" @click="open('picker2')"></span></span></p>
     <p>优惠期结束<span class="addvip-con">{{addmarket.endTime}}<span class="order-action iconfont icon-nextx" @click="open('picker3')"></span></span></p>
    <p>活动日<span class="addvip-con">{{activeCurrentTags?activeCurrentTags !== '自定义'?activeCurrentTags:checkWeeklisttxt:checkWeeklisttxt}}<span class="order-action iconfont icon-nextx" @click="activeVisible=true"></span></span></p>
    <p>每日活动时段<span class="addvip-con">{{addmarket.time}}<span class="order-action iconfont icon-nextx" @click="activeTimeVisible = true"></span></span></p>
    <p>折扣优惠<span class="addvip-con"><input type="text" placeholder="折扣优惠" class="discount-input" v-model="addmarket.discount">%</span></p>
    <p>是否开放<span class="addvip-con"><mt-switch v-model="addmarket.isOpen" class="check-switch"></mt-switch></span></p>
  </div>
  <section class="promiss-footer">
    <span class="can">取消</span>
    <span class="cifrm" @click="toaddMaket">确定</span>
  </section> 
    <!-- 店铺 -->
  <selectpickr :visible="shopVisible" :slots="shopSlots" :valueKey="shopName" @selectpicker="shopselectpicker" @onpickstatus="shopselectpickertatus"> </selectpickr>
  <!-- 活动日 -->
  <selectpickr :visible="activeVisible" :slots="activeSlots"  @selectpicker="activeselectpicker" @onpickstatus="activeselectpickertatus"> </selectpickr>
  <!-- 选择自定义星期-->
  <mt-popup v-model="weekVisible" position="bottom">
    <div class="resp-shop">
      <span class="quxi" @click="weekVisible = false">取消</span>
      <span class="shop">活动日</span>
      <span class="qued" @click="checkeWeekList">确定</span>
    </div>
    <section class="resp-shop-wrap">
      <div class="all-list">
        <label class="mint-checklist-label" v-for="(item,index) in  weekTitle" :key="index">
          <span class="mint-checkbox is-right">
            <input type="checkbox" class="mint-checkbox-input" v-model="checkWeeklist" :value="item.value"> 
            <span class="mint-checkbox-core"></span>
          </span> 
          <span class="mint-checkbox-label shopname">{{item.label}}</span>
        </label>
      </div>
    </section>
  </mt-popup>

  <!-- 优惠时段 -->
  <mt-popup v-model="activeTimeVisible" position="bottom" class="mint-popup">
     <mt-picker class="picker"  :slots="activeTimeslots" @change="changeTime" :showToolbar="true"><p class="toolBar"><span class="timequx" @click="activeTimeVisible = false;">取消</span><span @click="chooseDay" class="tiem-picker-title">全天</span><span @click="confirmNews" class="queding">确定</span></p></mt-picker>
  </mt-popup>

  
  <!-- <mt-popup v-model="activeDayStartVisible" position="bottom" class="mint-popup">
     <mt-picker class="picker"  :slots="activeTimeslots" @change="changeTime" :showToolbar="true"><p class="toolBar"><span class="timequx" @click="activeTimeVisible = false;">取消</span><span @click="chooseDay" class="tiem-picker-title">全天</span><span @click="confirmNews" class="queding">确定</span></p></mt-picker>
  </mt-popup>
    <div class="day-time">
      <div class="start">
        <mt-datetime-picker ref="picker2" type="date" v-model="value2" :showToolbar="false"></mt-datetime-picker>
      </div>
      <div class="end">
        <mt-datetime-picker ref="picker3" type="date" v-model="value3" :showToolbar="false"></mt-datetime-picker>
      </div>
    </div> -->
    <mt-datetime-picker ref="picker2" type="date" v-model="value2" @confirm="handleStartTimeChange" :startDate="pickerstartDate"></mt-datetime-picker>
    <mt-datetime-picker ref="picker3" type="date" v-model="value3"  @confirm="handleEndTimeTimeChange" :startDate="pickerstartDate"></mt-datetime-picker>
</div>
</template>
<script>
import QHeader from '@/components/header';
import qs from 'qs';
import moment from 'moment';
import selectpickr from '@/components/selectPicker';
import { shopListFun } from '@/service/report';
import { addOruPdateFun } from '@/service/market';
import { validatDiscount } from '@/utils/validate';
export default {
  data() {
    return {
      value2:'',
      value3:'',
      test:true,
      pickerstartDate: new Date('2018-01-01'),
      title: '编辑限时优惠',
      shopVisible:false,
      shopCurrentTags:null,
      shopName:'shopName',
      shopSlots:[
        {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
      ],
      activeVisible: false,
      activeCurrentTags:null,
      activeSlots:[
        {
            flex: 1,
            values: ['每天','周一至周五','自定义'],
            className: 'slot1',
            textAlign: 'center'
          }
      ],
      weekTitle:[
        {value:1,label:'周一'},
        {value:2,label:'周二'},
        {value:3,label:'周三'},
        {value:4,label:'周四'},
        {value:5,label:'周五'},
        {value:6,label:'周六'},
        {value:7,label:'周日'}
      ],
      weekVisible:false,
      checkWeeklist:[],
      checkWeeklisttxt:'',
      
      addmarket:{
        isOpen:true,
        time:null,
        startTime:'',
        endTime:'',
        discount:''
      },


      activeTimeVisible:false,
      activeTimeCurrentTags:null,
      activeTimeslots: [
        {
          flex: 1,
          values: ['00','01', '02', '03', '04', '05', '06','07','08', '09', '10', '11', '12', '13','14','15','16','17','18','19','20','21','22','23'],
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
          values: ['00','01', '02', '03', '04', '05', '06','07','08', '09', '10', '11', '12', '13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29',
          '30','31', '32', '33', '34', '35', '36','37','38', '39', '40', '41', '42', '43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'],
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
          values: ['00','01', '02', '03', '04', '05', '06','07','08', '09', '10', '11', '12', '13','14','15','16','17','18','19','20','21','22','23'],
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
          values: ['00','01', '02', '03', '04', '05', '06','07','08', '09', '10', '11', '12', '13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29',
          '30','31', '32', '33', '34', '35', '36','37','38', '39', '40', '41', '42', '43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'],
          className: 'slot3',
          textAlign: 'left',
          defaultIndex:30
        }
      ],
    };
  },
  mounted() {
    
  },
  created(){
    this.shopListFun();

  },
  methods: {
    async shopListFun(){
      let res = await shopListFun();
      this.shopSlots[0].values = [...res.data];
    },
    shopselectpicker(data){
      this.shopCurrentTags = data;
    },
    shopselectpickertatus(data){
      this.shopVisible = data;
    },
    activeselectpicker(data){
      this.activeCurrentTags = data;
      if (this.activeCurrentTags === '自定义') {
          this.weekVisible = true;
      }
    },
    activeselectpickertatus(data){
      this.activeVisible = data;
    },
    checkeWeekList(){
      let checklist = this.weekTitle.filter(v=>this.checkWeeklist.some(k=>k==v.value));
      let checkActiveList = [];
      checklist.forEach(item=>checkActiveList.push(item.label));
      this.checkWeeklisttxt = checkActiveList.join(',');
      this.weekVisible = false;
    },
    chooseDay() {
      this.activeTimeslots[0].defaultIndex = 0;
      this.activeTimeslots[2].defaultIndex = 0;
      this.activeTimeslots[4].defaultIndex = 23;
      this.activeTimeslots[6].defaultIndex = 59;
    },
    changeTime(picker, values) {
      this.activeTimeCurrentTags = values[0]+':'+values[1]+'-'+ values[2]+':'+values[3];
    },
    confirmNews(){
      this.activeTimeVisible = false;
      this.addmarket.time = this.activeTimeCurrentTags;
    },
    open(picker) {
      this.$refs[picker].open();
    },
    handleStartTimeChange(value) {
      this.addmarket.startTime = moment(value).format('YYYY-MM-DD');
    },
    handleEndTimeTimeChange(value) {
      this.addmarket.endTime = moment(value).format('YYYY-MM-DD');
    },
    async toaddMaket(){
      if (!this.shopCurrentTags) {
        this.$toast({message: "请选择店铺" });
        return false;
      }
      if (!this.addmarket.startTime) {
        this.$toast({message: "请选择优惠期开始时间" });
        return false;
      }
      if (!this.addmarket.endTime) {
        this.$toast({message: "请选择优惠期结束时间" });
        return false;
      }
      if (!this.checkWeeklisttxt || !this.activeCurrentTags) {
        this.$toast({message: "请选择活动日" });
        return false;
      }
      if (!this.addmarket.time) {
        this.$toast({message: "请选择每日活动时段" });
        return false;
      }
      if (!this.addmarket.discount) {
        this.$toast({message: "请填写折扣优惠" });
        return false;
      }
      if (!validatDiscount(this.addmarket.discount)) {
        this.$toast({message: "折扣优惠请填写数字" });
        return false;
      }
      
      if (!this.shopCurrentTags) {
        this.$toast({message: "请选择店铺" });
        return false;
      }

      let week = null;
      if(this.checkWeeklisttxt){
        week = this.checkWeeklist.join(',');
      }else{
        if (this.activeCurrentTags === '周一至周五') {
          week = '1,2,3,4,5';
        } else {
          week = '1,2,3,4,5,6,7';
        }
      }
      let status = null;
      this.addmarket.isOpen === true ? status = 0  :status = 1;
      let payload = Object.assign({},this.addmarket,{week:week,shopIds:this.shopCurrentTags.shopId,status:status});
      delete payload.isOpen;
      let res = await addOruPdateFun(qs.stringify(payload));
    }
  },
  components:{
    QHeader,
    selectpickr
  }
};
</script>
<style type="text/css" lang="scss" scoped>
  .addvip-header {
    padding: 0 0.4rem;
    background: #fff;
    p {
      height: 1.6rem;
      line-height: 1.6rem;
      font-size: 16px;
      color: #999;
      border-bottom:1px solid rgba(223,230,255,1);
    }
    p:last-child{
      border:none;
    }
    .addvip-con {
      float: right;
      color: #333;
    }
  }
  .promiss-footer {
    width: 100%;
    display: flex;
    height: 1.33rem;
    line-height: 1.33rem;
    position: fixed;
    bottom: 0;
    >span {
      flex: 1;
      text-align: center;
    }
    .can {
      font-size:18px;
      color:#1890FF;
      background:rgba(246,248,255,1);
    }
    .cifrm {
      background: #1890FF;
      font-size:18px;
      color: #fff;
    }
  }

  .resp-shop {
    display: flex;
    height: 1.17rem;
    line-height: 1.17rem;
    background:rgba(251,251,252,1);
    padding: 0 0.4rem;
    >span {
      flex: 1;
      font-size: 15px;
    }
    .quxi {
      color: #999;
    }
    .shop {
      text-align: center;
      font-size: 16px;
    }
    .qued {
      text-align:right;
      color: #1890FF;
    }
  }
  .resp-shop-wrap {
    .shopname {
      font-size: 15px;
      color: #333;
    }
  }
.discount-input {
  text-align: right;
  width: 90%;
}
  .check-switch {
    margin-top: 0.4rem;
  }
  .toolBar {
    padding: 0 0.4rem;
    height: 1.07rem;
    line-height: 1.07rem;
    display: flex;
    background:rgba(251,251,252,1);
    >span {
      flex:1;
    }
    .timequx {
      font-size: 15px;
      color: #999;
      float: left;
      display: block;
    }
    .queding {
      color: #1890FF;
      font-size: 15px;
      float: right;
      text-align: right;
    }
    .tiem-picker-title {
      font-size: 16px;
      text-align: center;
    }
  }
  .day-time {
    display: flex;
    >div {
      flex:1;
      width: 50%;
      height: 8.0rem;
    }
    .mint-popup {
      width: 5.0rem;
    }
    .start .mint-popup{
      left: 25%;
      z-index: 2004 !important;
    }
    .end .mint-popup{
      left: 75%;
      z-index: 2004 !important;
    }
  }
</style>
<style>
  .addmarket .mint-checklist-label {
    padding:0 0.4rem;
    text-align: center;
  }
  .addmarket .mint-switch-input:checked + .mint-switch-core {
    border-color: #4DD865;
    background-color: #4DD865;
  }
  .addmarket .picker-toolbar {
    height: 1.07rem;
  }
</style>
