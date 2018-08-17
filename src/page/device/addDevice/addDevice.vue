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
                <input type="text" v-model="fromdata.machineName" ref="machineNameInput">
              </p>
            </li>
            <li @click="checkDeviceSelect">
              <span class="field-title">所属店铺</span>
              <p class="select"><span>{{fromdata.shopType.name}}</span></p>
            </li>
            <li @click="checkFirstClass">
              <span class="field-title">设备类型</span>
              <p class="select"><span>{{fromdata.firstType.name}}</span></p>
            </li>
            <li @click="checkSecondClass">
              <span class="field-title">设备型号</span>
              <p class="select"><span>{{fromdata.secondType.name}}</span></p>
            </li>
            <li>
              <span class="field-title">NQT</span>
              <p class="select-2" @click="wxScan">
                <span class="fontColor">{{fromdata.nqt}}</span>
              </p>
            </li>
            <li>
              <span class="field-title">IMEI</span>
              <p class="select-2" @click="wxScan">
                <span class="fontColor">{{fromdata.imei}}</span>
              </p>
            </li>
            <li @click="toFunctionSeting">
              <span class="field-title">功能设置</span>
              <p class="select"><span>{{fromdata.functionType.name}}</span></p>
            </li>
          </ul>
        </li>
      </ul>
    <button class="submitBtn" @click="submit" :class="{'default':!fromdata.machineName}" :disabled="!fromdata.machineName">提交</button>
    </div>
    <!--功能列表-->
    <div v-show="setModelShow">
    <section class="fun-item-hd">
      <div>
        <p v-for="(item,index) in functionListTitle2 " :key="index">
          <span v-for="(it,idx) in item " :key="idx">{{it}}</span>
        </p>
      </div>
    </section>
    <section class="fun-item-bd funlist" style="-webkit-overflow-scrolling:touch;overflow-y:scroll;">
      <div v-for="(item,index) in functionSetList" :key="index">
        <span class="fun-list-item">{{item.functionName}}</span>
        <input type="tel" class="fun-list-item" v-model="item.needMinutes"   min=0/>
        <input type="number" class="fun-list-item" v-model="item.functionPrice"  min=0/>
        <input type="tel" class="fun-list-item" v-model="item.functionCode" v-if="isShow2"  min=0/>
        <p class="fun-list-item">
          <mt-switch v-model="item.ifOpen"></mt-switch>
        </p>
      </div>
      
    </section>
    <div style="width:100%;height:1.73rem;"></div>
    <section class="promiss-footer">
      <span class="can" @click="goBack">取消</span>
      <span class="cifrm" @click="goNext" :class="{'default':isDisable}" :disabled="isDisable">确认</span>
    </section>
    </div>
    <selectpickr :visible="companyVisible" :slots="slotsShop" :valueKey="shopname" @selectpicker="machineselectpickerShop" @onpickstatus="machineselectpickertatusShop" :title="'选店铺'"> </selectpickr>
    <selectpickr :visible="parentType" :slots="slotsFirst" :valueKey="firstname" @selectpicker="machineselectpickerFirst" @onpickstatus="machineselectpickertatusFirst" :title="'设备类型'"> </selectpickr>
    <selectpickr :visible="subType" :slots="slotsFun" :valueKey="firstname" @selectpicker="machineselectpickerFun" @onpickstatus="machineselectpickertatusFun" :title="'设备型号'"> </selectpickr>
  </section>
</template>

