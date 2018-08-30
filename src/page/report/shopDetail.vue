<template>
<div class="shop-report-detail" v-title="title">
    <div class="shop-title">{{date}}</div>
    <div class="tabledata">
        <div class="listcon">
          <span class="detail-name title-name">店铺名称</span>
          <span class="detail-type">订单数量</span>
          <span class="detail-order no-mright">{{tableTitleType}}金额</span>
        </div>
        <div class="tableearn">
          <div class="nodata" v-if="noList">暂无数据</div>
          <div class="listcon tableearn-list" v-for="(item,index) in list" :key="index" @click="goDetail(item.shopId)">
            <span class="detail-name">{{item.shopName}}</span>
            <span class="detail-type">{{item.count}}</span>
            <span class="detail-order no-mright">{{item.money | tofixd}}</span>
          </div>
        </div>
    </div>
  </div>
</div>
</template> 
<script>
import { shopReportFun } from '@/service/report';
import qs from 'qs';
export default {
  data() {
    return {
       title:'',
       tableTitleType:'',
       list:[],
       noList:false,
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
    this.getDetail(query.date,query.type,query.dateLevel);
  },
  methods: {
    async getDetail(date,type,dateLevel){
      let payload = Object.assign({},{date:date,type:type,dateLevel:dateLevel});
      let res = await shopReportFun(qs.stringify(payload));
      this.list = res.list;
      this.date = res.date;
      this.list.length <= 0 ? this.noList = true:this.noList = false;
      
    },
    goDetail(shopId){
      let query = this.$route.query;
      this.$router.push({name:'reportdetail', query:{date:query.date,type:query.type,shopId:shopId,dateLevel:query.dateLevel}});
    }
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
