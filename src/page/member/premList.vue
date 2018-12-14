<template>
<div class="premlist">
   <section class="resp-shop-wrap">
      <el-tree
        ref="tree"
        :data="permissionsData"
        show-checkbox
        node-key="menuId"
        :props="defaultProps"
        @check="handleCheck"
        :default-expanded-keys="parentIds"
        >
      </el-tree>
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
import { getTrees } from '@/utils/tool';
export default {
  data() {
    return {
      permissionsData:[],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      checkpermissionslist: [],
      parentIds:[],
      maxPid:null,//最大父级id
      allMenu:[],
      query:{},
    };
  },
  mounted() {
    this.menuSelect();
  },
  created(){
  },
  methods: {
    async menuSelect(){
      let res = await permsMenuFun(); //拼接权限菜单
      this.allMenu = res;
      this.permissionsData = getTrees(res,0);
      this.query = this.$route.query ? this.$route.query :{};
      this.checkpermissionslist = this.query.checkpermissionslist ? this.query.checkpermissionslist.split(',').map(Number): [];
      this.parentIds = this.query.parentIds ? this.query.parentIds.split(',').map(Number): [];
      this.$refs.tree.setCheckedKeys(this.checkpermissionslist);
    },
    handleCheck() {
      this.checkpermissionslist = this.$refs.tree.getCheckedKeys(true);
      let checklist = this.allMenu.filter(v=>this.checkpermissionslist.some(k=>k==v.menuId));
      this.parentIds = checklist.map(item=>item.parentId); //获取父级id
      this.checkpermissionslist = Array.from(new Set([...this.checkpermissionslist]));
    },
    addPermissions(){
      this.parentIds = Array.from(new Set([...this.parentIds]));
      this.checkpermissionslist = Array.from(new Set([...this.checkpermissionslist]));

      this.query.checkpermissionslist = this.checkpermissionslist;
      this.query.parentIds = this.parentIds;
      setMember(this.query);

      let query = this.$route.query;
      if (query.updateOperatorId) {
        this.$router.replace({name:'editMember',query:{updateOperatorId:query.updateOperatorId,checkpermissionslist:this.checkpermissionslist.join(','),parentIds:this.parentIds.join(',')}});
      } else {
        this.$router.replace({name:'addMember',query:{checkpermissionslist:this.checkpermissionslist.join(','),parentIds:this.parentIds.join(',')}});
      }
    },
    cancelPermissions(){
      let query = this.$route.query;
      if (query.updateOperatorId) {
        this.$router.replace({name:'editMember',query:{updateOperatorId:query.updateOperatorId,checkpermissionslist:query.checkpermissionslist,parentIds:query.parentIds}});
      }else{
        this.$router.replace({name:'addMember',query:{checkpermissionslist:query.checkpermissionslist,parentIds:query.parentIds}});
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
  .promiss-footer {
    z-index: 99;
  }
</style>
<style>
  .el-checkbox__inner {
    border-radius: 50%;
    width: 22px;
    height: 22px;
    border: 1px solid #ccc;
  }
  .el-checkbox {
    position: absolute;
    margin:0;
    right: 0.4rem;
  }
  .el-tree-node__label {
    font-size: 14px;
  }
  .el-tree-node {
    border-bottom: 1px solid #f9f8ff;
    position: relative;
    z-index: 2;
  }
  .el-tree-node__content {
    padding: 0.32rem 0;
  }
  .el-tree-node__children .el-tree-node__content {
    background: #f8f8f8;
    height: 0.53rem;
    padding: 0.32rem 0;
    border-bottom: 1px solid #f9f8ff;
  }
  .el-tree-node__content>.el-tree-node__expand-icon {
    padding: 0 0.28rem 0 0.4rem;
  }
  .el-checkbox__inner::after {
    height: 12px;
    left: 7px;
    top: 1px;
    width: 6px;
  }
  .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
    height: 2px;
    top: 9px;
  }
  .el-tree__empty-text {
    font-size: 14px;
  }
</style>





