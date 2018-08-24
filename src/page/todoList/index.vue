<template>
  <section class="todolist" v-title="title">
	
  <div class="permissions" v-if="$store.getters.has('mer:schedule:list')">暂无相关页面权限</div>
  <div v-else>
		<p class="shop-item title">批量定时启动设备</p>
		<p v-show="noData" class="noTodoList">暂无待办事项</p>
		<ul>
			<div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}">
				<mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" @translate-change="translateChange" :auto-fill="false" ref="loadmore">
					<li class="list" v-for="(item,index) in list" :key="index"> 
						<router-link :to="{ name: 'todoDetail', query:{id:item.id}}">
							<p class="time"><span>时间</span><span class="time-blue">{{item.beginTime}}</span></p>
							<p class="time"><span>店铺</span><span class="text">{{item.shopName.length>15 ? item.shopName.slice(0,15) + '...' : item.shopName }}</span></p>
							<div class="time display-flex">
								<div class='type'><span>类型</span><span class="text">{{item.machineTypeName}}</span></div>
								<div class='type'><span>模式</span><span class="text">{{item.functionName}}</span></div>
							</div>
						</router-link>
					</li>
					<div v-if="allLoaded" class="nomore-data">没有更多了</div>
				</mt-loadmore>
			</div>
		</ul>
	</div>
  </section>
</template>

<script>
import qs from "qs";
import { listBatchStartFun } from '@/service/todoList';
import {Loadmore} from 'mint-ui';
import { MessageBox } from 'mint-ui';
import PagerMixin from '@/mixins/pagerMixin';
  export default {
	mixins: [PagerMixin],
    data() {
      return {
				title:'待办事项',
				list:[],
				noData:false,
				//分页
				wrapperHeight: 0,//容器高度
				page: 1,//页码
				pageSize:10,
				total:null,
				allLoaded: false//数据是否加载完毕
      };
    },
    methods: {
      async _getList() {
       let obj = {
					page: this.page,
					pageSize: this.pageSize
				};
				let res = await listBatchStartFun(qs.stringify(obj));
				if(res.code===0) {
					//判断该账号是否存在店铺
					if(res.data.total == 0) {
						this.noData = true;
					}
					else {
						this.list = res.data.items?[...this.list,...res.data.items]:[];  //分页添加
						this.total = res.data.total;
					}
				}
				else {
					MessageBox.alert(res.msg,'');
				}
      }
    },
    created() {
      
	},
	mounted() {

	}
  };
</script>

<style lang="scss" scoped>
@import '../../assets/scss/todoList/index';
</style>
