<template>
  <div class="main">
    <div class="notice-head">
      <router-link to="/downloadapp">
        <img src="https://static.qiekj.com/merchants-h5/download.png" alt="">
      </router-link>
    </div>
    <div class="earnings-wrap">
      <router-link :to="{ name: 'totalincome', query:{allMoney: allMoney } }">
        <div class="earning-type">
          <p style='padding-top:0.12rem;'>总收益 (元)</p>
          <p class="earning-type-size">{{allMoney?allMoney:'0.00'| tofixd}}</p>
        </div>
      </router-link>
      <router-link :to="{ name: 'todayincome', query:{dateName:thisDay , fromMonth: fromMonth , todayMoney: todayMoney } }">
        <div class="today-earning">
          <p style="margin-top: 0.35rem;padding-top: 0.4rem;">今日收益 (元)</p>
          <p class="today-earning-size">{{todayMoney?todayMoney:'0.00'| tofixd}}</p>
        </div>
      </router-link>
      <router-link :to="{ name: 'monthincome', query:{ dateName: thisMonth , monthMoney: monthMoney } }">
        <div class="earning-type">
          <p style='padding-top:0.12rem;'>当月收益 (元)</p>
          <p class="earning-type-size">{{monthMoney?monthMoney:'0.00'| tofixd}}</p>
        </div>
      </router-link>
    </div>
    <div class="lineecharts-warp">
      <div>
        <div class="lineechart-title">
          <span class="linetitle">收益数据 <span @click="machineVisible = true;" :class="['choose-select',,{'choose-select-type': machinecurrentTags}]" v-if="parentTypList.length>0">{{machinecurrentTags?machinecurrentTags.name:'全部'}}<i class="iconfont icon-xiangxiajiantou select-back"></i></span></span>
          <span class="linedata">
            <span :class="['linedatachoose', {linecurrent: lineSearchIndex === index}]" v-for="(item,index) in lineSearchTime" @click="lineTimeSearch(index)">{{item.lable}}</span>
          </span>
          <selectpickr :visible="machineVisible" :slots="equipmentSlots" :title="'设备类型'" :valueKey="machinepickername" @selectpicker="machineselectpicker" @onpickstatus="machineselectpickertatus"> </selectpickr>
        </div>
        <div class="line" id="line" :style="{height:lineheight,width:width}" ref="line"></div>
      </div>
    </div>
    <div class="pei-wrap">
      <div class="lineechart-title pie-title">
        <span class="linetitle">收益分布 <span @click="distributionVisible = true;" class="choose-select choose-select-type" v-if="parentTypList.length>0">{{distributioncurrentTags?distributioncurrentTags.name:hasWashingMachine}}<i class="iconfont icon-xiangxiajiantou select-back"></i></span></span>
        <span class="linedata">
          <span :class="['linedatachoose', {linecurrent: pieSearchIndex === index}]" v-for="(item,index) in lineSearchTime" @click="pieTimeSearch(index)">{{item.lable}}</span>
        </span>
        <selectpickr :visible="distributionVisible" :slots="distributionSlots" :title="'设备类型'" :valueKey="machinepickername" @selectpicker="distributionselectpicker" @onpickstatus="distributionselectpickertatus"> </selectpickr>
      </div>
      <div class="piebox">
        <div class="pietype" id="pietype" :style="{height:pieheight,width:width}" ref="pietype"></div>
        <div class="piefun" id="piefun" :style="{height:pieheight,width:width}" ref="piefun"></div>
      </div>
    </div>
    <div class="bar-wrap">
      <div class="" style="height: .8rem;">
        <span class="linetitle" style="float: left;">设备监控<span style="font-size: 14px;font-weight:normal;color: #1890FF;">(总设备{{allmMachine}})</span></span>
        <span class="equipment" @click="equipmentVisible=true" v-if="parentTypList.length>0">{{equipmentcurrentTags?equipmentcurrentTags.name:'全部'}}<i class="iconfont icon-xiangxiajiantou select-back"></i></span>
        <selectpickr :visible="equipmentVisible" :slots="equipmentSlots" :title="'设备类型'" :valueKey="machinepickername" @selectpicker="equipmentselectpicker" @onpickstatus="equipmentselectpickertatus"> </selectpickr>
      </div>
      <div style="height: 4.45rem;">
        <div class="bar" id="bar" :style="{height:height,width:width}" ref="bar"></div>
      </div>
      <div class="offline-tip" v-if="offlineTip"><span class="iconfont icon-guanbi1" @click="offlineTip=false;"></span> 离线：连续30分钟未在线的设备数量。可能由于断电，信号不稳定，模块、设备损坏等原因引起，请自行检查或联系客服报备。</div>
    </div>
    <div class="activity-wrap" v-if="noticeShow">
      <div class="activity">
        <div class="pic">
          <img src="https://static.qiekj.com/merchants-h5/notice.png" alt="">
        </div>
        <div class=" apply">
          <p class="apply-title">亲爱的商户，您好！</p>
          <p class="apply-con">为了给您更好、更高效的管理体验，企鹅商家版App现已全面上线，我们也将在<span>2019年4月18日</span>正式下线手机网页版的企鹅商家管理平台。点击下方【立即下载】按钮即可下载最新版本企鹅商家版APP。感谢您对企鹅共享的支持！</p>
          <p class="godowload"><a href="https://bm.qiekj.com/downloadapp"><img class="dowload_phone" src="https://static.qiekj.com/merchants-h5/phone.png" alt="立即下载">立即下载</a></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { calMax, calMin } from '@/utils/tool';
