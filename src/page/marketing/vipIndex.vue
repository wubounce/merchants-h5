 <template>
<div class="marketing page-loadmore-height">
  <div class="permissions" v-if="$store.getters.has('mer:marketing:vip:list')">暂无相关页面权限</div>
      <div class="page-loadmore-height" v-else>
        <div class="no-discount-list" v-if="noList">未设置店铺VIP卡</div>
        <div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}">
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"  @translate-change="translateChange" :auto-fill="false" ref="loadmore">
              <div class="vip-list-wrap" v-for="(item,index) in list" :key="index">
                  <div class="card-banner">       
                    <swiper :options="swiperOption"  ref="mySwiper">
                      <swiper-slide>
                         <router-link :to="{name:'vipDetail',query:{shopVipId:item.shopVipId}}">
                          <div class="card year-card">   
                            <p class="vip-type">VIP年卡</p>            
                            <p class="price" v-if="item.yearCardPrice">{{item.yearCardPrice | tofixd}}<span>元</span></p>
                            <p class="price" v-else><span>未设置</span></p>
                            <p class="usenum">{{item.yearCardLimitTime === null ?'':item.yearCardLimitTime===0?'每日使用次数无限制':`每日仅限使用${item.yearCardLimitTime}次`}}</p>
                            <p class="tag" v-if="item.yearCardDiscount">{{item.yearCardDiscount}}<span>折</span></p> 
                          </div>
                         </router-link>                     
                      </swiper-slide>  
                      <swiper-slide>
                         <router-link :to="{name:'vipDetail',query:{shopVipId:item.shopVipId}}">
                          <div class="card halfYear-card">   
                            <p class="vip-type">VIP半年卡</p>            
                            <p class="price" v-if="item.halfYearCardPrice">{{item.halfYearCardPrice | tofixd}}<span>元</span></p>
                            <p class="price" v-else><span>未设置</span></p>
                            <p class="usenum">{{item.halfYearCardLimitTime === null ?'':item.halfYearCardLimitTime===0?'每日使用次数无限制':`每日仅限使用${item.halfYearCardLimitTime}次`}}</p>
                            <p class="tag"  v-if="item.halfYearCardDiscount">{{item.halfYearCardDiscount}}<span>折</span></p> 
                          </div>
                         </router-link>                     
                      </swiper-slide>  
                      <swiper-slide>
                         <router-link :to="{name:'vipDetail',query:{shopVipId:item.shopVipId}}">
                          <div class="card season-card">   
                            <p class="vip-type">VIP季卡</p>            
                            <p class="price" v-if="item.seasonCardPrice">{{item.seasonCardPrice  | tofixd}}<span>元</span></p>
                            <p class="price" v-else><span>未设置</span></p>
                            <p class="usenum">{{item.seasonCardLimitTime === null ?'':item.seasonCardLimitTime===0?'每日使用次数无限制':`每日仅限使用${item.seasonCardLimitTime}次`}}</p>
                            <p class="tag"  v-if="item.seasonCardDiscount">{{item.seasonCardDiscount}}<span>折</span></p> 
                          </div>
                         </router-link>                     
                      </swiper-slide>  
                    </swiper>        
                  </div> 
                  <div class="car-shop">所属店铺<span v-for="(items,index) in item.shopList" :key="index">{{items.shopName}}<i v-if="index !== (item.shopList.length-1)">,</i></span></div>
              </div>
              <div v-if="allLoaded" class="nomore-data">没有更多了</div>
          </mt-loadmore>
        </div> 
        <div class="addmember" @click="goaddvip" v-has="'mer:marketing:vip:add'">
          <span class="order-action iconfont icon-tianjia"></span><br>
          <span>vip卡</span>
        </div>
      </div>
</div>

</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';  
import { vipListFun } from '@/service/market';
import moment from 'moment';
import PagerMixin from '@/mixins/pagerMixin';
export default {
  name:'market-vip',
  mixins: [PagerMixin],
  components:{
    swiper,
    swiperSlide
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
        on:{
          // slideChangeTransitionEnd:()=>{
          //     this.typeListId = this.swiper.activeIndex;
          // } 
        },                
      },
    };
  },
  mounted() {
    
  },
  created(){
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
  filters:{
    replace(value){
     return parseFloat(value*10).toString().length >= 2? parseFloat(value*10).toFixed(1):parseFloat(value*10);
    },
    tofixd(value){
     return Number(value).toFixed(0);
    }
  }
};
</script>
<style type="text/css" lang="scss" scoped>
  @import '../../assets/scss/marketing/vip';
</style>
