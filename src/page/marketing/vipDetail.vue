<template>
<div class="addvip">
 <div class="permissions" v-if="$store.getters.has('mer:marketing:vip:info')">暂无相关页面权限</div>
  <div v-else>
    <div class="addvip-header">
      <p>所属店铺<span class="addvip-con"><span v-for="(items,index) in detail.shopList" :key="index">{{items.shopName}}<i v-if="index !== (detail.shopList.length-1)">,</i></span></span></p>
      <p>卡折扣<span class="addvip-con">8.5折</span></p>
      <p>每日限用次数<span class="addvip-con">8.5次</span></p>
    </div>
    <div class="card-wrap">
      <p class="addvip-type"><span>销售方式</span></p>
    </div>
     <div class="addvip-header">
      <p>3个月<span class="addvip-con">30元</span></p>
      <p>6个月<span class="addvip-con">30元</span></p>
      <p>12个月<span class="addvip-con">30元</span></p>
    </div>
    <div class="create-wrap">
      <p>创建人：{{detail.createUserName}}</p>
      <p>创建时间： {{detail.createTime}}</p>
    </div>
     <div class="footer">
      <span class="edit" v-has="'mer:marketing:vip:update'"><router-link :to="{name:'editVip',query:{shopVipId:detail.shopVipId}}">编辑</router-link></span>
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
      let res = await vipDetailFun(payload);
      this.detail = res;
    },
    async delShopVip(){
      MessageBox.confirm(`确定删除？`,'').then(async () => {
        let payload = {shopVipId:this.detail.shopVipId};
        let res = await delVipFun(payload);
        this.$toast({message: '删除成功'});
        this.$router.go(-1);
      });
    }
  },
  components:{
  }
};
</script>
<style type="text/css" lang="scss" scoped>
@import '../../assets/scss/marketing/detailvip';
</style>
