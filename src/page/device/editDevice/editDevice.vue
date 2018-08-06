<template>
  <section>
    <q-header :title="title"></q-header>
    <div v-show="modelShow">
    <ul class="device-detail">

      <!-- 表单模块部分  -->
      <li class="device-detail-item">
        <!-- 表单元格渲染 -->
        <ul class="device-detail-bd">
          <li>
            <span class="field-title">机器名称</span>
            <p class="select-1">
              <input type="text" v-model="fromdata.machineName">
            </p>
          </li>
          <li>
            <span class="field-title">所属店铺</span>
            <p class="select" @click="checkDeviceSelect">{{fromdata.shopName}}</p>
          </li>
          <li>
            <span class="field-title">NQT</span>
            <p class="select-2">
              <input type="text" v-model="fromdata.nqt" placeholder="请输入模块上二维码">
            </p>
          </li>
          <li>
            <span class="field-title">IMEI</span>
            <p class="select-2">
              <input type="text" v-model="fromdata.imei" placeholder="请输入模块上二维码">
            </p>
          </li>

          <li @click="toFunctionSeting">
            <span class="field-title">功能设置</span>
            <p class="select"></p>
          </li>
        </ul>
      </li>

    </ul>
    <button class="submitBtn" @click="submit">提交</button>
    </div>
    <!--功能列表-->
    <div v-show="setModelShow">
    <section class="fun-item-hd">
      <div>
        <p v-for="(item,index) in functionListTitle " :key="index">
          <span v-for="(it,idx) in item " :key="idx">{{it}}</span>
        </p>
      </div>
    </section>
    <section class="fun-item-bd funlist">
      <div v-for="(item,index) in functionList " :key="index">
        <input type="text" class="fun-list-item" v-model.lazy="item.functionName"/>
        <input type="text" class="fun-list-item" v-model.lazy="item.needMinutes"/>
        <input type="text" class="fun-list-item" v-model.lazy="item.functionPrice"/>
        <input type="text" class="fun-list-item" v-model.lazy="item.functionPrice" v-show="isShow2"/>
        <p class="fun-list-item">
          <mt-switch v-model="item.ifOpen"></mt-switch>
        </p>
      </div>
    </section>
    <section class="fun-ft">
      <router-link :to="{name:'addDevice'}"><Button class="btn cancle" btn-type="default" btn-color="blue">取消</Button></router-link>
      <Button class="btn" btn-type="default" btn-color="blue" @click.native="goFirst">确定</Button>
    </section>
    </div>
    <!-- 模块商 -->
    <mt-popup v-model="companyVisible" position="bottom" class="select-popup">
      <div class="select">
        <ul class="select-list">
          <li v-for="(item,index) in selectListA" :key="index" @click="getcompanyValue(item)">{{item.shopName}}</li>
        </ul>
        <div class="btn">
          <Button btn-type="default" btn-color="blue" @confirm="companyVisible = false">取消</Button>
        </div>
      </div>
    </mt-popup>
  </section>
</template>

