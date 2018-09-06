<template>
<div class="addmember" v-title="title">
  <div class="add-form">
    <div class="input-group"  @click="openShop">
      <div class="form-title"><span>负责店铺</span></div>
      <div class="form-input"><span :class="['more',{'more-color':checkshoptxt === ''}]">{{checkshoptxt?checkshoptxt:'请选择店铺'}}</span><span class="forward iconfont icon-nextx"></span></div>
    </div>
    <div class="input-group" style="border:none" @click="openPrem">
      <div class="form-title"><span>权限</span></div>
      <div class="form-input"><span :class="['more',{'more-color':permissionsMIdsTxt === ''}]">{{permissionsMIdsTxt?permissionsMIdsTxt:'请选择权限'}}</span><span class="forward iconfont icon-nextx"></span></div>
    </div>
  </div>
  <div class="input-group createtime">
    <div class="form-title">创建时间</div>
    <div class="form-input">{{createTime}}</div>
  </div>
  <mt-button class="confirm" @click="addmember">提交</mt-button>
</div>
</template>
<script>
import { mapState } from 'vuex';
import { validatPhone, validatName } from '@/utils/validate';
import { shopListFun, getOperatorInfoFun, updateOperatorInfoFun, permsMenuFun } from '@/service/member';
import { getTrees, setMember, getMember, removeMember } from '@/utils/tool';
export default {
  data() {
    return {
      title: '新增人员',

      allmenu:[],
      permissionsData:[],
      permissionsMIdsTxt:'',
      checkpermissionslist: [],

      shoplist:[],
      operateShopIds:[],
      parentIds:[],
     
      eitedid:null,
      checkshoptxt:'',
      createTime:null,

      localData:{}
    };
  },
  mounted() {
    
  },
  created(){
    this.shopListFun();
    this.menuSelect();
    this.localData = getMember() ? getMember() :{};
    this.updateOperatorId = this.$route.query.id?this.$route.query.id:this.$route.query.updateOperatorId;
    this.createTime = this.localData.createTime;
    this.parentIds = this.localData.parentIds ? this.localData.parentIds:[];
    this.operateShopIds = this.localData.operateShopIds ? this.localData.operateShopIds: [];
    this.checkpermissionslist = this.localData.checkpermissionslist ? this.localData.checkpermissionslist: [];
  },
  computed: {
      
  },
  methods: {
    validate() {
      if (this.operateShopIds.length <= 0) {
        this.$toast({message: '请选择店铺' });
        return false;
      }
      if (this.checkpermissionslist.length <= 0) {
        this.$toast({message: '请选择权限' });
        return false;
      }
      return true;
    },
    async getOperatorInfo(id){
      let res = await getOperatorInfoFun({id:id});
        this.createTime = res.createTime;
        this.checkshoptxt = res.operateShopNames;
        let updateOperateShopIds = res.operateShopNames ? res.operateShopNames.split(',') :[];
        updateOperateShopIds = this.shoplist.filter(v=>updateOperateShopIds.some(k=>k==v.shopName));
        this.operateShopIds = updateOperateShopIds.map(item=>item.shopId);
        this.checkpermissionslist = res.list.map(item=>item.menuId);

        // let max = this.permissionsData[0];
        // for ( let i = 1; i < this.permissionsData.length; i++) {// 求出一组数组中的最大值
        //   if (max.menuId < this.permissionsData[i].menuId) {
        //     max = this.permissionsData[i].menuId;
        //   }
        // }
        this.parentIds = res.list.filter(item=>item.menuId<=9).map(item=>item.menuId); //在父级id中去掉首页和报表
        this.checkpermissionslist = this.checkpermissionslist.filter(v=> this.parentIds.indexOf(v) == -1); //取差集
        this.permissionsMIdsTxt = res.list.map(item=>item.name).join(',');
    },
    async menuSelect(){
      let res = await permsMenuFun(); //拼接权限菜单
      this.allmenu = res;
      this.permissionsData = getTrees(res,0);
      this.addPermissions();
    },
    async shopListFun(){
      let res = await shopListFun();
      this.shoplist = res;
      if (this.$route.query.id) {
        this.getOperatorInfo(this.updateOperatorId);
      }
      this.getcheckshop();
    },
    getcheckshop(){
      let checklist = this.shoplist.filter(v=>this.operateShopIds.some(k=>k==v.shopId));
      this.checkshoptxt = checklist.map(item=>item.shopName).join(',');
    },
    addPermissions(){
      let checklist = this.allmenu.filter(v=>this.checkpermissionslist.some(k=>k==v.menuId));
      this.permissionsMIdsTxt = checklist.map(item=>item.name).join(',');
    },
    openPrem(){
      setMember(this.setMemberdata());
      this.$router.push({name:'premList',query:{updateOperatorId:this.updateOperatorId}});
    },
    openShop(){
     setMember(this.setMemberdata());
      this.$router.push({name:'premshopList',query:{updateOperatorId:this.updateOperatorId}});
    },
    setMemberdata(){
      let setData = {
          createTime:this.createTime,
          operateShopIds:this.operateShopIds,
          checkpermissionslist:this.checkpermissionslist,
          parentIds:this.parentIds,
      };
      return setData;
    },
    async addmember(){
      if (this.validate()) {
        let menshopids = [];
        this.operateShopIds.forEach(item=>menshopids.push(`'${item}'`));
        let mIds = [...this.checkpermissionslist,... this.parentIds];
        mIds = Array.from(new Set([...mIds]));//去重
        let payload = {
          id:this.updateOperatorId,
          operateShopIds:menshopids.join(','),
          mIds:mIds.join(',')
        };
        let res = await updateOperatorInfoFun(payload);
        this.$toast({message: '修改成功' });
        this.$router.push({name:'member'});
        removeMember();//新增成功清楚localhostStorage
      }
    }
  },
  components:{
  }
};
</script>
<style type="text/css" lang="scss" scoped>
  @import '../../assets/scss/member/adddmember';
  .createtime {
    padding-left: 0.4rem;
    border:none;
    margin-top:0.4rem;
    background:#fff;
    font-size: 16px;
    padding: 0.53rem 0.4rem;
    display: flex;
    .form-input {
      width: 70%;
      text-align: right;
    }
    .form-title {
      color: #999;
    }
  }

</style>

