<template>
<div class="report-detail" v-title="title">
    <div class="tabledata">
        <div class="listcon">
          <span class="report-table-name">设备名称</span>
          <span class="report-table-type">设备类型</span>
          <span class="report-table-order">订单数量</span>
          <span class="report-table-order">订单金额</span>
        </div>
        <div class="tableearn">
          <div class="nodata" v-if="noList">暂无数据</div>
          <div class="listcon tableearn-list" v-for="(item,index) in list" :key="index">
            <span class="report-table-name">{{item.machineName}}</span>
            <span class="report-table-type">{{item.machineTypeName}}</span>
            <span class="report-table-order">{{item.count}}</span>
            <span class="report-table-order">{{item.money | tofixd}}</span>
          </div>
        </div>
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
       list:[],
       noList:false,
    };
  },
  created(){
    let query = this.$route.query;
    if (query.type === 1) {
      this.title = '收益';
    } else {
      this.title = '退款';
    }
    this.getDetail(query.date,query.type);
  },
  methods: {
    async getDetail(date,type){
      let payload = Object.assign({},{date:date,type:type});
      let res = await machineReportFun(qs.stringify(payload));
      if (res.code === 0) {
        this.list = res.data;
        this.list.length <= 0 ? this.noList = true:this.noList = false;
      }
      
    }
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
<style lang="scss">
.report-detail {
  .mint-header {
      background: #F2F2F2 !important;
  }
  .listcon {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #333333;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 14px;
    height: 1.04rem;
    line-height: 1.04rem;
    padding: 0 0.4rem;
    position: relative;
    white-space: nowrap;
    border-bottom:1px solid rgba(229,229,229,1);
    span {
      font-weight: 600;
    }
  }
  .report-table-name {
    text-align: left;
    width: 4.08rem;
  }
  .report-table-type {
    text-align: left;
    width: 1.49rem;
  }
  .report-table-order {
    margin-left: 0.52rem;
    text-align: right;
    width: 1.49rem;
  }
  .nodata {
    font-size: 14px;
    color: #999;
    text-align: center;
    padding: 2rem 0;
    background: #efeff4;
  }
  .tableearn-list {
    span {
      font-weight: normal;
      color: #666666;
    }
  }
  .tableearn .tableearn-list:nth-child(2n) {
    background: #fff !important;
  }
  .tableearn .tableearn-list:nth-child(2n-1) {
    background: #FAFCFE !important;
  }
}
</style>
