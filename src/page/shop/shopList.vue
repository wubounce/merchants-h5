<template>
	<section>
	  <q-header :title="title"></q-header>
    <ul>
      <li v-for="(item,index) in list" :key="index">
        <p class="top"><span></span><span></span><span class="shopName">{{item.shopName}}</span></p>
        <div class="bottom">
          <p><span class="kindof">分类</span></p>
        </div>
      </li>
    </ul>
	</section>
</template>

<script>
import QHeader from '@/components/header';
export default {
  data() {
    return {
       title:'店铺管理',
       list:[{
          shopId:'12345dsuisydwedbewi1823',
          machineCount:50,
          shopName:'常熟高新园中等专业学校',
          orderPrice:10000.00,
          shopTypeName:'流动人口社区',
          ifAddTime:'1',
          isReserve:'0'
        },
        {
          shopId:'12345dsuisydwedbewi1823',
          machineCount:50,
          shopName:'常熟高新园中等专业学校',
          orderPrice:10000.00,
          shopTypeName:'流动人口社区',
          ifAddTime:'1',
          isReserve:'0'
        }
      ]
    };
  },
  components:{
    QHeader
  }
};
</script>

<style lang="scss" scoped>
section {
  ul {
    li {
      width:100%;
      height:3.5rem;
      background:rgba(255,255,255,1);
      margin-bottom:0.23rem;
      .top {
        .shopName {
          height:0.45rem;
          font-size:0.32rem;
          font-family:PingFangSC-Medium;
          color:rgba(51,51,51,1);
          line-height:0.45rem;
        }
      }
      .bottom {
        width: 92%;
        height:1.96rem;
        background:rgba(248,252,255,1);
        border-radius:0.1rem;
        margin: 0.2rem auto;
        .kindof {
          background: #e0f2ff;
          border-radius: 0.09rem;
          font-size: 0.3rem;
          color: rgba(24,144,255,1);
          padding: 0.12rem 0.22rem;
          margin-left:0.4rem;
        }
      }
    }
  }
}
</style>
