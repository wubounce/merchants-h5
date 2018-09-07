<template>
  <section class="batch">
    <ul class="select">
      <li class="select-item" v-for="(item,index) in list" :key="index">
        <div class="l">
          <img v-lazy="item.imageId">
        </div>
        <div class="m">
          <p class="content">{{item.functionName}}</p>
        </div>
        <div class="r">
          <Button btn-type="small" btn-color="spe" @confirm="start(item)">启动</Button>
          <Button btn-type="small" btn-color="spe" @confirm="plan(item)">{{planState[item.planState]}}</Button>
        </div>
      </li>
    </ul>
    <!-- <p class="btn">
      <Button @confirm="updatedConfirm" btn-type="default" btn-color="blue">保存</Button>
    </p> -->
  </section>
</template>

<script>
  /* eslint-disable */
  import {
    device
  } from "@/service/device";
  import Button from "@/components/Button/Button";
  import { mapState } from "vuex";
  import { MessageBox } from "mint-ui";

  export default {
    data() {
      return {
        list: [],
        firstTypeId: "",
        subTypeId: "",
        shopId: "",
        planState: {
          0: "未定时",
          1: "已定时"
        }
      };
    },
    methods: {
      getList() {
        // this.http
        //   .get(api.getStandardFunctionList, {
        //     params: {
        //       token: this.$cookie.get("token"),
        //       // subTypeId: this.subTypeId,
        //       firstTypeId: this.firstTypeId, //TODO
        //       // firstTypeId: '8b7a5b05-0113-4559-b43b-baad0052fa6f',
        //       shopId: this.shopId
        //     }
        //   })
        //   .then(it => {
        //     if (it.data.code === 0) {
        //       this.list = it.data.data.items;
        //     }
        //   })
        //   .catch(e => {
        //     console.log(e);
        //   });
      },
      start(data) {
        MessageBox.confirm("确定执行此操作?")
          .then(action => {
            if (action === "confirm") {
              this.gostart(data);
            }
          })
          .catch(e => {
            this.$toast({
              message: "取消",
              position: "bottom",
              duration: 3000
            });
          });
      },
      gostart(data) {
        // this.http
        //   .get(api.batchStartNow, {
        //     params: {
        //       token: this.$cookie.get("token"),
        //       firstTypeId: this.firstTypeId,
        //       shopId: this.shopId,
        //       standardFunctionId: data.standardFunctionId
        //     }
        //   })
        //   .then(it => {
        //     if (it.data.code === 0) {
        //       this.$toast({
        //         message: "启动成功",
        //         position: "bottom",
        //         duration: 3000
        //       });
        //     } else {
        //       this.$toast({
        //         message: "启动失败",
        //         position: "bottom",
        //         duration: 3000
        //       });
        //     }
        //   })
        //   .catch(e => {
        //     console.log(e);
        //   });
      },
      plan(data) {
        this.$router.push({
          name: 'SetTime',
          query: {
            name: 'SetTime',
            standardFunctionId: data.standardFunctionId
          }
        })

      },
      updatedConfirm() {
        console.log('baocun')
      }
    },
    computed: {
      //   ...mapState(["firstList", "secondList", "shopName"])
    },
    watch: {
      $route: {
        handler: function (newVal, oldVal) {
          if (newVal.name === "BatchList") {
            this.shopId = this.shopName.shopId;
            this.firstTypeId = this.firstList.id;
            this.subTypeId = this.secondList.id;
            this.getList();
          }
        },
        immediate: true
      }
    },
    components: {
      Button,
      QHeader
    }
  };

</script>

<style lang="scss" scoped>
  .batch {
    .btn {
      margin-top: 0.5rem;
      padding: 0 0.3rem 0 0.3rem
    }
    .select {
      background: #fff;
      .select-item {
        border-bottom: 1px solid #dedede;
        overflow: hidden;
        padding: 0.2rem 0;
        line-height: 0.6rem;
        .l,
        .r,
        .m {
          float: left;
        }
        .l {
          width: 15%;
          text-align: center;
          img {
            width: 0.6rem;
            height: 0.6rem;
            border-radius: 0.1rem;
            vertical-align: top;
          }
        }
        .m {
          width: 55%;
        }
        .r {
          width: 30%;
        }
      }
    }
  }

</style>
