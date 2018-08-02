<template>
  <section v-title="title">
    <div class="permissions" v-if="$store.getters.has('mer:machine:info')">暂无相关页面权限</div>
    <div v-else>
      <ul class="device-detail">
        <li class="device-detail-hd">
          <p>累计收益</p>
          <p>{{deviceDetail.profit}}</p>
        </li>
        <!-- 表单模块部分  -->
        <li class="device-detail-item">
          <!-- 表单元格渲染 -->

          <ul class="device-detail-bd">
            <li>
              <span class="field-title">设备名称</span>
              <p class="select-1">
                <input type="text" v-model="deviceDetail.machineName">
              </p>
            </li>
            <li @click="checkDeviceSelect">
              <span class="field-title">所属店铺</span>
              <p class="select">{{deviceDetail.shopName}}</p>
            </li>

            <router-link to="/addDevice" tag="li">
              <span class="field-title">设备类型</span>
              <p class="select">{{deviceDetail.parentTypeName}}</p>
            </router-link>
            <li @click="checkSecondClass">
              <span class="field-title">设备型号</span>
              <p class="select">{{deviceDetail.subTypeName}}</p>
            </li>
            <li @click="getCompany">
              <span class="field-title">公司</span>
              <p class="select">{{deviceDetail.company}}</p>
            </li>

            <li>
              <span class="field-title">NQT</span>
              <p class="select-2">
                <input type="text" v-model="deviceDetail.nqt" placeholder="请输入模块上二维码">
              </p>
            </li>
            <li>
              <span class="field-title">IMEI</span>
              <p class="select-2">
                <input type="text" v-model="deviceDetail.imei" placeholder="请输入模块上二维码">
              </p>
            </li>
            <li @click="toFunctionSeting">
              <span class="field-title">功能设置</span>
              <p class="select">{{fromdata.functionType.name}}</p>
            </li>
          </ul>
        </li>

        <!-- 功能列表部分 -->
        <section class="fun-item-hd">
          <div>
            <p v-for="(item,index) in functionListTitle " :key="index">
              <span v-for="(it,idx) in item " :key="idx">{{it}}</span>
            </p>
          </div>
        </section>
        <section class="fun-item-bd">
          <p v-for="(item,index) in functionList " :key="index">
            <span>{{item.fuctionName}}</span>
            <span>{{item.time}}</span>
            <span>{{item.price}}</span>
            <span>{{item.status}}</span>
          </p>
        </section>

        <li class="device-detail-ft">
          <p>创建人：Wendy</p>
          <p>创建时间： 2018-07-15 15:38:05</p>
        </li>
      </ul>

      <div class="about-button">
        <Button btn-type="small" btn-color="spe" class="ft-btn active" @click="deviceDele" v-has="'mer:machine:delete'">删除</Button>
        <Button btn-type="small" btn-color="spe" class="ft-btn" @click="deviceTZJ" v-has="'mer:machine:clean'">桶自洁</Button>
        <Button btn-type="small" btn-color="spe" class="ft-btn" @click="deviceRest" v-has="'mer:machine:reset'">复位</Button>
        <Button btn-type="small" btn-color="spe" class="ft-btn" @click="deviceEdit" v-has="'mer:machine:update'">编辑</Button>
      </div>
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
    </div>
  </section>
</template>

<script>
  import qs from "qs";
  import Button from "@/components/Button/Button";
  import { MessageBox } from 'mint-ui';
  import { detailDeviceListFun,deleteDeviceFun,manageResetDeviceFun,tzjDeviceFun } from '@/service/device';
  export default {
    data() {
      return {
        deviceDetail: [],
        companyVisible: false,
        title: '设备详情',
        fromdata: {
          machineName: "",
          firstClass: "",
          secondClass: "",
          cumuIncome: '5000元',
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
        functionList: [{
          fuctionName: '白色特脏 赃污',
          time: 25,
          price: 8,
          status: '开启'
        }],
        functionListTitle: [
          ['功能'],
          ['耗时', '/分'],
          ['原价', '/元'],
          ['状态']
        ]
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
      async getDetailDevice() {  //获取数据
        let payload = { machineId: this.$route.query.machineId} ;     
        let res = await detailDeviceListFun(qs.stringify(payload));
         if(res.code === 0) {
          this.deviceDetail= res.data; 
        }
        else {
          MessageBox.alert(res.msg);
        }
      }, 
      checkSecondClass() {},
      toFunctionSeting() {},
      deviceDele() {  //删除
        MessageBox.confirm('确定执行此操作?').then(async () => {
          let res = await deleteDeviceFun(qs.stringify({machineId: this.$route.query.machineId}));
          if(res.code === 0) {
            this.$router.push({name:'deviceDetail'});
          }
          else {
            MessageBox.alert(res.msg);
          }
        });   
        
      },
      deviceTZJ() {
        MessageBox.confirm('确定执行此操作?').then(async () => {
          let res = await tzjDeviceFun(qs.stringify({machineId: this.$route.query.machineId}));
          if(res.code === 0) {
            MessageBox.alert("操作成功");
        }
        else {
          MessageBox.alert(res.msg);
          }
        });
        
      },
      deviceRest() {  //复位
        MessageBox.confirm('确定执行此操作?').then(async ()=> {
          let res = await manageResetDeviceFun(qs.stringify({machineId: this.$route.query.machineId}));
          if(res.code === 0) {
            MessageBox.alert("操作成功");
          }
          else {
            MessageBox.alert(res.msg);
          }
        });

      },
      deviceEdit() {},
    },
    created(){
      this.getDetailDevice();
    },
    components: {
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
    .device-detail-hd {
      display: flex;
      height: 1.6rem;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.4rem;
      margin-bottom: .4rem;
      background: #fff;
      p {
        &:first-child {
          color: #999999;
        }
      }
    }
    .device-detail-ft {
      padding: 0.13rem 0.4rem;
      margin: .4rem 0 2.9rem;
      background: rgba(255, 255, 255, 1);
      p {
        width: 10rem;
        height: 0.8rem;
        line-height: 0.8rem;
        color: #999999;
      }
    }
    .fun-item-hd {
      padding: 0;
      background: #FAFCFF;
      color: #1890FF;
      font-size: 0.37rem;
      padding: .6rem 0;
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
      height: 1.6rem;
      line-height: 1.6rem;
      padding: 0 .4rem;
      font-size: 0.37rem;
      color: #333333;
      background: #fff;
      p {
        display: flex;
        justify-content: space-between;
        span {
          flex: 2.19;
          text-align: center;
          &:nth-child(1) {
            flex: 3.32;
          }
          &:nth-child(4) {
            flex: 2.21;
          }
        }
      }
    }

  }

  .about-button {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: flex-end;
    .ft-btn {
      margin: 0.3rem 0;
      width: 2.13rem;
      line-height: 0.9rem;
      height: 0.9rem;
      border-radius: 5px;
      margin-right: 0.3rem;
      color: #333333;
      border-color: #D8D8D8;
    }
    .active {
      color: #1890FF;
      border-color: #1890FF;
    }
  }

</style>
