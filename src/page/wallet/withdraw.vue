<template>
<div class="withdraw-wrapper">
    <header>
        <span class="iconfont icon-zhifubao"></span>
        <div>
            <p class="name">{{userInfo.alipayAccount ? userInfo.alipayAccount : '' | replaceAliply}}</p>
            <p>24小时内到账</p>
        </div>
    </header>
    <div class="withdraw-money">
        <p class="title">提现金额</p>
        <label><span>￥</span><input v-model="money" @input="btndisabdisabled" :disabled="inputDisabled" type="number" v-focus></label>
        <div class="total">
            <p class="fullbalance" v-if="thanBalance">{{thanBalanceTip}}</p>
            <p class="balance" v-else>账户余额 ￥{{userInfo.balance}}，最低提现10元</p>
            <p class="withdraw-all" @click="allWithdraw">全部提现</p>
        </div>
    </div>
    <mt-button class="btn" :disabled="disabled" @click="gotoWithdraw">确认提现</mt-button>
    <p class="withdraw-list"><router-link :to="{name:'withdrawList'}">提现记录</router-link></p>
</div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import { getApplyaccountFun, applyMoneySubmitFun } from '@/service/user';
export default {
  data() {
    return {
      userInfo:{},
      money:'',
      thanBalance:false,
      balanceErrTxt:'',
      disabled:true,
      inputDisabled:true,
      thanBalanceTip:''
    };
  },
  mounted() {
    
  },
  created(){
    this.getOperator();
  },
  methods: {
    async getOperator(){
        let res = await getApplyaccountFun();
        this.userInfo = res;
        this.inputDisabled = false;
    },
    allWithdraw(){
        this.money = this.userInfo.balance;
        this.disabled = false;
        this.thanBalance = false;
    },
    async gotoWithdraw(){
        if (Number(this.money) < 10 ) {
            this.$toast('最低提现10元');
            return false;
        }
        if (Number(this.money) > this.userInfo.balance ) {
            this.$toast('超出本次可提现金额');
            return false;
        }
        if (Number(this.money) >= 50000.01 ) {
            this.$toast('单笔提现到支付宝不能超过50000元');
            return false;
        }
        this.disabled = true;
        let payload = Object.assign({},{money:this.money});
        let res = await applyMoneySubmitFun(payload);
        if(res.code === 1004 || res.code === 1014) {
            this.$toast(res.msg);
            this.$router.push({name:'accountSet'});
        }else {
            this.disabled = false;
            this.$router.push({name:'withdrawResult',query:{applyMoney:true,balanceLogId:res.id}});
        }
    },
    btndisabdisabled(){
        if (!this.money) {
            this.disabled = true;
        } else if (this.money && Number(this.money) < 10 ) {
            this.thanBalanceTip = '最低提现10元';
            this.thanBalance = true;
            this.disabled = true;
        }else if (this.money && Number(this.money) > this.userInfo.balance ) {
           this.thanBalanceTip = '输入金额超过账户余额';
            this.thanBalance = true;
            this.disabled = true;
        }else if (this.money && Number(this.money) >= 50000.01 ) {
            this.thanBalanceTip = '单笔提现到支付宝不能超过50000元';
            this.thanBalance = true;
            this.disabled = true;
        }else {
            this.thanBalance = false;
            this.disabled = false;
        }
    }
  },
};
</script>
<style lang="scss" scoped>
    @import "../../assets/scss/common";
    .withdraw-wrapper{        
        header{
            display: flex;
            align-items: center;
            height: 2.5067rem;
            padding: 0 .4rem;
            background-color: #fff;
            margin-bottom: .2933rem;
            .icon-zhifubao{
                width: 1.3067rem;
                height: 1.3067rem;
                margin-right: .4rem; 
                color: #1890FF; 
                font-size: 1.17rem;               
            }
            p{
                font-size: .3733rem;
                color: $third-color;
                &.name{
                    font-size: .48rem;
                    color: $first-color;
                    margin-bottom: 0.16rem;
                }
            }
        }
        .withdraw-money{
            padding-left: .4rem;
            padding-top: .5333rem;
            background-color: #fff;
            .title{
                font-size: .3733rem;
                line-height: .5333rem;
                color: $third-color;
                margin-bottom: .5067rem;
            }
            label{
                display: flex;
                align-items: baseline;
                color: $first-color;
                span{
                    font-size: .64rem;                    
                    line-height: .8933rem;
                }
                input{
                    font-size: .8533rem;
                    margin-left: .0533rem;
                    padding-top: 0.05rem;
                    height: 1.2rem;
                    line-height: 1.2rem;
                    background: #fff;
                }
            }
            .total{
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 1.12rem;
                border-top: $first-border;
                font-size: .3733rem;
                padding-right: .4rem;
                .balance{                   
                    color: $third-color;                   
                }
                .withdraw-all{
                    color: $highlight-color;
                }
            }
        }
        .fullbalance {
            color: #f00;
        }
        .btn{
            margin-top: .6667rem;
            display: block;
            &.btn-disabled{
                opacity: .5;
            }
        }
        .withdraw-list{
            text-align: center;
            color: $first-color;
            font-size: .3733rem;
            margin-top: .5333rem;
        }
    } 
</style>
