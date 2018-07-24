<template>
<div class="accountList-wrapper" v-title="'收支明细'">
    <mt-navbar v-model="selected" fixed>
        <mt-tab-item id="1" :class="selected ===1 ?'is-selected':''">全部</mt-tab-item>
        <mt-tab-item id="2">收入</mt-tab-item>
        <mt-tab-item id="3">支出</mt-tab-item>
    </mt-navbar>

    <mt-tab-container v-model="selected">
        <!-- 全部 -->
        <mt-tab-container-item id="1">
            <div class="list add">
                <img src="../../assets/img/test.jpg">
                <div class="accountList-content">
                    <div class="left">
                        <p>每日便利洗衣店</p>
                        <p>交易成功</p>
                        <p>5月25日 18:16</p>
                    </div>
                    <p class="price">+3.5</p>
                </div>                
            </div>
            <div class="list decrease">
                <img src="../../assets/img/test.jpg">
                <div class="accountList-content">
                    <div class="left">
                        <p>每日便利洗衣店</p>
                        <p>交易成功</p>
                        <p>5月25日 18:16</p>
                    </div>
                    <p class="price">+3.5</p>
                </div>                
            </div>
        </mt-tab-container-item>
        <!-- 收入 -->
        <mt-tab-container-item id="2">
            <mt-cell/>
            22
        </mt-tab-container-item>
        <!-- 支出 -->
        <mt-tab-container-item id="3">
            <mt-cell/>
            33
        </mt-tab-container-item>
    </mt-tab-container>
    <p>只展示近6个月记录</p>
</div>
</template>
<script>
import { Navbar, TabItem } from 'mint-ui';
export default {
  data() {
    return {
      selected: 1,
    };
  },
  mounted() {
    
  },
  created(){
  },
  methods: {
    
  },
  components:{
    Navbar,
    TabItem
  }
};
</script>
<style lang="scss" scoped>
    @import "../../assets/scss/common";
    .accountList-wrapper{
        padding-top: 1.493333rem;
        
    }
</style>
<style lang="scss">
    @import "../../assets/scss/common";
    .accountList-wrapper{
        .mint-navbar .mint-tab-item{
            padding: 0 .866667rem;
        }
        .mint-tab-item-label{
            line-height: 1.146667rem;
            color: $second-color;
            font-size: .426667rem;
            border-bottom: 2px solid transparent;
        }
        .mint-navbar .mint-tab-item.is-selected{
            border:none;
            .mint-tab-item-label{
                border-bottom: 2px solid #1890ff;
                color:$highlight-color;
            }
        }
        
    }
</style>

