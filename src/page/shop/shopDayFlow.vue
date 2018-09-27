<template>
    <section>
        <div class="tableearn">
            <div class="top">
                <div class='earnings-title'>
                    <div class="earning">
                        <p class="month"><span>{{shopName}}</span></p> 
                        <p><span>{{date}}<span style="padding:0 0.11rem">/</span>收益：{{allMoney | tofixd}} 元</span></p>
                    </div>
                    <div class="export-wrap" @click="exportExls">
                        <p><i :class="['iconfont icon-daochu', {'export-disable':listdata.length<=0}]"></i></p> 
                        <p><span :class="['export', {'export-disable':listdata.length<=0}]">导出</span></p>
                    </div>
                </div>
                <p class="black"></p>
                <div class="table-header">
                    <span class="report-table-date">时间</span>
                    <span class="report-table-money">订单金额</span>
                </div>
            </div>
            <div class="bottom">
                <div class="listcon tableearn-list" v-for="(item,index) in  listdata" :key="index">
                    <router-link :to="{ name: 'shopOrderFlow', query:{time:item.time, allMoney: item.money,shopId:shopId,shopName:shopName} }">
                        <div class="detail">
                            <span class="listtime report-table-date">{{item.time}}</span>
                            <span  class="report-table-money">{{item.money | tofixd}}</span>
                        </div>
                    </router-link>
                </div>
                <div class="nodata" v-if="this.listdata.length == 0 ">暂无数据</div>
            </div>
        </div>
    </section>
</template>
<script>

import { MessageBox } from 'mint-ui';
import { dayFloweFun, excelDayFlowFun } from '@/service/shop';
import { setEmail, getEmail } from '@/utils/tool';
import { validatEmail } from '@/utils/validate';
export default {
    data() {
        return {
            allMoney: '',
            listdata:[],
            shopName:'',
            shopId:'',
            date:'',
        };
    },
    methods: {
        async getMonthIncome() {
            let obj = {
                time: this.$route.query.time,
                shopId: this.$route.query.shopId
            };
            let res = await dayFloweFun(obj);
            this.listdata = res;
        },
        exportExls(){
            if(this.listdata.length<=0) return false;
            MessageBox.prompt(' ', `确定导出${this.date}流水明细？`, {
                inputPlaceholder:'请填写导出表格的邮箱地址',
                inputValue:getEmail()?getEmail():null,
                inputValidator: (val) => {
                    if (val === null) {
                        return false;//初始化的值为null，不做处理的话，刚打开MessageBox就会校验出错，影响用户体验
                    }
                    return validatEmail(val);
                }, 
                inputErrorMessage: '请输入正确的邮箱地址'
            }).then(async (val) => {
                    setEmail(val.value);
                    let payload = {shopId:this.shopId,time:this.date,email:val.value};
                    await excelDayFlowFun(payload);
                }, (error) => {
                    // document.getElementsByClassName("mint-msgbox-errormsg")[0].style.visibility = 'hidden';
                    // document.getElementsByClassName("invalid")[0].style.borderColor = '#dedede';
                    
            });
        }
    },
    created() {
        this.allMoney = this.$route.query ? this.$route.query.allMoney : '';
        this.shopName =  this.$route.query ? this.$route.query.shopName : '';
        this.shopId = this.$route.query ? this.$route.query.shopId : '';
        this.date = this.$route.query ? this.$route.query.time:'';
        this.getMonthIncome();
    }
};
</script>
<style type="text/css" lang="scss" scoped>
 @import '../../assets/scss/index/monthincome';
</style>