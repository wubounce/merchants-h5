<template>
  <section class="todolist">
		<q-header :title="title"></q-header>
    <!-- 第一模块 -->
    <p class="todo-item first-todo-item"><span>所属店铺</span><span>{{shopName}}</span></p>
    <p class="todo-item"><span>设备类型</span><span>{{machineType}}</span></p>
    <p class="todo-item"><span>启动模式</span><span>{{machineFunction}}</span></p>
    <p class="todo-item"><span>启动时间</span><span>{{time}}</span></p>

    <!-- 第二模块 -->
    <p class="todo-info second-p"><span>创建人：</span><span>{{operatorId}}</span></p>
    <p class="todo-info"><span>创建时间：</span><span>{{createTime}}</span></p>
    <p class="blank"></p>

    <!-- 第三模块 -->
    <p class="about-button">
      <Button btn-type="small" btn-color="spe" class="common-button" @confirm="isDeleteOrNot()">删除</Button>
			<Button btn-type="small" btn-color="spe" class="common-button" @confirm="goTodoDetailEdit()">编辑</Button>
      <Button btn-type="small" btn-color="spe" class="common-button" @confirm="goStart()">立即启动</Button>
    </p>
  </section>
</template>

<script>
import QHeader from '@/components/header';
import Button from "@/components/Button/Button";
import { MessageBox } from 'mint-ui';
  export default {
    data() {
      return {
        title:'待办详情',
        shopName:'联合大厦企鹅1号店',
        machineType:'洗衣机',
        machineFunction: '标准洗',
        time: '2018-08-09 12:00',
        operatorId:'Wendy',
        createTime:'2018-07-15 15:38:05'
      };
    },
    created(){
    },
    methods: {
      isDeleteOrNot() {
        //删除
        MessageBox.confirm('您确定要取消批量启动设备么？').then(action => {	        
	        let instance = this.$toast({
            message: '删除成功',
            iconClass: 'mint-toast-icon mintui mintui-success'
          });
          setTimeout(() => {
            instance.close();
          }, 1000);
          this.$router.push({
            name:'todolist'
          });
	      },
	      action => {
	      	this.$toast({
              message: "已取消",
              position: "middle",
              duration: 3000
            });
	      }
	     );
      },
      goTodoDetailEdit() {
        //编辑
        this.$router.push({
            name:'editTodolist'
          });
      },
      goStart() {
        //立即启动
        MessageBox.confirm('您确定要启动还未到期的设备么？').then(action => {	        
	        let instance = this.$toast({
            message: '启动成功',
            iconClass: 'mint-toast-icon mintui mintui-success'
          });
          setTimeout(() => {
            instance.close();
          }, 1000);
	      },
	      action => {
	      	this.$toast({
              message: "已取消",
              position: "middle",
              duration: 3000
            });
	      }
	     );
      }
    },
    components: {
      QHeader,
      Button
    }
  };
</script>

<style lang="scss" scoped>
.todolist {
  .first-todo-item {
    border-top: 1px solid #F8F8F8;
  }
  .todo-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.35rem;
    padding: 0.3rem;
    border-bottom: 1px solid #F8F8F8;
    background-color: #fff; 
    span {
      &:first-child {
        color:rgba(153,153,153,1);
      }
      &:last-child {
        color:rgba(51,51,51,1);
      }
    }
  }
  .todo-info {
    font-size: 0.1rem;
    background-color: #fff;
    color:rgba(153,153,153,1);
    padding: 0.2rem 0;
    span {
      padding-left: 0.3rem;
    }
  }
  .second-p {
    margin-top: 0.3rem;
  }
  .about-button {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: flex-end;
    .common-button {
      margin: 0.3rem 0;
      width: 2.2rem;
      line-height: 0.9rem;
      height: 0.9rem;
      border-radius: 5px;
      margin-right: 0.3rem;
      color: #333333;
      border-color:#D8D8D8;
    }
  }
}
</style>
