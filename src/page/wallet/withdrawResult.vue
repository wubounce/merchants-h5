<template>
  <div class="withdrawResult-wrapper" v-title="'余额提现'">
    <div class="status-wrapper">
      <!-- 状态到第三步的时候添加class：third-padding -->
      <div class="withdraw-status third-padding">
        <ul class="status-msg">
          <!-- 状态到哪就给哪个li添加class：active -->
          <li class="first">
            <p class="icon-wrapper"><span class="icon"></span>  </p>   
            <div>
              <p class="status">发起提现申请</p>
              <p class="time">{{data.buildTime}}</p>
            </div>
          </li>
          <li :class="['second',{'active':data.status === 0}]" >
            <p :class="['icon-wrapper','iconfont',{'icon-shijian':data.status === 0}]"><span class="icon"></span></p>   
            <div>
              <p class="status">处理中</p>
              <p class="time" v-if="data.status === 0">预计{{data.forecastTime}}前到账</p>
              <p class="time" v-else>{{data.buildTime}}</p>
            </div>
            
          </li>
          <li :class="['third',{'active':data.status !== 0}]">
            <!-- 根据状态更换icon -->
            <p :class="['icon-wrapper','iconfont',{'icon-shibai':data.status === 2,'icon-chenggong':data.status === 1}]"><span class="icon"></span> </p>   
            <div>
              <!-- 若提现失败则给下status增加class：fall -->
              <p :class="['status',{'fall':data.status === 2}]">{{data.status === 2? '提现失败': '提现成功'}}</p>
              <p class="time" v-if="data.status === 2">{{data.content}}</p>  
              <p class="time" v-if="data.status !== 0">{{data.completeTime}}</p>                          
            </div>            
          </li>
        </ul>
        <!-- 状态为失败的时候显示 -->
        <p class="fall-info" hidden>失败原因失败原因失败原因失败原因失败原因失败原因失败原因失败原因失败</p>
      </div>
    </div>
    <ul class="record">
			<li>
        <p>提现金额</p><p>{{data.price}}</p> 
      </li>	 
      <li>
        <p>到账支付宝</p><p>{{data.alipayAccount}}</p>  
      </li>	
      <li>    
        <p>提现单号</p><p>{{data.orderNo}}</p>    
      </li>	       
		</ul>
    <!-- 提现进入才会显示按钮，详情进入不显示 -->
    <div class="btn" v-if="ishow" @click="$router.push({name:'withdraw'})">完成</div>
    
  </div>
</template>
<script>
import moment from 'moment';
import qs from 'qs';
import { getMoneySubmitDetailFun } from '@/service/user';
export default {
  data() {
    return {
      data:{},
      ishow:false
    };
  },
  mounted() {
    
  },
  created(){
    let query = this.$route.query; 
    query.applyMoney ? this.ishow = true:this.ishow = false;
    this.getMoneySubmitDetail(query.balanceLogId);
  }, 
  methods: {
    async getMoneySubmitDetail(balanceLogId){
      let payload = {balanceLogId:balanceLogId};
      let res = await getMoneySubmitDetailFun(qs.stringify(payload));
      this.data = res.data;
    }
  },
  components:{

  }
};
</script>
<style lang="scss" scoped>
    @import "../../assets/scss/common";
    .withdrawResult-wrapper{
        background-color: #fff;
        height: 100%;   
        .status-wrapper{
          padding-left: .4rem;
          .withdraw-status{
            padding: 1.16rem 0 .88rem .4rem;
            border-bottom: $first-border;
            &.third-padding{
              padding-bottom: 1.1733rem;
            }
            .status-msg{
              border-left: 1px dashed #e5e5e5;
              width: 100%;
              height: 3.68rem;
              position: relative;
              li{
                position: absolute;
                left: 0;  
                transform: translate(-50%);  
                .icon-wrapper{
                  width: .6933rem;    
                  display: flex;
                  justify-content: center;    
                  background-color: #fff;                                     
                }                    
                .icon{
                  display: inline-block;
                  width: .3467rem;
                  height: .3467rem;
                  background-color: #52C41A;
                  border-radius: 50%;   
                }
                .iconfont{
                  font-size: .6933rem;
                  line-height: 1;
                  color: $highlight-color;
                }
                .icon-shibai {
                  color: #FF5F5F;
                }
                div{
                  position: absolute;
                  width: 8.0933rem;
                  top: 0;
                  left: 1.0933rem;
                 
                  p{
                    color: $first-color;
                    
                    font-size: .3733rem;
                    line-height: 1;
                    &.time{
                      color: $third-color;
                      line-height: .5333rem;
                      margin-top: .08rem;
                    }
                  }
                }                        
                &.first{               
                    top: 0;                                                           
                }
                &.second{                  
                    top: 1.4933rem;    
                    &.active{
                      .status{
                        font-size: .48rem;
                      }
                    }                                            
                }
                &.third{                  
                  bottom: 0;    
                  .icon{
                    background-color: #d6d6d6;
                  }  
                  &.active{
                    .status{
                      font-size: .48rem;
                      color: $highlight-color;                      
                    }
                    .fall{
                      color: #FF5F5F;
                      font-size: 18px;
                    }
                  }                                    
                }
                
              }             
            }
            .fall-info{
              height: 100%;
              padding:0 .4rem 0 .7733rem;
              font-size: .32rem;
              color: $second-color;
              margin-top: .4667rem;
              line-height: .44rem;
            }
            
          }
        }             
        .record{
          margin-top: .8rem;
            li{
                padding: 0 .4rem;               
                color: $third-color;
                font-size: .3733rem;
                height: .5333rem;
                margin-bottom: .4rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                p{
                    &:last-child{
                        color: $first-color;
                    }
                    
                }                
            }
        }
        .btn{
          margin-top: 1.3333rem;
        }
    }
</style>

