/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor'];
  return valid_map.indexOf(str.trim()) >= 0;
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}
export function validatPhone(str) {
  const reg = /^(1)\d{10}$/;
  return reg.test(str);
}

/* 密码 */
export const validatPwd = (str) => {
  const reg = /^[a-zA-Z0-9]{6,20}$/;
  return reg.test(str);
};
/* 邀请码 */
export const validatInviteCode = (str) => {
  const reg = /^[0-9]{5}$/;
  return reg.test(str);
};
/* 短信验证码 */
export const validatMessageCode = (str) => {
  const reg = /^[0-9]{6}$/;
  return reg.test(str);
};
/* 搜索 */
export const validatSearch = (str) => {
  const reg = /^[a-zA-Z0-9]{0,}$/; 
  return reg.test(str);
};

/* 数字 */
export const validatDiscount = (str) => {
  const reg = /^([1-9]\d{0,1}|100)$/;
  return reg.test(str);
};

/* 折扣 */
export const validatVipDiscount = (str) => {
  const reg = /^((0\.[1-9]{1})|(([1-9]{1})(\.\d{1})?))$/ ;
  return reg.test(str);
};
/* 销售价格 */
export const validatVipPrice = (str) => {
  const reg = /^\d*(\.\d{1,2})?$/;
  return reg.test(str);
};

/*价格*/
export const validatCradPrice = (str)=>{
  const reg = /^[1-9]\d{0,2}$/;
  return reg.test(str);
};
/* 中文*/
export const validatName = (str) => {
  const reg = /^[\u0391-\uFFE5A-Za-z]{2,20}$/;
  return reg.test(str);
};

/*vip卡次数*/
export const validatVipLimit = (str) => {
  const reg = /^[0-9]+$/;
  return reg.test(str);
};

/*去掉特殊字符*/
export const validatReplace = /[\'\"\\\/\b\f\s\n\r\t\@\#\$\%\^\&\*\(\)\{\}\:\"\L\<\>\?\[\]]/g;  

// 邮箱
export const validatEmail = (str)=>{
  const reg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
  return reg.test(str);
};

/**
 * 订单补偿券
 * 
 */
export const validatPrice = (str)=>{
  const reg = /^[0-9]{1}\d*(\.\d{1,2})?$/;
  return reg.test(str);
};
/**
 * 添加客服电费座机和手机号校验
 * 
 */
export const validatServiceTelephone = (str)=>{
  const reg = /^((0\d{2,3}-\d{7,8})|(1\d{10}))$/;
  return reg.test(str);
};
