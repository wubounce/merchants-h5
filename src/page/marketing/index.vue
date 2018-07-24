<template>
<div class="marketing">
  <q-header :title="title"></q-header>
  <section class="tab-title">
  	<div v-for="(item,index) in tabtitle" @click="tabclick(index)"><span :class="{tabcurrent:tabindex === index}" >{{item}}</span></div>
  </section>
  <section class="tab-contont">
  	<div class="discount-wrap" v-if="tabindex === 0">
  		<div class="discoun-list">
  			<p class="time">优惠期<span>2018-08-09</span>至<span>2018-08-09</span></p>
  		</div>
  	</div>
  	<div class="VIP-wrap" v-if="tabindex === 1">
  		dgfdgdfgf
  	</div>
  </section>
</div>
</template>
<script>
import QHeader from '@/components/header';
export default {
  data() {
    return {
      title: '营销管理',
      tabtitle:['显示优惠','VIP'],
      tabindex:0,
    };
  },
  mounted() {
    
  },
  created(){
  },
  methods: {
    tabclick(index){
    	this.tabindex = index;
    }
  },
  components:{
    QHeader,
  }
};
</script>
<style type="text/css" lang="less" scoped>
	.tab-title {
		background: #fff;
		width: 100%;
		height: 1.33rem;
		line-height: 1.33rem;
		font-size: 16px;
		color: #333333;
		text-align: center;
		display: flex;
		>div {
			flex: 1;
		}
		.tabcurrent{
			color:#1890FF;
			border-bottom: 0.08rem solid #1890FF;
			border-radius:0.04rem;
			display: inline-block;
		}
		.discoun-list {
			background: #fff;
			margin-top: 0.27rem;
		}

	}
	.discoun-list {
		.time {
			color: #999999;
			font-size: 14px;
			height: 1.17rem;
			line-height: 1.17rem;
		}
	}
	
</style>
