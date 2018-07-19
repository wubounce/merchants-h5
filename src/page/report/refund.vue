<template>
<div>
  <div class="search">
    <div class="slectdata timechoose">
      <span @click="open('picker2')">{{searchtime}}</span>至<span @click="open('picker3')">{{searchtime2}}</span>
    </div>
    <div class="slectdata shopchoose">
      <span @click="popupVisible=true">{{currentTags?currentTags.shopName:'请选择店铺'}}</span>
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
      <div class="listcon tableearn-list">
        <router-link class="detail" to="/reportdetail" >
          <span class="listtime">2018-06-04</span>
          <span>100</span>
          <span>300.00</span>
        </router-link>
      </div>
      <div class="listcon tableearn-list">
        <router-link class="detail" to="/reportdetail" >
          <span class="listtime">2018-06-04</span>
          <span>100</span>
          <span>300.00</span>
        </router-link>
      </div>
      <div class="listcon tableearn-list">
        <router-link class="detail" to="/reportdetail" >
          <span class="listtime">2018-06-04</span>
          <span>100</span>
          <span>300.00</span>
        </router-link>
      </div>
      <div class="listcon tableearn-list">
        <router-link class="detail" to="/reportdetail" >
          <span class="listtime">2018-06-04</span>
          <span>100</span>
          <span>300.00</span>
        </router-link>
      </div>
    </div>
  </div>
  <mt-datetime-picker ref="picker2" type="date" v-model="value2" @confirm="handleChange"></mt-datetime-picker>
  <mt-datetime-picker ref="picker3" type="date" v-model="value3" @confirm="handleChange"></mt-datetime-picker>
 <!--地址选择组件-->
  <mt-popup v-model="popupVisible" position="bottom" >
    <section class="shoppicker">
      <div class="picker-toolbar">
        <span class="mint-datetime-action mint-datetime-cancel" @click="popupVisible=false">取消</span>
        <span class="mint-datetime-action mint-datetime-confirm" @click="onDateChange">确定</span>
       </div>
      <mt-picker :slots="shopSlots" ref="picker" valueKey="shopName" ></mt-picker>
    </section>
  </mt-popup>
</div>
</template>
<script>
// 引入 ECharts 主模块
import moment from 'moment';
import echarts from 'echarts/lib/echarts';
// 引入折线图
import 'echarts/lib/chart/line';
// 引入提示框和图例组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legendScroll';
import { shopList } from '@/service/report';
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
      value2: null,
      value3: null,
      searchtime:null,
      searchtime2:null,
      shopSlots:[
        {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
      ],
      popupVisible:false,
      currentTags:null

    };
  },
  mounted() {
    this.initChart();
  },
  created(){
      // this.getshopList();
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
      let option = {
        title: {
            text: '收益表'
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
        dataZoom : [
        {
            type: 'inside',
            xAxisIndex: [0],
            start: 1,
            end: 35
        },
        {
            type: 'inside',
            yAxisIndex: [0],
            start: 29,
            end: 36
        }
        ],
        xAxis : [{
          type : 'category',
          boundaryGap : false,
          offset:8,
         data : ['05-29', '05-30','05-31','06-01','06-02','06-03','06-01','06-01','06-30','06-02','06-03','06-01','06-01','06-30', '05-29', '05-30','05-31','06-01','06-02','06-03','06-01','06-01','06-30','06-02','06-03','06-01','06-01','06-30','05-29', '05-30','05-31','06-01','06-02','06-03','06-01','06-01','06-30','06-02','06-03','06-01','06-01','06-30'].map(function (str) {
                return str.replace(' ', '\n');
            }),
          axisLabel: {
            textStyle: {color: '#999'},
            interval: 0
          },
          axisLine:{
            onZero: false,
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
                textStyle: {color: '#999'}
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
                name:'收益金额',
                type:'line',
                stack: '总量',
                symbol: 'circle',
                data:[34, 35, 36, 37, 38, 39, 40, 41, 42,34, 35, 36, 37, 38, 39, 40, 41, 42,34, 35, 36, 37, 38, 39, 40, 41, 42],
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
                data:[34, 35, 36, 37, 38, 39, 40, 41, 42,34, 35, 36, 37, 38, 39, 40, 41, 42,34, 35, 36, 37, 38, 39, 40, 41, 42],
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
      this.chart.setOption(option);
    },
    async getshopList(){
      let res = await shopList();
      if (res.code === 0) {
         this.shopSlots[0].values = res.data.items;
      }
    },
    open(picker) {
      this.$refs[picker].open();
    },
    handleChange() {
      this.searchtime = this.value2 ? moment(this.value2).format('YYYY-MM-DD'):'';
      this.searchtime2 = this.value3 ? moment(this.value3).format('YYYY-MM-DD'):'';
    },
    onDateChange() {
      this.currentTags =this.$refs.picker.getValues()[0];
      this.popupVisible=false;
    }
  },
  components:{
  }
};
</script>
<style lang="scss" scoped>
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
    border: 1px solid #e5e5e5;
    border-radius: 0.053333rem;
    height: 0.746667rem;
    line-height: 0.746667rem;
    background: #fff;
    font-size: 14px;
    span {
      width: 2.133333rem;
      height: 0.746667rem;
      line-height: 0.746667rem;
      display: inline-block;
      text-align: center;
    }
  }
  .timechoose {
    width: 60%;
    span {
      width: 45%;
    }
  }
  .shopchoose {
    width: 40%;
    margin-left: .2rem;
  }
  .mint-popup {
    width: 100%;
  }
</style>
<style>
   .mint-header {
    background: #F2F2F2 !important;
  }
</style>