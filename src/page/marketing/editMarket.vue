<template>
<div class="addmarket">
  <div class="permissions" v-if="!$store.getters.has('mer:marketing:update')">暂无相关页面权限</div>
  <div v-else v-if="$store.getters.has('mer:marketing:update')">
    <div class="addvip-header">
      <p @click="shopVisible=true">所属店铺<span class="order-action add-shop-overflow-icon iconfont icon-nextx"></span><span class="addvip-con add-shop-overflow">{{checkshoptxt?checkshoptxt:''}}</span></p>
      <p @click="opencheckedMachine">设备类型<span class="order-action add-shop-overflow-icon iconfont icon-nextx"></span><span class="addvip-con add-shop-overflow">{{machineCurrent?machineCurrent.parentTypeName:''}}</span></p>
      <p @click="open('picker2')">优惠期开始<span class="addvip-con">{{addmarket.startTime}}<span class="order-action iconfont icon-nextx"></span></span></p>
      <p @click="open('picker3')">优惠期结束<span class="addvip-con">{{addmarket.endTime}}<span class="order-action iconfont icon-nextx"></span></span></p>
      <p @click="activeVisible=true">活动日<span class="order-action add-shop-overflow-icon iconfont icon-nextx"></span><span class="addvip-con add-shop-overflow">{{checkWeeklisttxt.join(',') | week}}</span></p>
      <p @click="chooseTime()">每日活动时段<span class="addvip-con">{{addmarket.time}}<span class="order-action iconfont icon-nextx"></span></span></p>
      <p>折扣优惠<span class="addvip-con"><input type="number" pattern="\d*" placeholder="请输入优惠折扣" class="discount-input" v-model="addmarket.discount">%</span></p>
    </div>
    <div class="confirm" @click="toaddMaket">确定</div>

    <!-- 活动日 -->
    <selectpickr :visible="activeVisible" :slots="activeSlots" :valueKey="label" :title="'活动日'" @selectpicker="activeselectpicker" @onpickstatus="activeselectpickertatus"> </selectpickr>
    <!-- 选择自定义星期-->
    <mt-popup v-model="weekVisible" position="bottom" :closeOnClickModal="false">
      <div class="resp-shop">
        <span class="quxi" @click="weekVisible = false">取消</span>
        <span class="shop">店铺</span>
        <span class="qued" @click="checkeWeekList">确定</span>
      </div>
      <section class="resp-shop-wrap">
        <div class="all-list">
          <label class="mint-checklist-label" v-for="(item,index) in  weekTitle" :key="index">
            <span class="mint-checkbox is-right">
              <input type="checkbox" class="mint-checkbox-input" v-model="weeklist" :value="item.value"> 
              <span class="mint-checkbox-core"></span>
            </span> 
            <p class="mint-checkbox-label shopname">{{item.label}}</p>
          </label>
        </div>
      </section>
    </mt-popup>
    <!-- 优惠时段 -->
    <mt-popup v-model="activeTimeVisible" position="bottom" class="mint-popup">
       <mt-picker class="pickerActiveTimes"  :slots="activeTimeslots" @change="changeTime" :showToolbar="true">
          <p class="toolBar">
           <span class="timequx" @click="activeTimeVisible = false;">取消</span>
           <span @click="chooseDay" id="allDay">全天</span>
           <span @click="confirmNews('pickerActiveTimes')" class="queding">确定</span>
          </p>
        </mt-picker>
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
     <!-- 设备类型 -->
    <selectpickr :visible="machineVisible" :slots="machineSlots" :valueKey="machineLable" :title="'设备类型'"  @selectpicker="machineselectpicker" @onpickstatus="machineselectpickertatus"> </selectpickr>

      <!-- 暂无设备类型 -->
  <div class="noMachine-wrap">
      <mt-popup v-model="noMachineVisible" position="bottom" >
        <section class="shoppicker">
          <div class="picker-toolbar">
              <span class="quxi"  @click="noMachineVisible=false">取消</span> 
              <span class="shop">设备类型</span> 
              <span class="qued" @click="noMachineVisible=false">确定</span>
           </div>
          <div class="noMachine-tip">{{noMachineTip}}</div>
        </section>
      </mt-popup>
  </div>

  </div>
