<template>
    <!-- 根据类型更换title -->
	<div class="accountDetail-wrapper" v-title="title">
		<header>
			<p class="title">
            <span class="usericon iconfont icon-dianpu" v-if="data.type===1"></span>
            <span class="usericon iconfont icon-tuikuan" v-if="data.type===3"></span>
            <span v-if="data.type===1">{{data.shopName}}</span>
            <span v-if="data.type===3">退款订单</span>
            </p>
			<p class="price" v-if="data.type===1">+{{data.price}}</p>
            <p class="price" v-if="data.type===3">-{{data.price}}</p>
			<p class="satus" v-if="data.type===1">交易成功</p>
            <p class="satus" v-if="data.type===3">退款成功</p>
		</header>		
		<ul class="record" v-if="data.type===1">
			<li>
                <div><p>订单金额</p><p>{{data.markPrice}}</p></div>   
				<div class="discounts" v-if="data.discountType===1 && data.discountPrice>0"><p>vip优惠</p><p><span >-</span>{{data.discountPrice}}</p></div>
                <div class="discounts" v-if="data.discountType===2&&data.discountPrice>0 || data.discountType===null&&data.discountPrice>0"><p>限时优惠</p><p><span>-</span>{{data.discountPrice}}</p></div> 
                <div class="discounts" v-if="data.voucherType===1&&data.voucherPrice>0"><p>优惠券</p><p><span>-</span>{{data.voucherPrice}}</p></div> 
            </li>	
            <li>
                <div><p>支付方式</p><p>{{data.payType | PayType}}</p></div>
                <div><p>用户账号</p><p>{{data.userPhone}}</p></div>
            </li>
            <li>
                <div><p>创建时间</p><p>{{data.createTime}}</p></div>
                <div><p>订单号</p><p>{{data.orderNo}}</p></div>
            </li>
            <li>
                <div><p>类型</p><p>{{data.parentType}}</p></div>
                <div><p>设备型号</p><p>{{data.subType}}-636U7</p></div>
                <div><p>设备名称</p><p>{{data.machineName}}</p></div>
                <div><p>IMEI号</p><p>{{data.imei}}</p></div>
            </li>
            <li>
                <div class="remarks"><p>备注</p><p>{{data.content.replace(',null','')}}</p></div>    
            </li>
		</ul>
        <ul class="record" v-if="data.type===3">
            <li>
                <div><p>付款金额</p><p>{{data.payPrice}}</p></div> 
                <div class="discounts" v-if="data.voucherType===1&&data.voucherPrice>0"><p>优惠券</p><p><span>-</span>{{data.voucherPrice}}</p></div> 
                <div class="discounts"><p>退款金额</p><p><span >-</span>{{data.price}}</p></div>            
            </li>   
            <li>
                <div><p>用户账号</p><p>{{data.userPhone}}</p></div>
                <div><p>创建时间</p><p>{{data.createTime}}</p></div>
                <div><p>订单号</p><p>{{data.orderNo}}</p></div>
            </li>
            <li>
                <div class="remarks"><p>店铺</p><p>{{data.shopName}}</p></div>
                <div><p>类型</p><p>{{data.parentType}}</p></div>
                <div><p>设备型号</p><p>{{data.subType}}-636U7</p></div>
                <div><p>设备名称</p><p>{{data.machineName}}</p></div>
                <div><p>IMEI号</p><p>{{data.imei}}</p></div>
            </li>
            <li>
                <div class="remarks"><p>备注</p><p>{{data.content.replace(',null','')}}</p></div>    
            </li>
        </ul>
	</div>
</template>

<script>
import qs from 'qs';
import { PayType } from '@/utils/mapping';
import { getOrderDetailFun } from '@/service/user';
export default {
  data() {
    return {
        title:'',
        data:{}
    };
  },
  mounted() {
    
  },
  created(){
    let query = this.$route.query;
    if (query.type === 1) {
      this.title = '收益详情';
    } else {
      this.title = '退款详情';
    }
    this.getOrderDetail();
  },
  methods: {
    async getOrderDetail(type){
        let payload = {balanceLogId:this.$route.query.balanceLogId};
        let res = await getOrderDetailFun(qs.stringify(payload));
        this.data = res;
    }
  },
  filters: {
    PayType:function(value){
      return PayType(value);
    }
  },
  components:{
    
  }
};

</script>


<style lang="scss" scoped>
    @import '../../assets/scss/common';
    .accountDetail-wrapper{
        background: #FFFFFF;
        header{
            text-align: center;
            padding: .6667rem 0.4rem;
            .title{
                display: flex;
                justify-content: center;
                .icon-tuikuan {
                    color: #FAAD14;
                    font-size:0.64rem;
                    padding-right: 0.21rem;
                }
               .icon-dianpu {
                    color: #52C41A;
                    font-size:0.64rem;
                    padding-right: 0.21rem;
                }
                color: $first-color;
                line-height: .6667rem;
                font-size: 18px;
            }
            .price{
                color: $first-color;
                line-height: 1.2rem;
                font-size: .8533rem;
                margin: .2667rem 0;
               
            }
            .satus{
                color: $third-color;
                font-size: .3733rem;
                line-height: .5333rem;
            }
        }
        .record{
            padding-left: .4rem;
            li{
                padding: .4rem .4rem .4rem 0;
                border-bottom: $first-border;
                color: $third-color;
                font-size: .3733rem;
                div{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: .5333rem;
                    margin-bottom: .4rem;
                    p{
                        &:last-child{
                            color: $first-color;
                        }
                        
                    }
                    &:last-child{
                        margin-bottom: 0;
                    }
                    &.discounts{
                        p{
                            color: #ff5f5f;
                        }
                    } 
                    &.remarks{
                        height: auto;
                        align-items: stretch;
                        p{
                            max-width: 7.4667rem;
                        }
                    }                  
                }
                &:first-child{
                    padding-top: 0;
                }
                &:last-child{
                    border-bottom: none;
                }
                
            }
        }
    }
</style>
