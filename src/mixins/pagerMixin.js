/**
 *  描述：混合类
 */
export default {
  data () {
    return {
      list: [],                                           // 列表展示
      page: 1,//页码
      pageSize:50,
      total:null,
      allLoaded: false,//数据是否加载完毕
      wrapperHeight: 0,//容器高度
      scrollShow:'auto',  
      bottomStatus: null,//底部上拉加载状态
      translate: 0,//
      moveTranslate: 0,
      accountOnlySix:true, //收支明细六个月记录
      payload: null
    };
  },
  computed: {
  },
  created () {
  },
  mounted () {
  },
  methods: {
    loadBottom() {
      // this.handleBottomChange("loading");//上拉时 改变状态码
      this.accountOnlySix = false;
      this.page += 1;
      let allpage = Math.ceil(this.total/this.pageSize);
      if(this.page <= allpage){
        this.payload = {machineState:this.index,shopId:this.popShopId,parentTypeId:this.popDeviceTypeId,subTypeId:this.popDeviceModelId,communicateType:this.popCommunicationType,page:this.page,pageSize: this.pageSize};
        if(this.payload) {
          this._getList(this.payload);
        }else{
          this._getList();
        }
      }else{
        this.accountOnlySix = true;
        this.allLoaded = true;//模拟数据加载完毕 禁用上拉加载
      }
      // this.handleBottomChange("loadingEnd");//数据加载完毕 修改状态码
      this.$refs.loadmore.onBottomLoaded();
    },
    //针对有的安卓机上overflow：scroll会出现重叠现象
    translateChange(translate) {              
      if(translate > 0){
        this.scrollShow = '';
      }else{
        this.scrollShow = 'auto';
        
      }       
    },
    loadTop() {
      // this.handleTopChange("loading");//下拉时 改变状态码
      this.page = 1;
      this.list = [];
      if(this.payload) {
        this._getList(this.payload);
      }else{
        this._getList();
      }
      this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
      // this.handleTopChange("loadingEnd")//数据加载完毕 修改状态码
      this.$refs.loadmore.onTopLoaded();
    },
//     handleBottomChange(status) {
//       this.moveTranslate = 1;
//       this.bottomStatus = status;
//     },
//     translateChange(translate) {
//     const translateNum = +translate;
//     this.translate = translateNum.toFixed(2);
//     this.moveTranslate = (1 + translateNum / 70).toFixed(2);
//     },
//     handleTopChange(status) {
// this.moveTranslate = 1;
// this.topStatus = status;
// },
  },
  watch: {
   
  }
};
