<template>
<div class="refund">
  <div class="search">
    <div class="slectdata timechoose">
      <span @click="open('picker2')">{{startDate}}</span>至<span @click="open('picker3')">{{endDate}}<i class="iconfont icon-nextx select-back"></i></span>
    </div>
    <div class="slectdata shopchoose">
      <span @click="popupVisible=true">{{currentTags?currentTags.shopName:'全部'}}<i class="iconfont icon-nextx select-back"></i></span>
      <selectpickr :visible="popupVisible" :slots="shopSlots" :valueKey="shopName" @selectpicker="shopselectpicker" @onpickstatus="shopselectpickertatus"> </selectpickr>
    </div>
  </div>
  <div class="echarts-warp">
    <div :class="className" :id="id" :style="{height:height,width:width}" ref="myEchart"></div>
    <div class="echart-title"><span style="background:#1890FF"></span>退款金额<span style="background:#FACC14"></span>订单数量</div>
  </div>

  <div class="tabledata">
    <div class="listcon">
      <span>日期</span>
      <span>订单数量</span>
      <span>订单金额</span>
    </div>
    <div class="tableearn">
      <div class="nodata" v-if="lsitdata.length <= 0">暂无数据</div>
      <div class="listcon tableearn-list" v-for="(item,index) in  lsitdata" :key="index">
        <router-link class="detail" :to="{name:'reportdetail', query:{date:item.date,type:3}}" >
          <span class="listtime">{{item.date}}</span>
          <span>{{item.count}}</span>
          <span>{{item.money}}</span>
        </router-link>
      </div>
    </div>
  </div>
  <mt-datetime-picker ref="picker2" type="date" v-model="searchStartDate" @confirm="handleChange"></mt-datetime-picker>
  <mt-datetime-picker ref="picker3" type="date" v-model="searchEndDate" @confirm="handleChange"></mt-datetime-picker>
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
      default: '4.453333rem' 
    }
  },
  data() {
    return {
      chart: null,
      searchStartDate: null,
      searchEndDate: null,
      startDate:moment().subtract('days',7).format('YYYY-MM-DD'),
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
      this.shopSlots[0].values = [{shopName:'全部'},...res.data];
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
          this.reportDate.push(item.date);
          this.reportCount.push(item.count);
          this.reportMoney.push(item.money);
        });
        this.lsitdata = res.data;
      }else {
        this.$toast({message: res.msg });
      }
      this.chart.setOption(this.chartOption);
    },
    open(picker) {
      this.$refs[picker].open();
    },
    handleChange() {
      this.startDate = this.searchStartDate ? moment(this.searchStartDate).format('YYYY-MM-DD'):moment().subtract('days',7).format('YYYY-MM-DD');
      this.endDate = this.searchEndDate ? moment(this.searchEndDate).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
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
            text: '退款表'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              animation: false,
              label: {
                  backgroundColor: '#505765'
              }
            }
        },
        grid: {
            y:10,
            x:0,
            x2:0,
            y2:10,
            containLabel: true,
        },
        dataZoom: [{
          startValue: '05-29'
        }, {
          type: 'inside'
        }],
        xAxis : [{
          type : 'category',
          offset:8,
          data :this.reportDate,
          axisLabel: {
            textStyle: {color: '#999'},
          },
          axisLine:{
            show:false,
            lineStyle:{
              color:'#e6e6e6',
              type:'solid'
            }
          },
        }],
        yAxis: [
          {
              type: 'value',
              min: 0,
              max:160.00,
              minInterval: 40,
              splitNumber:5,
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
          {
              min:0,
              max:40,
              splitNumber:5,
              type: 'value',
              axisLine:{
                show:false,
                lineStyle:{
                  color:'#e6e6e6'
                }
              },
              axisTick: {
                  show: false
              },
              axisLabel: {
                textStyle: {color: '#999'}
              },
              splitLine:{  
                show:true,
                lineStyle:{
                  color:'#e6e6e6',
                  type:'soild'
                }
              }
          }
        ],
        series: [
            {
                name:'退款金额',
                type:'line',
                stack: '总量',
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
                stack: '总量',
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
  components:{
    selectpickr
  }
};
</script>
<style lang="scss" scoped>
  .refund {
    background: #fff;
      .echarts-warp {
    padding: 0.32rem;
  }
    .echart-title {
      font-size: 12px;
      color:rgba(153,153,153,1);
      text-align: center;
      margin-top: 0.4rem;
      span {
        width: 0.2rem;
        height: 0.2rem;
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
    .listcon {
      display: flex;
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      span {
        flex:1;
        font-weight: 600;
      }
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
      height: 40px;
      line-height: 1;
      padding: 0 10px;
      position: relative;
      text-align: center;
      white-space: nowrap;
      border-top: 1px solid #E5E5E5;
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
    .tableearn {
      height: 4.3rem;
      overflow-y: scroll;
    }
    .tableearn .tableearn-list:nth-child(2n) {
      background: #fff !important;
    }
    .tableearn .tableearn-list:nth-child(2n-1) {
      background: #FAFCFE !important;
    }
    .search {
      display: flex;
      padding: 0.4rem 0.32rem 0 0.32rem;
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
      width: 60%;
      span {
        width: 45%;
        text-align: center;
      }
    }
    .shopchoose {
      width: 40%;
      margin-left: .2rem;
      span {
        width: 100% !important;
        display: inline-block;
        color: #666;
      }
    }
    .mint-popup {
      width: 100%;
    }
    .select-back {
      float: right;
    }
    .nodata {
      font-size: 14px;
      color: #999;
      text-align: center;
      padding: 2rem 0;
      background: #efeff4;
    }
  }

</style>
