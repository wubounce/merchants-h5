<template>
  <section class="todolist">
  <div class="permissions" v-if="!$store.getters.has('mer:schedule:info')">暂无相关页面权限</div>
    <div v-if="$store.getters.has('mer:schedule:info')">
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
        <Buttonbottom btn-type="small" btn-color="spe" class="common-button" @confirm="isDeleteOrNot(item.id)" v-has="'mer:schedule:delete'">删除</Buttonbottom>
  			<Buttonbottom btn-type="small" btn-color="spe" class="common-button" @confirm="goTodoDetailEdit(item.id,item.machineParentTypeId,item.shopId)" v-has="'mer:schedule:update'">编辑</Buttonbottom>
        <Buttonbottom btn-type="small" btn-color="spe" class="common-button" @confirm="goStart()" v-has="'mer:schedule:start'">立即启动</Buttonbottom>
      </p>
    </div>
  </section>
</template>

<script>
import Buttonbottom from "@/components/Button/Button";
import { MessageBox } from 'mint-ui';
import { batchStartNowFun , getBatchStartFun , delBatchStartFun } from '@/service/todoList';
  export default {
    data() {
      return {
        item:{}
      };
    },
    methods: {
       isDeleteOrNot() {
        //删除
        MessageBox.confirm('您确定要取消批量启动设备么？','').then(async() => {
          let objDel = { id:this.$route.query.id };
          let resDel = await delBatchStartFun(objDel);
          let instance = this.$toast({
            message: '删除成功',
            iconClass: 'mint-toast-icon mintui mintui-success'
          });
          setTimeout(() => {
            instance.close();
          }, 1000);
          this.$router.go(-1);
	      }
	     );
      },
      goTodoDetailEdit(i,j,k) {
        //编辑
        this.$router.push({
            name: 'editTodolist',
            query: {
              id: i,
              machineParentTypeId: j,
              shopId:k
            }
          });
      },
      goStart() {
        //立即启动
        MessageBox.confirm('您确定要立即批量启动设备么？','').then(async() => {	        
          let obj = {
            id: this.$route.query.id
          };
          let res = await batchStartNowFun(obj);
          this.$toast({
              message: '全部启动成功',
              position: "middle",
              duration: 3000
            });
          this.$router.go(-1);
	      },
	      action => {
	      }
	     );
      },
      async getBatchStart() {
        let obj ={
          id:this.$route.query.id,
          page:1,
          pageSize: 10
        };
        let res = await getBatchStartFun(obj);       
        //参数异常，待后台确认
        this.item = res;
        this.item.createTime = moment(res.createTime).format('YYYY-MM-DD HH:mm:ss');
        if(res.shopName.length>15) {
          this.item.shopName = res.shopName.slice(0,15) + '...';
        }
        else {
          this.item.shopName = res.shopName;
        }
      }
    }, 
    created() {
      this.getBatchStart();
    },
    components: {
      Buttonbottom
    }
  };
</script>

<style lang="scss" scoped>
@import '../../assets/scss/todoList/todoDetail';
</style>
