<template>
<section class="discountCoupon  page-loadmore-height">
  <div class="permissions" v-if="$store.getters.has('mer:voucher')">暂无相关页面权限</div>
  <div class="page-loadmore-height" v-else>
    <div class="discountCoupon-head">
      <div class="search-header">
        <section class="sarch-wrap">
          <div class="search">
              <form action="" target="frameFile" v-on:submit.prevent="">
                <span class="iconfont icon-IconSearch"></span>
                <input type="number" pattern="\d*" value='搜索'v-model.trim="searchData" @keyup.enter="searchVoucher" @input="clearSearch" placeholder="请输入用户手机号" class="serch">
                <span class="guanbi iconfont icon-guanbi" v-if="iscolsed" @click="doclearSearch"></span>
                <iframe name='frameFile' style="display: none;"></iframe>
                <span class="select-back" @click="searchVoucher">搜索</span>
              </form>
          </div>
          <div class="coupon-date" @click="openByDialog"><span class="iconfont icon-rili"></span></div>
        </section>
      </div>
      <div class="device-status">
        <div  @click="titleClick(null)">
          <p :class="{current:titleIndex === null}">全部</p>
          <span :class="{current:titleIndex === null}">{{titleArr.all}}</span>
        </div>
        <div @click="titleClick(0)">
          <p :class="{current: titleIndex === 0}">未使用</p>
          <span :class="{current: titleIndex === 0}">{{titleArr.notUse+titleArr.locked}}</span>
        </div>
        <div @click="titleClick(1)">
          <p :class="{current: titleIndex === 1}">已使用</p>
          <span :class="{current: titleIndex === 1}">{{titleArr.used}}</span>
        </div>
        <div @click="titleClick(2)">
          <p :class="{current: titleIndex === 2}">已过期</p>
          <span :class="{current: titleIndex === 2}">{{titleArr.expired}}</span>
        </div>
      </div>
    </div>
    <div class="no-order" v-if="nosearchList"><p>未找到符合的结果</p></div>
    <div class="no-order" v-if="noOrderList"><p>暂无相关记录</p></div> 
    <div class="page-top">
      <div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
          <div class="coupon-content">
            <ul>
              <li class="list" v-for="(item,index) in list" :key="index">
                <router-link :to="{name:'couponDetail',query:{id:item.id}}">
                  <div class="price-content">
                    <span :class="['yang',{'expieed':item.status ===2||item.status ===1}]">¥</span><span :class="['inter',{'expieed':item.status ===2||item.status ===1}]">{{item.firstMOney}}</span><span :class="['float',{'expieed':item.status ===2||item.status ===1}]">.{{item.secondMOney}}</span>
                  </div>
                  <div class="rules-content">
                    <p class="title">{{item.merchantType | CouponType}}</p>
                    <p>限手机号{{item.phone}}使用</p>
                    <p>发放时间{{item.createTime}}</p>
                  </div>
                  <span class="tag" v-if="item.status===2"><img src="../../../static/image/market/exirped@.png" alt=""></span>
                  <span class="tag" v-if="item.status===1"><img src="../../../static/image/market/used.png" alt=""></span>
                </router-link>
              </li>
            </ul>
          </div>
          <div v-if="allLoaded" class="nomore-data">没有更多了</div>
        </mt-loadmore>
      </div>
    </div>
    <!-- 日历选择 -->
    <mt-popup v-model="calendar.show" position="bottom" class="mint-popup">
      <div v-if="tooltip" class="ivu-tooltip-inner">{{tooltip}}</div>
      <div class="calendar-dialog-body" v-if="isreset">
          <calendar :range="calendar.range" :zero="calendar.zero" :lunar="calendar.lunar" :begin="calendar.begin" :end="calendar.end" :type="calendar.type" :value="calendar.value"  @select="calendar.select"></calendar>
          <div class="footer">
            <div>
                <mt-button class="ca-coupon-btn" @click="selectDateCom">确定</mt-button>
            </div>
            <div>
              <mt-button class="ca-coupon-btn reset" @click="resetDate">重置</mt-button>
            </div>
          </div>
      </div>
    </mt-popup>
  </div>
</section>
</template>