</div>
</template>
<script>
import selectpickr from '@/components/selectPicker';
import { shopListFun } from '@/service/report';
import { addOruPdateFun, detailMarketFun, marketlistParentTypeIdFun } from '@/service/market';
import { validatDiscount } from '@/utils/validate';
export default {
  data() {
    return {
      discountStartDate:'',
      discountEndDate:'',
      pickerstartDate: new Date(),
      pickerEndDate: new Date(),

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

      noMachineTip:'',
      machineCurrent:{},
      machineVisible:false,
      machineLable:'parentTypeName',
      machineSlots:[
        {
            flex: 1,
            values: [
            ],
            className: 'slot1',
            textAlign: 'center'
          }
      ],
      noMachineVisible:false,

      weekTitle:[
        {value:'1',label:'周一'},
        {value:'2',label:'周二'},
        {value:'3',label:'周三'},
        {value:'4',label:'周四'},
        {value:'5',label:'周五'},
        {value:'6',label:'周六'},
        {value:'0',label:'周日'}
      ],
      weekVisible:false,
      weeklist:[],
      checkWeeklisttxt:[],
      
      addmarket:{
        time:null,
        startTime:'',
        endTime:'',
        discount:'',
      },
      activeTimeVisible:false,
      activeTimeCurrentTags:null,
      activeTimeslots: [
        {
          flex: 1,
          values: ['00','01', '02', '03', '04', '05', '06','07','08', '09', '10', '11', '12', '13','14','15','16','17','18','19','20','21','22','23'],
          className: 'slot1',
          textAlign: 'right',
          defaultIndex:0,
          value: '00',
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
          defaultIndex:0,
          value: '00',
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
          defaultIndex:23,
          value: '23',
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
          defaultIndex:59,
          value: '59',
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
        let res = await detailMarketFun(payload);
        this.shopListFun(query.id);
        let detail = res? res:{};
        this.addmarket.startTime = detail.noDiscountStart ? moment(detail.noDiscountStart).format('YYYY-MM-DD') : '';
        this.addmarket.endTime = detail.noDiscountEnd ? moment(detail.noDiscountEnd).format('YYYY-MM-DD'): '';
        this.addmarket.time = detail.noTime;
        this.addmarket.discount = detail.discountVO ? Number(detail.discountVO).toFixed(0) : '';
        this.machineCurrent = detail.parentTypeMap&&detail.parentTypeIds?detail.parentTypeMap[0]:{parentTypeId:'',parentTypeName:'全部'};
        let beshop = [];
        detail.shop.forEach(item=>{
          beshop.push(item.name);
          this.shopIds.push(item.id);
        });
        this.checkshoptxt = beshop.join(',');
        this.weeklist = detail.noWeek ?detail.noWeek.split(',') :[];
        this.checkWeeklisttxt = [...this.weeklist];
      
    },
    async shopListFun(timeid){
      let payload = {timeId:timeid};
      let res = await shopListFun(payload);
      this.shoplist = res;
      if (this.shopIds.length <= 0) {
        this.machineCurrent = {};
      }else{
        this.marketlistParentTypeIdFun();
      }
    },
    async marketlistParentTypeIdFun(){
      let payload = {shopIds:this.shopIds.join(',')};
      let res = await marketlistParentTypeIdFun(payload);
      this.machineSlots[0].values = res.length>0 ? [{parentTypeId:'',parentTypeName:'全部'},...res]:[];
    },
    getcheckshop(){
      let checklist = this.shoplist.filter(v=>this.shopIds.some(k=>k==v.shopId));
      this.shopVisible = false;
      this.checkshoptxt = checklist.map(item=>item.shopName).join(',');
      if (this.shopIds.length <= 0) {
        this.machineCurrent = {};
      }else{
        this.marketlistParentTypeIdFun();
        this.machineCurrent = {};
      }
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
      if (data.label !=='自定义') {
        weeklist.push(data.value);
        this.weeklist = weeklist.length >0 ? [...weeklist] : this.weeklist; //如果选了自定义活动日重新赋值
      }else {
        this.weekVisible = true;
        this.weeklist = this.checkWeeklisttxt;
      }
      this.checkWeeklisttxt = [...this.weeklist];
    },
    activeselectpickertatus(data){
      this.activeVisible = data;
    },
    checkeWeekList(){ //选择自定星期
      this.weekVisible = false;
      this.weeklist = this.weeklist.filter(id => Number(id) !== 8&&Number(id) !== 9); //自动活动日去掉每天和周一至周五
      this.checkWeeklisttxt = [...this.weeklist];
    },
    changeTime(picker, values) {
      this.activeTimeCurrentTags = values[0]+':'+values[1]+'-'+ values[2]+':'+values[3];
    },
    confirmNews(picker){
      this.activeTimeVisible = false;
      this.addmarket.time = this.activeTimeCurrentTags;
    },
    chooseDay() {
      // 点击全天直接获取全天并且退出弹框
      this.activeTimeVisible = false;
      this.addmarket.time = '00:00-23:59';
    },
    chooseTime() {
      this.activeTimeVisible = true;
      if(this.addmarket.time){
        this.activeTimeslots[0].defaultIndex = parseInt(this.addmarket.time.slice(0,2));
        this.activeTimeslots[2].defaultIndex = parseInt(this.addmarket.time.slice(3,5));
        this.activeTimeslots[4].defaultIndex = parseInt(this.addmarket.time.slice(6,8));
        this.activeTimeslots[6].defaultIndex = parseInt(this.addmarket.time.slice(9,11));
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
    opencheckedMachine(){
      if (this.shopIds.length <= 0) {
        this.$toast({message: "请先选择店铺" });
        return false;
      }else{
        if(this.machineSlots[0].values.length<=0 && this.shopIds.length>1){
          console.log(this.shopIds);
          this.noMachineTip = '已选店铺下无相同的设备类型';
          this.noMachineVisible = true;
        }else if(this.machineSlots[0].values.length<=0 && this.shopIds.length<=1) {
          console.log(this.shopIds);
          this.noMachineVisible = true;
          this.noMachineTip = '此店铺下暂无设备';
        }else {
          this.machineVisible=true;
        }
      }
    },
    machineselectpicker(value) {
      if (value) {
       this.machineCurrent = value;
      }
    },
    machineselectpickertatus(value) {
      this.machineVisible = value;
    },
    async toaddMaket(){
      if (this.shopIds.length<=0) {
        this.$toast({message: "请选择店铺" });
        return false;
      }
      if (!this.machineCurrent.parentTypeId && this.machineCurrent.parentTypeName !== '全部') {
        this.$toast({message: "请选择设备类型" });
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
      if (!this.addmarket.discount) {
        this.$toast({message: "请填写折扣优惠" });
        return false;
      }
      if (!validatDiscount(this.addmarket.discount)) {
        this.$toast({message: "折扣优惠请输入1-100之间的整数" });
        return false;
      }
      let status = null;
      let parentTypeIds = this.machineCurrent.parentTypeId ? `'${this.machineCurrent.parentTypeId}'` : null;
      let payload = Object.assign({},this.addmarket,{week:this.weeklist.join(','),shopIds:this.shopIds.join(','),timeId:this.$route.query.id,parentTypeIds:parentTypeIds});
      let res = await addOruPdateFun(payload);
      this.$toast({message: '编辑成功' });
      this.$router.go(-2);
    }
  },
  watch: {
    shopVisible: function () {
      if (this.shopVisible) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    },
    activeVisible: function () {
      if (this.activeVisible) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    },
    activeTimeVisible: function () {
      if (this.activeTimeVisible) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    },
    weekVisible: function () {
      if (this.weekVisible) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    }
  },
  components:{
    selectpickr
  },
};
</script>
<style type="text/css" lang="scss" scoped>
   @import '../../assets/scss/marketing/addmaket';
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
