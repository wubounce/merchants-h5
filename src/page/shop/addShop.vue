<template>
  <section>
    <q-header :title="title"></q-header>
  </section>
</template>
<script>
import QHeader from '@/components/header';
export default {
  data() {
    return {
      title:'新增店铺'
    };
  },
  components:{
    QHeader
  }
};
</script>