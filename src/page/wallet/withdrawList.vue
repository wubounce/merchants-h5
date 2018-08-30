<template>
<div class="withdrawList-wrapper page-loadmore-height" v-title="'提现记录'">
    <div class="no-discount-list" v-if="list.length<=0">暂无提现记录</div>
    <div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" @translate-change="translateChange" :auto-fill="false" ref="loadmore">
            <div class="page-with-list">
                <div  v-for="(item,index) in list" :key="index" :class="['list', {'fall':item.status === 2}]" >
                    <router-link :to="{name:'withdrawResult',query:{balanceLogId:item.id}}">
                        <span class="iconfont icon-tixian"></span>
                        <div class="accountList-content clearfix">
                            <div class="left">
                                <p class="title process" v-if="item.status === 0">提现中</p>
                                <p class="title success" v-if="item.status === 1">提现成功</p>
                                <p class="title fall" v-if="item.status === 2">提现失败</p>
                                <p class="time">{{item.createTime}}</p>
                            </div>
                            <p class="price">{{item.price}}</p>
                        </div>     
                    </router-link>
                </div>
            </div>
            <div v-if="allLoaded" class="nomore-data">没有更多了</div>
        </mt-loadmore>
    </div>
   
</div>
</template>
<script>
import qs from 'qs';
import { getApplyListFun } from '@/service/user';
import { ApplyType } from '@/utils/mapping';
import PagerMixin from '@/mixins/pagerMixin';
export default {
    mixins: [PagerMixin],
    data() {
        return {
            list:[],
        };
  },
  mounted() {
  },
  created(){
  },
  methods: {
    async _getList(){
        let payload = {page:this.page,pageSize: this.pageSize,type:2};
        let res = await getApplyListFun(qs.stringify(payload));
        this.list = res.items?[...this.list,...res.items]:[];  //分页添加
        this.total = res.total;
    },
  },
  components:{
  
  }
};
</script>
<style lang="scss" scoped>
    @import "../../assets/scss/common";
    .withdrawList-wrapper{
        .list{
            padding-left:2.15rem;
            position: relative;
            background-color: #fff;
            height: 2.32rem;  
            box-sizing: border-box;          
            span{
                position: absolute;
                top: 0.59rem;
                left: .4rem;
                width: 1.17rem;
                height: 1.17rem;
                border-radius: 50%;
            }
            .icon-tixian {
                color:#1890FF;
                font-size: 1.1rem;
            }
            .accountList-content{
                width: 100%;
                height: 100%;
                border-bottom: $first-border;
                padding: 0.59rem 0.4rem 0.55rem 0;
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
                    .process {
                        color: #1890FF;
                    }  
                    .success {
                        color: #52C41A
                    }
                    .fall {
                        color: #FF5F5F;
                    } 
                
                    .status{
                        margin: .12rem 0 .11rem;
                    }
                    .time {
                        padding-top: 0.15rem;

                    }
                }
                .price{
                    float: right;
                    font-size: .48rem;
                    color: $first-color;
                    line-height: .67rem;

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
