<template>
<div class="order-wrap" v-title="title">
  <div class="permissions" v-if="$store.getters.has('mer:order:list')">暂无相关页面权限</div>
  <div v-else>
    <div class="search-header">
      <section class="sarch-wrap">
        <div class="search">
            <form action="" target="frameFile" v-on:submit.prevent="">
              <input type="number" value='搜索' v-model.trim="searchData" @keyup.enter="searchOrder" @input="clearSearch" placeholder="请输入用户手机号/订单号查询" class="serch">
              <iframe name='frameFile' style="display: none;"></iframe>
              <span class="select-back" @click="searchOrder">搜索</span>
            </form>
        </div>
      </section>
      <div class="hidden-tab"  v-if="hiddenTab">  
        <section class="order-status">
          <div v-for="(item,index) in titleArr" @click="titleClick(index)"><span :class="{current: titleIndex === index}">{{item.lable}}</span></div>
        </section>
      </div>
    </div>
    <div class="no-order" v-if="nosearchList"><p>未找到符合的结果</p></div>
    <div class="no-order" v-if="noOrderList"><p>暂无订单</p></div> 
    <div class="page-top" :style="{ 'padding-top': hiddenPageHeight + 'rem' }">
       <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
         <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
            <div class="alllist" v-for="(item,index) in list" :key="index">
              <section class="ordermun">
                <span class="odernmu-phone">{{item.phone}}<span style="padding:0 0.186667rem;color:#333333">|</span>{{item.createTime}}</span>
                <span class="ordernum-status">{{item.orderStatus | orserStatus}}</span>
              </section>
              <router-link :to="{ name: 'orderdetail', query:{orderNo:item.orderNo,orderType:item.orderType}}"> 
              <section class="order-list">  
                  <div class="title"><span class="ovh-shop">{{item.shopName}}</span><span class="go iconfont icon-nextx"></span></div>
                  <div class="detail">  
                    <div class="orderpic"><img :src="item.imageId" alt=""></div>
                    <div class="content">
                        <p class="con-title">{{item.machineName}}</p>
                        <p class="con-type">{{item.machineFunctionName}}<span style="padding:0 0.346667rem">|</span>时长{{item.markMinutes}}分钟</p>
                        <p class="con-price" v-if="item.orderType !== 2 && item.orderStatus !==1 || item.orderType !==2 && item.orderStatus !==0">¥{{item.payPrice}}</p>
                        <!-- <p><q-count-down :type="2" :time="item.activeTime" @finish="hanldeActive"/></q-count-dow></p> -->
                    </div>
                    <div class="order-action" v-if="item.isReserve === 1">预约</div>
                  </div>
              </section>
              </router-link>
              <section class="listaction" v-if="item.orderStatus === 2"> 
                  <mt-button @click="orderRefund(item.orderNo,item.payPrice)" v-has="'mer:order:refund,mer:order:info'">退款</mt-button>
                  <mt-button @click="machineBoot(item.id,item.machineName)" v-has="'mer:order:start,mer:order:info'">启动</mt-button>
                  <mt-button @click="machineReset(item.orderNo,item.machineId,item.machineName)" v-has="'mer:order:reset,mer:order:info'">复位</mt-button>
              </section>
            </div>
            <div v-if="allLoaded" class="nomore-data">没有更多了</div>
          </mt-loadmore>
        </div>
    </div>
   
  </div>
