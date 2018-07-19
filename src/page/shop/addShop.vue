<template>
  <section class="personal">
    <q-header :title="title"></q-header>
    <ul class="personal-list">
      <p class="shopname-p"><span>店铺名称</span><span><input type="text" class='addressInput' v-model="shopName" maxlength="12" placeholder="请填写店铺名称"></span></p>
      <li v-for="(item,index) in list" :key="index" class="personal-item" @click="toDetail(index)">
        {{item.title}}
        <span>{{item.value == ''|| item.value==null? '暂无' : item.value}}</span>
      </li>
    </ul>
    <mt-picker class="picker" v-if="popupVisible" :slots="slots" @change="valuesChange" :showToolbar="true" ><p class="toolBar"><span @click="cancel">取消</span><span>店铺类型</span><span @click="shopTypeConfirm">确定</span></p></mt-picker>
  </section>
</template>
<script>
import QHeader from '@/components/header';
export default {
  data() {
    return {
      shopName:'',
      title:'新增店铺',
      list: [
        {
          title: "店铺类型",
          value: ""
        },
        {
          title: "所在地区",
          value: ""
        },
        {
          title: "小区/大厦/学校",
          value: ""
        }
      ],
      shopType: 1,
      shopTypeString:'',
      popupVisible:false,
      slots: [
        {
          flex: 1,
          values: ['学校', '公寓', '流动人口社区', '酒店', '医院', '养老院','工厂','浴场','其他'],
          className: 'shop-type',
          textAlign: 'center',
          position:'bottom',
          name:'店铺类型'
        }
      ]
    };
  },
  methods:{
    valuesChange(picker, values) {
      this.shopTypeString = values[0];
      switch(values[0]) {
        case '学校':
          this.shopType = 1;
          break;
        case '公寓':
          this.shopType = 2;
          break;
        case '流动人口社区':
          this.shopType = 3;
          break;
        case '酒店':
          this.shopType = 4;
          break;
          case '医院':
          this.shopType = 5;
          break;
        case '养老院':
          this.shopType = 6;
          break;
          case '工厂':
          this.shopType = 7;
          break;
        case '浴场':
          this.shopType = 8;
          break;
        case '其他':
          this.shopType = 9;
          break;
      }
    },
    toDetail(value) {
      switch (value) {
        case 0:
          this.popupVisible = true;
          break;
        case 1:
          break;
        case 2:
          break;
      }
    },
    go(msg) {
      this.$router.push({
        name: msg
      });
    },
    shopTypeConfirm() {
      this.popupVisible = false;
      this.list[0].value = this.shopTypeString;
    },
    cancel() {
      this.popupVisible = false;
    }
  },
  components:{
    QHeader
  }
};
</script>
<style lang="scss" scoped>
.personal {
  .personal-list {
    .shopname-p {
      font-size: 0.32rem;
      border-bottom: 1px solid #dedede;
      span {
        display: inline-block;
        &:first-child {
          margin-left: 0.3rem;
        }
        input {
          margin-left:0.3rem;
          height: 1rem;
        }
      }
    }
    .personal-item {
      font-size: 0.32rem;
      padding: 0.3rem;
      border-bottom: 1px solid #dedede;
      background: url("../../../static/shop/right.png") no-repeat right
        0.3rem center;
      background-size: 0.16rem 0.27rem;
      span {
        float: right;
        color: #7f7f7f;
        font-size: 0.28rem;
        margin-right: 0.3rem;
      }
    }
  }
  .picker {
    background-color: #fff;
  }
  .toolBar {
    span {
      &:nth-child(1) {
        font-size: 0.45rem;
        color: #999999;
        padding-left: 0.42rem;
      }
      &:nth-child(2) {
        font-size: 0.5rem;
        padding: 0 2.7rem;
        color: #666666;
      }
      &:nth-child(3) {
        font-size: 0.45rem;
        color: #1890FF;
      }
    }
  }
}
</style>