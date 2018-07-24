<template>
  <section class="personal">
    <q-header :title="title"></q-header>
    <!-- 第一模块 -->
    <p class="shop-item title"><span>累计收益</span><span>{{orderPrice}}</span></p>
    <p class="shop-item second-p"><span>店铺名称</span><span>{{shopName}}</span></p>
    <p class="shop-item"><span>店铺类型</span><span>{{shopType}}</span></p>
    <p class="shop-address"><span>店铺地址</span><br><span>{{address}}</span></p>

    <!-- 第二模块 -->
    <div class="shop-machine">
      <span>设备类型</span>
      <div class="shop-machine-bottom">
        <span class="one-machine" v-for="(item,index) in list" :key="index">{{item}}</span>
      </div>
    </div>
    <p class="shop-item"><span>设备数量</span><span>{{machineCount}}</span></p>
    <p class="shop-item"><span>预约功能</span><span>{{isReserve}}</span></p>
    <p class="shop-item"><span>预约时长(分钟)</span><span>{{reserveTime}}</span></p>
    <p class="shop-item"><span>营业时间</span><span>{{time}}</span></p>
    <p class="picture">
        <span>店铺照片</span>
        <span>
          <img src="../../../static/shop/demo.jpg" alt="店铺图片" class="shop-img">
        </span>
    </p>

    <!-- 第三模块 -->
    <p class="shop-item second-p"><span>限时优惠</span><span>{{discount}}</span></p>
    <p class="shop-item"><span>VIP数量</span><span>{{vipsum}}个</span></p>

    <!-- 第四模块 -->
    <p class="shop-info second-p"><span>创建人： </span><span>{{operatorId}}</span></p>
    <p class="shop-info"><span>创建时间： </span><span>{{createTime}}</span></p>
    <p class="blank"></p>
    <p class="about-button">
      <Button btn-type="small" btn-color="spe" id="delete" @confirm="isDeleteOrNot()">删除</Button>
			<Button btn-type="small" btn-color="spe" id="edit" @confirm="goShopEdit()">编辑</Button>
    </p>
  </section>
</template>
<script>
import QHeader from '@/components/header';
import Button from "@/components/Button/Button";
export default {
  data() {
    return {
      title: '店铺详情',
      orderPrice: '1000元',
      shopName: '企鹅科技1号店',
      shopType: '学校',
      address:'浙江省 杭州市 西湖区 紫荆花路2号联合大厦A幢3单元1005',
      list:['洗衣机','吹风机','烘干机','充电桩','修理机','洗鞋机','战斗机','万能充'],
      MachineTypeIds: "4eeb1b0a-d006-49cc-bf17-73c20599057b,c9892cb4-bd78-40f6-83c2-ba73383b090a",
      machineCount: '100台',
      isReserve: '已开通',
      reserveTime:'5',
      time:'09:30-22:30',
      discount:'已设置',
      vipsum:'300',
      operatorId:'Wendy',
      createTime:'2018-07-15 15:38:05'
    };
  },
  methods:{
    isDeleteOrNot() {
      //删除功能
    },
    goShopEdit() {
      //编辑功能
      this.$router.push({
        name:'editShop'
      });
    }
  },
  components:{
    QHeader,
    Button
  }
};
</script>
<style lang="scss" scoped>
.personal {
   title {
      border-top: 1px solid #F8F8F8;
   }
   .second-p {
     margin-top: 0.3rem;
   }
   .shop-address {
     font-size: 0.35rem;
     padding: 0.3rem;
     background-color: #fff; 
     border-bottom: 1px solid #F8F8F8;
     span {
        &:first-child {
          color:rgba(153,153,153,1);
        }
        &:last-child {
          color:rgba(51,51,51,1);
          margin-top: 0.1rem;
          display: inline-block;
        }
      }
   }
   .shop-machine {
     font-size: 0.35rem;
     background-color: #fff;
     border-bottom: 1px solid #F8F8F8;
     span {
       &:first-child {
          color:rgba(153,153,153,1);
          padding-left: 0.3rem;
          display: inline-block;
          margin-top: 0.2rem;
        }
     }
     .shop-machine-bottom {
       margin-left: 0.3rem;
       margin-bottom: 0.2rem;
       .one-machine {
          color: #333333;
          background-color:rgba(24, 144, 255, 0.05);
          display: inline-block;
          padding: 0.2rem 0.9rem;
          margin-right: 0.25rem;
          margin-bottom: 0.2rem;
          border-radius: 4px;
        }
     }
   }
   .shop-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.35rem;
      padding: 0.3rem;
      border-bottom: 1px solid #F8F8F8;
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
      border-bottom: 1px solid #F8F8F8;
      span {
        &:first-child {
          font-size: 0.35rem;
          line-height: 2rem;
          padding-left: 0.3rem;
          color:rgba(153,153,153,1);
        }
        &:last-child {
          padding-right: 0.3rem;
          .shop-img {
            width: 2rem;
          }
        }
      }
  }
  .shop-info {
    font-size: 0.1rem;
    background-color: #fff;
    color:rgba(153,153,153,1);
    padding: 0.2rem 0;

    span {
      padding-left: 0.3rem;
    }
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
