<template>
<div class="addvip" v-title="title">
  <div class="addvip-header">
    <p>所属店铺<span class="order-action add-shop-overflow-icon iconfont icon-nextx" @click="shopVisible = true;"></span><span class="addvip-con add-shop-overflow">{{checkshoptxt?checkshoptxt:''}}</span></p>
  </div>
  
  <form class="addvip-from" ref="vipForm" :model="vipform">
    <div class="add-vip-list-wrap">
      <div class="car-shop">VIP卡类型<span>VIP年卡</span></div>
      <div class="card-wrap">
        <div class="add-card-header"></div>
        <div class="add-card">
          <p>卡售价<span>元</span><input type="number" placeholder="请填写卡售价…" v-model="vipform.yearCardPrice"></p>
          <p>VIP折扣<span>%</span><input type="number" placeholder="请填写折扣数…" v-model="vipform.yearCardDiscount"></p>
          <p>每日限用次数<span>次</span><input type="number" class="num"  v-model="vipform.yearCardLimitTime"></p>
        </div>
        <div class="tips">
          <p>提示：</p>
          <p>1.建议VIP折扣价不超过特惠活动价。</p>
          <p>2.每日限用次数不填写或填写0，则不限制次数。</p>
        </div>
      </div>
    </div>
    <div class="add-vip-list-wrap">
      <div class="car-shop">VIP卡类型<span>VIP半年卡</span></div>
      <div class="card-wrap">
        <div class="add-card-header"></div>
        <div class="add-card">
          <p>卡售价<span>元</span><input type="number" placeholder="请填写卡售价…" v-model="vipform.halfYearCardPrice"></p>
          <p>VIP折扣<span>%</span><input type="number" placeholder="请填写折扣数…" v-model="vipform.halfYearCardDiscount"></p>
          <p>每日限用次数<span>次</span><input type="number" class="num" v-model="vipform.halfYearCardLimitTime"></p>
        </div>
        <div class="tips">
          <p>提示：</p>
          <p>1.建议VIP折扣价不超过特惠活动价。</p>
          <p>2.每日限用次数不填写或填写0，则不限制次数。</p>
        </div>
      </div>
    </div>
    <div class="add-vip-list-wrap">
      <div class="car-shop">VIP卡类型<span>VIP季卡</span></div>
      <div class="card-wrap">
        <div class="add-card-header"></div>
        <div class="add-card">
          <p>卡售价<span>元</span><input type="number" placeholder="请填写卡售价…" v-model="vipform.seasonCardPrice"></p>
          <p>VIP折扣<span>%</span><input type="number" placeholder="请填写折扣数…" v-model="vipform.seasonCardDiscount"></p>
          <p>每日限用次数<span>次</span><input type="number" v-model="vipform.seasonCardLimitTime" class="num"></p>
        </div>
        <div class="tips">
          <p>提示：</p>
          <p>1.建议VIP折扣价不超过特惠活动价。</p>
          <p>2.每日限用次数不填写或填写0，则不限制次数。</p>
        </div>
      </div>
    </div>
  </form>
  
  
  <div class="confirm" @click="addvip">提交</div>
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
import selectpickr from '@/components/selectPicker';
import { vipDetailFun, vipShopsFun, addOrUpdateVipFun} from '@/service/market';
import { validatDiscount, validatCradPrice } from '@/utils/validate';
export default {
  data() {
    return {
      title: '新增VIP',
      shoplist:[],
      shopVisible:false,
      checkshoptxt:'', //显示店铺名字
      shopIds:[],
      vipform:{

      },
     
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
      let payload = Object.assign({},{shopVipId:shopVipId});
      let res = await vipDetailFun(qs.stringify(payload));
      if (res.code ===0) {
        let beshop = [];
        res.data.shopList.forEach(item=>{
          beshop.push(item.shopName);
          this.shopIds.push(item.shopId);
        });
        this.checkshoptxt = beshop.join(',');
        
        this.vipform.yearCardPrice = res.data.yearCardPrice?Number(res.data.yearCardPrice).toFixed(0):'';
        this.vipform.halfYearCardPrice = res.data.halfYearCardPrice?Number(res.data.halfYearCardPrice).toFixed(0) : '';
        this.vipform.seasonCardPrice = res.data.seasonCardPrice?Number(res.data.seasonCardPrice).toFixed(0) : '';

        this.vipform.yearCardDiscount = res.data.yearCardDiscount?res.data.yearCardDiscount *100:'';
        this.vipform.halfYearCardDiscount = res.data.halfYearCardDiscount?res.data.halfYearCardDiscount *100 : '';
        this.vipform.seasonCardDiscount = res.data.seasonCardDiscount?res.data.seasonCardDiscount *100 : '';
        
        this.vipform.yearCardLimitTime = res.data.yearCardLimitTime? res.data.yearCardLimitTime :0;
        this.vipform.halfYearCardLimitTime= res.data.halfYearCardLimitTime? res.data.halfYearCardLimitTime: 0;
        this.vipform.seasonCardLimitTime = res.data.seasonCardLimitTime? res.data.seasonCardLimitTime:0;
        this.vipform.shopVipId  = res.data.shopVipId ? res.data.shopVipId:'';
        this.shopListFun(res.data.shopVipId);
      }
    },
    async shopListFun(id){
      let payload = Object.assign({},{shopVipId:id});
      let res = await vipShopsFun(qs.stringify(payload));
      if (res.code === 0) {
        this.shoplist = res.data;
      }
    },
    getcheckshop(){
      let checklist = this.shoplist.filter(v=>this.shopIds.some(k=>k==v.shopId));
      this.shopVisible = false;
      this.checkshoptxt = checklist.map(item=>item.shopName).join(',');
    },
    async addvip(){
      if (this.shopIds.length <=0 ) {
        this.$toast({message: "请输入选择店铺" });
        return false;
      }
      if ((!this.vipform.yearCardPrice || !this.vipform.yearCardDiscount) && (!this.vipform.halfYearCardPrice || !this.vipform.halfYearCardDiscount)&&(!this.vipform.seasonCardPrice || !this.vipform.seasonCardDiscount)) {
        this.$toast({message: "请至少填写完整一种vip卡信息" });
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
      let paylod = Object.assign({},this.vipform,{shopIds:this.shopIds.join(',')});
      paylod.yearCardDiscount =  paylod.yearCardDiscount? paylod.yearCardDiscount/100:null;
      paylod.halfYearCardDiscount =  paylod.halfYearCardDiscount? paylod.halfYearCardDiscount/100:null;
      paylod.seasonCardDiscount =  paylod.seasonCardDiscount? paylod.seasonCardDiscount/100:null;

      paylod.yearCardLimitTime =  paylod.yearCardLimitTime ?  paylod.yearCardLimitTime:0;
      paylod.halfYearCardLimitTime =  paylod.halfYearCardLimitTime ?  paylod.halfYearCardLimitTime:0;
      paylod.seasonCardLimitTime =  paylod.seasonCardLimitTime ?  paylod.seasonCardLimitTime:0;
      let res = await addOrUpdateVipFun(qs.stringify(paylod));
      if (res.code === 0) {
         this.$toast({message: "修改成功" });
         this.$router.push({name:'marketing'});
      }
    }
  },
  components:{
    selectpickr
  },
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
  }
  .card-wrap {
    padding:0.4rem;
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
        line-height: 1.47rem;
        text-align: right;
        float: right;
        margin-right: 0.16rem;
      }
      span {
        float: right;
      }
      .num {
        color: #1890FF;
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
  .addvip-from {
    margin-bottom: 1.8rem;
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
