<template>
  <section class="page-loadmore-height ">
    <div class="permissions" v-if="$store.getters.has('mer:machine:list')">暂无相关页面权限</div>
    <div v-else class="page-loadmore-height ">
      <div class="search-header">
        <div class="search"> 
          <div class="search-input">
            <router-link :to="{name:'deviceSearch'}" class="left" tag="p">请输入设备名称/IMEI 号</router-link>
            <p class="right" @click="wxScan"><img src="../../../assets/img/device/devic_scan_icon.jpeg"></p>
          </div>   
        </div>
        <div class="navigation">
          <div class="device-status">
            <div @click="titleClick(null)">
              <p :class="{current:!index}">全部</p>
              <span :class="{current:!index}">{{titleArr.all}}</span>
            </div>
            <div @click="titleClick(2)">
              <p :class="{current:index===2}">运行</p>
              <span :class="{current:index===2}">{{titleArr.run}}</span>
            </div>
            <div @click="titleClick(1)"> 
              <p :class="{current:index===1}">空闲</p>
              <span :class="{current:index===1}">{{titleArr.idle}}</span>
            </div>
            <div @click="titleClick(4)">
              <p :class="{current:index===4}">故障</p>
              <span :class="{current:index===4}">{{titleArr.hitch}}</span>
            </div>
            <div @click="titleClick(8)">
              <p :class="{current:index===8}">离线</p>
              <span :class="{current:index===8}">{{titleArr.offline}}</span>
            </div>
            <div @click="titleClick(16)">
              <p :class="{current:index===16}">超时未工作</p>
              <span :class="{current:index===16}">{{titleArr.timeout}}</span>
            </div>
            <div>
              <p></p>
              <span></span>
            </div>
          </div>
          <div class="filter-button" @click="rightPopup">
            <div>
              <p>筛选</p>
              <span class="iconfont icon-shaixuan"></span>
            </div>
          </div>
        </div>
        <div class="offline-tip" v-if="offlineTip"><div><span class="iconfont icon-guanbi1" @click="offlineTipClick"></span>离线：连续30分钟未在线的设备数量。可能由于断电，信号不稳定，模块、设备损坏等原因引起，请自行检查或联系客服报备。</div></div>
      </div>
      <div class="noData" v-show="hasNoData">暂无设备</div>
      <div :style="{ 'padding-top': hiddenPageHeight + 'rem' }" class="page-top" >
        <div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}">
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" @translate-change="translateChange" :auto-fill="false" ref="loadmore">
            <div>
              <router-link tag="div" :to="{ name: 'deviceDetail', query:{machineId:item.machineId}}" class="device-list" v-for="(item,index) in list" :key="index">
                <section class="item-hd">
                  <span class="item-title "><b>{{item.machineName}}</b></span>
                  <span class="state">{{item.machineState | deviceStatus}}</span>
                </section>
                <section class="item-bd">
                  <span>店铺</span>
                  <div>{{item.shopName}}</div>
                </section>
                <section class="item-ft">
                  <p class="item-ft-right">
                    <span>类型</span>
                    <span>{{item.machineTypeName}}</span>
                  </p>
                  <router-link v-if="!$store.getters.has('mer:machine:profit')" tag="p" class="item-ft-right" :to="{ name: 'deviceMonthFlow', query:{allMoney:item.profit,machineId:item.machineId,machineName:item.machineName,}}">
                    <span>总收益</span>
                    <span>{{item.profit | tofixd}}</span><span class="little-font" style="font-size: 8px;color:#1890FF; ">元</span>
                    <span class="iconfont icon-nextx"></span>
                  </router-link>
                </section>
              </router-link>
            </div>
            <div v-if="allLoaded" class="nomore-data">没有更多了</div>
          </mt-loadmore>
        </div>
      </div>
      <div class="openItem" @click="toAddItem" v-show="isShow"><span class="iconfont icon-gengduo-tianchong"></span></div>
      <div v-show="isShow2">
        <div class="closeItem" @click="toCloseItem"><span class="iconfont icon-guanbi"></span></div>
        <div class="moreItem">
          <router-link :to="{name:'batchEdit'}" v-has="'mer:machine:batchUpdate'" tag="div" class="showItem"><span v-html="funNameArr[2]"></span></router-link>
          <router-link :to="{name:'batchStart'}" v-has="'mer:machine:batchStart'" tag="div" class="showItem"><span v-html="funNameArr[1]"></span></router-link>    
          <router-link :to="{name:'addDevice'}" v-has="'mer:machine:add'" tag="div" class="showItem"><span v-html="funNameArr[0]"></span></router-link>
        </div>
      </div>
    </div>
    <mt-popup v-model="popupVisible" position="right" class="rightPopup">
      <div class="content">
        <div class="shop-type">
          <div class="header">
            <span class="header-title pingFangSC-Medium">所属店铺</span>
            <p>全部</p>
            <span class="iconfont icon-xiangshangjiantou" @click="allShopList" :class="{'rotate': !shopFlag}"></span>
          </div>
          <ul class="list">
            <li class="shop-item" :class="{'select':index==selectIndex}" @click="selectShopClick(index)" v-for="(item,index) in popupShop" :key="index">
              <span>{{item.shopName}}</span>
              <span class="pop-select"></span>
            </li>
          </ul>
        </div>
        <div class="device-type">
          <p class="pingFangSC-Medium">设备类型</p>
          <ul>
            <li class="deviceType-item" v-for="(item,index) in deviceTypeArr" :key="index" :class="{'select':index==selectDeviceTypeIndex}" @click="selectDeviceTypeClick(index)">
              <span>{{item.name}}</span>
              <span class="pop-select"></span>
            </li>
          </ul>
        </div>
        <div class="shop-type">
          <div class="header">
            <span class="header-title pingFangSC-Medium">设备型号</span>
            <p>全部</p>
            <span class="iconfont icon-xiangshangjiantou" @click="allModelList" :class="{'rotate': !modelFlag}"></span>
          </div>
          <ul class="list">
            <li class="shop-item" :class="{'select':index==selectModelIndex}" @click="selectModelClick(index)" v-for="(item,index) in deviceModelArr" :key="index">
              <span>{{item.name}}</span>
              <span class="pop-select"></span>
            </li>
          </ul>
        </div>
        <div class="communication-type">
          <P class="pingFangSC-Medium">通信类型</p>
          <ul>
            <li :class="{'select':index==selectCommunicationIndex}" @click="selectCommunicationClick(index)" v-for="(item,index) in communicationArr" :key="index">
              <span>{{item.type}}</span>
              <span class="pop-select"></span>
            </li>
          </ul>
        </div>
      </div>
      <section class="promiss-footer">
        <span class="popCancel" @click="popCancal"><b>重置</b></span>
        <span class="popSure" @click="popSure"><b>确定</b></span>
     </section>
    </mt-popup>
  </section>

