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
        <div>{{selectedFunction}}</div>
      </li>
    </ul>
    <section class="fun-item-hd">
      <div>
        <p v-for="(item,index) in functionListTitle2 " :key="index">
          <span v-for="(it,idx) in item " :key="idx">{{it}}</span>
        </p>
      </div>
    </section>
    <section class="fun-item-bd funlist">
      <div v-for="(item,index) in funTypeList" :key="index">
        <span class="fun-list-item">{{item.functionName}}</span>
        <input type="text" pattern="\d*" @keypress="userinputFunc" class="fun-list-item" v-model="item.needMinutes"  min=0/>
        <input type="text" class="fun-list-item" v-model="item.functionPrice"  min=0/>
        <input type="text" pattern="\d*" @keypress="userinputFunc" class="fun-list-item" v-model="item.functionCode" v-if="isShow2"  min=0/>
        <p class="fun-list-item">
          <mt-switch v-model="item.ifOpen"></mt-switch>
        </p>
      </div>
    </section>
    <div class="searchNoItem" v-show="funTypeList.length<=0">暂无功能列表</div>
    <div style="width:100%;height:1.73rem;"></div>
    <section>
      <button class="submitBtn" @click="goNext" :class="{'default':isDisable}" :disabled="isDisable">确定</button>
    </section> 
  </section>
</template>
<script>
import { MessageBox } from 'mint-ui';
import { getFunctionSetListFun,batchEditFun,batchEditMachineListFun } from '@/service/device';

export default {
    data() {
      return {
        funTypeList: [],
        isShow2: false,
        getJsonArr: [],
        selectedFunction: '',
        functionTempletType: '',
        communicateType: null,
        keepInitializationArr: [],
        isDisable: false,
        nullDisable: false,
        timeIsDisable: false,
        priceIsDisable: false,
        codeIsDisable: false,
         hdTitleArr: [
          "1.请选择相应店铺",
          "2.请选择设备类型",
          "3.请选择设备型号",
          "4.请选择设备相应功能"
        ],
        hdTitleArr1: [
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
            text: "设置"
          }
        ],
        stepArr1: [
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
       userinputFunc() {  //只能输入数字
        var keyCode = event.keyCode; 
        if (keyCode >= 48 && keyCode <= 57) { 
          event.returnValue = true; 
        }else { 
          event.returnValue = false; 
        }
      },
      async checkFunctionSetClass() { //获取功能列表
        let query = this.$route.query;
        let obj ={
          subTypeId: query.subTypeId,
          shopId: query.shopId,
        };
        if(query.flag) {
          this.stepArr = this.stepArr1;
          this.hdTitleArr = this.hdTitleArr1;
          this.currIndex = query.flag?4:3;
        }
        let res = await batchEditMachineListFun(obj);
        this.getFunctionSetList();
      },
        
      async getFunctionSetList() {
        let query = this.$route.query;
        let payload = {shopId: query.shopId,subTypeId: query.subTypeId};
        let res = await getFunctionSetListFun(payload);
        this.getJsonArr = res.list;
        this.functionTempletType = res.functionTempletType;
        this.communicateType = res.communicateType;
        if(this.communicateType !== 1){
          this.functionListTitle2 = this.functionListTitle;
          this.isShow2 = true;
        }
        res.list.forEach(item=>{
          item.ifOpen=item.ifOpen === "0"?(!!item.ifOpen) : (!item.ifOpen);
        });
        this.funTypeList = res.list;  
        this.keepInitializationArr = [].concat(JSON.parse(JSON.stringify(res.list)));       
      },  
     
      async goNext() {
        let flag1 = true;
        let flag2 = true;
        let flag3 = true;
        let flag4 = true;
        let count = 0;
        let len = this.funTypeList.length;
        let reg = /^(?!0)\d{1,3}$/; //非0正整数
        let reg1 = /^[0-9]+([.]{1}[0-9]{1,2})?$/; //可以0带二位小数的正整数
        let reg2 = /^[1-9]+([.]{1}[0-9]{1,2})?$/; //不可以0带二位小数的正整数
        let reg4 = /^([1-9]\d{0,1})$/; //1-99
        for(let i = 0;i < len;i++){
          let item = this.funTypeList[i];
          if(item.ifOpen === false){
            count++;
            item.needMinutes = this.keepInitializationArr[i].needMinutes;
            item.functionPrice = this.keepInitializationArr[i].functionPrice;
            item.functionCode = this.keepInitializationArr[i].functionCode;
            continue;
          } 
          if(!reg.test(Number(item.needMinutes))){
            this.$toast("耗时填写格式错误，请填写非0的非空正整数");
            flag1 = false;
            break;
          }
          if(String(item.needMinutes).indexOf('.')>-1){
            this.$toast("耗时填写格式错误，请填写非0的非空正整数");
            flag1 = false;
            break;
          } 
          if(item.functionPrice==='' || !reg1.test(Number(item.functionPrice))){
            this.$toast("原价填写格式错误，请输入非空正整数，最多2位小数");
            flag2 = false;
            break;
          }
          if(Number(item.functionPrice)> 99){
            this.$toast("价格需为0-99");
            flag2 = false;
            break;
          }
          if(Number(this.communicateType) === 0 && !reg4.test(Number(item.functionCode))){
            console.log(123236554);
            flag3 = false;
            this.$toast("脉冲填写格式错误，请输入1-99之间的数字");
            break;
          }
          if(Number(this.communicateType)=== 0 && String(item.functionCode).indexOf('.')>-1){
            flag3 = false;
            this.$toast("脉冲填写格式错误，请输入1-99之间的数字");
            break;
          }
          if(count == len){
            flag4 = false;
            this.$toast("请至少开启1个设备功能");
            break;
          } 
        }                  
               
        if(flag1 && flag2 && flag3 && flag4){
          let query = this.$route.query;
          let arr= [].concat(JSON.parse(JSON.stringify(this.funTypeList))); 
          arr.forEach(item=>{
            return item.ifOpen=item.ifOpen?0:1;
          });
          let obj ={
            subTypeId: query.subTypeId,
            shopId: query.shopId,
            functionTempletType: this.functionTempletType,
            functionJson: JSON.stringify(arr)
          };
          let res = await batchEditFun(obj);
          this.$toast("批量修改成功");
          this.$router.push({name:'deviceMange'});
        } 
      }
        
    },

    computed: {
      hasNoData () {
        return !this.funTypeList.length;
      }
    },

    created() {
      this.checkFunctionSetClass();
    },

    components: {
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
        }
        &:last-child {
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

  .fun-item-bd {
    line-height: 1.6rem; // padding: 0 .4rem;
    font-size: 0.37rem;
    color: #333333;
    background: #fff;
    div {
      display: flex; // justify-content: space-between;
      input {
        text-decoration: underline;
      }
      .fun-list-item {
        flex: 2.19;
        text-align: center;
        line-height: 1.6rem;

        &:nth-child(1) {
          flex: 3.32;
        }
        &:nth-child(4) {
          flex: 2.21;
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
    }
  }
  .searchNoItem {
    font-size: 14px;
    color: #999;
    text-align: center;
    height: 100%;
    line-height: 100%;
    padding-top: 4rem;
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
