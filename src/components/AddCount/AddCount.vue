<template>
  <section>
    <div class="addcount red" :class="[computedStatus]">
      <i class="icon l" @click="lowerTime" :class="[computedStatusTime]"></i>
      <span class="count">{{countTime}}</span>
      <span>分钟</span>
      <i class="icon r" @click="addTime"></i>
    </div>
    <div class="addcount default" :class="[computedStatus]">
      <i class="icon l" @click="lowerMoney" :class="[computedStatusMoney]"></i>
      <span class="count">{{countMoney}}</span>
      <span>元</span>
      <i class="icon r" @click="addMoney"></i>
    </div>
    <span class="control" @click="control" :class="{'activecontrol': !status}"></span>
  </section>
</template>

<script>
export default {
  props: {
    money: {
      type: Number
    },
    time: {
      type: Number
    },
    st: {
      type: Boolean
    },
    index: {
      type: Number
    },
    status: {
      default: 0
    }
  },
  data() {
    return {
      activeMoney: false,
      countMoney: 0,
      countTime: 0,
      activeTime: false,
      editStatus: false
    };
  },
  methods: {
    lowerMoney() {
      if (this.editStatus) {
        if (this.status) {
          if (this.countMoney <= 1) {
            this.activeMoney = true;
          } else {
            this.countMoney--;
            this.$emit("onMoney", this.countMoney, this.index);
          }
        }
      }
    },
    addMoney() {
      if (this.editStatus) {
        if (this.status) {
          this.countMoney++;
          this.activeMoney = false;
          this.$emit("onMoney", this.countMoney, this.index);
        }
      }
    },
    lowerTime() {
      if (this.editStatus) {
        if (this.status) {
          if (this.countTime <= 1) {
            this.activeTime = true;
          } else {
            this.countTime--;
            this.$emit("onTime", this.countTime, this.index);
          }
        }
      }
    },
    addTime() {
      if (this.editStatus) {
        if (this.status) {
          this.countTime++;
          this.activeTime = false;
          this.$emit("onTime", this.countTime, this.index);
        }
      }
    },
    control() {
      if (this.editStatus) {
        this.status = !this.status;
        this.$emit("onOpen", this.status, this.index);
      }
    }
  },
  computed: {
    computedStatusMoney() {
      return this.activeMoney ? "active" : "";
    },
    computedStatusTime() {
      return this.activeTime ? "active" : "";
    },
    computedStatus() {
      return this.status == 1 ? "" : "none";
    }
  },
  mounted() {
    this.countMoney = this.money;
    this.countTime = this.time;
    this.editStatus = this.st;
  },
  watch: {
    st(newVal) {
      if (newVal == "0") {
        this.editStatus = false;
      } else if (newVal == "1") {
        this.editStatus = true;
      }
    }
    // statusprop(newVal) {
    //   this.status = newVal
    // }
  }
};
</script>

<style lang="scss" scoped>
.addcount {
  display: inline-block;
  vertical-align: middle;
  margin-left: 15px;
  span {
    text-align: center;
    display: inline-block;
    vertical-align: middle;
  }
  .count {
    width: 15px;
  }
  .icon {
    display: inline-block;
    width: 0.4rem;
    height: 0.4rem;
    background-repeat: no-repeat;
    background-size: 0.4rem 0.4rem;
    vertical-align: middle;
  }
}

.default {
  color: #409eff;
  .l {
    background-image: url("../../../static/image/device/lower-01.png");
  }
  .r {
    background-image: url("../../../static/image/device/add-01.png");
  }
  .active {
    background-image: url("../../../static/image/device/lower-00.png");
  }
}

.red {
  color: #ff6e23;
  .l {
    background-image: url("../../../static/image/device/lower-02.png");
  }
  .r {
    background-image: url("../../../static/image/device/add-02.png");
  }
  .active {
    background-image: url("../../../static/image/device/lower-00.png");
  }
}

.none {
  color: #dedede;
  .l {
    background-image: url("../../../static/image/device/lower-00.png");
  }
  .r {
    background-image: url("../../../static/image/device/add-00.png");
  }
  .active {
    background-image: url("../../../static/image/device/lower-00.png");
  }
}

.control {
  display: inline-block;
  vertical-align: middle;
  width: 0.5rem;
  height: 0.3rem;
  background-repeat: no-repeat;
  background-size: 0.5rem 0.3rem;
  background-image: url("../../../static/image/device/open.png");
  margin-left: 0.1rem;
  margin-top: 0.05rem;
}

.activecontrol {
  background-image: url("../../../static/image/device/close.png");
}
</style>