import selectpickr from '@/components/selectPicker';
import { ParentTypeFun, countMachineFun, totalProfitFun, timeProfitFun, typeProfitFun } from '@/service/index';
import { MachineStatus, communicateType } from '@/utils/mapping';
import { getNoticeType, setNoticeType, removeNoticeType } from '@/utils/tool';
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
      noticeShow: true,
      offlineTip: true,
      barchart: null,
      linechart: null,
      pietypechart: null,
      piefunchart: null,
      washingMachineId: null,
      hasWashingMachine: '',
      machinecurrentTags: null,
      machineVisible: false,
      equipmentVisible: false,
      equipmentcurrentTags: null,
      distributioncurrentTags: null,
      distributionVisible: false,
      equipmentSlots: [
        //设备类型
        {
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      allmMachine: null,
      distributionSlots: [
        //收益分布
        {
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      machinepickername: 'name',
      barxAxisData: [],
      barseriesData: [],
      linexAxisData: [],
      lineseriesData: [],
      pietypeData: [],
      piefunData: [],
      piefunDatatitle: [],
      allMoney: null, //总收益
      monthMoney: null, //当月收益
      todayMoney: null, //今日收益
      lineSearchTime: [{ value: 0, lable: '今天' }, { value: 1, lable: '7天' }, { value: 2, lable: '30天' }],
      lineSearchIndex: 0,
      pieSearchIndex: 0,

      lineMax: null,
      lineMin: null,
      barMax: null,
      parentTypList: [],
      thisMonth: '', //本月
      thisDay: '' //今日
    };
  },
  mounted() {
    this.initChart();
  },
  created() {
    this.ParentTypeFun();
    this.countMachine();
    this.totalProfitFun();
    this.ProfitDate();
    this.getThisMonth();
    this.getThisDay();
    if (getNoticeType() != 1) {
      this.noticeShow = true;
    } else {
      this.noticeShow = false;
    }
  },
  methods: {
    closeNotice() {
      this.noticeShow = false;
      setNoticeType(1);
    },
    //获取本月
    getThisMonth() {
      let date = new Date();
      this.thisMonth = moment(date).format('YYYY-MM');
    },
    //获取今天
    getThisDay() {
      let date = new Date();
      this.thisDay = moment(date).format('YYYY-MM-DD');
      this.fromMonth = false;
    },
    async ParentTypeFun() {
      //获取设备类型
      let res = await ParentTypeFun({ onlyMine: true });
      res = res.length > 0 ? res : [];
      this.parentTypList = res;
      let fristType = res.length > 0 ? res[0] : [{ id: '', name: '' }]; //如果有洗衣机优先展示洗衣机,没有洗衣机优先展示第一个类型
      let pac = res.find(item => item.name === '洗衣机');
      this.washingMachineId = pac ? pac.id : fristType.id;
      this.hasWashingMachine = pac ? '洗衣机' : fristType.name;
      this.typeProfitData();
      this.equipmentSlots[0].values = [{ name: '全部' }, ...res];
      this.distributionSlots[0].values = [...res];
    },
    async countMachine(parentTypeId = '') {
      //设备监控
      let res = await countMachineFun({ parentTypeId: parentTypeId });
      this.barseriesData = [];
      this.barxAxisData = [];
      this.allmMachine = res.all; //设备总数
      delete res.all; //图表删除总数
      for (var i in res) {
        this.barseriesData.push(res[i]);
        this.barxAxisData.push(MachineStatus(i));
      }
      this.barMax = calMax(this.barseriesData) > 0 ? calMax(this.barseriesData) : 1; //Y轴最大值
      this.barchart.setOption(this.barOChartOPtion);
    },
    async totalProfitFun() {
      //总收益
      let res = await totalProfitFun();
      this.allMoney = res.allMoney; //总收益
      this.monthMoney = res.monthMoney; //当月收益
      this.todayMoney = res.todayMoney; //今日收益
    },
    async ProfitDate(parentTypeId = '', type = 0) {
      //收益数据
      let res = await timeProfitFun({ parentTypeId: parentTypeId, type: type });
      this.lineseriesData = [];
      this.linexAxisData = [];
      res.forEach(item => {
        this.lineseriesData.push(item.sum);
        if (String(item.time).length <= 2) {
          this.linexAxisData.push(`${item.time}:00`);
        } else {
          this.linexAxisData.push(item.time);
        }
      });
      this.lineMax = calMax(this.lineseriesData) > 0 ? calMax(this.lineseriesData) : 1; //Y轴最大值
      this.lineMin = calMin(this.lineseriesData);
      // 把配置和数据放这里
      this.linechart.setOption(this.lineChartOption);
    },
    async typeProfitData(parentTypeId = this.washingMachineId, type = 0) {
      //收益分布
      let res = await typeProfitFun({ parentTypeId: parentTypeId, type: type });
      let communicateTypeData = res ? res.communicateType : [];
      if (communicateTypeData.length > 0) {
        communicateTypeData.forEach(item => {
          this.pietypeData.push({
            value: item.sum,
            name: communicateType(Number(item.type))
          });
        });
      } else {
        this.pietypeData.push(
          {
            value: 0,
            name: '脉冲'
          },
          {
            value: 0,
            name: '串口'
          }
        );
      }
      let machineTypeData = res ? res.machineType : [];
      if (machineTypeData.length > 0) {
        machineTypeData = machineTypeData.sort(this.ortId).slice(0, 3); //类型标题只显示最大的三个类型
        this.piefunDatatitle = [];
        machineTypeData.forEach(item => {
          this.piefunDatatitle.push({
            name: item.type,
            icon: 'circle',
            textStyle: { fontWeight: 'normal', color: '#999', fontSize: 12, padding: 0 }
          });
        });

        let fristFour = res.machineType.sort(this.ortId).slice(0, 5); //饼图取出最大五个类型，多余的合并成其他类型
        let other = res.machineType.sort(this.ortId).slice(5);
        let otherNum = null;
        other.forEach(item => {
          otherNum += item.sum;
        });
        other = [
          {
            sum: otherNum,
            type: '其他'
          }
        ];
        this.piefunData = [];
        let machineType = [...fristFour, ...other];
        machineType.forEach(item => {
          item.sum = item.sum < 0 ? 0 : item.sum; //如果收益是负数等于0;
          this.piefunData.push({
            value: item.sum,
            name: item.type
          });
        });
      } else {
        this.piefunDatatitle.push({
          name: '功能模式占比',
          icon: 'circle',
          textStyle: { fontWeight: 'normal', color: '#999', fontSize: 12, padding: 0 }
        });
        this.piefunData.push({
          value: 0,
          name: '功能模式占比'
        });
      }
      // 把配置和数据放这里
      this.pietypechart.setOption(this.pietypeChartOPtion);
      this.piefunchart.setOption(this.piefunChartOption);
    },
    ortId(k, h) {
      //最大值排序
      return h.sum - k.sum;
    },
    initChart() {
      this.linechart = echarts.init(document.getElementById('line'));
      this.barchart = echarts.init(document.getElementById('bar'));
      this.pietypechart = echarts.init(document.getElementById('pietype'));
      this.piefunchart = echarts.init(document.getElementById('piefun'));
    },
    machineselectpicker(data) {
      //收益收据选择设备类型搜索
      this.machinecurrentTags = data;
      this.linexAxisData = [];
      this.lineseriesData = [];
      let type = this.lineSearchTime[this.lineSearchIndex].value;
      let parentTypeId = this.machinecurrentTags ? this.machinecurrentTags.id : null;
      this.ProfitDate(parentTypeId, type);
    },
    machineselectpickertatus(data) {
      this.machineVisible = data;
    },
    lineTimeSearch: function(index) {
      //收益收据选择时间搜索
      this.linexAxisData = [];
      this.lineseriesData = [];
      this.lineSearchIndex = index;
      let type = this.lineSearchTime[index].value;
      let parentTypeId = this.machinecurrentTags ? this.machinecurrentTags.id : null;
      this.ProfitDate(parentTypeId, type);
    },
    distributionselectpicker(data) {
      //收益分布选择设备类型搜索
      this.distributioncurrentTags = data;
      this.pietypeData = [];
      this.piefunData = [];
      let type = this.lineSearchTime[this.pieSearchIndex].value;
      this.typeProfitData(this.distributioncurrentTags.id, type);
    },
    distributionselectpickertatus(data) {
      this.distributionVisible = data;
    },
    pieTimeSearch: function(index) {
      //收益分布选择时间搜索
      this.pietypeData = [];
      this.piefunData = [];
      this.pieSearchIndex = index;
      let type = this.lineSearchTime[index].value;
      let parentTypeId = this.distributioncurrentTags ? this.distributioncurrentTags.id : this.washingMachineId;
      this.typeProfitData(parentTypeId, type);
    },
    equipmentselectpicker(data) {
      //切换设备监控图表
      this.equipmentcurrentTags = data;
      this.barxAxisData = [];
      this.barseriesData = [];
      this.countMachine(this.equipmentcurrentTags.id);
    },
    equipmentselectpickertatus(data) {
      this.equipmentVisible = data;
    }
  },
  computed: {
    lineChartOption() {
      let opt = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: function(data) {
            let reg = /^(\d{1,2})(:)?(\d{1,2})$/;
            if (reg.test(data[0].name)) {
              let time = data[0].name.replace(':00', ':59');
              data[0].name = `${data[0].name}-${time}`;
            }
            return `${data[0].name}<br/>${data[0].marker}${data[0].seriesName}：${data[0].value.toFixed(2)}元`;
          }
        },
        grid: {
          y: 10,
          x: 10,
          x2: 20,
          y2: 10,
          containLabel: true
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            offset: 8,
            data: this.linexAxisData,
            axisLabel: {
              textStyle: { color: '#999' }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#e6e6e6',
                type: 'solid'
              }
            },
            axisTick: { length: 5 }
          }
        ],
        yAxis: [
          {
            type: 'value',
            offset: 10,
            min: this.lineMin,
            max: this.lineMax,
            splitNumber: 4,
            interval: (this.lineMax - this.lineMin) / 4,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#e6e6e6'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: { color: '#999' },
              formatter: function(value) {
                return value.toFixed(2);
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#e6e6e6',
                type: 'soild'
              }
            }
          }
        ],
        series: [
          {
            symbol: 'circle',
            data: this.lineseriesData,
            name: '收益',
            type: 'line',
            itemStyle: {
              normal: {
                color: '#1890ff',
                lineStyle: {
                  color: '#1890ff'
                }
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#1890ff' }, { offset: 1, color: '#fff' }])
              }
            }
          }
        ]
      };
      return opt;
    },
    barOChartOPtion() {
      let opt = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              // 阴影指示器样式设置
              width: '10px', // 阴影大小
              color: 'rgba(150,150,150,0.3)' // 阴影颜色
            }
          },
          formatter: function(data) {
            return `${data[0].marker}${data[0].name}：${data[0].value}`;
          }
        },
        grid: {
          y: 5,
          x: 0,
          x2: 20,
          y2: 5,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.barxAxisData,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              textStyle: { color: '#999' },
              interval: 0
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#e6e6e6',
                type: 'solid'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#e6e6e6',
                type: 'soild'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#e6e6e6'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: { color: '#999' }
            },
            min: 0,
            max: this.barMax,
            splitNumber: 5,
            interval: this.barMax / 4
          }
        ],
        series: [
          {
            name: '设备监控',
            type: 'bar',
            barWidth: 24,
            data: this.barseriesData
          }
        ]
      };
      return opt;
    },
    pietypeChartOPtion() {
      let opt = {
        tooltip: {
          trigger: 'item',
          formatter: function(data) {
            return `${data.marker}${data.name}：${data.percent}%`;
          },
          position: function(p) {
            //其中p为当前鼠标的位置
            return [p[0] + 10, p[1] - 10];
          }
        },
        legend: {
          orient: 'horizontal',
          y: 'bottom',
          x: 'center',
          bottom: '40%',
          itemWidth: 6,
          itemHeight: 6,
          data: [
            {
              name: '脉冲',
              icon: 'circle',
              textStyle: { fontWeight: 'normal', color: '#999', fontSize: 12 }
            },
            {
              name: '串口',
              icon: 'circle',
              textStyle: { fontWeight: 'normal', color: '#999', fontSize: 12 }
            }
          ]
        },
        series: [
          {
            name: '通信类型',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'outside',
                formatter: function(data) {
                  // let num = Math.round(data.percent);
                  // return num>0 ?`${num}%`:'';
                  return '';
                },
                color: '#333'
              }
            },
            labelLine: {
              normal: {
                show: false,
                length: 10,
                length2: 0
              }
            },
            data: this.pietypeData,
            itemStyle: {
              normal: {
                color: function(data) {
                  if (data.name === '脉冲') {
                    if (data.value > 0) {
                      return '#3BA1FF';
                    } else {
                      return '#ccc';
                    }
                  } else if (data.name === '串口') {
                    if (data.value > 0) {
                      return '#F3647C';
                    } else {
                      return '#ccc';
                    }
                  }
                }
              }
            }
          }
        ]
      };
      return opt;
    },
    piefunChartOption() {
      let opt = {
        tooltip: {
          trigger: 'item',
          // formatter: "{a} <br/>{b}: {c} ({d}%)"//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
          formatter: function(data) {
            return `${data.marker}${data.name}：${data.percent}%`;
          }
        },
        grid: {
          top: '60%' //距离下边距
        },
        legend: {
          orient: 'horizontal',
          y: 'bottom',
          x: 'center',
          bottom: '10%',
          padding: 0,
          itemGap: 2,
          itemWidth: 6, //图表大小
          itemHeight: 6,
          data: this.piefunDatatitle,
          textStyle: { fontSize: 12 }
        },
        series: [
          {
            name: '功能类型',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                position: 'outside',
                formatter: function(data) {
                  return '';
                },
                color: '#333'
              }
            },
            labelLine: {
              normal: {
                show: false,
                length: 10,
                length2: 0
              }
            },
            data: this.piefunData,
            itemStyle: {
              normal: {
                color: function(data) {
                  if (data.value > 0) {
                    if (data.name === '其他') {
                      return '#A878EA';
                    } else {
                      let color = ['#1890FF', '#F04864', '#FACC14', '#2FC25B', '#13C2C2'];
                      return color[data.dataIndex];
                    }
                  } else {
                    return '#ccc';
                  }
                }
              }
            }
          }
        ]
      };
      return opt;
    }
  },
  watch: {
    machineVisible: function() {
      if (this.machineVisible) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    },
    distributionVisible: function() {
      if (this.distributionVisible) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    },
    equipmentVisible: function() {
      if (this.equipmentVisible) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    },
    noticeShow: function() {
      if (this.noticeShow) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    }
  },
  components: {
    selectpickr
  }
};
</script>
<style type="text/css" lang="scss" scoped>
@import '../../assets/scss/index/index';
.notice-head {
  height: 1.33rem;
  a,
  img {
    display: block;
    width: 100%;
  }
}