</template>
<script>
  import Api from '@/utils/Api';
  import Web from '@/utils/Web';
  import { deviceStatus } from '@/utils/mapping';
  import PagerMixin from '@/mixins/pagerMixin';
  import { deviceListFun , countDeviceFun , getShopFun , getlistParentTypeFun , getlistSubTypeFun , typeListFun , listSubTypeAllFun } from '@/service/device';
  export default {
    mixins: [PagerMixin],
    data() {
      return {
        pageSize:20,
        isShow: true,
        isShow2: false,
        selectIndex: -1,
        selectDeviceTypeIndex: -1,
        selectModelIndex: -1,
        selectCommunicationIndex: -1,
        popupShop: '',
        initialParentTypeId: '',
        popupVisible: false,
        popShopId: '',
        popCommunicationType: '',
        titleArr: [],
        index: null,
        list: [],
        checkClass: false,
        name: '',
        hasNoData: '',
        funNameArr: ['新增<br/>设备','批量<br/>启动','批量<br/>修改'],
        noMore: false,
        deviceTypeArr: [],
        deviceModelArrAll: [],
        deviceModelArr: [], 
        communicationArr: [{type:"脉冲"},{type:"串口"}],
        shopFlag: true,
        modelFlag: true,
        subFlag: true,
        offlineTip:true,
        hiddenPageHeight: 4.67,
      };
    },
    filters: {
      deviceStatus: (value)=>{
        return deviceStatus(value);
      },
    },
    created() {
      this._getList();
    },
    methods: {
      async _getList()  { //获取设备
        let payload = {machineState:this.index,shopId:this.popShopId,parentTypeId:this.popDeviceTypeId,subTypeId:this.popDeviceModelId,communicateType:this.popCommunicationType,page:this.page,pageSize: this.pageSize};
        let res = await deviceListFun(payload);
        this.titleArr = res.count;
        this.list = res.page.items?[...this.list,...res.page.items]:[];
        this.total = res.page.total;
        this.hasNoData = this.list.length<= 0 ? true: false;
        this.noMore = this.page>1?true: false;
      },
      rightPopup() {  //筛选框弹出
        this.getPopupShop(this.shopFlag);
        if(!this.popDeviceTypeId && !this.popShopId) this.getlistParentType({onlyMine: true});
        if(!this.popDeviceModelId && !this.popDeviceTypeId && !this.popShopId) this.getlistSubTypeAll(this.subFlag);
        this.popupVisible = true;
      },
      async getPopupShop(flag) {  //获取店铺
        let res = await getShopFun();
        this.popupShop = flag?res.slice(0,4):res;
      },
      async getlistParentType(payload) {  //获取设备类型     
        let res = await getlistParentTypeFun(payload);
        this.deviceTypeArr = res;
        this.initialParentTypeId = res[0]?res[0].id:"";
      },
      async getlistSubTypeAll(flag,object) { //获取所有设备型号（与设备型号无关）
        let res = await listSubTypeAllFun(object);
        this.deviceModelArrAll = res;
        this.deviceModelArr = flag?res.slice(0,4):res;
      },
      async getlistSubType(payload,flag) { //该类型下的设备型号
        let res= await getlistSubTypeFun(payload);
        this.deviceModelArrAll = res;
        this.deviceModelArr = flag?res.slice(0,4):res;
      },
      allShopList() { //点击全部切换
        this.shopFlag = !this.shopFlag;
        this.getPopupShop(this.shopFlag);
      },
      allModelList() { //点击全部切换
        this.modelFlag = !this.modelFlag;
        this.deviceModelArr = (this.modelFlag && this.deviceModelArrAll.length>0)?this.deviceModelArrAll.slice(0,4):this.deviceModelArrAll;
      },  
      selectShopClick(index) { //筛选店铺选中
        if(this.selectIndex != index) {
          this.selectIndex = index;
          this.popShopId = this.popupShop[index].shopId;
          let payload = {shopId: this.popShopId}; //得到shopid
          this.getlistParentType(payload); //获取设备类型
          this.deviceModelArr = [];  
          this.deviceModelArrAll = [];
          this.selectDeviceTypeIndex = -1;
          this.popDeviceTypeId = '';
          this.popDeviceModelId = '';
          this.popCommunicationType = '';
          this.selectModelIndex = -1;
          this.selectCommunicationIndex = -1;
          this.getlistSubTypeAll(this.subFlag,payload);
        }else {
          this.selectIndex = -1;
          this.popShopId = '';
          this.selectDeviceTypeIndex = -1;
          this.selectModelIndex = -1;
          this.selectCommunicationIndex = -1;
          this.popShopId = '';
          this.popDeviceTypeId = '';
          this.popDeviceModelId = '';
          this.popCommunicationType = '';
          this.deviceModelArr = [];  
          this.deviceModelArrAll = [];
          this.getlistParentType({onlyMine: true});
          this.getlistSubTypeAll(this.subFlag);
        }
      },
      selectDeviceTypeClick(index) { //筛选设备类型点击
        if(this.selectDeviceTypeIndex != index){
          this.selectDeviceTypeIndex = index;
          this.popDeviceTypeId = this.deviceTypeArr[index].id;
          let payload = this.popShopId?{shopId: this.popShopId,parentTypeId: this.popDeviceTypeId}:{parentTypeId: this.popDeviceTypeId,onlyMine: true};
          this.getlistSubType(payload,this.modelFlag);
          this.selectModelIndex = -1;
          this.selectCommunicationIndex = -1;
          this.popDeviceModelId = '';
          this.popCommunicationType = '';
        }else {
          this.selectDeviceTypeIndex = -1;
          this.popDeviceTypeId = '';
          this.selectModelIndex = -1;
          this.selectCommunicationIndex = -1;
          this.popDeviceModelId = '';
          this.popCommunicationType = '';
          let payload = {shopId: this.popShopId};
          this.getlistSubTypeAll(this.subFlag,payload);
        }
      },
      selectModelClick(index) { //筛选设备型号选中
        if(this.selectModelIndex != index){
          this.selectModelIndex = index;
          this.popDeviceModelId = this.deviceModelArr[index].id;
          this.selectCommunicationIndex = -1;
          this.popCommunicationType = '';
        }else{
          this.selectModelIndex = -1;
          this.popDeviceModelId = '';
          this.selectCommunicationIndex = -1;
          this.popCommunicationType = '';
        }
      },
      selectCommunicationClick(index) { //通讯类型选中脉冲？串口
        if(this.selectCommunicationIndex != index) {
          this.selectCommunicationIndex = index;
          let arr= [].concat(JSON.parse(JSON.stringify(this.communicationArr))); 
          arr.forEach(item=>{
            return item.type=item.type === "脉冲"?0:1;
          });
          this.popCommunicationType = arr[index].type;
        }else {
          this.selectCommunicationIndex = -1;
          this.popCommunicationType = '';
        }    
      },
      popCancal() { //筛选取消
        this.selectIndex = -1;
        this.selectDeviceTypeIndex = -1;
        this.selectModelIndex = -1;
        this.selectCommunicationIndex = -1;
        this.popShopId = '';
        this.popDeviceTypeId = '';
        this.popDeviceModelId = '';
        this.popCommunicationType = '';
        this.shopFlag = true,
        this.modelFlag = true,
        this.list = [];
        this.payload = null;
        this.page = 1;
        this.getPopupShop(this.shopFlag);
        this.getlistParentType({onlyMine: true});
        this.getlistSubTypeAll(this.subFlag);
        this._getList();
      },
      popSure() { //筛选确定
        this.page = 1;
        this.list = [];
        this.popupVisible = false;
        this._getList();
      },
      titleClick(index) { //顶部状态选择
        this.list = [];
        this.page = 1; //从第一页起 
        this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
        this.index = index;
        this._getList();
      },
      toAddItem() { //右下按钮点击弹出
        this.isShow = !this.isShow;
        this.isShow2 = !this.isShow2;
      },
      toCloseItem() {  //右下关闭
        this.isShow2 = !this.isShow2;
        this.isShow = !this.isShow;
      },
      offlineTipClick() { //红字提示语关闭
        this.offlineTip = false;
        this.hiddenPageHeight = 3.5;
      },
      revenueBill(index) { //设备收益
        this.$router.push({
          name: "deviceSearch",
          query: ({imei:nqt})
        }); 
      },
      wxScan() { //微信扫码
        Web.scanQRCode(res => {
          let url = res;
          let parameter = url.substring(0,4);
          if(url){
            if(parameter == "http"){
              if(!url.split("?")[1]){
                this.$toast("无效的二维码");
                return false;
              }else{
              let object = url.split("?")[1];
              let nqt = this.getUrlParam(object,"NQT"); 
              this.$router.push({
                name: "deviceSearch",
                query: ({imei:nqt})
              }); 
              }       
            }else{
              this.$router.push({
                name: "deviceSearch",
                query: ({imei: url})
              });
            }
          }else{
            this.$toast("请扫描正确的二维码");
          }
				});
      }, 
      getUrlParam(url,name) { 
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        let r = url.match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
      },
    },
  };

