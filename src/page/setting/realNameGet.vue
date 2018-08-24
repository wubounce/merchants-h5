<template>
   <section v-title="title">
       <p class="shopname-p">
          <span>姓名</span><span>{{item.cardName}}</span>
       </p>
       <p class="shopname-p">
          <span>身份证号</span><span>{{item.idcardNo}}</span>
       </p>
       <p class="imgShow">{{item.status}}</p>
       <div class="bgc">
          <img :src="item.idcardFont" alt="身份证正面照">
          <img :src="item.idcardReverse" alt="身份证反面照">
          <img :src="item.idcardImg" alt="身份证手持照">
       </div>
   </section>
</template>
<script>
import qs from 'qs';
import { getRealNameFun } from '@/service/user';
export default {
  data() {
    return {
      title: '实名认证详情',
      item:{}
    };
  },
  methods: {
    async getRealName() {
        let res = await getRealNameFun();
        if(res.code ===0 ) {
            this.item = res.data;
            //判断认证情况
            switch(res.data.status) {
                case 0: 
                    this.item.status = '未认证';
                    break;
                case 1:
                    this.item.status = '正在进行审核, 请您耐心等候';
                    break;
                case 2:
                    this.item.status = '认证成功';
                    break;
                case 3:
                    this.item.status = '您的实名认证未通过';
                    break;
            }
        }
    }
  },
  created() {
      this.getRealName();
  },
  components:{
    
  }
};
</script>
<style type="text/css" lang="scss" scoped>
 @import '../../assets/scss/setting/realNameGet';
</style>


