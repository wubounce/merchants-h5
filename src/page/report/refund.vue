<template>
<div class="earnings">
  <div class="search">
    <div class="slectdata monthchoose"  @click="dateVisible = true;">
      <span>{{dateCurrentTag.label}}</span><i class="iconfont icon-xiangxiajiantou select-back"></i>
    </div>
    <div class="slectdata timechoose"  @click="openByDialog">
      <span class="time">{{startDate.join('-')}}</span><span class="zhi">至</span><span class="time">{{endDate.join('-')}}</span><i class="iconfont icon-xiangxiajiantou select-back"></i>
    </div>
    <div class="slectdata shopchoose"  @click="popupVisible=true;">
      <span>{{currentTags?currentTags.shopName:'全部店铺'}}</span><i class="iconfont icon-xiangxiajiantou select-back"></i>
    </div>
  </div>
  <div class="echarts-warp">
    <div class="order-earchs-title">
      <span>退款金额</span>
      <span class="order-num">订单数</span>
    </div>
    <div :class="className" :id="id" :style="{height:height,width:width}" ref="myEchart"></div>
    <div class="echart-title">
      <div class="money"><i style="background:#1890FF"></i>总退款金额<span class="totalMoney">({{totalMoney | tofixd}}元)</span></div>
      <div  class="order"><i style="background:#FACC14"></i>总订单数量<span class="totalOrder">({{totalCount}})</span></div>
    </div>
  </div>
  <div :class="['export', {'export-disable':listdata.length<=0}]">
     <span @click="exportExls"><i class="iconfont icon-daochu"></i>导出</span>
  </div>
  <div class="tabledata">
    <div class="tableearn">
       <div class="listcon table-header">
        <span class="report-table-date">日期</span>
        <span class="report-table-order">订单数量</span>
        <span class="report-table-order">退款金额</span>
       </div>
      <div class="listcon tableearn-list" v-for="(item,index) in  listdata" :key="index" @click="goDetail(item.date)">
         <div class="detail">
          <span class="listtime report-table-date">{{item.date}}</span>
          <span  class="report-table-order">{{item.count}}</span>
          <span  class="report-table-order">{{item.money | tofixd}}</span>
        </div>
      </div>
      <div class="nodata" v-if="listdata.length <= 0">暂无数据</div>
    </div>
  </div>

  <mt-popup v-model="calendar.show" position="bottom" class="mint-popup">
     <div class="calendar-dialog-body">
        <calendar :range="calendar.range" :zero="calendar.zero" :lunar="calendar.lunar" :begin="calendar.begin" :end="calendar.end" :type="calendar.type" :value="calendar.value"  @select="calendar.select"></calendar>
        <mt-button class="calendar-btn" @click="selectDateCom">确定</mt-button>
    </div>
  </mt-popup>
  <!-- 按日按月 -->
  <selectpickr :visible="dateVisible" :slots="dateSlots"  :title="'时间'" :valueKey="keyname" @selectpicker="dateselectpicker" @onpickstatus="dateselectpickertatus"></selectpickr>
  <!-- 选择店铺 -->
  <selectpickr :visible="popupVisible" :slots="shopSlots" :valueKey="shopName" :title="'店铺'" @selectpicker="shopselectpicker" @onpickstatus="shopselectpickertatus"></selectpickr>
