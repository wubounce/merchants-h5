 <template>
<div class="marketing-mang-wrap page-loadmore-height">
  <section class="tab-title">
  	<div @click="tabclick(0)" v-if="$store.getters.has('mer:marketing:list')"><span :class="{tabcurrent:tabindex === 0}" >限时优惠</span></div>
    <div @click="tabclick(1)" v-if="$store.getters.has('mer:marketing:vip:list')"><span :class="{tabcurrent:tabindex === 1}" >VIP</span></div>
    <div @click="tabclick(2)" v-if="$store.getters.has('mer:voucher')"><span :class="{tabcurrent:tabindex === 2}" >优惠券记录</span></div>
  </section>
  <section class="tab-contont page-loadmore-height">
  	<div class="discount-wrap page-loadmore-height" v-if="tabindex === 0">
      <market></market>
  	</div>
  	<div class="discount-wrap page-loadmore-height" v-if="tabindex === 1">
       <vip></vip>
  	</div>
  	<div class="discount-wrap page-loadmore-height" v-if="tabindex === 2">
      <discount-coupon></discount-coupon>
  	</div>
  </section>
</div>
</template>
<script>
import market from './marketIndex';
import vip from './vipIndex';
import discountCoupon from './discountCoupon';
export default {
  components:{
    market,
    vip,
    discountCoupon
  },
  data() {
    return {
      tabtitle:[
        { title:'限时优惠',per:'mer:marketing:list'},
        { title:'VIP', per:'mer:marketing:vip:list'},
        {title:'优惠券记录',per:'mer:voucher'},
      ],
      tabindex:0,
    };
  },
  mounted() {
    if(this.$store.getters.has('mer:marketing:list')){
      this.tabindex = 0;
    }else if(this.$store.getters.has('mer:marketing:vip:list')){
      this.tabindex = 1;
    }else if(this.$store.getters.has('mer:voucher')){
      this.tabindex = 2;
    }
  },
  created(){
    let query = this.$route.query ? this.$route.query : {};
    this.tabindex = query.tabindex ? Number(query.tabindex) : 0;
  },
  methods: {
    tabclick(index){
    	this.tabindex = index;
      this.$router.replace({query: {tabindex:this.tabindex}});
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
