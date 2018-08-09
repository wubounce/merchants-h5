<template>
  <section class="editTodolist" v-title="title">
    <!-- 第一模块 -->
    <div class="ul-list">
      <p class="personal-item" @click="changemachineFunc"><span>启动模式</span><span>{{item.functionName}}</span></p>
      <p class="personal-item" @click="open('pickerStarTime')"><span>启动时间</span><span>{{item.beginTime}}</span></p>
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
import qs from "qs";
import { getBatchStartFun } from '@/service/todoList';
import { updateBatchStartFun } from '@/service/todoList';
import { getFunctionListFun } from '@/service/todoList';
import Button from "@/components/Button/Button";
import { MessageBox } from 'mint-ui';
import moment from 'moment';
  export default {
    data() {
      return {
        title:'编辑待办事项',
        item:{},
        popupVisible:false,
        index:'',
        slots: [
          {
            flex: 1,
            values: [],
            className: 'shop-type',
            textAlign: 'center',
            position:'bottom',
            name:'启动模式'
          }
        ],
        datatimeVisible:false,
        pickerValue:'',
        shopId:'',
        funArr:[],
        standardFunctionId:''
      };
    },
    methods: {
      changemachineFunc() {
        this.popupVisible = true;
        this.index = 0;
        this.slots[0].defaultIndex = 2;
      },
      open(picker) {
        this.$refs[picker].open();
      },
      handleConfirm(data) {
        //判断启动时间是否小于当前时间
        let nowDate = new Date();
        if(this.pickerValue <= nowDate) {
          this.$toast({
              message: '启动时间不得小于等于当前时间',
              position: "middle",
              duration: 3000
            });
        }
        else {
          let date = moment(data).format('YYYY-MM-DD HH:mm');
          this.pickerValue = date;
          this.item.beginTime = this.pickerValue + ':00';
        }
      },
      async submit() {
        for(let i=0; i<this.funArr.length; i++) {
          if(this.item.functionName == this.funArr[i].functionName) {
            this.standardFunctionId = this.funArr[i].functionId;
          }
        }

        let objUpdate = {
          id: this.$route.query.id,
          machineParentTypeId: this.$route.query.machineParentTypeId,
          shopId: this.item.shopId,
          standardFunctionId: this.standardFunctionId,
          startTime: this.item.beginTime
        };

        let resUpdate = await updateBatchStartFun(qs.stringify(objUpdate));
        if(resUpdate.code ===0) {
          let instance = this.$toast({
            message: '编辑成功',
            iconClass: 'mint-toast-icon mintui mintui-success'
          });
          setTimeout(() => {
            instance.close();
          }, 1000);
          this.$router.push({
            name:'todolist'
          });
        }
        else {
          this.$toast({
            message:resUpdate.msg
          });
        }
      },
      valuesChange(picker, values) {
        this.machineFunction = values[0];
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
            this.item.functionName = this.machineFunction;
            break;
        }
      },
      async getBatchStart() {
        let obj ={
          id:this.$route.query.id,
          page:1,
          pageSize: 10
        };
        let res = await getBatchStartFun(qs.stringify(obj));
        if(res.code ===0 ) {
          //参数异常，待后台确认
          this.item = res.data;
          this.pickerValue = res.data.beginTime;
        }
      },
      updateBatchStart() {
        //修改待办信息
      },
      async getFunctionList() {
        let objFunList = {
          machineParentTypeId: this.$route.query.machineParentTypeId,
          shopId: this.$route.query.shopId
        };
        let resFunList = await getFunctionListFun(qs.stringify(objFunList));
        if(resFunList.code === 0 ) {
          this.funArr = resFunList.data;
          let arr = resFunList.data.map((i)=>{
            return i.functionName;
          });
          this.slots[0].values = arr;
        }
      }
    },
    created() {
      this.getBatchStart();
      this.getFunctionList();
    },
    components: {
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
      padding: 0.3rem;
      border-bottom: 1px solid #F8F8F8;
      background: url("../../../static/image/shop/right.png") no-repeat right
        0.3rem center;
      background-size: 0.16rem 0.27rem;
      span {
        &:first-child {
          color: #7f7f7f;
        }
        &:last-child {
          color: #333333;
        }
        font-size: 16px;
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
    font-size: 18px;
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
