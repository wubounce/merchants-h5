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
                            <span class="listtime report-table-date">{{item.createTime | momentTime}}</span>
                            <span  class="report-table-count">{{item.orderNo}}</span>
                            <span  class="report-table-money">{{ item.type | showNegative }}{{item.money}}</span>
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
.tableearn {
    height: 100%;
    .showDate {
        align-items: center;
        background-color: #fff;
        box-sizing: border-box;
        color: #999999;
        display: -ms-flexbox;
        display: flex;
        font-size: 14px;
        height: 1.04rem;
        line-height: 1.04rem;
        padding: 0 .4rem;
        position: relative;
        white-space: nowrap;
        margin-bottom: 0.3rem;

    }
    .listcon {
        align-items: center;
        background-color: #fff;
        box-sizing: border-box;
        color: #333;
        font-size: 14px;
        display: -ms-flexbox;
        display: flex;
        height: 1.04rem;
        line-height: 1.04rem;
        padding: 0 .4rem;
        position: relative;
        white-space: nowrap;
        border-bottom: 1px solid #f9f8ff;
        .detail {
            align-items: center;
            box-sizing: border-box;
            display: -ms-flexbox;
            display: flex;
            //justify-content: space-between;
            font-size: 14px;
            height: 1.04rem;
            line-height: 1.04rem;
            position: relative;
            white-space: nowrap;
        }
        .nomore-data {
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-bottom: 0.266667rem;
        }
        .report-table-date {
            width: 2.0rem;
        }
        .report-table-count {
            width: 5.5rem;
            text-align: center;
        }
        .report-table-money {
            width: 1.7rem;
            text-align: right;
        }
        .listtime {
            color: #1890FF;
        }
        &:nth-child(2n-1) {
            background: #FAFCFE !important;
        }
    }
    .nodata {
        text-align: center;
        color: #999;
        font-size: 16px;
        padding-top: 4rem;
    }
    .table-header {
        span {
            font-weight: 600;
        }
    }
    .page-loadmore-wrapper {
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
    }
}
</style>

