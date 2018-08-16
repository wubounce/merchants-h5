<template>
  <section class="ss-wrappper" v-title="title">
    <div class="bat-step">
        <div class="line-bg">
          <p v-for="(item,index) in stepArr " :key="index" :class="{active:currIndex==index}">{{item.text}}</p>
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
        <input type="number" class="fun-list-item" v-model="item.needMinutes"  @change="checkData(item.needMinutes,index,'needMinutes',0)" min=0/>
        <input type="number" class="fun-list-item" v-model="item.functionPrice" @change="checkData(item.functionPrice,index,'functionPrice',1)" min=0/>
        <input type="number" class="fun-list-item" v-model="item.functionCode" v-if="isShow2" @change="checkData(item.functionCode,index,'functionCode',2)" min=0/>
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
import qs from "qs";
import { MessageBox } from 'mint-ui';
import { getFunctionSetListFun,batchEditFun,batchEditMachineListFun } from '@/service/device';

export default {
    data() {
      return {
        funTypeList: [],
        isShow2: false,
        title: "批量修改",
        getJsonArr: [],
        selectedFunction: '',
        functionTempletType: '',
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
      checkData(val,index,name,flag) {
        let reg = /^\+?[1-9][0-9]*$/;  //验证非0整数
        let reg1 = /^[0-9]+([.]{1}[0-9]{1,2})?$/;  //验证非0正整数和带一位小数字非0正整数
        if(flag ===0 && !reg.test(val)) {
          if(!val){
            this.$toast("输入内容不能为空");
            this.nullDisable = true;
          }else{
          this.$toast("耗时格式有误");
          this.timeIsDisable= true;
          }
        }else{
          this.timeIsDisable= false;
          this.nullDisable = false;
        }
        if(flag ===1 && !reg1.test(val)) {
          if(!val){
            this.$toast("输入内容不能为空");
            this.nullDisable = true;
          }else{
          this.$toast("价格格式有误");
          this.priceIsDisable = true;
          }
        }else{
          this.priceIsDisable = false;
          this.nullDisable = false;
        }
        if(flag ===2 && !reg.test(val)) {
          if(!val){
            this.$toast("输入内容不能为空");
            this.nullDisable = true;
          }else{
          this.$toast("脉冲格式有误");
          this.codeIsDisable = true;
          }
        }else{
          this.codeIsDisable= false;
          this.nullDisable = false;
        }
        if(this.nullDisable || this.timeIsDisable || this.priceIsDisable || this.codeIsDisable){
          this.isDisable = true;
          return false;
        }else{
          this.isDisable = false;
        }
      },
      async checkFunctionSetClass() { //获取功能列表
        let query = this.$route.query;
        let obj ={
          subTypeId: query.subTypeId,
          shopId: query.shopId,
        };
        let res = await batchEditMachineListFun(qs.stringify(obj));
          if(res.code === 0) {   
            this.getFunctionSetList();
          }else{
            this.$toast(res.msg);
          }
      },
        
      async getFunctionSetList() {
        let query = this.$route.query;
        let payload = {shopId: query.shopId,subTypeId: query.subTypeId};
        let res = await getFunctionSetListFun(qs.stringify(payload));
          if(res.code === 0) {
             this.getJsonArr = res.data.list;
             this.functionTempletType = res.data.functionTempletType;        
             if(res.data.communicateType !== 1){
             this.functionListTitle2 = this.functionListTitle;
             this.isShow2 = true;
            }
            res.data.list.forEach(item=>{
              item.ifOpen=item.ifOpen === "0"?(!!item.ifOpen) : (!item.ifOpen);
             });
            this.funTypeList = res.data.list;         
          }
      },  
     
      async goNext() {
        let count = 0;
        let len = this.funTypeList.length;
        this.funTypeList.forEach(item=>{
          if(item.ifOpen === false){
            count++;
          }
        });
        if(count !== len){
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
          let res = await batchEditFun(qs.stringify(obj));
            if(res.code === 0) {
              let instance = this.$toast({
                message: '批量修改成功',
                iconClass: 'mint-toast-icon mintui mintui-success'
              });
              setTimeout(() => {
                instance.close();
                this.$router.push({name:'deviceMange'});
                }, 2000);
            }else {
              this.$toast(res.msg);
            }
        }else{
          this.$toast("请至少开启1个设备功能");
          return false;
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
