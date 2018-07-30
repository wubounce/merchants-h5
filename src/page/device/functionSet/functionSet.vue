<template>
  <section>
    <q-header :title="title"></q-header>
    <!-- 功能列表部分 -->
    <section class="fun-item-hd">
      <div>
        <p v-for="(item,index) in functionListTitle " :key="index">
          <span v-for="(it,idx) in item " :key="idx">{{it}}</span>
        </p>
      </div>
    </section>
    <section class="fun-item-bd">
      <div v-for="(item,index) in functionList " :key="index">
        <span class="fun-list-item">{{item.fuctionName}}</span>
        <input class="fun-list-item" type="text" name="" id="" v-model="item.time">
        <input class="fun-list-item" type="text" v-model="item.price">
        <p class="fun-list-item">
          <mt-switch :value.sync="item.status"></mt-switch>
        </p>
      </div>
    </section>
    <section class="fun-ft">
      <Button class="btn cancle" btn-type="default" btn-color="blue" @confirm="cancleSetFun">取消</Button>
      <Button class="btn" btn-type="default" btn-color="blue" @confirm="confirmeSetFun">确定</Button>
    </section>
  </section>
</template>

<script>
  import Button from "@/components/Button/Button";
  import QHeader from '@/components/header';
  export default {
    data() {
      return {
        title: '设备详情',
        functionList: [{
          fuctionName: '白色特脏 赃污',
          time: 25,
          price: 8,
          status: 1
        }],
        functionListTitle: [
          ['功能'],
          ['耗时', '/分'],
          ['原价', '/元'],
          ['状态']
        ]
      };
    },
    methods: {

    },
    components: {
      Button,
      QHeader
    }
  };

</script>

<style lang="scss" scoped>
  .fun-item-hd {
    padding: 0;
    background: #FAFCFF;
    color: #1890FF;
    font-size: 0.37rem;
    padding: .6rem 0;
    div {
      display: flex;
      p {
        flex: 2.19;
        text-align: center;
        position: relative;
        border-right: rgb(24, 144, 255) .03rem solid;
        box-sizing: border-box;
        &:nth-child(1) {
          flex: 3.32;
        }
        &:nth-child(4) {
          flex: 2.21;
          border-right: none;
        }
        span {
          &:nth-child(2) {
            font-size: 70%;
            letter-spacing: .001rem
          }
        }
      }
    }
  }

  .fun-item-bd {
    height: 1.6rem;
    line-height: 1.6rem; // padding: 0 .4rem;
    font-size: 0.37rem;
    color: #333333;
    background: #fff;
    div {
      display: flex; // justify-content: space-between;
      .fun-list-item {
        flex: 2.19;
        text-align: center;
        &:nth-child(1) {
          flex: 3.32;
        }
        &:nth-child(4) {
          flex: 2.21;
          box-sizing: border-box;
        }
      }
      p {
        display: flex;
        justify-content: center;
        align-items: center;
        .mint-switch-input:checked+.mint-switch-core {
          border-color: #4DD865;
          background-color: #4DD865;
        }
      }
    }
  }

  .fun-ft {
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .btn {
      width: 5rem;
      border-radius: 0;
      font-size: 0.48rem;
      box-sizing: border-box;
      display: inline-block;
    }
    .cancle {
      background: #fff;
      color: #1890FF;
    }
  }

</style>
