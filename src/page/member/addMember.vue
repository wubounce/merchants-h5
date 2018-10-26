<template>
<div class="addmember">
  <div class="add-form">
    <div class="input-group">
      <div class="form-title"><span>手机号码</span></div>
      <div class="form-input"><input type="number" pattern="\d*" v-model="phone" @blur="validatPhone" @input="disabledBtn" placeholder="请输入手机号"></div>
    </div>
    <div class="input-group">
      <div class="form-title"><span>姓名</span></div>
      <div class="form-input"><input type="text" v-model="username" @blur="validatName" @input="disabledBtn" maxlength="20" placeholder="请输入姓名"></div>
    </div>
    <div class="input-group"  @click="shopVisible=true">
      <div class="form-title"><span>负责店铺</span></div>
      <div class="form-input"><span :class="['more',{'more-color':checkshoptxt === ''}]">{{checkshoptxt?checkshoptxt:'请选择店铺'}}</span><span class="forward iconfont icon-nextx"></span></div>
    </div>
    <div class="input-group" style="border:none" @click="openPrem">
      <div class="form-title"><span>权限</span></div>
      <div class="form-input"><span :class="['more',{'more-color':permissionsMIdsTxt === ''}]">{{permissionsMIdsTxt?permissionsMIdsTxt:'请选择权限'}}</span><span class="forward iconfont icon-nextx"></span></div>
    </div>
  </div>
  <mt-button class="confirm" @click="addmember" :disabled="disabled">提交</mt-button>

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
import { shopListFun, addOperatorFun, permsMenuFun } from '@/service/member';
import { getTrees, setMember, getMember, removeMember, delay } from '@/utils/tool';
export default {
  data() {
    return {
      disabled:true,

      allmenu:[],
      permissionsData:[],
      permissionsMIdsTxt:'',
      checkpermissionslist: [],

      shoplist:[],
      shopVisible:false,
      operateShopIds:[],
      username:'',
      phone:'',
      parentIds:[],
      checkshoptxt:'',

      query:{},
      searchData:''
    };
  },
  mounted() {
    
  },
  created(){
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
    },
    async shopListFun(){
      let payload = {shopName:this.searchData};
      let res = await shopListFun(payload);
      this.shoplist = res;
    },
    getcheckshop(){
      let checklist = this.shoplist.filter(v=>this.operateShopIds.some(k=>k==v.shopId));
      this.shopVisible = false;
      this.checkshoptxt = checklist.map(item=>item.shopName).join(',');
      this.searchData = '';
    },
    cancelCheckshop(){
      let canceIds = this.checkshoptxt ?  this.checkshoptxt.split(',') :[];
      canceIds = this.shoplist.filter(v=>canceIds.some(k=>k==v.shopName));
      this.operateShopIds = canceIds.map(item=>item.shopId);
      this.shopVisible = false;
      this.searchData = '';
    },
    addPermissions(){
      let checklist = this.allmenu.filter(v=>this.checkpermissionslist.some(k=>k==v.menuId));
      this.permissionsMIdsTxt = checklist.map(item=>item.name).join(',');
    },
    openPrem(){
      this.$router.replace({name:'premList',query:{checkpermissionslist:this.checkpermissionslist.join(','),parentIds:this.parentIds.join(',')}});
    },
    async addmember(){
      if (this.validate()) {
        let menshopids = [];
        this.operateShopIds.forEach(item=>menshopids.push(`'${item}'`));
        let mIds = [...this.checkpermissionslist,...this.parentIds];//权限父级id
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
  watch: {
    $route(to,from)  {
      if(from.name == 'premList') {
        this.query = this.$route.query ? this.$route.query :{};
        this.parentIds = this.query.parentIds ? this.query.parentIds.split(','): []; //权限父级id
        this.checkpermissionslist = this.query.checkpermissionslist ? this.query.checkpermissionslist.split(','): [];
        this.addPermissions();
      }
      else if(from.name == 'member'){
        this.parentIds = [];
        this.checkpermissionslist = [];
        this.operateShopIds = [];
        this.username = [];
        this.phone = [];
        this.checkshoptxt = '';
        this.permissionsMIdsTxt = '';
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
        this.shopListFun();
        }, 200);
      }else {
        this.shopListFun();
      }
    },
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
