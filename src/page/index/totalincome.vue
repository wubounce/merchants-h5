<template>
    <section v-title="title">
        <div class="tableearn">
            <div class="top">
                <p class='showDate'>总收益：{{this.allMoney}} 元</p>
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
                            <span  class="report-table-money">{{item.money}}</span>
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
            title: '总收益',
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
        },
        change(i) {
            if(i) {
              //将number类型的数据转化成string
              i = i+'';
              //判断是不是'5'
              if(i.split('.').length == 1) {
                i = i + '.00';
              }
              else {
                //判断是不是'5.0'
                if(i.split('.')[1].length ==1) {
                  i = i + '0';
                }
              }
            }
            else {
              i = '0.00';
            }
            return i;
        }
    },
    created() {
        this.getTotalIncome();
        this.allMoney = this.change(this.$route.query.allMoney);
    }
};
</script>
<style type="text/css" lang="scss" scoped>
 @import '../../assets/scss/index/monthincome';
</style>