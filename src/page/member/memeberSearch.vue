<template>
<div class="member page-loadmore-height">
  <div class="page-loadmore-height">
    <div class="search-header">
      <section class="sarch-wrap">
        <div class="search">
            <form action="" target="frameFile">
              <span class="iconfont icon-IconSearch"></span><input type="text" v-model.trim="searchData"  placeholder="请输入人员姓名/账号" class="serch" ref="inputText">
              <iframe name='frameFile' style="display: none;"></iframe>
              <span class="select-back" @click="goback">返回</span>
            </form>
        </div>
      </section>
    </div>
    <div class="search-select" v-show="isSelectShow">
      <ul>
        <li v-for="(item,index) in searchList" class="search-select-option search-select-list" @click="selectClick(item.id)"
        :key="index">{{item.searchValue}}
        </li>
      </ul>
    </div>
    <div class="no-member-list" v-if="nosearchList">未找到符合的结果</div>
    <div class="page-top"v-show="isListShow">
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
import { operatorListFun, lockOperatorrFun, searchListFun } from '@/service/member';
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
        let payload = {search:this.searchData};
        let res = await searchListFun(payload);
        this.searchList = res?res:[];  //分页添加
        if(this.searchList.length<= 0){
          this.nosearchList = true;
          this.isSelectShow = false;
        }else {
          this.nosearchList = false;
          this.isSelectShow = true;
        }
      },
      selectClick: function (phone) {
        this.isSelectShow = false;
        this._getList(phone);
      },
      async _getList(phone){
        let payload = {search:phone,page:this.page,pageSize:this.pageSize};
        let res = await operatorListFun(payload);
        this.isListShow = true;
        this.list = res.items?res.items:[];  //分页添加
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
      goback(){
        this.$router.replace({name:'member'});
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
<style>
  .member .mint-switch-input:checked + .mint-switch-core {
    border-color: #4DD865;
    background-color: #4DD865;
  }
</style>
