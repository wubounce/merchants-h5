<template>
<div class="addmember" v-title="title">
  <div class="add-form">
    <div class="input-group" @click="shopVisible=true">
      <div class="form-title"><span>负责店铺</span></div>
      <div class="form-input"><span :class="['more',{'more-color':checkshoptxt === ''}]">{{checkshoptxt?checkshoptxt:'请选择店铺'}}</span><span class="forward iconfont icon-nextx"></span></div>
    </div>
    <div class="input-group" style="border:none" @click="permissionsVisible=true">
      <div class="form-title"><span>权限</span></div>
      <div class="form-input"><span :class="['more',{'more-color':permissionsMIdsTxt === ''}]">{{permissionsMIdsTxt?permissionsMIdsTxt:'请选择权限'}}</span><span class="forward iconfont icon-nextx"></span></div>
    </div>
  </div>
  <div class="input-group createtime">
    <div class="form-title">创建时间</div>
    <div class="form-input">{{createTime}}</div>
  </div>
  <div class="confirm" @click="updateMember">提交</div>
  <!-- 选择店铺 -->
  <mt-popup v-model="shopVisible" position="bottom" :closeOnClickModal="false">
    <div class="resp-shop">
      <span class="shop">负责店铺</span>
    </div>
    <section class="resp-shop-wrap">
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
    <section class="promiss-footer">
      <span class="can" @click="cancelCheckshop">取消</span>
      <span class="cifrm" @click="getcheckshop">确定</span>
    </section>
  </mt-popup>
  <!-- 选择权限 -->
  <mt-popup v-model="permissionsVisible" position="bottom" :closeOnClickModal="false">
    <div class="resp-shop">
      <span class="shop">权限</span>
    </div>
    <section class="resp-shop-wrap" style="padding:0;">
      <div class="all-list">
        <div class="promisss-child" >
          <div class="child-slit" v-for="(item,index) in permissionsData">
            <label class="mint-checklist-label child-prom" style="background:#fff" @click="toggle(item)">
              <div class="check-prem-list" style="border:none;padding:0.27rem 0.4rem;">
                <span class="mint-checkbox is-right" v-if="item.name==='首页' || item.name==='报表'">
                  <input type="checkbox" class="mint-checkbox-input" v-model="checkpermissionslist" :value="item.menuId"> 
                  <span class="mint-checkbox-core"></span>
                </span>
                <span class="mint-checkbox is-right" v-else>
                  <span class="iconfont icon-xiangxiajiantou"></span>
                </span>
                <span class="mint-checkbox-label shopname">{{item.name}}</span>
              </div>
            </label>
            <transition-group name="collapse">
              <div :class="['animate',{hiddren:item.show}]" :key="index">
                <div class="promisss-child" v-for="(sitem,index) in item.children" :key="index" style="background:#fff;">
                  <label class="mint-checklist-label" style="border-bottom: 1px #f9f8ff solid;background:#F8F8F8;">
                    <div class="check-prem-list">
                      <span class="mint-checkbox is-right">
                        <input type="checkbox" class="mint-checkbox-input" v-model="checkpermissionslist" :value="sitem.menuId"> 
                        <span class="mint-checkbox-core"></span>
                      </span> 
                      <span class="mint-checkbox-label shopname">{{sitem.name}}</span>
                    </div>
                  </label>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </section>
    <section class="promiss-footer">
      <span class="can" @click="cancelPermissions">取消</span>
      <span class="cifrm" @click="addPermissions">确定</span>
    </section>
  </mt-popup>
</div>
</template>
<script>
import { validatPhone } from '@/utils/validate';
import { shopListFun, updateOperatorInfoFun, getOperatorInfoFun, permsMenuFun } from '@/service/member';
import { getTrees} from '@/utils/tool';
export default {
  components: {
    },
  data() {
    return {
      title: '编辑人员',
      shopVisible:false,
      permissionsVisible:false,

      allmenu:[],
      permissionsData:[],
      permissionsMIdsTxt:'',
      checkpermissionslist: [],

      shoplist:[],
      operateShopIds:[],
      username:'',
      phone:'',
      checkshoptxt:'',
      createTime:''
      
    };
  },
  mounted() {
    
  },
  created(){

    this.shopListFun();
    this.menuSelect();
   
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
        this.username = res.realName;
        this.phone = res.phone;
        this.createTime = res.createTime;
        this.checkshoptxt = res.operateShopNames;

        let updateOperateShopIds = res.operateShopNames ? res.operateShopNames.split(',') :[];
        updateOperateShopIds = this.shoplist.filter(v=>updateOperateShopIds.some(k=>k==v.shopName));
        this.operateShopIds = updateOperateShopIds.map(item=>item.shopId);
        this.checkpermissionslist = res.list.map(item=>item.menuId);
        this.permissionsMIdsTxt = res.list.map(item=>item.name).join(',');
    },
    async menuSelect(){
      let res = await permsMenuFun(); //拼接权限菜单
      this.allmenu = res;
      this.permissionsData = getTrees(res,0);
    },
    async shopListFun(){
      let res = await shopListFun();
      this.shoplist = res;
      let id = this.$route.query ? this.$route.query.id:'';
      this.getOperatorInfo(id);
    },
    toggle:function(item){
      this.$set(item,'show',this.show=!this.show);
    },
    async getcheckshop(){
      let checklist = this.shoplist.filter(v=>this.operateShopIds.some(k=>k==v.shopId));
      this.shopVisible = false;
      this.checkshoptxt = checklist.map(item=>item.shopName).join(',');
    },
    cancelCheckshop(){
      let canceIds = this.checkshoptxt ?  this.checkshoptxt.split(',') :[];
      canceIds = this.shoplist.filter(v=>canceIds.some(k=>k==v.shopName));
      this.operateShopIds = canceIds.map(item=>item.shopId);
      this.shopVisible = false;
    },
    addPermissions(){
      this.permissionsVisible=false;
      let checklist = this.allmenu.filter(v=>this.checkpermissionslist.some(k=>k==v.menuId));
      this.permissionsMIdsTxt = checklist.map(item=>item.name).join(',');
    },
    cancelPermissions(){
      let canceIds = this.permissionsMIdsTxt ?  this.permissionsMIdsTxt.split(',') :[];
      canceIds = this.allmenu.filter(v=>canceIds.some(k=>k==v.name));
      this.checkpermissionslist = canceIds.map(item=>item.menuId);
      this.permissionsVisible = false;
    },
    async updateMember(){
      if (this.validate()) {
        let menshopids = [];
        this.operateShopIds.forEach(item=>menshopids.push(`'${item}'`));
        let payload = {
          id:this.$route.query.id,
          username:this.username,
          phone:this.phone,
          operateShopIds:menshopids.join(','),
          mIds:this.checkpermissionslist.join(',')
        };
        let res = await updateOperatorInfoFun(payload);
        this.$toast({message: '修改成功' });
        this.$router.push({name:'member'});
      }
    }
  },
  watch: {
    shopVisible: function () {
      if (this.shopVisible) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    },
    permissionsVisible: function () {
      if (this.permissionsVisible) {
        this.ModalHelper.afterOpen();
      } else {
        this.ModalHelper.beforeClose();
      }
    },
  },
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