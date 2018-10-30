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
              <p class="select-2" @click="wxScanNqt">
                <span>{{fromdata.nqt}}</span>
              </p>
            </li>
            <li>
              <span class="field-title">IMEI</span>
              <p class="select-2" @click="wxScanImei">
                <span>{{fromdata.imei}}</span>
              </p>
            </li>
             <li @click="checkWaterLevel" v-show="waterLevelShow">
              <span class="field-title">水位设置</span>
              <p class="select"><span>{{fromdata.waterLevel}}</span></p>
            </li>
            <li @click="toFunctionSeting">
              <span class="field-title">功能设置</span>
              <p class="select"><span>已设置</span></p>
            </li>
          </ul>
        </li>

      </ul>
    <button class="submitBtn" @click.prevent="submit">提交</button>
    </div>
    <!--功能列表-->
    <div v-show="setModelShow">
      <section class="fun-item-hd">
        <div>
          <p><span>功能</span></p>
          <p v-if="fromdata.secondType.name !== '通用脉冲充电桩'"><span>耗时</span><span>/分</span></p>
          <p><span>原价</span><span>/元</span></p>
          <p v-if="Number(fromdata.communicateType) === 0"><span>脉冲数</span></p>
          <p><span>状态</span></p>
        </div>
      </section>
      <section class="fun-item-bd funlist">
        <div v-for="(item,index) in functionList" :key="index">
          <span class="fun-list-item">{{item.functionName}}</span>
          <input type="text" pattern="\d*" @keypress="userinputFunc" class="fun-list-item" v-model="item.needMinutes"  v-if="fromdata.secondType.name !=='通用脉冲充电桩' " />
          <input type="text" class="fun-list-item" v-model="item.functionPrice"/>
          <input type="text" @keypress="userinputFunc" pattern="\d*" class="fun-list-item" v-model="item.functionCode" v-if="Number(fromdata.communicateType) === 0"/>
          <p class="fun-list-item">
            <mt-switch v-model="item.ifOpen"></mt-switch>
          </p>
        </div>
      </section>
      <div style="width:100%;height:1.73rem;"></div>
      <section class="promiss-footer">
        <span class="can" @click="goBack">取消</span>
        <span class="cifrm" @click="goNext" :class="{'default':isDisable}" :disabled="isDisable">确定</span>
      </section>
    </div>
    <!-- 店铺-->
    <selectpickr :visible="companyVisible" :slots="slotsShop" :valueKey="shopname" @selectpicker="machineselectpickerShop" @onpickstatus="machineselectpickertatusShop" :title="'选择店铺'"> </selectpickr>
    <!-- 水位-->
    <selectpickr :visible="waterLevelVisible" :slots="slotsWaterLevel" :valueKey="shopname" @selectpicker="machineselectpickerWaterLevel" @onpickstatus="machineselectpickertatusWaterLevel" :title="'水位设置'"> </selectpickr> 
  </section>
</template>

