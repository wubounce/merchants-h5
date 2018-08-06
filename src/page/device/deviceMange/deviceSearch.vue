<template>
  <section v-title="title">
    <div class="permissions" v-if="$store.getters.has('mer:machine:list')">暂无相关页面权限</div>
    <div v-else>
      <div class="search">
        <d-search @deviceSearch="onDeviceSearch"></d-search>
      </div>
    </div>
  </section>

</template>
<script>
  import qs from "qs";
  import DSearch from '@/components/Search/detailSearch';
  import { MessageBox } from 'mint-ui';
  export default {
    data() {
      return {
        isShow: true,
        isShow2: false,
        title: '设备管理',
        titleArr: [],
        index: null,
        list: [],
        machineState: null,
        checkClass: false,
        name: ""
      };
    },
    mounted() {

    },
    methods: {
      titleClick(index) {
        this.index = index;
        this.getDeviceList(this.index,this.name);

      },
      toDeviceDetail(i) {       
        this.$router.push({
        name:'deviceDetail',
        query:{
          machineId: i
        }
      });
      },
      toAddItem() {
        this.isShow = !this.isShow;
        this.isShow2 = !this.isShow2;
      },
      toCloseItem() {
        this.isShow2 = !this.isShow2;
        this.isShow = !this.isShow;
      },
      onDeviceSearch(msg){ //搜索
         this.name = msg;
         this.getDeviceList(this.titleIndex,this.name);
      }
    },
    created() {
      
    },
    components: {
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
        line-height: 0.43rem;
        margin-top: 0.1rem;
        color: rgba(24, 144, 255, 1);
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
        color: #fff;
        background: rgba(24, 144, 255, 1);
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
    color: rgba(153, 153, 153, 1);
    font-size: .37rem;
    section {
      padding: .1rem 0;
      height: 1rem;
      line-height: 1rem;
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
      .state{
        font-size: 0.37rem;
      }
    } 

    .item-bd {
      display: flex;
      span {
        width: 1.2rem;
      }
      div {
        flex-grow: 1;
        width: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .item-ft {
      display: flex;
      p {
        flex: 1;
        &:nth-child(2) {
          display: flex;
          justify-content: flex-end;
          border-left: 0.01rem solid rgba(223, 230, 255, 1);
        }
        span {
          display: inline-block;
          &:nth-child(1) {
            width: 1.125rem;
        }
        }

      }
      span {
        &:nth-child(2) {
          color: #1890FF
        }
      }
    }
  }
  .openItem{
    width: 1.49rem;
    height: 1.49rem;
    text-align: center;
    overflow: auto;
    background: rgba(24,144,255,1);
    border-radius: 50%;
    position: fixed;
    bottom: 0.67rem;
    right: 0.54rem;
    line-height: 1.49rem;
    color: rgba(255,255,255,1);
    font-size: 34px;
  }
  .closeItem{
    width: 1.49rem;
    height: 1.49rem;
    text-align: center;
    overflow: auto;
    background: rgba(24,144,255,1);
    border-radius: 50%;
    position: fixed;
    bottom: 0.67rem;
    right: 0.54rem;
    line-height: 1.49rem;
    color: rgba(255,255,255,1);
    font-size: 24px;
  }
  .showItem{
    width: 1.49rem;
    height: 1.49rem;
    text-align: center;
    overflow: auto;
    background: rgba(19, 194, 194, 1);
    border-radius: 50%;
    position: fixed;
    right: 0.54rem;
    line-height: 1.49rem;
    font-size: 12px;
    color: rgba(255,255,255,1);
  }
  .addDev{
    bottom: 2.52rem;
    transition:all 0.2s 
  }
  
  .betchStartup{
    bottom: 4.32rem;
    transition:all 0.3s 
  }
   
  .betchModf{
    bottom: 6.12rem;
    transition:all 0.4s 
  }


</style>
