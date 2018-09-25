<template>
    <section>
        <div class="tableearn">
            <div class="top">
                <div class='earnings-title'>
                    <div class="earning">
                        <p class="month"><span>{{date}}</span></p> 
                        <p><span>收益：{{monthMoney | tofixd}} 元</span></p>
                    </div>
                    <div class="export-wrap" @click="exportExls">
                        <p><i class="iconfont icon-daochu"></i></p> 
                        <p><span class="export ">导出</span></p>
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
                    <router-link :to="{ name: 'todayincome', query:{dateName:item.dateName ,todayMoney:item.money } }">
                        <div class="detail">
                            <span class="listtime report-table-date">{{item.dateName}}</span>
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
import { balanceLogProfitListFun } from '@/service/index';
import { MessageBox } from 'mint-ui';
import { setEmail, getEmail } from '@/utils/tool';
import { validatEmail } from '@/utils/validate';
export default {
    data() {
        return {
            monthMoney: '',
            listdata:[]
        };
    },
    created() {
        this.getMonthIncome();
        this.monthMoney = this.$route.query ? this.$route.query.monthMoney : '';
        this.date = this.$route.query.dateName;
    },
    methods: {
        async getMonthIncome() {
            let obj = {
                dateTime: this.$route.query.dateName,
                isDay: false
            };
            let res = await balanceLogProfitListFun(obj);
            this.listdata = res.items;
        },
        exportExls(){
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
                    let payload = {
                        dateTime: this.$route.query.dateName,
                        isDay: false,
                        excel:true,
                        email:val.value
                    };
                    await balanceLogProfitListFun(payload);
                }, (error) => {
                    // document.getElementsByClassName("mint-msgbox-errormsg")[0].style.visibility = 'hidden';
                    // document.getElementsByClassName("invalid")[0].style.borderColor = '#dedede';
                    
            });
        }
    },

};
</script>
<style type="text/css" lang="scss" scoped>
 @import '../../assets/scss/index/monthincome';
</style>
