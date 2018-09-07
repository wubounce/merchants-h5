<template>
  <section v-title="title" class="referee">
    <div ref="refereeForm" :model="referee" class="referee-form">
      <div class="form-group">
        <p class="area">
          <span>选择所在区域</span>
          <span class="forward iconfont icon-nextx"></span>
        </p>      
      </div>
      <div class="form-group">
        <input type="text" placeholder="请输入姓名" v-model="referee.name" required="required">
      </div>
      <div class="form-group">
        <input type="text" placeholder="请输入手机号" v-model="referee.phone" required="required">
      </div>
      <div class="clickBtn">
        <mt-button type="primary" class="btn-blue" @click.prevent="goToNext" :disabled="disabled">申请注册</mt-button>
      </div>
      <p class="agreeRule">注册表示已同意<span class="rule">《用户协议》</span></p>
    </div>
  </section>
</template>

<script>
  import { validatPhone } from '@/utils/validate';
  export default{
    data() {
      return {
        title:'推荐',
        referee: {
          phone: '',
          name: '',
        },
        timer: null,
        time: 0,
        disabled:true
      };
    },
    methods: {
        goToNext() {
        
        }
    }
  };
</script>
<style lang="scss" scoped>
  .referee {
    background: #fff;
    height: 100%;
    .referee-form {
      padding: 0 0.93rem;
      .form-group {
        height: 1.57rem;
        line-height: 1.57rem;
        font-size: 0.43rem;
        box-sizing: border-box;
        input{
          height: 1.57rem;
          border-bottom: 0.01rem solid #e5e5e5;
          color: #1890FF;
        }
        .area {
          height: 1.57rem;
          border-bottom: 0.01rem solid #e5e5e5; 
          font-size: 16px;
          color:rgba(153, 153, 153, 1);
          .forward {
            color:rgba(204, 204, 204, 1);
            float: right;
          }
        }

      }
    }
    .clickBtn {
      margin: 1.47rem 0 0 0;
      .btn-blue {
        width: 100%;
        height: 1.17rem;
        line-height: 1.17rem;
        border-radius: 0.13rem;
      }
    }
    .agreeRule {
      margin-top: 0.8rem;
      font-size: 0.37rem;
      text-align: center;
      color: rgba(153, 153, 153, 1);
      .rule {
        color: rgba(24, 144, 255, 1);
      }
    }
  }
  
</style>
