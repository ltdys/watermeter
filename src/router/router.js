import Vue from 'vue'
import VueRouter from 'vue-router'
const routes = [
  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/views/home/layout.vue'),
    children: [{
      path: '/system-manage/jurisdiction', // 权限管理
      name: 'jurisdiction',
      component: r => require(['@/views/system-manage/jurisdiction/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/system-manage/user-manage', // 用户管理
      name: 'userManage',
      component: r => require(['@/views/system-manage/user-manage/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/system-manage/role-manage', // 角色管理
      name: 'roleManage',
      component: r => require(['@/views/system-manage/role-manage/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/system-manage/resource-manage', // 组织管理
      name: 'resourceManage',
      component: r => require(['@/views/system-manage/resource-manage/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/system-manage/region', // 区域管理
      name: 'region',
      component: r => require(['@/views/system-manage/region/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/system-manage/system-log', // 系统日志
      name: 'systemLog',
      component: r => require(['@/views/system-manage/system-log/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/system-manage/system-wealth', // 资源管理
      name: 'systemWealth',
      component: r => require(['@/views/system-manage/wealth-manage/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/device-manage/concentrator', // 集中器管理
      name: 'concentrator',
      component: r => require(['@/views/device-manage/concentrator/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/device-manage/collector', // 采集器管理
      name: 'collector',
      component: r => require(['@/views/device-manage/collector/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/device-manage/nb-iot-register', // NB-IOT注册表
      name: 'nbIotRegister',
      component: r => require(['@/views/device-manage/nb-iot-register/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/device-manage/large-scale', // 大表管理
      name: 'largeScale',
      component: r => require(['@/views/device-manage/large-scale/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/file-manage/hb-manage', // 户表管理
      name: 'hbManage',
      component: r => require(['@/views/file-manage/hb-manage/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/file-manage/import', // 批量导出
      name: 'import',
      component: r => require(['@/views/file-manage/import/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/file-manage/user-watertype', // 用户水型管理
      name: 'userWatertype',
      component: r => require(['@/views/file-manage/user-watertype/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/file-manage/user-quality', // 用水性质管理
      name: 'userQuality',
      component: r => require(['@/views/file-manage/user-quality/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/meter-reading/lately', // 最近抄表
      name: 'lately',
      component: r => require(['@/views/meter-reading/lately/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/meter-reading/nb-iot', // NBIOT抄表
      name: 'nbIot',
      component: r => require(['@/views/meter-reading/nb-iot/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/meter-reading/manual', // 手工抄表
      name: 'manual',
      component: r => require(['@/views/meter-reading/manual/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/meter-reading/timing', // 定时抄表
      name: 'timing',
      component: r => require(['@/views/meter-reading/timing/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/meter-reading/alarm', // 水表报警
      name: 'alarm',
      component: r => require(['@/views/meter-reading/alarm/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/meter-reading/record', // 指令纪录
      name: 'record',
      component: r => require(['@/views/meter-reading/record/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/data-manage/meter-reading', // 抄表记录
      name: 'meterReading',
      component: r => require(['@/views/data-manage/meter-reading/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/data-manage/meter-reading-exception', // 异常抄表
      name: 'meterReadingException',
      component: r => require(['@/views/data-manage/meter-reading-exception/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/data-manage/statistical-analysis', // 统计分析
      name: 'statisticalAnalysis',
      component: r => require(['@/views/data-manage/statistical-analysis/index.vue'], r),
      meta: {
        requireAuth: true
      }
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/err/404.vue')
  },
  {
    path: '/50X',
    component: () => import('@/views/err/50X.vue')
  },
  {
    path: '*',
    redirect: '/404'
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/chart.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/chart',
    name: 'chart',
    component: () => import('@/views/home/chart.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  }
]

Vue.use(VueRouter)

export default new VueRouter({
  routes
})
