<template>
  <section>
    <div class="tableearn">
      <div class="top">
        <div class='earnings-title'>
          <div class="earning">
            <p class="month"><span>{{machineName}}</span></p> 
            <p><span>{{date}}<span style="padding:0 0.11rem">/</span>收益：{{allMoney | tofixd}} 元</span></p>
          </div>
          <div class="export-wrap" @click="exportExls">
            <p><i :class="['iconfont icon-daochu', {'export-disable':listdata.length<=0}]"></i></p> 
            <p><span :class="['export', {'export-disable':listdata.length<=0}]">导出</span></p>
          </div>
        </div>
        <p class="black"></p>
        <div class="listcon table-header">
          <span class="report-table-date" >时间</span>
          <span class="report-table-count" >订单编号</span>
          <span class="report-table-money" >订单金额</span>
        </div>
      </div>
      <div class="bottom">
        <div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}" >
          <mt-loadmore  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" @translate-change="translateChange" :auto-fill="false" ref="loadmore">
            <div class="listcon tableearn-list" v-for="(item,index) in  listdata" :key="index">
              <div class="detail">
                <span class="report-table-date">{{item.time}}</span>
                <span class="report-table-count">{{item.orderNo}}</span>
                <span class="report-table-money">{{item.money | tofixd}}</span>
              </div>
            </div>
            <div v-if="allLoaded" class="nomore-data">没有更多了</div>
          </mt-loadmore>
          <div class="nodata" v-if="!this.total">暂无数据</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import moment from 'moment';
import { MessageBox } from 'mint-ui';
import { orderFlowFun, excelOrderFlowlFun } from '@/service/shop';
import { setEmail, getEmail } from '@/utils/tool';
import { validatEmail } from '@/utils/validate';
import PagerMixin from '@/mixins/pagerMixin';
export default {
  mixins: [PagerMixin],
  data() {
    return {
      allMoney: '',
      listdata:[],
      machineName:'',
      machineId:'',
      date:'',
      pageSize:50,
      total:''
    };
  },
  methods: {
    async _getList() {
      let obj = {
        time: this.$route.query.time,
        machineId: this.$route.query.machineId,
        page: this.page,
        pageSize: this.pageSize
      };
      let res = await orderFlowFun(obj);
      if(res.total != 0) {
        this.listdata = res.items?[...this.listdata,...res.items]:[];  //分页添加
        this.total = res.total;
      }
    },
    exportExls(){
      if(this.listdata.length<=0) return false;
      MessageBox.prompt(' ', `确定导出${this.date}流水明细？`, {
        inputPlaceholder:'请填写导出表格的邮箱地址',
        inputValue:getEmail()?getEmail():null,
        inputValidator: (val) => {
            if (val === null) {
                return false;//初始化的值为null，不做处理的话，刚打开MessageBox就会校验出错，影响用户体验
            }
            return validatEmail(val);
        }, 
        inputErrorMessage: '请输入正确的邮箱地址'
      }).then(async (val) => {
        setEmail(val.value);
        let payload = {machineId:this.machineId,time:this.date,email:val.value};
        await excelOrderFlowlFun(payload);
        this.$toast({message: '操作成功',iconClass: 'mint-toast-icon mintui mintui-success'});
      }, (error) => {
          // document.getElementsByClassName("mint-msgbox-errormsg")[0].style.visibility = 'hidden';
          // document.getElementsByClassName("invalid")[0].style.borderColor = '#dedede';             
      });
    }
  },
  filters: {
    momentTime: function (value) {
      return moment(value).format('HH:mm:ss');
    }
  },
  created() {
    this.allMoney = this.$route.query ? this.$route.query.allMoney : '';
    this.machineName =  this.$route.query ? this.$route.query.machineName : '';
    this.machineId = this.$route.query ? this.$route.query.machineId : '';
    this.date = this.$route.query ? this.$route.query.time:'';
  }
};
</script>
<style type="text/css" lang="scss" scoped>
 @import '../../../assets/scss/index/todayincome';
</style>

