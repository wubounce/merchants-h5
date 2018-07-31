<template>
  <section>
    <q-header :title="title"></q-header>
    <div class="search">
      <d-search @deviceSearch="onDeviceSearch"></d-search>
    </div>
    <div class="device-status">
      <div @click="titleClick()">
        <p class="current">全部</p>
        <span class="current">{{titleArr.all}}</span>
      </div>
      <div @click="titleClick(1)">
        <p>运行</p>
        <span>{{titleArr.run}}</span>
      </div>
      <div @click="titleClick(2)"> 
        <p>空闲</p>
        <span>{{titleArr.idle}}</span>
      </div>
      <div @click="titleClick(4)">
        <p>故障</p>
        <span>{{title.hitch}}</span>
      </div>
      <div @click="titleClick(8)">
        <p>离线</p>
        <span>{{title.offline}}</span>
      </div>
      <div @click="titleClick(16)">
        <p>超时</p>
        <span>{{title.timeout}}</span>
      </div>
    </div>
    
    <div class="device-list" v-for="(item,index) in list" :key="index" @click="toDeviceDetail(item.machineId)">
      <section class="item-hd">
        <span>{{item.machineName}}</span>
        <span>{{item.machineState}}</span>
      </section>
      <section class="item-bd">
        <span>店铺</span>
        <span>{{item.shopName}}</span>
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
    <div class="openItem" @click="toAddItem" v-show="isShow">···</div>
    <div v-show="isShow2">
      <div class="closeItem" @click="toCloseItem">X</div>
      <router-link to="/addDevice"><div class="addDev showItem">新增设备</div></router-link>
      <router-link to="/batchStart"><div class="betchStartup showItem">批量启动</div></router-link>
      <router-link to="/batchEdit"><div class="betchModf showItem">批量修改</div></router-link>
    </div>
  </section>

</template>
<script>
  import qs from "qs";
  import QHeader from '@/components/header';
  import DSearch from '@/components/Search/search';
  import { MessageBox } from 'mint-ui';
  import { deviceListFun , countDeviceFun } from '@/service/device';
  export default {
    data() {
      return {
        isShow: true,
        isShow2: false,
        title: '设备管理',
        titleArr: [],
        titleIndex: null,
        list: [],
        machineState: null,
        checkClass: false,
        name: ""
      };
    },
    mounted() {

    },
    methods: {
      titleClick(index) {
        this.titleIndex = index;
        this.getDeviceList(this.titleIndex,this.name);
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
      async getCountDevice(){      
        let res = await countDeviceFun();
         if(res.code === 0) {
          this.titleArr= res.data; 
        }
        else {
          MessageBox.alert(res.msg);
        }
      }, 
      async getDeviceList(titleIndex,name)  {
        let payload = {machineState: titleIndex,machineName: this.name};
        let res = await deviceListFun(qs.stringify(payload));
        if(res.code === 0) {
          this.list = res.data;
        }
        else {
          MessageBox.alert(res.msg);
        }
      },
      onDeviceSearch(msg){ //搜索
         this.name = msg;
         this.getDeviceList(this.titleIndex,this.name);
      }
    },
    created() {
      this.getDeviceList();
      this.getCountDevice();
    },
    components: {
      QHeader,
      DSearch
    }
  };

</script>
<style lang="scss" scoped>
  .search {
    width: 100%;
    display: flex;
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
        height: 0.43rem;
        margin-top: 0.1rem;
        color: #fff;
        background: rgba(24, 144, 255, 1);
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

  .device-list {
    margin-top: .27rem;
    padding: 0 .4rem;
    background: #FFFFFF;
    color: #999999;
    font-size: .37rem;
    section {
      height: 1.2rem;
      line-height: 1.2rem;
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
    }
    .item-ft {
      display: flex;
      p {
        flex: 1;
        &:nth-child(2) {
          display: flex;
          justify-content: flex-end
        }
      }
      span {
        &:nth-child(2) {
          color: #1890FF
        }
      }
    }
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
