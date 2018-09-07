<template>
<div class="addmarket">
  <div class="permissions" v-if="$store.getters.has('mer:marketing:info')">暂无相关页面权限</div>
  <div v-else>
    <div class="addvip-header">
      <p>所属店铺<span class="add-market-shop"><span v-for="(item,index) in detail.shop" :key="index">{{item.name}}<i v-if="index !== (detail.shop.length-1)">,</i></span></span></p>
      
      <p>设备类型<span class="addvip-con" v-for="(item,index) in detail.parentTypeMap" :key="index">{{item.parentTypeName}}</span></p>

      <p>优惠期<span class="addvip-con">{{detail.noDiscountStart}}<span v-if="detail.noDiscountStart&&detail.noDiscountEnd">~</span>{{detail.noDiscountEnd}}</span></p>
      <p>活动日<span class="addvip-con">{{detail.noWeek | week}}</span></p>
      <p>每日活动时段<span class="addvip-con">{{detail.noTime}}</span></p>
      <p>折扣优惠<span class="addvip-con">{{detail.discountVO ? detail.discountVO: '' | tofixd}}%</span></p>
      <p>活动状态<span class="addvip-con">{{detail.status === 0 ? '开放':'暂停'}}</span></p>
    </div>
    <div class="create-wrap">
      <p>创建人：{{detail.createUserName}}</p>
      <p>创建时间： {{detail.createTime}}</p>
    </div>
    <div class="footer">
      <span class="edit" v-has="'mer:marketing:update'"><router-link :to="{name:'editMarket', query:{id:detail.id}}">编辑</router-link></span>
      <span class="del" @click="deldelMarket" v-has="'mer:marketing:delete'">删除</span>
    </div>
  </div>
</div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import moment from 'moment';
import { delMarketFun, detailMarketFun } from '@/service/market';

export default {
  data() {
    return {
      detail:{},
    };
  },
  mounted() {
    
  },
  created(){
    this.getDetail();
  },
  methods: {
    async getDetail(){
      let query = this.$route.query;
      let payload = {timeId:query.id};
      let res = await detailMarketFun(payload);
      this.detail = res;
      this.detail.noDiscountStart = this.detail.noDiscountStart ? moment(this.detail.noDiscountStart).format('YYYY-MM-DD') : '';
      this.detail.noDiscountEnd = this.detail.noDiscountEnd ? moment(this.detail.noDiscountEnd).format('YYYY-MM-DD'): '';
      this.detail.createTime = this.detail.createTime? moment(this.detail.createTime).format('YYYY-MM-DD HH:mm:ss'): '';
      this.detail.noWork = this.detail.noWorkStart&& this.detail.noWorkEnd ? moment(this.detail.noWorkStart).format('YYYY-MM-DD')+'~'+moment(this.detail.noWorkEnd).format('YYYY-MM-DD'):'';
    },
    deldelMarket(id){
      MessageBox.confirm(`确认删除？`,'').then(async () => {
        let query = this.$route.query;
        let payload = {timeId:query.id};
        let res = await delMarketFun(payload);
        this.$toast('删除成功');
        this.$router.push({name:'marketing'});
      });
    }
  },
  components:{
  },
};
</script>
<style type="text/css" lang="scss" scoped>
  @import '../../assets/scss/marketing/detailMaket';
</style>

