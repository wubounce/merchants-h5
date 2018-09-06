<template>
<div class="addmember" v-title="title">
  <div class="add-form">
    <div class="input-group">
      <div class="form-title"><span>手机号码</span></div>
      <div class="form-input"><input type="number" v-model="phone" @blur="validatPhone" @input="disabledBtn" placeholder="请输入手机号"></div>
    </div>
    <div class="input-group">
      <div class="form-title"><span>姓名</span></div>
      <div class="form-input"><input type="text" v-model="username" @blur="validatName" @input="disabledBtn" maxlength="20" placeholder="请输入姓名"></div>
    </div>
    <div class="input-group"  @click="openShop">
      <div class="form-title"><span>负责店铺</span></div>
      <div class="form-input"><span :class="['more',{'more-color':checkshoptxt === ''}]">{{checkshoptxt?checkshoptxt:'请选择店铺'}}</span><span class="forward iconfont icon-nextx"></span></div>
    </div>
    <div class="input-group" style="border:none" @click="openPrem">
      <div class="form-title"><span>权限</span></div>
      <div class="form-input"><span :class="['more',{'more-color':permissionsMIdsTxt === ''}]">{{permissionsMIdsTxt?permissionsMIdsTxt:'请选择权限'}}</span><span class="forward iconfont icon-nextx"></span></div>
    </div>
  </div>
  <mt-button class="confirm" @click="addmember" :disabled="disabled">提交</mt-button>
</div>
</template>
<script>
import { mapState } from 'vuex';
import { validatPhone, validatName } from '@/utils/validate';
import { shopListFun, addOperatorFun, permsMenuFun } from '@/service/member';
import { getTrees} from '@/utils/tool';
export default {
  data() {
    return {
      title: '新增人员',
      disabled:true,

      allmenu:[],
      permissionsData:[],
      permissionsMIdsTxt:'',
      checkpermissionslist: [],

      shoplist:[],
      operateShopIds:[],
      username:'',
      phone:'',
     
      checkshoptxt:'',

      query:{}
    };
  },
  mounted() {
    
  },
  created(){
    this.query = this.$route.query ? this.$route.query :{};
    console.log(this.query);
    this.shopListFun();
    this.menuSelect();
  },
  computed: {
      
  },
  methods: {
    disabledBtn(){
      if (!this.phone || !this.username) {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
    },
    validate() {
      if (this.phone === '') {
        this.$toast({message: '请输入手机号码' });
        return false;
      }else if (!validatPhone(this.phone)) {
        this.$toast({message: '请输入正确的手机号码' });
        return false;
      }
      if (this.username === '') {
        this.$toast({message: '请输入用户名' });
        return false;
      }
      if (!validatName(this.username)) {
        this.$toast({message: '用户名2-20个字符，支持中文和英文' });
        return false;
      } 
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
    validatName(){
      if (this.username && !validatName(this.username)) {
        this.$toast({message: '用户名2-20个字符，支持中文和英文' });
      } 
    },
    validatPhone(){
      if (this.phone && !validatPhone(this.phone)) {
        this.$toast({message: '请输入正确的手机号码' });
      } 
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
      this.getcheckshop();
    },
    getcheckshop(){
      
      this.operateShopIds = this.query.operateShopIds ? this.query.operateShopIds.split(','): [];

      let checklist = this.shoplist.filter(v=>this.operateShopIds.some(k=>k==v.shopId));
      this.checkshoptxt = checklist.map(item=>item.shopName).join(',');
    },
    addPermissions(){
      this.checkpermissionslist = this.query.checkpermissionslist ? this.query.checkpermissionslist.split(','): [];

      let checklist = this.allmenu.filter(v=>this.checkpermissionslist.some(k=>k==v.menuId));
      this.permissionsMIdsTxt = checklist.map(item=>item.name).join(',');
    },
    openPrem(){
      this.$router.push({name:'premList',query:{checkpermissionslist:this.query.checkpermissionslist,operateShopIds:this.query.operateShopIds,parentIds:this.query.parentIds}});
    },
    openShop(){
      this.$router.push({name:'premshopList',query:{operateShopIds:this.query.operateShopIds,checkpermissionslist:this.query.checkpermissionslist,parentIds:this.query.parentIds}});
    },
    async addmember(){
      if (this.validate()) {
        let menshopids = [];
        this.operateShopIds.forEach(item=>menshopids.push(`'${item}'`));
        let parentIds = this.query.parentIds ? this.query.parentIds.split(','): []; //权限父级id
        let mIds = [...this.checkpermissionslist,...parentIds];
        mIds = Array.from(new Set([...mIds]));//去重
        let payload = {
          username:this.username,
          phone:this.phone,
          operateShopIds:menshopids.join(','),
          mIds:mIds.join(',')
        };
        let res = await addOperatorFun(payload);
        this.$toast({message: '新增成功,密码将发送至此手机' });
        this.$router.push({name:'member'});
      }
    }
  },
  components:{
  }
};
</script>
<style type="text/css" lang="scss" scoped>
  @import '../../assets/scss/member/adddmember';
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
