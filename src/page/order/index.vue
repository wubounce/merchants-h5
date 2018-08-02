<template>
<div class="order-wrap" v-title="title">
  <div class="permissions" v-if="$store.getters.has('mer:order:list')">暂无相关页面权限</div>
  <div v-else>
    <section class="sarch-wrap">
      <div class="search">
         <span class="iconfont icon-IconSearch select-back" @click="searchOrder"></span>
          <input type="text" v-model.trim="searchData" @input="clearSearch" placeholder="请输入用户手机号/订单号查询">
      </div>
    </section>
    <section class="order-status">
      <div v-for="(item,index) in titleArr" @click="titleClick(index)"><span :class="{current: titleIndex === index}">{{item.lable}}</span></div>
    </section>
    <section class="no-order" v-if="nosearchList">
      未找到符合的结果
    </section>
    <section class="no-order" v-if="noOrderList">
      暂无订单
    </section> 
    <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
     <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
        <div class="alllist" v-for="(item,index) in list" :key="index">
          <section class="ordermun">
            <span class="odernmu-phone">{{item.phone}}<span style="padding:0 0.186667rem;color:#333333">|</span>{{item.createTime}}</span>
            <span class="ordernum-status">{{item.orderStatus | orserStatus}}</span>
          </section>
          <router-link :to="{ name: 'orderdetail', query:{orderNo:item.orderNo}}">
          <section class="order-list">  
              <div class="title">{{item.shopName}}<span class="go iconfont icon-nextx"></span></div>
              <div class="detail">  
                <div class="orderpic"><img :src="item.imageId" alt=""></div>
                <div class="content">
                    <p class="con-title">{{item.subType}}</p>
                    <p class="con-type">{{item.machineFunctionName}}<span style="padding:0 0.346667rem">|</span>时长{{item.markMinutes}}分钟</p>
                    <p class="con-price">¥{{item.payPrice}}</p>
                </div>
                <div class="order-action" v-if="item.orderType === 2">预约</div>
              </div>
          </section>
          </router-link>
          <section class="listaction" v-if="item.orderStatus === 2"> 
              <mt-button @click="orderRefund(item.id,item.payPrice,item.subType)" v-has="'mer:order:refund,mer:order:info'">退款</mt-button>
              <mt-button @click="machineBoot(item.id,item.subType)" v-if="item.machineType === 1" v-has="'mer:order:start,mer:order:info'">启动</mt-button>
              <mt-button @click="machineReset(item.id,item.machineId,item.subType)" v-has="'mer:order:reset,mer:order:info'">复位</mt-button>
          </section>
        </div>
        <div v-if="allLoaded" class="nomore-data">没有更多了</div>
      </mt-loadmore>
    </div>
  </div>
</div>
</template>
<script>
import qs from 'qs';
import { orderStatus } from '@/utils/mapping';
import { orderListFun,searchOrderFun, ordeRrefundFun, machineResetFun, machineBootFun } from '@/service/order';
import { MessageBox } from 'mint-ui';
export default {
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
      orderStatus:null, //订单状态

      page: 1,//页码
      pageSize:10,
      total:null,
      allLoaded: false,//数据是否加载完毕
      wrapperHeight: 0,//容器高度
    };
  },
  mounted() {
    let windowWidth = document.documentElement.clientWidth;//获取屏幕高度
    this.wrapperHeight = document.documentElement.clientHeight - 60;
  },
  created(){
    this.getOrderList();
  },
  methods: {
    titleClick: function(index) {
      this.titleIndex = index;
      this.orderStatus = this.titleArr[this.titleIndex].value;
      this.page = 1; //从第一页起
      this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
      this.getOrderList(this.orderStatus);
    },
    async getOrderList(orderStatus){
      let res = null;
      this.nosearchList = false;
      let payload = null;
      if (orderStatus) {
         payload = {orderStatus:orderStatus,page:this.page,pageSize:this.pageSize};
      } else {
        payload = {page:this.page,pageSize:this.pageSize};
      }
      res = await orderListFun(qs.stringify(payload));
      if (res.code === 0) {
        this.list = res.data.items?[...this.list,...res.data.items]:[];  //分页添加
        this.noOrderList = this.list.length<= 0 ? true: false;
        this.total = res.data.total;
      }
    },
    async searchOrder(){ //搜索
      this.noOrderList = false;
      let res = await searchOrderFun(qs.stringify({orderNo:this.searchData,phone:this.searchData,page:1,pageSize:20}));
      if (res.code === 0) {
        this.list = res.data.items?res.data.items:[];
        this.nosearchList = this.list.length<= 0 ? true: false;
      }
    },
    clearSearch(){ //清楚搜索
      if(this.searchData.length<=0)this.getOrderList(this.orderStatus);
    },
    godetail(oederno,machineId){
      this.$router.push({name: 'orderdetail',query:{orderNo:oederno}});
    },
    loadBottom() {
      this.page += 1;
      let allpage = this.total/this.pageSize;
      if(this.page <= allpage){
        this.getOrderList(this.orderStatus);
      }else{
        this.allLoaded = true;//模拟数据加载完毕 禁用上拉加载
      }
      this.$refs.loadmore.onBottomLoaded();
    },
    loadTop() {
      this.page = 1;
      this.list = [];
      this.getOrderList(this.orderStatus);
      this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
      this.$refs.loadmore.onTopLoaded();
    },
    machineReset(id,machineId,subType){ //设备复位
      MessageBox.confirm(`确定复位${subType}？`).then(async () => {
          let query = this.$route.query;
          let payload = {machineId:machineId,orderNo:id};
          let res = await machineResetFun(qs.stringify(payload));
          if (res.code === 0) {
            this.$toast({message: '复位成功' });
          } else {
            this.$toast({message: res.msg });
          }
      });
      
    },
    machineBoot(id,subType){ //设备启动
      MessageBox.confirm(`您确定要启动${subType}？`).then(async () => {
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
    orderRefund(id,payPrice){ //退款
      MessageBox.confirm('确定发起退款？').then(async () => {
        let query = this.$route.query;
        let payload = {orderNo:id,refundMoney:payPrice};
        let res = await ordeRrefundFun(qs.stringify(payload));
        if (res.code === 0) {
          this.$toast({message: '退款成功' });
        } else {
          this.$toast({message: '退款失败' });
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
  }
};
</script>
<style type="text/css" lang="less" scoped>
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
    input {
      font-size: 16px;
      height:1.173333rem;
    }
    .select-back {
      line-height: 1.173333rem;
      margin-right: 0.27rem;
      margin-left: 0.27rem;
      color: #999;
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
  margin: 2rem 0;
  background: #efeff4;
}
.page-loadmore-wrapper {
  overflow: scroll
}
.nomore-data {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin-bottom: 0.266667rem;
}
</style>
<style>
  .order-wrap .mint-header {
    background: #fff !important;
    border-bottom:1px solid #DCE0E6;
  }
  .order-wrap .mint-loadmore-top, .mint-loadmore-text {
    font-size: 14px;
    text-align: center;
    color: #999;
  }
</style>


