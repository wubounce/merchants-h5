 <template>
<div class="marketing" v-title="title">
  <section class="tab-title">
  	<div v-for="(item,index) in tabtitle" @click="tabclick(index)"><span :class="{tabcurrent:tabindex === index}" >{{item}}</span></div>
  </section>
  <section class="tab-contont">
  	<div class="discount-wrap" v-if="tabindex === 0">
      <div class="no-discount-list" v-if="timeMarket.length<=0">未设置限时优惠活动</div>
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
        <span class="order-action iconfont icon-tianjia"></span><br>
        <span>优惠</span>
      </div>
  	</div>
  	<div class="VIP-wrap"  v-if="tabindex === 1">
      <div class="no-discount-list" v-if="timeMarket.length<=0">未设置店铺VIP卡</div>
      <div class="card-banner"  v-else> 
        <router-link :to="{name:'vipDetail'}">
          <div class="year-card card">   
            <p class="vip-type">VIP年卡</p>                
            <p class="price">500<span>元</span></p>
            <p class="usenum">每日仅限使用3次</p>       
            <p class="tag">8<span>折</span></p> 
            <div class="action">
              <span class="action-btn"> <span class="iconfont icon-shezhi"></span>删除</span> 
              <span class="action-btn"> <span class="iconfont icon-shezhi"></span>编辑</span>
            </div>
          </div>
          <p class="belog-shop">所属店铺<span>企鹅一号店</span></p>
        </router-link>    
          <div class="halfYear-card card">   
            <p class="vip-type">VIP半年卡</p>                
            <p class="price">500<span>元</span></p>
            <p class="usenum">每日仅限使用3次</p>       
            <p class="tag">9<span>折</span></p> 
            <div class="action">
              <span class="action-btn"> <span class="iconfont icon-shezhi"></span>删除</span> 
              <span class="action-btn"> <span class="iconfont icon-shezhi"></span>编辑</span>
            </div>
          </div> 
          <p class="belog-shop">所属店铺<span>企鹅一号店</span></p>
         <div class="season-card card">   
            <p class="vip-type">VIP月卡</p>                
            <p class="price">500<span>元</span></p>
            <p class="usenum">每日仅限使用3次</p>       
            <p class="tag">9<span>折</span></p> 
            <div class="action">
              <span class="action-btn"> <span class="iconfont icon-shezhi"></span>删除</span> 
              <span class="action-btn"> <span class="iconfont icon-shezhi"></span>编辑</span>
            </div>
        </div>              
      </div> 
     
      <div class="addmember" @click="goaddvip">
        <span class="order-action iconfont icon-tianjia"></span><br>
        <span>vip卡</span>
      </div>
  	</div>
  </section>
</div>
</template>
<script>
import { timeMarketListFun, vipListFun } from '@/service/market';
import moment from 'moment';
export default {
  data() {
    return {
      title: '营销管理',
      tabtitle:['显示优惠','VIP'],
      tabindex:0,
      timeMarket:[]
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
      this.timeMarket = res.data.items;
      res.data.items.forEach((item)=>{
          item.noDiscountStart = item.noDiscountStart ? moment(item.noDiscountStart).format('YYYY-MM-DD') : '';
          item.noDiscountEnd = item.noDiscountEnd ? moment(item.noDiscountEnd).format('YYYY-MM-DD'): '';
      });
    },
    async vipList(){
      let res = await vipListFun();
      // this.timeMarket = res.data.items;
      console.log(res);
    },
    goaddMarket(){
      this.$router.push({name:'addMarket'});
    },
    goaddvip(){
      this.$router.push({name:'addvip'});
    }
  },
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
    .card{  
        height: 100%;
        background-size: cover;
        border-radius: .2rem;
        margin:0.4rem;  
        padding: 0.8rem 0 0.4rem 0.4rem; 
        color:#393537;  
        border-radius:0.27rem;  
        position: relative;            
        &.year-card{
            background-image: url(../../../static/image/vip/create_year2x.png);
            box-shadow:0px 0.08rem 0.13rem -0.03rem rgba(245,218,169,1);
        }   
        &.halfYear-card{
            background-image: url(../../../static/image/vip/create_half_year2x.png);
            box-shadow:0px 0.08rem 0.27rem -0.03rem rgba(245,218,169,1);
        } 
        &.season-card{
            background-image: url(../../../static/image/vip/create_season2x.png);
            box-shadow:0px 0.08rem 0.27rem -0.03rem rgba(245,218,169,1);
        }
        .vip-type{
            font-size: 14px;
            color: #393537;
        }
        .price{
            height: 1.87rem;
            line-height: 1.87rem;
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
          color: #957D5F;
        }
        .tag{
            transform: rotate(45deg); 
            position: absolute;
            width: .88rem;
            height: .88rem;
            text-align: center;
            line-height: .88rem;
            top: 0.13rem;
            right: 0;
            color: #FFE199;
            font-size: 18px;
            span{
              font-size: 12px;
            }     
        }
        .action {
          position: absolute;
          bottom: 0.4rem;
          right: 0.52rem;
          font-size: 14px;
        } 
        .action-btn {
          display: block;
          background:rgba(255,255,255,0.5);
          border-radius:0.11rem;
          padding:0.07rem  0.17rem 0.07rem 0;
        }
        .action-btn:first-child{
          margin-bottom: 0.35rem;
        }
        .icon-shezhi {
          font-size: 14px;
          margin: 0 0.17rem;
        }
    } 
    .belog-shop {
      font-size: 14px;
      color: #999;
      padding-left: 0.4rem;
      padding-bottom: 0.27rem;
      span {
        color: #333;
        padding-left: 0.27rem;
      }
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
