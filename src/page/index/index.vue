<template>
  <div class="main">
    <q-header :title="title"></q-header>
    <div class="lineecharts-warp">
      <div style="border: 1px dashed #333;">
        <div class="lineechart-title">
          <span class="linetitle">收益金额</span>
          <span class="linedata"><span class="linedatachoose linecurrent">今天</span><span class="linedatachoose">7天</span><span class="linedatachoose">30天</span></span>
        </div>
        <div class="line" id="line" :style="{height:lineheight,width:width}" ref="line"></div>
      </div>
      
    </div>
    <div class="pei-wrap">
        <div class="slectdata">
          <span @click="popupVisible=true">{{currentTags?currentTags.shopName:'洗衣机'}}</span>
        </div>
       <div class="piebox">
         <div class="pietype" id="pietype" :style="{height:pieheight,width:width}" ref="pietype"></div>
         <div class="piefun" id="piefun" :style="{height:pieheight,width:width}" ref="piefun"></div>
       </div>
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
    <div class="bar-wrap">
      <div class="">
        <span class="linetitle">设备监控<span  style="font-size: 14px;font-weight: 100;color: #3AA0FF;">(总设备100)</span></span>
        <span class="equipment" @click="popupVisible=true">{{currentTags?currentTags.shopName:'全部'}}</span>
      </div>
      <div class="bar" id="bar" :style="{height:height,width:width}" ref="bar"></div>
    </div>
    <q-menu></q-menu>
  </div>
</template>
<script>
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入折线图
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
// 引入提示框和图例组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legendScroll';
import QMenu from '@/components/menu';
import QHeader from '@/components/header';

