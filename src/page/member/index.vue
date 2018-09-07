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
import { getTrees, setMember, removeMember } from '@/utils/tool';
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
    removeMember();//防止点击物理返回键清除localStorage
  },
  methods: {
    async _getList(){
      let payload = {page:this.page,pageSize:this.pageSize};
      let res = await operatorListFun(payload);
      this.list = res.items?[...this.list,...res.items]:[];  //分页添加
      this.list.length <= 0 ? this.noList = true:this.noList = false;
      this.total = res.total;
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
    addmemeber(){
      this.$router.push({name:'addMember'});
    }
  },
  beforeRouteLeave(to, from, next) {
    // 设置下一个路由的 meta
    to.meta.keepAlive = false; // C 跳转到 A 时让 A 不缓存，即刷新
    next();
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
