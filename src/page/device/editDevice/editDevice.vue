<template>
  <section>
    <q-header :title="title"></q-header>
    <ul class="device-detail">

      <!-- 表单模块部分  -->
      <li class="device-detail-item">
        <!-- 表单元格渲染 -->
        <ul class="device-detail-bd">
          <li>
            <span class="field-title">机器名称</span>
            <p class="select-1">
              <input type="text" v-model="fromdata.machineName">
            </p>
          </li>
          <li @click="checkDeviceSelect">
            <span class="field-title">所属店铺</span>
            <p class="select">{{fromdata.shopName}}</p>
          </li>

          <li @click="getCompany">
            <span class="field-title">公司</span>
            <p class="select">{{fromdata.companyType.name}}</p>
          </li>
          
          <li>
            <span class="field-title">NQT</span>
            <p class="select-2">
              <input type="text" v-model="fromdata.nqt" placeholder="请输入模块上二维码">
            </p>
          </li>
          <li>
            <span class="field-title">IMEI</span>
            <p class="select-2">
              <input type="text" v-model="fromdata.imei" placeholder="请输入模块上二维码">
            </p>
          </li>

          <li @click="toFunctionSeting">
            <span class="field-title">功能设置</span>
            <p class="select">{{fromdata.functionType.name}}</p>
          </li>
        </ul>
      </li>

    </ul>
    <!-- 模块商 -->
    <mt-popup v-model="companyVisible" position="bottom" class="select-popup">
      <div class="select">
        <ul class="select-list">
          <li v-for="(item,index) in selectListA" :key="index" @click="getcompanyValue(item)">{{item.name}}</li>
        </ul>
        <div class="btn">
          <Button btn-type="default" btn-color="blue" @confirm="companyVisible = false">取消</Button>
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
  import Button from "@/components/Button/Button";
  import QHeader from '@/components/header';
  import {
    Actionsheet
  } from "mint-ui";
  import AddCount from "@/components/AddCount/AddCount";


  export default {
    data() {
      return {
        companyVisible: false,
        title: '编辑设备',
        fromdata: {
          machineName: "",
          shopName: "",
          companyType: {
            name: "",
            value: ""
          },
          functionType: {
            name: "",
            value: ""
          },
          nqt: "",
          imei: ""
        },
        selectListA: [{
            name: "huiren",
            value: "huiren"
          },
          {
            name: "youfang",
            value: "youfang"
          }
        ],
      };
    },
    methods: {
      getcompanyValue(msg) {
        this.fromdata.companyType.name = msg.name;
        this.fromdata.companyType.value = msg.value;
        this.companyVisible = false;
      },
      getCompany() {
        this.companyVisible = true;
      },
      checkDeviceSelect() {

      },
      checkSecondClass() {},
      toFunctionSeting() {}

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

</style>
