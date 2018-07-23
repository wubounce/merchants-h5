<template>
	<div>
		<mt-tabbar v-model="selected" fixed>
	      <mt-tab-item id="/index">
	        <img slot="icon" src="../assets/img/home/icon_near2x.png">
	        首页
	      </mt-tab-item>
	      <mt-tab-item id="/report">
	        <img slot="icon" src="../assets/img/home/icon_near2x.png">
	        报表
	      </mt-tab-item>
	      <mt-tab-item id="/management">
	        <img slot="icon" src="../assets/img/home/icon_near2x.png">
	        管理
	      </mt-tab-item>
	      <mt-tab-item id="/user">
	        <img slot="icon" src="../assets/img/home/icon_near2x.png">
	        我的
	      </mt-tab-item>
    </mt-tabbar>
	</div>
</template>

<script>
	export default {
		name:'component-menu',
		data() {
			return {
				 selected: '',
			};
		},
		watch: {
	    // $route () {
	    //     console.log('改变路由')
	    //   this.selected = sessionStorage.getItem('pageUrl')
	    // },
	    selected: function (val) {
	      // 这里就可以通过 val 的值变更来确定
	      this.$router.push({
	        path: val
	      });
	      // this.titleText = sessionStorage.getItem('pageTitle')
	    }
	  }
	};
</script>

<style lang="less" scoped>
	
</style>