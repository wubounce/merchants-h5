<template>
  <section>
    <q-header :title="title"></q-header>
    <p class="shopname-p">
      <span>支付宝账号</span><span>
        <input type="text" class='addressInput' v-model="account"  placeholder="请填写支付宝账号" @input="disbaledBtn">
      </span>
    </p>
    <p class="btn">
      <mt-button type="primary" class="btn-blue" :disabled="disabled">确定</mt-button>
    </p>
  </section>
</template>
<script>
import QHeader from '@/components/header';
export default {
  data() {
    return {
      title: '绑定支付宝',
      account: '',
      disabled: true
    };
  },
  methods: {
    disbaledBtn() {
      this.disabled = false;
    }
  },
  components:{
    QHeader
  }
};
</script>
<style  type="text/css" lang="scss" scoped>
section{
  .shopname-p {
    background-color: #fff;
    font-size: 16px;
    border-bottom: 1px solid #F8F8F8;
    padding: 0.06rem;
    margin-top: 0.3rem;
    span {
      display: inline-block;
      &:first-child {
        margin-left: 0.3rem;
      }
      input {
        margin-left:0.5rem;
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
  }
  .btn {
    .btn-blue {
      margin-top: 0.67rem;
      margin-left: 0.4rem;
      width: 90%;
      height: 1.17rem;
    }
  }
}
</style>