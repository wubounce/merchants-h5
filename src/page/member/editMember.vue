<template>
<div class="addmember" v-title="title">
  <div class="add-form">
    <div class="input-group">
      <div class="form-title"><span>负责店铺</span></div>
      <div class="form-input"><span class="more more-color">{{checkshoptxt?checkshoptxt:'请选择店铺'}}</span><span class="forward iconfont icon-nextx" @click="shopVisible=true"></span></div>
    </div>
    <div class="input-group" style="border:none">
      <div class="form-title"><span>权限</span></div>
      <div class="form-input"><span class="more more-color">请选择权限</span><span class="forward iconfont icon-nextx"  @click="permissionsVisible=true"></span></div>
    </div>
  </div>
  <div class="input-group createtime">
    <div class="form-title">创建时间</div>
    <div class="form-input">{{createTime}}</div>
  </div>
  <div class="confirm" @click="updateMember">提交</div>
  <!-- 选择店铺 -->
  <mt-popup v-model="shopVisible" position="bottom">
    <div class="resp-shop">
      <span class="shop">负责店铺</span>
    </div>
    <section class="resp-shop-wrap">
      <div class="all-list">
        <label class="mint-checklist-label" v-for="(item,index) in shoplist" :key="index">
          <span class="mint-checkbox is-right">
            <input type="checkbox" class="mint-checkbox-input" v-model="checkshoplist" :value="item.shopName"> 
            <span class="mint-checkbox-core"></span>
          </span> 
          <p class="mint-checkbox-label shopname">{{item.shopName}}</p>
          <p class="mint-checkbox-label shopdesc">{{item.address}}</p>
        </label>
      </div>
    </section>
    <section class="promiss-footer">
      <span class="can" @click="shopVisible=false">取消</span>
      <span class="cifrm" @click="getcheckshop">确定</span>
    </section>
  </mt-popup>
  <!-- 选择权限 -->
  <mt-popup v-model="permissionsVisible" position="bottom">
    <div class="resp-shop">
      <span class="shop">权限</span>
    </div>
    <section class="resp-shop-wrap" style="padding:0;">
      <div class="all-list">
        <label class="mint-checklist-label prom">
          <div class="check-prem-list">
            <span class="mint-checkbox is-right">
              <input type="checkbox" class="mint-checkbox-input" v-model="checkpermissionslist" value="12344"> 
              <span class="mint-checkbox-core"></span>
            </span> 
            <span class="mint-checkbox-label shopname">首页</span>
          </div>
        </label>
        <label class="mint-checklist-label prom">
          <div class="check-prem-list">
            <span class="mint-checkbox is-right">
              <input type="checkbox" class="mint-checkbox-input" v-model="checkpermissionslist" value="344"> 
              <span class="mint-checkbox-core"></span>
            </span> 
            <span class="mint-checkbox-label shopname">首页</span>
          </div>
        </label>
        <div class="promisss-child">
          <label class="mint-checklist-label prom">
            <div class="check-prem-list">
              <span class="mint-checkbox is-right">
                <i class="silde iconfont icon-nextx"></i>
              </span> 
              <span class="mint-checkbox-label shopname">店铺管理</span>
            </div>
          </label>
          <div class="child-slit">
            <label class="mint-checklist-label child-prom">
              <div class="check-prem-list" style="border:none;padding:0.27rem 0.4rem;">
                <span class="mint-checkbox is-right">
                  <input type="checkbox" class="mint-checkbox-input" v-model="checkpermissionslist" value="22344"> 
                  <span class="mint-checkbox-core"></span>
                </span> 
                <span class="mint-checkbox-label shopname">首页</span>
              </div>
            </label>
            <label class="mint-checklist-label child-prom">
              <div class="check-prem-list" style="border:none;padding:0.27rem 0.4rem;">
                <span class="mint-checkbox is-right">
                  <input type="checkbox" class="mint-checkbox-input" v-model="checkpermissionslist" value="23444"> 
                  <span class="mint-checkbox-core"></span>
                </span> 
                <span class="mint-checkbox-label shopname">首页</span>
              </div>
            </label>
            <label class="mint-checklist-label child-prom">
              <div class="check-prem-list" style="border:none;padding:0.27rem 0.4rem;">
                <span class="mint-checkbox is-right">
                  <input type="checkbox" class="mint-checkbox-input" v-model="checkpermissionslist" value="234344"> 
                  <span class="mint-checkbox-core"></span>
                </span> 
                <span class="mint-checkbox-label shopname">首页</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </section>
    <section class="promiss-footer">
      <span class="can" @click="permissionsVisible=false">取消</span>
      <span class="cifrm">确定</span>
    </section>
  </mt-popup>
</div>
</template>
<script>
import qs from 'qs';
import { validatPhone } from '@/utils/validate';
import { shopListFun, updateOperatorInfoFun, getOperatorInfoFun } from '@/service/member';
export default {
  data() {
    return {
      title: '编辑人员',
      checkshoplist: [],
      checkpermissionslist: [],
      shopVisible:false,
      permissionsVisible:false,
      permissionsData:[],
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
    this.getOperatorInfo(query.id);
    this.shopListFun();
  },
  methods: {
    validate() {
      if (this.checkshoptxt === '') {
        this.$toast({message: '请选择店铺' });
        return false;
      }
      return true;
    },
    async getOperatorInfo(id){
      let res = await getOperatorInfoFun(qs.stringify({id:id}));
      if (res.code === 0) {
        this.username = res.data.userName;
        this.phone = res.data.phone;
        this.createTime = res.data.createTime;
        this.checkshoptxt = res.data.operateShopNames;
        this.checkshoplist = res.data.operateShopNames ? res.data.operateShopNames.split(',') :[];
      }
    },
    async shopListFun(){
      let res = await shopListFun();
      this.shoplist = res.data;
    },
    async getcheckshop(){
      this.checkshoptxt = this.checkshoplist.join(',');
      let checklist = this.shoplist.filter(v=>this.checkshoplist.some(k=>k==v.shopName));
      this.shopVisible = false;
      checklist.forEach(item=>this.operateShopIds.push(`'${item.shopId}'`));
    },
    async updateMember(){
      if (this.validate()) {
        let payload = {
          id:this.$route.query.id,
          username:this.username,
          phone:this.phone,
          operateShopIds:this.operateShopIds.join(','),
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
  components:{
  }
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
    >div {
      flex: 1;
    }
    .form-input {
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
    

</style>
