<template>
<div>
  <mt-popup v-model="ishow" position="bottom" >
    <section class="shoppicker">
      <div class="picker-toolbar">
          <span class="quxi"  @click="ishow=false">取消</span> 
          <span class="shop">{{pickerTitle}}</span> 
          <span class="qued" @click="onDateChange">确定</span>
       </div>
      <mt-picker :slots="datalist" ref="picker" :valueKey="param"></mt-picker>
    </section>
  </mt-popup>
</div>
</template>
<script>
export default {
  name:'select-picker',
  props: {
    slots: {
      type: Array,
      default: function () {
        return ['无匹配选项'];
      }
    },
    valueKey: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentTags:null,
      datalist:this.slots,
      param:this.valueKey,
      ishow:this.visible,
      pickerTitle:this.title
    };
  },
  methods: {
    onDateChange() {
      this.currentTags =this.$refs.picker.getValues()[0];
      this.$emit('selectpicker',this.currentTags);
      this.ishow=false;
    }
  },
  watch: {
      slots(val) {
          this.datalist = val;
      },
      valueKey(val) {
          this.param = val;
      },
      visible(val) {
          this.ishow = val;//②监听外部对props属性visible的变更，并同步到组件内的data属性ishow中
      },
      ishow(val){
          this.$emit("onpickstatus",val);//③组件内对ishow变更后向外部发送事件通知
      }
  },
  components:{
  }
};
</script>
<style lang="scss" scoped>
</style>