</div>
</template>
<script>
import qs from 'qs';
import { orderStatus } from '@/utils/mapping';
import { orderListFun,searchOrderFun, ordeRrefundFun, machineResetFun, machineBootFun } from '@/service/order';
import { MessageBox } from 'mint-ui';
import QCountDown from '@/components/CountDown';
import { getDuration } from '@/utils/tool';
import { validatSearch } from '@/utils/validate';
import PagerMixin from '@/mixins/pagerMixin';
export default {
  mixins: [PagerMixin],
  data() {
    return {
      title: '订单管理',
      searchData:'',
      titleArr:[
        {value:'',lable:'全部'},
        {value:'0',lable:'待支付'},
        {value:'2',lable:'已支付'},
        {value:'1',lable:'已失效'},
        {value:'5',lable:'已退款'}
      ],
      list:[],
      titleIndex:0,
      noOrderList:false,
      nosearchList:false,
      orderStatus:'', //订单状态
      hiddenTab:true,
      hiddenPageHeight:2.88 
    };
  },
  mounted() {
    this.wrapperHeight = document.documentElement.clientHeight;
  },
  created(){
  },
  methods: {
    titleClick: function(index) {
      this.list = [];
      this.searchData = '';
      this.titleIndex = index;
      this.orderStatus = this.titleArr[this.titleIndex].value;
      this.page = 1; //从第一页起
      this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
      this._getList();
    },
    async _getList(){
      let res = null;
      this.nosearchList = false;
      let payload = null;
      if (this.searchData !== '') {
         payload = {search:this.searchData,page:this.page,pageSize:this.pageSize};
      } else {
        payload = {orderStatus:this.orderStatus,page:this.page,pageSize:this.pageSize};
      }
      res = await orderListFun(qs.stringify(payload));
      if (res.code === 0) {
        this.list = res.data.items?[...this.list,...res.data.items]:[];  //分页添加
        this.total = res.data.total;
        // this.list.forEach(item => {
        //   var time = getDuration(item.activeTime);
        //   console.log(time);
        //       if(time > 0) {
        //         item.activeTime = time;
        //       } else {
        //          item.activeTime = -time;
        //       }
        // });
        if (this.searchData) {
          this.nosearchList = this.list.length<= 0 ? true: false;
          this.hiddenPageHeight = 1.71;
        } else {
          this.noOrderList = this.list.length<= 0 ? true: false;
        }
      }else {
        if (this.searchData) {
          this.nosearchList = true;
        } else {
          this.noOrderList = this.list.length<= 0 ? true: false;
        }
        
      }
    },
    // // 预约订单倒计时回调
    // hanldeActive() {
    //   this.activeTime = 0;
    // },
    async searchOrder(e){ //搜索
      if (this.searchData !== '' && !validatSearch(this.searchData)) {
        this.$toast({message: "搜索内容只支持英文字母和数字" });
        return false;
      }
      this.hiddenTab = false;
      this.noOrderList = false;
      this.titleIndex = 0; //全部tab 显示数据
      this.orderStatus = '';//全部tab 显示数据
      this.list = [];
      this.page = 1;
      var keyCode = window.event? e.keyCode:e.which;
      if(keyCode =='13'){
        this._getList();
        document.activeElement.blur();
      }else {
        this._getList();
      }
    },
    clearSearch(){ //清楚搜索
      if (!validatSearch(this.searchData)) {
        this.$toast({message: "搜索内容只支持英文字母和数字" });
        return false;
      }
      if(this.searchData.length <= 0 ){
        this._getList();
        this.hiddenTab = true;
        this.hiddenPageHeight = 2.88;
      }
    },
    godetail(oederno,machineId){
      this.$router.push({name: 'orderdetail',query:{orderNo:oederno}});
    },
    machineReset(oederno,machineId,machineName){ //设备复位
      MessageBox.confirm(`您确定要复位${machineName}？`,'').then(async () => {
          let query = this.$route.query;
          let payload = {machineId:machineId,orderNo:oederno};
          let res = await machineResetFun(qs.stringify(payload));
          if (res.code === 0) {
            this.$toast({message: '复位成功' });
          } else {
            this.$toast({message: res.msg });
          }
      });
      
    },
    machineBoot(id,machineName){ //设备启动
      MessageBox.confirm(`您确定要启动${machineName}？`,'').then(async () => {
        let query = this.$route.query;
        let payload = {orderId:id};
        let res = await machineBootFun(qs.stringify(payload));
        if (res.code === 0) {
          this.$toast({message: '启动成功' });
        } else {
          this.$toast({message: res.msg });
        }
      });
      
    },
    orderRefund(oederno,payPrice){ //退款
      MessageBox.confirm('确定发起退款？','').then(async () => {
        let query = this.$route.query;
        let payload = {orderNo:oederno,refundMoney:payPrice};
        let res = await ordeRrefundFun(qs.stringify(payload));
        if (res.code === 0) {
          this.$toast({message: '退款成功' });
          this.page = 1;
          this.list = [];
          this._getList();
        } else {
          this.$toast(res.msg);
        }
      });
    },
  },
  filters: {
    orserStatus: function (value) {
      return orderStatus(value);
    },
  },
  components:{
    QCountDown
  }
};
</script>
<style type="text/css" lang="less" scoped>
.order-wrap {
  height: 100%;
  >div {
    height: 100%;
  }
}
.search-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
}
.sarch-wrap{
  background: #ffffff;
  padding: 0.27rem;
  .search {
    -webkit-box-shadow: 0px 0.053333rem 0.133333rem 0px rgba(186, 192, 210, 0.3);
    box-shadow: 0px 0.053333rem 0.133333rem 0px rgba(186, 192, 210, 0.3);
    border-radius: 0.133333rem;
    font-size: 16px;
    height: 1.173333rem;
    display: flex;
    form {
      display: inline-block;
      width: 100%;
      padding-left: 0.33rem;
    }
    input {
      width: 80%;
      font-size: 16px;
      height:1.173333rem;
    }
    .select-back {
      line-height: 1.173333rem;
      padding-right: 0.27rem;
      padding-left: 0.27rem;
      color: #1890FF;
      border-left:1px solid rgba(216,216,216,1);
    }
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
    display: flex;
  }
  .ovh-shop {
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 0.133333rem;
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
  button {
    float: right;
    width:2.133333rem;
    height:0.8rem;
    border-radius:0.106667rem;
    border:0.026667rem solid rgba(216,216,216,1);
    font-size: 14px;
    color: #333;
    text-align: center;
    margin:0 0.133333rem;
    background: #fff;
    box-shadow: none;
  }
}
.no-order {
  font-size: 14px;
  color: #999;
  text-align: center;
  background: #fff;
  height: 100%;
  line-height: 100%;
  padding-top: 4rem;
}
.page-top {
  height: 100%;
}
.page-loadmore-wrapper {
  overflow: scroll
}
</style>
<style>
  .order-wrap .mint-header {
    background: #fff !important;
    border-bottom:1px solid #DCE0E6;
  }
</style>


