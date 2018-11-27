<template>
<div class="member page-loadmore-height">
  <div class="permissions" v-if="!$store.getters.has('mer:person:list')">暂无相关页面权限</div>
  <div class="page-loadmore-height" v-if="$store.getters.has('mer:person:list')">
    <div class="search-header">
      <section class="sarch-wrap">
        <div class="search">
            <form action="" target="frameFile">
              <span class="iconfont icon-IconSearch"></span><input type="text" @click="searchMember"  placeholder="请输入人员姓名/账号" class="serch">
              <iframe name='frameFile' style="display: none;"></iframe>
            </form>
        </div>
      </section>
    </div>
    <div class="no-member-list" v-if="noList">暂无二级管理账号</div>
    <div class="page-top">
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
              <router-link :to="{name:'detailMember',query:{ id:item.id }}">
                <div class="action-prme">
                  <p class="memberdesc">权限：<span v-for="(items,index) in item.list" :key="index">{{items.name}}<i v-if="index !== (item.list.length-1)">,</i></span></p>
                  <span class="forward iconfont icon-nextx"></span>
                </div>
              </router-link>
            </div>
          </div>
          <div v-if="allLoaded" class="nomore-data">没有更多了</div>
        </mt-loadmore>
      </div>
    </div>
    <div class="addmember" @click="addmemeber" v-has="'mer:person:add'">
      <span class="order-action iconfont icon-tianjia"></span><br>
      <span>人员</span>
    </div>
  </div>
</div>
</template>
<script>
import { operatorListFun, lockOperatorrFun } from '@/service/member';
import { memberIsLock } from '@/utils/mapping';
import { validatReplace } from '@/utils/validate';
import PagerMixin from '@/mixins/pagerMixin';
export default {
  mixins: [PagerMixin],
  data() {
    return {
      value: false,
      list:[],
      noList:false,
      nosearchList:false,
    };
  },
  mounted() {
    
  },
  created(){
    this._getList();
  },
  methods: {
    async _getList(){
      this.nosearchList = false;
      let payload = {page:this.page,pageSize:this.pageSize};
      let res = await operatorListFun(payload);
      this.list = res.items?[...this.list,...res.items]:[];  //分页添加
      this.total = res.total;
      if (this.searchData) {
        this.nosearchList = this.list.length<= 0 ? true: false;
      } else {
        this.noList = this.list.length<= 0 ? true: false;
      }
      this.list.forEach((item)=>{
        if (item.isLock === 0) {
          item.isLock = true;
        } else {
          item.isLock = false;
        }
      });
    },
    async lockOperator(id,isLock){
      if (isLock === true) {
          isLock = 0;
        } else {
          isLock = 1;
        }
      let payload = Object.assign({},{id:id,isLock:isLock});
      let res = await lockOperatorrFun(payload);
    },
    async searchMember(e){ //搜索
      this.$router.push({name:'memeberSearch'});
    },
    addmemeber(){
      this.$router.push({name:'addMember'});
    }
  },
  components:{
  }
};
</script>
<style type="text/css" lang="scss" scoped>
  @import '../../assets/scss/member/member';
  .action-prme {
    display: flex;
  }
  .memberdesc {
    width: 9.07rem;
  }
  .forward {
    color: #999;
    height: 0.8rem;
    line-height: 0.8rem;
  }
</style>
<style>
  .member .mint-switch-input:checked + .mint-switch-core {
    border-color: #4DD865;
    background-color: #4DD865;
  }
</style>
