<template>
<div class="addvip">
 <div class="permissions" v-if="!$store.getters.has('mer:marketing:vip:info')">暂无相关页面权限</div>
  <div v-if="$store.getters.has('mer:marketing:vip:info')">
    <div class="addvip-header">
      <div class="limitcount-shop">
        <p class="set-shop">
          <span>适用店铺</span>
          <span class="addvip-con" :class="{'remove-space': !isShowMoreShop}"><span>{{shopNames}}</span></span>
          <span @click="toDown" v-if="isShowMoreShop && isShow"><span class="vip-text">全部</span><i class="iconfont icon-xiangxiajiantou"></i></span>
        </p>
        <p @click="toDown" class="to-up" v-if="!isShowMoreShop"><span class="vip-text">收起</span><i class="iconfont icon-xiangshangjiantou"></i></p>
      </div>
      <p class="limitcount-p"><span>卡折扣</span><span class="addvip-con">{{detail.cardDiscount}}折</span></p>
      <p class="limitcount-p" v-if="detail.limitType === 1"><span>每日限用次数</span><span class="addvip-con">{{detail.limitCount}}次</span></p>
      <p class="limitcount-p" v-if="detail.limitType === 2"><span>每周限用次数</span><span class="addvip-con">{{detail.limitCount}}次</span></p>
    </div>
    <div class="card-wrap">
      <p class="addvip-type"><span>销售方式</span></p>
    </div>
     <div class="addvip-header" v-for="(items,index) in detail.saleDescVOList" :key="index">
      <p class="limitcount-p"><span>{{items.timeInterval}}个月</span><span class="addvip-con">{{items.price}}元</span></p>
    </div>
    <div class="create-wrap">
      <p>创建人：{{detail.createUser}}</p>
      <p>创建时间： {{detail.createTime}}</p>
    </div>
     <div class="footer">
      <span class="edit" v-has="'mer:marketing:vip:update'"><router-link :to="{name:'editVip',query:{shopVipId:detail.cardId}}">编辑</router-link></span>
      <span class="del" @click="delShopVip" v-has="'mer:marketing:vip:delete'">删除</span>
    </div>
  </div>
</div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import { vipDetailFun, delVipFun } from '@/service/market';
export default {
  data() {
    return {
      detail:{},
      isShowMoreShop:true,
      isShow:true,
      shopNames: '',
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
      let payload = Object.assign({},{cardId:shopVipId});
      let res = await vipDetailFun(payload);
      this.detail = res;
      this.detail.createTime = this.detail.createTime ? moment(this.detail.createTime).format('YYYY-MM-DD HH:mm:ss') : '';
      this.detail.shopTipVOS.map(item => {
        this.shopNames += item.shopName + '、';
      });
      if(this.shopNames){
        this.shopNames = this.shopNames.substring(0,this.shopNames.length-1);
        if(this.shopNames.length < 15){
          this.isShow = false;
        } else{
          this.isShow = true;
        }
      }
    },
    async delShopVip(){
      MessageBox.confirm(`确定删除？`,'').then(async () => {
        let payload = {cardId:this.detail.cardId};
        let res = await delVipFun(payload);
        this.$toast({message: '删除成功'});
        this.$router.go(-1);
      });
    },
    toDown(){
      this.isShowMoreShop = !this.isShowMoreShop;
    },
  },
  components:{
    
  }
};
</script>
<style type="text/css" lang="scss" scoped>
@import '../../assets/scss/marketing/detailvip';
</style>
