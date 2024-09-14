export function formatUsdt(v:any, decimals = 2) {
	if (typeof v != 'string') {
		v = new String(v)
	}
	const i = v.indexOf('.')
	if (i != -1) {
		v = v.substring(0, i) + '.' + v.substring(i + 1, i + decimals + 1)
		if (parseFloat(v) == 0) {
			return '0'
		}
		return v
	}
	return v
}

export function formatTime(timestamp:any) {
	const date = new Date(timestamp);
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	const seconds = date.getSeconds().toString().padStart(2, '0');
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function getContractMsg(errMsg = '', action = '') {
  if (/reverted/.test(errMsg)) {
	return action ? `${action} reverted` : 'Action reverted, please retry later'
  } else if (/no data/.test(errMsg)) {
	return action ? `${action} failed, please retry later!` : 'Action reverted, please retry later'
  }
  return errMsg
}

export function getExpireData(time:any) {
	const targetDate = new Date(time);

	// 获取当前日期
	const currentDate = new Date();

	// 计算两个日期之间的时间差（以毫秒为单位）
	const timeDifference = targetDate - currentDate;

	// 将时间差转换为天数（1天 = 24小时 * 60分钟 * 60秒 * 1000毫秒）
	const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
		
	if (daysRemaining < 0) {
		return 'expired'
	}

	return `${daysRemaining>0?daysRemaining:daysRemaining} days`
}

// name匹配图片
export function matchImg(logo:string){
    switch (logo) {
      case "USDT":
        return '/tether.png';
      case "SOL":
        return '/solana.png';
      case "AVAX":
        return '/avax.png';
	  case "USDC":
        return '/usdc.png';
      default:
        return '';
    }
  };

//   随机字符串
export function generateRandomString(num:number){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function handleShowDay (startBlock,blockNumber,cycle) {
	console.log(startBlock,blockNumber,cycle)
	let str = ''
	if(Number(startBlock)<Number(blockNumber)){
		str = Math.floor(((cycle - (Number(blockNumber) - Number(startBlock)))/6646))
		if(str>0){
			 str = `${str}${"days"}`
		}else{
			str = ''
		}
	}else{
		str = 'Not started yet'
	}
	return str
}