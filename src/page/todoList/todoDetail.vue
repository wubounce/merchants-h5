<template>
  <section class="todolist" v-title="title">
  <div class="permissions" v-if="$store.getters.has('mer:schedule:info')">暂无相关页面权限</div>
    <div v-else>
      <!-- 第一模块 -->
      <p class="todo-item first-todo-item"><span>所属店铺</span><span>{{ item.shopName }}</span></p>
      <p class="todo-item"><span>设备类型</span><span>{{item.machineTypeName}}</span></p>
      <p class="todo-item"><span>启动模式</span><span>{{item.functionName}}</span></p>
      <p class="todo-item"><span>启动时间</span><span>{{item.beginTime}}</span></p>

      <!-- 第二模块 -->
      <p class="todo-info second-p"><span>创建人：</span><span>{{item.createUser}}</span></p>
      <p class="todo-info"><span>创建时间：</span><span>{{item.createTime}}</span></p>
      <p class="blank"></p>

      <!-- 第三模块 -->
      <p class="about-button">
        <Button btn-type="small" btn-color="spe" class="common-button" @confirm="isDeleteOrNot(item.id)" v-has="'mer:schedule:delete'">删除</Button>
  			<Button btn-type="small" btn-color="spe" class="common-button" @confirm="goTodoDetailEdit(item.id,item.machineParentTypeId)" v-has="'mer:schedule:update'">编辑</Button>
        <Button btn-type="small" btn-color="spe" class="common-button" @confirm="goStart()" v-has="'mer:order:reset,mer:order:info'">立即启动</Button>
      </p>
    </div>
  </section>
</template>

<script>
import qs from "qs";
import Button from "@/components/Button/Button";
import { MessageBox } from 'mint-ui';
import { getBatchStartFun } from '@/service/todoList';
import { delBatchStartFun } from '@/service/todoList';
import { batchStartNowFun } from '@/service/todoList';
import moment from 'moment';
  export default {
    data() {
      return {
        title:'待办详情',
        item:{}
      };
    },
    methods: {
      async isDeleteOrNot() {
        //删除
        MessageBox.confirm('您确定要取消批量启动设备么？','').then(action => {
          let objDel = { id:this.$route.query.id };
          let resDel = delBatchStartFun(qs.stringify(objDel));

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
      goTodoDetailEdit(i,j) {
        //编辑
        this.$router.push({
            name: 'editTodolist',
            query: {
              id: i,
              machineParentTypeId: j
            }
          });
      },
      goStart() {
        //立即启动
        MessageBox.confirm('您确定要立即批量启动设备么？').then(async() => {	        
          let obj = {
            shopId: this.item.shopId,
            firstTypeId: this.item.machineParentTypeId,
            standardFunctionId: this.item.standardFunctionId
          };
          let res = await batchStartNowFun(qs.stringify(obj));
          if(res.code===0) {
           this.$toast({message: '启动成功' });
           this.$router.push({name:'todolist'});
          }
          else {
           this.$toast({message: res.msg });
          }
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
          this.item.createTime = moment(res.data.createTime).format('YYYY-MM-DD HH:mm:ss');
          if(res.data.shopName.length>15) {
            this.item.shopName = res.data.shopName.slice(0,15) + '...';
          }
          else {
            this.item.shopName = res.data.shopName;
          }
        }
      }
    }, 
    created() {
      this.getBatchStart();
    },
    components: {
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
    font-size: 16px;
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
    font-size: 12px;
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
      font-size: 14px;
    }
  }
}
</style>
