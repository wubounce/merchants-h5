<template>
  <section>
    <div class="content">
      <p><span class="iconfont icon-chenggong"></span></p>
      <p class="successMsg">注册成功</p>
      <router-link to="/login">
        <Button btn-type="small" btn-color="spe" class="ft-btn active" @click.native="successTo">完成</Button>
      </router-link>
    </div>
  </section>
</template>
<script>
  import Button from "@/components/Button/Button";
  export default {
  };
</script>

<style lang="scss" scoped="scoped">
  section {
    background-color: #ffffff;
    height: 100%;
    text-align: center;
    .content {
      padding-top: 2.13rem; 
      .icon-chenggong {
        font-size: 2.14rem;
        color: rgba(24, 144, 255, 1);
      }
      .successMsg {
        margin-top: 0.67rem;
        font-size: 0.48rem;
        color: rgba(51, 51, 51, 1);
      }
      .tipsMsg {
        font-size: 0.37rem;
        margin-top: 0.27rem;
        color: rgba(153, 153, 153, 1);
        line-height: 0.6rem;
      }
      .ft-btn {
        border-radius: 5px;
        color: #1890FF;
        border-color: #1890FF;
        background-color: #ffffff;
        font-size: 14px;
        margin-top: 1.59rem;
        width: 2.93rem;
        height: 0.93rem;
        line-height: 0.93rem;
      }
    }
  }
</style>