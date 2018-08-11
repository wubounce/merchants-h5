<template>
  <section class="ss-wrappper" v-title="title">
    <div class="fixedPosition">
      <div class="bat-step">
        <div class="line-bg">
          <p v-for="(item,index) in stepArr " :key="index" :class="{active:currIndex==index}">{{item.text}}</p>
        </div>
      </div>
      <ul>
        <li class="bat-hd">
          <span>{{hdTitleArr[currIndex]}}</span>
          <div>{{selectedShop}}</div>
        </li>
      </ul>
      <div class="ss-hd">
        <div class="search-input">
          <p class="left" :class="{ 'result-left': isResult }">
            <input type="text" v-model.trim="keyword" placeholder="请输入相关店铺名称">
          </p>
        </div>
      </div>
    </div>
    <div class="ss-bd">
      <div class="search-res">
        <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
          <li v-for="(item,index) in shopList"  class="search-res-item" :class="{'selected':index==selectIndex}" @click="selectClick(index,item.shopName)"
            :key="index">
            <div>
              <p>{{item.shopName}}</p>
              <p>{{item.address}}</p>
            </div>
            <div><span class="iconfont" :class="{'icon-xuanze':index==selectIndex}"></span></div>
          </li>
          <li class="searchNoItem" v-show="hasNoData">没有找到匹配数据</li>
        </ul>
      </div>
    </div>
    <div style="width:100%;height:1.73rem;"></div>
    <button class="submitBtn" @click="goNext" >下一步</button>
  </section>
</template>

<script>
  /* eslint-disable */
  import qs from "qs";
  import { MessageBox } from 'mint-ui';
  import {delay} from "@/utils/tool";
  import { getShopFun,shopSearchFun } from '@/service/device';
  export default {
    data() {
      return {
        resData: [{
          shopName: '企鹅一号店',
          adress: '紫金花路2号联合大厦1幢1层10号1层联合大厦1幢1层10…',
        }],
        shopList: [],
        isResult: false,
        selectIndex: -1,
        selectedShop: '',
        keyword: '',
        shopId:'',
        title: "批量编辑",
        stepArr: [
          {
            text: "店铺",
            name: "selectShop"
          },
          {
            text: "类型",
            name: "selectFirstype"
          },
          {
            text: "功能",
            name: "selectFunction"
          },
          {
            text: "时间",
            name: "selectStartTime"
          }
        ],
        currIndex: 0,
        hdTitleArr: [
          "1.请选择相应店铺",
          "2.请选择设备类型",
          "3.请选择设备型号",
          "4.请选择设备相应功能"
        ],
      }
    },
    methods: {
      async fetchData(e) {
        let keywords = this.keyword;
        let payload = {shopName: keywords};
        let res = await shopSearchFun(qs.stringify(payload));
          if(res.code === 0) {
            this.shopList = res.data;  
          }
      },
      selectClick: function (index,name) {
        this.selectIndex = index
        this.shopId = this.shopList[index].shopId;
        this.selectedShop = name;

        // this.keyword = this.resData[index];
        // this.search();
      },
      goNext(){
        let id = this.shopId;
        if (id){
          this.$router.push({
            name: "selectFirstypeEdit",
            query: ({shopId: id})
          });
        }else{
          this.$toast("请先选择店铺");
        }
      },
      clearInput: function () {
        this.keyword = "";
        this.isResult = false
      },
      async checkShopSelect() { //获取店铺
        let res = await getShopFun();
         if(res.code === 0) {
          this.shopList= res.data; 
         }
      }
    },
    computed: {
      hasNoData () {
        return !this.shopList.length;
      }
    },

    watch: {
      keyword: function (newVal) {
          delay(() => {
            this.fetchData();
          }, 200);     
      }
    },

    created() {
      this.checkShopSelect();
    },

    components: {

    },
  };

</script>

