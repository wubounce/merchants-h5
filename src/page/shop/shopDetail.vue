<template>
  <section class="personal">
    <div class="permissions" v-if="$store.getters.has('mer:shop:info')">暂无相关页面权限</div>
    <div v-else>
        <!-- 第一模块 -->
        <p class="shop-item title"><span>累计收益</span><span>{{shopdetail.profit | tofixd}} 元</span></p>

        <!-- 第二模块 -->
        <p class="shop-item second-p"><span>店铺名称</span><span>{{shopdetail.shopName}}</span></p>
        <p class="shop-item"><span>店铺类型</span><span>{{shopdetail.shopType}}</span></p>
        <p class="shop-address">
          <span>店铺地址</span><br>
          <span>{{ completeAddress }}</span>
        </p>
        
        <!-- 第三模块 -->
        <div class="shop-machine second-p">
          <span class='machine-type'>已有设备</span>
          <div class="shop-machine-bottom">
            <span class="one-machine" v-for="(item,index) in list" :key="index">{{item}}</span>
          </div>
        </div>
        <p class="shop-item"><span>设备数量</span><span>{{shopdetail.machineCount}} 台</span></p>
        <p class="shop-item"><span>预约功能</span><span>{{shopdetail.isReserve == 0? '已开通' : '未开通'}}</span></p>
        <p class="shop-item"><span>预约时长(分钟)</span><span>{{shopdetail.orderLimitMinutes}}</span></p>
        <p class="shop-item"><span>营业时间</span><span>{{shopdetail.workTime}}</span></p>
        <p class="shop-item"><span>限时优惠</span><span>{{shopdetail.isDiscount ==true ? '已设置' : '未设置'}}</span></p>
        <p class="shop-item">
          <span>已设置 VIP卡</span>
          <span>
            {{shopdetail.hasVip == false ? '暂无' : '' }}
            {{shopdetail.seasonCard == true ? '季卡' : '' }}
            <!-- 拥有季卡和半年卡 -->
            {{shopdetail.seasonCard == true && shopdetail.halfYearCard == true  ? '、' : '' }}
            {{shopdetail.halfYearCard == true ? '半年卡' : '' }}
            <!-- 拥有半年卡和年卡 -->
            {{shopdetail.yearCard == true && shopdetail.halfYearCard == true  ? '、' : '' }}
            <!-- 拥有季卡和年卡 -->
            {{shopdetail.yearCard == true && shopdetail.seasonCard == true &&  shopdetail.halfYearCard == false ? '、' : '' }}
            {{shopdetail.yearCard == true ? '年卡' : '' }}
          </span>
        </p>
        <p class="shop-item"><span>VIP数量</span><span>{{shopdetail.vipCount}}个</span></p>

        <!-- 第四模块 -->
        <p class="shop-info second-p"><span>创建人：</span><span>{{shopdetail.createUser}}</span></p>
        <p class="shop-info createTime"><span>创建时间：</span><span>{{shopdetail.createTime}}</span></p>
        <p class="blank"></p>

        <!-- 第五模块 -->
        <p class="about-button">
          <Button btn-type="small" btn-color="spe" id="delete" @confirm="isDeleteOrNot(shopdetail.shopId)" v-has="'mer:shop:delete'">删除</Button>
    			<Button btn-type="small" btn-color="spe" id="edit" @confirm="goShopEdit()" v-has="'mer:shop:update'">编辑</Button>
        </p>
   </div>
  </section>
</template>
<script>
import Button from "@/components/Button/Button";
import { MessageBox } from 'mint-ui';
import { shopDetailFun } from '@/service/shop';
import { deleteShopFun } from '@/service/shop';
export default {
  data() {
    return {
      //shopId:this.$route.query.shopId,
      list:[],
      shopdetail:{},
      completeAddress:'',
      what:'',
      lng:'',
      lat:'',
      formattedAddress:'',
      provinceName:'',
      cityName:'',
      districtName:'',
      organization:'',
      address:''
    };
  },
  methods:{
    isDeleteOrNot(id) {
      MessageBox.confirm('确认删除店铺？','').then(async () => {
        let payload = {shopId: id};
        let res = await deleteShopFun(payload);
        this.$toast({message: '删除成功' });
        this.$router.push({name:'shopList'});
      });
    },
    goShopEdit() {
      //编辑功能
      this.$router.push({
        name:'editShop',
        query:{
          shopId: this.$route.query.shopId
        }
      });
    },
    async getShopDetail() {
      let payload = { shopId: this.$route.query.shopId };
      let res = await shopDetailFun(payload);
      this.shopdetail = res;
      if(res.imageId == null || res.imageId == '' ) {
        this.shopdetail.imageId = '../../../static/image/shop/add.png';
      }
      this.list = res.machineTypeNames.split(',');
      this.lng = res.lng;
      this.lat = res.lat;
      //累计收益
      this.shopdetail.profit = res.profit;
      //店铺类型
      this.shopdetail.shopType = res.shopTypeName;
      //店铺地址
      this.provinceName = res.provinceName;
      this.cityName = res.cityName;
      this.districtName = res.districtName;
      
      this.address = res.address;
      if(res.organization) {
        this.organization = res.organization;
      }
      else {
        this.organization = '';
      }
      if(this.districtName == this.cityName) {
        this.districtName = '';
      }
      if(this.provinceName == this.cityName.slice(0,this.cityName.length-1)) {
        this.completeAddress = this.cityName + this.districtName + this.organization + this.address;
      }
      else {
        this.completeAddress = this.provinceName + this.cityName + this.districtName + this.organization + this.address;
      }
      //预约时长
      if(res.orderLimitMinutes) {
        this.shopdetail.orderLimitMinutes = res.orderLimitMinutes;
      }
      else {
        this.shopdetail.orderLimitMinutes = '';
      }
    }
  },
  created() {
    this.getShopDetail();
  },
  mounted() {
  },
  components:{
    Button
  }
};
</script>
<style lang="scss" scoped>
@import '../../assets/scss/shop/shopDetail';
</style>
<style>
.mint-switch-input:checked + .mint-switch-core {
  border-color: #4DD865;
  background-color: #4DD865;
}
</style>
