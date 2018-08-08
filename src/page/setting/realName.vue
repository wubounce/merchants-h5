<template>
   <section v-title="title">
       <p class="prompt">请填写支付宝账号 <span>{{ this.$route.query.alipayAccount ? this.$route.query.alipayAccount : '' | replaceAliply }}</span> 实名信息</p>
       <p class="shopname-p margin">
          <span>姓名</span><span>
              <input type="text" class='nameInput' v-model="cardName" placeholder="请填写姓名">
          </span>
       </p>
       <p class="shopname-p">
          <span>身份证号</span><span>
              <input type="text" class='statusInput' v-model="IDCardNo" placeholder="请填写身份证号">
          </span>
       </p>
       <p class="imgShow">{{showText}}</p>
       <div class="bgc">
         <UploadImg :id="imgId.a"  :defaultPicture="img.defaultPicture1" :isStatus="imgStatus.isStatus" @onImgFiles="UpdatedImgFiles1"></UploadImg>
         <UploadImg :id="imgId.b"  :defaultPicture="img.defaultPicture2" :isStatus="imgStatus.isStatus" @onImgFiles="UpdatedImgFiles2"></UploadImg>
         <UploadImg :id="imgId.c"  :defaultPicture="img.defaultPicture3" :isStatus="imgStatus.isStatus" @onImgFiles="UpdatedImgFiles3"></UploadImg>
       </div>
       <p class="showFont">认证通过审核后不可修改, 请谨慎操作。</p>
       <div class="confirmNews">
        <button  @click="submitRealName">提交审核</button>
       </div>
   </section>