</div>
</template>
<script>

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
import { calMax, calMin } from '@/utils/tool';
import calendar from '@/components/vue-calendar/calendar.vue';
import { MessageBox } from 'mint-ui';
import { setEmail, getEmail } from '@/utils/tool';
import { validatEmail } from '@/utils/validate';

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
              {label: '按日',value:1},
              {label: '按月',value:2}
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

      listdata:[],
      popupVisible:false,
      currentTags:null,
      reportDate:[],
      reportCount:[],
      reportMoney:[],
      pickerEndDate:new Date(moment().format('YYYY-MM-DD')),
      orderMax:null,
      moneyMax:null,
      orderMin:null,
      moneyMin:null,
      totalCount:null,
      totalMoney:null,

      calendar:{
        range:true,
        lunar:false, //显示农历
        begin:[2017,9,15], //可选开始日期
        show:false,
        zero:true,
        type:'datetime',
        value:[], //默认日期
        select:(begin,end)=>{
          this.startDate = begin;
          this.endDate = end;
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
      this.shopSlots[0].values = [{shopName:'全部店铺'},...res];
    },
    async dayReportFun(){
      let shopId = this.currentTags?this.currentTags.shopId:null;
      let payload = Object.assign({},{startDate:this.startDate.join('-'),endDate:this.endDate.join('-'),type:3,shopId:shopId,dateLevel:this.dateLevel});
      let res = await dayReportFun(payload);
      this.reportDate = [];
      this.reportCount = [];
      this.reportMoney = [];
      res.list.forEach(item=>{
        if (this.dateLevel === 1) {
          this.reportDate.push(moment(item.date).format('MM-DD'));
        } else {
          this.reportDate.push(item.date);
        }
        this.reportCount.push(item.count);
        this.reportMoney.push(item.money);
      });
      this.orderMax = calMax(this.reportCount)>0 ? calMax(this.reportCount) : 1;//订单Y轴最大值
      this.moneyMax = calMax(this.reportMoney)>0 ? calMax(this.reportMoney) : 1;//金额Y轴最大值
      this.orderMin = calMin(this.reportCount);//订单Y轴最大值
      this.moneyMin = calMin(this.reportMoney);//金额Y轴最大值
      this.listdata = res.list;
      this.listdata.sort(this.ortId); //表格时间倒序
      this.totalMoney = res.totalMoney;
      this.totalCount = res.totalCount;

      this.chart.setOption(this.chartOption);
    },
    ortId(a,b){ //数据排序
      let k = a.date.replace(/\-/g, '');   
      let h = b.date.replace(/\-/g, '');
      return h-k;
    },
    shopselectpicker(data){
      this.currentTags = data;
      this.dayReportFun();
    },
    shopselectpickertatus(data){
      this.popupVisible = data;
    },
    dateselectpicker(data){
      this.dateCurrentTag = data;
      if (data.label === '按日') {
        this.dateLevel = 1;
        this.calendar.type = 'datetime';
        this.startDate = moment().subtract('days',6).format('YYYY-MM-DD').split('-');
        this.endDate = moment().format('YYYY-MM-DD').split('-');
        this.dayReportFun();
      } else if(data.label === '按月'){
        this.calendar.type = 'month';
        this.dateLevel = 2;
        this.startDate = moment().subtract('months',5).format('YYYY-MM').split('-');
        this.endDate = moment().format('YYYY-MM').split('-');
        this.dayReportFun();
      }
    },
    dateselectpickertatus(data){
      this.dateVisible = data;
    },
    openByDialog(){
      this.calendar.show=true;
      this.calendar.value = [this.startDate,this.endDate];
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
        this.$router.push({name:'reportShopDetail', query:{date:date,type:3,dateLevel:this.dateLevel}});
      }
      
    },
    exportExls(){
      if(this.listdata.length<=0) return false;
      MessageBox.prompt(' ', '确定导出 2018-09-06 流水明细？', {
            inputPlaceholder:'请填写导出表格的邮箱地址',
            inputValue:getEmail()?getEmail():null,
          inputValidator: (val) => {
            if (val === null) {
              return true;//初始化的值为null，不做处理的话，刚打开MessageBox就会校验出错，影响用户体验
            }
            return validatEmail(val);
          }, inputErrorMessage: '请输入正确的邮箱地址'
        }).then(async (val) => {
          let shopId = this.currentTags?this.currentTags.shopId:null;
          let payload = Object.assign({},{
            startDate:this.startDate.join('-'),
            endDate:this.endDate.join('-'),
            type:1,
            shopId:shopId,
            dateLevel:this.dateLevel,
            excel:true,
            email:val.value
          });
          let res = await dayReportFun(payload);
        }, () => {
          
        });
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
          boundaryGap : false,
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
          axisTick: {length:5},
        }],
        yAxis: [
          {   name: '退款金额',
              type: 'value',
              min:this.moneyMin,
              max:this.moneyMax,
              splitNumber:4,
              interval:(this.moneyMax-this.moneyMin)/4,
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
              min:this.orderMin,
              max:this.orderMax,
              splitNumber:4,
              interval:(this.orderMax-this.orderMin)/4,
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
  watch: {
    dateVisible: function () {
      if (this.dateVisible) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    },
    popupVisible: function () {
      if (this.popupVisible) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    },
    'calendar.show': function () {
      if (this.calendar.show) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    }
  },
  components:{
    selectpickr,
    calendar
  }
};
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/report/report";
</style>
<style>
  @media screen and (max-width: 360px) {
    .slectdata,.echart-title {  font-size: 12px !important; }
  }
</style>