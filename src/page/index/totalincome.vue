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
    //这是一行注释
};
</script>
<style type="text/css" lang="scss" scoped>
.tableearn {
    height: 100%;
    .listcon {
        align-items: center;
        background-color: #fff;
        box-sizing: border-box;
        color: #333;
        display: -ms-flexbox;
        display: flex;
        font-size: 14px;
        height: 1.04rem;
        line-height: 1.04rem;
        padding: 0 .4rem;
        position: relative;
        white-space: nowrap;
        border-bottom: 1px solid #e5e5e5;
        .detail {
            align-items: center;
            box-sizing: border-box;
            display: -ms-flexbox;
            display: flex;
            font-size: 14px;
            height: 1.04rem;
            line-height: 1.04rem;
            position: relative;
            white-space: nowrap;
        }
        .report-table-date {
            width: 2.5rem;
        }
        .report-table-count {
            width: 2.5rem;
            text-align: right;
        }
        .report-table-money {
            width: 4.2rem;
            text-align: right;
        }
        .listtime {
            color: #1890FF;
        }
        &:nth-child(2n-1) {
            background: #FAFCFE !important;
        }
        &:nth-child(2n) {
            background: #fff !important;
        }
    }
    .table-header {
        align-items: center;
        background-color: #fff;
        box-sizing: border-box;
        color: #333;
        display: -ms-flexbox;
        display: flex;
        font-size: 14px;
        height: 1.04rem;
        line-height: 1.04rem;
        padding: 0 .4rem;
        position: relative;
        white-space: nowrap;
        border-bottom: 1px solid #e5e5e5;
        span {
            font-weight: 600;
        }
        .report-table-date {
            width: 2.5rem;
        }
        .report-table-count {
            width: 2.5rem;
            text-align: right;
        }
        .report-table-money {
            width: 4.2rem;
            text-align: right;
        }
    }
    .nodata {
        text-align: center;
        color: #999;
        font-size: 16px;
        padding-top: 4rem;
    }
}
.black {
    height:2.5rem;
    width: 100%;
}
</style>

