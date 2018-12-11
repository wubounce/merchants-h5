<template>
<div class="order-wrap">
  <div class="permissions" v-if="!$store.getters.has('mer:order:list')">暂无相关页面权限</div>
  <div v-if="$store.getters.has('mer:order:list')">
    <div class="search-header">
      <section class="sarch-wrap">
        <div class="search">
            <form action="" target="frameFile" v-on:submit.prevent="">
              <span class="iconfont icon-IconSearch"></span><input type="text" value='搜索' v-model.trim="searchData" @keyup.enter="searchOrder" @input="clearSearch" placeholder="按用户手机号/订单号/设备名" class="serch">
              <iframe name='frameFile' style="display: none;"></iframe>
              <span class="select-back" @click="searchOrder">搜索</span>
            </form>
        </div>
        <div class="coupon-date" @click="historyVisible=true"><p class="iconfont icon-rili" ></p><p class="history-txt">{{historyCurrent.title | historyMonth}}</p></div>
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
                  <router-link :to="{ name: 'orderdetail', query:{orderNo:item.orderNo,searchData:searchData,tableId:historyCurrent.id,tableIdtitle:historyCurrent.title,orderStatus:orderStatus,titleIndex:titleIndex}}"> 
                  <section class="order-list">  
                    <div class="title"><span class="iconfont icon-dianpu2"></span><span class="ovh-shop">{{item.shopName}}</span><span class="go iconfont icon-nextx"></span></div>
                    <div class="machine-name"><span class="iconfont icon-xiyiji1"></span><span class="ovh-shop">{{item.machineName}}</span><span class="con-price" v-if="item.orderType !== 2 && item.orderStatus !==1 || item.orderType !==2 && item.orderStatus !==0">{{'¥'+item.payPrice}}</span></div>
                    <div class="con-type"><span class="iconfont icon-iconfontmoshi"></span>{{item.machineFunctionName}}<span style="padding-left:0.13rem;padding-right:0.19rem" v-if="item.isESource === 0">|</span><span v-if="item.isESource === 0">时长{{item.markMinutes}}分钟</span><div class="order-action" v-if="item.isReserve === 1">预约</div></div>
                  </section>
                  </router-link>
                  <section class="listaction" v-if="item.orderStatus === 2 && !historyCurrent.id"> 
                      <mt-button @click="orderRefund(item.orderNo,item.payPrice,item.userId)" v-has="'mer:order:refund'" :disabled="refundDisabled">退款</mt-button>
                      <span v-if="item.shopState === 2">
                        <mt-button @click="gocompensate(item.orderNo,item.phone,item.shopName,item.shopId,item.parentTypeName,item.markPrice,item.userId)" v-has="'mer:order:compensate'">补偿</mt-button>
                      </span>
                      <mt-button @click="machineBoot(item.id,item.machineName,item.userId)" v-if="item.isESource === 0 || item.isESource === null" v-has="'mer:order:start'">启动</mt-button>
                      <mt-button @click="machineReset(item.orderNo,item.machineId,item.machineName)"  v-if="item.isESource === 0 || item.isESource === null" v-has="'mer:order:reset'">复位</mt-button>
                  </section>
                </div>
            </div>
          <div v-if="allLoaded" class="nomore-data">没有更多了</div>
          </mt-loadmore>
        </div>
    </div>
    <!-- 设备类型 -->
    <selectpickr :visible="historyVisible" :slots="historySlots" :valueKey="historyLable" :title="'历史订单'"  @selectpicker="historyPicker" @onpickstatus="historyPickertatus"></selectpickr>
  </div>
