<template>
<div>
  <q-header :title="title"></q-header>
  <section>
    
  </section>
  <q-menu></q-menu>
</div>
</template>
<script>
import QHeader from '@/components/header';
import QMenu from '@/components/menu';
export default {
  data() {
    return {
      title: '企鹅商家管理后台'
    };
  },
  mounted() {
    
  },
  methods: {
    
  },
  components:{
    QHeader,
    QMenu
  }
};
</script>
