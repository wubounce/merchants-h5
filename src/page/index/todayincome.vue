<template>
    <section v-title="title">
        <div class="tableearn">
            <div class="top">
                <p class='showDate'><span>今日收益：{{todayMoney}} 元</span><span>{{date}}</span></p>
                <p class="black"></p>
                <div class="listcon table-header">
                    <span class="report-table-date" >时间</span>
                    <span class="report-table-count" >订单编号</span>
                    <span class="report-table-money" >订单金额</span>
                </div>
            </div>
            <div class="bottom">
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
                    <div class="nodata" v-if="!this.total">暂无数据</div>
                </div>
            </div>
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
            todayMoney: '',
            date:'',
            data:'',
            listdata:[],
            pageSize:50,
            total:''
        };
    },
    methods: {
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
        },
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
        this.todayMoney = this.change(this.$route.query.todayMoney);
    }
};
</script>
<style type="text/css" lang="scss" scoped>
 @import '../../assets/scss/index/todayincome';
</style>

