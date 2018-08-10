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
      <div class="page-top">
        <div class="page-loadmore-wrapper" ref="wrapper">
          <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
            <div class="device-list" v-for="(item,index) in list" :key="index" @click="toDeviceDetail(item.machineId)">
              <section class="item-hd">
                <span><b>{{item.machineName}}</b></span>
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
                  <span>{{item.profit}}</span>
                </p>
              </section>
            </div>
            <div class="noData" v-show="hasNoData">暂无设备</div>
          </mt-loadmore>
        </div>
      </div>
      <div class="openItem" @click="toAddItem" v-show="isShow">···</div>
      <div v-show="isShow2">
        <div class="closeItem" @click="toCloseItem">X</div>
        <router-link to="/addDevice" v-has="'mer:machine:add'"><div class="addDev showItem">新增设备</div></router-link>
        <router-link :to="{name:'batchStart'}" v-has="'mer:machine:reset'"><div class="betchStartup showItem">批量启动</div></router-link>
        <router-link to="/batchEdit" v-has="'mer:machine:update'"><div class="betchModf showItem">批量修改</div></router-link>
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
        message: ''
        
      };
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight-30;
    },
    methods: {
      titleClick(index) {
        this.index = index;
        this._getList();

      },
      toDeviceDetail(i) {       
        this.$router.push({
        name:'deviceDetail',
        query:{
          machineId: i
        }
      });
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
          if(parameter == "http"){           
            this.$toast("请扫描IMEI码");
          }else{
            this.$router.push({
              name: "deviceSearch",
              query: ({imei: url})
          });
          } 
				});
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
    computed: {
      hasNoData () {
        return !this.list.length;
        this.message = "暂无设备";
      }
    },
    components: {

    }
  };

</script>
<style lang="scss" scoped>
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
  .page-top {
    height: 100%;
    padding-top: 3.47rem;
    .noData {
      font-size: 0.43rem;
      text-align: center;
      padding: 0.5rem 0;
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
  .noData {
    text-align: center;
    padding: 0.6rem 0;
    font-size: 0.43rem;
    color: #333;
  }
  .openItem{
    width: 1.49rem;
    height: 1.49rem;
    text-align: center;
    overflow: auto;
    background: rgba(24,144,255,1);
    border-radius: 50%;
    position: fixed;
    bottom: 0.67rem;
    right: 0.54rem;
    line-height: 1.49rem;
    color: rgba(255,255,255,1);
    font-size: 34px;
  }
  .closeItem{
    width: 1.49rem;
    height: 1.49rem;
    text-align: center;
    overflow: auto;
    background: rgba(24,144,255,1);
    border-radius: 50%;
    position: fixed;
    bottom: 0.67rem;
    right: 0.54rem;
    line-height: 1.49rem;
    color: rgba(255,255,255,1);
    font-size: 24px;
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
    line-height: 1.49rem;
    font-size: 12px;
    color: rgba(255,255,255,1);
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


</style>
