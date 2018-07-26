/**
 * 数据映射类
 */

//========= 机器 ==========//
// 机器状态
export const MachineStatus = (ststus)=>{
	switch (ststus){
		case 'idle':
			return '空闲';
		case 'run':
		    return '工作';
		case 'hitch':
		    return '故障';
		case 'offline':
		    return '离线';
		case 'timeout':
		    return '超时未工作';
		case 'all':
		 	return '总数';
		 default:
  			return ststus;
	}
};

// 通信类型
export const communicateType = (ststus)=>{
	switch (ststus){
		case 0:
			return '脉冲';
		case 1:
		  return '串口';
		 default:
  			return ststus;
	}
};

// 订单状态类型
export const orderStatus = (ststus)=>{
	switch (ststus){
		case 0:
			return '未支付';
		case 1:
		  	return '已失效';
		case 2:
		 	 return '已支付 ';
		case 3:
		  	return '已完成';
		case 4:
		  	return '申请退款';
		case 5:
		 	return '已退款';
		default:
  			return ststus;
	}
};

// 支付方式
export const PayType = (ststus)=>{
	switch (ststus){
		case 1:
			return '支付宝';
		case 2:
		  	return '余额';
		case 3:
		 	 return '微信 ';
		default:
  			return ststus;
	}
};


// 人员管理禁用启用
export const memberIsLock = (ststus)=>{
	switch (ststus){
		case 0:
			return true;
		case 1:
		  	return false;
		default:
  			return true;
	}
};