</script>
<style lang="scss" scoped>
  section{
    height: 100%;
    .search-header{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 999;
      .search {
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
            &:nth-child(1){
              background: url("../../../assets/img/device/devic_search_icon.png") no-repeat 0.27rem;
              background-size: 0.53rem;
              padding: 0.29rem 0 0.29rem 1.07rem;
              border-radius: 0.13rem;
            }
          }
          .left {
            align-items: center;
            flex: 0 1 7.93rem;
            height: 1.17rem;
            padding-right: .27rem;
            box-sizing: border-box;
            box-shadow: 0.05rem 0.08rem 0.13rem 0.05rem rgba(186, 192, 210, 0.3);
            border-radius: 0.1rem;
          }
          .right {
            flex: 0 1 1.17rem;
            height: 1.17rem;
            box-shadow: 0rem 0.05rem 0.13rem 0rem rgba(186, 192, 210, 0.3);
            border-radius: 0.13rem;
            img {
              width: 0.51rem;
              height: 0.51rem;
              margin: 0.33rem;
            }
          }
        }
      }
      .navigation{
        border-bottom: 1px solid rgba(220, 224, 230, 1);
        background-color: #ffffff;
        position: relative;
        .device-status {
          display: flex;
          font-size: 0.35rem;
          width: 8.73rem;
          color: #333;
          text-align: center;
          background: #fff;
          height: 1.5rem;
          overflow-x: auto;          
          div {
            flex: none;
            width: 1.6rem;
            &:nth-child(6) {
              width: 2rem;
            }
            &:last-child {
              width: 0.5rem;
            }
            span {
              display: inline-block;
              width: 0.73rem;
              line-height: 0.45rem;
              height: 0.43rem;
              margin-top: 0.1rem;
              color: rgba(24, 144, 255, 1);
              border-radius: 0.2rem;
            }
            p {
              margin-top: .25rem;
            }
            p.current {
              font-weight: bolder;
            }
            span.current {
              display: inline-block;
              position: relative;
              color: #fff;
              background: rgba(24, 144, 255, 1);
              &::after {
                content: '';
                display: block;
                width: 100%;
                position: absolute;
                bottom: -0.24rem;
                border-bottom: 0.08rem solid #1890FF;
              }

            }
          }

        }
        .filter-button {
           position: absolute;
           width: 1.72rem;
           text-align: center;
           font-size: 0.37rem;
           top: 0;
           right: 0;
           background: rgba(255,255,255,0.6);
           color: rgba(24, 144, 255, 1);
           margin: 0.25rem 0;
           div{
            margin-left: 0.25rem;
            width: 1.47rem;
            span {
              margin-top: 0.18rem;
              display: inline-block;
              font-size: .27rem;
           }
           }
        }
     }
    }
    .noData {
      font-size: 14px;
      color: #999;
      text-align: center;
      height: 100%;
      line-height: 100%;
      padding-top: 6rem;
      }
    .page-top {
      height: 100%;
      box-sizing: border-box;
      .page-loadmore-wrapper {
        overflow: scroll;
        .nomore-data {
          text-align: center;
          color: #999;
          font-size: 12px;
          margin-bottom: 0.266667rem;
          }
        .device-list {
          margin-top: .27rem;
          padding: 0 .4rem;
          background: #FFFFFF;
          color: rgba(153, 153, 153, 1);
          font-size: .37rem;
        section {
          padding: .1rem 0;
          height: 1rem;
          line-height: 1rem;
          border-bottom: 1px solid #f9f8ff;
          &:nth-child(3) {
            border: none;
          }
        }
        .item-hd {
          font-size: 0.43rem;
          color: rgba(51, 51, 51, 1);
          .item-title {
            width: 80%;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          span {
            &:nth-child(2) {
              float: right;
              color: #1890FF
            }
          }
          .state{
            font-size: 0.37rem;
          }
        } 

        .item-bd {
          display: flex;
          span {
            width: 1.2rem;
          }
          div {
            flex-grow: 1;
            width: auto;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .item-ft {
          display: flex;
          .icon-nextx {
            float: right;
            color: rgba(204, 204, 204, 1);
          }
          p {
            flex: 1;
            &:nth-child(2) {
              flex: 1.5;
              text-align: center;
              justify-content: flex-end;
              border-left: 1px solid #f9f8ff;
            }
            span {
              display: inline-block;
            }

          }
          span {
            &:nth-child(2) {
              color: #1890FF;
              font-size: 0.43rem;
              margin-left: 0.15rem;
            }
          }
        }
      }
    }
    }
    .openItem {
      width: 1.49rem;
      height: 1.49rem;
      text-align: center;
      background: rgba(24,144,255,1);
      border-radius: 50%;
      position: fixed;
      bottom: 0.67rem;
      right: 0.54rem;
      line-height: 1.49rem;
      color: rgba(255,255,255,1);
      box-shadow: 0px 0.03rem 0.4rem rgba(24,144,255,0.75);
      z-index: 1001;
      .icon-gengduo-tianchong {
        font-size: 20px;
        display: inline-block;
        width: 20px;
      }
    }
    .closeItem {
      width: 1.49rem;
      height: 1.49rem;
      text-align: center;
      background: rgba(24,144,255,1);
      border-radius: 50%;
      position: fixed;
      bottom: 0.67rem;
      right: 0.54rem;
      line-height: 1.49rem;
      color: rgba(255,255,255,1);
      box-shadow: 0px 0.03rem 0.4rem rgba(24,144,255,0.75);
      .icon-guanbi {
        font-size: 20px;
        display: inline-block;
        width: 20px;
      }
    }
    .moreItem {
      position: fixed;
      right: 0.54rem;
      width: 1.49rem;
      bottom: 2.64rem;
      div {
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .showItem{
      width: 1.49rem;
      height: 1.49rem;
      text-align: center;
      overflow: auto;
      background: rgba(19, 194, 194, 1);
      border-radius: 50%;
      line-height: 16px;
      display: table;
      font-size: 12px;
      margin-bottom: 0.48rem;
      color: rgba(255,255,255,1);
      span {
        display: table-cell;
        vertical-align: middle;
        font-weight: bold;
      }
    }
    .rightPopup {
      padding: 0 0.26rem;
      width: 8.53rem;
      height: 100%;
      .content {
        padding-bottom: 1.5rem;overflow: hidden;overflow-y: auto;box-sizing: border-box;height: 100%;
        .header {
          display: flex;
          padding-top: 0.93rem;
          .header-title {
            width: 50%;
            font-size: .43rem;
          }
          p{
            flex-grow: 1;
            text-align: right;
            font-size: 12px;
            line-height: 18px;
            color: RGBA(153, 153, 153, 1)
          }
          .iconfont {
            color:rgba(176,176,176,1);
            transform: rotate(180deg);
          }
          .rotate:before {
            display: inline-block;
            transform: rotate(180deg);
          }
        }
        .list {
          padding-top: .2rem;
          .select {
            background:rgba(231,243,255,1); 
          }
          li {
            font-size: 0.37rem;
            padding: 0.2rem 0.75rem 0.2rem 0.4rem;
            color: rgba(51, 51, 51, 1);
            background-color:rgba(247,247,247,1);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-top: .2rem;
            position: relative;
            border-radius: 4px;
            
          }
        }
        .device-type {
          padding-top: 0.93rem;  
          p {
            font-size: 0.43rem;
          }
          ul {
            display: flex;
            flex-wrap: wrap;
            .select {
              background:rgba(231,243,255,1); 
            }
            li {
              margin-right: 0.27rem;
              margin-top: 0.4rem;
              font-size: 0.37rem;
              width: 31%;
              height: 0.93rem;
              line-height: 0.93rem;
              color: rgba(51, 51, 51, 1);
              background-color:rgba(247,247,247,1); 
              position: relative;
              text-align: center;
              border-radius: 4px;
              &:nth-child(3n) {
                margin-right: 0;
              }
            }
          }
        }
        .communication-type {
          padding-top: 0.93rem;
          p {
            font-size: 0.43rem;
          }
          ul {
            padding-top: 0.4rem;
            display: flex;
            .select {
              background:rgba(231,243,255,1); 
            }
            li {
              font-size: 0.37rem;;
              color: rgba(51, 51, 51, 1);
              background-color:rgba(247,247,247,1);
              flex: 1;
              margin-left: 0.27rem;
              height: 0.93rem;
              line-height: 0.93rem;
              text-align: center;
              position: relative;
              border-radius: 4px;  
              &:nth-child(1) {
              margin-left: 0;          
              }        
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
      .promiss-footer .popCancel {
        font-size: 18px;
        color: #1890FF;
        background:rgba(246,248,255,1)
      }
      .promiss-footer .popSure {
        background: #1890FF;
        font-size: 18px;
        color: #fff;
      }
    }
  }

  .select {
        background-color: rgba(231, 243, 255, 1);
        .pop-select {
          width: 0.45rem;
          height: 0.45rem;
          position: absolute;
          right: 0;
          bottom: 0;
          background: url("../../../assets/img/device/pop-select.png") no-repeat bottom;
          background-size: 0.45rem;
        }
      }
    
  .offline-tip {
    height: 1.17rem;
    margin-top: 0;
    border-radius: 0;
    padding: 0;
    position: relative;
    div {
      padding: 0rem 0.73rem 0rem 0.32rem;
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
    }
  }

  .paddingTop {
    padding-top: 3.5rem;
  }



</style>
