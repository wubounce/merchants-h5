<template>
<div class="member page-loadmore-height" v-title="title">
  <div class="permissions" v-if="$store.getters.has('mer:person:list')">暂无相关页面权限</div>
  <div class="page-loadmore-height" v-else>
    <div class="no-discount-list" v-if="noList">暂无二级管理账号</div>
    <div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}">
     <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" @translate-change="translateChange" :auto-fill="false" ref="loadmore">
       <div class="page-member-pull">
         <div class="meber-list" v-for="(item,index) in list" :key="index">
            <div class="momber-wrap">
              <div class="name">
                <router-link :to="{name:'detailMember',query:{ id:item.id }}">
                  <p>{{item.userName}}</p><p class="phonenum">{{item.phone}}</p>
                </router-link>
              </div>
              <div class="phone">
                <div class="right"><mt-switch v-model="item.isLock" class="check-switch" @change="lockOperator(item.id,item.isLock)"></mt-switch></div>
              </div>
            </div>
            <p class="memberdesc">权限：<span v-for="(items,index) in item.list" :key="index">{{items.name}}<i v-if="index !== (item.list.length-1)">,</i></span></p>
          </div>
        </div>
        <div v-if="allLoaded" class="nomore-data">没有更多了</div>
      </mt-loadmore>
    </div>

    <div class="addmember" @click="addmemeber" v-has="'mer:person:add'">
      <span class="order-action iconfont icon-tianjia"></span><br>
      <span>人员</span>
    </div>
  </div>
</div>
</template>
<script>
import qs from 'qs';
import { operatorListFun, lockOperatorrFun } from '@/service/member';
import { memberIsLock } from '@/utils/mapping';
import PagerMixin from '@/mixins/pagerMixin';
export default {
  mixins: [PagerMixin],
  data() {
    return {
      title: '人员管理',
      value: false,
      list:[],
      noList:false,
    };
  },
  mounted() {
    
  },
  created(){
  },
  methods: {
    async _getList(){
      let payload = {page:this.page,pageSize:this.pageSize};
      let res = await operatorListFun(qs.stringify(payload));
      if (res.code === 0) {
        this.list = res.data.items?[...this.list,...res.data.items]:[];  //分页添加
        this.list.length <= 0 ? this.noList = true:this.noList = false;
        this.total = res.data.total;
        res.data.items.forEach((item)=>{
          if (item.isLock === 0) {
            item.isLock = true;
          } else {
            item.isLock = false;
          }
        });
      }else {
        this.noList = true;
      }
    },
    async lockOperator(id,isLock){
      if (isLock === true) {
          isLock = 0;
        } else {
          isLock = 1;
        }
      let payload = Object.assign({},{id:id,isLock:isLock});
      let res = await lockOperatorrFun(qs.stringify(payload));
    },
    addmemeber(){
      this.$router.push({name:'addMember'});
    }
  },
  components:{
  }
};
</script>
<style type="text/css" lang="less" scoped>
  .meber-list {
    padding:0 0.4rem;
    background: #fff;
    margin-bottom: 0.21rem;
  }
  .momber-wrap {
    font-size: 16px;
    color: #333;
    background: #fff;
    padding-top: 0.21rem;
    padding-bottom: 0.19rem;
    overflow: hidden;
    p{
      height: 0.6rem;
      line-height: 0.6rem
    }
  }
  .name{
    width: 75%;
    float: left;
     a {
      color: #333;
      display: block;
    }
  }
  .phone {
    float: right;
  }
  .phonenum {
    font-size: 16px;
    color: #999;
    margin-top: 0.08rem;
  }
  .memberdesc {
    border-top:1px solid #f9f8ff;
    font-size: 12px;
    color: #999;
    height: 0.8rem;
    line-height: 0.8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .check-switch {
    margin-top: 0.16rem;
    margin-left: 0.27rem;
  }
  .addmember {
    width:1.49rem;
    height:1.49rem;
    background:#1890FF;
    border-radius: 50%;
    font-size:12px;
    font-family:PingFangSC-Regular;
    color:rgba(255,255,255,1);
    text-align: center;
    -moz-box-shadow: 0 0.05rem 0.23rem 0 rgba(24, 144, 255, 0.7);
    -webkit-box-shadow: 0 0.05rem 0.23rem 0 rgba(24, 144, 255, 0.7);
    box-shadow: 0 0.05rem 0.23rem 0 rgba(24, 144, 255, 0.7);
    position: fixed;
    bottom:0.55rem;
    right: 0.64rem;
    .order-action {
      display: inline-block;
      margin-top: 0.2rem;
      font-size: 16px;
      color: #fff;
    }
  }
  .no-discount-list {
    text-align: center;
    font-size: 14px;
    padding-top: 4rem;
    color: #999;
  }
  .nomore-data {
    text-align: center;
    color: #999;
    font-size: 12px;
    margin-bottom: 0.266667rem;
  }
</style>
<style>
  .member .mint-header {
    background: #fff !important;
    border-bottom: 1px solid #f9f8ff;
  }
  .member .mint-switch-input:checked + .mint-switch-core {
    border-color: #4DD865;
    background-color: #4DD865;
  }
  .member .mint-header {
    background: #fff !important;
    border-bottom:1px solid #f9f8ff;
  }
  .member .mint-loadmore-top, .mint-loadmore-text {
    font-size: 14px;
    text-align: center;
    color: #999;
  }
</style>
