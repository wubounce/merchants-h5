<template>
<div class="marketing page-loadmore-height">
  <div class="permissions" v-if="$store.getters.has('mer:marketing:list')">暂无相关页面权限</div>
  <div class="page-loadmore-height" v-else>
    <div class="no-discount-list" v-if="noList">未设置限时优惠活动</div>
    <div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}">
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" @translate-change="translateChange" :auto-fill="false" ref="loadmore">
    		<div class="discoun-list" v-for="(item,index) in list" :key="index">
          <router-link :to="{name:'detailMarket', query:{id:item.id}}">
              <span class="discountag" v-if="item.status === 2"><img src="../../../static/image/market/overdue@2x.png"></span>
              <span class="discountag" v-if="item.status === 1"><img src="../../../static/image/market/makretStop@2x.png"></span>
              <p class="time">优惠期<span :class="{'stop-discount':item.status === 1 || item.status === 2 }">{{item.noDiscountStart}}</span>至<span :class="{'stop-discount':item.status === 1|| item.status === 2}">{{item.noDiscountEnd}}</span></p>
              <div class="discoun-content">
                <div class="dis-con-title">
                  <p>店铺</p>
                  <p :class="['dis-con-shop','overflow-shop', {'stop-discount':item.status === 1|| item.status === 2}]"><span class="more-shop" v-for="(items,index) in item.shop" :key="index">{{items.name}}<i v-if="index !== (item.shop.length-1)">,</i></span></p>
                </div>
                <div class="dis-con-title">
                  <p>折扣优惠</p>
                  <p :class="['dis-con-shop', {'stop-discount':item.status === 1|| item.status === 2}]">{{item.discountVO?item.discountVO :'0'  | tofixd}}<span>折</span></p>
                </div>
              </div>
            </router-link>
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
import qs from 'qs';
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
      let res = await timeMarketListFun(qs.stringify(payload));
      if (res.code === 0) {
        this.list = res.data.items?[...this.list,...res.data.items]:[];  //分页添加
        this.list.length <= 0 ? this.noList = true:this.noList = false;
        this.total = res.data.total;
        res.data.items.forEach((item)=>{
            item.noDiscountStart = item.noDiscountStart ? moment(item.noDiscountStart).format('YYYY-MM-DD') : '';
            item.noDiscountEnd = item.noDiscountEnd ? moment(item.noDiscountEnd).format('YYYY-MM-DD'): '';
        });
      }
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
<style type="text/css" lang="scss" scoped>
  .discoun-list {
    margin-top: 0.29rem;
    padding:0.29rem 0.4rem 0;
    background: #fff;
    position: relative;
    .discountag {
      width: 1.25rem;
      height: 1.25rem;
      position: absolute;
      top: 0;
      right: 0;
      img {
        display: block;
        width: 100%;
      }
     
    }
    .time {
      color: #999999;
      font-size: 14px;
      height: 1.17rem;
      line-height: 1.17rem;
      border-bottom:1px solid rgba(223,230,255,1);
      span {
        font-size: 16px;
        color: #1890FF;
        padding: 0 0.27rem;
      }
    }
    .stop-discount {
      color:#999 !important;
    }
  }
  .discoun-content {
    display: flex;
    text-align: center;
    padding: 0.55rem 0;
    .dis-con-title {
      flex: 1;
      width: 50%;
      color: #999999;
      font-size: 14px;
    }
    .dis-con-title:first-child {
      border-right:  1px solid rgba(223,230,255,1);
    }

    .dis-con-shop {
      font-size: 16px;
      color: #1890FF;
      .more-shop {
        font-size: 16px;
      }
      span {
        font-size: 12px;
      }

    }
    .overflow-shop {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .addmember {
    width:1.49rem;
    height:1.49rem;
    background:#1890FF;
    border-radius: 50%;
    font-size:12px;
    font-family:PingFangSC-Regular;
    color:rgba(255,255,255,1);
    text-align: center;
    -moz-box-shadow:0px 0.03rem 0.4rem rgba(24,144,255,0.75); 
    -webkit-box-shadow:0px 0.03rem 0.4rem rgba(24,144,255,0.75);
    box-shadow: 0px 0.03rem 0.4rem rgba(24,144,255,0.75);
    position: fixed;
    bottom:0.55rem;
    right: 0.64rem;
    z-index: 999;
    .order-action {
      display: inline-block;
      margin-top: 0.2rem;
      font-size: 16px;
      color: #fff;
    }
  }
  .no-discount-list {
    font-size: 14px;
    color: #999;
    text-align: center;
    padding-top: 4rem;
  }
</style>
