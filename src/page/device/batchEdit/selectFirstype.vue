<template>
  <section class="sf-wrappper" v-title="title">
    <div class="fixedPosition">
      <div class="bat-step">
        <div class="line-bg">
          <p v-for="(item,index) in stepArr " :key="index" :class="{active:currIndex==index}">{{item.text}}</p>
        </div>
      </div>
      <ul>
        <li class="bat-hd">
          <span>{{hdTitleArr[currIndex]}}</span>
          <div>{{selectedFirstype}}</div>
        </li>
      </ul>
    </div>
    <div class="sf-bd">
      <ul>
        <li class="item" v-for="(item,index) in parentTypeList" :class="{selected:index==selectIndex}" :key="index" @click="selectClick(index,item.name)">
          <div></div>
          <div>{{item.name}}</div>
          <div class="select"><span class="iconfont" :class="{'icon-xuanze':index==selectIndex}"></span></div>
        </li>
      </ul>
    </div>
    <div style="width:100%;height:1.73rem;"></div>
    <section class="promiss-footer">
      <span class="can" @click="goBack">上一步</span>
      <span class="cifrm" @click="goNext">下一步</span>
    </section> 
  </section>
</template>
<script>
import qs from "qs";
import { MessageBox } from 'mint-ui';
import { getlistParentTypeFun } from '@/service/device';
  export default {
    data() {
      return {
        firstTypeList: ['洗衣机', '吹风机', '烘干机', '洗鞋机', '充电桩', '其他'],
        title: "批量编辑",
        isResult: false,
        keyword: '',
        selectedFirstype: '',
        hdTitleArr: [
          "1.请选择相应店铺",
          "2.请选择设备类型",
          "3.请选择设备型号",
          "4.请选择设备相应功能"
        ],
        stepArr: [
          {
            text: "店铺"
          },
          {
            text: "类型"
          },
          {
            text: "型号"
          },
          {
            text: "功能"
          }
        ],
        currIndex: 1,
        selectIndex: -1,
        parentTypeList:[],
        parentTypeId:''
      };
    },
    methods: {
      selectClick: function (index,name) {
        this.selectIndex = index;
        this.parentTypeId= this.parentTypeList[index].id;
        this.selectedFirstype= name;

        // this.keyword = this.resData[index];
        // this.search();
      },
      async checkFirstClass() { //获取一级列表
        let query = this.$route.query;
        let payload = {shopId:query.shopId};
        let res = await getlistParentTypeFun(qs.stringify(payload));
        if(res.code === 0) {
          this.parentTypeList = res.data; 
        }
      },
      goBack(){
        this.$router.go(-1);
      },
      goNext(){
        let query = this.$route.query;
        if(this.parentTypeId){
          this.$router.push({
            name: "selectSecondtypeEdit",
            query: ({shopId:query.shopId, parentTypeId:this.parentTypeId})
          });
        }else{
          this.$toast("请先选择类型");
        }
      },
    },
    created() {
      this.checkFirstClass();
    },
    components: {
    },
  };

</script>

<style lang="scss" scoped>
  .sf-wrappper {
    .fixedPosition {
      position:fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: #efeff4;
      z-index: 9;
      .bat-step {
        display: flex;
        justify-content: space-between;
        height: 2.08rem;
        font-size: 0.37rem;
        color: #1890ff;
        background-color: rgba(249,252,255,1);
        background: url("../../../assets/img/device/devic_line_icon.png") no-repeat center;
        background-size: 6.03rem;
        .line-bg {
          width: 100%;
          margin: 0 0.83rem;
          p {
            margin: 0.72rem 1.3rem 0.72rem 0;
            background-color: #ffffff;
            display: inline-block;
            text-align: center;
            width: 1.11rem;
            height: 0.64rem;
            line-height: 0.64rem;
            box-shadow: 0rem 0.03rem 0.05rem 0rem rgba(179, 218, 255, 1);
            border-radius: 0.39rem;
            border: 0rem solid rgba(255, 255, 255, 1);
            &:nth-child(4) {
              margin-right: 0;
            }

          }
          .active {
            color: #fff;
            background: #1890ff;
          }
        }
      }
      .bat-hd {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.4rem;
        margin-bottom: 0.13rem;
        font-size: 0.43rem;
        height: 1.6rem;
        color: rgba(51, 51, 51, 1);
        background: #fff;
        span {
          width: 50%;
        }
        div {
          flex-grow: 1;
          width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.37rem;
          color: #1890ff;
          text-align: right;
        }
      }

      .search-input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        font-size: 0.43rem;
        color: rgba(153, 153, 153, 1);
        padding: 0.4rem 0.3rem 0.4rem 0.27rem;
        background: rgba(255, 255, 255, 1);
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
          box-sizing: border-box;
          box-shadow: 0rem 0.05rem 0.13rem 0rem rgba(186, 192, 210, 0.3);
          border-radius: 0.1rem;
          input {
            background: url("../../../assets/img/device/devic_search_icon.png") no-repeat 0.27rem;
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
              border-right: 0.04rem solid rgba(216, 216, 216, 1);
            }
          }
        }
        .result-left {
          flex: 1;
        }
        .right {
          flex: 0 1 1.17rem;
          height: 1.17rem;
          background: url("../../../assets/img/device/devic_scan_icon.jpeg") no-repeat center;
          background-size: 60%;
          box-shadow: 0rem 0.05rem 0.13rem 0rem rgba(186, 192, 210, 0.3);
          border-radius: 0.13rem;
        }
        .result-right {
          display: none;
        }
      }
    }
    .sf-bd {
      padding-top: 3.81rem;
      ul {
        width:100%;
        li {
          display: flex;
          text-align:center;
          height: 1.17rem;
          line-height: 1.17rem;
          background: rgba(255, 255, 255, 1);
          font-size: 0.4rem;
          color: rgba(51, 51, 51, 1);
          div {
            &:nth-child(1) {
              width: 10%;
            }
            &:nth-child(2) {
              width: 80%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            &:nth-child(3) {
              width: 10%;
              color: #1890ff;
              text-align: center;
            }
            
          }
        }
        .selected {
              background-color:rgba(24, 144, 255, 0.05);
            }
      }
      
    }
    
    .promiss-footer {
      display: flex;
      height: 1.33rem;
      line-height: 1.33rem;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    }
    .promiss-footer > span {
     flex: 1;
     text-align: center;
    }
    .promiss-footer .can {
      font-size: 18px;
      color: #1890FF;
      background: #f6f8ff;
    }
    .promiss-footer .cifrm {
      background: #1890FF;
      font-size: 18px;
      color: #fff;
    }
   
  }

  

</style>
