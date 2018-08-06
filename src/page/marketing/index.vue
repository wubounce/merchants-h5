 <template>
<div class="marketing" v-title="title">
  <section class="tab-title">
  	<div v-for="(item,index) in tabtitle" @click="tabclick(index)"><span :class="{tabcurrent:tabindex === index}" >{{item}}</span></div>
  </section>
  <section class="tab-contont">

  	<div class="discount-wrap" v-if="tabindex === 0">
      <market></market>
  	</div>

  	<div class="VIP-wrap"  v-if="tabindex === 1">
      <vip></vip>
  	</div>
  </section>
</div>
</template>
<script>
import market from './marketIndex';
import vip from './vipIndex';
export default {
  components:{
    market,
    vip
  },
  data() {
    return {
      title: '营销管理',
      tabtitle:['显示优惠','VIP'],
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
    color: #333333;
    text-align: center;
    display: flex;
    >div {
      flex: 1;
    }
    .tabcurrent{
      color:#1890FF;
      border-bottom: 0.08rem solid #1890FF;
      border-radius:0.04rem;
      display: inline-block;
    }
  }
</style>
