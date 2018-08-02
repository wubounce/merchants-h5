<template>
  <section>
    <q-header :title="title"></q-header>
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
          <!-- <li @click="getCompany">
            <span class="field-title">公司</span>
            <p class="select">{{fromdata.companyType.name}}</p>
          </li> -->

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
  import { getWxconfigFun,getShopFun,getlistParentTypeFun,getlistSubTypeFun,deviceAddorEditFun } from '@/service/device';
 


  export default {
    data() {
      return {
        companyVisible: false,
        parentType: false,
        isOpenArr:[{"functionId":"7e044cce-1d58-4bff-ab3c-33f195d03b8d","functionName":"单脱","needMinutes":5,"functionPrice":1.0,"ifOpen":0},{"functionId":"23a53227-5d3f-461e-a777-9e9dafd6a289","functionName":"快洗","needMinutes":25,"functionPrice":2.0,"ifOpen":0},{"functionId":"dd9222c6-2f3d-42b8-aa60-4e67a3247cc6","functionName":"标准洗","needMinutes":35,"functionPrice":3.0,"ifOpen":0},{"functionId":"349d4422-f0b9-4f45-a696-ad406fe811f0","functionName":"超净洗","needMinutes":45,"functionPrice":4.0,"ifOpen":0},{"functionId":"2330a3eb-788e-4eb5-88df-5bac3277ada1","functionName":"加温洗","needMinutes":50,"functionPrice":5.0,"ifOpen":0}],
        subType: false,
        title: '添加设备',
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
      wxScan(e, type) {
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
      async initWechat(){
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
      async checkDeviceSelect() {
        let res = await getShopFun();
         if(res.code === 0) {
          this.selectListA = res.data; 
         }
         this.companyVisible = true;
      },
      async checkFirstClass() {
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
      async checkSecondClass() {
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
      async submit() {
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
          functionTempletType: 3,
          functionJson: JSON.stringify(this.isOpenArr)
        };
        let res = await deviceAddorEditFun(qs.stringify(obj));
        if(res.code===0) {
          this.$router.push({name: 'deviceMange'});
        }

      },
      toFunctionSeting() {
        if(this.fromdata.shopType.id && this.fromdata.firstType.id && this.fromdata.secondType.id) {
          this.$router.push({
            name: 'functionSet',
            query: {
              subTypeId: this.fromdata.secondType.id,
              shopId: this.fromdata.shopType.id
            }
          });
        }else{
          MessageBox.alert("请先选择上级列表");
        }
       
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

</style>
