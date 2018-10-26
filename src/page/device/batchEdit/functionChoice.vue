<template>
  <section class="ss-wrappper">
    <div class="bat-step">
        <div class="line-bg">
          <p v-for="(item,index) in stepArr " :key="index">
            <span :class="{active:currIndex==index}">{{item.text}}</span>
          </p>
        </div>
    </div>
    <ul>
      <li class="bat-hd">
        <span>{{hdTitleArr[currIndex]}}</span>
      </li>
    </ul>
    <ul class="functionChoice">
      <li class="item" @click="goToFunctionSet">
        <div></div>
        <div>功能属性设置</div>
        <div class="select"><span class="iconfont icon-nextx"></span></div>
      </li>
      <li class="item" @click="goToWaterLevelSet">
        <div></div>
        <div>水位设置</div>
        <div class="select"><span class="iconfont icon-nextx"></span></div>
      </li>
    </ul>
  </section>
</template>
<script>
import { MessageBox } from 'mint-ui';
import { getFunctionSetListFun,batchEditFun,batchEditMachineListFun } from '@/service/device';

export default {
    data() {
      return {
        currIndex: 3,
        hdTitleArr: [
          "1.请选择相应店铺",
          "2.请选择设备类型",
          "3.请选择设备型号",
          "4.请选择需要批量修改的功能"
        ],
        stepArr: [
          {
            text: "店铺"
          },
          {
            text: "类型"
          },
          {
            text: "型号"
          },
          {
            text: "功能"
          },
          {
            text: "设置"
          }
        ],
      };
    },
    methods: {
      goToFunctionSet() {
        let query = this.$route.query;
        this.$router.push({
          name: "selectFunctionEdit",
          query: ({shopId:query.shopId, parentTypeId:query.parentTypeId, subTypeId:query.subTypeId,flag:1})
        });
      },
      goToWaterLevelSet() {
        let query = this.$route.query;
        this.$router.push({
          name: "waterLevelSet",
          query: ({shopId:query.shopId, parentTypeId:query.parentTypeId, subTypeId:query.subTypeId})
        });
      }
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
    background-color: rgba(249,252,255,1);
    background: url("../../../assets/img/device/devic_line_icon.png") no-repeat center;
    background-size: 6.03rem;
    .line-bg {
      width: 100%;
      margin: 0 0.83rem;
      display: flex;
      p {
        flex: 1;
        text-align: center;
        span {
          display: inline-block;
          width: 1.11rem;
          height: 0.64rem;
          line-height: 0.64rem;
          box-shadow: 0rem 0.03rem 0.05rem 0rem rgba(179, 218, 255, 1);
          border-radius: 0.39rem;
          background-color: #ffffff;
          border: 0rem solid rgba(255, 255, 255, 1);
          color: #1890ff;
          margin: 0.72rem 0;
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
    margin-bottom: 0.27rem;
    font-size: 0.43rem;
    height: 1.6rem;
    color: rgba(51, 51, 51, 1);
    background: #fff;
    span {
          width: 80%;
    }
    div {
      flex-grow: 1;
      width: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.37rem;
      color: #1890ff;
      text-align: right;
    }
  }
  .functionChoice{
    width:100%;
    li {
      display: flex;
      text-align:center;
      height: 1.6rem;
      line-height: 1.6rem;
      background: rgba(255, 255, 255, 1);
      font-size: 0.4rem;
      color: rgba(51, 51, 51, 1);
      &:last-child {
        border-bottom: none;
      }
      div {
        &:nth-child(1) {
          width: 10%;
        }
        &:nth-child(2) {
          width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border-bottom: 1px solid #f9f8ff;
          &:last-child {
            border-bottom: none;
          }
        }
        &:nth-child(3) {
          width: 10%;
          text-align: center;
          span {
            color: rgba(204, 204, 204, 1);
          }
        }
        
      }
    }
    .selected {
      background-color:rgba(24, 144, 255, 0.05);
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
  .noClick {
    background-color: #cccccc;
  }
  .default {
    opacity: 0.6;
  }
</style>
<style>
  .mint-switch-input:checked + .mint-switch-core {
    border-color: #4DD865;
    background-color: #4DD865;
  }
</style>
