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
          <div v-show="functionSetModel">{{selectedFunction}}</div>
          <div @click="chooseTime" v-show="!functionSetModel">{{beginTime}}</div>
        </li>
      </ul>
    </div>
    <div v-show="functionSetModel"> 
      <div class="sf-bd">
        <ul>
          <li class="item" v-for="(item,index) in secondTypeList" :class="{selected:index==selectIndex}" :key="index" @click="selectClick(index,item.functionName)">
            <div></div>
            <div>{{item.functionName}}</div>
            <div class="select"><span class="iconfont" :class="{'icon-xuanze':index==selectIndex}"></span></div>
          </li>
        </ul>
        <div class="searchNoItem" v-show="secondTypeList.length<=0">暂无功能列表</div>
      </div>
    </div>
    <div class="itemBar" v-show="!functionSetModel">
      <span>年</span>
      <span>月</span>
      <span>日</span>
      <span>小时</span>
      <span>分钟</span>
    </div>
    <!-- 启动时间 -->
    <van-datetime-picker
      v-model="currentDate"
      type="datetime"
      :min-date="minDate" 
      @change="changeItem"
      ref="checkoutTime"
      v-show="!functionSetModel"
    />
    <div style="width:100%;height:1.73rem;"></div>
    <section class="promiss-footer" v-show="functionSetModel">
      <span class="can" @click="goBack">上一步</span>
      <span class="cifrm" @click="goNext" :class="{'default':secondTypeList.length<=0}" :disabled="secondTypeList.length<=0">下一步</span>
    </section> 
    <section v-show="!functionSetModel">
      <button class="submitBtn" @click="submit">确定</button>
    </section>
  </section>
</template>
<script>
import { MessageBox } from 'mint-ui';
import { batchFunctionSetListFun,batchStartOnFun } from '@/service/device';
import moment from 'moment';

export default {
    data() {
      return {
        secondTypeList: [],
        aaa:[],
        date: '',
        isCheck: 'weixuanzhong',
        title: "批量启动",
        isResult: false,
        functionSetModel: true,
        pickerValue: new Date(),
        isShow2: false,
        keyword: '',
        beginTime: '',
        startTime: '',
        functionId: '',
        selectedFunction: '',
        selectIndex: -1,
        minDate: new Date(),
        currentDate: new Date(),
        hdTitleArr: [
          "1.请选择相应店铺",
          "2.请选择设备类型",
          "3.请选择设备相应功能",
          "4.请选择启动时间"
        ],
        stepArr: [
          {
            text: "店铺",
          },
          {
            text: "类型",
          },
          {
            text: "功能",
          },
          {
            text: "时间",
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
      changeItem(picker) {
      let timeArr = picker.getValues();
      this.beginTime = timeArr[0] + "年" + timeArr[1] + "月" + timeArr[2] + "日" + " " + timeArr[3] + ":" + timeArr[4];
      this.startTime = timeArr[0] + "-" + timeArr[1] + "-" + timeArr[2] + " " + timeArr[3] + ":" + timeArr[4] + ":00";
      },
      selectClick: function (index,name) {
        this.selectIndex = index;
        this.functionId = this.secondTypeList[index].functionId;
        this.selectedFunction= name;
      },
      async checkSecondClass() { //获取功能列表
        let query = this.$route.query;
        let payload = {machineParentTypeId: query.parentTypeId,shopId: query.shopId};
        let res = await batchFunctionSetListFun(payload);
        res.forEach(item=>{
          item.ifOpen=item.ifOpen === 0? "开启":"关闭";
        });        
        this.secondTypeList = res; 

      },
      chooseTime() {
        if (!this.functionSetModel){
          this.$refs.pickerStarTime.open();
        }
      },
      
      async submit() {
        if(this.startTime){
          let query = this.$route.query;
          let payload = {machineParentTypeId:query.parentTypeId,shopId:query.shopId,standardFunctionId:this.functionId,startTime:this.startTime};
          let res = await batchStartOnFun(payload);
          let instance = this.$toast({
            message: '设置成功',
            iconClass: 'mint-toast-icon mintui mintui-success'
          });
          setTimeout(() => {
            instance.close();
            this.$router.push({name:'todolist'});
          }, 2000);
        }else{
          this.$toast("请设置启动时间");
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
        if(this.selectedFunction){
          this.currIndex = 3;
          this.functionSetModel = false;
        } else {
          this.$toast("请先选择设备相应功能");
        }
      }

    },

    created() {
      this.checkSecondClass();
    },
   

    components: {
    },
};

</script>

<style lang="scss" scoped>
  .fixedPosition {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    background-color: #efeff4;
    .bat-step {
      display: flex;
      justify-content: space-between;
      height: 2.08rem;
      font-size: 0.37rem;
      color: #1890ff;
      background-color: #f9fcff;
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
        width: 50%;
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
   .sf-bd {
      padding-top: 3.81rem;
      .searchNoItem {
        font-size: 14px;
        color: #999;
        text-align: center;
        height: 100%;
        line-height: 100%;
        padding-top: 4rem;
      }
      ul {
        width:100%;
        li {
          display: flex;
          text-align:center;
          height: 1.17rem;
          line-height: 1.17rem;
          background: rgba(255, 255, 255, 1);
          font-size: 0.4rem;
          color: rgba(51, 51, 51, 1);
          div {
            &:nth-child(1) {
              width: 10%;
            }
            &:nth-child(2) {
              width: 80%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            &:nth-child(3) {
              width: 10%;
              color: #1890ff;
              text-align: center;
            }
            
          }
        }
        .selected {
              background-color:rgba(24, 144, 255, 0.05);
            }
      }
      
    }
  .itemBar {
    display: flex;  
    z-index: 999;
    position: fixed;
    width: 100%;
    top: 3.81rem;
    height: 40px;
    line-height: 40px;
    background: #ffffff;
    margin-bottom: 0.13rem;
    padding: .2rem 0;
    font-size: 16px;
    span {
      flex: 1;
      text-align: center;
      border-right: 1px solid #ffffff;
      &:last-child {
      border-right: none;
    }
    }
    
  }
  .van-picker {
    padding-top: 5.13rem;
    margin-top: -40px;
    .van-picker-column__item--selected{
      font-size: 20px;
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
    .promiss-footer .default {
      opacity: 0.6;
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
    .default {
      opacity: 0.6;
    }

</style>
