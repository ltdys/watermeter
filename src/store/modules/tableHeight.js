// 表格列表宽度配置
import * as types from '../types.js'
const clientHeight = document.documentElement.clientHeight
const tableHeightPage = clientHeight - 102 - 50 - 70 - 20
const tableHeight = clientHeight - 102 - 50 - 20
const slidebarHeight = clientHeight - 60 - 20
const iframeHeight = clientHeight - 102 - 20

const state = {
  tableHeight: tableHeight,
  tableHeightPage: tableHeightPage,
  slidebarHeight: slidebarHeight,
  iframeHeight: iframeHeight
}

const actions = {
  setTableHeight ({ commit }, boo) {
    commit(types.SET_TABLE_HEIGHT, boo)
  },
  setTableHeightPage ({ commit }, boo) {
    commit(types.SET_TABLE_HEIGHT_PAGE, boo)
  },
  setSlidebarHeight ({ commit }, boo) {
    commit(types.SET_SLIDEBAR_HEIGHT, boo)
  },
  setIframeHeight ({ commit }, boo) {
    commit(types.SET_IFRAME_HEIGHT, boo)
  }
}

const mutations = {
  'SET_TABLE_HEIGHT' (state, boo) {
    state.tableHeight = boo
  },
  'SET_TABLE_HEIGHT_PAGE' (state, boo) {
    state.tableHeightPage = boo
  },
  'SET_SLIDEBAR_HEIGHT' (state, boo) {
    state.slidebarHeight = boo
  },
  'SET_IFRAME_HEIGHT' (state, boo) {
    state.iframeHeight = boo
  }
}

export default {
  state,
  mutations,
  actions
}
