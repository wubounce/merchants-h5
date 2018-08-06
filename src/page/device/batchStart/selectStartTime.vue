<template>
  <section>
    <q-header :title="title"></q-header>
    <div class="bat-step">
      <p v-for="(item,index) in stepArr " :key="index" :class="{active:currIndex==index}">
        <span @click="chooseStep(index)">{{item.text}}</span>
      </p>
    </div>
    <ul>
      <li class="bat-hd">
        <span>{{hdTitleArr[currIndex]}}</span>
        <span>{{selectedFirstype}}</span>
      </li>
    </ul>
  </section>
</template>
<script>
  export default {
    data() {
      return {
        selectIndex: -1
      };
    },
    methods: {
     
    }
  };

</script>

<style lang="scss" scoped>
  

</style>
