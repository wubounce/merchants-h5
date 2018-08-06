 <template>
<div class="marketing" v-title="title">
  <section class="tab-title">
  	<div v-for="(item,index) in tabtitle" @click="tabclick(index)"><span :class="{tabcurrent:tabindex === index}" >{{item}}</span></div>
  </section>
  <section class="tab-contont">

  	<div class="discount-wrap" v-if="tabindex === 0">
      <div class="permissions" v-if="$store.getters.has('mer:marketing:list')">暂无相关页面权限</div>
      <div v-else>
        <div class="no-discount-list" v-if="timeMarket.length<=0">未设置限时优惠活动</div>
    		<div class="discoun-list" v-for="(item,index) in timeMarket" :key="index">
          <router-link :to="{name:'detailMarket', query:{id:item.id}}">
            <span class="discountag" v-if="item.status === 1"><img src="../../../static/image/market/makretStop@2x.png"></span>
              <p class="time">优惠期<span :class="{'stop-discount':item.status === 1}">{{item.noDiscountStart}}</span>至<span :class="{'stop-discount':item.status === 1}">{{item.noDiscountEnd}}</span></p>
              <div class="discoun-content">
                <div class="dis-con-title">
                  <p>店铺</p>
                  <p :class="['dis-con-shop', {'stop-discount':item.status === 1}]"><span class="more-shop" v-for="(items,index) in item.shop" :key="index">{{items.name}}</span></p>
                </div>
                <div class="dis-con-title">
                  <p>折扣优惠</p>
                  <p :class="['dis-con-shop', {'stop-discount':item.status === 1}]">{{item.discountVO?item.discountVO:'0'}}<span>折</span></p>
                </div>
              </div>
            </router-link>
    		</div>
        <div class="addmember" @click="goaddMarket" v-has="'mer:marketing:add'">
          <span class="order-action iconfont icon-tianjia"></span><br>
          <span>优惠</span>
        </div>
      </div>
  	</div>

  	<div class="VIP-wrap"  v-if="tabindex === 1">
     <div class="permissions" v-if="$store.getters.has('mer:marketing:vip:list')">暂无相关页面权限</div>
      <div v-else>
        <div class="no-discount-list" v-if="vipListData.length<=0">未设置店铺VIP卡</div>
        <div v-else> 
          <div class="vip-list-wrap" v-for="(item,index) in vipListData" :key="index">
              <div class="car-shop">所属店铺<span v-for="(items,index) in item.shopList" :key="index">{{items.shopName}}<i v-if="index !== (item.shopList.length-1)">,</i></span></div>
              <div class="card-banner">       
                <swiper :options="swiperOption"  ref="mySwiper">
                  <swiper-slide>
                     <router-link :to="{name:'vipDetail',query:{shopVipId:item.shopVipId}}">
                      <div class="card year-card">   
                        <p class="vip-type">VIP年卡</p>            
                        <p class="price" v-if="item.yearCardPrice">{{item.yearCardPrice}}<span>元</span></p>
                        <p class="price" v-else><span>未设置</span></p>
                        <p class="usenum">每日仅限使用{{item.yearCardLimitTime}}次</p>       
                        <p class="tag">{{item.yearCardDiscount | replace}}<span>折</span></p> 
                      </div>
                     </router-link>                     
                  </swiper-slide>  
                  <swiper-slide>
                     <router-link :to="{name:'vipDetail',query:{shopVipId:item.shopVipId}}">
                      <div class="card halfYear-card">   
                        <p class="vip-type">VIP半年卡</p>            
                        <p class="price" v-if="item.halfYearCardPrice">{{item.halfYearCardPrice}}<span>元</span></p>
                        <p class="price" v-else><span>未设置</span></p>
                        <p class="usenum">每日仅限使用{{item.halfYearCardLimitTime}}次</p>       
                        <p class="tag">{{item.halfYearCardDiscount | replace}}<span>折</span></p> 
                      </div>
                     </router-link>                     
                  </swiper-slide>  
                  <swiper-slide>
                     <router-link :to="{name:'vipDetail',query:{shopVipId:item.shopVipId}}">
                      <div class="card season-card">   
                        <p class="vip-type">VIP年卡</p>            
                        <p class="price" v-if="item.seasonCardPrice">{{item.seasonCardPrice}}<span>元</span></p>
                        <p class="price" v-else><span>未设置</span></p>
                        <p class="usenum">每日仅限使用{{item.seasonCardLimitTime}}次</p>       
                        <p class="tag">{{item.seasonCardDiscount | replace}}<span>折</span></p> 
                      </div>
                     </router-link>                     
                  </swiper-slide>  
                </swiper>        
              </div> 
            </router-link>
          </div>
        </div> 
        <div class="addmember" @click="goaddvip" v-has="'mer:marketing:vip:add'">
          <span class="order-action iconfont icon-tianjia"></span><br>
          <span>vip卡</span>
        </div>
      </div>
  	</div>
  </section>
</div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';  
import { timeMarketListFun, vipListFun } from '@/service/market';
import moment from 'moment';
export default {
  components:{
    swiper,
    swiperSlide
  },
  data() {
    return {
      title: '营销管理',
      tabtitle:['显示优惠','VIP'],
      tabindex:0,
      timeMarket:[],
      vipListData:[],
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
    this.timeMarketList();
    this.vipList();
  },
  methods: {
    tabclick(index){
    	this.tabindex = index;
    },
    async timeMarketList(){
      let res = await timeMarketListFun();
      if (res.code === 0) {
        this.timeMarket = res.data.items;
        res.data.items.forEach((item)=>{
            item.noDiscountStart = item.noDiscountStart ? moment(item.noDiscountStart).format('YYYY-MM-DD') : '';
            item.noDiscountEnd = item.noDiscountEnd ? moment(item.noDiscountEnd).format('YYYY-MM-DD'): '';
        });
      }
    },
    async vipList(){
      let res = await vipListFun();
      if (res.code === 0) {
        this.vipListData = res.data;
      } 
    },
    goaddMarket(){
      this.$router.push({name:'addMarket'});
    },
    goaddvip(){
      this.$router.push({name:'addvip'});
    }
  },
  filters:{
    replace(value){
      return value*10;
    }
  }
};
</script>
<style type="text/css" lang="scss" scoped>
  .tab-title {
    background: #fff;
    width: 100%;
    height: 1.33rem;
    line-height: 1.33rem;
    font-size: 16px;
    color: #333333;
    text-align: center;
    display: flex;
    >div {
      flex: 1;
    }
    .tabcurrent{
      color:#1890FF;
      border-bottom: 0.08rem solid #1890FF;
      border-radius:0.04rem;
      display: inline-block;
    }
    .discoun-list {
      background: #fff;
      margin-top: 0.27rem;
    }

  }

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
  }
  .car-shop {
    font-size: 14px;
    color: #999;
    line-height: 1.72rem;
    padding-left: 0.44rem;
    span {
      color: #333;
      margin-left: 0.27rem;
    }
  }
  .card-banner{
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
                width: .88rem;
                height: .88rem;
                text-align: center;
                line-height: .88rem;
                top: 0;
                right: 0;
                color: #FFE199;
                font-size: 18px;
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
