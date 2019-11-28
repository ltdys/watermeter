export default {
  common: {
    determine: '确定',
    cancel: '取消',
    operation: '操作',
    query: '查询',
    add: '添加',
    refresh: '刷新'
  },
  login: {
    title: '欢迎登录',
    code: '输入机构码',
    account: '输入机构帐号',
    password: '输入登录密码',
    freeLogin: '十天内免登录(公共场所慎用)',
    login: '登录',
    tip: '请检查登录信息是否正确！'
  },
  nav: {
    title: '海洋供水大数据分析平台',
    welcome: '欢迎您',
    home: '首页',
    systemManage: '系统管理',
    resourceManage: '组织管理',
    jurisdiction: '权限管理',
    roleManage: '角色管理',
    userManage: '用户管理',
    regionManage: '区域管理',
    systemLog: '系统日志',
    deviceManage: '设备管理',
    concentrator: '集中器管理',
    nbIotRegister: 'NO-IOT注册表',
    largeScale: '大表管理',
    fileManage: '档案管理',
    hbManage: '户表管理',
    import: '批量导入',
    meterReading: '抄表管理',
    lately: '最近抄表',
    nbIot: 'NBIOT抄表',
    manual: '手工抄表',
    timing: '定时抄表',
    alarm: '水表报警',
    record: '指令记录',
    dataManage: '数据管理',
    meterReadingRecord: '抄表记录',
    meterReadingException: '异常抄表',
    statisticalAnalysis: '统计分析'
  },
  chart: {
    deviceTotal: '设备总数',
    deviceOnline: '设备在线',
    alarmStatistics: '警告统计',
    deviceOffline: '设备离线',
    mapTitle: '水源分布情况',
    waterChartTitle: '当天用户用水统计分布',
    alarmChartTitle: '当天用户告警统计分布',
    installChartTitle: '当月水表安装数走势图'
  },
  systemManageResource: {
    addBtn: '添加组织',
    toolbarA: '所属分厂',
    toolbarA_: '请输入所属分厂',
    toolbarB: '片区代码',
    toolbarB_: '请输入片区代码',
    toolbarC: '片区名称',
    toolbarC_: '请输入片区名称',
    tableA: '所属分厂',
    tableB: '片区代码',
    tableC: '片区名称',
    tableD: '状态',
    tableE: '备注',
    dialogTitle: '添加组织',
    dialogA: '分组',
    dialogA_: '请选择分组',
    dialogB: '名称',
    dialogB_: '请填写名称',
    dialogC_: '请上传Logo',
    dialogD: '机构代码',
    dialogD_: '请填写机构代码'
  },
  systemManageJurisdiction: {
    toolbarA: '帐户',
    toolbarA_: '请输入帐户',
    toolbarB: '姓名',
    toolbarB_: '请输入姓名',
    tableA: '姓名',
    tableB: '帐户',
    tableC: '角色',
    roleSelection: '请选择角色',
    by: '为',
    assignAuthority: '分配权限',
    tip: '分配权限成功'
  },
  systemManageRole: {
    toolbarA: '所属分厂',
    toolbarA_: '请输入所属分厂',
    toolbarB: '权限级别',
    toolbarB_: '请输入权限级别',
    tableA: '登录名',
    tableB: '角色',
    tableC: '部门',
    tableD: '最后登录IP',
    tableE: '最后登录时间'
  },
  systemManageUser: {
    toolbarA: '所属分厂',
    toolbarA_: '请输入所属分厂',
    toolbarB: '权限级别',
    toolbarB_: '请输入权限级别',
    tableA: '用户名',
    tableB: '所属分厂',
    tableC: '用户权限',
    tableD: '权限类型',
    tableE: '创建时间'
  },
  systemManageRegion: {
    toolbarA: '所属分厂',
    toolbarA_: '请输入所属分厂',
    toolbarB: '机构代码',
    toolbarB_: '请输入机构代码',
    toolbarC: '片区名称',
    toolbarC_: '请输入片区名称',
    tableA: '区域名称',
    tableB: '区域ID',
    tableC: '父节点',
    tableD: '水司',
    operationA: '添加子区域',
    operationB: '清除该区域下的表和用户',
    dialogTitle: '添加区域',
    dialogA: '归属区域',
    dialogA_: '请选择',
    dialogA__: '请选择归属区域',
    dialogB: '区域名称',
    dialogB_: '请填写区域名称',
    dialogC: '区域地址',
    dialogC_: '请填写区域地址'
  },
  systemManageLog: {
    toolbarA: '日期范围',
    toolbarA_: '选择开始日期',
    toolbarB_: '选择结束日期',
    tableA: '操作菜单',
    tableB: '操作员',
    tableC: '水司',
    tableD: '操作IP',
    tableE: '浏览器',
    tableF: '操作时间',
    tableG: '备注'
  },
  deviceManageConcentrator: {
    toolbarA: '集中器名称',
    toolbarA_: '请输入集中器名称',
    toolbarB: '集中器编号',
    toolbarB_: '请输入集中器编号',
    toolbarC: '使用状态',
    tableA: '集中器名称',
    tableB: '集中器编号',
    tableC: '当前状态',
    tableD: '使用状态',
    tableE: '最后上线',
    tableF: '所属区域',
    tableG: '通迅规约',
    tableH: '水司',
    dialogTitle: '添加集中器',
    dialogA: '集中器名称',
    dialogA_: '请填写集中器名称',
    dialogB: '集中器编号',
    dialogB_: '请填写集中器编号',
    dialogC: '所属区域',
    dialogC_: '请选择所属区域',
    dialogD: '是否使用',
    currentTitle: '采集器管理'
  },
  deviceManageRegister: {
    toolbarA_: '请输入查询关键字',
    toolbarA: '查询条件',
    toolbarB: '导出Excel',
    toolbarC: '上传资料',
    toolbarD: '提交',
    toolbarE: '开阀',
    toolbarF: '关阀',
    toolbarG: '阀门摆动',
    tableA: '设备地址',
    tableB: '更新时间',
    tableC: '本次读数',
    tableD: '阀门状态',
    tableE: '设备类型',
    tableF: '绑定状态',
    tableG: '上报周期',
    tableH: '信号强度',
    tableI: '电池状态',
    tableJ: '软件版本号',
    tableK: '通迅状态',
    tableL: '创建时间',
    tableM: '阀控支持',
    dialogTitle: '数据添加',
    dialogA: '设备类型',
    dialogA_: '请选择设备类型',
    dialogB_: '请输入IMEI',
    dialogC: '倍率',
    dialogC_: '请输入倍率',
    dialogD: '阀控支持',
    dialogE: '运营商'
  },
  deviceManageLarge: {
    toolbarA: '导出EXCEL',
    toolbarB: '上传资料',
    toolbarC: '提交',
    tableA: '安装地址',
    tableB: '规格型号',
    tableC: '表编号',
    tableD: '口径',
    tableE: 'SIM卡CCID',
    tableF: '是否在线',
    tableG: '信号强度',
    tableH: '电池电量(mAh)',
    tableI: '电池电压',
    tableJ: '空管状态',
    tableK: '压力报警',
    tableL: '表状态'
  },
  fileManageHb: {
    toolbarA: '筛选查询',
    toolbarB: '用户添加',
    toolbarC: '表计添加',
    tableA: '用户编号',
    tableB: '用户名称',
    tableC: '地址',
    tableD: '电话',
    tableE: '表编号',
    tableF: '表地址',
    tableG: '通迅序号',
    tableH: '安装日期',
    tableI: '表读数',
    tableJ: '用量',
    tableK: '余额',
    tableL: '充值时间',
    tableM: '表类型',
    tableN: '阀门状态',
    tableO: '附加费类型',
    tableP: '收费类型',
    tableQ: '用量计算方式',
    tableR: '倍率',
    dialogUserTitle: '用户添加',
    dialogUserA: '所属区域',
    dialogUserA_: '请选择所属区域',
    dialogUserB: '用户编号',
    dialogUserB_: '请填写用户编号',
    dialogUserC: '用户名称',
    dialogUserC_: '请填写用户名称',
    dialogUserD: '电话',
    dialogUserE: '地址',
    dialogUserF: '邮编',
    dialogUserG: '备注',
    dialogUserH: '水司',
    dialogTableTitle: '表计添加',
    dialogTableA: '表类型',
    dialogTableA_: '请选择表类型',
    dialogTableB_: '请填写IMEI',
    dialogTableC: '表名称',
    dialogTableD: '表编号',
    dialogTableE: '表地址',
    dialogTableF: '通迅序号',
    dialogTableG: '是否带阀',
    dialogTableH: '用量计算方式',
    dialogTableI: '是否报警',
    dialogTableJ: '倍率',
    dialogTableK: '底数',
    dialogTableL: '最大值',
    dialogTableM: '用户编号',
    dialogTableN: '区域',
    dialogTableO: '是否绑定'
  },
  fileManageImportant: {
    toolbarA: '模板下载',
    toolbarA_: '用户水表导入模板',
    toolbarA__: 'NBIOT水表导入模板',
    toolbarB: '仪表类型',
    toolbarC: '文件路径',
    toolbarC_: '点击选择上传文件',
    toolbarC__: '支持上传JPG、PNG、XLS、WORD文件，且不超过500KB',
    toolbarD: '导入详情',
    toolbarE: '导入',
    infoTopTitle: '操作说明',
    infoTopA: '1.注意事项和故障排除;',
    infoTopB: '2.核心部分为操作说明;',
    infoTopC: '3.有的按逻辑顺序或操作的重要程序编排。顺序编排应结合实用。操作说明写作要求准确、具体、形象;',
    infoTopD: '4.使用者读起来清楚、易懂;',
    infoBottomTitle: '模板填写注意事项',
    infoBottomA: '1.又称"操作指南"是对技术环节具体操作指导的文件;是科技人员的某一技术工具书，常常编汇成小册子;',
    infoBottomB: '2.操作的项目不同，操作说明书内容和形式也和不相同;',
    infoBottomC: '3.有的以专项技术为内容，也有的以专门的仪器设备或技术为对象;',
    infoBottomD: '4.形式上有技术指导书、技术岗位手册、操作规程等;',
    infoBottomE: '5.一般的操作说明书格式如下：①引言、②操作原理、③设备用具说明、④操作说明;',
    infoBottomF: '6.⑤注意事项和故障排除、⑥附录。核心部分为操作说明，介绍每一操作的具体步骤和要求，有的按操作时间顺序;',
    infoBottomG: '7.编排，有的按逻辑顺序或操作的重要程序编排。顺序编排应结合实用。操作说明写作要求准确;',
    infoBottomH: '8.具体、形象、使用者读起来清楚、易懂。'
  },
  meterReadingLately: {
    toolbarA: '表类型',
    toolbarB: '通信状态',
    toolbarC: '导出EXCEL',
    toolbarD: '数据采集',
    toolbarE: '数据读取',
    toolbarF: '设备校时',
    toolbarG: '开阀',
    toolbarH: '关阀',
    toolbarI: '阀门摆动',
    toolbarJ: '集中器设置',
    tableA: '用户编号',
    tableB: '用户名称',
    tableC: '用户地址',
    tableD: '表编号',
    tableE: '表地址',
    tableF: '用量',
    tableG: '当前读数',
    tableH: '更新时间',
    tableI: '上次读数',
    tableJ: '上次时间',
    tableK: '通信状态',
    tableL: '表状态',
    tableM: '表类型',
    tableN: '集中器地址',
    tableO: '采集器地址',
    tableP: '阀门状态'
  },
  meterReadingNbiot: {
    toolbarA: '表类型',
    toolbarB: '通信状态',
    toolbarC: '导出EXCEL',
    toolbarD: '开阀',
    toolbarE: '关阀',
    toolbarF: '阀门摆动',
    toolbarG: '上报周期',
    toolbarH: '设置表地址',
    tableA: '用户编号',
    tableB: '用户名称',
    tableC: '用户地址',
    tableD: '表编号',
    tableE: '表地址',
    tableF: '用量',
    tableG: '当前读数',
    tableH: '更新时间',
    tableI: '上次读数',
    tableJ: '上次时间',
    tableK: '上报周期',
    tableL: '开关状态',
    tableM: '信号强度',
    tableN: '电池强度',
    tableO: '版本',
    tableP: '阀门状态'
  },
  meterReadingManual: {
    toolbarA: '批量导入抄表记录',
    toolbarB: '下载模板',
    toolbarC: '选取文件',
    toolbarD: '上传到服务器',
    toolbarE: '只能上传jpg/png文件，且不超过500kb'
  },
  meterReadingTiming: {
    toolbarA: '定时方案添加',
    tableA: '记录ID',
    tableB: '定时抄表名称',
    tableC: '集中器地址',
    tableD: '采集器地址',
    tableE: '表地址',
    tableF: '操作类型',
    tableG: '间隔',
    tableH: '定时类型',
    tableI: '开始时间',
    dialogTitle: '定时方案添加',
    dialogA: '定时方案名称',
    dialogA_: '请填写定时方案名称',
    dialogB: '集中器地址',
    dialogB_: '请填写集中器地址',
    dialogC: '采集器地址',
    dialogC_: '请填写采集器地址',
    dialogD: '表地址',
    dialogD_: '请填写表地址',
    dialogE: '操纵类型',
    dialogE_: '请选择操纵类型',
    dialogF: '间隔',
    dialogF_: '请填写间隔',
    dialogG: '定时类型',
    dialogG_: '请选择定时类型',
    dialogH: '开始时间',
    dialogH_: '选择开始时间'
  },
  meterReadingAlarm: {
    toolbarA: '筛选查询',
    toolbarB: '表类型',
    toolbarC: '设置',
    tableA: '用户编号',
    tableB: '用户名称',
    tableC: '表号',
    tableD: '表类型',
    tableE: '当前读数',
    tableF: '上次读数',
    tableG: '用量',
    tableH: '是否告警',
    tableI: '告警类型',
    tableJ: '告警上限',
    tableK: '告警上限',
    tableL: '附加费类型'
  },
  meterReadingRecord: {
    tableA: '申请ID',
    tableB: '表编号',
    tableC: '集中器地址',
    tableD: '采集器地址',
    tableE: '表地址',
    tableF: '控制说明',
    tableG: '控制类型',
    tableH: '申请时间',
    tableI: '控制时间'
  },
  dataManageReading: {
    toolbarA: '常规',
    toolbarB: '开始时间',
    toolbarB_: '选择开始时间',
    toolbarC: '结束时间',
    toolbarC_: '选择结束时间',
    toolbarD: '切换NB',
    tableA: '用户编号',
    tableB: '小区',
    tableC: '楼栋',
    tableD: '单元',
    tableE: '门牌号',
    tableF: '水表类型',
    tableG: '表编号',
    tableH: '表钢印号',
    tableI: '用量',
    tableJ: '表读数',
    tableK: '抄表状态',
    tableL: '抄表时间',
    tableM: '计量单位'
  },
  dataManageException: {
    toolbarA: '开始时间',
    toolbarA_: '选择开始时间',
    toolbarB: '结束时间',
    toolbarB_: '选择结束时间',
    toolbarRadioA: '未抄水表',
    toolbarRadioB: '月用水量小于等于0',
    toolbarRadioC: '用水量小于月均量',
    tableA: '用户区域',
    tableB: '地址',
    tableC: '节点编号',
    tableD: '表编号',
    tableE: '用量(m^3)',
    tableF: '用户编号',
    tableG: '用户名称',
    tableH: '身份证号/机构代码'
  },
  dataManageAnalysis: {
    toolbarA: '按年度统计',
    toolbarB: '按季度统计',
    toolbarC: '按月度统计',
    toolbarD: '请选择查看年份',
    toolbarD_: '选择日期',
    chartTitleA: '抄表用水',
    chartTitleB: '抄表损耗'
  }
}
