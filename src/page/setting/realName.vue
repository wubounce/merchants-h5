<template>
   <section>
       <q-header :title="title"></q-header>
       <p class="prompt">请填写支付宝账号 <span>{{alipay}}</span> 实名信息</p>
       <p class="shopname-p margin">
          <span>姓名</span><span>
              <input type="text" class='nameInput' v-model="name"  placeholder="请填写真实有效的姓名">
          </span>
       </p>
       <p class="shopname-p">
          <span>身份认证</span><span>
              <input type="text" class='statusInput' v-model="status"  placeholder="请填写身份证号">
          </span>
       </p>
       <p class="imgShow">上传身份证照片</p>
   </section>
</template>
<script>
import QHeader from '@/components/header';
export default {
  data() {
    return {
      title: '实名认证',
      alipay: '1374862991@qq.com',
      disabled: true,
      name:'',
      status:''
    };
  },
  components:{
    QHeader
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
  .margin {
    margin-top: 0.3rem;
  }
  .shopname-p {
    background-color: #fff;
    font-size: 16px;
    border-bottom: 1px solid #F8F8F8;
    padding: 0.06rem;
    span {
      display: inline-block;
      &:first-child {
        margin-left: 0.3rem;
      }
      input {
        height: 1rem;
      }
      ::-webkit-input-placeholder {
        color: #999999;
        font-size: 16px;
      }
      :-moz-placeholder {
        /* Firefox 18- */
        color: #999999;
        font-size: 16px;
      }
      ::-moz-placeholder {
        /* Firefox 19+ */
        color: #999999;
        font-size: 16px;
      }
      :-ms-input-placeholder {
        color: #999999;
        font-size: 16px;
      }
    }
    &:last-child {
      border-bottom: 1px solid #fff;
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
  }
}
</style>