<script>
  import qs from "qs";
  import Api from '@/utils/Api';
  import Web from '@/utils/Web';
  import { MessageBox } from 'mint-ui';
  import Button from "@/components/Button/Button";
  import QHeader from '@/components/header';
  import { Actionsheet } from "mint-ui";
  import AddCount from "@/components/AddCount/AddCount";
  import selectpickr from '@/components/selectPicker';
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
        selectedIndex: -1,
        itemName:["functionName","needMinutes","functionPrice","ifOpen"],
        functionSetList: [],
        getJsonArr:[],
        ok: true,
        isDisable: false,
        nullDisable: false,
        timeIsDisable: false,
        priceIsDisable: false,
        codeIsDisable: false,
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
         slotsFirst: [
        {
          flex: 1,
          values: [],
          className: 'shop-type',
          textAlign: 'center',
          position:'bottom',
          name:'店铺类型'
        }
        ],
         slotsFun: [
        {
          flex: 1,
          values: [],
          className: 'shop-type',
          textAlign: 'center',
          position:'bottom',
          name:'店铺类型'
        }
        ],
        shopname: "shopName",
        firstname: 'name',
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
          communicateType: "",
          smCommunicateType: "",
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
          ver: '',
          nqt: '点击扫描设备上二维码',
          imei: '点击扫描模块上二维码',
          companyVisible: '',
          company: ''
        },
        selectListA: [],
        functionList: [],
        funList: [],
      };
    },
    methods: {
      machineselectpickerShop(data){ //获取店铺
        this.fromdata.shopType.id = data.shopId;
        this.fromdata.shopType.name = data.shopName;
      },
      machineselectpickertatusShop(data){
        this.companyVisible = data;
      },
      machineselectpickerFirst(data){ //获取一级类型
        this.fromdata.firstType.id = data.id;
        this.fromdata.firstType.name = data.name;
      },
      machineselectpickertatusFirst(data){
        this.parentType = data;
      },
      machineselectpickerFun(data){ //获取二级类型
        this.fromdata.secondType.id = data.id;
        this.fromdata.secondType.name = data.name;
      },
      machineselectpickertatusFun(data){
        this.subType = data;
      },
      getCheckShop() {
        if(this.fromdata.shopType.name !== this.selectListA[this.selectedIndex].shopName){
          this.fromdata.shopType.name = this.selectListA[this.selectedIndex].shopName;
          this.fromdata.shopType.id = this.selectListA[this.selectedIndex].shopId;
          this.fromdata.secondType.name = "";
          this.fromdata.secondType.id = "";
          this.functionSetList = [];
          this.fromdata.functionType.name = "未设置";
        }else{
          this.fromdata.shopType.name = this.selectListA[this.selectedIndex].shopName;
          this.fromdata.shopType.id = this.selectListA[this.selectedIndex].shopId;
        }
        this.companyVisible = false;
      },
      getFirstValue() {
        if(this.fromdata.firstType.name !== this.functionList[this.selectedIndex].name){
          this.fromdata.firstType.name = this.functionList[this.selectedIndex].name;
          this.fromdata.firstType.id = this.functionList[this.selectedIndex].id;
          this.fromdata.secondType.name = "";
          this.fromdata.secondType.id = "";
          this.functionSetList = [];
          this.fromdata.functionType.name = "未设置";
        }else{
          this.fromdata.firstType.name = this.functionList[this.selectedIndex].name;
          this.fromdata.firstType.id = this.functionList[this.selectedIndex].id;
        }
        this.parentType = false;
      },
      getSecondValue() {
        if(this.fromdata.secondType.name !== this.funList[this.selectedIndex].name){
          this.fromdata.secondType.name = this.funList[this.selectedIndex].name;
          this.fromdata.secondType.id = this.funList[this.selectedIndex].id;
          this.functionSetList = [];
          this.fromdata.functionType.name = "未设置";
          
        }else{
          this.fromdata.secondType.name = this.funList[this.selectedIndex].name;
          this.fromdata.secondType.id = this.funList[this.selectedIndex].id;
        }
        this.subType = false;
      },
      wxScan(name) { //微信扫码
        Web.scanQRCode(res => {
          let url = res;
          let parameter = url.substring(0,4);
          if(parameter == "http"){           
            let object = url.split("?")[1];
            this.fromdata.nqt = this.getUrlParam(object,"NQT");
            this.fromdata.company = this.getUrlParam(object,"Company");
            this.fromdata.smCommunicateType = this.getUrlParam(object,"CommunicateType");
            this.fromdata.ver = this.getUrlParam(object,"Ver")?this.getUrlParam(object,"Ver"):0;
            if(Number(this.fromdata.smCommunicateType) === 0){
              this.functionListTitle2 = this.functionListTitle;
              this.isShow2 = true;
            }
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
      async checkDeviceSelect() { //获取店铺
        let res = await getShopFun();
        if(res.code === 0) {
          this.slotsShop[0].values = res.data;
          this.companyVisible = true;
        }
        
      },
      async checkFirstClass() { //获取一级列表
        if(this.fromdata.shopType.id){
           let payload = {shopid:this.fromdata.shopType.id};
           let res = await getlistParentTypeFun(qs.stringify(payload));
           if(res.code === 0) {
             this.slotsFirst[0].values = res.data;
            }
            this.parentType = true;
            
        }else{
          this.$toast("请先选择店铺"); //MessageBox.alert
          return false;
        }
      },
      async checkSecondClass() { //获取二级列表
         if(this.fromdata.shopType.id && this.fromdata.firstType.id) {
           let payload = {shopid:this.fromdata.shopType.id,parentTypeId:this.fromdata.firstType.id};
           let res = await getlistSubTypeFun(qs.stringify(payload));
           if(res.code === 0) {
             this.slotsFun[0].values = res.data;
            }
           this.subType = true;
        }else{
          this.$toast("请先选择类型");
          return false;
        }
      },
      async getFunctionSetList() {  //获取功能列表数据
        if(!this.functionSetList.length){
          let payload = {subTypeId: this.fromdata.secondType.id,shopId: this.fromdata.shopType.id} ;     
          let res = await getFunctionSetListFun(qs.stringify(payload));
          if(res.code === 0) {
            this.functionTempletType = res.data.functionTempletType;
            this.functionSetList = res.data.list;
            this.fromdata.functionType.name = "已设置";
            this.fromdata.communicateType = res.data.communicateType;
            this.functionSetList.forEach(item=>{
              item.ifOpen=item.ifOpen === 0?(!item.ifOpen) : (!!item.ifOpen);
            });
            if(Number(this.fromdata.communicateType)=== Number(this.fromdata.smCommunicateType)){
               this.setModelShow= true;
               this.modelShow = false;
               this.title = "功能列表";
            }else{
               this.$toast("您扫描的二维码和您选择的设备型号不一致");
               return false;
            }             
          }
          else {
            this.$toast(res.msg);
          }
        }
      },
      async submit() {  //提交
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
        if(!this.fromdata.firstType.id) {
          let instance = this.$toast({
            message: '请选择设备类型'
          });
          setTimeout(() => {
            instance.close();
            }, 2000);
          return false;
        }
        if(!this.fromdata.secondType.id) {
           let instance = this.$toast({
            message: '请选择设备型号'
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
        if(!this.functionSetList) {
          let instance = this.$toast({
            message: '请设置功能列表'
          });
          setTimeout(() => {
            instance.close();
            }, 2000);
          return false;
        }
        let arr= [].concat(JSON.parse(JSON.stringify(this.functionSetList))); 
        arr.forEach(item=>{
          return item.ifOpen=item.ifOpen?0:1;
        });
        let obj = {
          machineName: this.fromdata.machineName,
          shopId: this.fromdata.shopType.id,
          parentTypeId: this.fromdata.firstType.id,
          subTypeId: this.fromdata.secondType.id,
          nqt: this.fromdata.nqt,
          company: this.fromdata.company,
          communicateType: this.fromdata.communicateType,
          ver: this.fromdata.ver,
          imei: this.fromdata.imei,
          functionTempletType: this.functionTempletType,
          functionJson: JSON.stringify(arr)
        };
        let res = await deviceAddorEditFun(qs.stringify(obj));
        if(res.code===0) {
          let instance = this.$toast({
            message: '新增设备成功',
            iconClass: 'mint-toast-icon mintui mintui-success'
          });
          setTimeout(() => {
            instance.close();
            this.$router.push({name:'deviceMange'});
          }, 2000);
        }else {
          this.$toast((res.msg).toUpperCase());
        }

      },
      toFunctionSeting() { //切换到功能列表
        if(!this.fromdata.company && !this.fromdata.communicateType) {
          this.$toast("请扫描NQT码");
          return false;
        } 
        if(!this.fromdata.shopType.id && !this.fromdata.firstType.id && !this.fromdata.secondType.id ) {
          this.$toast("请先选择设备型号");
          return false;
        }
        this.getFunctionSetList();      
      },
      goNext(){ //功能列表确认
        let flag1 = true;
        let flag2 = true;
        let flag3 = true;
        let flag4 = true;
        let count = 0;
        let len = this.functionSetList.length;
        let reg = /^\+?[1-9][0-9]*$/; //非0正整数
        let reg1 = /^[0-9]+([.]{1}[0-9]{1,2})?$/; //可以0带二位小数的正整数
        let reg2 = /^[1-9]+([.]{1}[0-9]{1,2})?$/; //不可以0带二位小数的正整数
        for(let i = 0;i < len;i++){
          let item = this.functionSetList[i];
          if(item.ifOpen === false){
            count++;
          } 
          if(!reg.test(Number(item.needMinutes))){
            this.$toast("耗时填写格式错误，请填写非0的非空正整数");
            flag1 = false;
            break;
          }
          if(item.functionPrice==='' || !reg1.test(Number(item.functionPrice))){          
            this.$toast("原价填写格式错误，请输入非空正整数，最多2位小数");
             flag2 = false;
            break;
          }
          if(Number(this.fromdata.communicateType)=== 0 && !reg.test(Number(item.functionCode))){
            flag3 = false;
            this.$toast("脉冲填写格式错误，请填写非0非空正整数");
            break;
          }
          if(count == len){
            flag4 = false;
            this.$toast("请至少开启1个设备功能");
            break;
          }                   
               
        }
        if(flag1 && flag2 && flag3 && flag4){
          this.setModelShow= false;
          this.modelShow = true;
          this.title = "新增设备";
        }
      },
      goBack(){ //功能列表返回
       this.setModelShow= false;
       this.modelShow = true;
       this.title = "新增设备";
      },
      stop(){
        var mo=function(e){e.preventDefault();};
        document.body.style.overflow='hidden';
        document.addEventListener("touchmove",mo,false);//禁止页面滑动
      },
      /***取消滑动限制***/
      move(){
        var mo=function(e){e.preventDefault();};
        document.body.style.overflow='';//出现滚动条
        document.removeEventListener("touchmove",mo,false);
      }


    },
    created() {

    },
    components: {
      Actionsheet,
      AddCount,
      Button,
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
              padding-right: 0.1rem;
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
            .fontColor {
              color:rgba(153,153,153,1)
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
    position: absolute;
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
    padding-top: 1.6rem;
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
