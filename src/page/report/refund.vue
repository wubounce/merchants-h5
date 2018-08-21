<template>
<div class="earnings">
  <div class="search">
    <div class="slectdata monthchoose"  @click="dateVisible=true;">
      <span>{{dateCurrentTag.label}}</span><i class="iconfont icon-xiangxiajiantou select-back"></i>
      <selectpickr :visible="dateVisible" :slots="dateSlots"  :title="'时间'" :valueKey="keyname" @selectpicker="dateselectpicker" @onpickstatus="dateselectpickertatus"> </selectpickr>
    </div>
    <div class="slectdata timechoose">
      <span @click="openByDialog">{{calendar.display}}</span><i class="iconfont icon-xiangxiajiantou select-back"></i>
    </div>
    <div class="slectdata shopchoose">
      <span @click="popupVisible=true">{{currentTags?currentTags.shopName:'全部店铺'}}</span><i class="iconfont icon-xiangxiajiantou select-back"></i>
      <selectpickr :visible="popupVisible" :slots="shopSlots" :valueKey="shopName" :title="'店铺'" @selectpicker="shopselectpicker" @onpickstatus="shopselectpickertatus"> </selectpickr>
    </div>
  </div>
  <div class="echarts-warp">
    <div class="order-earchs-title">
      <span>退款金额</span>
      <span class="order-num">订单数</span>
    </div>
    <div :class="className" :id="id" :style="{height:height,width:width}" ref="myEchart"></div>
    <div class="echart-title">
      <i style="background:#1890FF"></i>总退款金额<span class="totalMoney">({{totalMoney}}元)</span>
      <i style="background:#FACC14"></i>总订单数量<span class="totalOrder">({{totalCount}})</span>
    </div>
  </div>
  <div class="tabledata">
    <div class="tableearn">
       <div class="listcon table-header">
        <span class="report-table-date">日期</span>
        <span class="report-table-order">订单数量</span>
        <span class="report-table-order">退款金额</span>
       </div>
      <div class="listcon tableearn-list" v-for="(item,index) in  lsitdata" :key="index" @click="goDetail(item.date)">
         <div class="detail">
          <span class="listtime report-table-date">{{item.date}}</span>
          <span  class="report-table-order">{{item.count}}</span>
          <span  class="report-table-order">{{item.money | tofixd}}</span>
        </div>
      </div>
      <div class="nodata" v-if="lsitdata.length <= 0">暂无数据</div>
    </div>
  </div>

  <div class="calendar-dialog" v-if="calendar.show">
        <div class="calendar-dialog-mask" @click="calendar.show=false;"></div>
        <div class="calendar-dialog-body">
            <calendar :range="calendar.range" :zero="calendar.zero" :lunar="calendar.lunar" :begin="calendar.begin" :end="calendar.end" :type="calendar.type" :value="calendar.value"  @select="calendar.select">
              
            </calendar>
            <div class="calendar-btn" @click="selectDateCom">确定</div>
        </div>
    </div>
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
import calendar from '@/components/vue-calendar/calendar.vue';

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
      startDate:moment().subtract('days',6).format('YYYY-MM-DD').split('-'),
      endDate: moment().format('YYYY-MM-DD').split('-'),
      shopName:'shopName',
      shopSlots:[
        {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
      ],
      dateSlots:[
        {
            flex: 1,
            values: [
              {label: '日期',value:1},
              {label: '月份',value:2}
            ],
            className: 'slot1',
            textAlign: 'center',
            defaultIndex:0
          }
      ],
      keyname:'label',
      dateVisible:false,
      dateCurrentTag:null,
      dateLevel:null,

      lsitdata:[],
      popupVisible:false,
      currentTags:null,
      reportDate:[],
      reportCount:[],
      reportMoney:[],
      pickerEndDate:new Date(moment().format('YYYY-MM-DD')),
      orderMax:null,
      moneyMax:null,
      totalCount:null,
      totalMoney:null,

      calendar:{
        range:true,
        lunar:false, //显示农历
        display:'',
        show:false,
        zero:true,
        type:'datetime',
        value:[], //默认日期
        select:(begin,end)=>{
            this.calendar.display=begin.join("-")+"至"+end.join("-");
            this.startDate = begin;
            this.endDate = end;
            // this.calendar.value=[begin,end];
        }
    },

    };
  },
  mounted() {
    this.initChart();
  },
  created(){
    this.dateCurrentTag = this.dateSlots[0].values[0];
    this.dateLevel = this.dateCurrentTag.value;
    this.calendar.value = [[...this.startDate],[...this.endDate]];
    this.calendar.display = this.startDate.join('-')+'至'+this.endDate.join('-');
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
        payload = Object.assign({},{startDate:this.startDate.join('-'),endDate:this.endDate.join('-'),type:3,shopId:shopId,dateLevel:this.dateLevel});
      } else {
        payload = Object.assign({},{startDate:this.startDate.join('-'),endDate:this.endDate.join('-'),type:3,dateLevel:this.dateLevel});
      }
      let res = await dayReportFun(qs.stringify(payload));
      if (res.code === 0) {
        this.reportDate = [];
        this.reportCount = [];
        this.reportMoney = [];
        res.data.list.forEach(item=>{
          this.reportDate.push(moment(item.date).format('MM-DD'));
          this.reportCount.push(item.count);
          this.reportMoney.push(item.money);
        });
        this.orderMax = this.calMax(this.reportCount);//订单Y轴最大值
        this.moneyMax = this.calMax(this.reportMoney);//金额Y轴最大值
        this.lsitdata = res.data.list;
        this.lsitdata.sort(this.ortId); //表格时间倒序
        this.totalMoney = res.data.totalMoney;
        this.totalCount = res.data.totalCount;
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
    shopselectpicker(data){
      this.currentTags = data;
      this.dayReportFun(this.currentTags.shopId);
    },
    shopselectpickertatus(data){
      this.popupVisible = data;
    },
    dateselectpicker(data){
      this.dateCurrentTag = data;
      if (data.label === '日期') {
        this.dateLevel = 1;
        this.calendar.type = 'datetime';
      } else {
        this.calendar.type = 'month';
        this.dateLevel = 2;
      }
    },
    dateselectpickertatus(data){
      this.dateVisible = data;
    },
    openByDialog(){
      this.calendar.show=true;
      this.calendar.value = [[...this.startDate],[...this.endDate]];
    },
    selectDateCom(){
      this.calendar.show=false;
      this.dayReportFun();
    },
    goDetail(date){
      let shopId = this.currentTags?this.currentTags.shopId:'';
      if (shopId) {
        this.$router.push({name:'reportdetail', query:{date:date,type:3,shopId:shopId,dateLevel:this.dateLevel}});
      } else {
        this.$router.push({name:'reportShopDetail', query:{date:date,type:3,shopId:shopId,dateLevel:this.dateLevel}});
      }
      
    }
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
    selectpickr,
    calendar
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
    margin: 0.4rem 0 0 1.33rem;
    i {
      width: 0.19rem;
      height: 0.19rem;
      display: inline-block;;
      background: #f60;
      border-radius: 50%;
      margin-right: 0.133333rem;
      margin-left: 0.133333rem;
    }
    .totalMoney {
      font-size: 0.29rem;
      color: #1890FF;
      font-weight: 600;
      margin-right: 0.8rem;
    }
    .totalOrder {
      font-size: 0.29rem;
      color: #FACC14;
      font-weight: 600;
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
    font-size: 0.37rem;
    span {
      width: 100%;
      height: 0.746667rem;
      line-height: 0.746667rem;
      display: inline-block;
    }
  }
  .monthchoose {
    width: 1.3rem;
    margin-right: 0.37rem;
  }
  .timechoose {
    width: 5.19rem;
    margin-right: 0.37rem;
    span {
      text-align: center;
    }
  }
  .shopchoose {
    width: 2.28rem;
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
  /*弹出框*/
.calendar-dialog{
    position: absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
    background:rgba(255,255,255,.5);
    z-index: 10000000;
}
.calendar-dialog-mask{
    background:rgba(0,0,0,0.5);
    height: 100%;
    width: 100%;
}
.calendar-dialog-body{
    width: 100%;
    background: #fff;
    position: absolute;
    bottom:0;
    box-sizing: border-box;
}
.calendar {
  border-bottom: 1px solid #E7EDF5;
}
.calendar-btn {
  width:2.13rem;
  height:0.8rem;
  background:rgba(24,144,255,1);
  border-radius:0.11rem;
  font-size: 14px;
  color: #fff;
  text-align: center;
  line-height: 0.8rem;
  margin: 0.4rem auto;
}
</style>
<style lang="scss">
  .earnings .v-modal {
    z-index: 10000000 !important;
  }
</style>
