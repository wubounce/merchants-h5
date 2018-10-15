<template>
  <section class="editTodolist">
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
        <!-- <mt-datetime-picker ref="pickerStarTime" type="datetime" v-model="pickerValue"  @confirm="handleConfirm"></mt-datetime-picker> -->
    <mt-datetime-picker ref="pickerStarTime" type="datetime" v-model="pickerValue" month-format="{value} 月"  date-format="{value} 日" hour-format="{value} 时" minute-format="{value} 分"  @confirm="handleConfirm"></mt-datetime-picker>
  </section>
</template>

<script>
import { getBatchStartFun , updateBatchStartFun , getFunctionListFun } from '@/service/todoList';
import Button from "@/components/Button/Button";
import { MessageBox } from 'mint-ui';
  export default {
    data() {
      return {
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

        let resUpdate = await updateBatchStartFun(objUpdate);
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
        let res = await getBatchStartFun(obj);
        this.item = res;
        this.pickerValue = res.beginTime;
      },
      updateBatchStart() {
        //修改待办信息
      },
      async getFunctionList() {
        let objFunList = {
          machineParentTypeId: this.$route.query.machineParentTypeId,
          shopId: this.$route.query.shopId
        };
        let resFunList = await getFunctionListFun(objFunList);
        this.funArr = resFunList;
        let arr = resFunList.map((i)=>{
          return i.functionName;
        });
        this.slots[0].values = arr;
      }
    },
    created() {
      this.getBatchStart();
      this.getFunctionList();
    },
    components: {
      Button
    },
    watch: {
      popupVisible: function () {
        if (this.popupVisible) {
          this.ModalHelper.afterOpen();
        } else {
          this.ModalHelper.beforeClose();
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '../../assets/scss/todoList/editTodolist';
</style>
