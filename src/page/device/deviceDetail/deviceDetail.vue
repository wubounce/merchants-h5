<template>
  <section>
    <div class="permissions" v-if="!$store.getters.has('mer:machine:info')">暂无相关页面权限</div>
    <div v-if="$store.getters.has('mer:machine:info')">
      <section>
        <ul class="device-detail">
          <li class="device-detail-hd">
            <p>累计收益</p>
            <p>{{deviceDetail.profit?deviceDetail.profit :'0.00' | tofixd}}</p>
          </li>
          <!-- 表单模块部分  -->
          <li class="device-detail-item">
            <!-- 表单元格渲染 -->

            <ul class="device-detail-bd">
              <li>
                <span class="field-title">设备名称</span>
                <p>
                  <span>{{deviceDetail.machineName}}</span>
                </p>
              </li>
              <li>
                <span class="field-title">所属店铺</span>
                <p>{{deviceDetail.shopName}}</p>
              </li>
              <li>
                <span class="field-title">设备类型</span>
                <p>{{deviceDetail.parentTypeName}}</p>
              </li>
              <li>
                <span class="field-title">设备型号</span>
                <p>{{deviceDetail.subTypeName}}</p>
              </li>
              <li>
                <span class="field-title">公司</span>
                <p>{{deviceDetail.company}}</p>
              </li>
              <li>
                <span class="field-title">通信类型</span>
                <p>{{tongxin}}</p>
              </li>
              <li>
                <span class="field-title">状态</span>
                <p>{{deviceDetail.machineState | deviceStatus}}</p>
              </li>
              <li>
                <span class="field-title">NQT</span>
                <p>
                  {{deviceDetail.nqt}}
                </p>
              </li>
              <li>
                <span class="field-title">IMEI</span>
                <p>
                  {{deviceDetail.imei}}
                </p>
              </li>
              <li v-show="waterLevelShow">
                <span class="field-title">水位置设置</span>
                <p>{{deviceDetail.waterLevel | waterStatus}}</p>
              </li>
              <li>
                <span class="field-title">功能设置</span>
                <p>已设置</p>
                <span class="iconfont icon-xiangshangjiantou" :class="{'rotate': !functionSetListShow}" @click="functionSetListShowClick"></span>
              </li>
            </ul>
          </li>

          <!-- 功能列表部分 -->
          <div v-show="functionSetListShow">
            <section class="fun-item-hd">
              <div>
                <p v-for="(item,index) in functionListTitle " :key="index">
                  <span v-for="(it,idx) in item " :key="idx">{{it}}</span>
                </p>
              </div>
            </section>
            <section class="fun-item-bd">
              <p v-for="(item,index) in deviceDetail.functionList " :key="index">
                <span>{{item.functionName}}</span>
                <span>{{item.needMinutes}}</span>
                <span>{{item.functionPrice}}</span>
                <span v-show="functionCodeShow">{{item.functionCode}}</span>
                <span>{{item.ifOpen === 0? "开启":"关闭"}}</span>
              </p>
            </section>
          </div>
        <li class="device-detail-ft">
          <p>创建人：{{deviceDetail.createUser}}</p>
          <p>创建时间： {{deviceDetail.createTime}}</p>
        </li>
      </ul>
      <div style="width:100%;height:1.73rem;"></div>
      <div class="about-button">
        <span v-has="'mer:machine:clean'"><button btn-type="small" btn-color="spe" class="ft-btn" @click="deviceTZJ" v-show="deviceDetail.hasTzj && deviceDetail.machineState===1||deviceDetail.hasTzj && deviceDetail.machineState===4">桶自洁</button></span>
        <span v-has="'mer:machine:reset'"><button btn-type="small" btn-color="spe" class="ft-btn" @click="deviceRest" v-show="(deviceDetail.machineState !==8 && deviceDetail.subTypeName !== '通用脉冲充电桩')">复位</button></span>
        <span v-has="'mer:machine:start'"><button btn-type="small" btn-color="spe" class="ft-btn" @click="deviceStart" v-show="deviceDetail.machineState===1 && deviceDetail.subTypeName !== '通用脉冲充电桩'||deviceDetail.machineState===4 && deviceDetail.subTypeName !== '通用脉冲充电桩'">启动</button></span>
        <span v-has="'mer:machine:update'"><button btn-type="small" btn-color="spe" class="ft-btn" @click="deviceEdit">编辑</button></span>
      </div>
      </section>

    </div>
  </section>
</template>

