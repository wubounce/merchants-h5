<template>
  <section class="ss-wrappper">
    <q-header :title="title"></q-header>
    <div class="bat-step">
      <p v-for="(item,index) in stepArr " :key="index" :class="{active:currIndex==index}">
        <span @click="chooseStep(index)">{{item.text}}</span>
      </p>
    </div>
    <ul>
      <li class="bat-hd">
        <span>{{hdTitleArr[currIndex]}}</span>
        <span>{{selectedShop}}</span>
      </li>
    </ul>
    <div class="ss-hd">
      <div class="search-input">
        <p class="left" :class="{ 'result-left': isResult }">
          <input type="text" v-model.trim="keyword" placeholder="请输入设备名称/IMEI 号">
          <span v-if="isResult">
            <img src="../../../assets/img/device/devic_scan_icon.jpeg">
            <span class="gap-border"></span>
            <span class="search-reset" @click="clearInput">返回</span>
          </span>
        </p>
        <p class="right" :class="{ 'result-right': isResult }">
        </p>
      </div>
    </div>
    <div class="ss-bd">
      <div class="search-res">
        <transition-group name="itemfade" tag="ul" mode="out-in" v-cloak>
          <li v-for="(item,index) in shopList" :class="{'curr-selected':index==selectIndex}" class="search-res-item" @click="selectClick(index,item.shopName)"
            :key="index">
            <p>{{item.shopName}}</p>
            <p>{{item.address}}</p>
          </li>
        </transition-group>
      </div>
    </div>
    <button class="submitBtn" @click="goNext">下一步</button>
  </section>
</template>

<script>
  /* eslint-disable */
  import qs from "qs";
  import QHeader from "@/components/header";
  import {delay} from "@/utils/tool";
  import { getShopFun } from '@/service/device';
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
          "3.请选择设备相应功能",
          "4.请选择启动时间"
        ],
      }
    },
    methods: {
      fetchData: function () {
        console.log('获取数据');
      },
      selectClick: function (index,name) {
        this.selectIndex = index
        this.shopId = this.shopList[index].shopId;
        this.selectedShop = name;

        // this.keyword = this.resData[index];
        // this.search();
      },
      goNext(){
        this.$router.push({
          name: "selectFirstypeEdit",
          query: ({shopId: this.shopId})
        });
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

    watch: {
      keyword: function (newVal) {
        if (newVal !== '') {
          delay(() => {
            this.fetchData();
          }, 300);
          this.isResult = true
        } else {
          this.isResult = false
        }
      }
    },

    created() {
      this.checkShopSelect();
    },

    components: {
      QHeader
  },
  };

</script>

<style lang="scss" scoped>
  section {
    width: 100%;
    .bat-step {
      display: flex;
      justify-content: space-between;
      height: 2.08rem;
      font-size: 0.37rem;
      color: #1890ff;
      background: #f9fcff;
      p {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          text-align: center;
          width: 1.11rem;
          height: 0.64rem;
          line-height: 0.64rem;
          box-shadow: 0rem 0.03rem 0.05rem 0rem rgba(179, 218, 255, 1);
          border-radius: 0.39rem;
          border: 0rem solid rgba(255, 255, 255, 1);
        }
      }
      .active {
        span {
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
        &:nth-child(2) {
          font-size: 0.37rem;
          color: #1890ff;
        }
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
        flex: 0 1 7.93rem;
        height: 1.17rem;
        padding-right: .27rem;
        box-sizing: border-box;
        box-shadow: 0rem 0.05rem 0.13rem 0rem rgba(186, 192, 210, 0.3);
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

  .ss-bd {
    .search-res {
      .search-res-item {
        height: 1.71rem;
        background: rgba(255, 255, 255, 1);
        padding: 0.27rem .4rem 0;
        font-size: 0.43rem;
        color: rgba(51, 51, 51, 1);
        box-sizing: border-box;
        p {
          height: .6rem;
          line-height: .6rem;
          &:nth-child(2) {
            height: 0.44rem;
            line-height: 0.44rem;
            font-size: 0.32rem;
            margin-top: .1rem;
            color: rgba(153, 153, 153, 1);
          }
        }
      }
      .curr-selected {
        background: url('../../../../static/image/device/selected-bgc-icon.jpeg') no-repeat 96% 50%  padding-box;
        background-size: .6rem;
        background-color:  rgba(24, 144, 255, 0.05);
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
