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
import qs from 'qs';
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
      if (res.code === 0) {
        this.shoplist = res.data;
      }
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
      if ((this.vipform.seasonCardPrice && !validatDiscount(this.vipform.seasonCardPrice))) {
        this.$toast({message: "季卡售价请输入1-999之间" });
        return false;
      }

      if ((this.vipform.yearCardDiscount&& !validatCradPrice(this.vipform.yearCardDiscount))) {
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
      let res = await addOrUpdateVipFun(qs.stringify(paylod));
      if (res.code === 0) {
         this.$toast({message: "新增成功" });
         this.$router.push({name:'marketing',query:{tabindex:1}});
      }
    }
  },
  components:{
    selectpickr
  }
};
</script>
<style type="text/css" lang="scss" scoped>
    .addvip {
      padding-bottom: 2rem;
    }
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
  }
  .card-wrap {
    margin:0.4rem;
    position: relative;
    box-shadow:0px 0.03rem 0.17rem 0px rgba(24,144,255,0.1);
    .crrow {
      width: 2.09rem;
      height: 1.16rem;
      position: absolute;
      bottom: 0;
      right: 0;
      background: url('../../../static/image/management/crown@2x.png');
      background-size: contain;
      background-repeat: no-repeat;
      z-index: 2;
    }
    .add-card-header {
      height:0.13rem;
      background:linear-gradient(-90deg,rgba(53,195,255,1),rgba(24,144,255,1));
      border-radius:0.13rem 0.13rem 0px 0px;
    }
    .add-card{
      background: #fff;
      font-size: 16px;
      color: #333;
      padding: 0 0.37rem;
      p {
        height: 1.47rem;
        line-height: 1.47rem;
        border-bottom:1px solid rgba(223,230,255,1);
      }
      input {
        display: inline-block;
        width: 50%;
        height: 1.47rem;
        padding-top: 0.49rem;
        padding-bottom: 0.48rem;
        text-align: right;
        float: right;
        margin-right: 0.16rem;
      }
      span {
        float: right;
      }
      .por-border {
        position: relative;
        z-index: 3;
        border: none;
      }
      .num {
        color: #1890FF;
        background: rgba(0,0,0,0);
      }
    }
    .tips {
      background: #fff;
      padding: 0.49rem 0.37rem 0.35rem 0.37rem;
      border-radius:0 0 0.13rem 0.13rem;
      p {
        font-size: 12px;
        color: #999;
        line-height: 0.53rem;
      }
    }
  }
  .car-shop {
    font-size: 14px;
    color: #999;
    padding-top: 0.4rem;
    padding-left: 0.44rem;
    span {
      color: #333;
      margin-left: 0.27rem;
    }
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
  .order-action {
    color: #ccc;
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
    z-index: 3;
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
