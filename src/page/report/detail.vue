<template>
<div>
  <q-header :title="title"></q-header>
    <div class="tabledata">
        <div class="listcon">
          <span>设备名称</span>
          <span>设备类型</span>
          <span>订单数量</span>
          <span>订单金额</span>
        </div>
        <div class="tableearn">
          <div class="listcon tableearn-list" v-for="(item,index) in list" :key="index">
            <span>{{item.machineName}}</span>
            <span>{{item.machineTypeName}}</span>
            <span>{{item.count}}</span>
            <span>{{item.money}}</span>
          </div>
        </div>
    </div>
  </div>
</div>
</template>
<script>
import QHeader from '@/components/header';
import { machineReportFun } from '@/service/report';
import qs from 'qs';
export default {
  data() {
    return {
       title:'收益',
       list:[]
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
      this.list = res.data;
    }
  },
  components:{
    QHeader,
  }
};
</script>
<style lang="scss">
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
    height: 40px;
    line-height: 1;
    padding: 0 10px;
    position: relative;
    text-align: center;
    white-space: nowrap;
    border-bottom:1px solid rgba(229,229,229,1);
    span {
      flex:1;
      font-weight: 600;
    }
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
</style>
