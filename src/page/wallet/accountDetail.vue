<template>
    <!-- 根据类型更换title -->
	<div class="accountDetail-wrapper" v-title="'收益详情'">
		<header>
			<p class="title"><img src="../../assets/img/test.jpg">每日便利洗衣店</p>
			<p class="price">+3.50</p>
			<p class="satus">交易成功</p>
		</header>		
		<ul class="record">
			<li>
                <div><p>订单金额</p><p>5.00</p></div>   
				<div class="discounts"><p>优惠券</p><p>-1.50</p></div>
                <div class="discounts"><p>限时折扣</p><p>-1.50</p></div>            
            </li>	
            <li>
                <div><p>支付方式</p><p>微信支付</p></div>
                <div><p>用户账号</p><p>15726694131</p></div>
            </li>
            <li>
                <div><p>创建之间</p><p>2018-05-29 10:10</p></div>
                <div><p>订单号</p><p>20180528161055875468</p></div>
            </li>
            <li>
                <div><p>类型</p><p>洗衣机</p></div>
                <div><p>设备型号</p><p>海尔8公斤滚筒SGDN8-636U7</p></div>
                <div><p>设备名称</p><p>机器名称</p></div>
                <div><p>IMEI号</p><p>865933031225838</p></div>
            </li>
            <li>
                <div class="remarks"><p>备注</p><p>我要退款啊我要退款啊我要退款啊我要退款啊 我要退款啊我要退款啊</p></div>    
            </li>
		</ul>
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
    @import '../../assets/scss/common';
    .accountDetail-wrapper{
        background: #FFFFFF;
        header{
            text-align: center;
            padding: .6667rem 0;
            .title{
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    width: .5867rem;
                    height: .5867rem;
                    margin-right: .2rem;                    
                }
                color: $first-color;
                line-height: .6667rem;
                font-size: .48rem;
            }
            .price{
                color: $first-color;
                line-height: 1.2rem;
                font-size: .8533rem;
                margin: .2667rem 0;
               
            }
            .satus{
                color: $third-color;
                font-size: .3733rem;
                line-height: .5333rem;
            }
        }
        .record{
            padding-left: .4rem;
            li{
                padding: .4rem .4rem .4rem 0;
                border-bottom: $first-border;
                color: $third-color;
                font-size: .3733rem;
                div{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: .5333rem;
                    margin-bottom: .4rem;
                    p{
                        &:last-child{
                            color: $first-color;
                        }
                        
                    }
                    &:last-child{
                        margin-bottom: 0;
                    }
                    &.discounts{
                        p{
                            color: #ff5f5f;
                        }
                    } 
                    &.remarks{
                        height: auto;
                        align-items: stretch;
                        p{
                            max-width: 7.4667rem;
                        }
                    }                  
                }
                &:first-child{
                    padding-top: 0;
                }
                &:last-child{
                    border-bottom: none;
                }
                
            }
        }
    }
		
</style>
