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
import { getTrees} from '@/utils/tool';
export default {
  data() {
    return {
      title: '人员详情',
      detail:{},
      permissionsData:[],
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
      this.permissionsData = getTrees(res.list,0);
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
  beforeRouteLeave(to, from, next) {
    // 设置下一个路由的 meta
    to.meta.keepAlive = false; // C 跳转到 A 时让 A 不缓存，即刷新
    next();
  },
  components:{
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

