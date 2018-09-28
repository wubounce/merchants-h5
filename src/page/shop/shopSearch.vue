<template>
<div class="member page-loadmore-height">
  <div class="page-loadmore-height">
    <div class="search-header">
      <section class="sarch-wrap">
        <div class="search">
            <form action="" target="frameFile">
              <span class="iconfont icon-IconSearch"></span><input type="text" v-model.trim="searchData"  placeholder="请输入店铺名称" class="serch" ref="inputText">
              <iframe name='frameFile' style="display: none;"></iframe>
              <span class="select-back" @click="goback">返回</span>
            </form>
        </div>
      </section>
    </div>
    <div class="search-select" v-show="isSelectShow">
      <ul>
        <li v-for="(item,index) in searchList" class="search-select-option search-select-list" @click="selectClick(item.shopId)"
        :key="index">{{item.shopName}}
        </li>
      </ul>
    </div>
    <div class="no-member-list" v-if="nosearchList">未找到符合的结果</div>
    <div class="page-top"v-show="isListShow">
      <ul>
        <li class="list" v-for="(item,index) in list" :key="index">
          <router-link :to="{ name: 'shopDetail', query:{shopId:item.shopId}}">
            <p class="top">
              <span>{{item.shopName.length>15 ? item.shopName.slice(0,15) + '...' : item.shopName }}</span>
              <span>
                <img src="../../../static/image/shop/vip@2x.png" alt="vip" v-if='item.hasVip' style='width: 0.4rem;vertical-align: middle;'>
                <img src="../../../static/image/shop/discount@2x.png" alt="discount" v-if='item.isDiscount' style='width: 0.4rem;vertical-align: middle;'>
                <img src="../../../static/image/shop/reserve@2x.png" alt="reserve" v-if='!item.isReserve' style='width: 0.4rem;vertical-align: middle;'>
              </span>
            </p>
          </router-link>
          <div class="bottom">
            <div class="kindof">
              <router-link :to="{ name: 'shopDetail', query:{shopId:item.shopId}}">
                <div class="text">分类</div>
                <div class="text-value">{{item.shopType}}</div>
              </router-link>
            </div>
            <div class="kindof">
              <router-link :to="{ name: 'shopDetail', query:{shopId:item.shopId}}">
                <div class="text">设备</div>
                <div class="text-value">{{item.machineCount}}<span class="little-font">台</span></div>
              </router-link>
            </div>
            <div class="kindof">
              <router-link :to="{ name: 'shopMonthFlow', query:{allMoney:item.profit,shopId:item.shopId,shopName:item.shopName}}">
                <div class="text">总收益<span class="order-action iconfont icon-nextx"></span></div>
                <div class="text-value">{{ item.profit | tofixd }}<span class="little-font">元</span></div>
              </router-link>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script type="text/javascript">
import { listByShopNameFun, manageListFun } from '@/service/shop';
import { memberIsLock } from '@/utils/mapping';
import { getTrees, setMember, removeMember } from '@/utils/tool';
import { validatReplace } from '@/utils/validate';
import PagerMixin from '@/mixins/pagerMixin';
import {delay } from "@/utils/tool";
  export default {
    data() {
      return {
        searchData:'',
        nosearchList:false,
        list:[],
        page:1,
        pageSize:9999,
        isSelectShow:true,
        isListShow:false,
        searchList:[]
      };
    },
    computed: {
     
    },
    mounted() {
      this.$refs.inputText.focus();
    },
    created() {
    },
    methods: {
      async search(name) {
        let payload = {shopName:this.searchData};
        let res = await listByShopNameFun(payload);
        this.searchList = res?res:[];
        if(this.searchList.length<= 0){
          this.nosearchList = true;
          this.isSelectShow = false;
        }else {
          this.nosearchList = false;
          this.isSelectShow = true;
        }
      },
      selectClick: function (shopId) {
        this.isSelectShow = false;
        this._getList(shopId);
      },
      async _getList(shopId){
        let payload = {shopId:shopId,page:this.page,pageSize:this.pageSize};
        let res = await manageListFun(payload);
        this.isListShow = true;
        this.list = res.items?res.items:[];
      },
      goback(){
        this.$router.replace({name:'shopList'});
      }
    },
    watch: {
      searchData: function (newVal) {
        if (newVal) {
          delay(() => {
            this.isListShow = false;
            this.search();
          }, 200);
        }else {
          this.search();
        }
      },
    },
  };

</script>

<style type="text/css" lang="scss" scoped>
@import '../../assets/scss/shop/shopList';
.no-member-list {
  font-size: 14px;
  color: #999;
  text-align: center;
  background: #fff;
  height: 100%;
  line-height: 100%;
  padding-top: 4rem;
}
.page-top {
  padding-top: 1.44rem;
  height: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  .list {
        width:100%;
        background:rgba(255,255,255,1);
        margin-bottom:0.23rem;
        .top {
          display:flex;
          justify-content: space-between;
          border-bottom: 1px solid #F8F8F8;
          background-color: #fff; 
          font-size: 16px;
          height: 1.17rem;
          line-height: 1.17rem;
          width: 90%;
          margin: auto;
          font-weight: 500; 
          .shopName {
            height:0.45rem;
            font-size:0.45rem;
            font-family:PingFangSC-Medium;
            color:rgba(51,51,51,1);
            line-height:0.45rem;
          }
        }
        .bottom {
          width: 100%;
          border-radius:0.1rem;
          padding:0.51rem 0;
          display: flex;
          justify-content: center;
          .kindof {
            width: 35%;
            text-align: center;
            &:nth-child(2) {
              .text, .text-value {
                border-left: 1px solid #F8F8F8;
                border-right: 1px solid #F8F8F8;
              }
            }
            .text {
              color: #999999;
              font-size: 14px;
              line-height: 0.53rem;
              position: relative;
              .order-action {
                position: absolute;
                top: 0.01rem;
                margin-left: 0.13rem;
              }
            }
            .text-value { 
              color:#1890FF;     
              font-size: 16px;
              padding-top: 0.3rem; 
              .little-font {
                font-size: 8px;
              }
            }
          }
        }
      }
}
.search-select {
  height: 100%;
  padding-top:1.44rem;
  box-sizing: border-box;
  background: #fff;
  .noData {
    text-align: center;
  }
  li {
    color:rgba(51, 51, 51, 1);
    width: 100%;
    font-size: 0.43rem;
  }
  .search-select-option {
    box-sizing: border-box;
    background: url("../../assets/img/device/devic_search_icon.png") no-repeat 0.27rem;
    background-size: 0.43rem;
    padding: 0.29rem 0 0.29rem 1.07rem;
    border-radius: 0.13rem;
    font-size: 16px;
  }
  }
</style>
