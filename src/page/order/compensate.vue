<template>
<div class="addmarket">
  <div class="addvip-header anheader">
    <p><span class="disable-title">发放用户</span><span class="addvip-con add-shop-overflow">{{query.phone}}</span></p>
    <p><span class="disable-title">适用店铺</span><span class="addvip-con add-shop-overflow">{{query.shopName}}</span></p>
  </div>
  <div class="addvip-header">
    <p @click="opencheckedMachine">适用类型<span class="order-action add-shop-overflow-icon iconfont icon-nextx"></span><span class="addvip-con add-shop-overflow">{{machineCurrent.name}}</span></p>
    <p>补偿面额(元)<span class="addvip-con"><input type="number" v-model="couponPirce"  @blur="checkCouponPirce" placeholder="补偿面额(元)" class="discount-input"></span></p>
    <p class="nomore-boder">满减金额(元)<span class="addvip-con"><input type="number" v-model="fullDiscount" @blur="checkFullDiscount" placeholder="满减金额(元)" class="discount-input"></span></p>
    <div class="full-discount">满减{{fullDiscount}}元可用</div>
    <p class="nomore-boder">有效期（天）<span class="addvip-con"><span :class="['suctract','iconfont','icon-jian',{'suctract-current':expiredDate <= 1}]" @click="suctractExpired"></span><span class="conpenates">{{expiredDate}}</span><span @click="addExpired" :class="['suctract','iconfont','icon-jia',{'suctract-current':expiredDate === 999}]"></span></span></p>
    <div class="full-discount">发放日起</div>
    <p>发放数量（张）<span class="addvip-con"><span :class="['suctract','iconfont','icon-jian',{'suctract-current':couponNum <= 1}]" @click="suctractCouponNum"></span><span class="conpenates">{{couponNum}}</span><span @click="addCouponNum" :class="['suctract','iconfont','icon-jia',{'suctract-current':couponNum === 999}]"></span></span></p>
  </div>
   <div class="confirm" @click="confirmcompensate">发放</div>

   <!-- 设备类型 -->
  <selectpickr :visible="machineVisible" :slots="machineSlots" :valueKey="machineLable" :title="'设备类型'"  @selectpicker="machineselectpicker" @onpickstatus="machineselectpickertatus"></selectpickr>
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
  <!-- 展示二次确认框 -->
  <div class="do-grant" v-if="confirmVisible">
    <div class="grantModal">
      <div class="grant-con">
        <p>发放用户：<span>{{query.phone}}</span></p>
        <p>补偿券面额：<span>{{couponPirce}} 元</span></p>
        <p>补偿券数量：<span>{{couponNum}} 张</span></p>
      </div>
      <div class="grant-footer">
        <span class="cancel" @click="confirmVisible=false">取消</span>
        <span class="comfirm" @click="todocompensate">确定</span>
      </div>
    </div>
  </div>

