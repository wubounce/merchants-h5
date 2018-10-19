<template>
<div class="addmarket">
  <div class="addvip-header">
    <p>发放用户<span class="order-action add-shop-overflow-icon"></span><span class="addvip-con add-shop-overflow">18768765367</span></p>
    <p>适用店铺<span class="order-action add-shop-overflow-icon iconfont icon-nextx"></span><span class="addvip-con add-shop-overflow">联合大厦店</span></p>
    <p>适用类型<span class="order-action add-shop-overflow-icon iconfont icon-nextx"></span><span class="addvip-con add-shop-overflow">18768765367</span></p>
    <p>补偿面额（元）<span class="addvip-con"><input type="number" pattern="\d*" placeholder="补偿面额（元）" class="discount-input"></span></p>
    <p class="nomore-boder">满减金额（元）<span class="addvip-con"><input type="number" pattern="\d*" placeholder="满减金额（元）" class="discount-input"></span></p>
    <div class="full-discount">满减 6 元可用</div>
    <p class="nomore-boder">有效期（天）<span class="addvip-con"><span class="add iconfont icon-tianjia"></span><span class="conpenates">898</span><span class="suctract iconfont icon-tianjia"></span></span></p>
    <div class="full-discount">发放日起</div>
    <p>发放数量（张）<span class="addvip-con"><span class="add iconfont icon-tianjia"></span><span class="conpenates">898</span><span class="suctract iconfont icon-tianjia"></span></span></p>
  </div>
   <div class="confirm" @click="toaddMaket">发放</div>
  <!-- 选择店铺 -->
  <mt-popup v-model="shopVisible" position="bottom" :closeOnClickModal="false">
    <div class="resp-shop">
      <span class="quxi" @click="cancelCheckshop">取消</span>
      <span class="shop">店铺</span>
      <span class="qued" @click="getcheckshop">确定</span>
    </div>
    <section class="resp-shop-wrap">
      <div class="all-list">
        <label class="mint-checklist-label" v-for="(item,index) in shoplist" :key="index">
          <span class="mint-checkbox is-right">
            <input type="checkbox" class="mint-checkbox-input" v-model="shopIds" :value="item.shopId"> 
            <span class="mint-checkbox-core"></span>
          </span> 
          <p class="mint-checkbox-label shopname">{{item.shopName}}</p>
        </label>
      </div>
    </section>
  </mt-popup>
   <!-- 设备类型 -->
  <selectpickr :visible="machineVisible" :slots="machineSlots" :valueKey="machineLable" :title="'设备类型'"  @selectpicker="machineselectpicker" @onpickstatus="machineselectpickertatus"></selectpickr>
  <!-- 暂无设备类型 -->
  <div class="noMachine-wrap">
      <mt-popup v-model="noMachineVisible" position="bottom" >
        <section class="shoppicker">
          <div class="picker-toolbar">
              <span class="quxi"  @click="noMachineVisible=false">取消</span> 
              <span class="shop">设备类型</span> 
              <span class="qued" @click="noMachineVisible=false">确定</span>
          </div>
          <div class="noMachine-tip">{{noMachineTip}}</div>
        </section>
      </mt-popup>
  </div>
</div>
</template>
<script>
import selectpickr from '@/components/selectPicker';
export default {
  data() {
    return {
    };
  },
  mounted () {
  },
  created(){
  },
  methods: {
    
  },
  components:{
    selectpickr
  }
};
</script>
<style type="text/css" lang="scss" scoped>
    @import '../../assets/scss/marketing/addmaket';
   .full-discount {
        height: 0.8rem;
        line-height: 0.8rem;
        color: #999;
        text-align: right;
        font-size: 12px;
        display: inline-block;
        width: 100%;
        border-bottom: 1px solid #f9f8ff;
   }
   .conpenates {
       padding: 0.41rem;
   }
   .add, 
   .suctract {
       color: #D6D6D6;
   }
   .nomore-boder {
       border: none !important;
   }
</style>
