<template>
    <section v-title="title">
        <div class="tableearn">
            <p class='showDate'>{{date}}</p>
            <div class="listcon table-header">
                <span class="report-table-date" >时间</span>
                <span class="report-table-count" >订单编号</span>
                <span class="report-table-money" >订单金额</span>
            </div>
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}" >
                <mt-loadmore  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" @translate-change="translateChange" :auto-fill="false" ref="loadmore">
                    <div class="listcon tableearn-list" v-for="(item,index) in  listdata" :key="index">
                        <div class="detail">
                            <span class="report-table-date">{{item.createTime | momentTime}}</span>
                            <span class="report-table-count">{{item.orderNo}}</span>
                            <span class="report-table-money">{{ item.type | showNegative }}{{item.money}}</span>
                        </div>
                    </div>
                    <div v-if="allLoaded" class="nomore-data">没有更多了</div>
                </mt-loadmore>
            </div>
            <div class="nodata" v-if="!this.total">暂无数据</div>
        </div>
    </section>
</template>
<script>
import moment from 'moment';
import qs from 'qs';
import { balanceLogProfitListFun } from '@/service/index';
import PagerMixin from '@/mixins/pagerMixin';
export default {
    mixins: [PagerMixin],
    data() {
        return {
            title: '今日收益',
            date:'',
            data:'',
            listdata:[],
            pageSize:50,
            total:''
        };
    },
    methods: {
        showTime() {
            this.date = this.$route.query.dateName;
        },
        async _getList() {
            let obj = {
                dateTime: this.$route.query.dateName,
                isDay: true,
                page: this.page,
                pageSize: this.pageSize
            };
            let res = await balanceLogProfitListFun(qs.stringify(obj));
            if(res.code ===0 ) {
					if(res.data.total != 0) {
						this.listdata = res.data.items?[...this.listdata,...res.data.items]:[];  //分页添加
                        this.total = res.data.total;
					}
            }
            else {
                this.$toast({
                    message: res.msg
                });
            }
        },
    },
    filters: {
        momentTime: function (value) {
            return moment(value).format('HH:mm:ss');
        },
        showNegative: function(val) {
            return val == 3 ? '-' : '';
        }
    },
    created() {
        this.showTime();
    }
};
</script>
<style type="text/css" lang="scss" scoped>
 @import '../../assets/scss/index/todayincome';
</style>

