import Vue from 'vue'

const clientHeight = document.documentElement.clientHeight
const tableHeightPage = clientHeight - 290 + 30
const tableHeight = clientHeight - 202 + 15
// 无分页
Vue.prototype.TABLE_HEIGHT = tableHeight
// 有分页
Vue.prototype.TABLE_HEIGHT_PAGE = tableHeightPage
