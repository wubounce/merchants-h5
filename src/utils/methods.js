export function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof query_string[key] === "undefined") {
      query_string[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
}
export function userAgent() {
  var ua = window.navigator.userAgent.toLowerCase();
  //判断是不是微信
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return "wechat";
  }
  //判断是不是支付宝
  if (ua.match(/AlipayClient/i) == 'alipayclient') {
    return "alipay";
  }
  //哪个都不是
  return "false";
}
