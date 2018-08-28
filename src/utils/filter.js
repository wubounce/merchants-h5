/**
 *  描述：Global filters js
 */
import { getMenu } from '@/utils/tool';
// 待安装
const install = (Vue, options) => {
	//移动端滚动穿透问题
    Vue.prototype.ModalHelper = ((bodyCls) =>{
		let scrollTop;
		return {
		    afterOpen: function () {
		        scrollTop = document.scrollingElement.scrollTop;
		        document.body.classList.add(bodyCls);
		        document.body.style.top = -scrollTop + 'px';
		    },
		    beforeClose: function () {
		        document.body.classList.remove(bodyCls);
		        document.scrollingElement.scrollTop = scrollTop;
		    }
		};
	})('dialog-open');
	//权限检查方法
	Vue.prototype.$_has = function(value) {
	  let isExist=false;
	  let buttonpermsStr = getMenu();
	  if(buttonpermsStr==undefined || buttonpermsStr==null){
	    return false;
	  }
	  for(let i=0;i<buttonpermsStr.length;i++){
	    if(buttonpermsStr[i].perms.includes(String(value))){
	      isExist=true;
	      break;
	    }
	  }
	  return isExist;
	};

	//签名算法：
	Vue.prototype.get_sign = (obj)=>{

	  obj._appid = '44efec05494c4ca3a4a7ada47722a1a8';

	  let newKey = Object.keys(obj).sort();

	  let newObj = {};
	  for(let i = 0; i < newKey.length; i++) {
	    newObj[newKey[i]] = obj[newKey[i]]; 
	  }
	  
	  let jsonstr = JSON.stringify(newObj);
	  let str2 = jsonstr.replace(new RegExp(':','g'),'=').replace(new RegExp(',','g'),'&');
	  let str3 = str2.substring(1,str2.length-1);
	  console.log('加密前的str:',str3.split('"').join(''));
	  
	  //sha1加密
	  let sha1 = require('sha1');
	  let _sign = sha1(str3.split('"').join(''));
	  console.log("sha1加密后的str:",_sign);
	  delete obj._appid;
	  obj._sign = _sign;
	  console.log('处理过的请求参数：',obj);
	  return obj;
	};

	Vue.directive('title', {
	  inserted: function (el, binding) {
	    document.title = binding.value;
	  }
	});
	/**权限指令**/
	Vue.directive('has', {
	  bind: function(el, binding) {
	    if (!Vue.prototype.$_has(binding.value)) {
	       // el.parentNode.removeChild(el);
	      var childs = el.childNodes;
	      if (childs) {
	        for(var i = childs.length - 1; i >= 0; i--) { 
	          el.removeChild(childs[i]); 
	        }
	      }
	      el.style.display = "none";
	    }
	  }
	});
	Vue.directive('focus', {
	  inserted: function (el, {value}) {
	    el.focus();
	  }
	});

	// vue 过滤器
	Vue.filter('tofixd', (value) => {
		return Number(value).toFixed(2);
	});
	Vue.filter('week',(value)=> {
	  if (value === '9') {
        return '每天';
      } else if(value === '8'){
        return '周一至周五';
      }else {
        let arr = [];
        let weeklsit = [];
        arr = value? value.split(',') :[] ;
        arr.forEach(item=>{
          if (item == '1') {
            weeklsit.push('周一');
          } else if(item == '2') {
            weeklsit.push('周二');
          } else if(item == '3') {
            weeklsit.push('周三');
          } else if(item == '4') {
            weeklsit.push('周四');
          } else if(item == '5') {
            weeklsit.push('周五');
          } else if(item == '6') {
            weeklsit.push('周六');
          } else if(item == '0') {
            weeklsit.push('周日');
          }
        });
        return weeklsit.join(',');
      }
	});
	Vue.filter('replaceAliply', (value) => {
		return String(value).replace(/^(\d{4})\d{4}(\d+)/,"$1****$2");
	});
};

export default install;
