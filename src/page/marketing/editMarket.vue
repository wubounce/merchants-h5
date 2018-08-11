<template>
<div class="addmarket" v-title="title">
  <div class="permissions" v-if="$store.getters.has('mer:marketing:update')">暂无相关页面权限</div>
  <div v-else>
    <div class="addvip-header">
      <p>所属店铺<span class="order-action add-shop-overflow-icon iconfont icon-nextx" @click="shopVisible=true"></span><span class="addvip-con add-shop-overflow">{{checkshoptxt?checkshoptxt:''}}</span></p>
      <p>优惠期开始<span class="addvip-con">{{addmarket.startTime}}<span class="order-action iconfont icon-nextx" @click="open('picker2')"></span></span></p>
       <p>优惠期结束<span class="addvip-con">{{addmarket.endTime}}<span class="order-action iconfont icon-nextx" @click="open('picker3')"></span></span></p>
      <p>活动日<span class="order-action add-shop-overflow-icon iconfont icon-nextx" @click="activeVisible=true"></span><span class="addvip-con add-shop-overflow">{{activeCurrentTags?activeCurrentTags.label !== '自定义'?activeCurrentTags.label:checkWeeklisttxt:checkWeeklisttxt}}</span></p>
      <p>每日活动时段<span class="addvip-con">{{addmarket.time}}<span class="order-action iconfont icon-nextx" @click="activeTimeVisible = true"></span></span></p>
      <p>折扣优惠<span class="addvip-con"><input type="number" placeholder="请输入优惠折扣" class="discount-input" v-model="addmarket.discount">%</span></p>
      <p>是否开放<span class="addvip-con"><mt-switch v-model="addmarket.addstatus" class="check-switch"></mt-switch></span></p>
    </div>
    <div class="nopay-time">
      <h6>不可支付时段</h6>
      <div class="time-chose">
        <p>不可支付日期开始<span class="addvip-con">{{addmarket.noWorkStart}}<span class="order-action iconfont icon-nextx" @click="open('picker4')"></span></span></p>
         <p>不可支付日期结束<span class="addvip-con">{{addmarket.noWorkEnd}}<span class="order-action iconfont icon-nextx" @click="open('picker5')"></span></span></p>
        <p>每日不可支付时间<span class="addvip-con">{{addmarket.noWorkTime}}<span class="order-action iconfont icon-nextx" @click="noWorkVisible = true"></span></span></p>
      </div>
    </div>
    <div class="confirm" @click="toaddMaket">确定</div>
    <!-- 不可支付日期开始 -->
    <mt-datetime-picker ref="picker4" type="date" @confirm="handleNoWorkTimeStartChange" :startDate="pickerstartDate"></mt-datetime-picker>
      <!-- 不可支付日期结束 -->
    <mt-datetime-picker ref="picker5" type="date" @confirm="handleNoWorkTimeEndChange" :startDate="pickerstartDate"></mt-datetime-picker>
     <!-- 每日不可支付时间 -->
    <mt-popup v-model="noWorkVisible" position="bottom" class="mint-popup">
       <mt-picker class="pickerNoWork"  :slots="activeTimeslots" @change="changeNoWorkTime" :showToolbar="true"><p class="toolBar"><span class="timequx" @click="noWorkVisible = false;">取消</span><span @click="chooseDay" class="tiem-picker-title">全天</span><span @click="confirmNews('pickerNoWork')" class="queding">确定</span></p></mt-picker>
    </mt-popup> 
    <!-- 活动日 -->
    <selectpickr :visible="activeVisible" :slots="activeSlots" :valueKey="label" @selectpicker="activeselectpicker" @onpickstatus="activeselectpickertatus"> </selectpickr>
    <!-- 选择自定义星期-->
    <mt-popup v-model="weekVisible" position="bottom" :closeOnClickModal="false">
      <div class="resp-shop">
        <span class="quxi" @click="weekVisible = false">取消</span>
        <span class="shop">活动日</span>
        <span class="qued" @click="checkeWeekList">确定</span>
      </div>
      <section class="resp-shop-wrap">
        <div class="all-list">
          <label class="mint-checklist-label" v-for="(item,index) in  weekTitle" :key="index">
            <span class="mint-checkbox is-right">
              <input type="checkbox" class="mint-checkbox-input" v-model="weeklist" :value="item.value"> 
              <span class="mint-checkbox-core"></span>
            </span> 
            <span class="mint-checkbox-label shopname">{{item.label}}</span>
          </label>
        </div>
      </section>
    </mt-popup>

    <!-- 优惠时段 -->
    <mt-popup v-model="activeTimeVisible" position="bottom" class="mint-popup">
       <mt-picker class="pickerActiveTimes"  :slots="activeTimeslots" @change="changeTime" :showToolbar="true"><p class="toolBar"><span class="timequx" @click="activeTimeVisible = false;">取消</span><span @click="chooseDay" class="tiem-picker-title">全天</span><span @click="confirmNews('pickerActiveTimes')" class="queding">确定</span></p></mt-picker>
    </mt-popup>

    <!-- 优惠期开始 -->
    <mt-datetime-picker ref="picker2" type="date" @confirm="handleStartTimeChange" :startDate="pickerstartDate"></mt-datetime-picker>
      <!-- 优惠期结束 -->
    <mt-datetime-picker ref="picker3" type="date" @confirm="handleEndTimeTimeChange" :startDate="pickerstartDate"></mt-datetime-picker>

    <!-- 选择店铺 -->
    <mt-popup v-model="shopVisible" position="bottom" :closeOnClickModal="false">
      <div class="resp-shop">
        <span class="quxi" @click="cancelCheckshop">取消</span>
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
</div>
</template>
<script>
import qs from 'qs';
import moment from 'moment';
import selectpickr from '@/components/selectPicker';
import { shopListFun } from '@/service/report';
import { addOruPdateFun, detailMarketFun } from '@/service/market';
import { validatDiscount } from '@/utils/validate';
export default {
  data() {
    return {
      discountStartDate:'',
      discountEndDate:'',
      pickerstartDate: new Date(),
      pickerEndDate: new Date(),
      title: '编辑限时优惠',



      shopVisible:false,
      checkshoptxt:'',
      shoplist:[],
      shopIds:[],

      activeVisible: false,
      activeCurrentTags:null,
      label:'label',
      activeSlots:[
        {
            flex: 1,
            values: [
              {label:'每天', value:'9'},
              {label:'周一至周五', value:'8'},
              {label:'自定义', value:''}
            ],
            className: 'slot1',
            textAlign: 'center'
          }
      ],
      weekTitle:[
        {value:'1',label:'周一'},
        {value:'2',label:'周二'},
        {value:'3',label:'周三'},
        {value:'4',label:'周四'},
        {value:'5',label:'周五'},
        {value:'6',label:'周六'},
        {value:'7',label:'周日'}
      ],
      weekVisible:false,
      weeklist:[],
      checkWeeklisttxt:'',
      
      addmarket:{
        status:true,
        time:null,
        startTime:'',
        endTime:'',
        discount:'',
        noWorkStart:null,
        noWorkEnd:null,
        noWorkTime:null,
      },

      noWorkVisible:false,
      noWorkCurrentTags:null,

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
    this.getDetail();
  },
  methods: {
     async getDetail(){
      let query = this.$route.query;
      let payload = {timeId:query.id};
      let res = await detailMarketFun(qs.stringify(payload));
      this.shopListFun(query.id);
      if (res.code === 0) {
        let detail = res.data;
        this.addmarket.startTime = detail.noDiscountStart ? moment(detail.noDiscountStart).format('YYYY-MM-DD') : '';
        this.addmarket.endTime = detail.noDiscountEnd ? moment(detail.noDiscountEnd).format('YYYY-MM-DD'): '';
        this.addmarket.addstatus =  detail.status ===  0 ? this.addmarket.addstatus = true  : this.addmarket.addstatus = false;
        this.addmarket.time = detail.noTime;
        this.addmarket.discount = Number(detail.discountVO).toFixed(0);
        this.addmarket.noWorkStart = detail.noWorkStart ? moment(detail.noWorkStart).format('YYYY-MM-DD') : '';
        this.addmarket.noWorkEnd = detail.noWorkEnd ? moment(detail.noWorkEnd).format('YYYY-MM-DD') : '';
        this.addmarket.noWorkTime = detail.noWorkTime;

        let beshop = [];
        detail.shop.forEach(item=>{
          beshop.push(item.name);
          this.shopIds.push(item.id);
        });
        this.checkshoptxt = beshop.join(',');
        
        this.filterweek(detail.noWeek); //活动日期
        this.weeklist = detail.noWeek ?detail.noWeek.split(',') :[];
      }
      
    },
    filterweek(value){
      if (value === '9') {
        this.activeCurrentTags = {label:'每天'};
      } else if(value === '8'){
        this.activeCurrentTags = {label:'周一至周五'};
      }else {
        let arr = [];
        let weeklsit = [];
        arr = value? value.split(',') :[];
        arr.forEach(item=>{
          if (item == '1') {
            weeklsit.push('周一');
          } else if(item == '2') {
            weeklsit.push('周二');
          } else if(item == '3') {
            weeklsit.push('周三');
          } else if(item == '4') {
            weeklsit.push('周四');
          } else if(item == '5') {
            weeklsit.push('周五');
          } else if(item == '6') {
            weeklsit.push('周六');
          } else if(item == '7') {
            weeklsit.push('周日');
          }
        });
        this.checkWeeklisttxt = weeklsit.join(',');
      }
    },
    async shopListFun(timeid){
      let payload = {timeId:timeid};
      let res = await shopListFun(qs.stringify(payload));
      this.shoplist = res.data;
    },
    getcheckshop(){
      let checklist = this.shoplist.filter(v=>this.shopIds.some(k=>k==v.shopId));
      this.shopVisible = false;
      this.checkshoptxt = checklist.map(item=>item.shopName).join(',');
    },
    cancelCheckshop(){
      let canceIds = this.checkshoptxt ?  this.checkshoptxt.split(',') :[];
      canceIds = this.shoplist.filter(v=>canceIds.some(k=>k==v.shopName));
      this.shopIds = canceIds.map(item=>item.shopId);
      this.shopVisible = false;
    },
    activeselectpicker(data){ //打开自定义星期
      let weeklist = [];
      this.activeCurrentTags = data;
      if (data.value!=='') {
        weeklist.push(data.value);
      }
      if (this.activeCurrentTags.label === '自定义') {
          this.weekVisible = true;
      }
      this.weeklist = [...weeklist]; //如果选了自定义活动日重新赋值
    },
    activeselectpickertatus(data){
      this.activeVisible = data;
    },
    checkeWeekList(){ //选择自定星期
      console.log(this.weeklist);
      let checklist = this.weekTitle.filter(v=>this.weeklist.some(k=>k==v.value));
      this.checkWeeklisttxt = checklist.map(item=>item.label).join(',');
      this.weekVisible = false;
      this.weeklist = this.weeklist.filter(id => Number(id) !== 8&&Number(id) !== 9); //自动活动日去掉每天和周一至周五
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
    changeNoWorkTime(picker, values) {
      this.noWorkCurrentTags = values[0]+':'+values[1]+'-'+ values[2]+':'+values[3];
    },
    confirmNews(picker){
      if (picker === 'pickerActiveTimes') {
        this.activeTimeVisible = false;
        this.addmarket.time = this.activeTimeCurrentTags;
      } else if(picker === 'pickerNoWork'){
        this.noWorkVisible = false;
        this.addmarket.noWorkTime = this.noWorkCurrentTags;
      }
     
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
    handleNoWorkTimeStartChange(value) {
      this.addmarket.noWorkStart = moment(value).format('YYYY-MM-DD');
    },
    handleNoWorkTimeEndChange(value) {
      this.addmarket.noWorkEnd = moment(value).format('YYYY-MM-DD');
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
      if (this.weeklist.length <= 0) {
        this.$toast({message: "请选择活动日" });
        return false;
      }
      if (!this.addmarket.time) {
        this.$toast({message: "请选择每日活动时段" });
        return false;
      }
      let timearry = this.addmarket.time.split('-');
      let timearrystart = timearry[0].replace(/\:/g, '');  
      let timearrystartend = timearry[1].replace(/\:/g, '');  
      if(timearrystart > timearrystartend){  
        this.$toast({message: "每日活动时段开始时间不能大于结束时间"});
        return false;
      }
      if(timearrystart === timearrystartend){  
        this.$toast({message: "每日活动时段开始时间不能结束时间相同"});
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
      let status = null;
      this.addmarket.addstatus === true ? status = 0  : status = 1;
      let payload = Object.assign({},this.addmarket,{week:this.weeklist.join(','),shopIds:this.shopIds.join(','),timeId:this.$route.query.id,status:status});
      delete payload.addstatus;
      let res = await addOruPdateFun(qs.stringify(payload));
      if (res.code === 0) {
        this.$toast({message: '编辑成功' });
        this.$router.push({name:'marketing'});
      } else {
        this.$toast({message: res.msg });
      }
    }
  },
  components:{
    selectpickr
  }
};
</script>
<style type="text/css" lang="scss" scoped>
    .addmarket {
      padding-bottom: 2rem;
    }
  .addvip-header, .time-chose {
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
  .confirm {
    width:100%;
    height:1.33rem;
    line-height: 1.33rem;
    background:rgba(24,144,255,1);
    text-align: center;
    font-size: 18px;
    color: #fff;
    position: fixed;
    bottom: 0;
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
    .all-list {
      height: 11.96rem;
      overflow-y: scroll;
    }
  }
.discount-input {
  padding-top: 0.51rem;
  padding-bottom: 0.49rem;
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
  .nopay-time {
    h6 {
      color:rgba(153,153,153,1);
      line-height:0.44rem;
      font-size: 12px;
      font-weight: normal;
      padding: 0.4rem 0 0.13rem 0.4rem;
    }
  }
</style>
<style>
  .addmarket .mint-checklist-label {
    padding:0.33rem 0.4rem;
    text-align: center;
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
  .addmarket .mint-checkbox-core {
    vertical-align: top;
    margin-top: -0.03rem;
  }
</style>
