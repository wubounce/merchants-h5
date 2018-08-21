<template>
<div class="shop-report-detail" v-title="title">
    <div class="tabledata">
        <div class="listcon">
          <span class="report-table-name title-name">店铺名称</span>
          <span class="report-table-type">订单数量</span>
          <span class="report-table-order">订单金额</span>
        </div>
        <div class="tableearn">
          <div class="nodata" v-if="noList">暂无数据</div>
          <div class="listcon tableearn-list" v-for="(item,index) in list" :key="index" @clicl="goDetail(item.shopId)">
            <span class="report-table-name">{{item.machineName}}</span>
            <span class="report-table-type">{{item.count}}</span>
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
       tableTitleType:'',
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
    this.getDetail(query.date,query.type,query.shopId,query.dateLevel);
  },
  methods: {
    async getDetail(date,type,shopId,dateLevel){
      let payload = null;
      if (shopId) {
        payload = Object.assign({},{date:date,type:type,shopId:shopId,dateLevel:dateLevel});
      } else {
        payload = Object.assign({},{date:date,type:type,dateLevel:dateLevel});
      }
      let res = await machineReportFun(qs.stringify(payload));
      if (res.code === 0) {
        this.list = res.data;
        this.list.length <= 0 ? this.noList = true:this.noList = false;
      }
      
    },
    goDetail(date){
      let query = this.$route.query;
      this.$router.push({name:'reportdetail', query:{date:date,type:1,shopId:shopId,dateLevel:this.dateLevel}});
    }
  },
  beforeRouteLeave(to, from, next) {
     // 设置下一个路由的 meta
    to.meta.keepAlive = true;
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
<style lang="scss">
.shop-report-detail {
  height: 100%;
  .mint-header {
      background: #F2F2F2 !important;
  }
  .listcon {
    background-color: #fff;
    color: #333333;
    font-size: 14px;
    height: 1.04rem;
    line-height: 1.04rem;
    padding: 0 0.4rem;
    display: flex;
    border-bottom:1px solid #f9f8ff;
    span {
      font-weight: 600;
    }
  }
  .report-table-name {
    display: inline-block;
    text-align: left;
    width: 3.87rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #1890FF;
  }
  .title-name {
    color: #333;
  }
  .report-table-type, .report-table-order {
    display: inline-block;
    text-align: right;
    width:2rem;
  }
  .report-table-type{
    margin-right: 2rem;
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
