import { getSesStorage, getLocalStorage } from '@/utils/storageUtil.js'

const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  language: state => state.app.language,
  getTableHeight: state => {
    return state.tableHeight.tableHeight
  },
  getTableHeightPage: state => {
    return state.tableHeight.tableHeightPage
  },
  getSlidebarHeight: state => {
    return state.tableHeight.slidebarHeight
  },
  getIframeHeight: state => {
    return state.tableHeight.iframeHeight
  },
  getCurrentTitle: state => {
    const status = getSesStorage("CURRENT_TITLE")
    if (status) {
      state.tagsView.currentTitle = status
    }
    return state.tagsView.currentTitle
  },
  getMenuList: state => {
    const status = getSesStorage("MENU_LIST")
    if (status) {
      state.slidebar.menuList = status
    }
    return state.slidebar.menuList
  },
  getNavList: state => {
    const status = getSesStorage("NAV_LIST", 'json')
    if (status) {
      state.slidebar.navList = status
    }
    return state.slidebar.navList
  },
  getCurrentId: state => {
    const status = getSesStorage("CURRENT_ID")
    if (status) {
      state.slidebar.currentId = status
    }
    return state.slidebar.currentId
  },
  getCompanyData: state => {
    const status = getLocalStorage("COMPANY_DATA")
    if (status) {
      state.user.companyData = status
    }
    return state.user.companyData
  },
  getDistrictIschange: state => {
    return state.user.districtIschage
  },
  getIsWealth: state => {
    return state.user.isWealth
  },
  getDistrictData: state => {
    const status = getLocalStorage("DISTRICT_DATA")
    if (status) {
      state.user.districtData = status
    }
    return state.user.districtData
  }
}
export default getters
