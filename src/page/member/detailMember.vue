<template>
<div class="addmember" v-title="title">
  <div class="add-form">
    <div class="input-group">
      <div class="form-title">用户名</div>
      <div class="form-input">{{detail.username}}</div>
    </div>
    <div class="input-group">
      <div class="form-title">手机</div>
      <div class="form-input">{{detail.phone}}</div>
    </div>
    <div class="input-group">
      <div class="form-title">负责店铺</div>
      <div class="form-input">{{detail.operateShopNames}}</div>
    </div>
    <div class="input-group" style="border:none">
      <div class="form-title">权限</div>
      <div class="form-input" style="text-align:left"><span v-for="(item,index) in detail.list" :key="index">{{item.name}}<i v-if="index !== (detail.list.length-1)">,</i></span></div>
    </div>
  </div>
  <div class="input-group createtime">
    <div class="form-title">创建时间</div>
    <div class="form-input">{{detail.createTime}}</div>
  </div>
  <div class="footer">
    <span class="edit"><router-link :to="{name:'editMember',query:{ id:detail.id }}">编辑</router-link></span>
    <span class="del" @click="deldelMember(detail.id)">删除</span>
  </div>
</div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import qs from 'qs';
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
      let res = await getOperatorInfoFun(qs.stringify({id:id}));
      if (res.code === 0) {
        this.detail = res.data;
      }
    },
    deldelMember(id){
      MessageBox.confirm(`确认删除？`).then(async () => {
        let query = this.$route.query;
        let payload = {id:query.id};
        let res = await delOperatorFun(qs.stringify(payload));
        if (res.code === 0) {
          this.$toast({message: '删除成功' });
           this.$router.push({name:'member'});
        } else {
          this.$toast({message: res.msg });
        }
      });
    }
  },
  components:{
  }
};
</script>
<style type="text/css" lang="less" scoped>
  .add-form {
    padding-left: 0.4rem;
    background: #fff;
  }
  .input-group {
    display: flex;
    border-bottom:1px solid rgba(223,230,255,1);
    font-size: 16px;
    padding: 0.53rem 0;
  }
  .form-title {
    width: 30%;
    color:#999;
  }
  .form-input {
    width: 66%;
    text-align: right;
    color: #333;
  }
  .createtime {
    padding-left: 0.4rem;
    border:none;
    margin-top:0.4rem;
    background:#fff
  }
  .footer {
    width: 100%;
    background: #fff;
    position: fixed;
    bottom: 0;
    font-size: 14px;
    padding: 0.28rem 0;
    > span {
      float: right;
      width: 2.4rem;
      height: 0.8rem;
      line-height: 0.8rem;
      border-radius: 0.11rem;
      text-align: center;
      margin-right: 0.4rem;
    }
    .del {
      border: 1px solid rgba(216,216,216,1);
    }
    .edit {
      border: 1px solid  #1890FF;
      a {
      color: #1890FF;

      }
    }
  }
</style>
<style lang="scss">
  .addmember .mint-header {
    background: #fff !important;
    border-bottom: 1px solid #DCE0E6;
  }
</style>