<script>
  import { MessageBox } from 'mint-ui';
  import { deviceStatus, waterStatus } from '@/utils/mapping';
  import { detailDeviceListFun,deleteDeviceFun,manageResetDeviceFun,tzjDeviceFun } from '@/service/device';
  export default {
    data() {
      return {
        deviceDetail: [],
        functionSetListShow: true,
        functionCodeShow: false,
        waterLevelShow: false,
        waterLevel: '',
        tongxin: '',
        functionListTitle: [
          ['功能'],
          ['耗时', '/分'],
          ['原价', '/元'],
          ['状态']
        ],
        functionListTitle2: [
          ['功能'],
          ['耗时', '/分'],
          ['原价', '/元'],
          ['脉冲数'],
          ['状态']
        ],
        query:{},
      };
    },
   filters: { 
      deviceStatus: (value)=>{
        return deviceStatus(value);
      },
      waterStatus: (value)=>{
        return waterStatus(Number(value));
      },
    },
    created() {
      this.query = this.$route.query?this.$route.query:{};
      this.getDetailDevice();
    },
    methods: {
      async getDetailDevice() {  //获取数据
        let payload = { machineId: this.$route.query.machineId} ;     
        let res = await detailDeviceListFun(payload);
        this.deviceDetail= res;
        if(res.waterLevel) {
          this.waterLevelShow = true;
          this.waterLevel = res.waterLevel;
        }
        if(res.comment) {
          this.$toast("设备功能不存在，请删除设备重新绑定");
        }
        if(res.communicateType === 1){
          this.tongxin = "串口";
        } else {
          this.tongxin = "脉冲";
          this.functionCodeShow = true;
          this.functionListTitle = this.functionListTitle2;
        }
        return Promise.resolve(res.machineState);
      }, 
      functionSetListShowClick() {
        this.functionSetListShow =!this.functionSetListShow;
      },
      deviceTZJ() {  //桶自洁
        MessageBox.confirm('是否确认桶自洁此设备?').then(async () => {
          let res = await tzjDeviceFun({machineId: this.$route.query.machineId});
          let instance = this.$toast({
            message: '桶自洁成功',
            iconClass: 'mint-toast-icon mintui mintui-success'
          });
          this.getDetailDevice();
        });
      },
      deviceRest() {  //复位
        MessageBox.confirm('是否确认复位此设备?').then(async ()=> {
          let res = await manageResetDeviceFun({machineId: this.$route.query.machineId});
          let instance = this.$toast({
            message: '复位成功',
            iconClass: 'mint-toast-icon mintui mintui-success'
          });
          this.getDetailDevice();
        });
      },
      deviceEdit() {
        this.$router.push({
          name:'editDevice',
          query:{
            machineId: this.$route.query.machineId 
          }
        });
      },
      // 进入启动页
      deviceStart() {
        this.getDetailDevice().then( data =>{
          switch(data) {
            case 1: 
              this.$router.push({
                name: 'deviceStart',
                query:{
                  machineId: this.$route.query.machineId 
                }
              });
            break;
            case 2:
              this.$toast({message: '设备运行中，请先复位'});
            break;
            case 3:
              this.$toast({message: '设备已被预约，请先复位'});
            break;
            case 4:
              this.$toast({message: '设备故障，启动失败'});
            break;
            case 8:
              this.$toast({message: '设备离线，启动失败'});
            break;
          }
        });
      }
    },
    beforeRouteLeave (to, from, next) {
      if(to.name === 'deviceSearch'){
        next();
        this.$router.replace({name: 'deviceSearch',query:{keyword: this.query.keyword}});//返回键要返回的路由
      }else {
        next();
      }
    }
  };

</script>

<style lang="scss" scoped>
  section {
    overflow:hidden;
    overflow-y:auto;
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
              width: 50%;
              text-align: left;
              color: rgba(153, 153, 153, 1); 
            }
            .rotate:before {
              display: inline-block;
              transform: rotate(180deg);
            }
          p {
              flex-grow: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              text-align: right;
              color:rgba(51, 51, 51, 1);
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
        font-size: 12px;
        padding: 0.13rem 0.4rem;
        margin: .4rem 0;
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
        line-height: 1.2rem;
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
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
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
        width: 1.9rem;
        height: 0.8rem;
        border-radius: 5px;
        margin-right: 0.3rem;
        color: #1890FF;
        font-size: 14px;
        background-color: #ffffff;
        border: 1px solid #1890FF;  
      }
    }
  }


</style>
