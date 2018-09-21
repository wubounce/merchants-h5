<template>
<div class="member page-loadmore-height">
  <div class="page-loadmore-height">
    <div class="search-header">
      <section class="sarch-wrap">
        <div class="search">
            <form action="" target="frameFile">
              <span class="iconfont icon-IconSearch"></span><input type="text" v-model.trim="searchData" @input="searchMember" placeholder="请输入人员姓名/账号" class="serch" ref="inputText">
              <iframe name='frameFile' style="display: none;"></iframe>
              <span class="select-back">返回</span>
            </form>
        </div>
      </section>
    </div>
    <div class="no-member-list" v-if="nosearchList">未找到符合的结果</div>
    <div class="page-top">
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
    </div>
  </div>
</div>
</template>

<script type="text/javascript">
import { operatorListFun, lockOperatorrFun } from '@/service/member';
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
        pageSize:9999
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
      async _getList(){
        this.nosearchList = false;
        // 去掉特殊字符和空格
        let payload = {search:this.searchData,page:this.page,pageSize:this.pageSize};
        let res = await operatorListFun(payload);
        this.list = res.items?res.items:[];  //分页添加
        console.log(res);
        this.list.length<= 0 ? this.nosearchList = true: this.nosearchList = false;
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
      searchMember(){}
    },
    watch: {
      searchData: function (newVal) {
        if (newVal) {
          delay(() => {
            this._getList();
          }, 200);
        }else {
          this._getList();
        }
      },
    },
  };

</script>

<style type="text/css" lang="scss" scoped>
  @import '../../assets/scss/member/member';
  .page-top {
    background: #fff;
  }
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
