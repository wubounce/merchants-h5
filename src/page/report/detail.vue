<template>
<div class="report-detail" v-title="title">
    <div class="shop-title">{{shopName}}<span>{{date}}</span></div>
    <div class="tabledata">
        <div class="listcon">
          <span class="report-table-name">设备名称</span>
          <span class="report-table-type">设备类型</span>
          <span class="report-table-order">订单数量</span>
          <span class="report-table-order no-mright">{{tableTitleType}}金额</span>
        </div>
        <div class="tableearn">
          <div class="nodata" v-if="noList">暂无数据</div>
          <div class="listcon tableearn-list" v-for="(item,index) in list" :key="index">
            <span class="report-table-name" @click="showTooltip(item.machineName,$event)" >{{item.machineName}}</span>
            <span class="report-table-type">{{item.machineTypeName}}</span>
            <span class="report-table-order">{{item.count}}</span>
            <span class="report-table-order no-mright">{{item.money | tofixd}}</span>
          </div>
        </div>
    </div>
    <div class="tooltip" v-show="tooltip" :style="{top:positiontop+'px'}"> 
      <div class="ivu-tooltip-inner">{{tooltip}}</div>
    </div>
  </div>
</div>
</template>
<script>
import { machineReportFun } from '@/service/report';
import qs from 'qs';
export default {
  data() {
    return {
       title:'收益',
       tableTitleType:'',
       list:[],
       noList:false,
       tooltip:'',
       positiontop:null,
       shopName:null,
       date:null
    };
  },
  created(){
    let query = this.$route.query;
    if (Number(query.type) === 1) {
      this.title = '收益';
      this.tableTitleType = '订单';
    } else{
      this.title = '退款';
      this.tableTitleType = '退款';
    }
    this.getDetail(query.date,query.type,query.shopId,query.dateLevel);
  },
  methods: {
    async getDetail(date,type,shopId,dateLevel){
      let payload = Object.assign({},{date:date,type:type,shopId:shopId,dateLevel:dateLevel});
      let res = await machineReportFun(qs.stringify(payload));
      this.list = res.list;
      this.shopName = res.shopName;
      this.date = res.date;
      this.list.length <= 0 ? this.noList = true:this.noList = false;
      
    },
    showTooltip(name,event){
        this.positiontop = event.clientY;
        this.tooltip = name;
        setTimeout(()=>{
          this.tooltip = '';
        },3000);
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'report') {
      to.meta.keepAlive = true;
    } 
    next();
  },
  filters: {
    tofixd(value){
     return Number(value).toFixed(2);
    }
  },
  components:{
  }
};
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/report/detail";
</style>
