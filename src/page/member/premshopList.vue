<template>
<div class="premlist" v-title="title">
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
      title: '选择店铺',
      shoplist:[],
      operateShopIds:[],
    };
  },
  mounted() {
    this.shopListFun();
  },
  created(){
    let query = this.$route.query ? this.$route.query :{};
    this.operateShopIds = query.operateShopIds ? query.operateShopIds.split(','): [];
  },
  computed: {
      
  },
  methods: {
    async shopListFun(){
      let res = await shopListFun();
      this.shoplist = res;
    },
    getcheckshop(){
      let query = this.$route.query;
      if (query.updateOperatorId) {
        this.$router.push({name:'editMember',query:{operateShopIds:this.operateShopIds.join(','),checkpermissionslist:query.checkpermissionslist,updateOperatorId:query.updateOperatorId,parentIds:query.parentIds}});
      }else {
        this.$router.push({name:'addMember',query:{operateShopIds:this.operateShopIds.join(','),checkpermissionslist:query.checkpermissionslist,parentIds:query.parentIds}});
      }
      
    },
    cancelCheckshop(){
      let query = this.$route.query;
      if (query.updateOperatorId) {
        this.$router.push({name:'editMember',query:{operateShopIds:query.operateShopIds,checkpermissionslist:query.checkpermissionslist,updateOperatorId:query.updateOperatorId,parentIds:query.parentIds}});
      }else{
        this.$router.push({name:'addMember',query:{operateShopIds:query.operateShopIds,checkpermissionslist:query.checkpermissionslist,parentIds:query.parentIds}});
      }
      
    },
  },
  components:{
  }
};
</script>
<style type="text/css" lang="scss" scoped>
  @import '../../assets/scss/member/adddmember';
  .premlist {
    padding-bottom: 1.33rem; 
  }
  .resp-shop-wrap {
    background: #fff;
  } 
  .mint-checklist-label {
    padding: 0.27rem 0;
    margin: 0 0.4rem;
    border-bottom:1px solid #f9f8ff;
  }
</style>

