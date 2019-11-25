import * as types from '../types.js'
import { setSesStorage, setLocalStorage } from '@/utils/storageUtil.js'
const state = {
  isLogin: false,
  companyData: []  // 组织
}

const mutations = {
  [types.GET_CURRENT_HEAD] (state, data) {

  },
  'SET_COMPANY_DATA' (state, boo) {
    setLocalStorage("COMPANY_DATA", boo)
    state.companyData = boo
  },
}
const actions = {
  login ({ commit }, data) {

  },
  setCompanyData ({ commit }, boo) {
    commit(types.SET_COMPANY_DATA, boo)
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
