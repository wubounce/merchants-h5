<template>
    <section v-title="title">
        <div class="tableearn">
            <div class="table-header">
                <span class="report-table-date">时间</span>
                <span class="report-table-count">订单数量</span>
                <span class="report-table-money">订单金额</span>
            </div>
            <div class="listcon tableearn-list" v-for="(item,index) in  listdata" :key="index">
                <router-link :to="{ name: 'monthincome', query:{dateName:item.dateName} }">
                    <div class="detail">
                        <span class="listtime report-table-date">{{item.dateName}}</span>
                        <span  class="report-table-count">{{item.orderNum}}</span>
                        <span  class="report-table-money">{{item.money}}</span>
                    </div>
                </router-link>
            </div>
            <div class="nodata" v-if="!this.listdata">暂无数据</div>
        </div>
        <p class='black'></p>
    </section>
</template>
<script>
import qs from 'qs';
import { balanceLogProfitListFun } from '@/service/index';
export default {
    data() {
        return {
            title: '总收益',
            listdata:[]
        };
    },
    methods: {
        async getTotalIncome() {
            let obj = {
                isDay: false
            };
            let res = await balanceLogProfitListFun(qs.stringify(obj));
            if(res.code ===0 ) {
                this.listdata = res.data.items;
            }else {
                this.$toast({
                    message: res.msg
                });
            }
        }
    },
    created() {
        this.getTotalIncome();
    }
};
</script>
<style type="text/css" lang="scss" scoped>
 @import '../../assets/scss/index/monthincome';
</style>