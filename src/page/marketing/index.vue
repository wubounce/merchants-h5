<template>
<div class="marketing">
  <q-header :title="title"></q-header>
  <section class="tab-title">
  	<div v-for="(item,index) in tabtitle" @click="tabclick(index)"><span :class="{tabcurrent:tabindex === index}" >{{item}}</span></div>
  </section>
  <section class="tab-contont">
  	<div class="discount-wrap" v-if="tabindex === 0">
      <div class="no-discount-list" v-if="timeMarket.lenght<=0">未设置限时优惠活动</div>
  		<div class="discoun-list" v-for="(item,index) in timeMarket" :key="index">
        <router-link :to="{name:'detailMarket', query:{id:item.id}}">
          <span class="discountag" v-if="item.status === 1"><img src="../../../static/image/market/makretStop@2x.png"></span>
            <p class="time">优惠期<span :class="{'stop-discount':item.status === 1}">{{item.noDiscountStart}}</span>至<span :class="{'stop-discount':item.status === 1}">{{item.noDiscountEnd}}</span></p>
            <div class="discoun-content">
              <div class="dis-con-title">
                <p>店铺</p>
                <p :class="['dis-con-shop', {'stop-discount':item.status === 1}]">{{item.shop[0].name}}</p>
              </div>
              <div class="dis-con-title">
                <p>折扣优惠</p>
                <p :class="['dis-con-shop', {'stop-discount':item.status === 1}]">{{item.discountVO}}<span>折</span></p>
              </div>
            </div>
          </router-link>
  		</div>
      <div class="addmember" @click="goaddMarket">
        <span class="order-action iconfont icon-nextx"></span><br>
        <span>优惠</span>
      </div>
  	</div>
  	<div class="VIP-wrap"  v-if="tabindex === 1">
      <div class="no-discount-list" v-if="timeMarket.lenght<=0">未设置店铺VIP卡</div>
      <div>
         <div class="car-shop">企鹅一号店vip卡</div>
          <div class="card-banner">       
            <swiper :options="swiperOption"  ref="mySwiper">
          
              <swiper-slide>
                <router-link :to="{name:'vipDetail'}">
                  <div class="year-card card">   
                    <p class="vip-type">VIP年卡</p>                
                    <p class="price">500<span>元</span></p>
                    <p class="usenum">每日仅限使用243123432次</p>       
                    <p class="tag">8<span>折</span></p> 
                  </div>
                 </router-link>                     
              </swiper-slide>  
             
              <swiper-slide>
                <div class="halfYear-card card">   
                    <p class="vip-type">VIP半年卡</p>                
                    <p class="price">500<span>元</span></p>
                    <p class="usenum">每日仅限使用243123432次</p>       
                    <p class="tag">9<span>折</span></p> 
                </div>                    
              </swiper-slide>   
              <swiper-slide>
                <div class="season-card card">   
                    <p class="vip-type">VIP月卡</p>                
                    <p class="price">500<span>元</span></p>
                    <p class="usenum">每日仅限使用243123432次</p>       
                    <p class="tag">9<span>折</span></p> 
                </div>                    
            </swiper-slide>  
            </swiper>        
          </div> 
      </div>
     
      <div class="addmember" @click="goaddvip">
        <span class="order-action iconfont icon-nextx"></span><br>
        <span>vip卡</span>
      </div>
  	</div>
  </section>
</div>
</template>
<script>
import QHeader from '@/components/header';
import { swiper, swiperSlide } from 'vue-awesome-swiper';  
import { timeMarketListFun } from '@/service/market';
import moment from 'moment';
export default {
  data() {
    return {
      title: '营销管理',
      tabtitle:['显示优惠','VIP'],
      tabindex:0,
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
      timeMarket:[]
    };
  },
  mounted() {
    
  },
  created(){
    this.timeMarketList();
    console.log();
  },
  methods: {
    tabclick(index){
    	this.tabindex = index;
    },
    async timeMarketList(){
      let res = await timeMarketListFun();
      this.timeMarket = res.data.items;
      res.data.items.forEach((item)=>{
          item.noDiscountStart = item.noDiscountStart ? moment(item.noDiscountStart).format('YYYY-MM-DD') : '';
          item.noDiscountEnd = item.noDiscountEnd ? moment(item.noDiscountEnd).format('YYYY-MM-DD'): '';
      });

    },
    goaddMarket(){
      this.$router.push({name:'addMarket'});
    },
    goaddvip(){
      this.$router.push({name:'addvip'});
    }
  },
  components:{
    QHeader,
    swiper,
    swiperSlide
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
      span {
        font-size: 12px;
      }
    }
  }
  .car-shop {
    font-size: 16px;
    color: #333;
    line-height: 1.72rem;
    padding-left: 0.44rem;
  }
  .card-banner{
    width: 100%;
    padding-top:.6rem;
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
                top: -.02rem;
                right: -.06rem;
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
