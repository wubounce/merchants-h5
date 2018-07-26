<template>
  <sction class="bat-wrapper">
    <q-header :title="title"></q-header>
    <div class="bat-step">
      <p v-for="(item,index) in stepArr " :key="index" :class="{active:currIndex==index}">
        <span @click="chooseStep(index)">{{item.text}}</span>
      </p>
    </div>
    <div class="bat-hd">
      <span>{{hdTitleArr[currIndex]}}</span>
      <span>企鹅一号店</span>
    </div>
    <div class="bat-bd">
      <transition name="move" mode="out-in">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </sction>
</template>

<script>
  import Button from "@/components/Button/Button";
  import QHeader from '@/components/header';
  export default {
    data() {
      return {
        title: '批量修改',
        stepArr: [{
          text: '店铺',
          name: 'selectShop'
        }, {
          text: '类型',
          name: 'selectFirstype'
        }, {
          text: '型号',
          name: 'selectSecondtype'
        }, {
          text: '功能',
          name: 'selectFunction'
        }],
        currIndex: 0,
        hdTitleArr: ['1. 请选择相应店铺', '2. 请选择设备类型', '3. 请选择设备型号', '4. 请选择设备相应功能', ]
      };
    },
    methods: {
      chooseStep(i) {
        this.currIndex = i;
        this.$router.push({
          name: this.stepArr[this.currIndex].name
        });
      }
    },
    components: {
      Button,
      QHeader,
    },
    created() {}
  };

</script>
<style lang="scss" scoped>
  .bat-wrapper {
    .bat-step {
      display: flex;
      justify-content: space-between;
      height: 2.08rem;
      font-size: 0.37rem;
      color: #1890FF;
      background: #F9FCFF;
      p {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          text-align: center;
          width: 1.11rem;
          height: 0.64rem;
          line-height: 0.64rem;
          box-shadow: 0rem 0.03rem 0.05rem 0rem rgba(179, 218, 255, 1);
          border-radius: 0.39rem;
          border: 0rem solid rgba(255, 255, 255, 1);
        }
      }
      .active {
        span {
          color: #fff;
          background: #1890FF;
        }
      }
    }
    .bat-hd {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 .4rem;
      margin-bottom: .13rem;
      font-size: 0.43rem;
      height: 1.6rem;
      color: rgba(51, 51, 51, 1);
      background: #fff;
      span {
        &:nth-child(2) {
          font-size: 0.37rem;
          color: #1890FF;
        }
      }
    }
  }

  .move-enter-active,
  .move-leave-active {
    transition: opacity .3s;
  }

  .move-enter,
  .move-leave {
    opacity: 0;
  }

</style>