.activity-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 19999999;
  padding-top: 1.33rem;
  .activity {
    width: 8.67rem;
    margin: 0 auto;
  }
  .apply {
    background: #fff;
    position: relative;
    border-bottom-left-radius: 0.27rem;
    border-bottom-right-radius: 0.27rem;
    padding: 1.18rem 0.84rem;
  }
  .pic {
    width: 100%;
    img {
      display: block;
      width: 100%;
    }
  }
  .apply-title {
    font-size: 16px;
    padding-bottom: 0.3rem;
  }
  .apply-con {
    font-size: 14px;
    line-height: 0.64rem;
    text-indent: 2em;
    span {
      color: #2088ff;
    }
  }
  .icon-wrapper {
    width: 0.8533rem;
    height: 0.8533rem;
    margin: 0.4133rem auto 0;
    text-align: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .godowload {
    text-align: center;
    a {
      margin: 0.2667rem auto;
      display: flex;
      width: 4.96rem;
      height: 1.1733rem;
      line-height: 1.1733rem;
      background: rgba(32, 136, 255, 1);
      border-radius: 0.5867rem;
      border: none;
      color: #fff;
      font-size: 16px;
      text-align: center;
    }
    .dowload_phone {
      width: 0.3467rem;
      height: 0.5467rem;
      margin: 0.31rem 0.24rem 0 1.3333rem;
    }
  }
}
</style>
