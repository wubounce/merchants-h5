<template>
	<section>
	  <q-header :title="title"></q-header>
    <ul>
      <li v-for="(item,index) in list" :key="index" @click="toShopDetail">
        <p class="top"><span class="iconMark discount">惠</span><span class="iconMark reserve">预</span><span class="shopName">{{item.shopName}}</span></p>
        <div class="bottom">
          <p>
            <span class="kindof">分类</span><span class="size">{{item.shopTypeName}}</span>
            <span class="kindof">设备</span><span class="size">{{item.machineCount}}台</span>
            <br>
            <span class="kindof">收益</span><span class="size">{{item.orderPrice}}元</span>
          </p>
        </div>
      </li>
    </ul>
    <div class="circle" @click="toAddShop"><div>+</div><div class="iconShop">店铺</div></div>
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
        },
        {
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
  methods: {
    toShopDetail() {
      this.$router.push({
        name:'shopDetail'
      });
    },
    toAddShop() {
      this.$router.push({
        name:'addShop'
      });
    }
  },
  components: {
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
        .iconMark {
          font-size: 0.3rem;
          color: #fff;
          padding: 0.1rem;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          border-bottom-left-radius: 3px;
          border-bottom-right-radius: 7px;
        }
        .discount {
          background-color: #FFAC22;
          margin-left: 0.4rem;
        }
        .reserve {
          background-color: #42A4FF;
          margin-left: 0.2rem;
          margin-right: 0.2rem;
        }
        .shopName {
          height:0.45rem;
          font-size:0.45rem;
          font-family:PingFangSC-Medium;
          color:rgba(51,51,51,1);
          line-height:0.45rem;
          font-weight: bold;
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
        .size {
          font-size: 0.35rem;
          margin-left: 0.2rem;
        }
      }
    }
  }
  .circle {
    border-radius: 50%;
    background-color: #1890FF;
    width: 1.5rem;
    height: 1.5rem;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    text-align: center;
    div {
      color:#fff;
    }
    .iconShop {
      font-size: 0.35rem;
      margin-top: -0.05rem;
    }
  }
}
</style>
