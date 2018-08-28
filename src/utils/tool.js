import Cookies from 'js-cookie';
import moment from 'moment';
import store from '@/store';

const TokenKey = 'Token';
export const getToken = () => Cookies.get(TokenKey);
export const setToken = (token) => Cookies.set(TokenKey, token);
export const removeToken = () => Cookies.remove(TokenKey);

const NoticeTypeKey = 'NoticeType';
export const getNoticeType = () => Cookies.get(NoticeTypeKey);
export const setNoticeType = (NoticeType) => Cookies.set(NoticeTypeKey, NoticeType);
export const removeNoticeType = () => Cookies.remove(NoticeTypeKey);

const storeKey = 'user';
export const setUser = (user) => localStorage.setItem(storeKey, JSON.stringify(user));
export const getUser = () => JSON.parse(localStorage.getItem(storeKey));
export const removeUser = () => localStorage.removeItem(storeKey);

const menuKey = 'menu';
export const setMenu = (menu) => localStorage.setItem(menuKey, JSON.stringify(menu));
export const getMenu = () => JSON.parse(localStorage.getItem(menuKey));
export const removeMenu = () => localStorage.removeItem(menuKey);

const navTabKey = 'navTabIndex';
export const setNavTabIndex = (navTab) => sessionStorage.setItem(navTabKey,navTab);
export const getNavTabIndex = () => sessionStorage.getItem(navTabKey);
export const removeNavTabIndex = () => sessionStorage.removeItem(navTabKey);

const PhoneKey = 'phone';
export const setPhone = (navTab) => sessionStorage.setItem(PhoneKey,navTab);
export const getPhone = () => sessionStorage.getItem(PhoneKey);
export const removePhone = () => sessionStorage.removeItem(PhoneKey);
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
