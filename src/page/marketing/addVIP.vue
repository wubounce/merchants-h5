<template>
<div class="addvip">
  <div class="addvip-header">
    <p  @click="shopVisible = true;" style="cursor: pointer;">所属店铺<span class="order-action add-shop-overflow-icon iconfont icon-nextx"></span><span class="addvip-con add-shop-overflow">{{checkshoptxt?checkshoptxt:''}}</span></p>
    <p>卡折扣<span class="tag">元</span><input type="number" v-model="vipform.yearCardPrice"></p>
    <p>{{yearLimitTypeCurrentTag.label}}<i class="iconfont icon-xiangxiajiantou" @click="yearLimitTypeVisble = true;"></i><span class="tag">次</span><input type="number" pattern="\d*" class="num"  v-model.number="vipform.yearCardLimitTime"></p>
    <div class="tips">
      <p>提示：</p>
      <p>1.用户购买此卡可在所有适用店铺内使用</p>
      <p>2.建议卡折扣不超过限时优惠活动折扣。</p>
      <p>3.每日/每周使用次数不填写或填写0，则不限制次数。</p>
    </div>
  </div>
  <form class="addvip-from" ref="vipForm" :model="vipform">
    <div class="add-vip-list-wrap">
      <div class="car-shop">销售方式</div>
       <div class="addvip-header">
        <p>3个月<span class="tag">元</span><input type="number" v-model="vipform.yearCardPrice"></p>
        <p>6个月<span class="tag">元</span><input type="number" v-model="vipform.yearCardPrice"></p>
        <p>12个月<span class="tag">元</span><input type="number" v-model="vipform.yearCardPrice"></p>
      </div>
    </div>
  </form>
  <div class="confirm" @click="addvip">提交</div>
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

  <!-- 限用类型-->
  <selectpickr :visible="yearLimitTypeVisble" :slots="LimitTypeSlots"  :title="'限用类型'" :valueKey="keyname" @selectpicker="yearLimitSelectpicker" @onpickstatus="yearLimitSelectpickerstatus"></selectpickr>
</div>
</template>
<script>
import selectpickr from '@/components/selectPicker';
import { vipShopsFun, addOrUpdateVipFun} from '@/service/market';
import { validatDiscount, validatCradPrice, validatVipLimit } from '@/utils/validate';
export default {
  data() {
    return {
      shoplist:[],
      shopVisible:false,
      checkshoptxt:'',
      shopIds:[],
       vipform:{},
      LimitTypeSlots:[
        {
          flex: 1,
          values: [
            {label: '每日限用次数',value:1},
            {label: '每周限用次数',value:2}
          ],
          className: 'slot1',
          textAlign: 'center',
          defaultIndex:0
        }
      ],
      keyname:'label',
      yearLimitTypeVisble:false,
      yearLimitTypeCurrentTag:{},
    };
  },
  mounted() {
    
  },
  created(){
    this.shopListFun();
    this.yearLimitTypeCurrentTag = this.LimitTypeSlots[0].values[0];
    this.halfLimitTypeCurrentTag = this.LimitTypeSlots[0].values[0];
    this.seasonLimitTypeCurrentTag = this.LimitTypeSlots[0].values[0];
  },
  methods: {
    async shopListFun(){
      let res = await vipShopsFun();
      this.shoplist = res;
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
    yearLimitSelectpicker(data){
      this.yearLimitTypeCurrentTag = data;
    },
    yearLimitSelectpickerstatus(data){
      this.yearLimitTypeVisble = data;
    },
    async addvip(){
      if (this.shopIds.length <=0 ) {
        this.$toast({message: "请输入选择店铺" });
        return false;
      }
      if ((this.vipform.yearCardPrice&& !validatCradPrice(this.vipform.yearCardPrice))) {
        this.$toast({message: "年卡售价请输入1-999之间的整数" });
        return false;
      }
      if ((this.vipform.halfYearCardPrice && !validatCradPrice(this.vipform.halfYearCardPrice))) {
        this.$toast({message: "半年卡售价请输入1-999之间的整数" });
        return false;
      }
      if ((this.vipform.seasonCardPrice && !validatCradPrice(this.vipform.seasonCardPrice))) {
        this.$toast({message: "季卡售价请输入1-999之间的整数" });
        return false;
      }

      if ((this.vipform.yearCardDiscount&& !validatDiscount(this.vipform.yearCardDiscount))) {
        this.$toast({message: "年卡折扣优惠请输入1-100之间的整数" });
        return false;
      }
      if ((this.vipform.halfYearCardDiscount && !validatDiscount(this.vipform.halfYearCardDiscount))) {
        this.$toast({message: "半年卡折扣优惠请输入1-100之间的整数" });
        return false;
      }
      if ((this.vipform.seasonCardDiscount && !validatDiscount(this.vipform.seasonCardDiscount))) {
        this.$toast({message: "季卡折扣优惠请输入1-100之间的整数" });
        return false;
      }
      if ((this.vipform.yearCardLimitTime&& !validatVipLimit(this.vipform.yearCardLimitTime))) {
        this.$toast({message: "年卡每日限用次数请输入整数" });
        return false;
      }
      if ((this.vipform.halfYearCardLimitTime && !validatVipLimit(this.vipform.halfYearCardLimitTime))) {
        this.$toast({message: "半年卡每日限用次数请输入整数" });
        return false;
      }
      if ((this.vipform.seasonCardLimitTime && !validatVipLimit(this.vipform.seasonCardLimitTime))) {
        this.$toast({message: "季卡每日限用次数请输入整数" });
        return false;
      }
      let paylod = Object.assign({},this.vipform,{shopIds:this.shopIds.join(',')});
      paylod.yearCardLimitTime =  paylod.yearCardLimitTime ?  paylod.yearCardLimitTime:0;
      paylod.halfYearCardLimitTime =  paylod.halfYearCardLimitTime ?  paylod.halfYearCardLimitTime:0;
      paylod.seasonCardLimitTime =  paylod.seasonCardLimitTime ?  paylod.seasonCardLimitTime:0;
      paylod.yearLimitType = this.yearLimitTypeCurrentTag.value;
      paylod.halfLimitType = this.halfLimitTypeCurrentTag.value;
      paylod.seasonLimitType = this.seasonLimitTypeCurrentTag.value;
      let res = await addOrUpdateVipFun(paylod);
      this.$toast({message: "新增成功" });
      this.$router.go(-1);
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
  },
  components:{
    selectpickr
  }
};
</script>
<style type="text/css" lang="scss" scoped>
@import '../../assets/scss/marketing/addvip';
</style>
<style>
  .addvip .mint-checklist-label {
    padding:0.33rem 0.4rem;
    text-align: center;
  }
  .addvip .mint-checkbox-core {
    vertical-align: top;
    margin-top: -0.04rem;
  }
</style>
