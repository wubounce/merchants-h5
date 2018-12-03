<template>
    <section class="page-loadmore-height">
        <div class="search-header">
            <section class="sarch-wrap">
                <div class="search">
                    <form action="" target="frameFile" v-on:submit.prevent="">
                        <span class="iconfont icon-IconSearch"></span>
                        <input type="number" pattern="\d*" value='搜索' v-model.trim="searchData" @keyup.enter="searchVoucher" @input="clearSearch" placeholder="输入用户手机号" class="serch">
                        <span class="guanbi iconfont icon-guanbi member-guanbi" v-if="iscolsed" @click="doclearSearch"></span>
                        <iframe name='frameFile' style="display: none;"></iframe>
                        <!-- <span class="select-back" @click="searchVoucher">搜索</span> -->
                    </form>
                </div>
                <div class="sale-shop"  @click="popupVisible=true;">{{currentTags?currentTags.shopName:'全部店铺'}}<span class="iconfont icon-xiangxiajiantou select-back"></span></div>
            </section>
            <div class="total">
               <span>共{{total}}条记录</span>
            </div>
        </div>
         <div class="no-order" v-if="nosearchList"><p>未找到符合的结果</p></div>
        <div class="no-order" v-if="noOrderList"><p>暂无记录</p></div>
        <div class="page-top">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{overflowY:scrollShow}">
                <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"  @translate-change="translateChange" :auto-fill="false" ref="loadmore">
                    <div class="record-wrap">
                        <div class="recored-list" v-for="(item,index) in list" :key="index">
                            <p>VIP用户<span>{{item.userPhone}}</span></p>
                            <p class="middle-shop">售卡店铺<span>{{item.shopName}}</span></p>
                            <p>购买时间<span>{{item.soldCardDate}}</span></p>
                        </div>
                    </div>
                    <div v-if="allLoaded" class="nomore-data">没有更多了</div>
                </mt-loadmore>
            </div> 
        </div>
         <!-- 选择店铺 -->
        <selectpickr :visible="popupVisible" :slots="shopSlots" :valueKey="shopName" :title="'店铺'" @selectpicker="shopselectpicker" @onpickstatus="shopselectpickertatus"></selectpickr>
    </section>
</template>

<script type='text/ecmascript-6'>
  import { vipMemberListFun } from '@/service/voucher';
  import PagerMixin from '@/mixins/pagerMixin';
  import selectpickr from '@/components/selectPicker';
  import { validatReplace } from '@/utils/validate';
  import { dayReportFun, shopListFun } from '@/service/report';

  // 节流函数
  const delay = (function() {
    let timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
  })();

  export default {
    mixins: [PagerMixin],
    data () {
      return {
        pageSize:20,
        list:[],
        shopId: '',
        searchData:'',
        shopName:'shopName',
        currentTags:null,
        popupVisible:false,
        shopSlots:[
        {
                flex: 1,
                values: [],
                className: 'slot1',
                textAlign: 'center'
            }
        ],
        noOrderList:false,
        nosearchList:false,
        iscolsed:false,
      };
    },
    created() {
        this.shopListFun();
        this._getList();
    },
    methods:{
        async shopListFun(){
            let res = await shopListFun();
            this.shopSlots[0].values = [{shopName:'全部店铺'},...res];
        },
        async _getList() {
            if (this.searchData !== '') {
            // 去掉特殊字符和空格
            this.searchData = this.searchData.replace(validatReplace, '');
            }
            let payload =  {userPhone:this.searchData,shopId:this.shopId,page:this.page,pageSize:this.pageSize};
            let res = await vipMemberListFun(payload);
            this.titleArr = res.count;
            this.list = res.items?[...this.list,...res.items]:[];  //分页添加
            this.list = this.list.map(item => {
            	let data = {
            		userPhone: item.userPhone,
            		shopName: item.shopName,
            		soldCardDate: moment(item.soldCardDate).format('YYYY-MM-DD')
            	};
            	return data;
        	});
            this.total = res.total;
            if (this.searchData || this.currentTags) {
                this.noOrderList = false;
                this.nosearchList = this.list.length<= 0 ? true: false;
            }else {
                this.nosearchList = false;
                this.noOrderList = this.list.length<= 0 ? true: false;
            }
        },
        shopselectpicker(data){
            this.currentTags = data;
            this.shopId = data.shopId;
            this.page  = 1;
            this.list = [];
            this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
            this._getList();
        },
        shopselectpickertatus(data){
            this.popupVisible = data;
        },
        async fetchData(val) {
            this.page  = 1;
            this.list = [];
            this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
            this.noOrderList = false;
            await this._getList();
        },
        // async searchVoucher(e){ //搜索
        //     this.page  = 1;
        //     this.list = [];
        //     this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
        //     this.noOrderList = false;
        //     var keyCode = window.event? e.keyCode:e.which;
        //     if(keyCode =='13'){
        //         this._getList();
        //     document.activeElement.blur();
        //     }else {
        //         this._getList();
        //     }
        // },
        clearSearch(){ //清除搜索
            this.iscolsed = true;
            if(this.searchData.length <= 0 ){
                this.page  = 1;
                this.list = [];
                this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
                this.noOrderList = false;
                this.searchData = '';
                this.iscolsed = false;
                this._getList();
            }
        },
        doclearSearch(){
            this.page  = 1;
            this.list = [];
            this.allLoaded = false;//下拉刷新时解除上拉加载的禁用
            this.noOrderList = false;
            this.searchData = '';
            this.iscolsed = false;
            this._getList();
        }
        
    },
    watch: {
		searchData (v) {
            delay(() => {
                this.fetchData();
            }, 300);
            
            // var keyCode = window.event? e.keyCode:e.which;
            // if(keyCode =='13'){
            //     this._getList();
            //      document.activeElement.blur();
            // }else {
            //     this._getList();
            // }
		}
	},
    components:{
       selectpickr,
    }
  };
</script>
</script>

<style lang='scss' scoped type='text/css'>
 @import '../../assets/scss/marketing/salerecord';

</style>
