<template>
  <section class="todolist">
		<q-header :title="title"></q-header>
		<p class="shop-item title">批量定时启动设备</p>
		<ul>
			<li v-for="(item,index) in list" :key="index" @click="toDetail"> 
				<p class="time"><span>时间</span><span class="time-blue">{{item.time}}</span></p>
				<p class="time"><span>店铺</span><span class="text">{{item.shopName}}</span></p>
				<div class="time display-flex">
					<div><span>类型</span><span class="text">{{item.machineType}}</span></div>
					<div><span>模式</span><span class="text">{{item.machineFunction}}</span></div>
				</div>
			</li>
		</ul>
  </section>
</template>

<script>
import QHeader from '@/components/header';
  export default {
    data() {
      return {
				title:'待办事项',
				list:[
					{
						time: '2018-08-09 12:00',
						shopName: '1店',
						machineType:'洗衣机',
						machineFunction: '标准洗'
					},
					{
						time: '2018-08-09 12:00',
						shopName: '其实呢在这里我是一个很长的店铺名称哦...',
						machineType:'洗衣机',
						machineFunction: '筒自洁'
					},
					{
						time: '2018-08-09 12:00',
						shopName: '正经店铺名',
						machineType:'洗衣机',
						machineFunction: '筒自洁'
					},
					{
						time: '2018-08-09 12:00',
						shopName: 'smile自然来',
						machineType:'洗衣机',
						machineFunction: '筒自洁'
					},
					{
						time: '2018-08-09 12:00',
						shopName: '行知中学',
						machineType:'洗衣机',
						machineFunction: '筒自洁'
					}
				]
      };
    },
    created(){
    },
    methods: {
      toDetail() {
				this.$router.push({
					name:'todoDetail'
				});
			}
    },
    components: {
			QHeader
    }
  };
</script>

<style lang="scss" scoped>
section {
	.title {
		font-size: 0.4rem;
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
						font-size: 0.35rem;
						padding: 0 0.3rem;
						vertical-align: middle;
						color: rgba(153,153,153,1);
					}
				}
				.time-blue {
					font-size: 0.5rem;
					color: #1890FF;
					vertical-align: middle;
				}
				.text {
					font-size: 0.4rem;
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
