<template>
  <section>
    <div class="tableearn">
        <div class="top">
            <div class='earnings-title'>
              <div class="earning">
                <p class="month"><span>{{machineName}}</span></p> 
                <p><span>总收益：{{allMoney | tofixd}} 元</span></p>
              </div>
            </div>
            <p class="black"></p>
            <div class="table-header">
              <span class="report-table-date">月份</span>
              <span class="report-table-money">订单金额</span>
            </div>
        </div>
        <div class="bottom">
          <div class="listcon tableearn-list" v-for="(item,index) in  listdata" :key="index">
            <router-link :to="{ name: 'deviceDayFlow', query:{time:item.time, allMoney: item.money,machineId:machineId,machineName:machineName} }">
              <div class="detail">
                <span class="listtime report-table-date">{{item.time}}</span>
                <span  class="report-table-money">{{item.money | tofixd}}</span>
              </div>
            </router-link>
          </div>
          <div class="nodata" v-if="this.listdata.length == 0">暂无数据</div>
        </div>
      </div>
  </section>
</template>
<script>
import { monthFloweFun } from '@/service/shop';
export default {
  data() {
    return {
      allMoney: '',
      listdata:[],
      machineName:'',
      machinepId:'',
      query:{},
    };
  },
  methods: {
    async getTotalIncome() {
      let obj = { machineId: this.machineId };
      let res = await monthFloweFun(obj);
      this.listdata = res;
    },
  },
  created() {
    this.query = this.$route.query?this.$route.query:{};
    this.allMoney = this.query.allMoney;
    this.machineName =  this.query.machineName;
    this.machineId = this.query.machineId;
    this.getTotalIncome();
  },
   beforeRouteLeave (to, from, next) {
      if(to.name === 'deviceSearch'){
          next();
          this.$router.replace({name: 'deviceSearch',query:{keyword: this.query.keyword}});//返回键要返回的路由
      }else {
          next();
      }
  }
};
</script>
<style type="text/css" lang="scss" scoped>
 @import '../../../assets/scss/index/monthincome';
</style>