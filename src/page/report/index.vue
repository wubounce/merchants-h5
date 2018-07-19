<template>
<div>
  <q-header :title="title"></q-header>
  <mt-navbar class="page-part" v-model="selected">
      <mt-tab-item id="1">收益</mt-tab-item>
      <mt-tab-item id="2">退款</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <reporteaning></reporteaning>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <refund></refund>
      </mt-tab-container-item>
    </mt-tab-container>
 
  <q-menu></q-menu>
</div>
</template>
<script>
import QMenu from '@/components/menu';
import QHeader from '@/components/header';
import reporteaning from './earnings';
import refund from './refund';
export default {
  data() {
    return {
       title:'报表',
       selected: '1'
    };
  },
  created(){
  },
  methods: {
  },
  components:{
    QMenu,
    QHeader,
    reporteaning,
    refund
  }
};
</script>
<style lang="scss">
  .echarts-warp {
    padding: 0.32rem;
  }
  .echart {
    border: 1px dashed #333;
  }
  .echart-title {
    font-size: 12px;
    color:rgba(153,153,153,1);
    text-align: center;
    margin-top: 0.4rem;
    span {
      width: 0.2rem;
      height: 0.2rem;
      display: inline-block;;
      background: #f60;
      border-radius: 50%;
      margin-right: 0.133333rem;
      margin-left: 0.133333rem;
    }
  }
  .mint-header {
    background: #F2F2F2 !important;
  }
  .tabletit {
    background: #fff !important;
  }
  .mint-navbar{
    height: 1.066667rem;
    border:1px solid rgba(229,229,229,1);
  }
  .mint-tab-item-label {
    font-size: 16px;
  }
</style>
