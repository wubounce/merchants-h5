<template>
    <section>
        <div class="tableearn">
            <div class="top">
                 <div class='earnings-title'>
                    <div class="earning">
                        <p class="month"><span>{{shopName}}</span></p> 
                        <p><span>收益：{{allMoney | tofixd}} 元</span></p>
                    </div>
                </div>
                <p class="black"></p>
                <div class="table-header">
                    <span class="report-table-date">月份</span>
                    <span class="report-table-money">订单金额</span>
                </div>
            </div>
            <div class="bottom">
                <div class="listcon tableearn-list" v-for="(item,index) in  listdata" :key="index">
                    <router-link :to="{ name: 'shopDayFlow', query:{time:item.time, allMoney: item.money,shopId:shopId,shopName:shopName} }">
                        <div class="detail">
                            <span class="listtime report-table-date">{{item.time}}</span>
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
import { monthFloweFun } from '@/service/shop';
export default {
    data() {
        return {
            allMoney: '',
            listdata:[],
            shopName:'',
            shopId:'',
        };
    },
    methods: {
        async getTotalIncome() {
            let obj = { shopId: this.shopId };
            let res = await monthFloweFun(obj);
            this.listdata = res;
        },
    },
    created() {
        this.allMoney = this.$route.query ? this.$route.query.allMoney : '';
        this.shopName =  this.$route.query ? this.$route.query.shopName : '';
        this.shopId = this.$route.query ? this.$route.query.shopId : '';
        this.getTotalIncome();
    }
};
</script>
<style type="text/css" lang="scss" scoped>
 @import '../../assets/scss/index/monthincome';
</style>