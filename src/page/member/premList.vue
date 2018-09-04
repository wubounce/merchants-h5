<template>
<div class="premlist" v-title="title">
   <section class="resp-shop-wrap">
      <div class="all-list">
        <div class="promisss-child" >
          <div class="child-slit" v-for="(item,index) in permissionsData">
            <div class="mint-checklist-label child-prom" style="background:#fff">
              <div class="check-prem-list" style="border:none;padding:0.27rem 0.4rem;">
                <span class="mint-checkbox-label shopname" v-if="item.name === '首页' || item.name === '报表'">{{item.name}}</span>
                <span class="mint-checkbox-label shopname" v-else>{{item.name}}<span @click="toggle(item)" :class="['iconfont','toogle',{ 'icon-xiangshangjiantou':item.show,'icon-xiangxiajiantou':!item.show }]"></span>
                </span>
                <span class="mint-checkbox is-right" v-if="item.name === '首页' || item.name === '报表'">
                  <label>
                    <input type="checkbox" class="mint-checkbox-input" v-model="checkpermissionslist" :value="item.menuId"> 
                    <span class="mint-checkbox-core"></span>
                 </label>
                </span>
                <span class="mint-checkbox is-right" v-else>
                  <label>
                    <input type="checkbox" class="mint-checkbox-input" :checked="isTitleChecked(item)" @change="allChildSelect(item,item.menuId,$event)"> 
                    <span class="mint-checkbox-core"></span>
                 </label>
                </span>
              </div>
            </div> 
            <transition-group name="fade">
              <div :class="['animate',{hiddren:item.show}]" :key="index">
                <div class="promisss-child"  v-for="(sitem,index) in item.children" :key="index" style="background:#fff;" >
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
      title: '选择权限',
      permissionsData:[],
      checkpermissionslist: [],
    };
  },
  mounted() {
    this.menuSelect();
  },
  created(){
    let query = this.$route.query ? this.$route.query :{};
    this.checkpermissionslist = query.checkpermissionslist ? query.checkpermissionslist.split(','): [];
  },
  methods: {
    async menuSelect(){
      let res = await permsMenuFun(); //拼接权限菜单
      this.permissionsData = getTrees(res,0);
    },
    allChildSelect(item,menuId){
      console.log(item);
      this.$set(item,'checked',this.checked=!this.checked);
      let selectChild =  this.permissionsData.find(k => k.menuId === menuId);
      let selectChildId = selectChild.children.map(v=>v.menuId);
      if (!item.checked) {
        this.checkpermissionslist = this.checkpermissionslist.filter((v)=>selectChildId.indexOf(v) === -1);
      } else { 
        this.checkpermissionslist = [...this.checkpermissionslist,...selectChildId];
        console.log(this.checkpermissionslist);
      }
     
    },
    isTitleChecked : function (data) {
      var _selected = data.selected;
      var _listItem = data.listItem;
      // 验证selected中是否含有全部的item的id 如果是 证明title要选中
      return _listItem.every(function (item) {
      return _selected.indexOf(item) != -1;
      });
    },
    toggle:function(item){
      this.$set(item,'show',this.show=!this.show);
    },
    addPermissions(){
      let query = this.$route.query;
      this.$router.push({name:'addMember',query:{checkpermissionslist:this.checkpermissionslist.join(','),operateShopIds:query.operateShopIds}});
    },
    cancelPermissions(){
      let query = this.$route.query;
      this.$router.push({name:'addMember',query:{checkpermissionslist:query.checkpermissionslist,operateShopIds:query.operateShopIds}});
    },
  },
  components:{
  }
};
</script>
<style type="text/css" lang="scss" scoped>
  @import '../../assets/scss/member/adddmember';
  .mint-checklist-label {
    padding: 0.32rem 0.4rem 0.32rem 0.8rem;
  }
  .promisss-child {
    border:1px solid #f9f8ff;
  }
  .toogle {
    padding-left: 0.33rem;
  }
</style>




