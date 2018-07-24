<template>
<div>
  <q-header :title="title"></q-header>
  <section class="sarch-wrap">
    <input type="text" v-model="searchData" placeholder="请输入用户手机号/订单号查询">
  </section>
  <section class="order-status">
    <div v-for="(item,index) in titleArr" @click="titleClick(index)"><span :class="{current: titleIndex === index}">{{item}}</span></div>
  </section>
  <div class="alllist">
    <section class="ordermun">
      <span class="odernmu-phone">1884372684<span style="padding:0 0.186667rem;color:#333333">|</span>2018-06-13 11:08</span>
      <span class="ordernum-status">已支付</span>
    </section>
    <section class="order-list">  
        <div class="title">紫金港路浙江大学时湖校区西区C4号<router-link :to="{ name: 'orderdetail'}" class="go">icon</router-link></div>
        <div class="detail">  
          <div class="orderpic"><img src="../../assets/img/home/icon_near2x.png" alt=""></div>
          <div class="content">
              <p class="con-title">海尔8KgFh069Fd2F</p>
              <p class="con-type">标准洗<span style="padding:0 0.346667rem">|</span>时长40分钟</p>
              <p class="con-price">¥560</p>
          </div>
          <div class="order-action">预约</div>
        </div>
    </section>
    <section class="listaction"> 
        <span>退款</span>
        <span>启动</span>
        <span>复位</span>
    </section>
  </div>
  <div class="alllist">
    <section class="ordermun">
      <span class="odernmu-phone">1884372684<span style="padding:0 0.186667rem;color:#333333">|</span>2018-06-13 11:08</span>
      <span class="ordernum-status">待支付</span>
    </section>
    <section class="order-list">  
        <div class="title">紫金港路浙江大学时湖校区西区C4号<span class="go">icon</span></div>
        <div class="detail">  
          <div class="orderpic"><img src="../../assets/img/home/icon_near2x.png" alt=""></div>
          <div class="content">
              <p class="con-title">海尔8KgFh069Fd2F</p>
              <p class="con-type">标准洗<span style="padding:0 0.346667rem">|</span>时长40分钟</p>
              <p class="con-price">¥560</p>
          </div>
          <div class="order-action">预约</div>
        </div>
    </section>
  </div>
  <div class="alllist">
    <section class="ordermun">
      <span class="odernmu-phone">1884372684<span style="padding:0 0.186667rem;color:#333333">|</span>2018-06-13 11:08</span>
      <span class="ordernum-status">已失效</span>
    </section>
    <section class="order-list">  
        <div class="title">紫金港路浙江大学时湖校区西区C4号<span class="go">icon</span></div>
        <div class="detail">  
          <div class="orderpic"><img src="../../assets/img/home/icon_near2x.png" alt=""></div>
          <div class="content">
              <p class="con-title">海尔8KgFh069Fd2F</p>
              <p class="con-type">标准洗<span style="padding:0 0.346667rem">|</span>时长40分钟</p>
              <p class="con-price">¥560</p>
          </div>
          <div class="order-action">预约</div>
        </div>
    </section>
  </div>
</div>
</template>
<script>
import QHeader from '@/components/header';
export default {
  data() {
    return {
      title: '订单管理',
      searchData:'',
      titleArr:['全部','待支付','已支付','已失效','已退款',],
      titleIndex:0,

    };
  },
  mounted() {
    
  },
  methods: {
    titleClick: function(index) {
      this.titleIndex = index;
    },
  },
  components:{
    QHeader,
  }
};
</script>
<style type="text/css" lang="less" scoped>
  .sarch-wrap {
    padding: 0.266667rem;
    height: 1.706667rem;
    background: #fff;
    input {
      background:rgba(255,255,255,1);
      box-shadow:0px 0.053333rem 0.133333rem 0px rgba(186,192,210,0.3);
      border-radius:0.133333rem;
      font-size: 16px;
      height:1.173333rem;
    }
  }
  .order-status {
    display: flex;
    font-size: 14px;
    color: #333;
    text-align: center;
    background: #fff;
    height: 1.173333rem;
    line-height: 1.173333rem;
    opacity:0.6;
    border-bottom:1px solid rgba(220,224,230,1);
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
  .ordermun {
    padding: 0 0.4rem;
    height: 1.173333rem;
    line-height: 1.173333rem;
    font-size:14px;
    background: #fff;
    .odernmu-phone {
      font-family:PingFangSC-Regular;
      color:rgba(153,153,153,1);
    }
    .ordernum-status {
      display: inline-block;;
      float: right;
      right: 0.4rem;
    }
  }
  .orderpic{
    width: 100%;
    display: block;
  }
  .alllist {
     margin-bottom: 0.266667rem;
  }
  .order-list {
    padding:0.426667rem 0.4rem;
    background:rgba(248,252,255,1);
    .title {
      font-size: 16px;
    }
    .go {
      float: right;
      color: #D1D1D6;
    }
    .detail {
      display: flex;
      padding-top:0.373333rem; 
    }
    .orderpic {
      width:1.84rem;
      height:1.786667rem;
      border-radius:0.133333rem;
      background: #ccc;
      img {
        width: 100%;
      }
    }
    .content {
      width: 6.293333rem;
      height: 2.653333rem;
      padding-left: 0.266667rem; 
      .con-title {
          font-size: 14px;
      }
      .con-type{
          font-size: 12px;
          color: #999999;
          padding-top: 0.106667rem;
          padding-bottom: 0.266667rem;
      }
      .con-price{
        font-size: 18px;
        color: #FF5F5F
      }
    }
  }
  .order-action {
    width:1.066667rem;
    height:0.453333rem;
    line-height:0.453333rem;
    background:rgba(236,245,255,1);
    border-radius:0.053333rem;
    border:1px solid rgba(179,217,255,1);
    font-size: 12px;
    color: #3F9EFF;
    text-align: center;
  }
  .listaction {
    background: #fff;
    overflow: hidden;
    padding: 0.266667rem;
    span {
      float: right;
      width:2.133333rem;
      height:0.8rem;
      line-height: 0.8rem;
      border-radius:0.106667rem;
      border:0.026667rem solid rgba(216,216,216,1);
      font-size: 14px;
      color: #333;
      text-align: center;
      margin:0 0.133333rem;
    }
  }
</style>
<style>
  .mint-header {
    background: #fff !important;
    border-bottom:1px solid #DCE0E6;
  }
</style>
