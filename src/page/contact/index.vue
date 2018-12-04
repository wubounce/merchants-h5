<template>
  <div class="contant">
    
  </div>
</template>

<script>
  import Web from '@/utils/Web';
  import { getOperatorFun } from '@/service/user';
  export default {
    data() {
      return {
        
      };
    },
    created() {
     this.getOperator();
    },
    methods: {
     getOperator(){
        getOperatorFun().then(res=>{
           ysf.config({
              uid: res.id,
              name: res.realName,
              mobile: res.phone,
              qtype: 1162005,
              success: function(){     // 成功回调
                  window.location.replace (ysf.url());     
              },
          });
        });
      }
    },
    components: {
    }
  };
</script>

<style lang="scss" scoped>
.contant {
  background: #fff;
  height: 100%;
  .erweima {
    width:6.0rem;
    height:6.0rem;
    padding: 1.33rem 2.0rem 0;
    img {
      display: block;
      width: 100%;
    }
  }
  .gaunzhu {
    font-size: 14px;
    text-align: center;
  }
  .work-time {
    margin-top: 1.33rem;
    font-size: 14px;
    color: #999;
    text-align: center;
    line-height: 0.64rem;
  }
}
</style>

