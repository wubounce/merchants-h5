 <template>
<div class="marketing-mang-wrap page-loadmore-height" v-title="title">
  <section class="tab-title">
  	<div v-for="(item,index) in tabtitle" @click="tabclick(index)"><span :class="{tabcurrent:tabindex === index}" >{{item}}</span></div>
  </section>
  <section class="tab-contont page-loadmore-height">

  	<div class="discount-wrap page-loadmore-height" v-if="tabindex === 0">
      <market></market>
  	</div>

  	<div class="VIP-wrap page-loadmore-height"  v-if="tabindex === 1">
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
      tabtitle:['限时优惠','VIP'],
      tabindex:0,
    };
  },
  mounted() {
    
  },
  created(){
    let query = this.$route.query ? this.$route.query : {};
    this.tabindex = query.tabindex ? Number(query.tabindex) : 0;
  },
  methods: {
    tabclick(index){
    	this.tabindex = index;
      this.$router.push({query: {tabindex:this.tabindex}});
    },
  },
};
</script>
<style type="text/css" lang="scss" scoped>
.marketing-mang-wrap {
  padding-top:1.33rem; 
  box-sizing: border-box;
}
  .tab-title {
    background: #fff;
    width: 100%;
    height: 1.33rem;
    line-height: 1.33rem;
    font-size: 16px;
    color: #333333;
    text-align: center;
    display: flex;
    border-bottom:1px solid #f9f8ff;
    z-index: 9999;
    position: fixed;
    top: 0;
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
