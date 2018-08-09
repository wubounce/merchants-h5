<template>
  <section class="todolist" v-title="title">
	
  <div class="permissions" v-if="$store.getters.has('mer:schedule:list')">暂无相关页面权限</div>
  <div v-else>
		<p class="shop-item title">批量定时启动设备</p>
		<p v-show="noData" class="noTodoList">暂无待办事项</p>
		<ul>
			<div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
				<mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
					<li class="list" v-for="(item,index) in list" :key="index" @click="toDetail(item.id)"> 
						<p class="time"><span>时间</span><span class="time-blue">{{item.beginTime}}</span></p>
						<p class="time"><span>店铺</span><span class="text">{{item.shopName.length>15 ? item.shopName.slice(0,15) + '...' : item.shopName }}</span></p>
						<div class="time display-flex">
							<div class='type'><span>类型</span><span class="text">{{item.machineTypeName}}</span></div>
							<div class='type'><span>模式</span><span class="text">{{item.functionName}}</span></div>
						</div>
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
  export default {
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
			loadBottom() {
				this.page += 1;
				let allpage = Math.ceil(this.total/this.pageSize);
				if(this.page <= allpage){
					this.getListBatchStart();
				}else{
					this.allLoaded = true;//模拟数据加载完毕 禁用上拉加载
				}
				this.$refs.loadmore.onBottomLoaded();
			},
			loadTop() {
				this.page = 1;
				this.list = [];
				this.getListBatchStart();
				this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
				this.$refs.loadmore.onTopLoaded();
			},
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
					MessageBox.alert(res.msg);
				}
      }
    },
    created() {
      this.getListBatchStart();
		},
		mounted() {
			let windowWidth = document.documentElement.clientWidth;//获取屏幕高度
			this.wrapperHeight = document.documentElement.clientHeight;
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
	.noTodoList {
		text-align: center;
    color: #999;
    font-size: 16px;
    padding-top: 4rem;
	}
	ul {
		margin-top: 0.3rem;
		.page-loadmore-wrapper {
      overflow: scroll;
			.list {
				background-color: #fff;
				margin-bottom: 0.3rem;
				.time {
					padding: 0.2rem;
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
						}
						&:last-child {
							//margin-left: 1rem;
						}
					}
				}
				.display-flex {
					display: flex;
					.type {
						width: 50%;
					}
				}
			}
			.nomore-data {
        text-align: center;
        color: #999;
        font-size: 12px;
        margin-bottom: 0.266667rem;
      }
		}
	}
}
</style>
