<template>
<div class="addvip"  v-title="title">
 <div class="permissions" v-if="$store.getters.has('mer:marketing:info')">暂无相关页面权限</div>
  <div v-else>
    <div class="addvip-header">
      <p>所属店铺<span class="addvip-con" v-for="(items,index) in detail.shopList" :key="index">{{items.shopName}}<i v-if="index !== (detail.shopList.length-1)">,</i></span></p>
    </div>
    <div class="card-wrap" v-for="(vipitem,index) in detail.items">
      <p class="addvip-type"><span>{{vipitem.cardType===1?'VIP年卡':vipitem.cardType===2?'VIP半年卡':'VIP季卡'}}</span></p>
      <div class="add-card-header"></div>
      <div class="add-card">
        <p>卡售价<span>{{vipitem.price}}元</span></p>
        <p>VIP折扣<span>{{vipitem.discount *100}}%</span></p>
        <p>每日限用次数<span>{{vipitem.limitTime}}次</span></p>
      </div>
      <div class="tips">
        <p>提示：</p>
        <p>1.建议VIP折扣价不超过特惠活动价。</p>
        <p>2.每日限用次数不填写或填写0，则不限制次数。</p>
      </div>
    </div>
    <div class="create-wrap">
      <p>创建人：Wendy</p>
      <p>创建时间： 2018-07-15 15:38:05</p>
    </div>
     <div class="footer">
      <span class="edit" v-has="'mer:marketing:vip:update,mer:marketing:vip:info'"><router-link :to="{name:'editVip'}">编辑</router-link></span>
      <span class="del" v-has="'mer:marketing:vip:delete,mer:marketing:vip:info'">删除</span>
    </div>
  </div>
</div>
</template>
<script>
import qs from 'qs';
import { vipDetailFun } from '@/service/market';
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