<script>
  // import wx from 'weixin-js-sdk';
  // import {
  //   device
  // } from "@/service/device";
  import qs from "qs";
  import Button from "@/components/Button/Button";
  import { MessageBox } from 'mint-ui';
  import QHeader from '@/components/header';
  import {
    Actionsheet
  } from "mint-ui";
  import AddCount from "@/components/AddCount/AddCount";
  import { detailDeviceListFun,deleteDeviceFun,manageResetDeviceFun,tzjDeviceFun,deviceAddorEditFun ,getShopFun } from '@/service/device';


  export default {
    data() {
      return {
        setModelShow: false,
        isShow2: false,
        modelShow: true,
        companyVisible: false,
        title: '编辑设备',
        deviceDetail: [],
        getJsonArr :[],
        selectListA: [],
        functionList:[],
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
        ],
        fromdata: {
          machineName: "",
          shopName: "",
          nqt: "",
          imei: "",
          shopId:""
        },
      };
    },
    methods: {
      getcompanyValue(msg) {
        this.fromdata.shopName = msg.shopName;
        this.fromdata.shopId = msg.shopId;
        this.companyVisible = false;
      },
      async getDetailDevice() {  //获取数据
        let payload = { machineId: this.$route.query.machineId} ;     
        let res = await detailDeviceListFun(qs.stringify(payload));
         if(res.code === 0) {
          this.deviceDetail = res.data;
          this.fromdata.shopId = res.data.shopId;
          this.fromdata.machineName = res.data.machineName;
          this.fromdata.shopName = res.data.shopName;
          this.fromdata.nqt = res.data.nqt;
          this.fromdata.imei = res.data.imei;
          if(res.data.communicateType === 1){
             this.functionListTitle = this.functionListTitle2;
             this.isShow = false;            
           } 
           res.data.functionList.forEach(item=>{
            item.ifOpen=item.ifOpen === "0"?(!!item.ifOpen) : (!item.ifOpen);
          });
          this.functionList = res.data.functionList;
        }
        else {
          MessageBox.alert(res.msg);
        }
      },
      async checkDeviceSelect() { //获取店铺
        let res = await getShopFun();
         if(res.code === 0) {
          this.selectListA = res.data; 
         }
         this.companyVisible = true;
      },
      toFunctionSeting() {
          this.setModelShow= true;
          this.modelShow = false;
          this.title = "功能列表";
      },
      goFirst(){ //功能列表确认
        MessageBox.confirm('您确定要更改吗？').then(action => {       
          this.setModelShow= false;
          this.modelShow = true;
          this.title = "编辑设备";
        });
      },
      goBack(){ //功能列表返回
       this.setModelShow= false;
       this.modelShow = true;
       this.title = "编辑设备";
      },
      async submit() {  //提交
        this.getJsonArr = this.functionList;
        this.getJsonArr.forEach(item=>{
            item.ifOpen=item.ifOpen?0:1;
          });
        let obj = {
          machineId: this.deviceDetail.machineId,
          machineName: this.fromdata.machineName,
          shopId: this.fromdata.shopId,
          parentTypeId: this.deviceDetail.parentTypeId,
          subTypeId: this.deviceDetail.subTypeId,
          nqt: this.fromdata.nqt,
          company: "youfang",
          communicateType: 1,
          ver: 3,
          imei: this.fromdata.imei,
          functionTempletType: this.deviceDetail.functionTempletType,
          functionJson: JSON.stringify(this.getJsonArr)
        };
        let res = await deviceAddorEditFun(qs.stringify(obj));
        if(res.code===0) {
          this.$router.push({name: 'deviceMange'});
        }

      },

    },
    created(){
      this.getDetailDevice();
    },
    components: {
      Actionsheet,
      AddCount,
      Button,
      QHeader
    }
  };

</script>

<style lang="scss" scoped>
  .select {
    .select-list {
      text-align: center;
      li {
        border-bottom: 1px solid #dedede;
        padding: 0.25rem;
      }
    }
    .btn {
      margin: 0.2rem 0.55rem;
    }
  }

  .device-detail {
    font-size: 0.43rem;
    color: rgba(51, 51, 51, 1);
    border-top: rgb(229, 232, 235) solid 1px;
    li.device-detail-item {
      background: #fff;
      border-radius: 0.05rem;
      .device-detail-bd {
        padding: 0 0.4rem;
        li {
          padding: .53rem 0 .47rem;
          overflow: hidden;
          box-sizing: border-box;
          position: relative;
          &::after {
            content: '';
            display: block;
            width: 100%;
            position: absolute;
            bottom: 0;
            border-bottom: rgb(244, 247, 254) solid 1px;
          }
          .field-title {
            width: 30%;
            float: left;
          }
          .select,
          .select-1,
          .select-2 {
            border: 0;
            color: #7f7f7f;
            width: 70%;
            margin: 0;
            padding: 0 0.3rem 0 0;
            text-align: right;
            box-sizing: border-box;
            float: left;
            height: 0.4rem;
            input {
              text-align: right;
            }
          }
          .select-2 {
            padding: 0 0.35rem;
            font-size: 90%;
            background: url("../../../../static/image/center/icon_scon.png") no-repeat right;
            background-size: 0.3rem 0.3rem;
            .nqt {
              font-size: 80%;
            }
          }
          .select {
            background: url("../../../../static/image/center/right.png") no-repeat right;
            background-size: 0.16rem 0.27rem;
          }
          .right {
            float: right;
            .time {
              margin-right: 0.3rem;
            }
          }
          span.title {
            vertical-align: middle;
          }
          &:last-child {
            margin-bottom: 0;
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

  .fun-ft {
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .btn {
      width: 5rem;
      border-radius: 0;
      font-size: 0.48rem;
      box-sizing: border-box;
      display: inline-block;
    }
    .cancle {
      background: #fff;
      color: #1890FF;
    }
  }

</style>
