/**
 * 数据映射类
 */

//========= 机器 ==========//
// 机器状态
export const MachineStatus = (ststus)=>{
	switch (ststus){
		case 1:
			return '空闲';
		case 2:
		  return '工作';
		case 4:
		  return '故障';
		case 8:
		  return '离线';
		case 16:
		  return '超时未工作';
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




