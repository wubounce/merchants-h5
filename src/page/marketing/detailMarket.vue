<template>
<div class="addmarket" v-title="title">
  <div class="permissions" v-if="$store.getters.has('mer:marketing:info')">暂无相关页面权限</div>
  <div v-else>
    <div class="addvip-header">
      <p>所属店铺<span class="add-market-shop"><span v-for="(item,index) in detail.shop" :key="index">{{item.name}}</span></span></p>
      <p>优惠期<span class="addvip-con">{{detail.noDiscountStart}}<span v-if="detail.noDiscountStart&&detail.noDiscountEnd">-</span>{{detail.noDiscountEnd}}</span></p>
      <p>活动日<span class="addvip-con">{{detail.noWeek | week}}</span></p>
      <p>每日活动时段<span class="addvip-con">{{detail.noTime}}</span></p>
      <p>折扣优惠<span class="addvip-con">{{detail.discount}}%</span></p>
      <p>活动状态<span class="addvip-con">{{detail.status === 0 ? '开放':'暂停'}}</span></p>
    </div>
    <div class="create-wrap">
      <p>创建人：{{detail.createUserName}}</p>
      <p>创建时间： {{detail.createTime}}</p>
    </div>
    <div class="footer">
      <span class="edit" v-has="'mer:marketing:update'"><router-link :to="{name:'editMarket', query:{id:detail.id}}">编辑</router-link></span>
      <span class="del" @click="deldelMarket" v-has="'mer:marketing:delete'">删除</span>
    </div>
  </div>
</div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import qs from 'qs';
import moment from 'moment';
import { delMarketFun, detailMarketFun } from '@/service/market';

export default {
  data() {
    return {
      title: '限时优惠详情',
      detail:{}
    };
  },
  mounted() {
    
  },
  created(){
    this.getDetail();
  },
  methods: {
    async getDetail(){
      let query = this.$route.query;
      let payload = {timeId:query.id};
      let res = await detailMarketFun(qs.stringify(payload));
      this.detail = res.data;
      this.detail.noDiscountStart = this.detail.noDiscountStart ? moment(this.detail.noDiscountStart).format('YYYY年MM月DD日') : '';
      this.detail.noDiscountEnd = this.detail.noDiscountEnd ? moment(this.detail.noDiscountEnd).format('YYYY年MM月DD日'): '';
      this.detail.createTime = this.detail.createTime? moment(this.detail.createTime).format('YYYY-MM-DD HH:mm:ss'): '';
    },
    deldelMarket(id){
      MessageBox.confirm(`确认删除？`).then(async () => {
        let query = this.$route.query;
        let payload = {timeId:query.id};
        let res = await delMarketFun(qs.stringify(payload));
        if (res.code === 0) {
          this.$toast('删除成功');
          this.$router.push({name:'marketing'});
        } else {
          this.$toast({message: res.msg });
        }
      });
    }
  },
  filters: {
    week: function (value) {
      if (value === '1,2,3,4,5,6,7') {
        return '每天';
      } else if(value === '1,2,3,4,5'){
        return '周一至周五';
      }else {
        let arr = [];
        let weeklsit = [];
        arr = value? value.split(',') :[] ;
        arr.forEach(item=>{
          if (item == '1') {
            weeklsit.push('周一');
          } else if(item == '2') {
            weeklsit.push('周二');
          } else if(item == '3') {
            weeklsit.push('周三');
          } else if(item == '4') {
            weeklsit.push('周四');
          } else if(item == '5') {
            weeklsit.push('周五');
          } else if(item == '6') {
            weeklsit.push('周六');
          } else if(item == '7') {
            weeklsit.push('周日');
          }
        });
        return weeklsit.join(',');
      }
      
    },
  },
  components:{
  },
};
</script>
<style type="text/css" lang="scss" scoped>
  .addvip-header {
    padding: 0 0.4rem;
    background: #fff;
    p {
      overflow: hidden;
      padding: 0.51rem 0;
      font-size: 16px;
      color: #999;
      border-bottom:1px solid rgba(223,230,255,1);
    }
    p:last-child{
      border:none;
    }
    .addvip-con {
      float: right;
      color: #333;
    }
    .add-market-shop {
      color: #333;
      text-align: right;
      margin-left: 0.13rem;
      float: right;
    }
  }
 .create-wrap {
    margin-top: 0.27rem;
    padding: 0 0.4rem;
    background: #fff;
    font-size:12px;
    color:#999;
    p {
      line-height:0.77rem;
    }
  }
  .footer {
    width: 100%;
    background: #fff;
    position: fixed;
    bottom: 0;
    font-size: 14px;
    padding: 0.28rem 0;
    > span {
      float: right;
      width: 2.4rem;
      height: 0.8rem;
      line-height: 0.8rem;
      border-radius: 0.11rem;
      text-align: center;
      margin-right: 0.4rem;
    }
    .del {
      border: 1px solid rgba(216,216,216,1);
    }
    .edit {
      border: 1px solid  #1890FF;
      a {
        color: #1890FF;
      }
    }
  }
</style>

