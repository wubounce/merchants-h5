<template>
  <section class="referee">
    <div ref="refereeForm" :model="referee" class="referee-form">
      <div class="form-group">
        <input type="text" placeholder="请输入姓名" v-model="referee.name" required="required">
      </div>
      <div class="form-group">
        <p class="area" @click='open()'>
          <span class="chooseArea" :class="{'black':chooseArea !== '选择所在区域' }">{{chooseArea}}</span>
          <span class="forward iconfont icon-nextx"></span>
        </p>      
      </div>
      <div class="form-group">
        <input type="text" placeholder="邀请码" v-model="referee.code" required="required">
      </div>
      <div class="clickBtn">
        <mt-button type="primary" class="btn-blue" @click.prevent="goToNext" :disabled="!(chooseArea!== '选择所在区域' && referee.name && referee.code) ">申请注册</mt-button>
      </div>
      <p class="agreeRule" @click="keepMsg">注册表示已同意<span class="rule">《用户协议》</span></p>
    </div>
    <!-- 弹窗 -->
      <mt-popup v-model="placeVisible" position="bottom" class="mint-popup">
      <div class="prop-bd">
        <div class="page-picker-wrapper">
          <mt-picker :slots="addressSlots" @change='addressChange' :showToolbar="true"><p class="toolBar"><span @click='cancel'>取消</span><span>所在地区</span><span @click='sure'>确定</span></p></mt-picker>
        </div>
      </div>
    </mt-popup>
  </section>
</template>

<script>
  import place from '@/components/Area/Area';
  import { validatInviteCode, validatName } from '@/utils/validate';
  import { areaListFun } from '@/service/shop';
  import { saveRegisterInfoFun } from '@/service/device';
  export default{
    data() {
      return {
        referee: {
          code: '',
          name: '',
        },
        chooseArea: '选择所在区域',
        placeVisible:false,
        addressSlots:[
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot2"
        },
        {
          flex: 1,
          values: [],
          className: "slot3",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot4"
        },
        {
          flex: 1,
          values: [],
          className: "slot5",
          textAlign: "center"
        }
        ],
        provinceArray: [], // 存addressSlots[0].values的areaname和areaid
        cityArray: [], // 存addressSlots[2].values的areaname和areaid
        districtArray: [],
        provinceName: '',
        cityName: '',
        districtName: '',
        place: '',
        provinceId:'',
        cityId:'',
        districtId:''
      };
    },
    methods: {
      open() {
        this.placeVisible = true;
      },
      cancel() {
        this.placeVisible = false;
        this.addressSlots[0].defaultIndex = 0;
      },
      sure() {
        this.placeVisible = false;
        if(!this.districtName) {
          this.districtName = '';
          this.districtId = this.cityId;
        }
        if(this.cityName) {
          if(this.provinceName == this.cityName.slice(0,2)) {
            this.place = this.cityName + this.districtName;
          }
          else {
            this.place = this.provinceName + this.cityName + this.districtName;
          }
        }

        // 传给父组件的值由地址，省ID，市ID，区ID,省名，市名，区名拼接而成，以逗号分割，例如：'河北省石家庄市长安区,130000,130100,130102'
        this.message = this.place + ',' + this.provinceId + ',' + this.cityId + ',' + this.districtId + ',' + this.provinceName + ',' + this.cityName + ',' + this.districtName;
        this.chooseArea = this.place;
      },
      async addressChange(picker,values) {
        let obj = { parentId: '0' };
        let res = await areaListFun(obj);
        this.provinceArray = res;
        let choosePro = res.map((p)=> {
          return p.areaName;
        });
        picker.setSlotValues(0, choosePro); //设置省

        for(let i=0;i<this.provinceArray.length;i++) {
          if( values[0] === this.provinceArray[i].areaName ) {
            let city = { parentId: this.provinceArray[i].areaId };
            this.provinceId = this.provinceArray[i].areaId;
            let resCity = await areaListFun(city);
            this.cityArray = resCity;
            let chooseCity = resCity.map((c)=> {
              return c.areaName;
            });
             picker.setSlotValues(1, chooseCity); //设置市
          }
        }

        //根据市，找出与之对应的区
        for(let j=0;j<this.cityArray.length;j++) {
          if(values[1] == this.cityArray[j].areaName) {
            let district = { parentId: this.cityArray[j].areaId };
            this.cityId = this.cityArray[j].areaId;
            let resDistrict = await areaListFun(district);
            let chooseDistrict = resDistrict.map((d)=> {
              return d.areaName;
            });
            this.districtArray = resDistrict;
            picker.setSlotValues(2, chooseDistrict); //设置市
           }
        }

        for(let j=0;j<this.districtArray.length;j++) {
          if(values[2] == this.districtArray[j].areaName) {
            this.districtId = this.districtArray[j].areaId;
          }
        }
        this.provinceName = values[0];
        this.cityName = values[1];
        this.districtName = values[2];
      },
      keepMsg() { //缓存信息
        sessionStorage.setItem('refeeName',this.referee.name);
        sessionStorage.setItem('address',this.chooseArea);
        sessionStorage.setItem('provinceId',this.provinceId);
        sessionStorage.setItem('cityId',this.cityId);
        sessionStorage.setItem('districtId',this.districtId);
        sessionStorage.setItem('invitationCode',this.referee.code);
        this.$router.push({name:'userAgreement'});
      },
      async goToNext() {  //提交
        if(this.referee.name && !validatName(this.referee.name)) {
          this.$toast({message: "用户名2-20个字符，支持中文和英文" });
          return false;
        }
        if(this.chooseArea === '选择所在区域') {
          this.$toast({message: "请选择您所在的区域地址" });
          return false;
        }
        if(this.referee.code && !validatInviteCode(this.referee.code)) {
          this.$toast({message: "请输入正确的邀请码" });
          return false;
        }
        let query = this.$route.query;
        let payload = {
          phone: query.phone,
          name: this.referee.name,
          password: query.password,
          address: this.chooseArea,
          provinceId: this.provinceId,
          cityId: this.cityId,
          districtId: this.districtId,
          invitationCode: this.referee.code,
        };
        saveRegisterInfoFun(payload).then(() => {
          this.$router.push({name:'successTip'});
          sessionStorage.removeItem('refeeName');
          sessionStorage.removeItem('address');
          sessionStorage.removeItem('provinceId');
          sessionStorage.removeItem('cityId');
          sessionStorage.removeItem('districtId');
          sessionStorage.removeItem('invitationCode');
       }); 
         
      },
    },

    watch: {
      placeVisible: function () {
        if (this.placeVisible) {
          this.ModalHelper.afterOpen();
        } else {
          this.ModalHelper.beforeClose();
        }
      },
    },
    created() {
        if(sessionStorage.getItem('refeeName')){
          this.referee.name = sessionStorage.getItem('refeeName');
        }
        if(sessionStorage.getItem('address')){
          this.chooseArea = sessionStorage.getItem('address');
        }
        if(sessionStorage.getItem('provinceId')){
          this.provinceId = sessionStorage.getItem('provinceId');
        }
        if(sessionStorage.getItem('cityId')){
          this.cityId = sessionStorage.getItem('cityId');
        }
        if(sessionStorage.getItem('districtId')){
          this.districtId = sessionStorage.getItem('districtId');
        }
        if(sessionStorage.getItem('invitationCode')){
          this.referee.code = sessionStorage.getItem('invitationCode');
        }
    }
    
  };
