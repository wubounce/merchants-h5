<template>
  <div class="main" v-title="'首页'">
    <div class="earnings-wrap">
      <div class="earning-type">
        <p>总收益 (元)</p>
        <p class="earning-type-size">{{allMoney}}</p>
      </div>
      <div class="today-earning">
        <p style="margin-top: 0.35rem;">今日收益 (元)</p>
        <p class="today-earning-size">{{todayMoney}}</p>
      </div>
      <div class="earning-type">
        <p>当月收益 (元)</p>
        <p class="earning-type-size">{{monthMoney}}</p>
      </div>
    </div>
    <div class="lineecharts-warp">
      <div>
        <div class="lineechart-title">
          <span class="linetitle">收益数据 <span @click="machineVisible = true;" class="choose-select">{{machinecurrentTags?machinecurrentTags.name:'全部'}}<i class="iconfont icon-nextx select-back"></i></span></span>
          <span class="linedata">
          <span :class="['linedatachoose', {linecurrent: lineSearchIndex === index}]" v-for="(item,index) in lineSearchTime" @click="lineTimeSearch(index)">{{item.lable}}</span>
          </span>
          <selectpickr :visible="machineVisible" :slots="equipmentSlots" :valueKey="machinepickername" @selectpicker="machineselectpicker" @onpickstatus="machineselectpickertatus"> </selectpickr>
        </div>
        <div class="line" id="line" :style="{height:lineheight,width:width}" ref="line"></div>
      </div>
    </div>
    <div class="pei-wrap">
      <div class="lineechart-title pie-title">
        <span class="linetitle">收益分布 <span @click="distributionVisible = true;" class="choose-select">{{distributioncurrentTags?distributioncurrentTags.name:'洗衣机'}}<i class="iconfont icon-nextx select-back"></i></span></span>
        <span class="linedata">
           <span :class="['linedatachoose', {linecurrent: pieSearchIndex === index}]" v-for="(item,index) in lineSearchTime" @click="pieTimeSearch(index)">{{item.lable}}</span>
        </span>
         <selectpickr :visible="distributionVisible" :slots="distributionSlots" :valueKey="machinepickername" @selectpicker="distributionselectpicker" @onpickstatus="distributionselectpickertatus"> </selectpickr>
      </div>
      <div class="piebox">
       <div class="pietype" id="pietype" :style="{height:pieheight,width:width}" ref="pietype"></div>
       <div class="piefun" id="piefun" :style="{height:pieheight,width:width}" ref="piefun"></div>
      </div>
    </div>
    <div class="bar-wrap">
      <div class="">
        <span class="linetitle">设备监控<span  style="font-size: 14px;font-weight: 100;color: #3AA0FF;">(总设备100)</span></span>
        <span class="equipment" @click="equipmentVisible=true">{{equipmentcurrentTags?equipmentcurrentTags.name:'全部'}}<i class="iconfont icon-nextx select-back"></i></span>
        <selectpickr :visible="equipmentVisible" :slots="equipmentSlots" :valueKey="machinepickername" @selectpicker="equipmentselectpicker" @onpickstatus="equipmentselectpickertatus"> </selectpickr>
      </div>
      <div class="bar" id="bar" :style="{height:height,width:width}" ref="bar"></div>
    </div>
  </div>
</template>
<script>
import qs from 'qs';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入折线图
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
// 引入提示框和图例组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legendScroll';
import selectpickr from '@/components/selectPicker';
import { ParentTypeFun, countMachineFun, totalProfitFun, timeProfitFun, typeProfitFun } from '@/service/index';
import { MachineStatus, communicateType } from '@/utils/mapping';

