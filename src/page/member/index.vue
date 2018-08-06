<template>
<div class="member" v-title="title">
  <div class="permissions" v-if="$store.getters.has('mer:person:list')">暂无相关页面权限</div>
  <div v-else>

    <div class="no-discount-list" v-if="list.length<=0">暂无二级管理账号</div>
    <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
     <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
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

export default {
  data() {
    return {
      title: '人员管理',
      value: false,
      list:[],
      page: 1,//页码
      pageSize:10,
      total:null,
      allLoaded: false,//数据是否加载完毕
      wrapperHeight: 0,//容器高度
    };
  },
  mounted() {
    let windowWidth = document.documentElement.clientWidth;//获取屏幕高度
    this.wrapperHeight = document.documentElement.clientHeight - 30;
  },
  created(){
    this.getMemberList();
  },
  methods: {
    async getMemberList(){
      let payload = {page:this.page,pageSize:this.pageSize};
      let res = await operatorListFun(qs.stringify(payload));
      if (res.code === 0) {
        res.data.items = res.data ? res.data.items :[];
        res.data.items.forEach((item)=>{
          if (item.isLock === 0) {
            item.isLock = true;
          } else {
            item.isLock = false;
          }
        });
        this.list = [...this.list,...res.data.items];
      }
      
    },
    loadBottom() {
      this.page += 1;
      let allpage = this.total/this.pageSize;
      if(this.page <= allpage){
        this.getMemberList();
      }else{
        this.allLoaded = true;//模拟数据加载完毕 禁用上拉加载
      }
      this.$refs.loadmore.onBottomLoaded();
    },
    loadTop() {
      this.page = 1;
      this.list = [];
      this.getMemberList();
      this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
      this.$refs.loadmore.onTopLoaded();
    },
    async lockOperator(id,isLock){
      if (isLock === true) {
          isLock = 0;
        } else {
          isLock = 1;
        }
      let payload = Object.assign({},{id:id,isLock:isLock});
      let res = await lockOperatorrFun(qs.stringify(payload));
      if (res.code === 0) {
         this.$toast({message: isLock===1 ? '禁用成功':'解除禁用成功'});
      }
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
    padding:0.21rem 0.4rem;
    background: #fff;
    margin-bottom: 0.21rem;
  }
  .momber-wrap {
    display: flex;
    font-size: 16px;
    color: #333;
    background: #fff;
    margin-bottom: 0.21rem;
    .name , .phone {
      flex: 1;
    }
  }
  .name a {
    color: #333;
  }
  .phone {
    .right {
      float: right;
    }
  }
  .phonenum {
    font-size: 16px;
    color: #999;
    margin-top: 0.11rem;
  }
  .memberdesc {
    border-top:1px solid #DFE6FF;
    font-size: 14px;
    color: #999;
    padding-top: 0.17rem;
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
    -moz-box-shadow:0px 0.03rem 0.4rem rgba(24,144,255,0.75); 
    -webkit-box-shadow:0px 0.03rem 0.4rem rgba(24,144,255,0.75);
    box-shadow: 0px 0.03rem 0.4rem rgba(24,144,255,0.75);
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
  .member .mint-header {
    background: #fff !important;
    border-bottom: 1px solid #DCE0E6;
  }
  .member .mint-switch-input:checked + .mint-switch-core {
    border-color: #4DD865;
    background-color: #4DD865;
  }
  .member .mint-header {
    background: #fff !important;
    border-bottom:1px solid #DCE0E6;
  }
  .member .mint-loadmore-top, .mint-loadmore-text {
    font-size: 14px;
    text-align: center;
    color: #999;
  }
</style>
