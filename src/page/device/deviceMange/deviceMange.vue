<template>
  <section>
    <q-header :title="title"></q-header>
    <div class="search">
      <d-search></d-search>
    </div>
  </section>
</template>
<script>
  import QHeader from '@/components/header';
  import DSearch from '@/components/Search/search';
  export default {
    data() {
      return {
        title: '设备管理',
      };
    },
    mounted() {

    },
    methods: {

    },
    components: {
      QHeader,
      DSearch
    }
  };

</script>
<style lang="scss" scoped>
  .search {
    width: 100%;
    display: flex;
  }

</style>
