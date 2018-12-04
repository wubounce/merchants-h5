<template>
	<section>
    <div class="permissions" v-if="!$store.getters.has('mer:shop:list')">暂无相关页面权限</div>
    <div class="page-loadmore-height" v-if="$store.getters.has('mer:shop:list')">
      <div class="search-header">
        <section class="sarch-wrap">
          <div class="search">
              <form action="" target="frameFile">
                <span class="iconfont icon-IconSearch"></span><input type="text" @click="searchMember"  placeholder="请输入店铺名称" class="serch">
                <iframe name='frameFile' style="display: none;"></iframe>
              </form>
          </div>
        </section>
      </div>
      <div class="page-top" v-if="hasNews">
        <div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}" >
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
            <ul>
              <li class="list" v-for="(item,index) in list" :key="index">
                <router-link :to="{ name: 'shopDetail', query:{shopId:item.shopId}}">
                  <p class="top">
                    <span>{{item.shopName.length>15 ? item.shopName.slice(0,15) + '...' : item.shopName }}</span>
                    <span>
                      <img src="../../../static/image/shop/vip@2x.png" alt="vip" v-if='item.hasVip' style='width: 0.4rem;vertical-align: middle;'>
                      <img src="../../../static/image/shop/discount@2x.png" alt="discount" v-if='item.isDiscount' style='width: 0.4rem;vertical-align: middle;'>
                      <img src="../../../static/image/shop/reserve@2x.png" alt="reserve" v-if='!item.isReserve' style='width: 0.4rem;vertical-align: middle;'>
                    </span>
                  </p>
                </router-link>
                <div class="bottom">
                  <div class="kindof">
                    <router-link :to="{ name: 'shopDetail', query:{shopId:item.shopId}}">
                      <div class="text">分类</div>
                      <div class="text-value">{{item.shopType}}</div>
                    </router-link>
                  </div>
                  <div class="kindof">
                    <router-link :to="{ name: 'shopDetail', query:{shopId:item.shopId}}">
                      <div class="text">设备</div>
                      <div class="text-value">{{item.machineCount}}<span class="little-font">台</span></div>
                    </router-link>
                  </div>
                  <div class="kindof" v-if="$store.getters.has('mer:shop:profit')" >
                    <router-link :to="{ name: 'shopMonthFlow', query:{allMoney:item.profit,shopId:item.shopId,shopName:item.shopName}}">
                      <div class="text">总收益<span class="order-action iconfont icon-nextx"></span></div>
                      <div class="text-value">{{ item.profit | tofixd }}<span class="little-font">元</span></div>
                    </router-link>
                  </div>
                </div>
              </li>
            </ul>
            <div v-if="allLoaded" class="nomore-data">没有更多了</div>
          </mt-loadmore>
        </div>
      </div>
      <p v-else class="noShop">暂无店铺, 可点击右下角进行添加</p>
      <div class="circle" @click="toAddShop" v-has="'mer:shop:add'">
        <span class="order-action iconfont icon-tianjia"></span><br>
        <span>店铺</span>
      </div>
    </div>
	</section>
</template>
<script>
import { MessageBox } from 'mint-ui';
import { manageListFun } from '@/service/shop';
import PagerMixin from '@/mixins/pagerMixin';
export default {
  mixins: [PagerMixin],
  data() {
    return {
       list:[],
       hasNews: true,
       lessTen:true
    };
  },
  created(){
    this._getList();
  },
  methods: {
    toAddShop() {
      this.$router.push({
        name:'addShop'
      });
    },
    async _getList() {
      let payload = {
        page: this.page,
        pageSize: this.pageSize
      };
      let res = await manageListFun(payload);
      this.total = res.total;
      if(res.items == null || res.items == "") {
        this.hasNews = false;
      }
      else {
        this.list = res.items?[...this.list,...res.items]:[];  //分页添加
      }
    },
    async searchMember(e){ //搜索
      this.$router.push({name:'shopSearch'});
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/shop/shopList';
.bottom .kindof:last-child {
  border:none
}
</style>
