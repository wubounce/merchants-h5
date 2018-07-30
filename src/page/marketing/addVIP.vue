<template>
<div class="addvip" v-title="title">
  <div class="addvip-header">
    <p>所属店铺<span class="addvip-con">{{shopCurrentTags?shopCurrentTags.shopName:''}}<span class="order-action iconfont icon-nextx" @click="vipVisible = true;"></span></span></p>
    <p>VIP卡类型<span class="addvip-con">{{vipTypeCurrentTags}}<span class="order-action iconfont icon-nextx" @click="vipTypeVisible = true;"></span></span></p>
  </div>
  <div class="card-wrap">
    <div class="add-card-header"></div>
    <div class="add-card">
      <p>卡售价<span>元</span><input type="text"></p>
      <p>VIP折扣<span>%</span><input type="text"></p>
      <p>每日限用次数<span>次</span><input type="text" class="num"></p>
    </div>
    <div class="tips">
      <p>提示：</p>
      <p>1.建议VIP折扣价不超过特惠活动价。</p>
      <p>2.每日限用次数不填写或填写0，则不限制次数。</p>
    </div>
  </div>
   <div class="confirm">提交</div>
   <selectpickr :visible="vipVisible" :slots="shopSlots" :valueKey="shopName" @selectpicker="shopselectpicker" @onpickstatus="shopselectpickertatus"> </selectpickr>


   <selectpickr :visible="vipTypeVisible" :slots="vipTypeSlots"  @selectpicker="vipselectpicker" @onpickstatus="vipselectpickertatus"> </selectpickr>
</div>
</template>
<script>
// import qs from 'qs';
import selectpickr from '@/components/selectPicker';
import { shopListFun } from '@/service/report';
export default {
  data() {
    return {
      title: '新增VIP',
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
      vipTypeVisible:false,
      vipTypeCurrentTags:null,
      vipTypeSlots:[
        {
            flex: 1,
            values: ['VIP半年卡','VIP年卡','VIP卡季卡'],
            className: 'slot1',
            textAlign: 'center'
          }
      ],

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
    vipselectpicker(data){
      this.vipTypeCurrentTags = data;
    },
    vipselectpickertatus(data){
      this.vipTypeVisible = data;
    },
  },
  components:{
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
  .card-wrap {
    padding:0.4rem;
    .add-card-header {
      height:0.13rem;
      background:linear-gradient(-90deg,rgba(53,195,255,1),rgba(24,144,255,1));
      border-radius:0.13rem 0.13rem 0px 0px;
    }
    .add-card{
      background: #fff;
      font-size: 16px;
      color: #333;
      padding: 0 0.37rem;
      p {
        height: 1.47rem;
        line-height: 1.47rem;
        border-bottom:1px solid rgba(223,230,255,1);
      }
      input {
        display: inline-block;
        width: 5.07rem;
        height: 1.47rem;
        line-height: 1.47rem;
        text-align: right;
        float: right;
        margin-right: 0.16rem;
      }
      span {
        float: right;
      }
      .num {
        color: #1890FF;
      }
    }
    .tips {
      background: #fff;
      padding: 0.49rem 0.37rem 0.35rem 0.37rem;
      border-radius:0 0 0.13rem 0.13rem;
      p {
        font-size: 12px;
        color: #999;
        line-height: 0.53rem;
      }
    }
  }
  .confirm {
    width:100%;
    height:1.33rem;
    line-height: 1.33rem;
    background:rgba(24,144,255,1);
    text-align: center;
    font-size: 18px;
    color: #fff;
    position: fixed;
    bottom: 0;
  }
</style>
