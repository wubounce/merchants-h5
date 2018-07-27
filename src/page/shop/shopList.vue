<template>
	<section>
	  <q-header :title="title"></q-header>
    <ul>
      <li v-for="(item,index) in list" :key="index" @click="toShopDetail(item.shopId)">
        <p class="top">
          <!-- <span class="shopName">{{item.shopName}}</span>
          <span>
            <span class="iconMark discount">惠</span><span class="iconMark reserve">预</span>
          </span> -->
          <span>{{item.shopName}}</span>
          <span><span v-if="item.isDiscount" class="iconMark discount">惠</span><span v-if="!item.isReserve" class="iconMark reserve">预</span></span>
        </p>
        <div class="bottom">
          <div class="kindof">
            <div class="text">分类</div>
            <div class="text-value">{{item.shopType}}</div>
          </div>
          <div class="kindof">
            <div class="text">设备</div>
            <div class="text-value">{{item.machineCount}}<span class="little-font">台</span></div>
          </div>
          <div class="kindof">
            <div class="text">收益</div>
            <div class="text-value">{{item.profit}}<span class="little-font">元</span></div>
          </div>
        </div>
      </li>
    </ul>
    <div class="circle" @click="toAddShop"><div>+</div><div class="iconShop">店铺</div></div>
	</section>
</template>

<script>
import QHeader from '@/components/header';
import { MessageBox } from 'mint-ui';
import { manageListFun } from '@/service/shop';
export default {
  data() {
    return {
       title:'店铺管理',
       list:[]
    };
  },
  methods: {
    toShopDetail(i) {
      this.$router.push({
        name:'shopDetail',
        query:{
          shopId: i
        }
      });
    },
    toAddShop() {
      this.$router.push({
        name:'addShop'
      });
    },
    async getShopList() {
      let res = await manageListFun();
      if(res.code===0) {
        this.list = res.data;
      }
      else {
        MessageBox.alert(res.msg);
      }
    }
  },
  created() {
    this.getShopList();
  },
  watch: {
    $route(to,from) {
      if(from.name == 'shopDetail') {
        this.getShopList();
      }
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
        display:flex;
        justify-content: space-between;
        border-bottom: 1px solid #F8F8F8;
        background-color: #fff; 
        font-size: 16px;
        padding: 0.3rem; 
        .iconMark {
          font-size: 11px;
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
        }
      }
      .bottom {
        width: 92%;
        height:1.96rem;
        border-radius:0.1rem;
        margin: 0.2rem auto;
        display: flex;
        justify-content: center;
        .kindof {
          width: 35%;
          text-align: center;
          &:nth-child(2) {
            border-left: 1px solid #DFE6FF;
            border-right: 1px solid #DFE6FF;
          }
          .text {
            margin-top: 0.4rem;
            color: #999999;
            font-size: 14px;
          }
          .text-value {
            color:#1890FF;
            font-size: 16px;
            margin-top: 0.2rem;
            .little-font {
              font-size: 0.01rem;
            }
          }
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
      margin-top: -0.2rem;
    }
  }
}
</style>
