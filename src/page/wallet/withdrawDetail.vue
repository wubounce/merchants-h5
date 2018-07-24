<template>
    <!-- 根据类型更换title -->
	<div class="withdrawDetail-wrapper" v-title="'提现详情'">
		<header>
			<p class="title"><img src="../../assets/img/test.jpg">余额提现</p>
			<p class="price">-1000</p>
			<p class="satus">提现成功</p>
		</header>		
		<ul class="record">
			<li>
                <div><p>提现金额</p><p>5.00</p></div>           
            </li>	
            <li>
                <div><p>提现申请时间</p><p>2018-05-29 10:10</p></div>
                <div><p>提现到账时间</p><p>2018-05-29 13:49</p></div>
                <div><p>提现账号</p><p>zhangzhigao110@163.com (张志高)</p></div>
                <div><p>提现单号</p><p>20180528161055875468</p></div>
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
    .withdrawDetail-wrapper{
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
