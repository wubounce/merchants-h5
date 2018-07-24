<template>
<div class="user-wrapper" v-title="'我的'">
    <header>
        <p class="guide"><img src="../../assets/img/home/icon_near2x.png">平台指南</p>
        <div class="user-info">
            <div class="pic"><img src=""></div>
            <div class="info-content">
                <p class="name">商家姓名</p>
                <p class="phone">15799998888</p>
            </div>
        </div>        
    </header>
    <ul class="user-list">
        <li>
            <router-link to="wallet" class="item">
                <div class="item-left"><img src="../../assets/img/home/icon_near2x.png"><span>我的钱包</span></div>
                <div class="item-right"><img src="../../assets/img/home/icon_near2x.png"></div>
            </router-link>
        </li>
    </ul>
    <ul class="user-list">
        <li class="item">
            <div class="item-left"><img src="../../assets/img/home/icon_near2x.png"><span>联系客服</span></div>
            <div class="item-right"><img src="../../assets/img/home/icon_near2x.png"></div>
        </li>
        <li class="item">
            <div class="item-left"><img src="../../assets/img/home/icon_near2x.png"><span>合作热线</span></div>
            <div class="item-right"><img src="../../assets/img/home/icon_near2x.png"></div>
        </li>
    </ul>
    <ul class="user-list">
        <li class="item">
            <div class="item-left"><img src="../../assets/img/home/icon_near2x.png"><span>设置</span></div>
            <div class="item-right"><img src="../../assets/img/home/icon_near2x.png"></div>
        </li>
    </ul>
    <q-menu></q-menu>
</div>
</template>
<script>
import QMenu from '@/components/menu';
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
    QMenu,
  }
};
</script>
<style lang="scss" scoped>
    @import "../../assets/scss/common";
    .user-wrapper{        
        header{
            height: 4rem;
            padding: .266667rem .4rem .946667rem .84rem;
            background-color: #1890ff;
            box-sizing: border-box;
            .guide{
                font-size: .37rem;
                color: #a8d5ff;
                text-align: right;
                line-height: .533333rem;
                img{
                    width: .36rem;
                    height:.36rem;
                    margin-right: .133333rem;
                }
            }
            .user-info{
                display: flex;
                align-items: center;
                color: #fff;
                margin-top: .2rem;
                .pic{
                    width: 1.973333rem;
                    height: 1.973333rem;
                    border-radius: 50%;
                    border: .066667rem solid #cee7ff;
                    background-color: #fff;
                    margin-right: .533333rem;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
                .name{
                    font-size: .48rem;
                    line-height: .666667rem;
                    font-weight: bold;
                }
                .phone{
                    line-height: .6rem;
                    font-size: .426667rem;
                    margin-top: .213333rem;
                }
            }
        }
        .user-list{
            background-color: #fff;
            border-bottom: $first-border;
            border-top: $first-border;
            padding-left: .4rem;
            margin-bottom: .266667rem;
            .item{
                height: 1.173333rem;
                border-bottom: $first-border;
                padding-right: .4rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                &:last-child{
                    border: none;
                } 
                .item-left{
                    img{
                       width: .533333rem;
                       height: .533333rem;
                       margin-right:.426667rem; 
                       vertical-align: middle; 
                    }
                    span{
                        color: $first-color;
                        font-size: .426667rem;
                        
                    }
                }
                .item-right{
                    img{
                        width:.32rem;
                        height: .32rem;

                    }
                }
            }
        }
    }
</style>
