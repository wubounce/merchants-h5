<template>
  <section>
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
        <p><span>功能</span></p>
        <p v-if="fromdata.secondType.name !== '通用脉冲充电桩'"><span>耗时</span><span>/分</span></p>
        <p><span>原价</span><span>/元</span></p>
        <p v-if="Number(fromdata.communicateType) === 0"><span>脉冲数</span></p>
        <p><span>状态</span></p>
      </div>
    </section>
    <section class="fun-item-bd funlist" style="-webkit-overflow-scrolling:touch;overflow-y:scroll;">
      <div v-for="(item,index) in functionSetList" :key="index">
        <span class="fun-list-item">{{item.functionName}}</span>
        <input type="number" class="fun-list-item" v-model="item.needMinutes"  v-if="fromdata.secondType.name !== '通用脉冲充电桩'" min=0/>
        <input type="number" class="fun-list-item" v-model="item.functionPrice"  min=0/>
        <input type="number" class="fun-list-item" v-model="item.functionCode" v-if="Number(fromdata.communicateType) === 0"  min=0/>
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
    <!--型号-->
    <mt-popup v-model="subType2" position="bottom" :closeOnClickModal="false">
      <div class="resp-shop">
        <span class="quxi" @click="cancle">取消</span>
        <span class="shop">设备型号</span>
        <span class="qued" @click="sure">确定</span>
      </div>
      <section class="resp-shop-wrap">
        <div class="all-list">
          <div class="often">
           <p class="left-border"></p>
           <p class="title">常用</p>
          </div>
          <ul>
            <li class="mint-checklist-label" :class="{selected:index==selectIndex}" v-for="(item,index) in secondOnTypeList" :key="index" @click="selectOftenClick(index,item.name)">
              <p></p>
              <p class="mint-checkbox-label shopname">{{item.name}}</p>
              <p class="select"><span class="iconfont" :class="{'icon-xuanze':index==selectIndex}"></span></p>
            </li>
          </ul>
          <div class="often">
           <p class="left-border"></p>
           <p class="title">其他</p>
           <span class="iconfont icon-xiangshangjiantou" @click="otherShowClick" :class="{'rotate': otherShow}"></span>
          </div>
          <ul v-show="otherShow">
            <li class="mint-checklist-label" :class="{selected:index==selectIndex2}" v-for="(item,index) in secondOffTypeList" :key="index" @click="selectNoOftenClick(index,item.name)">
              <p></p>
              <p class="mint-checkbox-label shopname">{{item.name}}</p>
              <p class="select"><span class="iconfont" :class="{'icon-xuanze':index==selectIndex2}"></span></p>
            </li>
          </ul>
        </div>
      </section>
    </mt-popup>
  </section>
</template>

