<template>
    <section class="help-wrap">
        <ul class="help-con">
            <li v-for="(item,index) in list" :key="index">
                <router-link :to="{name:'helpdetail',query:{id:item.id}}">
                    <span class="title">{{item.questionTitle}}</span><span class="iconfont icon-nextx"></span>
                </router-link>
            </li>
        </ul>
    </section>
</template>

<script type='text/ecmascript-6'>
import { helpListFun } from '@/service/help';
  export default {
    data () {
      return {
          list:[]
      };
    },
    created() {
        this.getlist();
    },
    methods:{
        async getlist(){
            let res = await helpListFun();
            this.list = res.items;
        }
    }
  };
</script>

<style lang='scss' scoped type='text/css'>
    .help-wrap {
        background: #fff;
    }
    .help-con {
        li {
            padding: 0.24rem 0.4rem;
            font-size: 16px;
            height: 0.48rem;
            line-height: 0.48rem;
            border-bottom: 1px solid #f9f8ff
        }
        a {
            color: #666;
        }
        .title {
            display: block;
            width: 94%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            float: left;
        }
        .icon-nextx {
            color: #999;
            
        }
    }
</style>