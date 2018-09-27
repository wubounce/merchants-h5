<template>
  <section>
    <div class="search">
      <div class="search-input">
        <p class="left" :class="{ 'result-left': isResult }">
          <input type="text" v-model.trim="keyword" placeholder="请输入设备名称/IMEI 号" @input="inputHandle" ref="inputText">
          <span>
            <span @click="wxScan"><img src="../../../assets/img/device/devic_scan_icon.jpeg"></span>
            <span class="gap-border"></span>
            <span class="search-reset" @click="goBack">返回</span>
          </span>
        </p>
      </div>
    </div>

    <div class="search-select" v-show="isSelectItem">
      <ul>
        <li v-for="(item,index) in searchList" :class="{selectback:index==now}" class="search-select-option search-select-list" @click="selectClick(index)"
        :key="index">{{item.nameOrImei}}
        </li>
        <li class="noData" v-show="hasNoData">{{message}}</li>
      </ul>
    </div>

    <div class="selectedItem">     
      <router-link tag="div" :to="{ name: 'deviceDetail', query:{machineId:item.machineId}}" class="device-list" v-for="(item,index) in list" :key="index">
        <div class="line"></div>
        <section class="item-hd">
          <span class="item-title"><b>{{item.machineName}}</b></span>
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
          <router-link tag="p" class="item-ft-right" :to="{ name: 'deviceMonthFlow', query:{allMoney:item.profit,machineId:item.machineId,machineName:item.machineName,}}">
            <span>总收益</span>
            <span>{{item.profit | keepTwoNum}}</span>
            <span class="iconfont icon-nextx"></span>
          </router-link>
        </section>
        <div class="line"></div>
      </router-link>    
    </div>
  </section>
</template>

<script type="text/javascript">
import Api from '@/utils/Api';
import Web from '@/utils/Web';
import { validatReplace } from '@/utils/validate';
import { listByNameOrlmeiFun,deviceListFun } from '@/service/device';
  /* eslint-disable */
import {delay } from "@/utils/tool";
  export default {
    data() {
      return {
        myData: [], // 用来接收 ajax 得到的数据
        now: -1,
        isResult: true,
        keyword: '',
        searchList:[],
        message: '',
        list: [],
        isSelectItem: true
      };
    },
    filters: { //过滤器，过滤2位小数
      keepTwoNum(value) {
       return Number(value).toFixed(2);
      }
    },
    methods: {
      async _getList(id)  {
        let machineState = null;
        let payload = {machineState:machineState ,machineId: id};
        let res = await deviceListFun(payload);
        this.list = res.items;
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
      },
      goBack() {
        this.$router.go(-1);
      },
      fetchData(e) {
        validatReplace
        let keywords = this.keyword.replace(validatReplace, '');
        this.search(keywords);
      },
      async search(name) {
        let payload = {nameOrImei: name};
        let res = await listByNameOrlmeiFun(payload);
        this.message = "未找到相关结果"
        this.searchList = res;  
      },
      selectClick: function (index) {
        let machineId = this.searchList[index].machineId;
        this.isSelectItem = false;
        this._getList(machineId);
      },
      clearInput: function () {
        this.keyword = "";
      },
      inputHandle: function() { 
        
      },
      wxScan() { //微信扫码
        Web.scanQRCode(res => {
          let url = res;
          let parameter = url.substring(0,4);
          if(parameter == "http"){           
            this.$toast("未找到符合条件的设备");
          }else{
            this.search(url);
          } 
				});
      },
    },
    computed: {
      hasNoData () {
        return !this.searchList.length;
      }
    },

    created() {
      let query = this.$route.query;
      if(query.imei)this.search(query.imei);
    },

    mounted() {
      this.$refs.inputText.focus();
    },

    watch: {
      keyword: function (newVal) {
        if (newVal) {
          delay(() => {
            this.fetchData();
          }, 200);
        }
      },
    }
  };

</script>

<style lang="scss" scoped>
  section {
    height: 100%;
    background-color: #ffffff;
    .search {
      padding: 0.4rem 0.3rem 0.4rem 0.27rem;
      background-color: #fff;
      .search-input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        font-size: 0.43rem;
        color: rgba(153, 153, 153, 1);
        background: rgba(255, 255, 255, 1);
        box-shadow: 0rem 0.05rem 0.13rem 0.05rem rgba(186, 192, 210, 0.3);
        border-radius: 0.1rem;
        p {
          display: flex;
        }
        .left {
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex: 0 1 7.93rem;
          height: 1.17rem;
          padding-right: .27rem;
          
          input {
            background: url("../../../assets/img/device/devic_search_icon.png") no-repeat 0.27rem;
            background-size: 0.53rem;
            padding: 0.29rem 0 0.29rem 1.07rem;
            border-radius: 0.13rem;
            line-height: normal;
          }

          input::-webkit-input-placeholder {
            font-size: 0.43rem;
          }
          
          span {
            white-space: nowrap;
            height: 0.51rem;
            line-height: 0.6rem;
            display: flex;
          }
          img {
            width: 0.51rem;
          }
          .gap-border {
            position: relative;
            width: .2rem;
            height: .51rem;
            margin-right: .2rem;
            &:after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: .51rem;
              border-right: 0.01rem solid rgba(216, 216, 216, 1); // transform: scaleY(0.5);
            }
          }
          .search-reset {
            color: rgba(51, 51, 51, 1)
          }
        }
        .result-left {
          flex: 1;
        }
        .right {
          flex: 0 1 1.17rem;
          height: 1.17rem;
          background: url("../../../assets/img/device/devic_scan_icon.jpeg") no-repeat center;
          background-size: 60%;
          box-shadow: 0rem 0.05rem 0.13rem 0rem rgba(186, 192, 210, 0.3);
          border-radius: 0.13rem;
        }
        .result-right {
          display: none
        }
      }
    }
    .search-select {
      background: #fff;
      .noData {
        text-align: center;
      }
      li {
        color:rgba(51, 51, 51, 1);
        width: 100%;
        font-size: 0.43rem;
      }
      .search-select-option {
        box-sizing: border-box;
        background: url("../../../assets/img/device/devic_search_icon.png") no-repeat 0.27rem;
        background-size: 0.43rem;
        padding: 0.29rem 0 0.29rem 1.07rem;
        border-radius: 0.13rem;
        font-size: 16px;
      }
      
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
            flex: 1;
            text-align: center;
            justify-content: flex-end;
            border-left: 1px solid #f9f8ff;
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
    .line {
      width: 100%;
      height: 0.1rem;
      background: #efeff4;
    }
  }
  
</style>