export default {
  props: {
    className: {
      type: String,
      default: 'yourClassName'
    },
    id: {
      type: String,
      default: 'yourID'
    },
    width: {
      type: String,
      default: '100%'
    },
    lineheight: {
      type: String,
      default: '4.453333rem'
    },
    pieheight: {
      type: String,
      default: '6rem'
    },
    height: {
      type: String,
      default: '4.453333rem'
    }
  },
  data() {
    return {
      title:'首页',
      barchart: null,
      linechart: null,
      pietypechart: null,
      piefunchart: null,
      popupVisible:false,
      currentTags:null
    };
  },
  mounted() {
    this.selfAdaption();
    this.$nextTick(() => {
      this.initbarChart();
      this.initlineChart();
      this.initpietypeChart();
      this.initpiefunChart();
    });
  },
  methods: {
    //echarts自适应
   selfAdaption ()  {
     let _this = this;
     setTimeout(() => {
         window.addEventListener('resize', function () {
            _this.$refs.bar.resize();
            _this.$refs.pietype.resize();
            _this.$refs.piefun.resize();
            _this.$refs.line.resize();
         });
      }, 10);
    },
    initlineChart() {
      let chart = echarts.init(document.getElementById('line'));
      // 把配置和数据放这里
      chart.setOption({
        title: {
            text: '收益收据'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              label: {
                  backgroundColor: '#6a7985'
              }
          }
        },
        grid: {
            y:10,
            x:10,
            x2:15,
            y2:10,
            containLabel: true,
        },
        xAxis : [{
          type : 'category',
          boundaryGap : false,
          offset:8,
          data : ['03:00','06:00','09:00','12:00','15:00','18:00','21:00','24:00'],
          axisLabel: {
            textStyle: {color: '#999'},
            interval: 0
          },
          axisLine:{
            show:false,
            lineStyle:{
              color:'#e6e6e6',
              type:'solid'
            }
          },
        }],
        yAxis : [{
          type : 'value',
          offset:10,
          min: 0,
          max:160.00,
          minInterval: 40,
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
        }],
        series: [{
            symbol: 'circle',
            data: [35, 23, 45, 69, 24, 38, 130,78],
            type: 'line',
             itemStyle: {
                normal: {
                    color: "#1890ff",
                    lineStyle: {
                        color: "#1890ff"
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
        }]
      });
    },
    initbarChart() {
      let chart = echarts.init(document.getElementById('bar'));
      // 把配置和数据放这里
      chart.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle : {                       // 阴影指示器样式设置
                width: '10px',                   // 阴影大小
                color: 'rgba(150,150,150,0.3)'  // 阴影颜色
            }
          }
        },
        grid: {
          y:10,
          x:10,
          x2:15,
          y2:10,
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['运行中', '空闲', '故障', '离线', '未激活', '超时未工作'],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            textStyle: {color: '#999'},
            interval: 0
          },
          axisLine:{
            show:false,
            lineStyle:{
              color:'#e6e6e6',
              type:'solid'
            }
          },
        }],
        yAxis: [{
          type : 'value',
          splitLine:{  
            show:true,
            lineStyle:{
              color:'#e6e6e6',
              type:'soild'
            }
          },
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
          min:0,
          max:80,
          splitNumber:5
        }],
        series: [{
          name: '直接访问',
          type: 'bar',
          barWidth: '30%',
          data: [23, 30, 41, 50, 2, 65]
        }]
      });
    },
    initpietypeChart(){
      let chart = echarts.init(document.getElementById('pietype'));
      chart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            y: 'bottom',
            x:'center',
            bottom:'40%',
            data:[{
                name:'脉冲',
                icon : 'circle',
                textStyle:{fontWeight:'normal', color:'#999'},
            },{
                name:'串口',
                icon : 'circle',
                textStyle:{fontWeight:'normal', color:'#999'}
            }]
        },
        series: [
            {
              name:'通信类型',
              type:'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                  normal: {
                      show: true,
                      position: 'outside',
                      formatter: '{d}%',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
                      color:'#333'
                  },
              },
              labelLine: {
                  normal: {
                      show: false,
                      length:3,
                      length2:3,
                  }
              },
              data:[
                  {value:70, name:'脉冲'},
                  {value:30, name:'串口'},
              ],
              color: ['rgb(59,161,255)','rgb(243,100,124)']
          }
        ]
      });
    },
    initpiefunChart(){
      let chart = echarts.init(document.getElementById('piefun'));
      chart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            y: 'bottom',
            x:'center',
            bottom:'40%',
            padding :0,
            itemGap:3,
            height:300,
            data:[{
                name:'单脱',
                icon : 'circle',
                textStyle:{fontWeight:'normal', color:'#999',fontSize:12, padding:0},
            },{
                name:'快洗',
                icon : 'circle',
                textStyle:{fontWeight:'normal', color:'#999',fontSize:12, padding:0}
            },{
                name:'标准杀菌',
                icon : 'circle',
                textStyle:{fontWeight:'normal', color:'#999',fontSize:12, padding:0},
            },{
                name:'标准洗',
                icon : 'circle',
                textStyle:{fontWeight:'normal', color:'#999',fontSize:12, padding:0}
            },{
                name:'大物洗',
                icon : 'circle',
                textStyle:{fontWeight:'normal', color:'#999',fontSize:12, padding:0}
            }]
        },
        series: [
            {
              name:'功能类型',
              type:'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                  normal: {
                      show: true,
                      position: 'outside',
                      formatter: '{d}%',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
                      color:'#333'
                  },
              },
              labelLine: {
                  normal: {
                      show: false,
                      length:3,
                      length2:3,
                  }
              },
              data:[
                  {value:40, name:'单脱'},
                  {value:21, name:'快洗'},
                  {value:9, name:'标准杀菌'},
                  {value:17, name:'标准洗'},
                  {value:13, name:'大物洗'}
              ],
              color: ['rgb(59,161,255)','#37CCCC','rgb(243,100,124)','#4ECC74','#FBD438']
          }
        ]
      });
    }
  },
  components:{
    QMenu,
    QHeader,

  }
};
</script>
<style type="text/css" lang="less" scoped>
 .main {
  height: 100%;
 }
  .lineecharts-warp {
      padding: 0.32rem;
     
      background: #fff;
  }
  .lineechart-title {
    display: flex;
  }
  .lineechart-title>span {
    flex: 1;
  }
  .linetitle {
    font-size: 16px;
    font-weight: 600;
  }
  .linedata {
    font-size: 14px;
    color: #666;
  }
  .linedatachoose {
    width:1.333333rem;
    height:0.746667rem;
    display: inline-block;
    text-align: center;
    line-height: 0.74rem;
    color: #666;
    border-radius: 57px;
  }
  .linecurrent {
    background:-webkit-gradient(linear,0 50%,100% 50%,from(#1597FF),to(#07B6FE));
    background:-webkit-linear-gradient(left,#1597FF,#07B6FE);
     color: #fff;
  }
  .slectdata {
      width: 100%;
      height: 0.746667rem;
      line-height: 0.746667rem;
      text-align: right;
       padding-bottom: 0.32rem;
      span {
        display: inline-block;
        font-size: 14px;
        border:1px solid #e5e5e5;
        width: 1.493333rem;
        height: 0.746667rem;
        line-height: 0.746667rem;
        margin-right: 0.266667rem;
        text-align: center;
      }
  }
  .pei-wrap {
    background: #fff;
  }
  .bar-wrap {
    margin-bottom: 55px;
  }
  .piebox {
    display: flex;
    text-align: left;
  }
  .piebox>div {
    flex: 1;
  }
  .piefun {
    border: 1px dashed #333;
  }
  .bar-wrap {
    background: #fff;
    margin-top: 0.266667rem;
    margin-bottom: 1.733333rem;
    padding: 0.32rem;
  }
  .equipment {
    font-size: 14px;
    text-align: right;
    display: inline-block;
    font-size: 14px;
    border: 1px solid #e5e5e5;
    width: 1.466667rem;
    height: 0.746667rem;
    line-height: 0.746667rem;
    text-align: center;
    float: right;
  }
</style>
<style> 
.mint-header {
    background: #F2F2F2 !important;
  }
</style>