<script>
  import Api from '@/utils/Api';
  import Web from '@/utils/Web';
  import { MessageBox } from 'mint-ui';
  import selectpickr from '@/components/selectPicker';
  import {getWxconfigFun,detailDeviceListFun,getShopFun,deviceAddorEditFun } from '@/service/device';
  export default {
    data() {
      return {
        setModelShow: false,
        isShow2: false,
        modelShow: true,
        companyVisible: false,
        waterLevelVisible: false,
        waterLevelShow: false,
        parentType: false,    
        subType: false,
        functionTempletType: null,
        selectedIndex: -1,
        itemName:["functionName","needMinutes","functionPrice","ifOpen"],
        functionSetList: [],
        jsonArr: [],
        getJsonArr: [],
        keepInitializationArr: [],
        keepFunctionArr: [],
        title: '编辑设备',
        slotsShop: [
        {
          flex: 1,
          values: [],
          className: 'shop-type',
          textAlign: 'center',
          position:'bottom',
          name:'店铺类型'
        }
        ],
        slotsWaterLevel: [
        {
          flex: 1,
          values: ['极低水位','低水位','中水位','高水位'],
          className: 'shop-type',
          textAlign: 'center',
          position:'bottom',
          defaultIndex: 2,
          name:'水位设置'
        }
        ],
        shopname: "shopName",
        fromdata: {
          machineId: "",
          functionTempletType: "",
          machineName: "",
          firstClass: "",
          secondClass: "",
          company: "",
          communicateType: "",
          ver: "",
          waterLevel: "未设置",
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
        selectListA: [],
        functionList: [],
        funList: [],
        isDisable: false,
        nullDisable: false,
        timeIsDisable: false,
        priceIsDisable: false,
        codeIsDisable: false,
        deviceDetail: []
      };
    },
    methods: {
      async checkDeviceSelect() { //获取店铺数据
        let res = await getShopFun();
        this.slotsShop[0].values = res;
        this.companyVisible = true;
      },
      machineselectpickerShop(data){ //获取店铺
        this.fromdata.shopType.id = data.shopId;
        this.fromdata.shopType.name = data.shopName;
      },
      machineselectpickertatusShop(data){
        this.companyVisible = data;
      },
      async checkWaterLevel() {
        this.waterLevelVisible = true;
      },
      machineselectpickerWaterLevel(data){ //获取水位
        this.fromdata.waterLevel = data;
      },
      machineselectpickertatusWaterLevel(data){ 
        this.waterLevelVisible = data;
      },
      userinputFunc() {  //只能输入数字
        let keyCode = event.keyCode; 
        if (keyCode >= 48 && keyCode <= 57) { 
          event.returnValue = true; 
        }else { 
          event.returnValue = false; 
        }
      },
      wxScanNqt() { //微信扫码NQT
         Web.scanQRCode(res => {
          let url = res;
          let parameter = url.substring(0,4);
          if(parameter == "http"){           
            let object = url.split("?")[1];
            let nqt = this.getUrlParam(object,"NQT");
            let company = this.getUrlParam(object,"Company");
            let communicateType= this.getUrlParam(object,"CommunicateType");
            let ver = this.getUrlParam(object,"Ver")?this.getUrlParam(object,"Ver"):0;
            if(Number(communicateType) === Number(this.fromdata.communicateType)){
              this.fromdata.nqt = nqt;
              this.fromdata.company = company;
              this.fromdata.smCommunicateType = communicateType;
              this.fromdata.ver = ver;
            }else {
              this.$toast({message: "NQT与设备型号通信类型不符" });
              return false;
            }
          }else{
            this.$toast({message: "请扫描正确的NQT码" });
            return false;
          } 
				});
      },

      wxScanImei() { //微信扫码Imei
        Web.scanQRCode(res => {
          let url = res;
          let parameter = url.substring(0,4);
          if(parameter !== "http"){           
            this.fromdata.imei = url;
          }else{
            this.$toast({message: "请扫描正确的IMEI码" });
            return false;
          } 
				});       
      },
       getUrlParam(url,name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        let r = url.match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
      },
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
        this.functionList = res.functionList;
        this.waterLevelShow = res.subTypeName === "海尔5/6/7公斤波轮SXB60-51U7/SXB70-51U7"?true:false;
        this.fromdata.waterLevel = res.waterLevel?res.waterLevel:"未设置";     
        this.functionList.forEach(item=>{
          item.ifOpen=item.ifOpen === "0"?(!!item.ifOpen) : (!item.ifOpen);
        });
        this.keepFunctionArr= [].concat(JSON.parse(JSON.stringify(this.functionList)));
        this.keepInitializationArr = [].concat(JSON.parse(JSON.stringify(this.functionList)));

      }, 

      async submit() {  //提交
        console.log("11");
        if(!this.fromdata.machineName) {
          let instance = this.$toast({
            message: '请填写机器名称'
            });
          setTimeout(() => {
            instance.close();
            }, 2000);
          return false;
        }
        if(!this.fromdata.shopType.id) {
          let instance = this.$toast({
            message: '请选择所属店铺'
          });
          setTimeout(() => {
            instance.close();
            }, 2000);
          return false;
        }
        if(this.fromdata.nqt== "点击扫描设备上二维码") {
          let instance = this.$toast({
            message: '请扫描设备上的NQT码'
          });
          setTimeout(() => {
            instance.close();
            }, 2000);
          return false;
        }
        if(this.fromdata.imei== "点击扫描模块上二维码") {
          let instance = this.$toast({
            message: '请扫描模块上的IMEI码'
          });
          setTimeout(() => {
            instance.close();
            }, 2000);
          return false;
        }

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
        let res = await deviceAddorEditFun(obj);
        let instance = this.$toast({
          message: '编辑成功',
          iconClass: 'mint-toast-icon mintui mintui-success'
        });
        setTimeout(() => {
          instance.close();
          this.$router.push({name:'deviceMange'});
          }, 2000);
      },

      toFunctionSeting() { //切换到功能列表
        if(!this.fromdata.company && !this.fromdata.communicateType) {
          this.$toast("请扫描NQT码");
          return false;
        } 
        if(this.keepFunctionArr.length >0 ) {
          let arr = [].concat(JSON.parse(JSON.stringify(this.keepFunctionArr))); 
          this.functionList = arr;       
        } 
        this.setModelShow= true;
        this.modelShow = false;          
      },
      goNext(){ //功能列表确认
        let flag1 = true;
        let flag2 = true;
        let flag3 = true;
        let flag4 = true;
        let count = 0;
        let len = this.functionList.length;
        let reg = /^\+?[1-9][0-9]*$/; //非0正整数
        let reg1 = /^[0-9]+([.]{1}[0-9]{1,2})?$/; //可以0带二位小数的正整数
        let reg2 = /^[1-9]+([.]{1}[0-9]{1,2})?$/; //不可以0带二位小数的正整数
        for(let i = 0;i < len;i++){
          let item = this.functionList[i];
          if(item.ifOpen === false){
            count=count+1;
            item.needMinutes = this.keepInitializationArr[i].needMinutes;
            item.functionPrice = this.keepInitializationArr[i].functionPrice;
            item.functionCode = this.keepInitializationArr[i].functionCode;
            continue;
          } 
          if(this.fromdata.secondType.name !== '通用脉冲充电桩' && !reg.test(Number(item.needMinutes))){
            this.$toast("耗时填写格式错误，请填写非0的非空正整数");
            flag1 = false;
            break;
          }
          if(this.fromdata.secondType.name !== '通用脉冲充电桩' && String(item.needMinutes).indexOf('.')>-1){
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
          if(Number(this.fromdata.communicateType)=== 0 && !reg.test(Number(item.functionCode))){
            flag3 = false;
            this.$toast("脉冲填写格式错误，请填写非0非空正整数");
            break;
          }
          if(Number(this.fromdata.communicateType)=== 0 && String(item.functionCode).indexOf('.')>-1){
            flag3 = false;
            this.$toast("脉冲填写格式错误，请填写非0非空正整数");
            break;
          }                             
        }
        if(count == len){
          flag4 = false;
          this.$toast("请至少开启1个设备功能");
        } 
        if(flag1 && flag2 && flag3 && flag4){
          this.setModelShow= false;
          this.modelShow = true;
          this.title = "编辑设备";
          this.keepFunctionArr = [].concat(JSON.parse(JSON.stringify(this.functionList)));
        }
      },
      goBack(){ //功能列表返回
       this.setModelShow= false;
       this.modelShow = true;
       this.title = "编辑设备";
      }


    },
    created() {
      this.getDetailDevice();
    },
    components: {
      selectpickr
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
            height: 0.51rem;
            background: url("../../../../static/image/center/icon_scon.png") no-repeat right;
            background-size: 0.51rem 0.51rem;
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
    line-height: 1.6rem; // padding: 0 .4rem;
    font-size: 0.37rem;
    color: #333333;
    background: #fff;
    padding: 1.6rem 0.4rem 0 0.4rem;
    div {
      display: flex; // justify-content: space-between;
      border-bottom: 1px solid #f9f8ff;
      &:last-child {
        border-bottom: none;
      }
      input {
        text-decoration: underline;
      }
      .fun-list-item {
        flex: 2.19;
        text-align: center;
        line-height: 1.6rem;
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
      p {
        display: flex;
        justify-content: center;
        align-items: center;
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
    .promiss-footer .default {
      opacity: 0.6;
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
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .selected {
        background-color: rgba(14, 14, 255, 0.05);
      }
    }
  }
  
</style>
<style>
  .mint-switch-input:checked + .mint-switch-core {
    border-color: #4DD865;
    background-color: #4DD865;
  }
</style>
