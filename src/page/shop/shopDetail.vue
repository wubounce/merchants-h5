<template>
  <section class="personal" v-title="title">
    <div class="permissions" v-if="$store.getters.has('mer:shop:info')">暂无相关页面权限</div>
    <div v-else>
        <!-- 第一模块 -->
        <p class="shop-item title"><span>累计收益</span><span>{{shopdetail.profit}} 元</span></p>
        <p class="shop-item second-p"><span>店铺名称</span><span>{{shopdetail.shopName}}</span></p>
        <p class="shop-item"><span>店铺类型</span><span>{{shopdetail.shopType}}</span></p>
        <p class="shop-address">
          <span>店铺地址</span><br>
          <span>{{ completeAddress }}</span></p>

        <!-- 第二模块 -->
        <div class="shop-machine">
          <span class='machine-type'>设备类型</span>
          <div class="shop-machine-bottom">
            <span class="one-machine" v-for="(item,index) in list" :key="index">{{item}}</span>
          </div>
        </div>
        <p class="shop-item"><span>设备数量</span><span>{{shopdetail.machineCount}} 台</span></p>
        <p class="shop-item"><span>预约功能</span><span>{{shopdetail.isReserve == 0? '已开通' : '未开通'}}</span></p>
        <p class="shop-item"><span>预约时长(分钟)</span><span>{{shopdetail.orderLimitMinutes}}</span></p>
        <!-- 下个版本再做，营业时间 -->
        <!-- <p class="shop-item"><span>营业时间</span><span>{{shopdetail.workTime}}</span></p> -->
        <!-- 第三模块 -->
        <p class="shop-item second-p"><span>限时优惠</span><span>{{shopdetail.isDiscount ==true ? '已设置' : '未设置'}}</span></p>
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
import qs from "qs";
import Button from "@/components/Button/Button";
import { MessageBox } from 'mint-ui';
import { shopDetailFun } from '@/service/shop';
import { deleteShopFun } from '@/service/shop';
export default {
  data() {
    return {
      //shopId:this.$route.query.shopId,
      title: '店铺详情',
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
        let res = await deleteShopFun(qs.stringify(payload));
        if (res.code === 0) {
          this.$toast({message: '删除成功' });
           this.$router.push({name:'shopList'});
        } else {
          this.$toast({message: res.msg });
        }
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
      let obj = { shopId: this.$route.query.shopId };
      let res = await shopDetailFun(qs.stringify(obj));
      if(res.code===0) {
        this.shopdetail = res.data;
        if(res.data.imageId == null || res.data.imageId == '' ) {
          this.shopdetail.imageId = '../../../static/image/shop/add.png';
        }
        this.list = res.data.machineTypeNames.split(',');
        this.lng = res.data.lng;
        this.lat = res.data.lat;
        //累计收益
        this.shopdetail.profit = res.data.profit;
        if(this.shopdetail.profit) {
          //将number类型的数据转化成string
          this.shopdetail.profit = this.shopdetail.profit+'';
          //判断是不是'5'
          if(this.shopdetail.profit.split('.').length == 1) {
            this.shopdetail.profit = this.shopdetail.profit + '.00';
          }
          else {
            //判断是不是'5.0'
            if(this.shopdetail.profit.split('.')[1].length ==1) {
              this.shopdetail.profit = this.shopdetail.profit + '0';
            }
          }
        }
        else {
          this.shopdetail.profit = '0.00';
        }
        
        //店铺类型
        this.shopdetail.shopType = res.data.shopTypeName;
        //店铺地址
        this.provinceName = res.data.provinceName;
        this.cityName = res.data.cityName;
        this.districtName = res.data.districtName;
        
        this.address = res.data.address;
        if(res.data.organization) {
          this.organization = res.data.organization;
        }
        else {
          this.organization = '';
        }
        if(this.provinceName == this.cityName.slice(0,this.cityName.length-1)) {
          this.completeAddress = this.cityName + this.districtName + this.organization + this.address;
        }
        else {
          this.completeAddress = this.provinceName + this.cityName + this.districtName + this.organization + this.address;
        }
        //预约时长
        if(res.data.orderLimitMinutes) {
          this.shopdetail.orderLimitMinutes = res.data.orderLimitMinutes;
        }
        else {
          this.shopdetail.orderLimitMinutes = '';
        }
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
.personal {
   title {
      border-top: 1px solid #f9f8ff;
   }
   .second-p {
     margin-top: 0.3rem;
   }
   .shop-address {
     font-size: 16px;
     padding: 0.53rem;
     background-color: #fff; 
     border-bottom: 1px solid #f9f8ff;
     span {
        &:first-child {
          color:rgba(153,153,153,1);
        }
        &:last-child {
          color:rgba(51,51,51,1);
          margin-top: 0.3rem;
          display: inline-block;
        }
      }
   }
   .shop-machine {
     font-size: 16px;
     background-color: #fff;
     border-bottom: 1px solid #f9f8ff;
     span {
       &:first-child {
          color:rgba(153,153,153,1);
          display: inline-block;
          margin-top: 0.2rem;
          margin-left: 0.53rem;
          margin-bottom: 0.2rem;
        }
     }
     .shop-machine-bottom {
       margin-bottom: 0.2rem;
       margin-left: 0.33rem;
       .one-machine {
          font-size: 14px;
          color: #333333;
          background-color: rgba(24, 144, 255, 0.05);
          display: inline-block;
          text-align: center;
          margin-right: 0.24rem;
          margin-bottom: 0.2rem;
          border-radius: 4px;
          width: 27%;
          height: 1.2rem;
          line-height: 1.2rem;
          margin-left: 0.24rem;
        }
     }
   }
   .shop-item {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      padding: 0.53rem;
      border-bottom: 1px solid #f9f8ff;
      background-color: #fff; 
      span {
        &:first-child {
          color:rgba(153,153,153,1);
        }
        &:last-child {
          color:rgba(51,51,51,1);
        }
    }
  }
  .picture {
      display: flex;
      padding-top: 0.2rem;
      justify-content: space-between;
      background-color: #fff;
      border-bottom: 1px solid #f9f8ff;
      span {
        &:first-child {
          font-size: 16px;
          line-height: 2rem;
          padding-left: 0.3rem;
          color:rgba(153,153,153,1);
        }
        &:last-child {
          padding-right: 0.3rem;
          .shop-img {
            width: 2rem;
            height: 2rem;
          }
        }
      }
  }
  .shop-info {
    font-size: 12px;
    background-color: #fff;
    color:rgba(153,153,153,1);
    padding-left: 0.2rem;
    padding-top: 0.3rem;
    span {
      padding-left: 0.3rem;
    }
  }
  .createTime {
    padding-bottom: 0.3rem;
  }
  .blank {
    height: 2.5rem;
  }
  .about-button {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: flex-end;
    #delete,#edit {
      margin: 0.3rem 0;
      width: 2.2rem;
      line-height: 0.9rem;
      height: 0.9rem;
      border-radius: 5px;
      margin-right: 0.3rem;
      font-size: 14px;
    }
    #delete {
      color: #333333;
      border-color:#D8D8D8;
    }
    #edit {
      color:#1890FF;
      border-color:#1890FF;
    }
  }
}
</style>
<style>
.mint-switch-input:checked + .mint-switch-core {
  border-color: #4DD865;
  background-color: #4DD865;
}
</style>
