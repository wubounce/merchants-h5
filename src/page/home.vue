<template>
	<div class="home">
		<router-view></router-view>
		<mt-tabbar v-model="selected" fixed>
	      <mt-tab-item id="/index" v-if="$store.getters.has('mer:index')">
	      	<img slot="icon" src="../../static/image/index/index@2x.png" v-if="selected === '/index'">
	        <img slot="icon" src="../../static/image/index/index-grey@2x.png" v-else>
	        首页
	      </mt-tab-item>
	      <mt-tab-item id="/report" v-if="$store.getters.has('mer:report')">
	        <img slot="icon" src="../../static/image/index/report@2x.png" v-if="selected === '/report'">
	        <img slot="icon" src="../../static/image/index/report-grey@2x.png"  v-else>
	        报表
	      </mt-tab-item>
	      <mt-tab-item id="/management" v-if="$store.getters.has('mer:shop:list')||$store.getters.has('mer:machine:list')||$store.getters.has('mer:order:list')||$store.getters.has('mer:schedule:list')||$store.getters.has('mer:marketing:list')||$store.getters.has('mer:marketing:vip:list')||$store.getters.has('mer:person:list')">
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
				selected: '/user',
			};
		},
		created: function(){
          	let localData = getNavTabIndex();
          	this.selected = localData;
	    },
		components:{
		},
		watch: {
			$route () {
				if (this.$route.path==='/index' || this.$route.path==='/report' ||this.$route.path==='/management' ||this.$route.path==='/user'){
					this.selected = this.$route.path;
				}
		      
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
	border-top: 1px solid #f9f8ff;
	z-index: 9999999;
}
</style>