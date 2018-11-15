<template>
    <transition  name="text-fade">       
        <div class="letter-wrapper" v-show="isNoticeShow">           
            <div class="letter-content">
                <div class="letter-detail">
                    <div class="modal" v-if="isModalShow">
                        <div class="btn" @click="showFont"></div> 
                    </div>
                    <div class="font" v-if="isFontFhow">
                        <div class="letter-top"></div>
                        <div class="font-center">
                            <div class="font-con">
                                <p class="textIndentNone">尊敬的运营商伙伴:</p>
                                <p>您们好！</p>
                                <p>我是企鹅科技的创始人，许光磊。今天是企鹅共享洗衣一周岁的生日！很开心能在这样的日子和大家一起分享这一年我们取得的成绩！</p>
                                <p>这一年里，企鹅共享洗衣利用平台技术优势、硬件优势以及运营优势，我们跑得十分迅速，目前累计进入了<span class="highlight">216</span>个城市，覆盖了<span class="highlight">1000</span>多所高校，用户数量突破了<span class="highlight">700</span>多万，日活跃用户达<span class="highlight">35</span>万以上。</p>
                                <p>这一年里，我们也遇到了很多技术挑战，但所幸我们都一一克服：最终我们实现了30多个洗衣机品牌，上百种洗衣机型号的技术物联。感谢所有运营商伙伴在我们遇到困难时，依旧坚定不移的支持我们，陪伴我们一起走出困境，共同成长。</p>
                                <p>在1周年这样的一个重要的日子，也有一个好消息要和大家分享：<span class="highlight">我们获得了蚂蚁金服近亿元的A轮投资！</span>本次所融资金将用于公司的业务拓展、产品创新、团队发展和服务领域。此次蚂蚁金服的加入如虎添翼，我相信企鹅在未来会取得更加亮眼的成绩。我们也会一如既往的时刻倾听大家的心声，不断完善我们的产品，优化我们的平台，以便更好的服务于大家！</p>
                                <p>未来，我们继续携手，一起共创全国最大的共享服务平台！让天下没有难做的洗衣房！</p>
                                <p>最后，我谨代表企鹅科技所有员工，向一路以来支持我们的运营商伙伴表达最真挚的谢意！</p>
                                <p>企鹅共享洗衣，衣路向前，企无止境！</p>
                                <br/>
                                <p class="textIndentNone right">许光磊</p>
                                <p class="textIndentNone right">2018.11.17</p>
                                <img src="../../../static/image/activity/letter_bottom.png">
                            </div>
                            
                            <img class="logo" src="../../../static/image/activity/logo.png">
                        </div>
                    </div>
                </div>
                <div class="icon-wrapper" @click="closeNotice">
                    <img src="../../../static/image/activity/del@2x.png">
                </div>
            </div>        
        </div>
    </transition >
</template>

<script>
import { setActivityType, getActivityType} from '@/utils/tool';

export default {
  data(){
    return {
        isNoticeShow:false,
        isModalShow:true,
        isFontFhow:false,
    };
  },
  created(){
     	this.modalShow();
  },
 
  methods:{
      modalShow(){  
        setTimeout(() => {
            if(getActivityType() != 1) {
            
                this.isNoticeShow = true;
                document.body.style.height = '100%';
                document.body.style['overflow-y'] = 'hidden';
            }else{
                this.isNoticeShow = false;
                document.body.style.height = 'auto';
                document.body.style['overflow-y'] = 'auto';
            } 
        },1000);		
      },
      //关闭当前弹窗，
      closeNotice(){
          let vm = this;
          _hmt.push(['_trackEvent', 'close', 'click', 'activity']);
          vm.isNoticeShow = false;
          document.body.style.height = 'auto';
           document.body.style['overflow-y'] = 'auto';
          setActivityType(1);                  
      },
      //进入活动详情
      showFont(){
          _hmt.push(['_trackEvent', 'button', 'click', 'activity']);
          this.isFontFhow = true;
          this.isModalShow = false;
      }
  }
};
</script>
<style lang="scss" scoped>
.letter-wrapper{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.8);
    top: 0;
    left: 0;
    z-index: 10000000;  
    .letter-content{       
        width: 100%;    
        padding-bottom: 1.3333rem;
        box-sizing: border-box;
        position: absolute;
        height: 100%;
        top: 0;
        left: 0;
        padding-bottom: 1.0667rem;
        overflow: auto; 
        .letter-detail{           
            width: 100%;
            height: 13.0133rem;
            .modal{
                position: absolute;
                top: 1.6533rem;
                left:50%;
                transform: translate(-50%);
                width: 9.1733rem;
                height: 10.8133rem;
                background-image: url(../../../static/image/activity/modal_bg.png);
                background-size: cover;
                .btn{
                    position: absolute;
                    width: 4.2933rem;
                    height: 1.16rem;
                    background-image: url(../../../static/image/activity/button.png);
                    background-size: cover;
                    left: 2.48rem;
                    top: 6.36rem;
                }
            }
            
            .font{
                position: relative;
                .letter-top{
                    width: 9.0667rem;
                    height: 2.2rem;
                    background-image: url(../../../static/image/activity/letter_top.png);
                    background-size: cover;
                    margin: 0 auto;
                }
                .font-center{
                    box-sizing: border-box;
                    width: 7.6rem;
                    height: 11.6rem;
                    background-color: #ebebff;
                    position: absolute;
                    top: 1.4533rem;
                    left: 1.2133rem;
                    border-radius: 0 0 .1rem .1rem;
                    padding: .64rem 0 1.1867rem;
                    .logo{
                        width:1.8933rem;
                        height: auto;
                        position: absolute;
                        left: 50%;
                        transform: translate(-50%);
                        bottom: .4rem; 
                    }
                    .font-con{
                        box-sizing: border-box;
                        width: 100%;
                        height: 100%;
                        padding: 0 .5067rem;
                        overflow-y: auto;
                        position: relative;                       
                        p{ 
                            font-size: .4267rem;
                            color: #7B2F04;
                            text-indent: 2em;
                            line-height: .8rem;
                            text-align: justify;
                            font-family: letterFont;
                            letter-spacing: .0133rem;
                            &.textIndentNone{
                                text-indent: 0;
                            }
                            .highlight{
                                color: #3553F9;
                            }
                            &.right{
                                text-align: right;
                            }
                        }
                        img{
                            width: 3.5467rem;
                            height: auto;;
                            margin-top: -1.7333rem;
                        }
                    }
                }
            }

        }
        .icon-wrapper{
            width: .8533rem;
            height: .8533rem;
            margin: .7733rem auto 0;
            text-align: center;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
    
}

</style>
<style>
.text-fade-enter-active,.text-fade-leave-active{
    transition:all 1s ease;
}
.text-fade-leave-active{
    opacity: 0;
}
.text-fade-enter,.text-fade-leave-to{
    opacity: 0;
}

</style>
