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
import { getTrees, setMember, getMember } from '@/utils/tool';
export default {
  data() {
    return {
      title: '选择店铺',
      shoplist:[],
      operateShopIds:[],
      query:{},
    };
  },
  mounted() {
    this.shopListFun();
  },
  created(){
    this.localData = getMember() ? getMember() :{};
    this.operateShopIds = this.localData.operateShopIds ? this.localData.operateShopIds: [];
  },
  computed: {
      
  },
  methods: {
    async shopListFun(){
      let res = await shopListFun();
      this.shoplist = res;
    },
    getcheckshop(){
      this.localData.operateShopIds = this.operateShopIds;
      setMember(this.localData);
      let query = this.$route.query;
      if (query.updateOperatorId) {
        this.$router.push({name:'editMember',query:{updateOperatorId:query.updateOperatorId}});
      }else {
        this.$router.push({name:'addMember'});
      }
      
    },
    cancelCheckshop(){
      let query = this.$route.query;
      if (query.updateOperatorId) {
        this.$router.push({name:'editMember',query:{updateOperatorId:query.updateOperatorId}});
      }else{
        this.$router.push({name:'addMember'});
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