</template>
<script>
import qs from 'qs';
import UploadImg from "@/components/UploadImg/UploadImg";
import { uploadFileFun } from '@/service/shop';
import { confirmOperatorFun } from '@/service/user';
import { getRealNameFun } from '@/service/user';
import { MessageBox } from 'mint-ui';
export default {
  data() {
    return {
      title: '实名认证',
      alipay: '1374862991@qq.com',
      showText:'',
      isDisable: true,
      cardName:'',
      IDCardNo:'',
      imgId: {
        a: "a",
        b: "b",
        c: "c"
      },
      img: {
        defaultPicture1:"../../../static/image/mine/pictureZheng.png",
        defaultPicture2:"../../../static/image/mine/pictureFan.png",
        defaultPicture3:"../../../static/image/mine/pictureBanshen.png"
      },
      imgChange: {
        a:'',
        b:'',
        c:''
      },
      imgStatus: {
        isStatus:false
      }
    };
  },
  methods: {
    async UpdatedImgFiles1(msg) {
      if(msg.substring(0,22)=="data:image/png;base64,") {
        msg = msg.replace("data:image/png;base64,","");
      }
      else if(msg.substring(0,23)=="data:image/jpeg;base64,") {
        msg = msg.replace("data:image/jpeg;base64,","");
      }
      let obj = { files:msg };
      let res = await uploadFileFun(qs.stringify(obj));
      if(res.code ===0 ) {
        this.img.defaultPicture1 = res.data[0].url;
        
      }
      else {
        MessageBox.alert(res.msg);
      }
      this.imgChange.a = this.img.defaultPicture1;
    },
    async UpdatedImgFiles2(msg) {
      if(msg.substring(0,22)=="data:image/png;base64,") {
        msg = msg.replace("data:image/png;base64,","");
      }
      else if(msg.substring(0,23)=="data:image/jpeg;base64,") {
        msg = msg.replace("data:image/jpeg;base64,","");
      }
      let obj = { files:msg };
      let res = await uploadFileFun(qs.stringify(obj));
      if(res.code ===0 ) {
        this.img.defaultPicture2 = res.data[0].url;
      }
      else {
        MessageBox.alert(res.msg);
      }
      this.imgChange.b = this.img.defaultPicture2;
    },
    async UpdatedImgFiles3(msg) {
      if(msg.substring(0,22)=="data:image/png;base64,") {
        msg = msg.replace("data:image/png;base64,","");
      }
      else if(msg.substring(0,23)=="data:image/jpeg;base64,") {
        msg = msg.replace("data:image/jpeg;base64,","");
      }
      let obj = { files:msg };
      let res = await uploadFileFun(qs.stringify(obj));
      if(res.code ===0 ) {
        this.img.defaultPicture3 = res.data[0].url;
      }
      else {
        MessageBox.alert(res.msg);
      }
      this.imgChange.c = this.img.defaultPicture3;
    },
    //判断是否可提交
    disbaledBtn() {
      if( this.cardName != '' && this.IDCardNo != '' && this.img.defaultPicture1 != '../../../static/image/mine/pictureZheng.png' ) {
        this.disabled = false;
      }
    },
    async submitRealName() {
      let obj = {
        cardName: this.cardName,
        IDCardNo: this.IDCardNo,
        IDCardFont: this.imgChange.a,
        IDCardReverse: this.imgChange.b,
        IDCardImg: this.imgChange.c
      };
      let res =await confirmOperatorFun(qs.stringify(obj));
      if(res.code ===0 ) {
        this.$toast({
          message: '已申请实名认证，请耐心等待审核',
          position: 'middle',
          duration: 3000
        });
        this.$router.push({
          name:'accountSet'
        });
      }
      else {
        this.$toast({
          message: res.msg,
          position: "middle",
          duration: 3000
        });
      }
    },
    async getRealName() {
      this.disabled = false;
      let res = await getRealNameFun();
      if(res.code ===0 ) {
        this.cardName = res.data.cardName;
        this.IDCardNo = res.data.idcardNo;
        this.img.defaultPicture1 = res.data.idcardFont;
        this.img.defaultPicture2 = res.data.idcardImg;
        this.img.defaultPicture3 = res.data.idcardReverse;
        this.imgChange.a = this.img.defaultPicture1;
        this.imgChange.b = this.img.defaultPicture2;
        this.imgChange.c = this.img.defaultPicture3;
      }
    }
  },
  filters:{
    replaceAliply(value){
        return String(value).replace(/^(\d{4})\d{4}(\d+)/,"$1****$2");
    }
  },
  components:{
    UploadImg
  },
  created() {
    if(this.$route.query.status == "未通过" || this.$route.query.status == "审核中" ) {
      this.getRealName();
    }
    if(this.$route.query.status == "审核中") {
      this.showText = '正在进行审核';
    }
    else {
      this.showText = '上传身份证照片';
    }
  }
};
</script>
<style type="text/css" lang="scss" scoped>
section {
  .prompt {
    font-size: 14px;
    background-color: #FDFCEC;
    padding: 0.3rem 0;
    text-align: center;
    span {
      color: #FF5F5F;
    }
  }
  .margin {
    margin-top: 0.3rem;
  }
  .shopname-p {
    background-color: #fff;
    font-size: 16px;
    border-bottom: 1px solid #F8F8F8;
    padding: 0.06rem;
    span {
      display: inline-block;
      &:first-child {
        margin-left: 0.3rem;
        width: 2rem;
      }
      input {
        height: 1rem;
      }
      ::-webkit-input-placeholder {
        color: #999999;
        font-size: 16px;
      }
      :-moz-placeholder {
        /* Firefox 18- */
        color: #999999;
        font-size: 16px;
      }
      ::-moz-placeholder {
        /* Firefox 19+ */
        color: #999999;
        font-size: 16px;
      }
      :-ms-input-placeholder {
        color: #999999;
        font-size: 16px;
      }
    }
    &:last-child {
      border-bottom: 1px solid #fff;
    }
    .nameInput {
      margin-left: 0.5rem;
    }
    .statusInput {
      margin-left: 0.5rem;
    }
  }
  .imgShow {
    font-size: 14px;
    text-align: center;
    padding: 0.4rem 0;
    background-color: #fff;
  }
  .bgc {
    background-color: #fff;
  }
  .showFont {
    font-size: 14px;
    color: #FF5F5F;
    background: #fff;
    padding-bottom: 0.5rem;
    padding-left: 0.5rem;
  }
  .confirmNews {
    background-color: #fff;
    text-align: center;
    .isDis {
      opacity: 0.6;
    }
    button {
      width: 92%;
      background-color: #1890FF;
      border: none;
      border-radius: 5px;
      color: #fff;
      font-size: 16px;
      padding: 0.35rem 0;
      margin-bottom: 0.5rem;
    }
  }
}
</style>


