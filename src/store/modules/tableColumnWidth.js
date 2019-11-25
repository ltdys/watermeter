// 表格列表宽度配置
import * as types from '../types.js'
import { setLocalStorage, getLocalStorage } from '@/utils/storageUtil.js'
const state = {
  sysParamsConfigColumnWidth: {
    widthConfigNo: 80,
    widthConfigName: 260,
    widthConfigType: 120,
    widthDataType: 120,
    widthDataValue: 80
  }
}

const mutations = {
  [types.SET_COLUMN_WIDTH] (state, data) {
    const localStorage = getLocalStorage(data.key, 'json');
    let currentObj;
    if (localStorage) {
      currentObj = Object.assign({}, state[data.key], getLocalStorage(data.key, 'json'), data.value);
    } else {
      currentObj = Object.assign({}, state[data.key], data.value);
    }
    state[data.key] = currentObj;
    setLocalStorage(data.key, currentObj);
  },
  [types.GET_COLUMN_WIDTH] (state, data) {
    const currentObj = getLocalStorage(data.key, 'json');
    if (currentObj) {
      state[data.key] = currentObj;
    }
  }
}
const actions = {
  login ({ commit }, data) {

  }
}
export default {
  state,
  mutations,
  actions
}
