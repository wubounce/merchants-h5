<template>
	<div class="helpCenterDetail-wrapper">	
		<div class="head"><p>{{detail.questionTitle}}</p></div>
    <div class="help-detail" v-html="detail.answerContent"></div>
	</div>
</template>
<script>
import { detailFun } from '@/service/help';
    export default {
		data() {			
			return {                                
       detail:{}                       
			};
		},
		created(){
			this.getHelpDetail();
		},
		methods:{
      //获取帮助详情
			async getHelpDetail(){
        let payload = {id:this.$route.query.id};
        let res = await detailFun(payload);
        this.detail = res;
			},			
    },
	}; 
</script>

<style lang="scss" scoped>
	.helpCenterDetail-wrapper{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background-color: #fff;
    .head{
        padding: 0 .15rem;
        p{
            font-size: 16px;
            padding: .29rem .38rem;
            border-bottom: 1px solid #f9f8ff;
            line-height: .5rem;
            color: #666;
        }
    }
    .help-detail{
        margin: 0.29rem;
        color: #999;
        font-size: 14px;
        line-height: .45rem;        
        p{
            text-indent: 2em;
        }
    }
}
</style>
