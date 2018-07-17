<template>
  <div>
    <div class="bar" id="bar" :style="{height:height,width:width}" ref="bar"></div>
       <div class="piebox">
         <div class="pietype" id="pietype" :style="{height:height,width:width}" ref="pietype"></div>
         <div class="piefun" id="piefun" :style="{height:height,width:width}" ref="piefun"></div>
       </div>
    <div class="line" id="line" :style="{height:height,width:width}" ref="line"></div>
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
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      
      barchart: null,
      linechart: null,
      pietypechart: null,
      piefunchart: null,
    };
  },
  mounted() {
    this.selfAdaption();
    this.initbarChart();
    this.initlineChart();
    this.initpietypeChart();
    this.initpiefunChart();
  },
  beforeDestroy() {
    if (!this.barchart) {
      return;
    }
    this.barchart.dispose();
    this.barchart = null;
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
    initbarChart() {
      this.barchart = echarts.init(document.getElementById('bar'));
      // 把配置和数据放这里
      this.barchart.setOption({
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
          left: '3%',
          right: '4%',
          bottom: '6%',
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
    initlineChart() {
      this.linechart = echarts.init(document.getElementById('line'));
      // 把配置和数据放这里
      this.linechart.setOption({
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
    initpietypeChart(){
      this.pietypechart = echarts.init(document.getElementById('pietype'));
      this.pietypechart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            y: 'bottom',
            x:'center',
            top:230,
            data:[{
                name:'脉冲',
                icon : 'circle',
                textStyle:{fontWeight:'normal', color:'#999'},
                borderRadius:2
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
              radius: ['40%', '60%'],
              avoidLabelOverlap: false,
              label: {
                  normal: {
                      show: true,
                      position: 'outside',
                      formatter: '{d}%',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
                      color:'#333'
                  },
                  emphasis: {
                      show: true,
                      textStyle: {
                          fontSize: '14',
                          fontWeight: 'normal'
                      }
                  }
              },
              labelLine: {
                  normal: {
                      show: false,
                      length:0.0001,
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
      this.piefunchart = echarts.init(document.getElementById('piefun'));
      this.piefunchart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            y: 'bottom',
            x:'center',
            top:230,
            data:[{
                name:'单脱',
                icon : 'circle',
                textStyle:{fontWeight:'normal', color:'#999'},
            },{
                name:'快洗',
                icon : 'circle',
                textStyle:{fontWeight:'normal', color:'#999'}
            },{
                name:'标准杀菌',
                icon : 'circle',
                textStyle:{fontWeight:'normal', color:'#999'},
            },{
                name:'标准洗',
                icon : 'circle',
                textStyle:{fontWeight:'normal', color:'#999'}
            },{
                name:'大物洗',
                icon : 'circle',
                textStyle:{fontWeight:'normal', color:'#999'}
            }]
        },
        series: [
            {
              name:'功能类型',
              type:'pie',
              radius: ['40%', '60%'],
              avoidLabelOverlap: false,
              label: {
                  normal: {
                      show: true,
                      position: 'outside',
                      formatter: '{d}%',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
                      color:'#333'
                  },
                  emphasis: {
                      show: true,
                      textStyle: {
                          fontSize: '14',
                          fontWeight: 'normal'
                      }
                  }
              },
              labelLine: {
                  normal: {
                      show: false,
                      length:0.0001,
                  }
              },
              data:[
                  {value:40, name:'单脱'},
                  {value:21, name:'快洗'},
                  {value:9, name:'标准杀菌'},
                  {value:17, name:'标准洗'},
                  {value:13, name:'大物洗'}
              ],
              color: ['rgb(59,161,255)','rgb(243,100,124)']
          }
        ]
      });
    }
  },
  components:{
    QMenu
  }
};
</script>
<style type="text/css" lang="less" scoped>
  .piebox {
    display: flex;
  }
  .piebox>div {
    flex: 1;
  }
</style>
