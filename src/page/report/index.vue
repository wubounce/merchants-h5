 <template>
<div class="report" v-title="title">
  <section class="tab-title">
    <div v-for="(item,index) in tabtitle" @click="tabclick(index)"><span :class="{tabcurrent:tabindex === index}" >{{item}}</span></div>
  </section>
  <section class="tab-contont">
    <div class="discount-wrap" v-if="tabindex === 0">
       <reporteaning></reporteaning>
    </div>

    <div class="VIP-wrap"  v-if="tabindex === 1">
      <refund></refund>
    </div>
  </section>
   <div style="width:100%;height:1.73rem;"></div>
</div>
</template>
<script>
import reporteaning from './earnings';
import refund from './refund';
export default {
  components:{
    reporteaning,
    refund
  },
  data() {
    return {
      title: '报表',
      tabtitle:['收益','退款'],
      tabindex:0,
    };
  },
  mounted() {
    
  },
  created(){
  },
  methods: {
    tabclick(index){
      this.tabindex = index;
    },
  },
};
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/report/report";
</style>

