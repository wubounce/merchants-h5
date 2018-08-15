<template>
  <section v-title="title">
    <div class="permissions" v-if="$store.getters.has('mer:machine:list')">暂无相关页面权限</div>
    <div v-else>
      <div class="search-header">
        <div class="search"> 
          <div class="search-input">
            <router-link :to="{name:'deviceSearch'}" class="left" tag="p">请输入设备名称/IMEI 号</router-link>
            <p class="right" @click="wxScan"><img src="../../../assets/img/device/devic_scan_icon.jpeg"></p>
          </div>   
        </div>
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
            <p :class="{current:index===16}">超时</p>
            <span :class="{current:index===16}">{{titleArr.timeout}}</span>
          </div>
        </div>
      </div>
      <div class="noData" v-show="hasNoData">暂无设备</div>
      <div class="page-top">
        <div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}">
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" @translate-change="translateChange" :auto-fill="false" ref="loadmore">
            <router-link tag="div" :to="{ name: 'deviceDetail', query:{machineId:item.machineId}}" class="device-list" v-for="(item,index) in list" :key="index">
              <section class="item-hd">
                <span class="item-title "><b>{{item.machineName}}</b></span>
                <span class="state">{{item.machineState}}</span>
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
                <p class="item-ft-right">
                  <span>收益</span>
                  <span>{{item.profit | keepTwoNum}}</span>
                </p>
              </section>
            </router-link> 
            <div v-if="allLoaded" class="nomore-data">没有更多了</div>
          </mt-loadmore>
        </div>
      </div>
      <div class="openItem" @click="toAddItem" v-show="isShow"><span class="iconfont icon-gengduo-tianchong"></span></div>
      <div v-show="isShow2">
        <div class="closeItem" @click="toCloseItem"><span class="iconfont icon-guanbi"></span></div>
        <router-link :to="{name:'addDevice'}" v-has="'mer:machine:add'"><div class="addDev showItem"><span v-html="funNameArr[0]"></span></div></router-link>
        <router-link :to="{name:'batchStart'}" v-has="'mer:machine:batchStart'"><div class="betchStartup showItem"><span v-html="funNameArr[1]"></span></div></router-link>
        <router-link :to="{name:'batchEdit'}" v-has="'mer:machine:batchUpdate'"><div class="betchModf showItem"><span v-html="funNameArr[2]"></span></div></router-link>
      </div>
    </div>
  </section>

</template>
<script>
  import qs from "qs";
  import Api from '@/utils/Api';
  import Web from '@/utils/Web';
  import PagerMixin from '@/mixins/pagerMixin';
  import { deviceListFun , countDeviceFun } from '@/service/device';
  export default {
    mixins: [PagerMixin],
    data() {
      return {
        isShow: true,
        isShow2: false,
        title: '设备管理',
        titleArr: [],
        index: null,
        list: [],
        checkClass: false,
        name: '',
        hasNoData: '',
        funNameArr: ['新增<br/>设备','批量<br/>启动','批量<br/>修改'],
        noMore: false,
        screenWidth: document.body.clientWidth     
      };
    },
    filters: { //过滤器，过滤2位小数
      keepTwoNum(value) {
       return Number(value).toFixed(2);
      }
    },
    methods: {
      titleClick(index) {
        this.list = [];
        this.page = 1; //从第一页起
        this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
        this.index = index;
        this._getList();

      },
      toAddItem() {
        this.isShow = !this.isShow;
        this.isShow2 = !this.isShow2;
      },
      toCloseItem() {
        this.isShow2 = !this.isShow2;
        this.isShow = !this.isShow;
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
      async getCountDevice(){      
        let res = await countDeviceFun();
         if(res.code === 0) {
          this.titleArr= res.data; 
        }
        else {
          this.$toast(res.msg);
        }
      }, 
      async _getList()  {
        let payload = {machineState: this.index,page:this.page,pageSize: this.pageSize};
        let res = await deviceListFun(qs.stringify(payload));
        if(res.code === 0) {
          this.list = res.data.items;
          this.total = res.data.total;
          this.hasNoData = this.list.length<= 0 ? true: false;
          this.noMore = this.page>1?true: false;
          this.list.forEach(item=>{
            switch(item.machineState){
            case 1:
            item.machineState = "空闲";
            break;
            case 2:
            item.machineState = "运行";
            break;
            case 3:
            item.machineState = "预约";
            break;
            case 4:
            item.machineState = "故障";
            break;
            case 5:
            item.machineState = "参数设置";
            break;
            case 6:
            item.machineState = "自检";
            break;
            case 7:
            item.machineState = "预约";
            break;
            case 8:
            item.machineState = "离线";
            break;
            case 16:
            item.machineState = "超时未工作";
            break;

          }
        });
        }
        else {
          this.$toast(res.msg);
        }
      },
    },
    created() {
      this.getCountDevice();
    },
    
    components: {

    }
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
      .device-status {
        display: flex;
        font-size: 0.35rem;
        color: #333;
        text-align: center;
        background: #fff;
        height: 1.5rem;
        border-bottom: 1px solid rgba(220, 224, 230, 1);
        div {
          flex: 1;
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
    }
    .noData {
      font-size: 14px;
      color: #999;
      text-align: center;
      height: 100%;
      line-height: 100%;
      padding-top: 4rem;
      }
    .page-top {
      padding-top: 3.42rem;
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
          border-bottom: 0.01rem solid rgba(223, 230, 255, 1);
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
          p {
            flex: 1;
            &:nth-child(2) {
              flex: 1;
              text-align: center;
              justify-content: flex-end;
              border-left: 0.01rem solid rgba(223, 230, 255, 1);
            }
            span {
              display: inline-block;
              &:nth-child(1) {
                width: 1.125rem;
            }
            }

          }
          span {
            &:nth-child(2) {
              color: #1890FF;
              font-size: 0.43rem;
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
    .showItem{
      width: 1.49rem;
      height: 1.49rem;
      text-align: center;
      overflow: auto;
      background: rgba(19, 194, 194, 1);
      border-radius: 50%;
      position: fixed;
      right: 0.54rem;
      line-height: 16px;
      display: table;
      font-size: 12px;
      color: rgba(255,255,255,1);
      span {
        display: table-cell;
        vertical-align: middle;
        font-weight: bold;
      }
    }
    .addDev{
      bottom: 2.52rem;
      transition:all 0.2s 
    }
    
    .betchStartup{
      bottom: 4.32rem;
      transition:all 0.3s 
    }
    
    .betchModf{
      bottom: 6.12rem;
      transition:all 0.4s 
    }
  }


</style>
