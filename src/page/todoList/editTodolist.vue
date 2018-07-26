<template>
  <section class="editTodolist">
    <q-header :title="title"></q-header>
    <!-- 第一模块 -->
    <div class="ul-list">
      <p class="personal-item" @click="changemachineFunc"><span>启动模式</span><span>{{machineFunction}}</span></p>
      <p class="personal-item" @click="open('pickerStarTime')"><span>启动时间</span><span>{{time}}</span></p>
    </div>
    <button class="submit" @click="submit">提交</button>

    <!-- 启动模式 -->
    <mt-popup v-model="popupVisible" position="bottom" class="mint-popup">
      <div class="prop-bd">
        <div class="page-picker-wrapper">
          <mt-picker class="picker" :slots="slots" @change="valuesChange" :showToolbar="true" ><p class="toolBar"><span @click="cancel">取消</span><span>启动模式</span><span @click="confirmNews">确定</span></p></mt-picker>
        </div>
      </div>
    </mt-popup>

    <!-- 启动时间 -->
    <mt-datetime-picker ref="pickerStarTime" type="datetime" v-model="pickerValue"  @confirm="handleConfirm"></mt-datetime-picker>
  </section>
</template>

<script>
import QHeader from '@/components/header';
import Button from "@/components/Button/Button";
import { MessageBox } from 'mint-ui';
import moment from 'moment';
  export default {
    data() {
      return {
        title:'批量定时启动设备',
        machineFunction: '标准洗',
        time: '2018-08-09 12:00',
        popupVisible:false,
        index:'',
        slots: [
          {
            flex: 1,
            values: ['学校', '公寓', '流动人口社区', '酒店', '医院', '养老院','工厂','浴场','其他'],
            className: 'shop-type',
            textAlign: 'center',
            position:'bottom',
            name:'店铺类型',
            defaultIndex:2
          }
        ],
        datatimeVisible:false,
        pickerValue:''
      };
    },
    created(){
    },
    methods: {
      changemachineFunc() {
        this.popupVisible = true;
        this.index = 0;
      },
      open(picker) {
        this.$refs[picker].open();
      },
      handleConfirm(data) {
        let date = moment(data).format('YYYY-MM-DD HH:mm');
	      this.pickerValue = date;
        this.time = this.pickerValue;
      },
      submit() {
        let instance = this.$toast({
          message: '编辑成功',
          iconClass: 'mint-toast-icon mintui mintui-success'
        });
        setTimeout(() => {
          instance.close();
        }, 1000);
        this.$router.push({
          name:'todoDetail'
        });
      },
      valuesChange(picker, values) {
        this.machineFunction = values[0];
        switch(values[0]) {
          case '学校':
            this.shopType = 1;
            break;
          case '公寓':
            this.shopType = 2;
            break;
          case '流动人口社区':
            this.shopType = 3;
            break;
          case '酒店':
            this.shopType = 4;
            break;
            case '医院':
            this.shopType = 5;
            break;
          case '养老院':
            this.shopType = 6;
            break;
            case '工厂':
            this.shopType = 7;
            break;
          case '浴场':
            this.shopType = 8;
            break;
          case '其他':
            this.shopType = 9;
            break;
        }
      },
      cancel() {
        switch(this.index) {
          case 0:
            this.popupVisible = false;
            break;
        }
      },
      confirmNews() {
        switch(this.index) {
          case 0:
            this.popupVisible = false;
            break;
        }
      }
    },
    components: {
      QHeader,
      Button
    }
  };
</script>

<style lang="scss" scoped>
.editTodolist {
  .ul-list {
    background-color: #fff;
    .personal-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.35rem;
      padding: 0.3rem;
      border-bottom: 1px solid #F8F8F8;
      background: url("../../../static/shop/right.png") no-repeat right
        0.3rem center;
      background-size: 0.16rem 0.27rem;
      span {
        &:first-child {
          color: #7f7f7f;
        }
        &:last-child {
          color: #333333;
        }
        font-size: 0.28rem;
        margin-right: 0.3rem;
      }
    }
  }
  .submit {
    width: 100%;
    position: fixed;
    bottom: 0;
    border: none;
    padding: 0.45rem 0;
    background-color: #1890FF;
    color: #fff;
    font-size: 0.5rem;
  }
  .mint-popup {
    width: 100%;
    .prop-bd {
      padding: 0.3rem;
    }
  }
  .toolBar {
    display: flex;
    justify-content: center;
    padding-top: 0.2rem;
    #allDay {
      color: #fff;
      background-color: #1890FF;
      font-size: 0.45rem;
      padding: 0.05rem 0.2rem;
      padding-top: -1rem;
      border-radius: 5px;
    }
    span {
      &:nth-child(1) {
        font-size: 0.45rem;
        color: #999999;
      }
      &:nth-child(2) {
        font-size: 0.5rem;
        margin: 0 2.7rem;
        color: #666666;
      }
      &:nth-child(3) {
        font-size: 0.45rem;
        color: #1890FF;
      }
    }
  }
}
</style>
