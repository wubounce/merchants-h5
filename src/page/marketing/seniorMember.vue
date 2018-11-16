<template>
    <section>
        <div class="search-header">
            <section class="sarch-wrap">
                <div class="search">
                    <form action="" target="frameFile" v-on:submit.prevent="">
                        <span class="iconfont icon-IconSearch"></span>
                        <input type="number" pattern="\d*" value='搜索'v-model.trim="searchData" @keyup.enter="searchVoucher" @input="clearSearch" placeholder="输入用户手机号" class="serch">
                        <span class="guanbi iconfont icon-guanbi" v-if="iscolsed" @click="doclearSearch"></span>
                        <iframe name='frameFile' style="display: none;"></iframe>
                        <span class="select-back" @click="searchVoucher">搜索</span>
                    </form>
                </div>
                <div class="sale-shop"  @click="popupVisible=true;">{{currentTags?currentTags.shopName:'全部店铺'}}<span class="iconfont icon-xiangxiajiantou select-back"></span></div>
            </section>
            <div class="total">
                <span>共230条记录</span>
            </div>
        </div>
        <div class="record-wrap">
            <div class="recored-list">
                <p>VIP用户<span>18948788872</span></p>
                <p class="middle-shop">售卡店铺<span>UCC国际洗衣店</span></p>
                <p>购买时间<span>2018-10-29 09:33:23</span><span class="time">3个月<span class="money">30</span>元</span></p>
            </div>
            <div class="recored-list">
                <p>VIP用户<span>18948788872</span></p>
                <p class="middle-shop">售卡店铺<span>UCC国际洗衣店</span></p>
                <p>购买时间<span>2018-10-29 09:33:23</span><span class="time">3个月<span class="money">30</span>元</span></p>
            </div>
        </div>
         <!-- 选择店铺 -->
        <selectpickr :visible="popupVisible" :slots="shopSlots" :valueKey="shopName" :title="'店铺'" @selectpicker="shopselectpicker" @onpickstatus="shopselectpickertatus"></selectpickr>
    </section>
</template>

<script type='text/ecmascript-6'>
  import { voucherListFun } from '@/service/voucher';
  import PagerMixin from '@/mixins/pagerMixin';
  import selectpickr from '@/components/selectPicker';
  import { validatReplace } from '@/utils/validate';
  import { dayReportFun, shopListFun } from '@/service/report';
  export default {
    mixins: [PagerMixin],
    data () {
      return {
        pageSize:20,
        list:[],
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
            let payload =  {phone:this.searchData,page:this.page,pageSize:this.pageSize};
            let res = await voucherListFun(payload);
            this.titleArr = res.count;
            this.list = res.page?[...this.list,...res.page.items]:[];  //分页添加
            this.total = res.page.total;
            if (this.searchData || (this.startDate.length > 0 && this.endDate.length > 0)) {
            this.noOrderList = false;
            this.nosearchList = this.list.length<= 0 ? true: false;
            }else {
            this.nosearchList = false;
            this.noOrderList = this.list.length<= 0 ? true: false;
            }
        },
        shopselectpicker(data){
            this.currentTags = data;
            this._getList();
        },
        shopselectpickertatus(data){
            this.popupVisible = data;
        },
        async searchVoucher(e){ //搜索
            this.noOrderList = false;
            var keyCode = window.event? e.keyCode:e.which;
            if(keyCode =='13'){
            this. repeatlist();
            document.activeElement.blur();
            }else {
            this. repeatlist();
            }
        },
        clearSearch(){ //清除搜索
            this.iscolsed = true;
            if(this.searchData.length <= 0 ){
            this.iscolsed = false;
            this. repeatlist();
            }
        },
        doclearSearch(){
            this.searchData = '';
            this.iscolsed = false;
            this. repeatlist();
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
