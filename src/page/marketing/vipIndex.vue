<template>
  <section class="vip-wrap page-loadmore-height">
    <div class="permissions" v-if="!$store.getters.has('mer:marketing:vip:list')">暂无相关页面权限</div>
    <div class="page-loadmore-height" v-if="$store.getters.has('mer:marketing:vip:list')">
      <div class="heder">
        <span class="sale-card"><router-link :to="{name:'saleRecord'}">售卡记录<span>></span></router-link></span>
        <span class="vip"><router-link :to="{name:'seniorMember'}">会员列表<span>></span></router-link></span>
      </div>
      <div class="no-discount-list" v-if="noList">未设置店铺VIP卡</div>
      <div class="page-top">
        <div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}">
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"  @translate-change="translateChange" :auto-fill="false" ref="loadmore">
              <div class="discoun-list" v-for="(item,index) in list" :key="index">
                <div class="discoun-content">
                  <router-link :to="{name:'vipDetail', query:{shopVipId:item.cardId}}">
                    <div class="dis-con-title">
                      <p class="shop-name">店铺</p>
                      <p class="dis-con-shop"><span v-for="(items,index) in item.shopTipVOS" :key="index">{{items.shopName}}<i v-if="index !== (item.shopTipVOS.length-1)">、</i></span></p>
                      <p><span class="iconfont icon-nextx"></span></p>
                    </div>
                    <div class="dis-con-machine">
                      <div class="machine">
                        <span>折扣优惠</span>
                        <span class="machine-type">{{item.cardDiscount.toFixed(1)}}<i>折</i></span>
                      </div>
                      <div class="machine discount">
                        <span>限用次数</span>
                        <span v-if="item.limitCount > 0" class="discount-num">{{item.limitCount}}次<i v-if="item.limitType === 1">/日</i><i v-if="item.limitType === 2">/周</i></span>
                        <span v-if="item.limitCount === 0" class="discount-num">无限制</span>
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>
              <div v-if="allLoaded" class="nomore-data">没有更多了</div>
          </mt-loadmore>
        </div> 
      </div>
    </div>
    <div class="addmember" @click="goaddvip" v-has="'mer:marketing:vip:add'">
      <span class="order-action iconfont icon-tianjia"></span><br>
      <span>vip卡</span>
    </div>
  </section>
</template>

<script type='text/ecmascript-6'>
import { vipListFun } from '@/service/market';
import PagerMixin from '@/mixins/pagerMixin';
 export default {
  name:'market-vip',
  mixins: [PagerMixin],
  components:{

  },
  data() {
    return {
      list:[],
      noList:false,
      swiperOption: {                
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 0,
        loopAdditionalSlides: 100,
      },
    };
  },
  mounted() {
    
  },
  created(){
    this._getList();
  },
  methods: {
    async _getList(){
      let payload = {page:this.page,pageSize: this.pageSize};
      let res = await vipListFun(payload);
      this.list = res.items?[...this.list,...res.items]:[];  //分页添加
      this.list.length <= 0 ? this.noList = true:this.noList = false;
      this.total = res.total;
    },
    goaddvip(){
      this.$router.push({name:'addvip'});
    }
  },
};
</script>

<style lang='scss' scoped type='text/css'>
  @import '../../assets/scss/marketing/marketing';
  .vip-wrap {
    .machine-type {
      color: #1890FF !important;
      font-size: 18px !important;
    }
    .page-top {
      padding-top: 0.93rem;
      height: 100%;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    .discoun-list:nth-child(2){
      margin:0;
    }
  }
  .heder {
    height: 0.93rem;
    line-height: 0.93rem;
    font-size: 12px;
    color: #1890FF;
    text-align: right;
    position: fixed;
    top: 1.33rem;
    z-index: 2;
    background: #efeff4;
    width: 100%;
    .sale-card {
      margin-right: 0.71rem;
      span {
        margin-left: 0.27rem;
      }
    }
    .vip {
      margin-right: 0.4rem;
       span {
        margin-left: 0.27rem;
      }
    }
    a {
      color: #1890FF;
    }
  }
</style>