<script>
  import Api from '@/utils/Api';
  import Web from '@/utils/Web';
  import { MessageBox } from 'mint-ui';
  import Button from "@/components/Button/Button";
  import selectpickr from '@/components/selectPicker';
  import { getWxconfigFun,getShopFun,getlistParentTypeFun,listSubTypeByFun,deviceAddorEditFun,getFunctionSetListFun } from '@/service/device';
 
  export default {
    data() {
      return {
        setModelShow: false,
        isShow2: true,
        modelShow: true,
        companyVisible: false,
        parentType: false,    
        subType: false,
        subType2: false,
        functionTempletType: null,
        selectedIndex: -1,
        selectIndex: -1,
        selectIndex2: -1,
        otherShow: false,
        itemName:["functionName","needMinutes","functionPrice","ifOpen"],
        functionSetList: [],
        getJsonArr: [],
        secondTypeList: [],
        secondOnTypeList: [],
        secondOffTypeList: [],
        keepFunctionArr: [],
        ok: true,
        isDisable: false,
        nullDisable: false,
        timeIsDisable: false,
        priceIsDisable: false,
        codeIsDisable: false,
        subTypeName: '',
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
            id: ""
          },
          secondType: {
            name: "",
            id: ""
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
        if(this.fromdata.shopType.name !== data.shopName) {
          this.fromdata.shopType.id = data.shopId;
          this.fromdata.shopType.name = data.shopName;
          this.fromdata.functionType.name = "未设置";
          this.functionSetList = [];
          this.keepFunctionArr = [];
        }else {
          this.fromdata.shopType.id = data.shopId;
          this.fromdata.shopType.name = data.shopName;
        }
      },
      machineselectpickertatusShop(data){
        this.companyVisible = data;
      },
      machineselectpickerFirst(data){ //获取一级类型
        if(this.fromdata.firstType.name !== data.name){
          this.fromdata.firstType.id = data.id;
          this.fromdata.firstType.name = data.name;
          this.fromdata.secondType.name = '';
          this.fromdata.secondType.id = '';
          this.functionSetList = [];
          this.keepFunctionArr = [];
          this.fromdata.functionType.name = "未设置";
          this.subTypeName = "";
        }else{
          this.fromdata.firstType.id = data.id;
          this.fromdata.firstType.name = data.name;
        }
      },
      machineselectpickertatusFirst(data){
        this.parentType = data;
      },
      machineselectpickerFun(data){ //获取二级类型
        if(this.fromdata.secondType.name !== data.name){
          this.fromdata.secondType.id = data.id;
          this.fromdata.secondType.name = data.name;
          this.functionSetList = [];
          this.keepFunctionArr = [];
          this.fromdata.functionType.name = "未设置";
          this.subTypeName = "";
        }else {
          this.fromdata.secondType.id = data.id;
          this.fromdata.secondType.name = data.name;
        }
      },
      machineselectpickertatusFun(data){
        this.subType = data;
      },
      selectOftenClick: function (index,name) { //常用选中
        this.selectIndex2 = -1;
        this.selectIndex = index;
        this.fromdata.secondType.id = this.secondOnTypeList[index].id;
        this.subTypeName = this.secondOnTypeList[index].name;
        this.functionSetList = [];
        this.keepFunctionArr = [];
        this.fromdata.functionType.name = "未设置";
      },
      selectNoOftenClick: function (index,name) { //不常用选中
        this.selectIndex = -1;
        this.selectIndex2 = index;
        this.fromdata.secondType.id = this.secondOffTypeList[index].id;
        this.subTypeName = this.secondOffTypeList[index].name;
        this.functionSetList = [];
        this.keepFunctionArr = [];
        this.fromdata.functionType.name = "未设置";
      },
      cancle() {
        this.subType2 = false;
      },
      sure() {
        this.fromdata.secondType.name = this.subTypeName;
        this.subType2 = false;
      },
      otherShowClick() {
        this.otherShow = !this.otherShow;
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
        this.slotsShop[0].values = res;
        this.companyVisible = true;     
      },
      async checkFirstClass() { //获取一级列表
          let res = await getlistParentTypeFun();
          this.slotsFirst[0].values = res;
          this.parentType = true;        
      },
      async checkSecondClass() { //获取二级类型
         this.secondOnTypeList = [];
         this.secondOffTypeList = [];
         this.selectIndex = -1;
         this.selectIndex2 = -2;
         let count = 0;
         if(this.fromdata.firstType.id) {
            let payload = {parentTypeId:this.fromdata.firstType.id};
            let res = await listSubTypeByFun(payload);
            if(res.length>0){
              res.forEach(item=>{
                if(item.machineCount>0){
                  this.secondOnTypeList.push(item);
                  count++;
                }else{
                  this.secondOffTypeList.push(item);
                }
              });
              if(count > 0) {
                this.subType2 = true;
              }else{
                this.slotsFun[0].values = res;
                this.subType = true;
              }
            }else{
              this.$toast("设备型号为空"); 
            }
        }else{
          this.$toast("请先选择类型");
          return false;
        }
      },
      async getFunctionSetList() {  //获取功能列表数据 
        if(this.keepFunctionArr.length >0 ) {
          let arr = [].concat(JSON.parse(JSON.stringify(this.keepFunctionArr))); 
          this.functionSetList = arr;
          this.setModelShow= true;
          this.modelShow = false;
          this.title = "功能列表";       
        }else{         
          if(this.functionSetList.length === 0){
            let payload = {subTypeId: this.fromdata.secondType.id,shopId: this.fromdata.shopType.id} ;     
            let res = await getFunctionSetListFun(payload);
            this.fromdata.communicateType = res.communicateType;
            if(Number(this.fromdata.communicateType)=== Number(this.fromdata.smCommunicateType)){
              this.functionTempletType = res.functionTempletType; 
              this.functionSetList = res.list;
              this.functionSetList.forEach(item=>{
                item.ifOpen=item.ifOpen === 0?(!item.ifOpen) : (!!item.ifOpen);
              });
              this.keepFunctionArr= [].concat(JSON.parse(JSON.stringify(res.list)));
              this.setModelShow= true;
              this.modelShow = false;
              this.title = "功能列表";
            }else{
              this.$toast("您扫描的NQT和选择的设备型号不一致");
              return;
            }      
          }else {      
            this.setModelShow= true;
            this.modelShow = false;
            this.title = "功能列表";
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
        if(this.fromdata.functionType.name === "未设置") {
          let instance = this.$toast({
            message: '请设置功能列表'
          });
          setTimeout(() => {
            instance.close();
            }, 2000);
          return false;
        }
        if(Number(this.fromdata.communicateType)!== Number(this.fromdata.smCommunicateType)){
          let instance = this.$toast({
            message: '您扫描的NQT和选择的设备型号不一致'
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
        let res = await deviceAddorEditFun(obj);
        let instance = this.$toast({
          message: '新增设备成功',
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
         if(!this.fromdata.shopType.id) {
          this.$toast("请先选择店铺");
          return false;
        }
        if(!this.fromdata.secondType.id ) {
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
          if(Number(this.fromdata.communicateType)=== 0 && !reg.test(Number(item.functionCode))){
            flag3 = false;
            this.$toast("脉冲填写格式错误，请填写非0非空正整数");
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
          this.fromdata.functionType.name = "已设置";
          this.setModelShow= false;
          this.modelShow = true;
          this.title = "新增设备";
          this.keepFunctionArr = [].concat(JSON.parse(JSON.stringify(this.functionSetList)));
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
    watch: {
      subType: function () {
        if (this.subType) {
          this.ModalHelper.afterOpen();
        } else {
          this.ModalHelper.beforeClose();
        }
      },
      subType2: function () {
        if (this.subType2) {
          this.ModalHelper.afterOpen();
        } else {
          this.ModalHelper.beforeClose();
        }
      },
      companyVisible: function () {
        if (this.companyVisible) {
          this.ModalHelper.afterOpen();
        } else {
          this.ModalHelper.beforeClose();
        }
      },
      parentType: function () {
        if (this.parentType) {
          this.ModalHelper.afterOpen();
        } else {
          this.ModalHelper.beforeClose();
        }
      }
    },
    created() {

    },
    components: {
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
    padding: 0 0 0.4rem 0;
    ul {
      -webkit-overflow-scrolling: touch;
    }
    .often {
      vertical-align: middle;
      height: 0.8rem;
      line-height: 0.8rem;
      font-size: 15px;
      width: 100%;
      background: rgba(248,251,254,1);
      .icon-xiangshangjiantou {
        color: #b0b0b0;
        transform: rotate(180deg);
        margin-right: 0.5rem;
        float: right;
      }
      .rotate:before {
        display: inline-block;
        transform: rotate(180deg);
      }
      .left-border {
        display: inline-block;
        width: 0.15rem;
        height: 0.4rem;
        border-left: 0.11rem solid rgba(24,144,255,1);
        vertical-align: middle;
      }
      .title {
        display: inline-block;
        vertical-align: middle;
        color: #999;
      }   
    }    
    .all-list {
      height: 9rem;
      overflow-y: scroll;
      .mint-checklist-label {
        text-align: center;
        height: 1.33rem;
        line-height: 1.33rem;
        font-size: 0.4rem;
        display: flex;
        p {
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
        background-color: rgba(14, 14, 255, 0.05);
      }
    }
  }
</style>
