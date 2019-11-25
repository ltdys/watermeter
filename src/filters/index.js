import { getLocalStorage } from '@/utils/storageUtil.js'

// 当前状态
export function fNowStatus(str) {
  return str == 0 ? '未使用' : '使用'
}

// 使用状态
export function fUseStatus(str) {
  return str === 0 ? '未使用' : '使用'
}

// 是否在线
export function fIsOnline(str) {
	return str === 0 ? '不在线' : '在线'
}

// 空管状态
export function fAtcStatus(str) {
	return str === 0 ? '异常' : '正常'
}

// 表状态
export function fStatus(str) {
	return str === 0 ? '异常' : '正常'
}

// 通信状态
export function fComState(str) {
	return str === 0 ? '异常' : '正常'
}

// 转换时间
export function fFormatDate(time, cFormat) {
  if(!time) return ""
  if(arguments.length === 0) return null
		if((time + '').length === 10) {
			time = +time * 1000
		}

		var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}', date
		if(typeof time === 'object') {
			date = time
		} else {
			date = new Date(time)
		}

		var formatObj = {
			y: date.getFullYear(),
			m: date.getMonth() + 1,
			d: date.getDate(),
			h: date.getHours(),
			i: date.getMinutes(),
			s: date.getSeconds(),
			a: date.getDay()
		}

		var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
			var value = formatObj[key]
			if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
				if (result.length > 0 && value < 10) {
					value = '0' + value
				}
				return value || 0
			})

		return time_str
}

// 转换组织
export function fCompanyId(str) {
	if (!str) { return "" }
	let treeData = getLocalStorage("COMPANY_DATA", "json")
	treeData.forEach((item, index) => {
		if (item.id === str.toString()) {
			str = item.companyName;
		}
	})
	return str
}
