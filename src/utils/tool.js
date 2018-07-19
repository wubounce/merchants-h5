import Cookies from 'js-cookie';

const TokenKey = 'Token';
export const getToken = () => Cookies.get(TokenKey);
export const setToken = (token) => Cookies.set(TokenKey, token);
export const removeToken = () => Cookies.remove(TokenKey);

const storeKey = 'user';
export const setUser = (user) => localStorage.setItem(storeKey, JSON.stringify(user));
export const getUser = () => JSON.parse(localStorage.getItem(storeKey));
export const removeUser = () => localStorage.removeItem(storeKey);
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
