<template>
  <section class="sf-wrappper">
    <div class="sf-bd">
      <p class="item" v-for="(item,index) in firstTypeList" :class="{selected:index==selectIndex}" :key="index" @click="sltItem(index)">{{item}}</p>
    </div>
  </section>
</template>
<script>
  export default {
    data() {
      return {
        firstTypeList: ['洗衣机', '吹风机', '烘干机', '洗鞋机', '充电桩', '其他'],
        selectIndex: -1
      };
    },
    methods: {
      sltItem(i) {
        this.selectIndex = i;
      }
    }
  };

</script>

<style lang="scss" scoped>
  .sf-wrappper {
    .sf-bd {
      .item {
        text-align: center;
        height: 1.17rem;
        line-height: 1.17rem;
        background: rgba(255, 255, 255, 1);
        font-size: 0.4rem;
        color: rgba(51, 51, 51, 1)
      }
      .selected {
        background: url('../../../../static/image/device/selected-bgc-icon.jpeg') no-repeat 96% 50% padding-box;
        background-size: .6rem;
        background-color: rgba(24, 144, 255, 0.05);
      }
    }
  }

</style>
