<template>
<div class="addmember" v-title="title">
 <div class="permissions" v-if="$store.getters.has('mer:person:info')">暂无相关页面权限</div>
  <div v-else>
    <div class="add-form">
      <div class="input-group">
        <div class="form-title">手机号码</div>
        <div class="form-input">{{detail.phone}}</div>
      </div>
      <div class="input-group">
        <div class="form-title">姓名</div>
        <div class="form-input">{{detail.realName}}</div>
      </div>
      <div class="input-group">
        <div class="form-title">负责店铺</div>
        <div class="form-input">{{detail.operateShopNames}}</div>
      </div>
      <div class="input-group" style="border:none">
        <div class="form-title">权限</div>
        <div class="form-input"><span v-for="(item,index) in detail.list" :key="index">{{item.name}}<i v-if="index !== (detail.list.length-1)">,</i></span></div>
      </div>
    </div>
    <div class="input-group createtime">
      <div class="form-title">创建时间</div>
      <div class="form-input">{{detail.createTime}}</div>
    </div>
    <div class="footer">
      <span class="edit"  v-has="'mer:person:update,mer:person:info'"><router-link :to="{name:'editMember',query:{ id:detail.id }}">编辑</router-link></span>
      <span class="del" @click="deldelMember(detail.id)" v-has="'mer:person:delete,mer:person:info'">删除</span>
    </div>
  </div>
</div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import { getOperatorInfoFun, delOperatorFun } from '@/service/member';
export default {
  data() {
    return {
      title: '人员详情',
      detail:{}
    };
  },
  mounted() {
    
  },
  created(){
    let query = this.$route.query;
    this.getOperatorInfo(query.id);
  },
  methods: {
    async getOperatorInfo(id){
      let res = await getOperatorInfoFun({id:id});
      this.detail = res;
    },
    deldelMember(id){
      MessageBox.confirm(`确认删除？`,'').then(async () => {
        let query = this.$route.query;
        let payload = {id:query.id};
        let res = await delOperatorFun(payload);
        this.$toast({message: '删除成功' });
        this.$router.push({name:'member'});
        
      });
    }
  },
  components:{
  }
};
</script>
<style type="text/css" lang="scss" scoped>
@import '../../assets/scss/member/detailmember';
</style>

