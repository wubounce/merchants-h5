<template>
  <section>
    <div class="search">
      <div class="search-input">
        <p class="left" :class="{ 'result-left': isResult }">
          <input type="text" v-model.trim="keyword" placeholder="请输入设备名称/IMEI 号" @input="inputHandle">
          <span v-if="isResult">
            <img src="../../assets/img/device/devic_scan_icon.jpeg">
            <span class="gap-border"></span>
            <span class="search-reset" @click="clearInput">返回</span>
          </span>
        </p>
        <p class="right" :class="{ 'result-right': isResult }"></p>
      </div>
    </div>
    <div class="search-select">
        <transition-group name="itemfade" tag="ul" mode="out-in" v-cloak>
          <li v-for="(item,index) in searchList" :class="{selectback:index==now}" class="search-select-option search-select-list" @click="selectClick(index)"
          :key="index">{{item.name}}
          </li>
          <li class="search-select-option search-select-list" v-show="hasNoData">没有找到匹配数据</li>
        </transition-group>
      </div>
  </section>
</template>

<script type="text/javascript">
  /* eslint-disable */
  import {
    delay
  } from "@/utils/tool";
  export default {
    props: {
      keyword: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        myData: [], // 用来接收 ajax 得到的数据
        now: -1,
        isResult: false
      };
    },
    methods: {
      fetchData: function (e) {
        console.log('获取数据')
      },
      selectClick: function (index) {
        this.keyword = this.myData[index];
        // this.search();
      },
      clearInput: function () {
        this.keyword = "";
        this.isResult = false
      },
      inputHandle: function() { 
        
      }
    },
    watch: {
      keyword: function (newVal) {
        if (newVal) {
          delay(() => {
            this.fetchData();
          }, 300);
          this.isResult = true
        }
      },
    }
  };

</script>

<style lang="scss" scoped>
  .search {
    padding: 0.2rem 0.3rem 0.2rem;
    background-color: #fff;
    .search-input {
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      font-size: 0.43rem;
      color: rgba(153, 153, 153, 1);
      background: rgba(255, 255, 255, 1);
      box-shadow: 0rem 0.05rem 0.13rem 0.05rem rgba(186, 192, 210, 0.3);
      border-radius: 0.1rem;
      p {
        display: flex;
      }
      .left {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex: 0 1 7.93rem;
        height: 1.17rem;
        padding-right: .27rem;
        
        input {
          background: url("../../assets/img/device/devic_search_icon.png") no-repeat 0.27rem;
          background-size: 0.53rem;
          padding: 0.29rem 0 0.29rem 1.07rem;
          border-radius: 0.13rem;
        }
        span {
          display: inline-block;
          white-space: nowrap;
        }
        img {
          width: 0.4rem;
        }
        .gap-border {
          position: relative;
          width: .28rem;
          height: .32rem;
          margin-right: .28rem;
          &:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: .32rem;
            border-right: 0.04rem solid rgba(216, 216, 216, 1); // transform: scaleY(0.5);
          }
        }
      }
      .result-left {
        flex: 1;
      }
      .right {
        flex: 0 1 1.17rem;
        height: 1.17rem;
        background: url("../../assets/img/device/devic_scan_icon.jpeg") no-repeat center;
        background-size: 60%;
        box-shadow: 0rem 0.05rem 0.13rem 0rem rgba(186, 192, 210, 0.3);
        border-radius: 0.13rem;
      }
      .result-right {
        display: none
      }
    }
  }
  .search-select {
    background: #fff;
    li {
      color:rgba(51, 51, 51, 1);
      width: 100%;
      font-size: 0.43rem;
    }
    .search-select-option {
      box-sizing: border-box;
      padding: 10px 18px;
    }
  }

  input::-ms-clear {
    display: none;
  }

  .search-select-list {
    transition: all 0.5s;
  }

  .itemfade-enter,
  .itemfade-leave-active {
    opacity: 0;
  }

  .itemfade-leave-active {
    position: absolute;
  }

  .selectback {
    background-color: #eee !important;
    cursor: pointer;
  }

  .search-select ul {
    margin: 0;
    text-align: left;
  }

  
</style>
