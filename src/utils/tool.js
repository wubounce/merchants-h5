import Cookies from 'js-cookie';
import store from '@/store';
import qs from 'qs';

const TokenKey = 'Token';
export const getToken = () => Cookies.get(TokenKey);
export const setToken = (token) => Cookies.set(TokenKey, token);
export const removeToken = () => Cookies.remove(TokenKey);

const NoticeTypeKey = 'NoticeType';
export const getNoticeType = () => Cookies.get(NoticeTypeKey);
export const setNoticeType = (NoticeType) => Cookies.set(NoticeTypeKey, NoticeType);
export const removeNoticeType = () => Cookies.remove(NoticeTypeKey);


const menuKey = 'menu';
export const setMenu = (menu) => localStorage.setItem(menuKey, JSON.stringify(menu));
export const getMenu = () => JSON.parse(localStorage.getItem(menuKey));
export const removeMenu = () => localStorage.removeItem(menuKey);

const navTabKey = 'navTabIndex';
export const setNavTabIndex = (navTab) => sessionStorage.setItem(navTabKey,navTab);
export const getNavTabIndex = () => sessionStorage.getItem(navTabKey);
export const removeNavTabIndex = () => sessionStorage.removeItem(navTabKey);

const PhoneKey = 'phone';
export const setPhone = (navTab) => localStorage.setItem(PhoneKey,JSON.stringify(navTab));
export const getPhone = () => JSON.parse(localStorage.getItem(PhoneKey));
export const removePhone = () => localStorage.removeItem(PhoneKey);

const PhoneCodeKey = 'phoneCode';
export const setPhoneCode = (navTab) => localStorage.setItem(PhoneCodeKey,JSON.stringify(navTab));
export const getPhoneCode = () => JSON.parse(localStorage.getItem(PhoneCodeKey));
export const removePhoneCode = () => localStorage.removeItem(PhoneCodeKey);

const UserNameKey = 'userName';
export const setUserNameKey = (navTab) => localStorage.setItem(UserNameKey,JSON.stringify(navTab));
export const getUserNameKey = () => JSON.parse(localStorage.getItem(UserNameKey));
export const removeUserName = () => localStorage.removeItem(UserNameKey);

const IsRememberKey = 'isRemember';
export const setIsRemember = (navTab) => localStorage.setItem(IsRememberKey,JSON.stringify(navTab));
export const getIsRemember  = () => JSON.parse(localStorage.getItem(IsRememberKey));
export const removeIsRemember  = () => localStorage.removeItem(IsRememberKey);

const EmailKey = 'email';
export const setEmail = (data) => localStorage.setItem(EmailKey,data);
export const getEmail = () => localStorage.getItem(EmailKey);
export const removeEmail = () => localStorage.removeItem(EmailKey);

/**
 * 截流函数
 */
export const delay = (function () {
  let timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

// 获取每个节点的直属子节点，*记住是直属，不是所有子节点
export const getTrees = (list, parentId) => {
	let items= {};
	// 获取每个节点的直属子节点，*记住是直属，不是所有子节点
	for (let i = 0; i < list.length; i++) {
	   let key = list[i].parentId;
	   if (items[key]) {
	       items[key].push(list[i]);
	   } else {
	       items[key] = [];
	       items[key].push(list[i]);
	   }
	}
	return formatTree(items, parentId);
};

/**
* 利用递归格式化每个节点
*/
export const formatTree = (items, parentId) => {
	let result = [];
	if (!items[parentId]) {
	  return result;
	}
	for (let t of items[parentId]) {
	  t.children = formatTree(items, t.menuId);
	  result.push(t);
	}
	return result;
};


// 格式化时间差为00:00:00格式时间
export const formatDuration = (timestamp) => {
  const format = (v) => {
    return (v + "").padStart(2, 0);
  };
  let duration = moment.duration(timestamp, 'seconds');
  return format(duration.hours()) + ':' + format(duration.minutes()) + ':' + format(duration.seconds());
};

// 通过标准时间（yyyy-MM-dd HH:mm:ss）,转换和服务器时间的时间差
export const  getDuration = (dateStr) => {
  let date = moment(dateStr);
  let now = moment(store.getters.getServerTime());
  console.log(now.diff(date, 'seconds'));
  return now.diff(date, 'seconds');
};


export const  calMax = (arr) =>{
	var max = arr[0];
	for ( var i = 1; i < arr.length; i++) {// 求出一组数组中的最大值
		if (max < arr[i]) {
		  max = arr[i];
		}
	}
	var maxint = Math.ceil(max / 10);// 向上取整
	var maxval = maxint * 10;// 最终设置的最大值
	return maxval;// 输出最大值
};


export const calMin = (arr) => {
	var min = arr[0];
	for ( var i = 1; i < arr.length; i++) {// 求出一组数组中的最大值
	if (min > arr[i]) {
	  min = arr[i];
	}
	}
	var minint = Math.floor(min / 5);// 向下取整
	var minval = minint * 5;// 最终设置的最大值
	return minval;// 输出最大值
};

export const filterData = (data)=>{
	let params = {};  
	for (let i in data) {
	   if (data[i] === null || data[i] === undefined || data[i] === '') continue;
	   params[i]=data[i];
	}
	return qs.stringify(params);
};

// 签名算法 - sha1加密
export const get_sign = (data,time) => {
	// 防止浏览器转义
	data = decodeURIComponent(data);
	if(data) {
		// 从字符串里把属性和值取到数组中
		let dataSplit = data.split('&');
		let objkey = [], // 存属性名
				objvalue = []; // 存属性值
		// 分别将key和value放在对应函数中
		// 分别将key和value放在对应函数中
		for (let i=0; i<dataSplit.length; i++) {
			if(dataSplit[i].split('=').length > 2 ) {
				let temp = dataSplit[i].indexOf('=');
				objkey.push(dataSplit[i].substring(0,temp));
				objvalue.push(dataSplit[i].substring(temp+1));
			}else {
				objkey.push(dataSplit[i].split('=')[0]);
				objvalue.push(dataSplit[i].split('=')[1]);
			}

		}
		// 将选出来的属性和值从数组里一一对应存到对象中
		let obj ={};
		for (let j=0;j<objkey.length;j++) {
			obj[objkey[j]] = objvalue[j];
		}

		//获取当前时间并添加当前时间戳到obj对象中
		obj._timestamp = time;

		// 添加_appid
		obj._appid = '44efec05494c4ca3a4a7ada47722a1a8';

		// 字典排序得到对象newObj
		let newKey = Object.keys(obj).sort();
	  let newObj = {};
	  for(let i = 0; i < newKey.length; i++) {
	    newObj[newKey[i]] = obj[newKey[i]]; 
		}

		let signarr = []; // 存排序后的数组

		for(let key in newObj) {
			signarr.push(key + '=' + newObj[key]); // 存储操作
		}

	  let str = signarr.join('&'); //需要加密的字符串

		//sha1加密
	  let sha1 = require('sha1');
	  let _sign = sha1(str);
	  return _sign; //返回	请求参数_sign
	}
};
