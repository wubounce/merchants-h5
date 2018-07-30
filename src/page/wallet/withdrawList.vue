<template>
<div class="withdrawList-wrapper" v-title="'提现记录'">
    <div class="list add"  v-for="(item,index) in applylsit" :key="index">
        <span class="iconfont icon-tixian"></span>
        <div class="accountList-content clearfix">
            <div class="left">
                <p class="title">余额提现</p>
                <p class="status">提现成功</p>
                <p class="time">5月25日 18:16</p>
            </div>
            <p class="price">-1000</p>
        </div>                
    </div>
    <div class="list">
        <span class="iconfont icon-tixian"></span>
        <div class="accountList-content clearfix">
            <div class="left">
                <p class="title">余额提现</p>
                <p class="status">提现中</p>
                <p class="time">5月25日 18:16</p>
            </div>
            <p class="price">-1000</p>
        </div>                
    </div>
    <div class="list fall">
        <span class="iconfont icon-tixian"></span>
        <div class="accountList-content clearfix">
            <div class="left">
                <p class="title">余额提现</p>
                <p class="status">提现失败</p>
                <p class="time">5月25日 18:16</p>
            </div>
            <p class="price">-1000</p>
        </div>                
    </div>
</div>
</template>
<script>
import qs from 'qs';
import { getApplyListFun } from '@/service/user';
import { ApplyType } from '@/utils/mapping';
export default {
  data() {
    return {
        selected: 1,
        page:1,
        pageSize:10,
        applylsit:[]
    };
  },
  mounted() {
   
  },
  created(){
     this.getApplyList();
  },
  methods: {
    async getApplyList(){
        let payload = {page:this.page,pageSize: this.pageSize,type:2};
        let res = await getApplyListFun(qs.stringify(payload));
       this.applylsit = res.data.items;
    }
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
            height: 2.32rem ;  
            box-sizing: border-box;          
            span{
                position: absolute;
                top: .33rem;
                left: .4rem;
                width: 1.17rem;
                height: 1.17rem;
                border-radius: 50%;
            }
            .icon-tixian {
                color:#1890FF;
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
            &.fall{
                .price{
                    color: #ff5f5f;
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
