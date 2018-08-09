<template>
<div class="addmember" v-title="title">
  <div class="add-form">
    <div class="input-group">
      <div class="form-title"><span>负责店铺</span></div>
      <div class="form-input"><span :class="['more',{'more-color':checkshoptxt === ''}]">{{checkshoptxt?checkshoptxt:'请选择店铺'}}</span><span class="forward iconfont icon-nextx" @click="shopVisible=true"></span></div>
    </div>
    <div class="input-group" style="border:none">
      <div class="form-title"><span>权限</span></div>
      <div class="form-input"><span :class="['more',{'more-color':permissionsMIdsTxt === ''}]">{{permissionsMIdsTxt?permissionsMIdsTxt:'请选择权限'}}</span><span class="forward iconfont icon-nextx"  @click="permissionsVisible=true"></span></div>
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
            <label class="mint-checklist-label child-prom" style="background:#fff">
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
              <div class="promisss-child" v-for="(sitem,index) in item.children" :key="index" style="background:#fff;">
                  <label class="mint-checklist-label prom">
                    <div class="check-prem-list">
                      <span class="mint-checkbox is-right">
                        <input type="checkbox" class="mint-checkbox-input" v-model="checkpermissionslist" :value="sitem.menuId"> 
                        <span class="mint-checkbox-core"></span>
                      </span> 
                      <span class="mint-checkbox-label shopname" style="padding-left:0.8rem;">{{sitem.name}}</span>
                    </div>
                  </label>
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
import qs from 'qs';
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
    let query = this.$route.query;
    this.shopListFun();
    this.menuSelect();
    this.getOperatorInfo(query.id);
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
      let res = await getOperatorInfoFun(qs.stringify({id:id}));
      if (res.code === 0) {
        this.username = res.data.realName;
        this.phone = res.data.phone;
        this.createTime = res.data.createTime;
        this.checkshoptxt = res.data.operateShopNames;

        let updateOperateShopIds = res.data.operateShopNames ? res.data.operateShopNames.split(',') :[];
        updateOperateShopIds = this.shoplist.filter(v=>updateOperateShopIds.some(k=>k==v.shopName));
        this.operateShopIds = updateOperateShopIds.map(item=>item.shopId);

        this.checkpermissionslist = res.data.list.map(item=>item.menuId);
        this.permissionsMIdsTxt = res.data.list.map(item=>item.name).join(',');
      }
    },
    async menuSelect(){
      let res = await permsMenuFun(); //拼接权限菜单
      this.allmenu = res.data;
      this.permissionsData = getTrees(res.data,0);
    },
    async shopListFun(){
      let res = await shopListFun();
      this.shoplist = res.data;
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
        let res = await updateOperatorInfoFun(qs.stringify(payload));
        if (res.code === 0) {
          this.$toast({message: '修改成功' });
          this.$router.push({name:'member'});
        } else {
          this.$toast({message: res.msg });
        }
      }
    }
  },
};
</script>
<style type="text/css" lang="less" scoped>
  .add-form {
    padding: 0 0.4rem;
    background: #fff;
    .input-group {
      display: flex;
      height: 1.6rem;
      line-height: 1.6rem;
      border-bottom:1px solid rgba(223,230,255,1);
      .form-title {
        width: 2rem;
        font-size: 16px;
      }
      .form-input{
        width: 100%;
        flex: 1;
        input{
          width: 6.4rem;
          font-size: 16px;
          color: #333;
          text-align: right;
        }
        .more {
          display: inline-block;
          width: 6.4rem;
          font-size: 16px;
          color: #333;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .more-color {
          color: #999
        }
      }
       
    }
  }
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
  .silde {
    color: #BAC0D2;
  }
  .forward {
    color: #BAC0D2;
    float: right;
  }
  .confirm {
    width:100%;
    height:1.33rem;
    line-height: 1.33rem;
    background:rgba(24,144,255,1);
    text-align: center;
    font-size: 18px;
    color: #fff;
    position: fixed;
    bottom: 0;
  }
  
  .resp-shop {
    display: flex;
    height: 1.17rem;
    line-height: 1.17rem;
    background:rgba(251,251,252,1);
    padding: 0 0.4rem;
    >span {
      flex: 1;
      font-size: 15px;
    }
    .quxi {
      color: #999;
    }
    .shop {
      text-align: center;
      font-size: 16px;
    }
    .qued {
      text-align:right;
      color: #1890FF;
    }
  }
  .resp-shop-wrap {
    padding: 0 0.4rem;
    height: 10.67rem;
    overflow-y: scroll;
  }
  .check-shop {
    margin-top:0.4rem;
    margin-bottom:  0.56rem;
    p {
      font-size: 14px;
      color: #999;
    }
    .check-shop-list {
      div {
        display: inline-block;
        width: 3.2rem;
        font-size: 14px;
        color: #333;
        background:rgba(24,144,255,0.05);
        border-radius:0.11rem; 
        padding: 0.2rem 0.19rem;
        margin-right: 0.27rem;
        margin-top: 0.27rem;
        span {
          display: inline-block;
          width: 2.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .shopclose {
      margin-left: 0.21rem;
      color: #D8EAFF;
    }
  }
  .sarch-wrap {
    padding: 0.266667rem;
    height: 1.706667rem;
    background: #fff;
    input {
      background:rgba(255,255,255,1);
      box-shadow:0px 0.053333rem 0.133333rem 0px rgba(186,192,210,0.3);
      border-radius:0.133333rem;
      font-size: 16px;
      height:1.173333rem;
    }
  }
  .shopname {
    font-size: 16px;
    color: #333;
  }
  .shopdesc {
    font-size:12px;
    color:#999;
    margin-top: 0.2rem;
  }
  .check-perm-list {
    div {
      display: inline-block;
      font-size: 14px;
      color: #333;
      background:rgba(24,144,255,0.05);
      border-radius:0.11rem; 
      padding: 0.2rem 0.19rem;
      margin-right: 0.27rem;
      margin-top: 0.27rem;
    }
  }
  .check-prem{
    padding-left:0.4rem;
  }
  .check-prem-list{
    padding:0.27rem 0;
    border-bottom:1px solid rgba(223,230,255,1);
  }
  .child-slit {
    background:rgba(248,248,248,1);
  }
  .child-prom {
    border-bottom:1px solid rgba(223,230,255,1);
    padding: 0 !important;
  }
  .promiss-footer {
    display: flex;
    height: 1.33rem;
    line-height: 1.33rem;
    >span {
      flex: 1;
      text-align: center;
    }
    .can {
      font-size:18px;
      color:#1890FF;
      background:rgba(246,248,255,1);
    }
    .cifrm {
      background: #1890FF;
      font-size:18px;
      color: #fff;
    }
  }
</style>
<style lang="scss">
  .addmember .mint-header {
    background: #fff !important;
    border-bottom: 1px solid #DCE0E6;
  }
  .addmember .mint-checklist-label {
    padding: 0.27rem 0;
    border-bottom:1px solid rgba(223,230,255,1);
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
  
</style>
