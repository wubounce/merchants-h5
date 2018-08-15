<template>
<div class="earnings">
  <div class="search">
    <div class="slectdata timechoose">
      <span @click="open('picker2')">{{startDate}}<i class="iconfont icon-xiangxiajiantou select-back"></i></span>至<span @click="open('picker3')">{{endDate}}<i class="iconfont icon-xiangxiajiantou select-back"></i></span>
    </div>
    <div class="slectdata shopchoose">
      <span @click="popupVisible=true">{{currentTags?currentTags.shopName:'全部店铺'}}</span><i class="iconfont icon-xiangxiajiantou select-back"></i>
      <selectpickr :visible="popupVisible" :slots="shopSlots" :valueKey="shopName" @selectpicker="shopselectpicker" @onpickstatus="shopselectpickertatus"> </selectpickr>
    </div>
  </div>
  <div class="echarts-warp">
    <div class="order-earchs-title">
      <span>退款金额</span>
      <span class="order-num">订单数</span>
    </div>
    <div :class="className" :id="id" :style="{height:height,width:width}" ref="myEchart"></div>
    <div class="echart-title"><span style="background:#1890FF"></span>退款金额<span style="background:#FACC14"></span>订单数量</div>
  </div>
  <div class="tabledata">
    <div class="tableearn">
      <div class="listcon table-header">
        <span class="report-table-date">日期</span>
        <span class="report-table-order">订单数量</span>
        <span class="report-table-order">退款金额</span>
      </div>
      <div class="listcon tableearn-list" v-for="(item,index) in  lsitdata" :key="index">
         <router-link class="detail" :to="{name:'reportdetail', query:{date:item.date,type:3}}" >
          <span class="listtime report-table-date">{{item.date}}</span>
          <span  class="report-table-order">{{item.count}}</span>
          <span  class="report-table-order">{{item.money | tofixd}}</span>
        </router-link>
      </div>
       <div class="nodata" v-if="lsitdata.length <= 0">暂无数据</div>
    </div>
  </div>
  <mt-datetime-picker ref="picker2" type="date" v-model="searchStartDate" @confirm="handleStartDateChange" :endDate="pickerEndDate"></mt-datetime-picker>
  <mt-datetime-picker ref="picker3" type="date" v-model="searchEndDate" @confirm="handleEndDateChange"></mt-datetime-picker>
</div>
</template>
<script>

import qs from 'qs';
import moment from 'moment';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入折线图
import 'echarts/lib/chart/line';
// 引入提示框和图例组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legendScroll';
import selectpickr from '@/components/selectPicker';
import { dayReportFun, shopListFun } from '@/service/report';

