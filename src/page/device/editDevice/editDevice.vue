<template>
  <section v-title="title">
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
              <p class="select"><span>{{fromdata.shopType.name}}</span></p>
            </li>
            <li>
              <span class="field-title">NQT</span>
              <p class="select-2" @click="wxScan">
                <span>{{fromdata.nqt}}</span>
              </p>
            </li>
            <li>
              <span class="field-title">IMEI</span>
              <p class="select-2" @click="wxScan">
                <span>{{fromdata.imei}}</span>
              </p>
            </li>
            <li @click="toFunctionSeting">
              <span class="field-title">功能设置</span>
              <p class="select"><span>已设置</span></p>
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
      <div v-for="(item,index) in functionList" :key="index">
        <span class="fun-list-item" title="item.functionName">{{item.functionName}}</span>
        <input type="text" class="fun-list-item" v-model.lazy="item.needMinutes"/>
        <input type="text" class="fun-list-item" v-model.lazy="item.functionPrice"/>
        <input type="text" class="fun-list-item" v-model.lazy="item.functionPrice" v-show="isShow2"/>
        <p class="fun-list-item">
          <mt-switch v-model="item.ifOpen"></mt-switch>
        </p>
      </div>
    </section>
    <div style="width:100%;height:1.73rem;"></div>
    <section class="promiss-footer">
      <span class="can" @click="goBack">上一步</span>
      <span class="cifrm" @click="goNext">下一步</span>
    </section>
    </div>
    <!-- 店铺-->
    <mt-popup v-model="companyVisible" position="bottom">
      <div class="resp-shop">
        <span class="quxi" @click="companyVisible= false">取消</span>
        <span class="shop">店铺</span>
        <span class="qued" @click="getCheckShop">确定</span>
      </div>
      <section class="resp-shop-wrap">
        <ul class="all-list">
          <li class="mint-checklist-label" :class="{'selected':index==selectedIndex}" v-for="(item,index) in selectListA" :key="index" @click="checkItem(index)">{{item.shopName}}</li>
        </ul>
      </section>
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
  import {
    Actionsheet
  } from "mint-ui";
  import AddCount from "@/components/AddCount/AddCount";
  import {getWxconfigFun,detailDeviceListFun,getShopFun,deviceAddorEditFun } from '@/service/device';
 


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
        selectedIndex: -1,
        itemName:["functionName","needMinutes","functionPrice","ifOpen"],
        functionSetList: [],
        jsonArr:[],
        getJsonArr:[],
        functionListTitle: [
          ['功能'],
          ['耗时', '/分'],
          ['原价', '/元'],
          ['状态']
        ],
        functionListTitle2: [
          ['功能'],
          ['耗时', '/分'],
          ['原价', '/元'],
          ['状态']
        ],
        title: '编辑设备',
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
            name: "",
            value: ""
          },
          secondType: {
            name: "",
            value: ""
          },
          functionType: {
            name: "未设置",
            value: ""
          },
          nqt: "",
          imei: ""
        },
        selectListA: [],
        functionList: [],
        funList: [],
        deviceDetail: []
      };
    },
    methods: {
      checkItem(index) {
        this.selectedIndex = index;
      },
      getCheckShop() {
        this.fromdata.shopType.name = this.selectListA[this.selectedIndex].shopName;
        this.fromdata.shopType.id = this.selectListA[this.selectedIndex].shopId;
        this.companyVisible = false;
      },
      wxScan() { //微信扫码
         Web.scanQRCode(res => {
          let url = res;
          let parameter = url.substring(0,4);
          if(parameter == "http"){           
            let object = url.split("?")[1];
            let nqt = this.getUrlParam(object,"NQT");
            let company = this.getUrlParam(object,"Company");
            let communicateType= this.getUrlParam(object,"CommunicateType");
            let ver = this.getUrlParam(object,"Ver")?this.getUrlParam(object,"Ver"):0;
            this.fromdata.nqt = nqt;
            this.fromdata.company = company;
            this.fromdata.communicateType = communicateType;
            this.fromdata.ver = ver;
          }else{
            this.fromdata.imei= res;
          } 
				});
      },
       getUrlParam(url,name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        let r = url.match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
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
      async getDetailDevice() {  //获取数据
        let payload = { machineId: this.$route.query.machineId} ;     
        let res = await detailDeviceListFun(qs.stringify(payload));
         if(res.code === 0) {
          this.fromdata.machineName = res.data.machineName;
          this.fromdata.machineId = res.data.machineId;
          this.fromdata.shopType.name = res.data.shopName;
          this.fromdata.shopType.id = res.data.shopId;
          this.fromdata.firstType.id = res.data.parentTypeId;
          this.fromdata.secondType.id = res.data.subTypeId;
          this.fromdata.functionTempletType = res.data.functionTempletType;
          this.fromdata.company = res.data.company;
          this.fromdata.ver = res.data.ver;
          this.fromdata.communicateType = res.data.communicateType;
          this.fromdata.nqt = res.data.nqt;
          this.fromdata.imei = res.data.imei;
          this.functionList = res.data.functionList;
          this.functionList.forEach(item=>{
            item.ifOpen=item.ifOpen === "0"?(!!item.ifOpen) : (!item.ifOpen);
          });
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

      async submit() {  //提交
          let arr= [].concat(JSON.parse(JSON.stringify(this.functionList))); 
          arr.forEach(item=>{
            return item.ifOpen=item.ifOpen?0:1;
          });
          let obj = {
            machineId: this.fromdata.machineId,
            machineName: this.fromdata.machineName,
            shopId: this.fromdata.shopType.id,
            parentTypeId: this.fromdata.firstType.id,
            subTypeId: this.fromdata.secondType.id,
            nqt: this.fromdata.nqt,
            company: this.fromdata.company,
            communicateType: this.fromdata.communicateType,
            ver: this.fromdata.ver,
            imei: this.fromdata.imei,
            functionTempletType: this.fromdata.functionTempletType,
            functionJson: JSON.stringify(arr)
          };
          let res = await deviceAddorEditFun(qs.stringify(obj));
          if(res.code===0) {
            let instance = this.$toast({
              message: '编辑成功',
              iconClass: 'mint-toast-icon mintui mintui-success'
            });
            setTimeout(() => {
              instance.close();
              this.$router.push({name:'deviceMange'});
              }, 2000);
          }else {
            this.$toast(res.msg);
          }
      },

      toFunctionSeting() { //切换到功能列表
          this.setModelShow= true;
          this.modelShow = false;
          this.title = "功能列表";
      },
      goNext(){ //功能列表确认
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
      }


    },
    created() {
        this.initWechat();
        this.getDetailDevice();
    },
    components: {
      Actionsheet,
      AddCount,
      Button,
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
          display: flex;
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
          p {
            display: flex;
            span {
              margin-right: 10px;
              flex-grow: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .select,
          .select-1,
          .select-2 {
            border: 0;
            width: 70%;
            margin: 0;
            text-align: right;
            box-sizing: border-box;
            float: left;
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
    height: 1.33rem;
    line-height: 1.33rem;
    background-color: #1890FF;
    color: #fff;
    font-size: 0.48rem;
  }
  
  .fun-item-hd {
    padding: 0;
    background: #FAFCFF;
    color: #1890FF;
    font-size: 0.37rem;
    padding: .6rem .4rem;
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
    padding: 0 0.4rem;
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
   

  .resp-shop {
    display: flex;
    height: 1.17rem;
    line-height: 1.17rem;
    background:rgba(251,251,252,1);
    padding: 0 0.4rem;
    >span {
      flex: 1;
      font-size: 15px;
    }
    .quxi {
      color: #999;
    }
    .shop {
      text-align: center;
      font-size: 16px;
    }
    .qued {
      text-align:right;
      color: #1890FF;
    }
  }

  .resp-shop-wrap {
    padding: 0.4rem 0.2rem;
    .all-list {
      height: 6rem;
      overflow-y: scroll;
      .mint-checklist-label {
        padding: 0 0.4rem;
        text-align: center;
        height: 1.17rem;
        line-height: 1.17rem;
        font-size: 0.4rem;
      }
      .selected {
        background-color: rgba(14, 14, 255, 0.05);
      }
    }
  }
</style>
