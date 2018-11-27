<template>
<div class="addmember">
 <div class="permissions" v-if="!$store.getters.has('mer:person:info')">暂无相关页面权限</div>
  <div v-if="$store.getters.has('mer:person:info')">
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
      
      <div class="prem-list">
        <p class="prem-wrap-title">权限</p>
        <div class="pid-list" v-for="(item,index) in permissionsData" :key="index">
          <span v-if="item.name==='首页'||item.name==='报表'">{{item.name}}</span>
          <p class="pid-title" v-else>{{item.name}}</p>
          <span v-for="(sitem,index) in item.children" :key="index">{{sitem.name}}</span>
        </div>
      </div>
    </div>
    <div class="input-group createtime">
      <div class="form-title">创建时间</div>
      <div class="form-input">{{detail.createTime}}</div>
    </div>
    <!--充当占位符的div块，无实质内容 -->
    <div style="height:1.73rem"></div> 

    <div class="footer">
      <span class="edit"  v-has="'mer:person:update,mer:person:info'"><router-link :to="{name:'editMember',query:{ id:detail.id,issearch:$route.query.issearch  }}">编辑</router-link></span>
      <span class="del" @click="deldelMember(detail.id)" v-has="'mer:person:delete,mer:person:info'">删除</span>
    </div>
  </div>
</div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import { getOperatorInfoFun, delOperatorFun } from '@/service/member';
import { getTrees, removeMember} from '@/utils/tool';
export default {
  data() {
    return {
      detail:{},
      permissionsData:[],
      query:{},
    };
  },
  mounted() {
    removeMember();//清除localStorage
  },
  created(){
    this.query = this.$route.query?this.$route.query:{};
    this.getOperatorInfo(this.query.id);
  },
  methods: {
    async getOperatorInfo(id){
      let res = await getOperatorInfoFun({id:id});
      this.detail = res;
      this.permissionsData = getTrees(res.list,0);
    },
    deldelMember(id){
      MessageBox.confirm(`确认删除？`,'').then(async () => {
        let payload = {id:this.query.id};
        let res = await delOperatorFun(payload);
        this.$toast({message: '删除成功' });
        this.query.issearch == true ? this.$router.go(-2) : this.$router.go(-1);
      });
    }
  },
  beforeRouteLeave (to, from, next) {
    if(to.name === 'memeberSearch'){
      next();
      this.$router.replace({name: 'memeberSearch',query:{searchData: this.query.searchData}});//返回键要返回的路由
    }else {
      next();
    }
  }
};
</script>
<style type="text/css" lang="scss" scoped>
@import '../../assets/scss/member/detailmember';
.prem-list {
  padding-top:0.33rem;
  padding-bottom:0.0rem;
}
.prem-wrap-title {
  font-weight:400;
  color:#999;
  line-height:0.6rem;
  font-size: 16px;
  padding-bottom: 0.47rem;
}
.prem-list {
  span {
    background:rgba(24,144,255,0.05);
    border-radius:0.11rem;
    font-size: 14px;
    display: inline-block;
    line-height: 0.53rem;
    padding:0.08rem 0.29rem;
    margin-right: 0.27rem;
    margin-bottom: 0.27rem;
    color: #333;
  }
}
.pid-title {
  font-size:11px;
  font-weight:400;
  color:#999999;
  line-height:0.4rem;
  margin-top: 0.27rem;
  margin-bottom: 0.13rem;
}
</style>

