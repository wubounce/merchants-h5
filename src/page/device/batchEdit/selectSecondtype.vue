<template>
  <section class="sd-wrappper">
    <div class="sd-bd">
      <p class="item" v-for="(item,index) in firstTypeList" :class="{selected:index==selectIndex}" :key="index" @click="sltItem(index)">{{item}}</p>
    </div>
  </section>
</template>
<script>
  export default {
    data() {
      return {
        firstTypeList: ['海尔8kg', 'LG6kg', '格兰仕', '格力', '海丫', '其他'],
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
  .sd-wrappper {
    .sd-bd {
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
