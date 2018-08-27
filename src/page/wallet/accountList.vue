<template>
<div class="accountList-wrapper page-loadmore-height" v-title="'收支明细'">
    <section class="apply-status">
        <div v-for="(item,index) in titleArr" @click="titleClick(index)"><span :class="{current: titleIndex === index}">{{item.lable}}</span></div>
    </section>
    <div class="no-discount-list" v-if="list.length<=0">暂无相关明细</div>
    <!-- 记录为收益类，增加class：add -->
    <div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}"  v-else>
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" @translate-change="translateChange" :auto-fill="false" ref="loadmore">
            <div class="apply--list-wrap">
                <div class="all-list">
                    <div class="all" v-for="(item,index) in list" :key="index" >
                        <div class="list add" v-if="item.type === 1 "> 
                            <router-link :to="{name:'accountDetail', query:{balanceLogId:item.id,type:item.type}}">
                                <div class="icon-type"> 
                                    <span class="usericon iconfont icon-dianpu"></span>
                                </div>
                                <div class="accountList-content clearfix">
                                    <div class="left">
                                        <p class="title">{{item.shopName}}</p>
                                        <p class="status">交易成功</p>
                                        <p class="time">{{item.createTime}}</p>
                                    </div>
                                    <p class="price">+{{item.price}}</p>
                                </div>
                            </router-link>                
                        </div>
                        <div class="list" v-if="item.type === 3">
                            <router-link :to="{name:'accountDetail', query:{balanceLogId:item.id}}">
                                <div class="icon-type"> 
                                    <span class="usericon iconfont icon-tuikuan">  </span>
                                </div>
                                <div class="accountList-content clearfix">
                                    <div class="left">
                                        <p class="title">退款订单</p>
                                        <p class="status">交易成功</p>
                                        <p class="time">{{item.createTime}}</p>
                                    </div> 
                                    <p class="price">-{{item.price}}</p>
                                </div> 
                            </router-link>                
                        </div> 
                    </div>   
                </div>
                <p class="info" v-if="accountOnlySix">只展示近6个月记录</p>  
            </div>
        </mt-loadmore>
    </div>
</div>
</template>
<script>
import qs from 'qs';
import { Navbar, TabItem } from 'mint-ui';
import { getApplyListFun } from '@/service/user';
import { ApplyType } from '@/utils/mapping';
import PagerMixin from '@/mixins/pagerMixin';
export default {
    mixins: [PagerMixin],
  data() {
    return {
      titleIndex:0,
      type:'',
      titleArr:[
        {value:'',lable:'全部'},
        {value:1,lable:'收入'},
        {value:3,lable:'支出'},
      ],
      list:[],
    };
  },
  mounted() {
  },
  created(){
    
  },
  methods: {
    titleClick: function(index) {
      this.titleIndex = index;
      this.type = this.titleArr[this.titleIndex].value;
      this.page = 1; //从第一页起
      this.list = [];
      this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
      this._getList(this.type);
    },
    async _getList(type){
        let payload = {page:this.page,pageSize: this.pageSize,type:this.type};
        let res = await getApplyListFun(qs.stringify(payload));
        if (res.code ===0) {
            this.list = res.data.items?[...this.list,...res.data.items]:[];  //分页添加
            this.total = res.data.total;
            this.total > 10 ? this.accountOnlySix = false : this.accountOnlySix = true;
        }
        
    }
  },
  filters: {
    orserStatus: function (value) {
      return orderStatus(value);
    },
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
        padding-top: 1.17rem;
        box-sizing:border-box;
        .apply-status {
            width: 100%;
            display: flex;
            font-size: 16px;
            color: #333;
            text-align: center;
            background: #fff;
            height: 1.173333rem;
            line-height: 1.173333rem;
            border-bottom:1px solid #E5E5E5;
            position: fixed;
            top: 0;
            z-index: 99;
            div {
              flex: 1;
            }
            .current {
              display: inline-block;
              font-size:16px;
              font-family:PingFangSC-Medium;
              color:#1890FF;
              border-bottom: 0.08rem solid #1890FF;
              border-radius:0.04rem;
            }
        } 
        .list{
            padding-left:2.15rem;
            position: relative;
            background-color: #fff;
            overflow: hidden; 
            box-sizing: border-box; 

            .icon-type{
                position: absolute;
                top: .33rem;
                left: .4rem;
                width: 1.17rem;
                height: 1.17rem;
                border-radius: 50%;
            }
            .icon-dianpu {
                color: #52C41A;
                font-size: 1.2rem;
            }
            .icon-tuikuan {
                color: #FAAD14;
                font-size: 1.2rem;
            }
            .accountList-content{
                width: 100%;
                overflow: hidden;
                border-bottom: $first-border;
                padding: .33rem .4rem .33rem 0;
                box-sizing: border-box;                  
                .left{
                    float: left;
                    width: 78%;
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
        }   
        .info{
            text-align: center;
            margin-top: .53rem;
            margin-bottom: .53rem;
            font-size: .37rem;
            line-height: .53rem;
            color: $third-color;
        } 
        .all{
            &:last-child{
                .accountList-content{
                    border: none;
                }
            } 
            &:first-child{
                margin-top: 0.27rem;
            }            
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

