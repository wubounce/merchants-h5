<template>
<div class="wallet-wrapper" v-title="'我的钱包'">
    <div class="wallet-content">
        <router-link to="accountList">收支明细</router-link>
        <img src="../../../static/image/user/money@2x.png">
        <p class="font-title">账户余额 (元)</p>
        <p class="price">{{data.balance}}</p>
        <p class="total">累计收益 {{data.orderCount ? data.orderCount:0}}</p>
    </div>
    <div class="btn" @click="gowithdraw">余额提现</div>
    <p class="copyright">杭州企鹅科技有限公司</p>
</div>
</template>
<script>
import { getApplyFinanceFun } from '@/service/user';
export default {
  data() {
    return {
      data:{}
    };
  },
  mounted() {
    this.getApplyFinance();
  },
  created(){
  },
  methods: {
    async getApplyFinance(){
        let res = await getApplyFinanceFun();
       this.data = res.data;
    },
    gowithdraw(){
        this.$router.push({name:'withdraw'});
    }
  },
  components:{

  }
};
</script>
<style lang="scss" scoped>
    @import "../../assets/scss/common";
    .wallet-wrapper{        
        .wallet-content{
            background-color: #fff;
            padding: 1.333333rem 0 1.24rem;
            text-align: center;
            position: relative;
            a{
                position: absolute;
                font-size: .373333rem;
                line-height: .533333rem;
                right: .4rem;
                top: .24rem;
                color: $highlight-color;
            }
            img{
                width: 2.346667rem;
                height: 2.346667rem;
                border-radius: 50%;
                margin-bottom: .733333rem;
            }
            .font-title{
                font-size: .373333rem;
                color: $first-color;
                line-height: .533333rem;               
            }
            .price{
                font-size: 1.333333rem;
                line-height: 1.533333rem;
                font-weight: bold;
                margin-bottom: .466667rem;               
            }
            .total{
                color: $third-color;
                font-size: .373333rem;
                line-height: .533333rem;
            }
        }
        .btn{
            margin-top: .666667rem;
        }        
    }
</style>
