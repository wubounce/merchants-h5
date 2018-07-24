<template>
<div class="withdraw-wrapper" v-title="'我的钱包'">
    <header>
        <img src="../../assets/img/test.jpg">
        <div>
            <p class="name">zhangzhigao***@163.com</p>
            <p>24小时内到账</p>
        </div>
    </header>
    <div class="withdraw-money">
        <p class="title">提现金额</p>
        <label><span>￥</span><input></label>
        <div class="total">
            <p class="balance">账户余额 ￥0.00，最低提现10元</p>
            <p class="withdraw-all">全部提现</p>
        </div>
    </div>
    <!-- 满足条件可以提现的时候去掉class：btn-disabled -->
    <div class="btn btn-disabled">确认提现</div>
    <p class="withdraw-list">提现记录</p>
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
    @import "../../assets/scss/common";
    .withdraw-wrapper{        
        header{
            display: flex;
            align-items: center;
            height: 2.5067rem;
            padding: 0 .4rem;
            background-color: #fff;
            margin-bottom: .2933rem;
            img{
                width: 1.3067rem;
                height: 1.3067rem;
                margin-right: .4rem;                 
            }
            p{
                font-size: .3733rem;
                line-height: .5333rem;
                color: $third-color;
                &.name{
                    font-size: .48rem;
                    color: $first-color;
                    line-height: .6667rem;
                    margin-bottom: .16rem;
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
                    line-height: 1.2rem;
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
        .btn{
            margin-top: .6667rem;
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