<style lang="scss" scoped>
  section {
    width: 100%;
    .fixedPosition {
      position:fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: #efeff4;
      z-index: 9;
      .bat-step {
        display: flex;
        justify-content: space-between;
        height: 2.08rem;
        font-size: 0.37rem;
        color: #1890ff;
        background-color: rgba(249,252,255,1);
        background: url("../../../assets/img/device/devic_line_icon.png") no-repeat center;
        background-size: 6.03rem;
        .line-bg {
          width: 100%;
          margin: 0 0.83rem;
          p {
            margin: 0.72rem 1.3rem 0.72rem 0;
            background-color: #ffffff;
            display: inline-block;
            text-align: center;
            width: 1.11rem;
            height: 0.64rem;
            line-height: 0.64rem;
            box-shadow: 0rem 0.03rem 0.05rem 0rem rgba(179, 218, 255, 1);
            border-radius: 0.39rem;
            border: 0rem solid rgba(255, 255, 255, 1);
            &:nth-child(4) {
              margin-right: 0;
            }

          }
          .active {
            color: #fff;
            background: #1890ff;
          }
        }
      }
      .bat-hd {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.4rem;
        margin-bottom: 0.13rem;
        font-size: 0.43rem;
        height: 1.6rem;
        color: rgba(51, 51, 51, 1);
        background: #fff;
        span {
          width: 5.2rem;
        }
        div {
          flex-grow: 1;
          width: auto;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.37rem;
          color: #1890ff;
          text-align: right;
        }
      }
      .search-input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        font-size: 0.43rem;
        color: rgba(153, 153, 153, 1);
        padding: 0.4rem 0.3rem 0.4rem 0.27rem;
        background: rgba(255, 255, 255, 1);
        p {
          display: flex;
        }
        .left {
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          height: 1.17rem;
          padding-right: .27rem;
          box-sizing: border-box;
          box-shadow: 0.05rem 0.05rem 0.13rem 0.05rem rgba(186, 192, 210, 0.3);
          border-radius: 0.1rem;
          input {
            background: url("../../../assets/img/device/devic_search_icon.png") no-repeat 0.27rem;
            background-size: 0.53rem;
            padding: 0.29rem 0 0.29rem 1.07rem;
            border-radius: 0.13rem;
          }
          span {
            display: inline-block;
            white-space: nowrap;
          }
          img {
            width: 0.4rem;
          }
          .gap-border {
            position: relative;
            width: .28rem;
            height: .32rem;
            margin-right: .28rem;
            &:after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: .32rem;
              border-right: 0.04rem solid rgba(216, 216, 216, 1);
            }
          }
        }
        .result-left {
          flex: 1;
        }
        .right {
          flex: 0 1 1.17rem;
          height: 1.17rem;
          background: url("../../../assets/img/device/devic_scan_icon.jpeg") no-repeat center;
          background-size: 60%;
          box-shadow: 0rem 0.05rem 0.13rem 0rem rgba(186, 192, 210, 0.3);
          border-radius: 0.13rem;
        }
        .result-right {
          display: none
        }
      }
    }
}
  .ss-bd {
    margin-top: 5.78rem;
    .search-res {
      .searchNoItem {
        font-size: 0.43rem;
        text-align: center;
        height: 2rem;
        line-height: 2rem;
      }
      .search-res-item {
        height: 1.71rem;
        background: rgba(255, 255, 255, 1);
        padding: 0.27rem .4rem 0;
        font-size: 0.43rem;
        color: rgba(51, 51, 51, 1);
        box-sizing: border-box;
        display: flex;
        div {
          &:nth-child(1) {
            width: 90%;
            p {
              height: .6rem;
              line-height: .6rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              &:nth-child(2) {
              height: 0.44rem;
              line-height: 0.44rem;
              font-size: 0.32rem;
              margin-top: .1rem;
              color: rgba(153, 153, 153, 1);
              }
            }
          }
          &:nth-child(2) {
            width: 10%;
            color: rgba(24, 144, 255, 1);
            text-align: center;
            line-height: 1.4rem;
          }
        }
      }
      .selected {
        background-color: rgba(24, 144, 255, 0.05);
      }
        
    }
  }

  input::-ms-clear {
    display: none;
  }

  .search-select-list {
    transition: all 0.5s;
  }

  .itemfade-enter,
  .itemfade-leave-active {
    opacity: 0;
  }

  .itemfade-leave-active {
    position: absolute;
  }

  .submitBtn {
    width: 100%;
    position: fixed;
    bottom: 0;
    border: none;
    padding: 0.45rem 0;
    background-color: #1890FF;
    color: #fff;
    font-size: 18px;
  }

</style>
