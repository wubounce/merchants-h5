<template>
<div class="accountList-wrapper" v-title="'收支明细'">
    <section class="apply-status">
        <div v-for="(item,index) in titleArr" @click="titleClick(index)"><span :class="{current: titleIndex === index}">{{item.lable}}</span></div>
    </section>
    <!-- 记录为收益类，增加class：add -->
    <div class="apply--list-wrap">
        <div class="all" v-for="(item,index) in applylsit" :key="index" >
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
        <p class="info">只展示近6个月记录</p>
    </div>
</div>
</template>
<script>
import qs from 'qs';
import { Navbar, TabItem } from 'mint-ui';
import { getApplyListFun } from '@/service/user';
import { ApplyType } from '@/utils/mapping';
export default {
  data() {
    return {
      titleIndex:0,
      page:1,
      pageSize:10,
      type:'',
      titleArr:[
        {value:'',lable:'全部'},
        {value:1,lable:'收入'},
        {value:3,lable:'支出'},
      ],
      applylsit:[]
    };
  },
  mounted() {
    
  },
  created(){
    this.getApplyList();
  },
  methods: {
    titleClick: function(index) {
      this.titleIndex = index;
      this.type = this.titleArr[this.titleIndex].value;
      this.page = 1; //从第一页起
      this.getApplyList(this.type);
    },
    async getApplyList(type){
        let payload = {page:this.page,pageSize: this.pageSize,type:this.type};
        let res = await getApplyListFun(qs.stringify(payload));
       this.applylsit = res.data?res.data.items :[];
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
        .apply-status {
            display: flex;
            font-size: 16px;
            color: #333;
            text-align: center;
            background: #fff;
            height: 1.173333rem;
            line-height: 1.173333rem;
            border-bottom:1px solid #E5E5E5;
            margin-bottom: 0.27rem;
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
            height: 2.32rem ;  
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
        }
        .info{
            text-align: center;
            margin-top: .53rem;
            font-size: .37rem;
            line-height: .53rem;
            color: $third-color;
        }
        .all:last-child .accountList-content{
            border:none
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

