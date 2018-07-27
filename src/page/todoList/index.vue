<template>
  <section class="todolist">
		<q-header :title="title"></q-header>
		<p class="shop-item title">批量定时启动设备</p>
		<ul>
			<li v-for="(item,index) in list" :key="index" @click="toDetail(item.id)"> 
				<p class="time"><span>时间</span><span class="time-blue">{{item.beginTime}}</span></p>
				<p class="time"><span>店铺</span><span class="text">{{item.shopName}}</span></p>
				<div class="time display-flex">
					<div><span>类型</span><span class="text">{{item.machineTypeName}}</span></div>
					<div><span>模式</span><span class="text">{{item.functionName}}</span></div>
				</div>
			</li>
		</ul>
  </section>
</template>

<script>
import qs from "qs";
import QHeader from '@/components/header';
import { listBatchStartFun } from '@/service/todoList';
  export default {
    data() {
      return {
				title:'待办事项',
				list:[]
      };
    },
    methods: {
      toDetail(i) {
        this.$router.push({
          name:'todoDetail',
          query:{
            id: i
          }
        });
      },
      async getListBatchStart() {
        let obj = {
          page : 1,
          pageSize : 10
        };
        let res = await listBatchStartFun(qs.stringify(obj));
        if(res.code ===0 ) {
          this.list = res.data;
        }
      }
    },
    created() {
      this.getListBatchStart();
    },
    components: {
			QHeader
    }
  };
</script>

<style lang="scss" scoped>
section {
	.title {
		font-size: 16px;
		font-weight: bold;
		padding: 0.3rem;
		border: 1px solid #F8F8F8;
		background-color: #fff; 
	}
	ul {
		margin-top: 0.3rem;
		li {
			background-color: #fff;
			margin-bottom: 0.3rem;
			.time {
				padding: 0.1rem;
				border-bottom: 1px solid #F8F8F8;
				span {
					&:first-child {
						font-size: 14px;
						padding: 0 0.3rem;
						vertical-align: middle;
						color: rgba(153,153,153,1);
					}
				}
				.time-blue {
					font-size: 18px;
					color: #1890FF;
					vertical-align: middle;
				}
				.text {
					font-size: 16px;
					vertical-align: middle;
				}
				div {
					&:first-child {
						border-right: 1px solid #DFE6FF;
						padding-right: 2.3rem;
					}
					&:last-child {
						margin-left: 1rem;
					}
				}
			}
			.display-flex {
				display: flex;
			}
		}
	}
}
</style>
