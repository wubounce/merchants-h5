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
              <p class="time">2018–07-22 17:06</p>
            </div>
            
          </li>
          <li class="second">
            <p class="icon-wrapper"><span class="icon"></span>  </p>   
            <div>
              <p class="status">处理中</p>
              <p class="time">预计07-23 17:06前到账</p>
            </div>
            
          </li>
          <li class="third">
            <!-- 根据状态更换icon -->
            <p class="icon-wrapper"><span class="icon"></span> </p>   
            <div>
              <!-- 若提现失败则给下status增加class：fall -->
              <p class="status">提现失败</p>
              <p class="time">2018–07-23 14:00</p>                           
            </div>            
          </li>
        </ul>
        <!-- 状态为失败的时候显示 -->
        <p class="fall-info" hidden>失败原因失败原因失败原因失败原因失败原因失败原因失败原因失败原因失败</p>
      </div>
    </div>
    <ul class="record">
			<li>
        <p>提现金额</p><p>5000.00</p> 
      </li>	 
      <li>
        <p>到账支付宝</p><p>zhangzhigao110@163.com(张志高)</p>  
      </li>	
      <li>    
        <p>提现单号</p><p>20180528161055875468</p>    
      </li>	       
		</ul>
    <!-- 提现进入才会显示按钮，详情进入不显示 -->
    <div class="btn">完成</div>
    
  </div>
</template>
<script>

export default {
  data() {
    return {
                                               
    };
  },
  mounted() {
    
  },
  created(){
  },
  methods: {
    
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

