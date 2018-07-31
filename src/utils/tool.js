import Cookies from 'js-cookie';

const TokenKey = 'Token';
export const getToken = () => Cookies.get(TokenKey);
export const setToken = (token) => Cookies.set(TokenKey, token);
export const removeToken = () => Cookies.remove(TokenKey);

const storeKey = 'user';
export const setUser = (user) => localStorage.setItem(storeKey, JSON.stringify(user));
export const getUser = () => JSON.parse(localStorage.getItem(storeKey));
export const removeUser = () => localStorage.removeItem(storeKey);

const menuKey = 'menu';
export const setMenu = (menu) => localStorage.setItem(menuKey, JSON.stringify(menu));
export const getMenu = () => JSON.parse(localStorage.getItem(menuKey));
export const removeMenu = () => localStorage.removeItem(menuKey);
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
