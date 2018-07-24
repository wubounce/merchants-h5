<template>
  <div class="todolist">
   	<div class="todo-wrap">
   		<div class="tod-list">
   			<p class="title">批量定时启动设备</p>
   			<div class="todo-type">
   				<p><span class="type">时间</span>2018-08-09 12:00</p>
   				<p><span class="type">店铺</span>联合大厦企鹅1号店</p>
   				<p><span class="type">类型</span>洗衣机</p>
   				<p><span class="type">模式</span><span style="color:#13C2C2">白色特脏大物洗</span></p>
   			</div>
   		</div>
   		<section class="listaction"> 
	        <span>编辑</span>
	        <span>立即启动</span>
	        <span>取消</span>
	    </section>
   	</div>
   		<div class="todo-wrap">
   		<div class="tod-list">
   			<p class="title">批量定时启动设备</p>
   			<div class="todo-type">
   				<p><span class="type">时间</span>2018-08-09 12:00</p>
   				<p><span class="type">店铺</span>联合大厦企鹅1号店</p>
   				<p><span class="type">类型</span>洗衣机</p>
   				<p><span class="type">模式</span><span style="color:#13C2C2">白色特脏大物洗</span></p>
   			</div>
   		</div>
   		<section class="listaction"> 
	        <span>编辑</span>
	        <span>立即启动</span>
	        <span>取消</span>
	    </section>
   	</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      };
    },
    created(){
    },
    methods: {
      
    },
    components: {
     
    }
  };
</script>

<style lang="scss" scoped>
	.todo-wrap {
		margin-bottom: 0.27rem;
	}
  .tod-list {
  	background: #fff;
  	padding:0.4rem;
  	.title {
  		height: 1.27rem;
  		line-height: 1.27rem;
		font-size:16px;
		color:#333333;
  	}
  	.todo-type {
  		background:rgba(248,252,255,1);
		border-radius:4px;
		padding:0.4rem;
		p {
			height:0.53rem;
			font-size:14px;
			color:#333;
			line-height:0.53rem;
			margin-bottom: 0.28rem;
		}
		.type {
			display: inline-block;
			height:0.53rem;
			line-height:0.53rem;
			color: #1890FF;
			padding:0 0.16rem;
			margin-right: 0.43rem;
			background:rgba(224,242,255,1);
			border-radius:0.12rem;

		}
  	}
  }
  .listaction {
    background: #fff;
    overflow: hidden;
    padding: 0.266667rem;
    span {
      float: right;
      width:2.133333rem;
      height:0.8rem;
      line-height: 0.8rem;
      border-radius:0.106667rem;
      border:0.026667rem solid rgba(216,216,216,1);
      font-size: 14px;
      color: #333;
      text-align: center;
      margin:0 0.133333rem;
    }
  }
</style>
