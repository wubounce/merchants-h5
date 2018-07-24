<template>
<div class="addmarket">
  <q-header :title="title"></q-header>
  <div class="addvip-header">
    <p>所属店铺<span class="addvip-con">{{shopCurrentTags?shopCurrentTags.shopName:''}}<span class="order-action iconfont icon-nextx" @click="vipVisible=true"></span></span></p>
    <p>设备类型<span class="addvip-con">{{shopCurrentTags?shopCurrentTags.shopName:''}}<span class="order-action iconfont icon-nextx"></span></span></p>
    <p>优惠期<span class="addvip-con">{{shopCurrentTags?shopCurrentTags.shopName:''}}<span class="order-action iconfont icon-nextx"></span></span></p>
    <p>活动日<span class="addvip-con">werwerwer<span class="order-action iconfont icon-nextx" @click="weekVisible=true"></span></span></p>
    <p>每日活动时段<span class="addvip-con">wrwerwer<span class="order-action iconfont icon-nextx"></span></span></p>
    <p>折扣优惠<span class="addvip-con">wqrewerqwe<span class="order-action iconfont icon-nextx"></span></span></p>
  </div>

   <section class="promiss-footer">
    <span class="can">取消</span>
    <span class="cifrm">确定</span>
  </section> 
   <selectpickr :visible="vipVisible" :slots="shopSlots" :valueKey="shopName" @selectpicker="shopselectpicker" @onpickstatus="shopselectpickertatus"> </selectpickr>

    <!-- 选择活动日-->
  <mt-popup v-model="weekVisible" position="bottom">
    <div class="resp-shop">
      <span class="quxi">取消</span>
      <span class="shop">自定义</span>
      <span class="qued">确定</span>
    </div>
    <section class="resp-shop-wrap">
      <div class="all-list">
        <label class="mint-checklist-label">
          <span class="mint-checkbox is-right">
            <input type="checkbox" class="mint-checkbox-input" v-model="checkWeeklist" value="企鹅一号店-12"> 
            <span class="mint-checkbox-core"></span>
          </span> 
          <span class="mint-checkbox-label shopname">周一</span>
        </label>
        <label class="mint-checklist-label">
          <span class="mint-checkbox is-right">
            <input type="checkbox" class="mint-checkbox-input" v-model="checkWeeklist" value="企鹅二号店交罚款技术开发都是-13"> 
            <span class="mint-checkbox-core"></span>
          </span> 
           <span class="mint-checkbox-label shopname">周一</span>
        </label>
        <label class="mint-checklist-label">
          <span class="mint-checkbox is-right">
            <input type="checkbox" class="mint-checkbox-input" v-model="checkWeeklist" value="企鹅三号店-14"> 
            <span class="mint-checkbox-core"></span>
          </span> 
          <span class="mint-checkbox-label shopname">周一</span>
        </label>
      </div>
    </section>
  </mt-popup>
</div>
</template>
<script>
import QHeader from '@/components/header';
// import qs from 'qs';
import selectpickr from '@/components/selectPicker';
import { shopListFun } from '@/service/report';
export default {
  data() {
    return {
      title: '新增营销',
      vipVisible:false,
      shopCurrentTags:null,
      shopName:'shopName',
      shopSlots:[
        {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
      ],
      weekVisible:false,
      checkWeeklist:[]

    };
  },
  mounted() {
    
  },
  created(){
    this.shopListFun();

  },
  methods: {
    async shopListFun(){
      let res = await shopListFun();
      this.shopSlots[0].values = [...res.data];
    },
    shopselectpicker(data){
      this.shopCurrentTags = data;
    },
    shopselectpickertatus(data){
      this.vipVisible = data;
    },
  },
  components:{
    QHeader,
    selectpickr
  }
};
</script>
<style type="text/css" lang="scss" scoped>
  .addvip-header {
    padding: 0 0.4rem;
    background: #fff;
    p {
      height: 1.6rem;
      line-height: 1.6rem;
      font-size: 16px;
      color: #333;
      border-bottom:1px solid rgba(223,230,255,1);
    }
    p:last-child{
      border:none;
    }
    .addvip-con {
      float: right;
    }
  }
  .promiss-footer {
    width: 100%;
    display: flex;
    height: 1.33rem;
    line-height: 1.33rem;
    position: fixed;
    bottom: 0;
    >span {
      flex: 1;
      text-align: center;
    }
    .can {
      font-size:18px;
      color:#1890FF;
      background:rgba(246,248,255,1);
    }
    .cifrm {
      background: #1890FF;
      font-size:18px;
      color: #fff;
    }
  }

  .resp-shop {
    display: flex;
    height: 1.17rem;
    line-height: 1.17rem;
    background:rgba(251,251,252,1);
    padding: 0 0.4rem;
    >span {
      flex: 1;
      font-size: 15px;
    }
    .quxi {
      color: #999;
    }
    .shop {
      text-align: center;
      font-size: 16px;
    }
    .qued {
      text-align:right;
      color: #1890FF;
    }
  }
  .resp-shop-wrap {
    .shopname {
      font-size: 15px;
      color: #333;
    }
  }

</style>
<style>
  .addmarket .mint-checklist-label {
    padding:0 0.4rem;
    text-align: center;
}
</style>