<script>
  import { voucherListFun } from '@/service/voucher';
  import PagerMixin from '@/mixins/pagerMixin';
  import { CouponType } from '@/utils/mapping';
  import calendar from '@/components/vue-calendar/calendar.vue';
  import { validatReplace } from '@/utils/validate';
  export default {
    mixins: [PagerMixin],
    data () {
      return {
        pageSize:20,
        list:[],
        searchData:'',
        titleArr:{
          all:'',
          notUse:'',
          locked:'',
          used:'',
          expired:''
        },
        titleIndex:null,
        status:'',//状态
        noOrderList:false,
        nosearchList:false,
        iscolsed:false,
        startDate:[],
        endDate: [],
        tooltip:'',
        calendar:{
            range:true,
            lunar:false, //显示农历
            show:false,
            zero:true,
            type:'datetime',
            value:[], //默认日期
            select:(begin,end)=>{
              this.startDate = begin;
              this.endDate = end;
              let startTime = this.startDate.join('');  
              let temp =  moment(this.startDate).add('months',5).format('YYYYMMDD');  //从开始时间起六个月间隔
              let endTime =  this.endDate.join('');  
              if(endTime>temp){
                this.tooltip = '只支持查询跨度6个月内记录';
                setTimeout(()=>{
                  this.tooltip = '';
                },3000);
                return false;
              }else {
                this.tooltip = '';
              }
            }
        },
        isreset:true,
      };
    },
    created() {
    },
    methods:{
      titleClick(index=null) {
        this.titleIndex = index;
        this.status = index;
        this.repeatlist();
      },
      repeatlist(){
        this.list = [];
        this.page = 1;
        this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
        this._getList();
      },
      async _getList() {
        if (this.searchData !== '') {
           // 去掉特殊字符和空格
          this.searchData = this.searchData.replace(validatReplace, '');
        }
        let payload =  {status:this.status,phone:this.searchData,startDate:this.startDate.join('-'),endDate:this.endDate.join('-'),page:this.page,pageSize:this.pageSize};
        let res = await voucherListFun(payload);
        this.titleArr = res.count;
        this.list = res.page?[...this.list,...res.page.items]:[];  //分页添加
        this.total = res.page.total;
        this.list.forEach(item => {
          let temp = item.faceValue.split('.');
          item['firstMOney'] = temp[0];
          item['secondMOney'] = temp[1];
          item.createTime = moment(item.createTime).format('YYYY.MM.DD  HH:mm:ss');
        });
        if (this.searchData || (this.startDate.length > 0 && this.endDate.length > 0)) {
          this.noOrderList = false;
          this.nosearchList = this.list.length<= 0 ? true: false;
        }else {
          this.nosearchList = false;
          this.noOrderList = this.list.length<= 0 ? true: false;
        }
      },
      openByDialog(){
        this.calendar.show=true;
        this.isreset=true;
      },
      selectDateCom(){
        let startTime = this.startDate.join('');  
        let temp =  moment(this.startDate).add('months',5).format('YYYYMMDD');  //从开始时间起六个月间隔
        let endTime =  this.endDate.join('');  
        if(endTime>temp){
          this.tooltip = '只支持查询跨度6个月内记录';
          setTimeout(()=>{
            this.tooltip = '';
          },3000);
          return false;
        }else {
          this.tooltip = '';
        }
        this.calendar.show=false;
        this.noOrderList = false;
        this. repeatlist();
      },
      resetDate(){
        this.calendar.show=false;
        this.startDate = [],
        this.endDate = [],
        this.isreset=false;
        this.noOrderList = false;
        this. repeatlist();
      },
      async searchVoucher(e){ //搜索
        this.noOrderList = false;
        var keyCode = window.event? e.keyCode:e.which;
        if(keyCode =='13'){
          this. repeatlist();
          document.activeElement.blur();
        }else {
          this. repeatlist();
        }
      },
      clearSearch(){ //清除搜索
        this.iscolsed = true;
        if(this.searchData.length <= 0 ){
          this.iscolsed = false;
          this. repeatlist();
        }
      },
      doclearSearch(){
        this.searchData = '';
        this.iscolsed = false;
        this. repeatlist();
      }
    },
    filters: {
      CouponType: function (value) {
        return CouponType(value);
      },
    },
    components:{
      calendar,
    }
  };
</script>

<style lang='scss' scoped type='text/css'>
  @import '../../assets/scss/marketing/discountCoupon';
  .ivu-tooltip-inner {
      padding: 0.2rem 0.4rem;
      color: #fff;
      text-align: left;
      text-decoration: none;
      background: rgba(0, 0, 0, 0.65);
      border-radius: 0.08rem;
      word-wrap: break-word;
      word-break: break-all;
      font-size: 14px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      width: 55%;
  }
</style>
<style>
  @media screen and (max-width: 360px) {
    input::-webkit-input-placeholder {
      color: #999;
      font-size: 14px;
    }
    
    input:-moz-placeholder {
      color: #999;
      font-size: 14px;
    }
    
    input::-moz-placeholder {
      color: #999;
      font-size: 14px;
    }
    
    input :-ms-input-placeholder {
      color: #999;
      font-size: 14px;
    }
    .sarch-wrap .search input[data-v-7291fb72] {
      width: 5.4rem;
    }
    .select-back {
      font-size: 14px;
    }
  }
</style>