<template>
	<section v-title="title">
    <div class="permissions" v-if="$store.getters.has('mer:shop:list')">暂无相关页面权限</div>
    <div v-else>
      <ul v-if="hasNews">
        <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" >
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
              <li class="list" v-for="(item,index) in list" :key="index" @click="toShopDetail(item.shopId)">
                <p class="top">
                  <!-- <span class="shopName">{{item.shopName}}</span>
                  <span>
                    <span class="iconMark discount">惠</span><span class="iconMark reserve">预</span>
                  </span> -->
                  <span>{{item.shopName.length>15 ? item.shopName.slice(0,15) + '...' : item.shopName }}</span>
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
                    <div class="text-value">{{ item.profit == '0' ? item.profit + '.00' : item.profit }}<span class="little-font">元</span></div>
                  </div>
                </div>
              </li>
            <div v-if="allLoaded" class="nomore-data">没有更多了</div>
          </mt-loadmore>
        </div>
        
      </ul>
      <p v-else class="noShop">暂无店铺, 可点击右下角进行添加</p>
      <div class="circle" @click="toAddShop" v-has="'mer:shop:add'">
        <div>+</div>
        <div class="iconShop">店铺</div>
      </div>
    </div>
	</section>
</template>
<script>
import qs from "qs";
import { MessageBox } from 'mint-ui';
import { manageListFun } from '@/service/shop';
export default {
  data() {
    return {
       title:'店铺管理',
       list:[],
       hasNews: true,

       //分页
       wrapperHeight: 0,//容器高度
       page: 1,//页码
       pageSize:10,
       total:null,
       allLoaded: false//数据是否加载完毕
    };
  },
  methods: {
    // titleClick: function(index) {
    //   this.list = [];
    //   this.searchData = '';
    //   this.titleIndex = index;
    //   this.orderStatus = this.titleArr[this.titleIndex].value;
    //   this.page = 1; //从第一页起
    //   this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
    //   this.getShopList();
    // },
    loadBottom() {
      this.page += 1;
      let allpage = Math.ceil(this.total/this.pageSize);
      console.log(allpage);
      console.log(this.page);
      if(this.page <= allpage){
        this.getShopList();
      }else{
        this.allLoaded = true;//模拟数据加载完毕 禁用上拉加载
      }
      this.$refs.loadmore.onBottomLoaded();
    },
    loadTop() {
      this.page = 1;
      this.list = [];
      this.getShopList();
      this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
      this.$refs.loadmore.onTopLoaded();
    },
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
      let obj = {
        page: this.page,
        pageSize: this.pageSize
      };
      let res = await manageListFun(qs.stringify(obj));
      if(res.code===0) {
        //判断该账号是否存在店铺
        if(res.data == null || res.data == "") {
          this.hasNews = false;
        }
        else {
          this.list = res.data.items?[...this.list,...res.data.items]:[];  //分页添加
          this.total = res.data.total;
        }
      }
      else {
        MessageBox.alert(res.msg);
      }
    }
  },
  created() {
    this.getShopList();
  },
  mounted() {
    let windowWidth = document.documentElement.clientWidth;//获取屏幕高度
    this.wrapperHeight = document.documentElement.clientHeight;
  },
  watch: {
    $route(to,from) {
      if(to.name === 'shopList') {
        this.getShopList();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
section {
  ul {
    .page-loadmore-wrapper {
      overflow: scroll;
      .list {
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
                font-size: 8px;
              }
            }
          }
        }
      }
    }
  }
  .noShop {
    text-align: center;
    color: #999;
    font-size: 16px;
    padding-top: 4rem;
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
      &:first-child {
        font-size: 25px;
      }
    }
    .iconShop {
      font-size: 0.4rem;
    }
  }
}
</style>
