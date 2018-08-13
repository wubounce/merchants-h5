<template>
	<div class="home">
		<router-view></router-view>
		<mt-tabbar v-model="selected" fixed>
	      <mt-tab-item id="/index">
	      	<img slot="icon" src="../../static/image/index/index@2x.png" v-if="selected === '/index'">
	        <img slot="icon" src="../../static/image/index/index-grey@2x.png" v-else>
	        首页
	      </mt-tab-item>
	      <mt-tab-item id="/report">
	        <img slot="icon" src="../../static/image/index/report@2x.png" v-if="selected === '/report'">
	        <img slot="icon" src="../../static/image/index/report-grey@2x.png"  v-else>
	        报表
	      </mt-tab-item>
	      <mt-tab-item id="/management">
	        <img slot="icon" src="../../static/image/index/mang@2x.png" v-if="selected === '/management'">
	        <img slot="icon" src="../../static/image/index/mang-grey@2x.png"  v-else>
	        管理
	      </mt-tab-item>
	      <mt-tab-item id="/user">
	        <img slot="icon" src="../../static/image/index/userinfo@2x.png" v-if="selected === '/user'">
	        <img slot="icon" src="../../static/image/index/userinfo-grey@2x.png"  v-else>
	        我的
	      </mt-tab-item>
    </mt-tabbar>
	</div>
</template>

<script>
import { setNavTabIndex, getNavTabIndex} from '@/utils/tool';
	export default {
		data() {
			return {
				selected: '/index',
			};
		},
		 created: function(){
		 	let currentPath = this.$route.path;
          	let localData = getNavTabIndex();
          	this.selected = localData?localData:currentPath;
	    },
		components:{
		},
		watch: {
		$route () {
	      this.selected = this.$route.path;
	    },
		selected: function (val) {
		      this.$router.push({path: val});
		       setNavTabIndex(val);
		    }
		 }
	};
</script>

<style lang="scss" scoped>
.home .mint-tabbar > .mint-tab-item.is-selected {
    background-color: #fff;
    color: #1890FF;
}
.home .mint-tabbar{
	background: #fff;
	border-top: 1px solid #D8D8D8;
}
</style>