export default {
  props: {
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
      washingMachineId:null,
      machinecurrentTags:null,
      machineVisible:false,
      equipmentVisible:false,
      equipmentcurrentTags:null,
      distributioncurrentTags:null,
      distributionVisible:false,
      equipmentSlots:[ //设备类型
        {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
      ],
     distributionSlots:[ //收益分布
        {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
      ],
      machinepickername:'name',
      barxAxisData:[],
      barseriesData:[],
      linexAxisData:[],
      lineseriesData:[],
      pietypeData:[],
      piefunData:[],
      piefunDatatitle:[],
      allMoney:null, //总收益
      monthMoney:null, //当月收益
      todayMoney:null,//今日收益
      lineSearchTime:[
        {value:0,lable:'今天'},
        {value:1,lable:'7天'},
        {value:2,lable:'30天'}
      ],
      lineSearchIndex:0,
      pieSearchIndex:0
    };
  },
  mounted() {
    this.initChart();
  },
  created(){
    this.ParentTypeFun();
    this.countMachine();
    this.totalProfitFun();
    this.ProfitDate();
  },
  methods: { 
    async ParentTypeFun(){ //获取设备类型
        let res = await ParentTypeFun(qs.stringify({onlyMine:true}));
        let pac = res.data.find(item=>item.name === '洗衣机');
        this.washingMachineId = pac ? pac.id : '';
        this.typeProfitData();
        this.equipmentSlots[0].values = [{name:'全部'},...res.data];
        this.distributionSlots[0].values = [...res.data];
    },
    async countMachine(parentTypeId){ //初始化全部设备监控图表
      let res = null;
      if (parentTypeId) {
        let payload = Object.assign({},{parentTypeId:parentTypeId});
        res = await countMachineFun(qs.stringify(payload));
      } else {
        res = await countMachineFun();
      }
      for(var i in res.data){ //json循环
        this.barseriesData.push(res.data[i]);
        this.barxAxisData.push(MachineStatus(i));
      }
      // 把配置和数据放这里
      this.barchart.setOption(this.barOChartPtion);
    },
    async totalProfitFun(){
      let res = await totalProfitFun();
      this.allMoney = res.data.allMoney; //总收益
      this.monthMoney = res.data.monthMoney; //当月收益
      this.todayMoney = res.data.todayMoney;//今日收益
    },
    async ProfitDate(parentTypeId,type){ //收益数据
      let payload = null;
      if (parentTypeId !== undefined || parentTypeId !== null && type !== undefined) {
        payload = Object.assign({},{parentTypeId:parentTypeId,type:type});
      } else {
        payload = Object.assign({},{type:0});
      }
      let res = await timeProfitFun(qs.stringify(payload));
      res.data.forEach(item=>{
          this.lineseriesData.push(item.sum);
          this.linexAxisData.push(item.time);
      });
      
      // 把配置和数据放这里
      this.linechart.setOption(this.lineChartOption);
    },
    async typeProfitData(parentTypeId,type){ //收益分布
      let payload = null;
      if (parentTypeId !== undefined && type !== undefined) {
        payload = Object.assign({},{parentTypeId:parentTypeId,type:type});
      } else {
        payload = Object.assign({},{parentTypeId:this.washingMachineId,type:0});
      }
      let res = await typeProfitFun(qs.stringify(payload));
      let communicateTypeData = res.data ? res.data.communicateType :[];
      communicateTypeData.forEach(item=>{
          this.pietypeData.push({
            value: item.sum,
            name: communicateType(Number(item.type))
          });
      });
      let machineTypeData = res.data ? res.data.machineType :[];
      machineTypeData.forEach(item=>{
        this.piefunDatatitle.push({
          name:item.type,
          icon : 'circle',
          textStyle:{fontWeight:'normal', color:'#999',fontSize:12, padding:0},
        });
        this.piefunData.push({
          value: item.sum,
          name: item.type
        });
      });
      // 把配置和数据放这里
      this.pietypechart.setOption(this.pietypeChartOPtion);
      this.piefunchart.setOption(this.piefunChartOption);
    },
    initChart() {
      this.linechart = echarts.init(document.getElementById('line'));
      this.barchart = echarts.init(document.getElementById('bar'));
      this.pietypechart = echarts.init(document.getElementById('pietype'));
      this.piefunchart = echarts.init(document.getElementById('piefun'));
    },
    machineselectpicker(data){ //收益收据选择设备类型搜索
      this.machinecurrentTags = data;
      this.linexAxisData=[];
      this.lineseriesData=[];
      let type = this.lineSearchTime[this.lineSearchIndex].value;
      let parentTypeId = this.machinecurrentTags ? this.machinecurrentTags.id : null;
      this.ProfitDate(parentTypeId,type);
    },
    machineselectpickertatus(data){
      this.machineVisible = data;
    },
    lineTimeSearch: function(index) { //收益收据选择时间搜索
      this.linexAxisData=[];
      this.lineseriesData=[];
      this.lineSearchIndex = index;
      let type = this.lineSearchTime[index].value;
      let parentTypeId = this.machinecurrentTags ? this.machinecurrentTags.id : null;
      this.ProfitDate(parentTypeId,type);
    },
    distributionselectpicker(data){ //收益分布选择设备类型搜索
      this.distributioncurrentTags = data;
      this.pietypeData=[];
      this.piefunData=[];
      let type = this.lineSearchTime[this.pieSearchIndex].value;
      console.log(this.distributioncurrentTags,type);
      this.typeProfitData(this.distributioncurrentTags.id,type);
    },
    distributionselectpickertatus(data){
      this.distributionVisible = data;
    },
    pieTimeSearch: function(index) { //收益分布选择时间搜索
      this.pietypeData=[];
      this.piefunData=[];
      this.pieSearchIndex = index;
      let type = this.lineSearchTime[index].value;
      let parentTypeId = this.distributioncurrentTags ? this.distributioncurrentTags.id : this.washingMachineId;
      this.typeProfitData(parentTypeId,type);
    },
    equipmentselectpicker(data){ //切换设备监控图表
      this.equipmentcurrentTags = data;
      this.barxAxisData=[];
      this.barseriesData=[];
      this.countMachine(this.equipmentcurrentTags.id);
    },
    equipmentselectpickertatus(data){
      this.equipmentVisible = data;
    },
  },
  computed:{
    lineChartOption(){
      let opt = {
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
          data : this.linexAxisData,
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
        }],
        series: [{
            symbol: 'circle',
            data: this.lineseriesData,
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
      };
      return opt;
    },
    barOChartPtion(){
      let opt = {
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
          data: this.barxAxisData,
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
          data: this.barseriesData
        }]
      };
      return opt;
    },
    pietypeChartOPtion(){
      let opt = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            y: 'bottom',
            x:'center',
            bottom:'40%',
            itemWidth:6,
            itemHeight:6,
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
                      length:2,
                      length2:2,
                  }
              },
              data:this.pietypeData,
              color: ['rgb(59,161,255)','rgb(243,100,124)']
          }
        ]
      };
      return opt;
    },
    piefunChartOption(){
      let opt = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            y: 'bottom',
            x:'center',
            bottom:'50%',
            padding :0,
            itemGap:4,
            itemWidth:6, //图表大小
            itemHeight:6,
            data:this.piefunDatatitle
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
                      length:1,
                      length2:1,
                  }
              },
              data:this.piefunData,
              color: ['rgb(59,161,255)','#37CCCC','rgb(243,100,124)','#4ECC74','#FBD438']
          }
        ]
      };
      return opt;
    }
  },
  components:{
    selectpickr
  }
};
</script>
<style type="text/css" lang="scss" scoped>
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

  .linetitle {
    font-size: 16px;
    font-weight: 600;
    width: 55%;
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
  }
  .choose-select {
    display: inline-block;
    font-size: 14px;
    border-bottom:1px solid #e5e5e5;
    height: 0.746667rem;
    line-height: 0.746667rem;
    margin-left: 0.3rem;
    color: #666;
    font-weight: normal;
  }
  .select-back {
    margin-left: 0.1rem;
  }
  .pei-wrap {
    margin-top: 0.266667rem;
    background: #fff;
    .pie-title {
      padding: 0.32rem 0.32rem 0 0.32rem;
    }
  }
  .bar-wrap {
    margin-bottom: 55px;
  }
  .piebox {
    display: flex;
    text-align: left;
    background: #fff;
    padding-bottom: 0.32rem
  }
  .piebox>div {
    flex: 1;
  }
  .bar-wrap {
    background: #fff;
    margin-top: 0.266667rem;
    margin-bottom: 1.73rem;
    padding: 0.32rem;
  }
  .equipment {
    font-size: 14px;
    text-align: right;
    display: inline-block;
    font-size: 14px;
    border-bottom:1px solid #e5e5e5;
    height: 0.746667rem;
    line-height: 0.746667rem;
    text-align: left;
    float: right;
    color:#666;
  }
  .earnings-wrap {
    width:100%;
    height:3.2rem;
    background: url(../../../static/image/index/todayearnings@2x.png);
    background-size: cover;
    display: flex;
    p {
      color: #fff;
      font-size: 12px;
      text-align: center;
    }
  }
  .today-earning {
    width:3.87rem;
    background:rgba(255,255,255,0.16);
    border-radius:0.27rem;
    margin-top: 0.35rem;
    height: 2.53rem;
  }
  .earning-type {
    width: 3.07rem;
    padding-top: 0.95rem;
  }
  .earning-type-size {
    font-size: 32px !important;
    font-family:PingFangSC-Regular;
  }
  .today-earning-size {
    font-size: 50px !important;
    font-family:PingFangSC-Regular;
  }
</style>
<style lang="scss"> 
.main {
  .mint-header {
    background: #F2F2F2 !important;
  }
  .mint-popup {
    width: 100%;
  }
}
</style>
