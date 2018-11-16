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
                <span @click="openByDialog" class="iconfont icon-rili"></span>
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
        <!-- 日历选择 -->
        <mt-popup v-model="calendar.show" position="bottom" class="mint-popup">
        <div v-if="tooltip" class="ivu-tooltip-inner">{{tooltip}}</div>
        <div class="calendar-dialog-body" v-if="isreset">
            <calendar :range="calendar.range" :zero="calendar.zero" :lunar="calendar.lunar" :begin="calendar.begin" :end="calendar.end" :type="calendar.type" :value="calendar.value"  @select="calendar.select"></calendar>
            <div class="footer">
                <div>
                    <mt-button class="ca-coupon-btn" @click="selectDateCom">确定</mt-button>
                </div>
                <div>
                <mt-button class="ca-coupon-btn reset" @click="resetDate">重置</mt-button>
                </div>
            </div>
        </div>
        </mt-popup>
    </section>
</template>

<script type='text/ecmascript-6'>
  import { voucherListFun } from '@/service/voucher';
  import PagerMixin from '@/mixins/pagerMixin';
  import calendar from '@/components/vue-calendar/calendar.vue';
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
        startDate:[],
        endDate: [],
        tooltip:'',
        calendar:{
            range:true,
            lunar:false, //显示农历
            show:false,
            zero:true,
            type:'datetime',
            value:[], //默认日期
            select:(begin,end)=>{
              this.startDate = begin;
              this.endDate = end;
              let startTime = this.startDate.join('');  
              let temp =  moment(this.startDate).add('months',11).format('YYYYMMDD');  //从开始时间起六个月间隔
              let endTime =  this.endDate.join('');  
              if(endTime>temp){
                this.tooltip = '只支持查询跨度12个月内记录';
                setTimeout(()=>{
                  this.tooltip = '';
                },3000);
                return false;
              }else {
                this.tooltip = '';
              }
            }
        },
        isreset:true,
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
            let payload =  {phone:this.searchData,startDate:this.startDate.join('-'),endDate:this.endDate.join('-'),page:this.page,pageSize:this.pageSize};
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
        openByDialog(){
            this.calendar.show=true;
            this.isreset=true;
        },
        selectDateCom(){
            let startTime = this.startDate.join('');  
            let temp =  moment(this.startDate).add('months',5).format('YYYYMMDD');  //从开始时间起六个月间隔
            let endTime =  this.endDate.join('');  
            if(endTime>temp){
            this.tooltip = '只支持查询跨度6个月内记录';
            setTimeout(()=>{
                this.tooltip = '';
            },3000);
            return false;
            }else {
            this.tooltip = '';
            }
            this.calendar.show=false;
            this.noOrderList = false;
            this. repeatlist();
        },
        shopselectpicker(data){
            this.currentTags = data;
            this._getList();
        },
        shopselectpickertatus(data){
            this.popupVisible = data;
        },
        resetDate(){
            this.calendar.show=false;
            this.startDate = [],
            this.endDate = [],
            this.isreset=false;
            this.noOrderList = false;
            this. repeatlist();
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
        calendar,
    }
  };
</script>
</script>

<style lang='scss' scoped type='text/css'>
 @import '../../assets/scss/marketing/salerecord';

</style>
