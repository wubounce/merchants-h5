<template>
<div class="accountList-wrapper" v-title="'收支明细'">
    <mt-navbar v-model="selected" fixed>
        <mt-tab-item id="1" :class="selected ===1 ?'is-selected':''">全部</mt-tab-item>
        <mt-tab-item id="2">收入</mt-tab-item>
        <mt-tab-item id="3">支出</mt-tab-item>
    </mt-navbar>

    <mt-tab-container v-model="selected">
        <!-- 全部 -->
        <mt-tab-container-item id="1">
            <!-- 记录为收益类，增加class：add -->
            <div class="list add">
                <!-- 图片根据记录类型显示不同图片 -->
                <img src="../../assets/img/test.jpg">
                <div class="accountList-content clearfix">
                    <div class="left">
                        <p class="title">每日便利洗衣店</p>
                        <p class="status">交易成功</p>
                        <p class="time">5月25日 18:16</p>
                    </div>
                    <p class="price">+3.50</p>
                </div>                
            </div>
            <div class="list">
                <img src="../../assets/img/test.jpg">
                <div class="accountList-content clearfix">
                    <div class="left">
                        <p class="title">退款订单</p>
                        <p class="status">交易成功</p>
                        <p class="time">5月25日 18:16</p>
                    </div>
                    <p class="price">-5.00</p>
                </div>                
            </div>
        </mt-tab-container-item>
        <!-- 收入 -->
        <mt-tab-container-item id="2">
            <div class="list add">
                <img src="../../assets/img/test.jpg">
                <div class="accountList-content clearfix">
                    <div class="left">
                        <p class="title">每日便利洗衣店</p>
                        <p class="status">交易成功</p>
                        <p class="time">5月25日 18:16</p>
                    </div>
                    <p class="price">+3.50</p>
                </div>                
            </div>
        </mt-tab-container-item>
        <!-- 支出 -->
        <mt-tab-container-item id="3">
            <div class="list">
                <img src="../../assets/img/test.jpg">
                <div class="accountList-content clearfix">
                    <div class="left">
                        <p class="title">退款订单</p>
                        <p class="status">交易成功</p>
                        <p class="time">5月25日 18:16</p>
                    </div>
                    <p class="price">-5.00</p>
                </div>                
            </div>
        </mt-tab-container-item>
    </mt-tab-container>
    <p class="info">只展示近6个月记录</p>
</div>
</template>
<script>
import { Navbar, TabItem } from 'mint-ui';
export default {
  data() {
    return {
      selected: 1,
    };
  },
  mounted() {
    
  },
  created(){
  },
  methods: {
    
  },
  components:{
    Navbar,
    TabItem
  }
};
</script>
<style lang="scss" scoped>
    @import "../../assets/scss/common";
    .accountList-wrapper{
        padding-top: 1.493333rem;
        .list{
            padding-left:2.15rem;
            position: relative;
            background-color: #fff;
            height: 2.32rem ;  
            box-sizing: border-box;          
            img{
                position: absolute;
                top: .33rem;
                left: .4rem;
                width: 1.17rem;
                height: 1.17rem;
                border-radius: 50%;
            }
            .accountList-content{
                width: 100%;
                height: 100%;
                border-bottom: $first-border;
                padding: .33rem .4rem .33rem 0;
                box-sizing: border-box;   
                .left{
                    float: left;
                    font-size: .32rem;
                    line-height: .44rem;
                    color: $third-color;           
                    .title{
                        color: $first-color;
                        font-size: .43rem;
                        line-height: .6rem;
                    }
                    .status{
                        margin: .12rem 0 .11rem;
                    }
                }
                .price{
                    float: right;
                    font-size: .48rem;
                    color: $first-color;
                    line-height: .67rem;

                }
                
            }  
            &.add{
                .price{
                    color: $highlight-color;
                }
            }
            &:last-child{
                .accountList-content{
                    border-bottom: none;
                }
            }          
        }
        .info{
            text-align: center;
            margin-top: .53rem;
            font-size: .37rem;
            line-height: .53rem;
            color: $third-color;
        }
    }
</style>
<style lang="scss">
    @import "../../assets/scss/common";
    .accountList-wrapper{
        .mint-navbar .mint-tab-item{
            padding: 0 .866667rem;
        }
        .mint-tab-item-label{
            line-height: 1.146667rem;
            color: $second-color;
            font-size: .426667rem;
            border-bottom: 2px solid transparent;
        }
        .mint-navbar .mint-tab-item.is-selected{
            border:none;
            .mint-tab-item-label{
                border-bottom: 2px solid #1890ff;
                color:$highlight-color;
            }
        }
        
    }
</style>

