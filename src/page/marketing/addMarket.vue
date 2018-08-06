<template>
<div class="addmarket" v-title="title">
  <div class="addvip-header">
    <p>所属店铺<span class="order-action add-shop-overflow-icon iconfont icon-nextx" @click="shopVisible=true"></span><span class="addvip-con add-shop-overflow">{{checkshoptxt?checkshoptxt:''}}</span></p>
    <p>优惠期开始<span class="addvip-con">{{addmarket.startTime}}<span class="order-action iconfont icon-nextx" @click="open('picker2')"></span></span></p>
     <p>优惠期结束<span class="addvip-con">{{addmarket.endTime}}<span class="order-action iconfont icon-nextx" @click="open('picker3')"></span></span></p>
    <p>活动日<span class="order-action add-shop-overflow-icon iconfont icon-nextx" @click="activeVisible=true"></span><span class="addvip-con add-shop-overflow">{{activeCurrentTags?activeCurrentTags !== '自定义'?activeCurrentTags:checkWeeklisttxt:checkWeeklisttxt}}</span></p>
    <p>每日活动时段<span class="addvip-con">{{addmarket.time}}<span class="order-action iconfont icon-nextx" @click="activeTimeVisible = true"></span></span></p>
    <p>折扣优惠<span class="addvip-con"><input type="number" placeholder="折扣优惠" class="discount-input" v-model="addmarket.discount">%</span></p>
    <p>是否开放<span class="addvip-con"><mt-switch v-model="addmarket.addstatus" class="check-switch"></mt-switch></span></p>
  </div>
  <section class="promiss-footer">
    <span class="can" @click="cancalAdd">取消</span>
    <span class="cifrm" @click="toaddMaket">确定</span>
  </section> 
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
  <!-- 每日活动时段 -->
  <mt-popup v-model="activeTimeVisible" position="bottom" class="mint-popup">
     <mt-picker class="picker"  :slots="activeTimeslots" @change="changeTime" :showToolbar="true"><p class="toolBar"><span class="timequx" @click="activeTimeVisible = false;">取消</span><span @click="chooseDay" class="tiem-picker-title">全天</span><span @click="confirmNews" class="queding">确定</span></p></mt-picker>
  </mt-popup>

  <!-- 优惠期开始 -->
  <mt-datetime-picker ref="picker2" type="date" v-model="discountStartDate" @confirm="handleStartTimeChange" :startDate="pickerstartDate"></mt-datetime-picker>
    <!-- 优惠期结束 -->
  <mt-datetime-picker ref="picker3" type="date" v-model="discountEndDate"  @confirm="handleEndTimeTimeChange" :startDate="pickerstartDate"></mt-datetime-picker>

  <!-- 选择店铺 -->
  <mt-popup v-model="shopVisible" position="bottom">
    <div class="resp-shop">
      <span class="quxi" @click="shopVisible = false">取消</span>
      <span class="shop">店铺</span>
      <span class="qued" @click="getcheckshop">确定</span>
    </div>
    <section class="resp-shop-wrap">
      <div class="all-list">
        <label class="mint-checklist-label" v-for="(item,index) in shoplist" :key="index">
          <span class="mint-checkbox is-right">
            <input type="checkbox" class="mint-checkbox-input" v-model="shopIds" :value="item.shopId"> 
            <span class="mint-checkbox-core"></span>
          </span> 
          <p class="mint-checkbox-label shopname">{{item.shopName}}</p>
        </label>
      </div>
    </section>
  </mt-popup>
</div>
</template>
<script>
import qs from 'qs';
import moment from 'moment';
import selectpickr from '@/components/selectPicker';
import { shopListFun } from '@/service/report';
import { addOruPdateFun } from '@/service/market';
import { validatDiscount } from '@/utils/validate';
export default {
  data() {
    return {
      discountStartDate:'',
      discountEndDate:'',
      pickerstartDate: new Date(),
      title: '新增优惠',

      shopVisible:false,
      checkshoptxt:'',
      shoplist:[],
      shopIds:[],

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
        addstatus:true,
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
          defaultIndex:5
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
          defaultIndex:0
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
          defaultIndex:23
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
          defaultIndex:0
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
      this.shoplist = res.data;
    },
    getcheckshop(){
      let checklist = this.shoplist.filter(v=>this.shopIds.some(k=>k==v.shopId));
      this.shopVisible = false;
      this.checkshoptxt = checklist.map(item=>item.shopName).join(',');
    },
    activeselectpicker(data){ //打开自定义星期
      this.activeCurrentTags = data;
      if (this.activeCurrentTags === '自定义') {
          this.weekVisible = true;
      }
    },
    activeselectpickertatus(data){
      this.activeVisible = data;
    },
    checkeWeekList(){ //选择自定星期
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
      if (this.shopIds.length<=0) {
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
      let startTime = new Date(this.addmarket.startTime.replace(/\-/g, "\/"));  
      let endTime = new Date(this.addmarket.endTime.replace(/\-/g, "\/"));  
      if(startTime > endTime){  
        this.$toast({message: "优惠期开始时间不能大于结束时间"});
        return false;
      }
      if (!this.activeCurrentTags && !this.checkWeeklisttxt) {
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
        this.$toast({message: "折扣优惠请输入1-100之间" });
        return false;
      }
      let week = null;
      if(this.checkWeeklisttxt){   
        week = this.checkWeeklisttxt;
      }else{
        if (this.activeCurrentTags === '周一至周五') {
          week = '1,2,3,4,5';
        } else {
          week = '1,2,3,4,5,6,7';
        }
      }
     let status = null;
      this.addmarket.addstatus === true ? status = 0  : status = 1;
      let payload = Object.assign({},this.addmarket,{week:week,shopIds:this.shopIds.join(','),status:status});
      delete payload.addstatus;
      let res = await addOruPdateFun(qs.stringify(payload));
      if (res.code === 0) {
        this.$toast({message: '新增成功' });
        this.$router.push({name:'marketing'});
      } else {
        this.$toast({message: res.msg });
      }
    },
    cancalAdd(){
      this.$router.push({name:'marketing'});
    }
  },
  components:{
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
      color: #333;
      border-bottom:1px solid rgba(223,230,255,1);
    }
    p:last-child{
      border:none;
    }
    .addvip-con {
      float: right;
    }
    .add-shop-overflow {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 65%;
      text-align: right;
    }
    .add-shop-overflow-icon {
      float: right;
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
    height: 1.17rem;
    line-height: 1.17rem;
  }
  .addmarket .mint-switch-input:checked + .mint-switch-core {
    border-color: #4DD865;
    background-color: #4DD865;
  }
  .addmarket .picker-toolbar {
    height: 1.07rem;
  }
  .addmarket .picker, .addmarket .picker-items {
    width: 100%;
  }
</style>
