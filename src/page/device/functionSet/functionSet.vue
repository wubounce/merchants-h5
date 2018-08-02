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
    <section class="fun-item-bd funlist">
      <div v-for="(item,index) in functionSetList " :key="index">
        <input type="text" class="fun-list-item" v-model.lazy="item.functionName" @change="changeItem(item.functionName,index,0)"/>
        <input type="text" class="fun-list-item" v-model.lazy="item.needMinutes" @change="changeItem(item.needMinutes,index,1)"/>
        <input type="text" class="fun-list-item" v-model.lazy="item.functionPrice" @change="changeItem(item.functionPrice,index,2)"/>
        <input type="text" class="fun-list-item" v-model.lazy="item.functionPrice" v-show="isShow" @change="changeItem(item.functionPrice,index,3)"/>
        <p class="fun-list-item">
          <mt-switch v-model="item.ifOpen" @change="changeItem(item.ifOpen,index,4)"></mt-switch>
        </p>
      </div>
    </section>
    <section class="fun-ft">
      <router-link :to="{name:'addDevice'}"><Button class="btn cancle" btn-type="default" btn-color="blue" @click="goBack">取消</Button></router-link>
      <Button class="btn" btn-type="default" btn-color="blue" @click="goFirst">确定</Button>
    </section>
  </section>
</template>

<script>
  import qs from "qs";
  import Button from "@/components/Button/Button";
  import QHeader from '@/components/header';
  import { MessageBox ,} from 'mint-ui';
  import { getFunctionSetListFun } from '@/service/device';
  export default {
    data() {
      return {
        title: '设备详情',
        isShow: true,
        isOpenArr:[],
        itemName:["functionName","needMinutes","functionPrice","functionPrice","ifOpen"],
        functionSetList: [],
        functionGetList: [],
        functionListTitle: [
          ['功能'],
          ['耗时', '/分'],
          ['原价', '/元'],
          ['脉冲数'],
          ['状态']
        ],
        functionListTitle2: [
          ['功能'],
          ['耗时', '/分'],
          ['原价', '/元'],
          ['状态']
        ],
      };
    },
    methods: {
    async getFunctionSetList() {  //获取数据
        let subTypeId = this.$route.query.subTypeId;
        let shopId = this.$route.query.shopId;
        let payload = {subTypeId: subTypeId,shopId: shopId} ;     
        let res = await getFunctionSetListFun(qs.stringify(payload));
         if(res.code === 0) {
           if(res.data.communicateType){
             this.functionListTitle = this.functionListTitle2;
             this.isShow = false;
             this.functionGetList = res.data.list;
           } 
          res.data.list.forEach(item=>{
            item.ifOpen=item.ifOpen === "0"?(!item.ifOpen) : (!!item.ifOpen);
          });
            this.functionSetList = res.data.list;
        }
        else {
          MessageBox.alert(res.msg);
        }
      },
      changeItem(item,index,flag){
        let name = this.itemName[flag];
        if (flag === 5){
          let newIsOpen = item ? 1:0;
          this.functionGetList[index].ifOpen = newIsOpen;
        }else{
          this.functionGetList[index].name= item;
        }
      },
      goFirst(){
        this.$router.push({
            name: 'addDevice'
        });
      },
      goBack(){
        this.$router.push({
            name: 'addDevice'
        });
      }

    },
    created() {
      this.getFunctionSetList();
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
    line-height: 1.6rem; // padding: 0 .4rem;
    font-size: 0.37rem;
    color: #333333;
    background: #fff;
    div {
      display: flex; // justify-content: space-between;
      .fun-list-item {
        flex: 2.19;
        text-align: center;
        line-height: 1.6rem;
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
