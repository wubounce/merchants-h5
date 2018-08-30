<template>
<div class="addvip" v-title="title">
  <div class="addvip-header">
    <p  @click="shopVisible = true;" style="cursor: pointer;">所属店铺<span class="order-action add-shop-overflow-icon iconfont icon-nextx"></span><span class="addvip-con add-shop-overflow">{{checkshoptxt?checkshoptxt:''}}</span></p>
  </div>
  
  <form class="addvip-from" ref="vipForm" :model="vipform">
    <div class="add-vip-list-wrap">
      <div class="car-shop">VIP卡类型<span>VIP年卡</span></div>
      <div class="card-wrap">
        <div class="add-card-header"></div>
        <div class="add-card">
          <p>卡售价<span>元</span><input type="number" placeholder="请填写卡售价…" v-model="vipform.yearCardPrice"></p>
          <p>VIP折扣<span>%</span><input type="number" placeholder="请填写折扣数…" v-model="vipform.yearCardDiscount"></p>
          <p>每日限用次数<span>次</span><input type="text" class="num"  v-model.number="vipform.yearCardLimitTime"></p>
        </div>
        <div class="tips">
          <p>提示：</p>
          <p>1.建议VIP折扣价不超过特惠活动价。</p>
          <p>2.每日限用次数不填写或填写0，则不限制次数。</p>
        </div>
        <div class="crrow"></div>
      </div>
    </div>
    <div class="add-vip-list-wrap">
      <div class="car-shop">VIP卡类型<span>VIP半年卡</span></div>
      <div class="card-wrap">
        <div class="add-card-header"></div>
        <div class="add-card">
          <p>卡售价<span>元</span><input type="number" placeholder="请填写卡售价…" v-model="vipform.halfYearCardPrice"></p>
          <p>VIP折扣<span>%</span><input type="number" placeholder="请填写折扣数…" v-model="vipform.halfYearCardDiscount"></p>
          <p class="por-border">每日限用次数<span>次</span><input type="text" class="num" v-model.number="vipform.halfYearCardLimitTime"></p>
        </div>
        <div class="crrow"></div>
      </div>
    </div>
    <div class="add-vip-list-wrap">
      <div class="car-shop">VIP卡类型<span>VIP季卡</span></div>
      <div class="card-wrap">
        <div class="add-card-header"></div>
        <div class="add-card">
          <p>卡售价<span>元</span><input type="number" placeholder="请填写卡售价…" v-model="vipform.seasonCardPrice"></p>
          <p>VIP折扣<span>%</span><input type="number" placeholder="请填写折扣数…" v-model="vipform.seasonCardDiscount"></p>
          <p class="por-border">每日限用次数<span>次</span><input type="text" v-model.number="vipform.seasonCardLimitTime" class="num"></p>
        </div>
        <div class="crrow"></div>
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
</div>
</template>
<script>
import selectpickr from '@/components/selectPicker';
import { vipShopsFun, addOrUpdateVipFun} from '@/service/market';
import { validatDiscount, validatCradPrice, validatVipLimit } from '@/utils/validate';
export default {
  data() {
    return {
      title: '新增VIP',
      shoplist:[],
      shopVisible:false,
      checkshoptxt:'',
      shopIds:[],
      vipform:{
        yearCardLimitTime:0,
        halfYearCardLimitTime:0,
        seasonCardLimitTime:0
      },
     
    };
  },
  mounted() {
    
  },
  created(){
    this.shopListFun();

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
    async addvip(){
      if (this.shopIds.length <=0 ) {
        this.$toast({message: "请输入选择店铺" });
        return false;
      }
      if ((!this.vipform.yearCardPrice || !this.vipform.yearCardDiscount) && (!this.vipform.halfYearCardPrice || !this.vipform.halfYearCardDiscount)&&(!this.vipform.seasonCardPrice || !this.vipform.seasonCardDiscount)) {
        this.$toast({message: "请完整填写至少一种vip卡信息" });
        return false;
      }

      if ((this.vipform.yearCardPrice&& !validatCradPrice(this.vipform.yearCardPrice))) {
        this.$toast({message: "年卡售价请输入1-999之间" });
        return false;
      }
      if ((this.vipform.halfYearCardPrice && !validatCradPrice(this.vipform.halfYearCardPrice))) {
        this.$toast({message: "半年卡售价请输入1-999之间" });
        return false;
      }
      if ((this.vipform.seasonCardPrice && !validatCradPrice(this.vipform.seasonCardPrice))) {
        this.$toast({message: "季卡售价请输入1-999之间" });
        return false;
      }

      if ((this.vipform.yearCardDiscount&& !validatDiscount(this.vipform.yearCardDiscount))) {
        this.$toast({message: "年卡折扣优惠请输入1-100之间" });
        return false;
      }
      if ((this.vipform.halfYearCardDiscount && !validatDiscount(this.vipform.halfYearCardDiscount))) {
        this.$toast({message: "半年卡折扣优惠请输入1-100之间" });
        return false;
      }
      if ((this.vipform.seasonCardDiscount && !validatDiscount(this.vipform.seasonCardDiscount))) {
        this.$toast({message: "季卡折扣优惠请输入1-100之间" });
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
      let res = await addOrUpdateVipFun(paylod);
      this.$toast({message: "新增成功" });
      this.$router.push({name:'marketing',query:{tabindex:1}});
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
