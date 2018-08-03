<template>
<div class="report" v-title="title">
  
    <mt-navbar class="tab" v-model="selected">
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
    <!-- <div style="width:100%;height:1.73rem;"></div>
      <div class="permissions" v-if="$store.getters.has('mer:report')">暂无相关页面权限</div>
    <div v-else>
 -->  </div>
</div>
</template>
<script>
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
    reporteaning,
    refund
  }
};
</script>
<style lang="scss" scoped>
  
</style>
<style lang="scss">
  .report .mint-header {
    background: #F2F2F2 !important;
    border-bottom:1px solid rgba(229,229,229,1);
  }
  .tab {
    border-bottom:1px solid rgba(229,229,229,1);
    .mint-tab-item-label {
      font-size: 16px;
      color: #666;
    }
  }
</style>