</div>
</template>
<script>
import selectpickr from '@/components/selectPicker';
import { getlistParentTypeFun } from '@/service/device';
import { compensateFun } from '@/service/order';
import { validatPrice } from '@/utils/validate';
export default {
  data() {
    return {
      couponPirce:0,
      fullDiscount:0,
      expiredDate:7,
      couponNum:1,
      confirmVisible:false,
      query:{},

      noMachineTip:'',
      machineCurrent:{},
      machineVisible:false,
      machineLable:'name',
      machineSlots:[
        {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
      ],
      noMachineVisible:false,
    };
  },
  mounted () {
    this.query = this.$route.query ? this.$route.query : {} ;
    this.couponPirce = this.query.markPrice;
    this.fullDiscount = this.query.markPrice;
    this.machinelist();
  },
  created(){
  },
  methods: {
    async machinelist(){
      let payload = {shopId:this.query.shopId};
      let res = await getlistParentTypeFun(payload);
      this.machineSlots[0].values = res.length>0 ? [{id:'',name:'全部'},...res]:[];
      let falg = false;
      let index = null;
      let name = null;
      let current = null;
      this.machineSlots[0].values.every((item,index) => {
        if(item.name === this.query.parentTypeName){
          falg = true;
          index = item.index;
          name = item.name;
          current = item;
          return false;
        }else{
          return true;
        }
      });
      if(falg === true){
        this.machineSlots[0].defaultIndex = index;
        this.machineSlots[0].value = name;
        this.machineCurrent = current;
      }else {
        this.machineSlots[0].defaultIndex = 0;
        this.machineSlots[0].value = '全部';
        this.machineCurrent = {id:'',name:'全部'};
      }
    },
    addExpired(){
      if(this.expiredDate>=999) return false;
      this.expiredDate++;
    },
    suctractExpired(){
      if(this.expiredDate<=1) return false;
      this.expiredDate--;
    },
    addCouponNum(){
      if(this.couponNum>=999) return false;
      this.couponNum++;
    },
    suctractCouponNum(){
      if(this.couponNum<=1) return false;
      this.couponNum--;
    },
    opencheckedMachine(){
      this.machineVisible=true;
    },
    machineselectpicker(value) {
      if (value) {
       this.machineCurrent = value;
      }
    },
    machineselectpickertatus(value) {
      this.machineVisible = value;
    },
    checkCouponPirce(){
      if(!validatPrice(this.couponPirce) || Number(this.couponPirce) === 0){
        this.$toast({message: "补偿面额必须大于0，支持两位小数"});
      }
      if(Number(this.couponPirce) > 99){
        this.$toast({message: "补偿面额输入不能超过99"});
      }
    },
    checkFullDiscount(){
      if(!validatPrice(this.fullDiscount) || Number(this.fullDiscount) === 0){
        this.$toast({message: "满减金额必须大于0，支持两位小数"});
      }
      if(Number(this.fullDiscount) > 99){
        this.$toast({message: "满减金额输入不能超过99"});
      }
      if(Number(this.fullDiscount) !== 0 && Number(this.fullDiscount) < Number(this.couponPirce)){
        this.$toast({message: "满减金额不能小于补偿面额"});
      }
    },
    confirmcompensate(){
      if (!this.machineCurrent.id&&this.machineCurrent.name !== '全部') {
        this.$toast({message: "请选择设备类型" });
        return false;
      }
      if(!validatPrice(this.couponPirce) || Number(this.couponPirce) === 0){
        this.$toast({message: "补偿面额需大于0，支持两位小数"});
        return false;
      }
      if(Number(this.couponPirce) > 99){
        this.$toast({message: "补偿面额输入不能超过99"});
        return false;
      }
      if(!validatPrice(this.fullDiscount) || Number(this.fullDiscount) === 0){
        this.$toast({message: "满减金额必须大于0，支持两位小数"});
         return false;
      }
      if(Number(this.fullDiscount) > 99){
        this.$toast({message: "满减金额输入不能超过99"});
        return false;
      }

      if(Number(this.fullDiscount) < Number(this.couponPirce)){
        this.$toast({message: "满减金额不能小于补偿面额"});
         return false;
      }
      this.confirmVisible = true;
    },
    async todocompensate(){
       let payload = {
        orderNo:this.query.orderno,
        parentTypeId:this.machineCurrent.id,
        compensateMoney:this.couponPirce,
        conditionMoney:this.fullDiscount,
        validDays:this.expiredDate,
        compensateNumber:this.couponNum
      };
      let res = await compensateFun(payload);
      this.$toast({message: '发放成功' });
      this.$router.go(-1);
    }
  },
  components:{
    selectpickr
  }
};
</script>
<style type="text/css" lang="scss" scoped>
    @import '../../assets/scss/marketing/addmaket';
    .anheader {
      margin-bottom: 0.27rem;
      .disable-title {
        color: #999;
      }
    }
   .full-discount {
        height: 0.8rem;
        line-height: 0.8rem;
        color: #999;
        text-align: right;
        font-size: 12px;
        display: inline-block;
        width: 100%;
        border-bottom: 1px solid #f9f8ff;
   }
   .conpenates {
       padding:0 0.41rem;
   }
   .suctract {
      color: #1890ff;
      font-size: 18px;
      width: 0.51rem;
   }
   .suctract-current {
      color:#D6D6D6;
   }
   .nomore-boder {
       border: none !important;
   }
   .do-grant {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    .grantModal {
      width:7.25rem;
      background:#fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      border-radius:0.13rem;
    }
    .grant-con {
      padding:1.17rem 0 0.45rem 1.08rem;
      p {
        line-height: 0.53rem;
        font-size: 14px;
        color: #999;
        padding-bottom: 0.27rem;
        span {
          color: #333;
        }
      }
    }
    .grant-footer {
      display: flex;
      height: 1.21rem;
      line-height: 1.21rem;
      border-top: 1px solid #ddd;
      span {
        display: block;
        text-align: center;
        width: 50%;
        font-size: 16px;
      }
      .cancel {
        border-right: 1px solid #ddd;
      }
      .comfirm {
        color: #1890ff;
      }
    }
   }
</style>
