<template>
<section class="discountCoupon">
  <div class="discountCoupon-head">
    <div class="search-header">
      <section class="sarch-wrap">
        <div class="search">
            <form action="" target="frameFile" v-on:submit.prevent="">
              <span class="iconfont icon-IconSearch"></span><input type="text" value='搜索' v-model.trim="searchData" @keyup.enter="searchOrder" @input="clearSearch" placeholder="请输入用户手机号" class="serch">
              <iframe name='frameFile' style="display: none;"></iframe>
              <span class="select-back" @click="searchOrder">搜索</span>
            </form>
        </div>
        <div class="coupon-date"><span class="iconfont icon-rili"></span></div>
      </section>
      <div class="hidden-tab">  
        <section class="order-status">
          <div v-for="(item,index) in titleArr" @click="titleClick(index)"><span :class="{current: titleIndex === index}">{{item.lable}}</span></div>
        </section>
      </div>
    </div>
    <div class="device-status">
      <div>
        <p class="current">全部</p>
        <span class="current">6499</span>
      </div>
      <div>
        <p>未使用</p>
        <span>9999</span>
      </div>
      <div> 
        <p>已使用</p>
        <span>999</span>
      </div>
      <div>
        <p>已过期</p>
        <span>999</span>
      </div>
    </div>
    <div class="coupon-content">
      <ul>
        <li class="list">
          <div class="price-content">
            
          </div>
          <div class="rules-conten">

          </div>
        </li>
      </ul>
    </div>
  </div>
   
</section>
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
.sarch-wrap{
  background: #ffffff;
  padding: 0.27rem 0 0.27rem 0.27rem;
  overflow: hidden;
  .search {
    -webkit-box-shadow: 0px 0.053333rem 0.133333rem 0px rgba(186, 192, 210, 0.3);
    box-shadow: 0px 0.053333rem 0.133333rem 0px rgba(186, 192, 210, 0.3);
    border-radius: 0.133333rem;
    font-size: 16px;
    width: 8.27rem;
    height: 1.17rem;
    float: left;
    form {
      display: inline-block;
      width: 100%;
    }
    input {
      width: 5.6rem;
      font-size: 16px;
      height:1.17rem;
      line-height: 1.17rem;
    }
    .icon-IconSearch {
      color: #999999;
      padding-left: 0.4rem;
      padding-right: 0.27rem;
    }
    .select-back {
      line-height: 1.17rem;
      padding-right: 0.27rem;
      padding-left: 0.27rem;
      color: #1890FF;
      border-left:1px solid rgba(216,216,216,1);
    }
    input::-webkit-input-placeholder {
      color: #999;
      font-size: 14px;
    }
    
    input:-moz-placeholder {
      color: #999;
      font-size: 14px;
    }
    
    input::-moz-placeholder {
      color: #999;
      font-size: 14px;
    }
    
    input :-ms-input-placeholder {
      color: #999;
      font-size: 14px;
    }
  }
  .coupon-date {
    float: left;
    width: 0.52rem;
    height: 1.17rem;
    line-height: 1.17rem;
    font-size: 20px;
    padding-left: 0.48rem;
  }
  .icon-rili {
    color: #1890FF; 
    font-size: 20px;
  }
}
.device-status {
  display: flex;
  font-size: 0.35rem;
  color: #333;
  text-align: center;
  background: #fff;
  padding-bottom: 0.21rem;
  div {
    flex: 1;
    &:nth-child(6) {
      width: 2rem;
    }
    &:last-child {
      width: 0.5rem;
    }
    span {
      display: inline-block;
      width: 0.73rem;
      line-height: 0.45rem;
      height: 0.43rem;
      margin-top: 0.1rem;
      color: rgba(24, 144, 255, 1);
      border-radius: 0.2rem;
    }
    p {
      margin-top: .25rem;
    }
    p.current {
      font-weight: bolder;
    }
    span.current {
      display: inline-block;
      position: relative;
      color: #fff;
      background: rgba(24, 144, 255, 1);
    }
  }
}
.coupon-content {
  .list {
   
  }
}
</style>