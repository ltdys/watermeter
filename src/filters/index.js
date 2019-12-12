import { getLocalStorage } from '@/utils/storageUtil.js'

// 当前状态
export function fNowStatus (str) {
  return str == 0 ? '未使用' : '使用'
}

// 使用状态
export function fUseStatus (str) {
  return str === 0 ? '未使用' : '使用'
}

// 是否在线
export function fIsOnline (str) {
  return str === 0 ? '不在线' : '在线'
}

// 空管状态
export function fAtcStatus (str) {
  return str === 0 ? '异常' : '正常'
}

// 表状态
export function fStatus (str) {
  return str === 0 ? '异常' : '正常'
}

// 通信状态
export function fComState (str) {
  return str === 0 ? '异常' : '正常'
}

// 转换时间
export function fFormatDate (time, cFormat) {
  if (!time) return ""
  if (arguments.length === 0) return null
  if ((time + '').length === 10) {
    time = +time * 1000
  }

  var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'; var date
  if (typeof time === 'object') {
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
export function fCompanyId (str) {
  if (!str) { return "" }
  const treeData = getLocalStorage("COMPANY_DATA", "json")
  treeData.forEach((item, index) => {
    if (item.id === str.toString()) {
      str = item.companyName;
    }
  })
  return str
}

// 菜单管理 返回数据为空  列表展示'--'
export function fDataVal (val) {
  if (!val) return '--'
  return val
}

// 菜单管理 返回状态为空
export function fStatusVal (val) {
  if (!val) {
    return '--'
  } else if (val === 1) {
    return '是'
  } else if (val === 0) {
    return '否'
  }
}

// 组织管理 状态转换
export function fOrgChange (val) {
  if (val === null) {
    return '--'
  } else if (val === 0) {
    return '正常'
  } else if (val === 1) {
    return '锁定'
  }
}

// 区域管理 状态转换
export function fAreaChange (val) {
  if (val === null) {
    return '--'
  } else if (val === 0) {
    return '有效'
  } else if (val === 1) {
    return '无效'
  }
}

// 区域管理  父节点转化
export function fParentChange (val) {
  if (!val) {
    return '--'
  } else {
    return val
  }
}

// 用户管理  状态
export function fUserStatus (val) {
  if (val === '') {
    return '--'
  } else if (val == 0) {
    return '正常'
  } else if (val == 1) {
    return '锁定'
  }
}

// 用户管理  性别
export function fUserSex (val) {
  if (val === '') {
    return '--'
  } else if (val == 0) {
    return '保密'
  } else if (val == 1) {
    return '男'
  } else if (val == 2) {
    return '女'
  }
}

// 阀门状态
export function fisSwing (val) {
  if (val == null) {
    return '开阀'
  } else if (val == -1) {
    return '不支持门阀'
  } else if (val == 0) {
    return '开阀'
  } else if (val == 1) {
    return '关阀'
  }
}

// 操作阀门状态
export function fisSwingShow (val) {
  if (val == null) {
    return '关阀'
  } else if (val == 0) {
    return '关阀'
  } else if (val == 1) {
    return '开阀'
  }
}
