<template>
<div class="addvip"  v-title="title">
 <div class="permissions" v-if="$store.getters.has('mer:marketing:info')">暂无相关页面权限</div>
  <div v-else>
    <div class="addvip-header">
      <p>所属店铺<span class="addvip-con">
        <span v-for="(items,index) in detail.shopList" :key="index">{{items.shopName}}<i v-if="index !== (detail.shopList.length-1)">,</i></span>
      </span>
      </p>
    </div>


    <div class="card-wrap">
      <p class="addvip-type"><span>VIP年卡</span></p>
      <div class="add-card-header"></div>
      <div class="add-card">
        <p>卡售价<span>{{detail.yearCardPrice}}元</span></p>
        <p>VIP折扣<span>{{detail.yearCardDiscount *100}}%</span></p>
        <p>每日限用次数<span>{{detail.yearCardLimitTime}}次</span></p>
      </div>
      <div class="tips">
        <p>提示：</p>
        <p>1.建议VIP折扣价不超过特惠活动价。</p>
        <p>2.每日限用次数不填写或填写0，则不限制次数。</p>
      </div>
    </div>
    <div class="card-wrap">
      <p class="addvip-type"><span>VIP半年卡</span></p>
      <div class="add-card-header"></div>
      <div class="add-card">
        <p>卡售价<span>{{detail.halfYearCardPrice}}元</span></p>
        <p>VIP折扣<span>{{detail.halfYearCardDiscount *100}}%</span></p>
        <p>每日限用次数<span>{{detail.halfYearCardLimitTime}}次</span></p>
      </div>
      <div class="tips">
        <p>提示：</p>
        <p>1.建议VIP折扣价不超过特惠活动价。</p>
        <p>2.每日限用次数不填写或填写0，则不限制次数。</p>
      </div>
    </div>
    <div class="card-wrap">
      <p class="addvip-type"><span>VIP季卡卡</span></p>
      <div class="add-card-header"></div>
      <div class="add-card">
        <p>卡售价<span>{{detail.seasonCardPrice}}元</span></p>
        <p>VIP折扣<span>{{detail.seasonCardDiscount *100}}%</span></p>
        <p>每日限用次数<span>{{detail.seasonCardLimitTime}}次</span></p>
      </div>
      <div class="tips">
        <p>提示：</p>
        <p>1.建议VIP折扣价不超过特惠活动价。</p>
        <p>2.每日限用次数不填写或填写0，则不限制次数。</p>
      </div>
    </div>


    <div class="create-wrap">
      <p>创建人：{{detail.createUserName}}</p>
      <p>创建时间： {{detail.createTime}}</p>
    </div>
     <div class="footer"><!-- v-has="'mer:marketing:vip:delete,mer:marketing:vip:info'" -->
      <span class="edit" v-has="'mer:marketing:vip:update,mer:marketing:vip:info'"><router-link :to="{name:'editVip',query:{shopVipId:detail.shopVipId}}">编辑</router-link></span>
      <span class="del" @click="delShopVip">删除</span>
    </div>
  </div>
</div>
</template>
<script>
import qs from 'qs';
import { MessageBox } from 'mint-ui';
import { vipDetailFun, delVipFun } from '@/service/market';
export default {
  data() {
    return {
      title: 'VIP详情',
      detail:{}
    };
  },
  mounted() {
    
  },
  created(){
    let shopVipId = this.$route.query ? this.$route.query.shopVipId:'';
    this.getDetail(shopVipId);
  },
  methods: {
    async getDetail(shopVipId){
      let payload = Object.assign({},{shopVipId:shopVipId});
      let res = await vipDetailFun(qs.stringify(payload));
      if (res.code ===0) {
        this.detail = res.data;
      }
    },
    async delShopVip(){
      MessageBox.confirm(`确定删除？`).then(async () => {
          let payload = {shopVipId:this.detail.shopVipId};
          let res = await delVipFun(qs.stringify(payload));
          if (res.code === 0) {
            this.$toast({message: '删除成功'});
            this.$router.push({name:'marketing'});
          } else {
            this.$toast({message: res.msg });
          }
      });
    }
  },
  components:{
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
      color: #999;
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
        color: #999;
      }
      span {
        float: right;
        color: #333;
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
  .addvip-type {
    font-size: 14px;
    padding-bottom: 0.4rem;
  }
  .create-wrap {
    padding: 0 0.4rem;
    background: #fff;
    font-size:12px;
    color:#999;
    margin-bottom: 1.8rem;
    p {
      line-height:0.77rem;
    }
  }
  .footer {
    width: 100%;
    background: #fff;
    position: fixed;
    bottom: 0;
    font-size: 14px;
    padding: 0.28rem 0;
    > span {
      float: right;
      width: 2.4rem;
      height: 0.8rem;
      line-height: 0.8rem;
      border-radius: 0.11rem;
      text-align: center;
      margin-right: 0.4rem;
    }
    .del {
      border: 1px solid rgba(216,216,216,1);
    }
    .edit {
      border: 1px solid  #1890FF;
      a {
        color: #1890FF;
      }
    }
  }
</style>