</div>
</template>
<script>
import { orderStatus } from '@/utils/mapping';
import { orderListFun,searchOrderFun, ordeRrefundFun, machineResetFun, machineBootFun, historySelectFun } from '@/service/order';
import { MessageBox } from 'mint-ui';
import { getDuration } from '@/utils/tool';
import { validatSearch, validatReplace } from '@/utils/validate';
import PagerMixin from '@/mixins/pagerMixin';
import selectpickr from '@/components/selectPicker';
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
        {value:'1',lable:'支付超时'},
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

      historyCurrent:{}, //历史订单
      historyVisible:false,
      historyLable:'title',
      historySlots:[
        {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
      ],
    };
  },
  mounted() {
    
  },
  created(){
    let query = this.$route.query?this.$route.query:{};
    this.searchData = query.searchData?query.searchData:'';
    this.historyCurrent.id = query.tableId?query.tableId:'';
    this.historyCurrent.title = query.tableIdtitle?query.tableIdtitle:'近三个月';
    this.orderStatus = query.orderStatus?query.orderStatus:'';
    this.titleIndex = query.titleIndex? Number(query.titleIndex):0;
    if (this.searchData) {
        this.hiddenTab = false;
        this.hiddenPageHeight = 1.71;
      } else {
        this.hiddenTab = true;
      }
    this.historylist();
    this._getList();
  },
  methods: {
    titleClick(index) {
      this.searchData = '';
      this.titleIndex = index;
      this.orderStatus = this.titleArr[this.titleIndex].value;
      this.page = 1; //从第一页起
      this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
      this.list = [];
      this._getList();
    },
    async _getList(){
      this.nosearchList = false;
      if (this.searchData !== '') {
           // 去掉特殊字符和空格
          this.searchData = this.searchData.replace(validatReplace, '');
        }
      let payload = {orderStatus:this.orderStatus,search:this.searchData,tableId:this.historyCurrent.id,page:this.page,pageSize:this.pageSize}; 
      let res = await orderListFun(payload);
      this.list = res.items?[...this.list,...res.items]:[];  //分页添加
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
    async historylist(){
      let res = await historySelectFun();
      this.historySlots[0].values = res.length>0 ? [{id:'',title:'近三个月'},...res]:[];
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
    historyPicker(value) {
      if (value) {
        this.historyCurrent = value;
        this.list = [];
        this.page = 1;
        this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
        this._getList();
      }
    },
    historyPickertatus(value) {
      this.historyVisible = value;
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
    machineBoot(id,machineName,memberId){ //设备启动
      MessageBox.confirm(`您确定要启动${machineName}？`,'').then(async () => {
        let query = this.$route.query;
        let payload = {orderId:id,memberId:memberId};
        let res = await machineBootFun(payload);
        this.$toast({message: '启动成功' });
      });
      
    },
    orderRefund(oederno,payPrice,memberId){ //退款
      this.refundDisabled = true;
      MessageBox.confirm('',{ 
        message: '确定发起退款？', 
        closeOnClickModal:false
      }).then(async () => {
        let query = this.$route.query;
        let payload = {orderNo:oederno,refundMoney:payPrice,memberId:memberId};
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
    gocompensate(orderno,phone,shopName,shopId,parentTypeName,markPrice,memberId){
      this.$router.push({name:'compensate',query:{orderno:orderno,phone:phone,shopName:shopName,shopId:shopId,parentTypeName:parentTypeName,markPrice:markPrice,memberId:memberId}});
    }
  },
  filters: {
    orserStatus: (value)=>{
      return orderStatus(value);
    },
    historyMonth: (value)=>{
      if(value&&value.startsWith('2017')){
        return '2017';
      }else{
        return value&&value !== '近三个月' ? value.replace('年','.').replace('月',''):'近三个月';
      }
    }
  },
  components:{
    selectpickr
  }
};
</script>
<style lang="scss" scoped>
 @import "../../assets/scss/order/order.scss";
</style>
<style>
  @media screen and (max-width: 360px) {
    input::-webkit-input-placeholder {
      color: #999;
      font-size: 12px;
    }
    
    input:-moz-placeholder {
      color: #999;
      font-size: 12px;
    }
    
    input::-moz-placeholder {
      color: #999;
      font-size: 12px;
    }
    
    input :-ms-input-placeholder {
      color: #999;
      font-size: 12px;
    }
    .sarch-wrap .search{
      width: 8rem !important;
    }
    .sarch-wrap .search input {
      width: 5.4rem !important;
    }
    .sarch-wrap .coupon-date {
      width: 1.6rem !important;
    }
    .listaction button {
      font-size: 12px !important;
    }
    .select-back {
      font-size: 14px;
    }
  }
</style>
