<template>
<section class="discountCoupon  page-loadmore-height">
  <div class="discountCoupon-head">
    <div class="search-header">
      <section class="sarch-wrap">
        <div class="search">
            <form action="" target="frameFile" v-on:submit.prevent="">
              <span class="iconfont icon-IconSearch"></span><input type="text" value='搜索'v-model.trim="searchData" @keyup.enter="searchVoucher" @input="clearSearch" placeholder="请输入用户手机号" class="serch">
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
        <span :class="{current: titleIndex === 0}">{{titleArr.notUse}}</span>
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
                  <span :class="['yang',{'expieed':item.status ===2}]">¥</span><span :class="['inter',{'expieed':item.status ===2}]">{{item.firstMOney}}</span><span :class="['float',{'expieed':item.status ===2}]">.{{item.secondMOney}}</span>
                </div>
                <div class="rules-content">
                  <p class="title">{{item.type | CouponType}}</p>
                  <p>限手机号{{item.phone}}使用</p>
                  <p>发放时间{{item.createTime}}</p>
                </div>
                <span class="tag" v-if="item.status===2"><img src="../../../static/image/market/exirped@.png" alt=""></span>
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
</section>
</template>

<script>
  import { voucherListFun, voucherCountFun } from '@/service/voucher';
  import PagerMixin from '@/mixins/pagerMixin';
  import { CouponType } from '@/utils/mapping';
  import calendar from '@/components/vue-calendar/calendar.vue';
import { fstat } from 'fs';
  export default {
    mixins: [PagerMixin],
    data () {
      return {
        pageSize:20,
        list:[],
        searchData:'',
        titleArr:{},
        titleIndex:null,
        status:'',//状态
        noOrderList:false,
        nosearchList:false,
        startDate:[],
        endDate: [],
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
            }
        },
        isreset:true,
      };
    },
    created() {
      this.voucherCount();
    },
    methods:{
      titleClick(index=null) {
        this.titleIndex = index;
        this.status = index;
        this.page = 1; //从第一页起
        this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
        this.list = [];
        this._getList();
      },
      async voucherCount() {
        let res = await voucherCountFun();
        this.titleArr = res;
      },
      async _getList() {
        let payload =  {status:this.status,phone:this.searchData,startDate:this.startDate.join('-'),endDate:this.endDate.join('-'),page:this.page,pageSize:this.pageSize};
        let res = await voucherListFun(payload);
        this.list = res.items?[...this.list,...res.items]:[];  //分页添加
        if ((this.searchData) || this.startDate.length > 0 && this.endDate.length > 0) {
          console.log(13123);
          this.nosearchList = this.list.length<= 0 ? true: false;
        }else {
          this.noOrderList = this.list.length<= 0 ? true: false;
        }
        this.list.forEach(item => {
          let temp = item.faceValue.split('.');
          item['firstMOney'] = temp[0];
          item['secondMOney'] = temp[1];
        });
        this.total = res.total;
      },
      openByDialog(){
        this.calendar.show=true;
        this.isreset=true;
      },
      selectDateCom(){
        this.calendar.show=false;
        this._getList();
      },
      resetDate(){
        this.calendar.show=false;
        this.startDate = [],
        this.endDate = [],
        this.isreset=false;
        this._getList();
      },
      async searchVoucher(e){ //搜索
        this.noOrderList = false;
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
        }
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
  .no-order {
    font-size: 14px;
    color: #999;
    text-align: center;
    background: #fff;
    height: 100%;
    line-height: 100%;
    padding-top: 4rem;
  }
  .calendar-dialog-body .footer{
    display: flex;
    padding: 0.4rem 0;
    >div {
      width: 50%;
      text-align: center;
    }
    .ca-coupon-btn {
      display: inline-block;
      padding: 0;
      width:2.13rem;
      height:0.8rem;  
      background:rgba(24,144,255,1);
      border-radius:0.11rem;
      font-size: 14px;
      color: #fff;
      text-align: center;
      line-height: 0.8rem;
    }
    .reset {
      background: #fff;
      border:1px solid #ddd;
      color: #999;
    }
    .mint-button--default {
      box-shadow: none;
    }
  }
</style>