export default {
  name:'report-eaning',
  props: {
    className: {
      type: String,
      default: 'echart'
    },
    id: {
      type: String,
      default: 'echart'
    },
    width: {
      type: String,
      default: '9.333333rem'
    },
    height: {
      type: String,
      default: '5.17rem'
    }
  },
  data() {
    return {
      chart: null,
      searchStartDate:new Date(moment().subtract('days',6).format('YYYY-MM-DD')),
      searchEndDate:new Date(moment().format('YYYY-MM-DD')),
      startDate:moment().subtract('days',6).format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      shopName:'shopName',
      shopSlots:[
        {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
      ],
      lsitdata:[],
      popupVisible:false,
      currentTags:null,
      reportDate:[],
      reportCount:[],
      reportMoney:[],
      pickerEndDate:new Date(moment().format('YYYY-MM-DD')),
      orderMax:null,
      moneyMax:null
    };
  },
  mounted() {
    this.initChart();
  },
  created(){
     this.dayReportFun();
     this.shopListFun();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.myEchart);
    },
    async shopListFun(){
      let res = await shopListFun();
      if (res.code === 0) {
        this.shopSlots[0].values = [{shopName:'全部店铺'},...res.data];
      }
    },
    async dayReportFun(shopId){
      let payload = null;
      if (shopId) {
        payload = Object.assign({},{startDate:this.startDate,endDate:this.endDate,type:3,shopId:shopId});
      } else {
        payload = Object.assign({},{startDate:this.startDate,endDate:this.endDate,type:3});
      }
      let res = await dayReportFun(qs.stringify(payload));
      if (res.code === 0) {
        this.reportDate = [];
        this.reportCount = [];
        this.reportMoney = [];
        res.data.forEach(item=>{
          this.reportDate.push(moment(item.date).format('MM-DD'));
          this.reportCount.push(item.count);
          this.reportMoney.push(item.money);
        });
        this.orderMax = this.calMax(this.reportCount);//订单Y轴最大值
        this.moneyMax = this.calMax(this.reportMoney);//金额Y轴最大值
        this.lsitdata = res.data;
        this.lsitdata.sort(this.ortId); //表格时间倒序
      }else {
        this.$toast({message: res.msg });
      }
      this.chart.setOption(this.chartOption);
    },
    calMax(arr) {
      var max = arr[0];
      for ( var i = 1; i < arr.length; i++) {// 求出一组数组中的最大值
        if (max < arr[i]) {
          max = arr[i];
        }
      }
      var maxint = Math.ceil(max / 10);// 向上取整
      var maxval = maxint * 10;// 最终设置的最大值
      return maxval;// 输出最大值
    },
    ortId(a,b){ //数据排序
      let k = a.date.replace(/\-/g, '');   
      let h = b.date.replace(/\-/g, '');
      return h-k;
    },
    open(picker) {
      this.$refs[picker].open();
    },
    handleStartDateChange(value) {
      this.searchStartDate = value;
      this.startDate = moment(value).format('YYYY-MM-DD');
      let startDate = new Date(this.startDate.replace(/\-/g, "\/"));  
      let endDate = new Date(this.endDate.replace(/\-/g, "\/"));  
      if(startDate > endDate){ 
        [this.endDate,this.startDate] = [this.startDate,this.endDate]; 
      }
      this.dayReportFun();
    },
    handleEndDateChange(value) {
      this.searchEndDate = value;
      this.endDate = moment(value).format('YYYY-MM-DD');
      let startDate = new Date(this.startDate.replace(/\-/g, "\/"));  
      let endDate = new Date(this.endDate.replace(/\-/g, "\/"));  
      if(startDate > endDate){ 
        [this.endDate,this.startDate] = [this.startDate,this.endDate]; 
      }
      this.dayReportFun();
    },
    shopselectpicker(data){
      this.currentTags = data;
      this.dayReportFun(this.currentTags.shopId);
    },
    shopselectpickertatus(data){
      this.popupVisible = data;
    },
  },
  computed:{
    chartOption(){
      let option = {
        title: {
            text: '收益表'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              animation: false,
              label: {
                backgroundColor: '#505765'
              }
            },
            formatter:function(data){
            return `${data[0].name}<br/>${data[0].marker}${data[0].seriesName}：${data[0].value.toFixed(2)}元<br/>${data[1].marker}${data[1].seriesName}：${data[1].value}`;
            },
        },
        grid: {
            y:10,
            x:0,
            x2:0,
            y2:10, //网格下方距离
            containLabel: true,
        },
        dataZoom: [{
          type: 'inside'
        }],
        xAxis : [{
          type : 'category',
          offset:8,
          data :this.reportDate,
          axisLabel: {
            textStyle: {color: '#999'},
          },
          splitNumber:8,
          axisLine:{
            show:false,
            lineStyle:{
              color:'#e6e6e6',
              type:'solid'
            }
          },
        }],
        yAxis: [
          {   name: '退款金额',
              type: 'value',
              min:0,
              max:this.moneyMax>0?this.moneyMax : 1,
              splitNumber:4,
              interval:this.moneyMax>0? this.moneyMax/4: 1/4,
              axisLine:{
                show:false,
                lineStyle:{
                  color:'#e6e6e6',
                }
              },
              axisTick: {
                  show: false
              },
              axisLabel: {
                textStyle: {color: '#999'},
                formatter: function (value) {           
                 return value.toFixed(2);  
                }  
              },
              splitLine:{  
                show:true,
                lineStyle:{
                  color:'#e6e6e6',
                  type:'soild'
                }
              }
          },
          {   name: '订单数量',
              type: 'value',
              min:0,
              max:this.orderMax>0?this.orderMax : 1,
              splitNumber:4,
              interval:this.orderMax>0? this.orderMax/4: 1/4,
              axisLine:{
                show:false,
                lineStyle:{
                  color:'#e6e6e6',
                }
              },
              axisTick: {
                  show: false
              },
              axisLabel: {
                textStyle: {color: '#999'},
              },
              splitLine:{  
                show:true,
                lineStyle:{
                  color:'#e6e6e6',
                  type:'soild'
                }
              }
          },

        ],
        series: [
            {
                name:'退款金额',
                type:'line',
                yAxisIndex:0,
                symbol: 'circle',
                data:this.reportMoney,
                itemStyle: {
                  normal: {
                      color: "#1890ff",
                      lineStyle: {
                          color: "#1890ff",
                      }
                  }
                },
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                      [
                        {offset: 0, color: '#1890ff'},
                        {offset: 1, color: '#fff'}
                      ]
                    )
                  }
                }
            },
            {
                name:'订单数量',
                type:'line',
                yAxisIndex:1,
                symbol: 'circle',
                data:this.reportCount,
                itemStyle: {
                    normal: {
                        color: "#FACC14",
                        lineStyle: {
                            color: "#FACC14",
                        }
                    }
                },
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                      [
                        {offset: 0, color: '#FACC14'},
                        {offset: 1, color: '#fff'}
                      ]
                    )
                  }
                }
            }
        ]
      };
      return option;
    }
  },
  filters: {
    tofixd(value){
     return Number(value).toFixed(2);
    }
  },
  components:{
    selectpickr
  }
};
</script>
<style lang="scss" scoped>
  .earnings {
    background: #fff;
    height: 100%;
    position: absolute;
    width: 100%;
  }
  .echarts-warp {
    padding: 0.32rem 0.32rem 0 0.32rem;
  }
  .order-earchs-title {
    display: flex;
    color: #999;
    font-size: 12px;
    span {
      flex:1;

    }
    .order-num {
      text-align: right;
    }
  }
  .echart-title {
    font-size: 12px;
    color:rgba(153,153,153,1);
    text-align: center;
    margin-top: 0.4rem;
    span {
      width: 0.19rem;
      height: 0.19rem;
      display: inline-block;;
      background: #f60;
      border-radius: 50%;
      margin-right: 0.133333rem;
      margin-left: 0.133333rem;
    }
  }
  .tabletit {
    background: #fff !important;
  }
  .mint-navbar{
    height: 1.066667rem;
    border:1px solid rgba(229,229,229,1);
  }
  .mint-tab-item-label {
    font-size: 16px;
  }
  .report-table-date {
    text-align: left;
  }
  .report-table-order {
    text-align: right;
  }
  .listcon {
    display: flex;
    font-size: 14px;
    height: 1.04rem;
    line-height: 1.04rem;
    padding: 0 0.4rem;
    span {
      flex:1;
      font-weight: 600;
    }
  }
  .tabledata {
    padding-bottom: 55px;
    box-sizing: border-box;
  }
  .tableearn {
    height: 100%;
    overflow-y: auto;
     -webkit-overflow-scrolling: touch;
  }
  .table-header {
    padding-top: 0.65rem;
    border-bottom: 1px solid #E5E5E5;
  }
  .detail {
    display: block;
    width: 100%;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #333333;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 14px;
    position: relative;
    text-align: center;
    white-space: nowrap;
    span {
      flex:1;
      font-weight: 600;
    }
  }
  .detail {
    span {
      font-weight: normal;
      color: #666666;
    }
    .listtime {
      color: #1890FF;
    }
  }
  .tableearn .tableearn-list:nth-child(2n) {
    border-bottom: 1px solid #E5E5E5; 
    background: #fff !important;
  }
  .tableearn .tableearn-list:nth-child(2n-1) {
    border-bottom: 1px solid #E5E5E5; 
    background: #FAFCFE !important;
  }
  .search {
    display: flex;
    margin-top: 1.19rem;
    padding: 0.4rem 0.2rem 0 0.2rem;
  }
  .slectdata {
    display: flex;
    border-bottom: 1px solid #e5e5e5;
    border-radius: 0.053333rem;
    height: 0.746667rem;
    line-height: 0.746667rem;
    background: #fff;
    font-size: 14px;
    span {
      width: 100%;
      height: 0.746667rem;
      line-height: 0.746667rem;
      display: inline-block;
    }
  }
  .timechoose {
    width: 75%;
    span {
      width: 45%;
      text-align: center;
    }
  }
  .shopchoose {
    width: 30%;
    margin-left: .2rem;
    span {
      width: 4.67rem !important;
      display: inline-block;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .mint-popup {
    width: 100%;
  }
  .select-back {
    float: right;
    color: #999;
  }
  .nodata {
    font-size: 14px;
    color: #999;
    text-align: center;
    padding: 2rem 0;
    background: #fff;
  }

</style>
<style lang="scss">
  .earnings .v-modal {
    z-index: 10000000 !important;
  }
</style>
