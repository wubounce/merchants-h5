<template>
  <section>
    <q-header :title="title"></q-header>
    <div class="search">
      <d-search></d-search>
    </div>
    <div class="device-status">
      <div v-for="(item,index) in titleArr" @click="titleClick(index)" :key="index">
        <p :class="{current: titleIndex === index}">{{item.title}}</p>
        <span :class="{current: titleIndex === index}">{{item.num}}</span>
      </div>
    </div>

    <div class="device-list" v-for="(item,index) in list" :key="index">
      <section class="item-hd">
        <span>东龙街 176 号 3 号机</span>
        <span>空闲</span>
      </section>
      <section class="item-bd">
        <span>店铺</span>
        <span>一店</span>
      </section>
      <section class="item-ft">
        <p class="item-ft-right">
          <span>类型</span>
          <span>洗衣机</span>
        </p>
        <p class="item-ft-right">
          <span>收益</span>
          <span>1000.00元</span>
        </p>
      </section>
    </div>

   
  </section>

</template>
<script>
  import QHeader from '@/components/header';
  import DSearch from '@/components/Search/search';
  export default {
    data() {
      return {
        title: '设备管理',
        titleArr: [{
          title: '全部',
          num: 0
        }, {
          title: '运行',
          num: 0
        }, {
          title: '空闲',
          num: 0
        }, {
          title: '故障',
          num: 0
        }, {
          title: '超时未工作',
          num: 0
        }],
        titleIndex: 0,
        list: [{}],
      };
    },
    mounted() {

    },
    methods: {
      titleClick: function (index) {
        this.titleIndex = index;
      },
    },
    components: {
      QHeader,
      DSearch
    }
  };

</script>
<style lang="scss" scoped>
  .search {
    width: 100%;
    display: flex;
  }

  .device-status {
    display: flex;
    font-size: 0.35rem;
    color: #333;
    text-align: center;
    background: #fff;
    height: 1.5rem;
    border-bottom: 1px solid rgba(220, 224, 230, 1);
    div {
      flex: 1;
      span {
        display: inline-block;
        width: 0.73rem;
        height: 0.43rem;
        margin-top: 0.1rem;
        color: #fff;
        background: rgba(24, 144, 255, 1);
        border-radius: 0.2rem;
      }
      p {
        margin-top: .25rem;
      }
      p.current {
        font-weight: bolder;
      }
      span.current {
        display: inline-block;
        position: relative;
        &::after {
          content: '';
          display: block;
          width: 100%;
          position: absolute;
          bottom: -0.24rem;
          border-bottom: 0.08rem solid #1890FF;
        }

      }
    }




  }

  .device-list {
    margin-top: .27rem;
    padding: 0 .4rem;
    background: #FFFFFF;
    color: #999999;
    font-size: .37rem;
    section {
      height: 1.2rem;
      line-height: 1.2rem;
      border-bottom: 0.01rem solid rgba(223, 230, 255, 1);
      &:nth-child(3) {
        border: none;
      }
    }
    .item-hd {
      font-size: 0.43rem;
      color: rgba(51, 51, 51, 1);
      span {
        &:nth-child(2) {
          float: right;
          color: #1890FF
        }
      }
    }
    .item-ft {
      display: flex;
      p {
        flex: 1;
        &:nth-child(2) {
          display: flex;
          justify-content: flex-end
        }
      }
      span {
        &:nth-child(2) {
          color: #1890FF
        }
      }
    }
  }


</style>
