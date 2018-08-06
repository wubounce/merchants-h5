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
        <span>{{selectedFunction}}</span>
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
    <section class="fun-item-hd">
      <div>
        <p v-for="(item,index) in functionListTitle " :key="index">
          <span v-for="(it,idx) in item " :key="idx">{{it}}</span>
        </p>
      </div>
    </section>
    <section class="fun-item-bd funlist">
      <div v-for="(item,index) in funTypeList " :key="index">
        <input type="text" class="fun-list-item" v-model.lazy="item.functionName"/>
        <input type="text" class="fun-list-item" v-model.lazy="item.needMinutes"/>
        <input type="text" class="fun-list-item" v-model.lazy="item.functionPrice"/>
        <input type="text" class="fun-list-item" v-model.lazy="item.functionPrice" v-show="isShow2"/>
        <p class="fun-list-item">
          <mt-switch v-model="item.ifOpen"></mt-switch>
        </p>
      </div>
    </section>
    <section>
      <button class="submitBtn" @click="goNext">确定</button>
    </section> 
  </section>
</template>
<script>
import qs from "qs";
import QHeader from "@/components/header";
import { batchFunctionSetListFun,batchEditFun } from '@/service/device';

export default {
    data() {
      return {
        funTypeList: [],
        title: "批量编辑",
        isResult: false,
        keyword: '',
        selectedFunction: '',
        hdTitleArr: [
          "1.请选择相应店铺",
          "2.请选择设备类型",
          "3.请选择设备相应功能",
          "4.请选择启动时间"
        ],
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
            text: "型号",
            name: "selectFunction"
          },
          {
            text: "功能",
            name: "selectStartTime"
          }
        ],
        currIndex: 3,
        functionListTitle: [
          ['功能'],
          ['耗时', '/分'],
          ['原价', '/元'],
          ['脉冲数'],
          ['状态']
        ],
        functionListTitle2: [
          ['功能'],
          ['耗时', '/分'],
          ['原价', '/元'],
          ['状态']
        ]
      };
    },
    methods: {
      async checkFunctionSetClass() { //获取功能列表
        let query = this.$route.query;
        let payload = {machineParentTypeId: query.parentTypeId};
        let res = await batchFunctionSetListFun(qs.stringify(payload));
          if(res.code === 0) {
            this.funTypeList = res.data;          
          }
      },
      async goNext() {
        let query = this.$route.query;
        let payload = {subTypeId: query.subTypeId, shopId: query.shopId, functionJson: JSON.stringify(this.funTypeList)};
        let res = await batchFunctionSetListFun(qs.stringify(payload));
          if(res.code === 0) {
            MessageBox.alert(res.mes);
            this.$router.push({name:'deviceMange'});
          }
      }

    },

    created() {
      this.checkFunctionSetClass();
    },

    components: {
      QHeader
    },
};

</script>

<style lang="scss" scoped>
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
  .fun-item-hd {
    padding: 0;
    background: #FAFCFF;
    color: #1890FF;
    font-size: 0.37rem;
    padding: .6rem 0;
    div {
      display: flex;
      p {
        flex: 2.19;
        text-align: center;
        position: relative;
        border-right: rgb(24, 144, 255) .03rem solid;
        box-sizing: border-box;
        &:nth-child(1) {
          flex: 3.32;
        }
        &:nth-child(4) {
          flex: 2.21;
          border-right: none;
        }
        span {
          &:nth-child(2) {
            font-size: 70%;
            letter-spacing: .001rem
          }
        }
      }
    }
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
