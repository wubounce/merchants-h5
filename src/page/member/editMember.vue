<template>
<div class="addmember">
  <div class="add-form">
    <div class="input-group"  @click="shopVisible=true">
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

   <!-- 选择店铺 -->
  <mt-popup v-model="shopVisible" position="bottom" :closeOnClickModal="false">
    <div class="resp-shop">
      <span class="quxi" @click="cancelCheckshop">取消</span>
      <span class="shop">负责店铺</span>
      <span class="qued" @click="getcheckshop">确定</span>
    </div>
    <div class="search-header">
      <section class="sarch-wrap">
        <div class="search">
            <form action="" target="frameFile">
              <span class="iconfont icon-IconSearch"></span><input type="text" v-model.trim="searchData" placeholder="请输入相关店铺名称" class="serch">
            </form>
        </div>
      </section>
    </div>
    <section class="shop-touch">
      <div class="all-list">
        <label class="mint-checklist-label" v-for="(item,index) in shoplist" :key="index">
          <span class="mint-checkbox is-right">
            <input type="checkbox" class="mint-checkbox-input" v-model="operateShopIds" :value="item.shopId"> 
            <span class="mint-checkbox-core"></span>
          </span> 
          <p class="mint-checkbox-label shopname">{{item.shopName}}</p>
          <p class="mint-checkbox-label shopdesc">{{item.address}}</p>
        </label>
      </div>
    </section>
  </mt-popup>

</div>
</template>
<script>
import { mapState } from 'vuex';
import { validatPhone, validatName } from '@/utils/validate';
import { shopListFun, getOperatorInfoFun, updateOperatorInfoFun, permsMenuFun } from '@/service/member';
import { getTrees, setMember, getMember, removeMember, delay } from '@/utils/tool';
export default {
  data() {
    return {
      allmenu:[],
      permissionsData:[],
      permissionsMIdsTxt:'',
      checkpermissionslist: [],

      shoplist:[],
      allshoplist:[],
      shopVisible:false,
      operateShopIds:[],
      parentIds:[],
     
      eitedid:null,
      checkshoptxt:'',
      createTime:null,

      query:{},
      searchData:''
    };
  },
  created() {
    this.query = this.$route.query ? this.$route.query :{};
    this.updateOperatorId = this.query.id?this.query.id:this.query.updateOperatorId;
    this.shopListFun();
    this.menuSelect();
  },
  mounted() {

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

        let max = this.permissionsData[0];
        for ( let i = 1; i < this.permissionsData.length; i++) {// 求出一组数组中的最大值
          if (max.menuId < this.permissionsData[i].menuId) {
            max = this.permissionsData[i].menuId;
          }
        }
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
      this.allshoplist = res;
      this.shoplist = res;
      if (this.$route.query.id) {
        this.getOperatorInfo(this.updateOperatorId);
      }
    },
    async serachshopListFun(){
      let payload = {shopName:this.searchData};
      let res = await shopListFun(payload);
      this.shoplist = res;
    },
    getcheckshop(){
      this.searchData = '';
      let checklist = this.allshoplist.filter(v=>this.operateShopIds.some(k=>k==v.shopId));
      this.shopVisible = false;
      this.checkshoptxt = checklist.map(item=>item.shopName).join(',');
    },
    cancelCheckshop(){
      this.searchData = '';
      let canceIds = this.checkshoptxt ?  this.checkshoptxt.split(',') :[];
      canceIds = this.allshoplist.filter(v=>canceIds.some(k=>k==v.shopName));
      this.operateShopIds = canceIds.map(item=>item.shopId);
      this.shopVisible = false;
    },
    addPermissions(){
      let checklist = this.allmenu.filter(v=>this.checkpermissionslist.some(k=>k==v.menuId));
      this.permissionsMIdsTxt = checklist.map(item=>item.name).join(',');
    },
    openPrem(){
      this.$router.replace({name:'premList',query:{updateOperatorId:this.updateOperatorId,checkpermissionslist:this.checkpermissionslist.join(','),parentIds:this.parentIds.join(',')}});
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
        this.$route.query.issearch == true ? this.$router.go(-3) : this.$router.go(-2);
      }
    }
  },
  watch: {
    $route(to,from) {
      if(from.name === 'premList') {
        this.query = this.$route.query ? this.$route.query :{};
        this.parentIds = this.query.parentIds ? this.query.parentIds.split(','): []; //权限父级id
        this.checkpermissionslist = this.query.checkpermissionslist ? this.query.checkpermissionslist.split(','): [];
        this.addPermissions();
      }else if(from.name === 'detailMember'){
        this.query = this.$route.query ? this.$route.query :{};
        this.updateOperatorId = this.query.id?this.query.id:this.query.updateOperatorId;
        this.shopListFun();
        this.menuSelect();
      }
    },
    shopVisible: function () {
      if (this.shopVisible) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    },
    searchData: function (newVal) {
      if (newVal) {
        delay(() => {
        this.serachshopListFun();
        }, 200);
      }else {
        this.serachshopListFun();
      }
    },
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
<style lang="scss">
  .addmember .mint-checklist-label {
    padding: 0.27rem 0;
    border-bottom:1px solid #f9f8ff;
  }
  .addmember .prom {
    padding: 0 0.4rem;
    border:none;
  }
    
  .addmember .el-checkbox__inner {
    border-radius: 50%;
    width: 0.45rem;
    height: 0.45rem;
  }
 .addmember .mint-checkbox-core::after {
    left: 7px;
  }
</style>