</script>
<style lang="scss" scoped>
  .referee {
    background: #fff;
    height: 100%;
    .referee-form {
      padding: 0 0.93rem;
      .form-group {
        height: 1.57rem;
        line-height: 1.57rem;
        font-size: 0.43rem;
        box-sizing: border-box;
        input{
          height: 1.57rem;
          border-bottom: 0.01rem solid #e5e5e5;
          color: #1890FF;
        }
        .area {
          height: 1.57rem;
          border-bottom: 0.01rem solid #e5e5e5; 
          font-size: 16px;
          color:rgba(153, 153, 153, 1);
          display: flex;
          .chooseArea {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .black {
            color: #1890FF;
          }
          .forward {
            color:rgba(204, 204, 204, 1);
            float: right;
          }

        }

      }
    }
    .clickBtn {
      margin: 1.47rem 0 0 0;
      .btn-blue {
        width: 100%;
        height: 1.17rem;
        line-height: 1.17rem;
        border-radius: 0.13rem;
      }
    }
    .agreeRule {
      margin-top: 0.8rem;
      font-size: 0.37rem;
      text-align: center;
      color: rgba(153, 153, 153, 1);
      .rule {
        color: rgba(24, 144, 255, 1);
      }
    }

    .toolBar {
      display: flex;
      justify-content: center;
      line-height: 1rem;
      background-color: #fbfbfc;
      span {
        &:nth-child(1) {
          font-size: 15px;
          color: #999999;
        }
        &:nth-child(2) {
          font-size: 16px;
          margin: 0 2.7rem;
          color: #666666;
        }
        &:nth-child(3) {
          font-size: 15px;
          color: #1890FF;
        }
      }
    }
  }
  
</style>

