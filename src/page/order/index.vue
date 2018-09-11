<template>
<div class="order-wrap">
  <div class="permissions" v-if="$store.getters.has('mer:order:list')">暂无相关页面权限</div>
  <div v-else>
    <div class="search-header">
      <section class="sarch-wrap">
        <div class="search">
            <form action="" target="frameFile" v-on:submit.prevent="">
              <span class="iconfont icon-IconSearch"></span><input type="text" value='搜索' v-model.trim="searchData" @keyup.enter="searchOrder" @input="clearSearch" placeholder="请输入用户手机号/订单号查询" class="serch">
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
       <div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}">
         <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
         <div class="ios">
           <div class="alllist" v-for="(item,index) in list" :key="index">
              <section class="ordermun">
                <span class="odernmu-phone">{{item.phone}}<span style="padding:0 0.186667rem;color:#999999">|</span>{{item.createTime}}</span>
                <span class="ordernum-status">{{item.orderStatus | orserStatus}}</span>
              </section>
              <router-link :to="{ name: 'orderdetail', query:{orderNo:item.orderNo,orderType:item.orderType}}"> 
              <section class="order-list">  
                  <div class="title"><span class="ovh-shop">{{item.shopName}}</span><span class="go iconfont icon-nextx"></span></div>
                  <div class="detail">  
                    <div class="orderpic"><img :src="item.imageId" alt=""></div>
                    <div class="content">
                        <p class="con-title">{{item.machineName}}</p>
                        <p class="con-type">{{item.machineFunctionName}}<span style="padding-left:0.35rem;padding-right:0.27rem" v-if="item.isESource === 0">|</span><span v-if="item.isESource === 0">时长{{item.markMinutes}}分钟</span></p>
                        <p class="con-price" v-if="item.orderType !== 2 && item.orderStatus !==1 || item.orderType !==2 && item.orderStatus !==0">{{'¥'+item.payPrice}}</p>
                    </div>
                    <div class="order-action" v-if="item.isReserve === 1">预约</div>
                  </div>
              </section>
              </router-link>
              <section class="listaction" v-if="item.orderStatus === 2"> 
                  <mt-button @click="orderRefund(item.orderNo,item.payPrice)" v-has="'mer:order:refund,mer:order:info'" :disabled="refundDisabled">退款</mt-button>
                  <mt-button @click="machineBoot(item.id,item.machineName)" v-if="item.isESource === 0" v-has="'mer:order:start,mer:order:info'">启动</mt-button>
                  <mt-button @click="machineReset(item.orderNo,item.machineId,item.machineName)"  v-if="item.isESource === 0" v-has="'mer:order:reset,mer:order:info'">复位</mt-button>
              </section>
            </div>
         </div>
            
            <div v-if="allLoaded" class="nomore-data">没有更多了</div>
          </mt-loadmore>
        </div>
    </div>
   
  </div>
</div>
</template>
<script>
import { orderStatus } from '@/utils/mapping';
import { orderListFun,searchOrderFun, ordeRrefundFun, machineResetFun, machineBootFun } from '@/service/order';
import { MessageBox } from 'mint-ui';
import { getDuration } from '@/utils/tool';
import { validatSearch, validatReplace } from '@/utils/validate';
import PagerMixin from '@/mixins/pagerMixin';
export default {
  mixins: [PagerMixin],
  data() {
    return {
      pageSize:20,
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
      hiddenPageHeight:2.88,
      refundDisabled:false,
    };
  },
  mounted() {
    
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
         // 去掉特殊字符和空格
        let searchData = this.searchData.replace(validatReplace, '');
        payload = {search:searchData,page:this.page,pageSize:this.pageSize};
      } else {
        payload = {orderStatus:this.orderStatus,page:this.page,pageSize:this.pageSize};
      }
      res = await orderListFun(payload);
      this.list = res.items?[...this.list,...res.items]:[];  //分页添加
      this.list.length <= 0 ? this.noOrderList = true:this.noOrderList = false;
      this.total = res.total;
      if (this.searchData) {
        this.hiddenTab = false;
        this.hiddenPageHeight = 1.71;
        this.nosearchList = this.list.length<= 0 ? true: false;
      } else {
        this.hiddenTab = true;
        this.noOrderList = this.list.length<= 0 ? true: false;
      }
    },
    async searchOrder(e){ //搜索
      this.hiddenTab = false;
      this.noOrderList = false;
      this.titleIndex = 0; //全部tab 显示数据
      this.orderStatus = '';//全部tab 显示数据
      this.list = [];
      this.page = 1;
      this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
      var keyCode = window.event? e.keyCode:e.which;
      if(keyCode =='13'){
        this._getList();
        document.activeElement.blur();
      }else {
        this._getList();
      }
    },
    clearSearch(){ //清楚搜索
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
          let res = await machineResetFun(payload);
          this.$toast({message: '复位成功' });
      });
      
    },
    machineBoot(id,machineName){ //设备启动
      MessageBox.confirm(`您确定要启动${machineName}？`,'').then(async () => {
        let query = this.$route.query;
        let payload = {orderId:id};
        let res = await machineBootFun(payload);
        this.$toast({message: '启动成功' });
      });
      
    },
    orderRefund(oederno,payPrice){ //退款
      this.refundDisabled = true;
      MessageBox.confirm('',{ 
        message: '确定发起退款？', 
        closeOnClickModal:false
      }).then(async () => {
        let query = this.$route.query;
        let payload = {orderNo:oederno,refundMoney:payPrice};
        let res = await ordeRrefundFun(payload);
        this.refundDisabled = false;
        this.$toast({message: '退款成功' });
        this.page = 1;
        this.list = [];
        this._getList();
      }).catch(err => { 
         this.refundDisabled = false;
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
<style lang="scss" scoped>
 @import "../../assets/scss/order/order.scss";
</style>
