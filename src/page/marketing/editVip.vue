<template>
<div class="addvip"> 
  <div class="addvip-header">
    <p  @click="shopVisible = true;" style="cursor: pointer;">适用店铺<span class="order-action add-shop-overflow-icon iconfont icon-nextx"></span><span class="addvip-con add-shop-overflow">{{checkshoptxt?checkshoptxt:''}}</span></p>
    <p>卡折扣<span class="tag">折</span><input type="number" v-model="vipform.cardDiscount"></p>
    <p>{{yearLimitTypeCurrentTag.label}}<i class="iconfont icon-xiangxiajiantou" @click="yearLimitTypeVisble = true;"></i><span class="tag">次</span><input type="number" pattern="\d*" class="num"  v-model.number="vipform.limitCount"></p>
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
       <div class="addvip-header addvip-price" v-for="(item,index) in vipform.saleDesc" :key="index">
        <p>{{item.timeInterval}}个月<span class="tag">元</span><input type="number" v-model="item.price"></p>
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
        <label v-show="shoplist.length" class="mint-checklist-label" v-for="(item,index) in shoplist" :key="index">
          <span class="mint-checkbox is-right">
            <input type="checkbox" class="mint-checkbox-input" v-model="shopIds" :value="item.shopId"> 
            <span class="mint-checkbox-core"></span>
          </span> 
          <p class="mint-checkbox-label shopname">{{item.shopName}}</p>
        </label>
        <div class="no-shoplist" v-show="!shoplist.length">暂无可选店铺</div>
      </div>
    </section>
  </mt-popup>
  <!-- 限用类型-->
  <selectpickr :visible="yearLimitTypeVisble" :slots="LimitTypeSlots"  :title="'限用类型'" :valueKey="keyname" @selectpicker="yearLimitSelectpicker" @onpickstatus="yearLimitSelectpickerstatus"></selectpickr>
</div>
</template>
<script>
import selectpickr from '@/components/selectPicker';
import { vipDetailFun, vipShopsFun, updateVipFun} from '@/service/market';
import { validatVipDiscount, validatVipPrice, validatVipLimit } from '@/utils/validate';
export default {
  data() {
    return {
      shoplist:[],
      shopVisible:false,
      checkshoptxt:'', //显示店铺名字
      shopIds:[],
      vipform:{

      },
     
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
      halfLimitTypeVisble:false,
      seasonLimitTypeVisble:false,
      yearLimitTypeCurrentTag:{},
      halfLimitTypeCurrentTag:{},
      seasonLimitTypeCurrentTag:{},

    };
  },
  mounted() {
    
  },
  created(){
    let shopVipId = this.$route.query ? this.$route.query.shopVipId : '';
    this.getVipDetail(shopVipId);
  },
  methods: {
    async getVipDetail(shopVipId){
      let payload = Object.assign({},{cardId:shopVipId});
      let res = await vipDetailFun(payload);
      let beshop = [];
      res.shopTipVOS.forEach(item=>{
        beshop.push(item.shopName);
        this.shopIds.push(item.shopId);
      });
      this.checkshoptxt = beshop.join(',');
      this.vipform.cardDiscount = res.cardDiscount ? res.cardDiscount : '';
      this.vipform.limitType = res.limitType ? res.limitType : '';
      this.vipform.limitCount = res.limitCount;
      this.vipform.saleDesc = res.saleDescVOList ? res.saleDescVOList : '';
      this.vipform.cardId  = res.cardId ? res.cardId:'';
      this.yearLimitTypeCurrentTag = this.setLimitPicker(res.limitType||1);
      if(res.limitType === 1){
        this.LimitTypeSlots[0].defaultIndex = 0;
      } else {
        this.LimitTypeSlots[0].defaultIndex = 1;
      }
      this.shopListFun(res.cardId);
    },
    setLimitPicker(value=1){
      let pac = this.LimitTypeSlots[0].values.find(item=>{
        return item.value === value;
      });
      return pac;
    },
    async shopListFun(id){
      let payload = Object.assign({},{shopCardId:id});
      let res = await vipShopsFun(payload);
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
      let flag  = true;
      if (this.shopIds.length <=0 ) {
        this.$toast({message: "请选择适用店铺" });
        flag = false;
        return flag;
      }
      if(!this.vipform.cardDiscount){
        this.$toast({message: "请填写卡折扣" });
        flag = false;
        return flag;
      }else if ((this.vipform.cardDiscount && !validatVipDiscount(this.vipform.cardDiscount))) {
        this.$toast({message: "请填写大于0小于10数字，支持一位小数" });
        flag = false;
        return flag;
      }
      if ((this.vipform.limitCount && !validatVipLimit(this.vipform.limitCount) || parseFloat(this.vipform.limitCount) > 999)) {
        this.$toast({message: "请填写0-999数字" });
        flag = false;
        return flag;
      }
      for(let i = 0; i < this.vipform.saleDesc.length; i++){
        let valid_price = this.vipform.saleDesc[i].price;
        if(!this.vipform.saleDesc[i].price){
          this.$toast({message: "请填写全部销售价格" });
          flag = false;
          return flag;
        } else if(valid_price && !validatVipPrice(valid_price) || parseFloat(valid_price) <= 0 || parseFloat(valid_price) >= 1000){
          this.$toast({message: "请填写大于0小于1000数字，支持两位小数" });
            flag = false;
            return flag;
        }
      }
      if(flag){
        let paylod = Object.assign({},this.vipform,{shopIds:this.shopIds.join(',')});
        paylod.cardId = paylod.cardId ? paylod.cardId : '';
        paylod.saleDesc = JSON.stringify(paylod.saleDesc);
        paylod.cardDiscount =  paylod.cardDiscount ?  paylod.cardDiscount : 0;
        paylod.limitType = this.yearLimitTypeCurrentTag.value;
        paylod.limitCount =  paylod.limitCount ?  paylod.limitCount : 0;
        console.log(paylod);
        let res = await updateVipFun(paylod);
        this.$toast({message: "修改成功" });
        this.$router.go(-2);
      }
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
  },
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