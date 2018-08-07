<template>
  <section class="ss-wrappper">
    <q-header :title="title"></q-header>
    <div class="bat-step">
      <p v-for="(item,index) in stepArr " :key="index" :class="{active:currIndex==index}">
        <span>{{item.text}}</span>
      </p>
    </div>
    <ul>
      <li class="bat-hd">
        <span>{{hdTitleArr[currIndex]}}</span>
        <span @click="chooseTime">{{beginTime}}</span>
      </li>
    </ul>
    <div v-show="functionSetModel"> 
      <section class="fun-item-hd">
        <div>
          <p v-for="(item,index) in functionListTitle " :key="index">
            <span v-for="(it,idx) in item " :key="idx">{{it}}</span>
          </p>
        </div>
      </section>
      <section class="fun-item-bd funlist">
        <div v-for="(item,index) in secondTypeList " :key="index" class="">
          <span class="fun-list-item">{{item.functionName}}</span>
          <span class="fun-list-item">{{item.needMinutes}}</span>
          <span class="fun-list-item">{{item.functionPrice}}</span>         
          <p class="fun-list-item">
            <mt-switch v-model="item.ifOpen"></mt-switch>
          </p>
          <p class="fun-list-item checkBox">
            <span class="iconfont icon-weixuanzhong" :class="{'icon-xuanze':index==selectIndex}" @click="checkItemBox(index)"></span>
          </p>
        </div>
      </section>
    </div>
    <!-- 启动时间 -->
    <mt-datetime-picker ref="pickerStarTime" type="datetime" v-model="pickerValue"  @confirm="handleConfirm"></mt-datetime-picker>
    <section class="promiss-footer" v-show="functionSetModel">
      <span class="can" @click="goBack">上一步</span>
      <span class="cifrm" @click="goNext">下一步</span>
    </section> 
    <section v-show="!functionSetModel">
      <button class="submitBtn" @click="submit">确定</button>
    </section>
  </section>
</template>
<script>
import qs from "qs";
import QHeader from "@/components/header";
import { MessageBox } from 'mint-ui';
import { batchFunctionSetListFun,batchStartOnFun } from '@/service/device';
import moment from 'moment';

export default {
    data() {
      return {
        secondTypeList: [],
        aaa:[],
        isCheck: 'weixuanzhong',
        title: "批量启动",
        isResult: false,
        functionSetModel: true,
        pickerValue: new Date(),
        isShow2: false,
        keyword: '',
        beginTime: '',
        functionId: '',
        selectedFunction: '',
        selectIndex: -1,
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
            text: "功能",
            name: "selectFunction"
          },
          {
            text: "时间",
            name: "selectStartTime"
          }
        ],
        currIndex: 2,
        functionListTitle: [
          ['功能'],
          ['耗时', '/分'],
          ['原价', '/元'],
          ['状态'],
          ['操作']
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
      checkItemBox: function (index) {
        this.selectIndex = index;
        this.functionId = this.secondTypeList[index].functionId;
      },
      async checkSecondClass() { //获取功能列表
        let query = this.$route.query;
        let payload = {machineParentTypeId: query.parentTypeId,shopId: query.shopId};
        let res = await batchFunctionSetListFun(qs.stringify(payload));
          if(res.code === 0) {
            res.data.forEach(item=>{
              item.ifOpen=item.ifOpen === "0"?(!!item.ifOpen) : (!item.ifOpen);
            });
            this.secondTypeList = res.data; 
          }
      },
      chooseTime() {
        if (!this.functionSetModel){
          this.$refs.pickerStarTime.open();
        }
      },
      async submit() {
        let query = this.$route.query;
        let time = this.beginTime + ":00";
        let payload = {machineParentTypeId:query.parentTypeId,shopId:query.shopId,standardFunctionId:this.functionId,startTime:time};
        let res = await batchStartOnFun(qs.stringify(payload));
        if(res.code === 0) {
          MessageBox.alert("操作成功");
          this.$router.push({name:'todolist'});
        }
      },
      handleConfirm(data) {
        //判断启动时间是否小于当前时间
        let nowDate = new Date();
        if(this.pickerValue <= nowDate) {
          this.$toast({
              message: '启动时间不得小于等于当前时间',
              position: "middle",
              duration: 3000
            });
        }
        else {
          let date = moment(data).format('YYYY-MM-DD HH:mm');
          this.pickerValue = date;
          this.beginTime = this.pickerValue;
        }
      },
      goBack() {
        this.$router.go(-1);
      },
      goNext() {
        this.$refs.pickerStarTime.open();
        this.currIndex = 3;
        this.functionSetModel = false;
      }

    },

    created() {
      this.checkSecondClass();
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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:nth-child(4) {
          flex: 2.21;
          border-right: none;
        }
        &:nth-child(5) {
          flex: 1.5;
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

  .fun-item-bd {
    line-height: 1.6rem; // padding: 0 .4rem;
    font-size: 0.37rem;
    color: #333333;
    background: #fff;
    div {
      display: flex; // justify-content: space-between;
      .fun-list-item {
        flex: 2.19;
        text-align: center;
        line-height: 1.6rem;
        &:nth-child(1) {
          flex: 3.32;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:nth-child(4) {
          flex: 2.21;
          box-sizing: border-box;
        }
        &:nth-child(5) {
          flex: 1.5;
          box-sizing: border-box;
        }
      }
      p {
        display: flex;
        justify-content: center;
        align-items: center;
        .mint-switch-input:checked+.mint-switch-core {
          border-color: #4DD865;
          background-color: #4DD865;
        }
      }
      .checkBox {
        .icon-xuanze {
          color: #1890ff;
        }
      }
    }
  }

  .promiss-footer {
      display: flex;
      height: 1.33rem;
      line-height: 1.33rem;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    }
    .promiss-footer > span {
     flex: 1;
     text-align: center;
    }
    .promiss-footer .can {
      font-size: 18px;
      color: #1890FF;
      background: #f6f8ff;
    }
    .promiss-footer .cifrm {
      background: #1890FF;
      font-size: 18px;
      color: #fff;
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
