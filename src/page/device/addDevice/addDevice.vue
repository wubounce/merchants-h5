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
              <span class="field-title">设备名称</span>
              <p class="select-1">
                <input type="text" v-model="fromdata.machineName">
              </p>
            </li>
            <li @click="checkDeviceSelect">
              <span class="field-title">所属店铺</span>
              <p class="select">{{fromdata.shopType.name}}</p>
            </li>
            <li @click="checkFirstClass">
              <span class="field-title">设备类型</span>
              <p class="select">{{fromdata.firstType.name}}</p>
            </li>
            <li @click="checkSecondClass">
              <span class="field-title">设备型号</span>
              <p class="select">{{fromdata.secondType.name}}</p>
            </li>
            <li>
              <span class="field-title">NQT</span>
              <p class="select-2" @click="wxScan($event,'npt')">
                <span>{{fromdata.nqt}}</span>
              </p>
            </li>
            <li>
              <span class="field-title">IMEI</span>
              <p class="select-2" @click="wxScan($event,'imei')">
                <span>{{fromdata.imei}}</span>
              </p>
            </li>
            <li @click="toFunctionSeting">
              <span class="field-title">功能设置</span>
              <p class="select">{{fromdata.functionType.name}}</p>
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
      <div v-for="(item,index) in functionSetList " :key="index">
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
    <mt-popup v-model="parentType" position="bottom" class="select-popup">
      <div class="select">
        <ul class="select-list">
          <li v-for="(item,index) in functionList" :key="index" @click="getFirstValue(item)">{{item.name}}</li>
        </ul>
        <div class="btn">
          <Button btn-type="default" btn-color="blue" @confirm="parentType = false">取消</Button>
        </div>
      </div>
    </mt-popup>
    <mt-popup v-model="subType" position="bottom" class="select-popup">
      <div class="select">
        <ul class="select-list">
          <li v-for="(item,index) in funList" :key="index" @click="getSecondValue(item)">{{item.name}}</li>
        </ul>
        <div class="btn">
          <Button btn-type="default" btn-color="blue" @confirm="subType = false">取消</Button>
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
  import Api from '@/utils/Api';
  import Web from '@/utils/Web';
  import { MessageBox } from 'mint-ui';
  import Button from "@/components/Button/Button";
  import QHeader from '@/components/header';
  import {
    Actionsheet
  } from "mint-ui";
  import AddCount from "@/components/AddCount/AddCount";
  import { getWxconfigFun,getShopFun,getlistParentTypeFun,getlistSubTypeFun,deviceAddorEditFun,getFunctionSetListFun } from '@/service/device';
 


  export default {
    data() {
      return {
        setModelShow: false,
        isShow2: false,
        modelShow: true,
        companyVisible: false,
        parentType: false,    
        subType: false,
        functionTempletType: null,
        itemName:["functionName","needMinutes","functionPrice","ifOpen"],
        functionSetList: [],
        jsonArr:[],
        getJsonArr:[],
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
        title: '新增设备',
        fromdata: {
          machineName: "",
          firstClass: "",
          secondClass: "",
          shopType: {
            name:"",
            id:""
          },
          firstType: {
            name: "",
            value: ""
          },
          secondType: {
            name: "",
            value: ""
          },
          functionType: {
            name: "",
            value: ""
          },
          nqt: "84e5397409274f718ec52509f0be91f2",
          imei: "865933031201524"
        },
        selectListA: [],
        functionList: [],
        funList: [],
      };
    },
    methods: {
      getcompanyValue(msg) {
        this.fromdata.shopType.name = msg.shopName;
        this.fromdata.shopType.id = msg.shopId;
        this.companyVisible = false;
      },
      getFirstValue(msg) {
        this.fromdata.firstType.name = msg.name;
        this.fromdata.firstType.id = msg.id;
        this.parentType = false;
      },
      getSecondValue(msg) {
        this.fromdata.secondType.name = msg.name;
        this.fromdata.secondType.id = msg.id;
        this.subType = false;
      },
      wxScan(e, type) { //微信扫码
        var self = this;
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            // 回调
            try {
              // alert(JSON.stringify(res))
              let scanResult = this.analyzeResult(res.resultStr);
              // alert(JSON.stringify(scanResult))

              let _NQT = scanResult['NQT'];
              let _IMEI = scanResult['IMEI'];
              let _company = scanResult['Company'];
              _NQT ? this.fromdata.nqt = _NQT : '';
              _IMEI ? this.fromdata.imei = _IMEI : '';
              // if (type === 'nqt') {
              //   this.fromdata.nqt = _NQT
              // } else {
              //   this.fromdata.imei = _IMEI
              // } 
            } catch (error) {
              alert(error);
            }


          }.bind(this),
          error: function (res) {
            if (res.errMsg.indexOf('function_not_exist') > 0) {
              alert('版本过低请升级');
            }
          }
        });

      },
      async initWechat(){ //微信配置初始化
        let payload = {url: window.location.href.split('#')[0]};
        let res = await getWxconfigFun(qs.stringify(payload));
          wx.config({
          debug: process.env.NODE_ENV === 'development', // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.data.appId, // 必填，公众号的唯一标识
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
          signature: res.data.signature, // 必填，签名
          jsApiList: ['chooseWXPay', 'scanQRCode', 'checkJsApi', 'getLocation'] // 必填，需要使用的JS接口列表
        });   
      },
      async checkDeviceSelect() { //获取店铺
        let res = await getShopFun();
         if(res.code === 0) {
          this.selectListA = res.data; 
         }
         this.companyVisible = true;
      },
      async checkFirstClass() { //获取一级列表
        if(this.fromdata.shopType.id){
           let payload = {shopid:this.fromdata.shopType.id};
           let res = await getlistParentTypeFun(qs.stringify(payload));
           if(res.code === 0) {
             this.functionList = res.data; 
            }
          this.parentType = true;
        }else{
          MessageBox.alert("请先选择店铺");
        }
      },
      async checkSecondClass() { //获取二级列表
         if(this.fromdata.shopType.id && this.fromdata.firstType.id) {
           let payload = {shopid:this.fromdata.shopType.id,parentTypeId:this.fromdata.firstType.id};
           let res = await getlistSubTypeFun(qs.stringify(payload));
           if(res.code === 0) {
             this.funList = res.data; 
            }
          this.subType = true;
        }else{
          MessageBox.alert("请先选择店铺或者类型");
        }
      },
      async getFunctionSetList() {  //获取功能列表数据
        let payload = {subTypeId: this.fromdata.secondType.id,shopId: this.fromdata.shopType.id} ;     
        let res = await getFunctionSetListFun(qs.stringify(payload));
         if(res.code === 0) {
           this.functionTempletType = res.data.functionTempletType;
           this.getJsonArr = res.data.list;
           if(res.data.communicateType === 1){
             this.functionListTitle = this.functionListTitle2;
             this.isShow = false;            
           } 
          res.data.list.forEach(item=>{
            item.ifOpen=item.ifOpen === "0"?(!!item.ifOpen) : (!item.ifOpen);
          });
            this.functionSetList = res.data.list;
        }
        else {
          MessageBox.alert(res.msg);
        }
      },
      async submit() {  //提交
        this.getJsonArr = this.functionSetList;
        this.getJsonArr.forEach(item=>{
            item.ifOpen=item.ifOpen?0:1;
          });
        let obj = {
          machineName: this.fromdata.machineName,
          shopId: this.fromdata.shopType.id,
          parentTypeId: this.fromdata.firstType.id,
          subTypeId: this.fromdata.secondType.id,
          nqt: this.fromdata.nqt,
          company: "youfang",
          communicateType: 1,
          ver: 3,
          imei: this.fromdata.imei,
          functionTempletType: this.functionTempletType,
          functionJson: JSON.stringify(this.getJsonArr)
        };
        let res = await deviceAddorEditFun(qs.stringify(obj));
        if(res.code===0) {
          this.$router.push({name: 'deviceMange'});
        }

      },
      toFunctionSeting() { //切换到功能列表
        if(this.fromdata.shopType.id && this.fromdata.firstType.id && this.fromdata.secondType.id) {
          this.getFunctionSetList();
          this.setModelShow= true;
          this.modelShow = false;
          this.title = "功能列表";
        }else{
          MessageBox.alert("请先选择上级列表");
        }
       
      },
      goFirst(){ //功能列表确认
        MessageBox.confirm('您确定要更改吗？').then(action => {       
          this.setModelShow= false;
          this.modelShow = true;
          this.title = "新增设备";
        });
      },
      goBack(){ //功能列表返回
       this.setModelShow= false;
       this.modelShow = true;
       this.title = "新增设备";
      }


    },
    created() {
        this.initWechat();
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
