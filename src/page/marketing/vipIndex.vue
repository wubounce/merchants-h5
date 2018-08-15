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
import qs from 'qs';
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
      let res = await vipListFun(qs.stringify(payload));
      if (res.code === 0) {
        this.list = res.data.items?[...this.list,...res.data.items]:[];  //分页添加
        this.list.length <= 0 ? this.noList = true:this.noList = false;
        this.total = res.data.total;
      } 
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
  .car-shop {
    font-size: 14px;
    color: #999;
    padding: .29rem .44rem .29rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    span {
      color: #333;
      margin-left: 0.27rem;
    }
  }
  .card-banner{
    padding-top: 0.4rem;
    width: 100%;
    white-space: nowrap;
    .swiper-slide {
        width: 6.93rem;
        .card{  
            transform: scale(.84);           
            -webkit-transform: scale(.84);            
            height: 100%;
            background-size: cover;
            border-radius: .2rem;
            padding: 0.48rem 0 0.48rem 0.8rem;     
            color:#393537;                
            &.year-card{
                background-image: url(../../../static/image/vip/create_year2x.png);
                box-shadow:0px 0.08rem 0.27rem -0.03rem rgba(245,218,169,1);
                border-radius:0.27rem;
            }   
            &.halfYear-card{
                background-image: url(../../../static/image/vip/create_half_year2x.png);
                box-shadow:0px 0.08rem 0.27rem -0.03rem rgba(245,218,169,1);
                border-radius:0.27rem;
            } 
            &.season-card{
                background-image: url(../../../static/image/vip/create_season2x.png);
                box-shadow:0px 0.08rem 0.27rem -0.03rem rgba(245,218,169,1);
                border-radius:0.27rem;
            }
            .vip-type{
                font-size: 14px;
                color: #393537;
            }
            .price{
                line-height: 1.4rem;
                font-weight: 600;
                font-size: 50px;
                margin-bottom: .2rem;
                span{
                    font-weight: normal;
                    font-size: 16px;
                }
            }
            .usenum {
              font-size:14px;
              color: #39342F;
            }
            .tag{
                transform: rotate(45deg); 
                position: absolute;
                text-align: center;
                line-height: .88rem;
                top: 0.01rem;
                right: 0.04rem;
                color: #FFE199;
                font-size: 16px;
                span{
                  font-size: 12px;
                }     
            } 
        }  
        &.swiper-slide-active{
            .card{
                transform: scale(1);           
                -webkit-transform: scale(1);
            }
            
        }         
    }  
    .swiper-pagination{
        position: static;
        margin-top: .2rem;
    } 
    .swiper-container{
      overflow: auto;
    }
    .swiper-wrapper a{
      display: block;
      height: 100%;
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
