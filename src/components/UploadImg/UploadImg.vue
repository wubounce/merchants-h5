<template>
  <div class="upload">
    <input :id="id" type="file" ref="input" @change="beforeFiles" />
    <label :for="id">
      <img :class="{'upLoadShop' : isStatus,'upLoadStatus': !isStatus}" :src="defaultPicture" alt="店铺图片" >
    </label>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String
    },
    defaultPicture: {
      type: String
    },
    isStatus: {
      type: Boolean
    }
  },
  data() {
    return {
      newImg:''
    };
  },
  methods: {
    beforeFiles() {
      var newImg = this.defaultPicture;
      let files = this.$refs.input.files[0];
      let fileType = files.type === "image/png" || files.type === "image/jpeg" ;
      let size = files.size / 1024 / 1024 < 2;
      if (!fileType) {
        this.$toast({
          message: "上传图片必须是image/png或者image/jpeg",
          position: "bottom",
          duration: 3000
        });
        return false;
      }
      if (!size) {
        this.$toast({
          message: " 上传图片大小超过2M",
          position: "bottom",
          duration: 3000
        });
        return false;
      }
      this.previewFiles(files);
    },
    previewFiles(files) {
      let reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = evt => {
        let url = evt.target.result;
        this.newImg = url;
        this.$emit("onImgFiles", this.newImg);
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.upload {
  input {
    font-size: 0;
    display: none;
  }
  label {
    font-size: 0;
    border: 0;
    display: inline-block;
    .upLoadStatus {
      width: 9rem;
      height: 6rem;

      margin-bottom: 0.3rem;
      padding: au;
      padding-left: 0.5rem;
    }
    .upLoadShop {
      width: 2rem;
      height: 2rem; 
      border-radius: 5px;
    }
  }
}
</style>

