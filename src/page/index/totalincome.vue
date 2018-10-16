<template>
    <section>
        <div class="tableearn">
            <div class="top">
                <p class='showDate'>总收益：{{this.allMoney | tofixd}} 元</p>
                <p class="black"></p>
                <div class="table-header">
                    <span class="report-table-date">时间</span>
                    <span class="report-table-money">订单金额</span>
                </div>
            </div>
            <div class="bottom">
                <div class="listcon tableearn-list" v-for="(item,index) in  listdata" :key="index">
                    <router-link :to="{ name: 'monthincome', query:{dateName:item.dateName, monthMoney: item.money} }">
                        <div class="detail">
                            <span class="listtime report-table-date">{{item.dateName}}</span>
                            <span  class="report-table-money">{{item.money | tofixd}}</span>
                        </div>
                    </router-link>
                </div>
                <div class="nodata" v-if="this.listdata.length == 0">暂无数据</div>
            </div>
        </div>
    </section>
</template>
<script>
import { balanceLogProfitListFun } from '@/service/index';
export default {
    data() {
        return {
            allMoney: '',
            listdata:[]
        };
    },
    methods: {
        async getTotalIncome() {
            let obj = {
                isDay: false
            };
            let res = await balanceLogProfitListFun(obj);
            this.listdata = res.items;
        }
    },
    created() {
        this.getTotalIncome();
        this.allMoney = this.$route.query ? this.$route.query.allMoney : '';
    }
};
</script>
<style type="text/css" lang="scss" scoped>
 @import '../../assets/scss/index/monthincome';
</style>