<template>
<div class="user-wrapper">
    <header>
        <p class="guide"><a href="../../../static/B-user-guide.pdf" target="_self"><span class="iconfont icon-zhinan"></span>平台指南</a></p>
        <div class="user-info">
            <div class="pic">
                <img :src="userInfo.headImage" v-if="userInfo.headImage">
                <img src="../../../static/image/user/avatar@2x.png" v-else>
            </div>
            <div class="info-content">
                <p class="name">{{userInfo.realName}}</p>
                <p class="phone">{{userInfo.phone}}</p>
            </div>
        </div>        
    </header>
    <ul class="user-list">
        <li v-has="'mer:me:wallet'">
            <router-link to="wallet" class="item">
                <div class="item-left"><span class="usericon iconfont icon-qianbao"></span><span>我的钱包</span></div>
                <div class="item-right"><span class="go iconfont icon-nextx"></span></div>
            </router-link>
        </li>
    </ul>
    <ul class="user-list">
        <li>
            <router-link to="contact" class="item" style="border-bottom: 1px solid #f9f8ff;">
                <div class="item-left"><span class="usericon iconfont icon-lianxi"></span><span>联系客服</span></div>
                <div class="item-right"><span class="go iconfont icon-nextx"></span></div>
            </router-link>
        </li>
        <li>
            <router-link to="cooperation" class="item">
                <div class="item-left"><span class="usericon iconfont icon-rexian"></span><span>合作热线</span></div>
                <div class="item-right"><span class="go iconfont icon-nextx"></span></div>
            </router-link>
        </li>
        <!-- <li>
            <router-link to="helpcenter" class="item">
                <div class="item-left"><span class="usericon iconfont icon-bangzhuzhongxin"></span><span>帮助中心</span></div>
                <div class="item-right"><span class="go iconfont icon-nextx"></span></div>
            </router-link>
        </li> -->
    </ul>
    <ul class="user-list">
        <li>
            <router-link to="setting" class="item">
                <div class="item-left"><span class="usericon iconfont icon-shezhi"></span><span>设置</span></div>
                <div class="item-right"><span class="go iconfont icon-nextx"></span></div>
            </router-link>
        </li>
    </ul>
</div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
        };
    },
    mounted() {
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo
        }),
    },
    methods: {

    },
    components:{
    }
};
</script>
<style lang="scss" scoped>
    @import "../../assets/scss/common";
    .user-wrapper{        
        header{
            padding: 0.37rem 0.4rem 1.0rem 0.87rem;
            background:url(../../../static/image/user/user@2x.png);
            background-size: cover;
            .guide{
                a {
                    display: block;
                    font-size: .37rem;
                    color: #a8d5ff;
                    text-align: right;
                    line-height: .533333rem;
                    span{
                        width: .36rem;
                        height:.36rem;
                        margin-right: .133333rem;
                    }
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
                    background-color: #fff;
                    margin-right: .533333rem;
                    border-radius: 50%;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
                .info-content {
                    width: 6.13rem;
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
            padding-left: .4rem;
            margin-bottom: .266667rem;
            .item{
                height: 1.173333rem;
                line-height: 1.17rem;
                border-bottom: $first-border;
                padding-right: .4rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                &:last-child{
                    border: none;
                } 
                .item-left{
                    span{
                        color: $first-color;
                        font-size: 0.43rem;
                    }
                    .usericon {
                        font-size: 0.48rem;
                    }
                }
            }
            .go {
                color: #999;
            }
            .usericon {
                color: #1890FF !important;
                margin-right:.426667rem; 
            }
        }
    }
</style>
