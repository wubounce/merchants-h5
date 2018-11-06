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
        <div>{{waterLevel}}</div>
      </li>
    </ul>
    <ul class="functionChoice">
       <li class="item" v-for="(item,index) in waterLevelArr" :class="{selected:index==selectIndex}" :key="index" @click="selectClick(index,item)">
          <div></div>
          <div>{{item}}</div>
          <div class="select"><span class="iconfont" :class="{'icon-xuanze':index==selectIndex}"></span></div>
        </li>
    </ul>
    <div style="width:100%;height:1.73rem;"></div>
    <section>
      <button class="submitBtn" @click="goNext">确定</button>
    </section> 
  </section>
</template>
<script>
import { MessageBox } from 'mint-ui';
import { getFunctionSetListFun,batchEditFun,batchEditMachineListFun } from '@/service/device';

export default {
    data() {
      return {
        currIndex: 4,
        selectIndex: -1,
        waterLevel: '',
        waterLevelArr: ['极低水位','低水位','中水位','高水位'],
        hdTitleArr: [
          "1.请选择相应店铺",
          "2.请选择设备类型",
          "3.请选择设备型号",
          "4.请选择需要批量修改的功能",
          "5.请设置设备相应功能"
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
      selectClick: function (index,name,id) {
        this.selectIndex = index;
        this.waterLevel= name;
      },
      async goNext() { 
        let query = this.$route.query;     
        let obj ={
          subTypeId: query.subTypeId,
          shopId: query.shopId,
          waterLevel: this.waterLevel
        };
        let res = await batchEditFun(obj);
        this.$toast("批量修改成功");
        this.$router.push({name:'deviceMange'});
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
          width: 60%;
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
      height: 1.17rem;
      line-height: 1.17rem;
      background: rgba(255, 255, 255, 1);
      font-size: 0.4rem;
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
          color: #1890ff;
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
