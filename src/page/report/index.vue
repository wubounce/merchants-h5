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
<style type="text/css" lang="scss" scoped>

  .tab-title {
    background: #fff;
    width: 100%;
    height: 1.33rem;
    line-height: 1.33rem;
    font-size: 16px;
    color: #666666;
    text-align: center;
    display: flex;
    z-index: 10000000;
    position: fixed;
    top:0;
    border-bottom:1px solid #E5E5E5;
    >div {
      flex: 1;
    }
    .tabcurrent{
      color:#1890FF;
      border-bottom: 0.08rem solid #1890FF;
      border-radius:0.04rem;
      display: inline-block;
      padding:0 0.85rem;
      font-weight: 600;
    }
  }
</style>

