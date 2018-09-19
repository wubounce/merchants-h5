<template>
<div class="marketing page-loadmore-height">
  <div class="permissions" v-if="$store.getters.has('mer:marketing:list')">暂无相关页面权限</div>
  <div class="page-loadmore-height" v-else>
    <div class="no-discount-list" v-if="noList">未设置限时优惠活动</div>
    <div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}">
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" @translate-change="translateChange" :auto-fill="false" ref="loadmore">
    		<div class="discoun-list" v-for="(item,index) in list" :key="index">
              <span class="discountag" v-if="item.status === 2"><img src="../../../static/image/market/overdue@2x.png"></span>
              <span class="discountag" v-if="item.status === 1"><img src="../../../static/image/market/makretStop@2x.png"></span>
              <p class="time">优惠期<span :class="{'stop-discount':item.status === 1 || item.status === 2 }">{{item.noDiscountStart}}</span>至<span :class="{'stop-discount':item.status === 1|| item.status === 2}">{{item.noDiscountEnd}}</span>
                <mt-switch  class="check-switch"></mt-switch>
              </p>
              <div class="discoun-content">
                <router-link :to="{name:'detailMarket', query:{id:item.id}}">
                  <div class="dis-con-title">
                    <p class="shop-name">店铺</p>
                    <p :class="['dis-con-shop',{'stop-discount':item.status === 1|| item.status === 2}]"><span class="more-shop" v-for="(items,index) in item.shop" :key="index">{{items.name}}<i v-if="index !== (item.shop.length-1)">,</i></span></p>
                  </div>
                  <div class="dis-con-machine">
                    <div class="machine">
                      <span>类型</span>
                      <span :class="['machine-type', {'stop-discount':item.status === 1|| item.status === 2}]">洗衣机</span>
                    </div>
                    <div class="machine discount">
                      <span>折扣优惠</span>
                      <span :class="['discount-num', {'stop-discount':item.status === 1|| item.status === 2}]">{{item.discountVO?item.discountVO :'0'  | tofixd}}<i>折</i></span>
                    </div>
                  </div>
                </router-link>
              </div>
    		</div>
        <div v-if="allLoaded" class="nomore-data">没有更多了</div>
      </mt-loadmore>
    </div>
    <div class="addmember" @click="goaddMarket" v-has="'mer:marketing:add'">
      <span class="order-action iconfont icon-tianjia"></span><br>
      <span>优惠</span>
    </div>
  </div>
</div>
</template>
<script>
import { timeMarketListFun } from '@/service/market';
import moment from 'moment';
import PagerMixin from '@/mixins/pagerMixin';
export default {
  name:'market-market',
  mixins: [PagerMixin],
  components:{
  },
  data() {
    return {
      list:[],
      noList:false,
    };
  },
  mounted() {
    this.wrapperHeight = document.documentElement.clientHeight-42;
  },
  created(){
  },
  methods: {
    async _getList(){
       let payload = {page:this.page,pageSize: this.pageSize};
      let res = await timeMarketListFun(payload);
      this.list = res.items?[...this.list,...res.items]:[];  //分页添加
      this.list.length <= 0 ? this.noList = true:this.noList = false;
      this.total = res.total;
      res.items.forEach((item)=>{
          item.noDiscountStart = item.noDiscountStart ? moment(item.noDiscountStart).format('YYYY-MM-DD') : '';
          item.noDiscountEnd = item.noDiscountEnd ? moment(item.noDiscountEnd).format('YYYY-MM-DD'): '';
      });
    },
    goaddMarket(){
      this.$router.push({name:'addMarket'});
    }
  },
  filters:{
    tofixd(value){
     return Number(value).toFixed(1);
    }
  }
};
</script>
<style lang="scss" scoped>
  @import '../../assets/scss/marketing/marketing';
</style>
<style>
  .marketing .mint-switch{
    padding: 0.25rem 0;
    float: right;
  }
  .marketing .mint-switch-input:checked + .mint-switch-core {
      border-color: #4DD865;
      background-color: #4DD865;
      width: 1.09rem;
      height: 0.67rem;
  }
  .marketing .mint-switch-core {
    border-color: #E5E5EA;
    background-color: #E5E5EA;
    width: 1.09rem;
    height: 0.67rem;
  }
  .marketing .mint-switch-core::before {
    width: 1.09rem;
    height: 0.67rem;
    background-color: #E5E5EA
  
  }
  .marketing .mint-switch-core::after {
      width: 0.67rem;
      height: 0.67rem;
      top: -1px;
  }
  .marketing .mint-switch-input:checked + .mint-switch-core::after {
      top: -1px;
      left: -5px;
  }
</style>

