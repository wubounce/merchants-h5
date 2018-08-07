/**
 *  描述：混合类
 */
export default {
  data () {
    return {
      list: [],                                           // 列表展示
      page: 1,//页码
      pageSize:10,
      total:null,
      allLoaded: false,//数据是否加载完毕
      wrapperHeight: 0,//容器高度
    };
  },
  computed: {
  },
  created () {
    this._getList();
  },
  mounted () {
  },
  methods: {
    loadBottom() {
      this.page += 1;
      let allpage = Math.ceil(this.total/this.pageSize);
      if(this.page <= allpage){
        this._getList();
      }else{
        this.allLoaded = true;//模拟数据加载完毕 禁用上拉加载
      }
      this.$refs.loadmore.onBottomLoaded();
    },
    loadTop() {
      this.page = 1;
      this.list = [];
      this._getList();
      this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
      this.$refs.loadmore.onTopLoaded();
    },
  },
  watch: {
   
  }
};
