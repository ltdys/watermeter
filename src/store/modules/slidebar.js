import { setSesStorage } from '@/utils/storageUtil.js'
import i18n from '@/lang'

// 菜单栏配置
const state = {
  menuList: [], // 导航数据(左侧)
  isChange: false, // 资源是否变化
  // 导航数据（头部）
  navList: [{
    name: i18n.t('nav.home'),
    value: 'index',
    url: '/chart',
    isCheck: true,
    level: 1,
    children: []
  }, {
    name: i18n.t('nav.systemManage'),
    value: 'accountManage',
    url: '/system-manage/resource-manage',
    isCheck: false,
    icon: "",
    level: 2,
    children: [{
      id: "2-1",
      name: i18n.t('nav.resourceManage'),
      icon: "el-icon-reading",
      url: "/system-manage/resource-manage",
      level: 21
    }, {
      id: "2-2",
      name: i18n.t('nav.jurisdiction'),
      icon: "el-icon-lock",
      url: "/system-manage/jurisdiction",
      level: 22
    }, {
      id: "2-3",
      name: i18n.t('nav.roleManage'),
      icon: "el-icon-postcard",
      url: "/system-manage/role-manage",
      level: 23
    }, {
      id: "2-4",
      name: i18n.t('nav.userManage'),
      icon: "el-icon-lock",
      url: "/system-manage/user-manage",
      level: 24
    }, {
      id: "2-5",
      name: i18n.t('nav.regionManage'),
      icon: "el-icon-menu",
      url: "/system-manage/region",
      level: 25
    }, {
      id: "2-6",
      name: i18n.t('nav.systemLog'),
      icon: "el-icon-chat-dot-square",
      url: "/system-manage/system-log",
      level: 26
    }, {
      id: "2-7",
      name: '资源管理',
      icon: "el-icon-menu",
      url: "/system-manage/system-wealth",
      level: 27
    }]
  }, {
    name: i18n.t('nav.deviceManage'),
    value: 'deviceManage',
    url: '/device-manage/concentrator',
    isCheck: false,
    icon: "",
    level: 3,
    children: [{
      id: "3-1",
      name: i18n.t('nav.concentrator'),
      icon: "el-icon-menu",
      url: "/device-manage/concentrator",
      level: 31
    }, {
      id: "3-2",
      name: i18n.t('nav.nbIotRegister'),
      icon: "el-icon-menu",
      url: "/device-manage/nb-iot-register",
      level: 32
    }, {
      id: "3-3",
      name: i18n.t('nav.largeScale'),
      icon: "el-icon-menu",
      url: "/device-manage/large-scale",
      level: 33
    }]
  }, {
    name: i18n.t('nav.fileManage'),
    value: 'fileManage',
    url: '/file-manage/hb-manage',
    isCheck: false,
    icon: "",
    level: 4,
    children: [{
      id: "4-1",
      name: i18n.t('nav.hbManage'),
      icon: "el-icon-menu",
      url: "/file-manage/hb-manage",
      level: 41
    }, {
      id: "4-2",
      name: i18n.t('nav.import'),
      icon: "el-icon-menu",
      url: "/file-manage/import",
      level: 42
    }, {
      id: "4-3",
      name: "用户水型",
      icon: "el-icon-menu",
      url: "/file-manage/user-watertype",
      level: 43
    }, {
      id: "4-4",
      name: "用水性质",
      icon: "el-icon-menu",
      url: "/file-manage/user-quality",
      level: 44
    }]
  }, {
    name: i18n.t('nav.meterReading'),
    value: 'meterReading',
    url: '/meter-reading/lately',
    isCheck: false,
    icon: "",
    level: 5,
    children: [{
      id: "5-1",
      name: i18n.t('nav.lately'),
      icon: "el-icon-menu",
      url: "/meter-reading/lately",
      level: 51
    },
    // {
    //   id: "5-2",
    //   name: i18n.t('nav.nbIot'),
    //   icon: "el-icon-menu",
    //   url: "/meter-reading/nb-iot",
    //   level: 52
    // }
    {
      id: "5-3",
      name: i18n.t('nav.manual'),
      icon: "el-icon-menu",
      url: "/meter-reading/manual",
      level: 53
    }, {
      id: "5-4",
      name: i18n.t('nav.timing'),
      icon: "el-icon-menu",
      url: "/meter-reading/timing",
      level: 54
    }, {
      id: "5-5",
      name: i18n.t('nav.alarm'),
      icon: "el-icon-menu",
      url: "/meter-reading/alarm",
      level: 55
    }, {
      id: "5-6",
      name: i18n.t('nav.record'),
      icon: "el-icon-menu",
      url: "/meter-reading/record",
      level: 56
    }]
  }, {
    name: i18n.t('nav.dataManage'),
    value: 'dataManage',
    url: '/data-manage/meter-reading',
    isCheck: false,
    icon: "",
    level: 6,
    children: [{
      id: "6-1",
      name: i18n.t('nav.meterReadingRecord'),
      icon: "el-icon-menu",
      url: "/data-manage/meter-reading",
      level: 61
    }, {
      id: "6-2",
      name: i18n.t('nav.meterReadingException'),
      icon: "el-icon-menu",
      url: "/data-manage/meter-reading-exception",
      level: 62
    }, {
      id: "6-3",
      name: i18n.t('nav.statisticalAnalysis'),
      icon: "el-icon-menu",
      url: "/data-manage/statistical-analysis",
      level: 63
    }]
  }]
}

const actions = {
  setIsChange ({ commit }, boo) {
    commit('SET_IS_CHANGE', boo)
  },
  setMenuList ({ commit }, boo) {
    setSesStorage("MENU_LIST", boo)
    commit('SET_MENU_LIST', boo)
  },
  setNavList ({ commit }, boo) {
    setSesStorage("NAV_LIST", boo)
    commit('SET_NAV_LIST', boo)
  }
}

const mutations = {
  'SET_IS_CHANGE' (state, boo) {
    state.isChange = boo
  },
  'SET_MENU_LIST' (state, boo) {
    state.menuList = boo
  },
  'SET_NAV_LIST' (state, boo) {
    state.navList = boo
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
