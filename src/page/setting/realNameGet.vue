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
          <img :src="item.idcardImg" alt="身份证反面照">
          <img :src="item.idcardReverse" alt="身份证手持照">
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
section {
  .prompt {
    font-size: 14px;
    background-color: #FDFCEC;
    padding: 0.3rem 0;
    text-align: center;
    span {
      color: #FF5F5F;
    }
  }
  .shopname-p {
    background-color: #fff;
    font-size: 16px;
    border-bottom: 1px solid #F8F8F8;
    padding: 0.3rem;
    span {
      display: inline-block;
      &:first-child {
        margin-left: 0.3rem;
        width: 2.5rem;
      }
      &:last-child {
        color: #999999;
     }
    }
    &:last-child {
      border-bottom: 1px solid #fff;
      color: #999999;
    }
    .nameInput {
      margin-left: 0.5rem;
    }
    .statusInput {
      margin-left: 0.5rem;
    }
  }
  .imgShow {
    font-size: 14px;
    text-align: center;
    padding: 0.4rem 0;
    background-color: #fff;
    color: #1890FF;
  }
  .bgc {
    background-color: #fff;
    text-align: center;
    img {
      width: 9rem;
      height: 6rem;
      margin-bottom: 0.3rem;
    }
  }
}
</style>


