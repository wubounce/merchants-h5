<template>
  <section class="personal">
    <q-header :title="title"></q-header>
    <p class="shop-item title"><span>累计收益</span><span>{{orderPrice}}</span></p>
    <p class="shop-item second-p"><span>店铺名称</span><span>{{shopName}}</span></p>
    <p class="shop-item"><span>店铺类型</span><span>{{shopType}}</span></p>
    <p class="shop-address"><span>店铺地址</span><br><span>{{address}}</span></p>
    <p class="shop-item"><span>设备数量</span><span>{{machineCount}}</span></p>
  </section>
</template>
<script>
import QHeader from '@/components/header';
export default {
  data() {
    return {
      title: '店铺详情',
      orderPrice: '1000元',
      shopName: '企鹅科技1号店',
      shopType: '学校',
      address:'浙江省 杭州市 西湖区 紫荆花路2号联合大厦A幢3单元1005',
      machineCount: '100台'

    };
  },
  methods:{
   
  },
  components:{
    QHeader
  }
};
</script>
<style lang="scss" scoped>
.personal {
   title {
      border-top: 1px solid #F8F8F8;
   }
   .second-p {
     margin-top: 0.3rem;
   }
   .shop-address {
     font-size: 0.35rem;
     padding: 0.3rem;
     background-color: #fff; 
     span {
        &:first-child {
          color:rgba(153,153,153,1);
        }
        &:last-child {
          color:rgba(51,51,51,1);
          margin-top: 0.1rem;
          display: inline-block;
        }
      }
   }
   .shop-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.35rem;
      padding: 0.3rem;
      border-bottom: 1px solid #F8F8F8;
      background-color: #fff; 
      span {
        &:first-child {
          color:rgba(153,153,153,1);
        }
        &:last-child {
          color:rgba(51,51,51,1);
        }
    }
  }
}
</style>
<style>
.mint-switch-input:checked + .mint-switch-core {
  border-color: #4DD865;
  background-color: #4DD865;
}
</style>
