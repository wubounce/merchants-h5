<template>
	<section v-title="title">
    <div class="permissions" v-if="$store.getters.has('mer:shop:list')">暂无相关页面权限</div>
    <div v-else>
      <ul v-if="hasNews">
        <div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}" >
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
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
                  <div class="bottom">
                    <div class="kindof">
                      <div class="text">分类</div>
                      <div class="text-value">{{item.shopType}}</div>
                    </div>
                    <div class="kindof">
                      <div class="text">设备</div>
                      <div class="text-value">{{item.machineCount}}<span class="little-font">台</span></div>
                    </div>
                    <div class="kindof">
                      <div class="text">收益</div>
                      <div class="text-value">{{ item.profit }}<span class="little-font">元</span></div>
                    </div>
                  </div>
                  </router-link>
                </li>
            <div v-if="allLoaded" class="nomore-data">没有更多了</div>
          </mt-loadmore>
        </div>
      </ul>
      <p v-else class="noShop">暂无店铺, 可点击右下角进行添加</p>
      <div class="circle" @click="toAddShop" v-has="'mer:shop:add'">
        <div>+</div>
        <div class="iconShop">店铺</div>
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
       title:'店铺管理',
       list:[],
       hasNews: true,
       //分页
       wrapperHeight: 0,//容器高度
       page: 1,//页码
       pageSize:10,
       total:null,
       allLoaded: false,//数据是否加载完毕
       lessTen:true
    };
  },
  methods: {
    moreOrthen() {
      return (this.allLoaded && this.lessTen);
    },
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
      // console.log(res);
      if(res.items == null || res.items == "") {
          this.hasNews = false;
        }
        else {
          this.list = res.items?[...this.list,...res.items]:[];  //分页添加
          //判断是否超过10条
          this.total = res.total;
          if(this.total<10) {
            this.lessTen = false;
          }else {
            this.lessTen = true;
          }
          //格式化收益
          for(let i=0;i<this.list.length; i++) {
            //判断是否为0 
            if(this.list[i].profit) {
              //将number类型的数据转化成string
              this.list[i].profit = this.list[i].profit+'';
              //判断是不是'5'
              if(this.list[i].profit.split('.').length == 1) {
                this.list[i].profit = this.list[i].profit + '.00';
              }
              else {
                //判断是不是'5.0'
                if(this.list[i].profit.split('.')[1].length ==1) {
                  this.list[i].profit = this.list[i].profit + '0';
                }
              }
            }
            else {
              this.list[i].profit = '0.00';
            }
          }
        }
    }
  },
  created() {
  },
  mounted() {
    
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/shop/shopList';
</style>
