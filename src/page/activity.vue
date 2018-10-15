<template>
    <div class="active-wrap">
        <div class="pic"></div>
        <div class="go-apply">
            <a href="http://a2.rabbitpre.com/m2/aUe1ZjD7af">立即报名</a>
        </div>
    </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    data () {
      return {
      };
    }
  };
</script>

<style lang='scss' scoped type='text/css'>
.active-wrap {
    height: 100%;
    .pic{
        width: 100%;
        height: 100%;
        background: url('../../static/image/activity/detail@2x.png');
        background-size: cover;
    }
    .go-apply {
        position: fixed;
        bottom: 0;
        width: 100%;
        a {
            display: block;
            width:100%;
            text-align: center;
            height:1.6rem;
            line-height:1.6rem;
            background:rgba(255,90,105,1);
            font-size:0.51rem;
            font-weight:400;
            color:rgba(255,255,255,1);
        }
    }
}
</style>