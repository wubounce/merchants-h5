<template>
    <div>
      <section class="fun-item-hd">
        <div>
          <p><span>功能</span></p>
          <p v-if="fromdata.secondType.name !== '通用脉冲充电桩'"><span>耗时</span><span>/分</span></p>
          <p><span>原价</span><span>/元</span></p>
          <p v-if="Number(fromdata.communicateType) === 0"><span>脉冲数</span></p>
          <p><span></span></p>
        </div>
      </section>
      <section class="fun-item-bd funlist">
        <div class='fun-item-div' v-for="(item,index) in functionList" :key="index">
          <span class="fun-list-item">{{item.functionName}}</span>
          <span class="fun-list-item set-color" v-if="fromdata.secondType.name !=='通用脉冲充电桩' ">{{item.needMinutes}}</span>
          <span class="fun-list-item set-color">{{item.functionPrice}}</span>
          <span class="fun-list-item set-color" v-if="Number(fromdata.communicateType) === 0">{{item.functionCode}}</span>
          <div class="fun-list-item fun-list-item-specail">
            <p class='changeStart' @click="startMachine(index)">启动</p>
         </div> 
        </div>
      </section>
    </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import {detailDeviceListFun,machineStartFun } from '@/service/device';
export default {
    data () {
        return {
            fromdata: {
                machineId: "",
                functionTempletType: "",
                machineName: "",
                firstClass: "",
                secondClass: "",
                company: "",
                communicateType: "",
                ver: "",
                shopType: {
                    name:"",
                    id:""
                },
                firstType: {
                    id: "",
                    name: "",
                    value: ""
                },
                secondType: {
                    id:"",
                    name: "",
                    value: ""
                },
                functionType: {
                    name: "未设置",
                    value: ""
                },
                nqt: '点击扫描设备上二维码',
                imei: '点击扫描模块上二维码'
            },
            functionList: []
        };
    },
    methods: {
        // 开启机器
       startMachine(index) {
           //console.log(this.functionList[index].functionName);
            MessageBox.confirm('启动模式: '+this.functionList[index].functionName,'确定要启动'+this.fromdata.machineName+'?').then(async () => {
                let payload = {
                  machineId: this.fromdata.machineId,
                  functionId: this.functionList[index].functionId
                };
                let res = await machineStartFun(payload);
                this.$router.go(-1);
                this.$toast({
                  message: '启动成功',
                  position: "middle",
                  duration: 3000
                });
            });
       },
      // 获取数据
      async getDetailDevice() {  //获取数据
        let payload = { machineId: this.$route.query.machineId} ;     
        let res = await detailDeviceListFun(payload);
        if(Number(res.communicateType) !== 1){
            this.functionListTitle2 = this.functionListTitle;
            this.isShow2 = true;
        }
        this.fromdata.machineName = res.machineName;
        this.fromdata.machineId = res.machineId;
        this.fromdata.shopType.name = res.shopName;
        this.fromdata.shopType.id = res.shopId;
        this.fromdata.firstType.id = res.parentTypeId;
        this.fromdata.secondType.id = res.subTypeId;
        this.fromdata.secondType.name = res.subTypeName;
        this.fromdata.functionTempletType = res.functionTempletType;
        this.fromdata.company = res.company;
        this.fromdata.ver = res.ver;
        this.fromdata.communicateType = res.communicateType;
        this.fromdata.nqt = res.nqt?res.nqt:"点击扫描设备上二维码";
        this.fromdata.imei = res.imei?res.imei:"点击扫描模块上二维码";
        // 选出状态为开启的功能类型
        this.functionList = res.functionList.filter(item=>{
            return item.ifOpen === 0;
        });
        this.keepFunctionArr= [].concat(JSON.parse(JSON.stringify(this.functionList)));
        this.keepInitializationArr = [].concat(JSON.parse(JSON.stringify(this.functionList)));
      }
    },
    created() {
        this.getDetailDevice();
    }
};
</script>
<style lang='scss' scoped>
  .fun-item-hd {
    background: #FAFCFF;
    color: #1890FF;
    font-size: 0.37rem;
    padding: .6rem 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    div {
      display: flex;
      padding: 0 0.4rem;
      p {
        flex: 2.19;
        text-align: center;
        position: relative;
        border-right: #E2F0FF .03rem solid;
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
    font-size: 0.37rem;
    color: #333333;
    background: #fff;
    padding: 1.6rem 0.4rem 0 0.4rem;
    div {
      display: flex;
      border-bottom: 1px solid #f9f8ff;
      height: 1.6rem;
      display: flex;
      align-items: center;
      &:last-child {
        border-bottom: none;
      }
      input {
        text-decoration: underline;
      }
      .fun-list-item {
        flex: 2.19;
        text-align: center;
        .mint-switch-input:checked + .mint-switch-core {
          border-color: #4DD865;
          background-color: #4DD865;
          width: 1.09rem;
          height: 0.67rem;
        }
        &:nth-child(1) {
          flex: 3.32;
        }
        &:nth-child(4) {
          flex: 2.21;
          box-sizing: border-box;
        }
      }
      .fun-list-item-specail {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        .changeStart {
          width: 1.44rem;
          height: 0.667rem;
          background-color: #1890FF;
          color: #fff;
          border-radius: 12px;
        }
      }
      .set-color {
        color: #1890FF;
      }
      p {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
