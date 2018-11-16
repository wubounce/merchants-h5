<template>
    <section class="help-wrap">
        <ul class="help-con">
            <li>
                <router-link :to="{name:'helpdetail'}">
                    <span class="title">支付成功后显示脉冲设备不允许启动、或时间为0、或功能与支付金额不符怎么办？</span><span class="iconfont icon-nextx"></span>
                </router-link>
            </li>
            <li>
                <router-link :to="{name:'helpdetail'}">
                    <span class="title">支付成功后显示脉冲设备不允许启动、或时间为0、或功能与支付金额不符怎么办？</span><span class="iconfont icon-nextx"></span>
                </router-link>
            </li>
            <li>
                <router-link :to="{name:'helpdetail'}">
                    <span class="title">支付成功后显示脉冲设备不允许启动、或时间为0、或功能与支付金额不符怎么办？</span><span class="iconfont icon-nextx"></span>
                </router-link>
            </li>
            <li>
                <router-link :to="{name:'helpdetail'}">
                    <span class="title">支付成功后显示脉冲设备不允许启动、或时间为0、或功能与支付金额不符怎么办？</span><span class="iconfont icon-nextx"></span>
                </router-link>
            </li>
            <li>
                <router-link :to="{name:'helpdetail'}">
                    <span class="title">支付成功后显示脉冲设备不允许启动、或时间为0、或功能与支付金额不符怎么办？</span><span class="iconfont icon-nextx"></span>
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
            console.log(res);
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
            width: 90%;
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