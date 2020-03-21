import axios from '@/utils/request.js'
import { formUtil } from '@/utils/publicUtil'

// 组织管理
// 组织添加
export const addCompany = params => axios.post('/watermeter/addCompany', params);

// 组织编辑
export const updateCompany = params => axios.post('/watermeter/updateCompany', params);

// 组织查询
export const findCompany = params => axios.post('/watermeter/findCompany', params);

// 一级组织查询
export const findParentCompany = params => axios.post('/watermeter/findParentCompany', params)

// 二级组织查询
export const findChildCompany = params => axios.post('/watermeter/findChildCompany', params)

// 组织删除
export const deleteCompany = params => axios.post('/watermeter/deleteCompany', params);

// 用户管理
// 用户登录
export const login = params => axios.post('/watermeter/login', params);

// 添加用户
export const addUser = params => axios.post('/watermeter/addUser', params);

// 用户添加角色
export const userAddRole = params => axios.post('/watermeter/userAddRole', params);

// 用户查询
export const getUserDetailed = params => axios.post('/watermeter/getUserDetailed', params);

// 用户编辑
export const updateUser = params => axios.post('/watermeter/updateUser', params);

// 用户删除
export const deleteUser = params => axios.post('/watermeter/deleteUser', params);

// 角色管理
// 角色添加
export const addRole = params => axios.post('/watermeter/addRole', params);

// 角色编辑
export const updRole = params => axios.post('/watermeter/updRole', params);

// 角色查询
export const getRoleList = params => axios.post('/watermeter/getRoleList', params);

// 根据角色查询资源
export const getRoleResource = params => axios.post('/watermeter/getRoleResource', params);

// 角色授权
export const roleAuthorization = params => axios.post('/watermeter/roleAuthorization', params);

// 角色删除
export const delRole = params => axios.post('/watermeter/delRole', params);

// 区域管理
// 区域查询
export const findDistrict = params => axios.post('/watermeter/findDistrict', params);

// 区域添加
export const addDistrict = params => axios.post('/watermeter/addDistrict', params);

// 区域编辑
export const updateDistrict = params => axios.post('/watermeter/updateDistrict', params);

// 区域删除
export const deleteDistrict = params => axios.post('/watermeter/deleteDistrict', params);

// 区域删除 用户和表
export const deleteMeterUserAndMeterNbIot = params => axios.post('/watermeter/deleteMeterUserAndMeterNbIot', params);

// 设备管理
// 获取集中器列表
export const getMeterConcentratorList = params => axios.post('/watermeter/getMeterConcentratorList', params);

// 集中器查询
export const findMeterConcentrator = params => axios.post('/watermeter/findMeterConcentrator', params);

// 集中器添加
export const addMeterConcentrator = params => axios.post('/watermeter/addMeterConcentrator', params);

// 集中器编辑
export const updateMeterConcentrator = params => axios.post('/watermeter/updateMeterConcentrator', params);

// 集中器删除
export const deleteMeterConcentrator = params => axios.post('/watermeter/deleteMeterConcentrator', params);

// 采集器查询
export const getMeterNodes = params => axios.post('/watermeter/getMeterNodes', params);

// 采集器添加
export const addMeterNode = params => axios.post('/watermeter/addMeterNode', params);

// 采集器编辑
export const updateMeterNode = params => axios.post('/watermeter/updateMeterNode', params);

// 采集器删除
export const deleteMeterNode = params => axios.post('/watermeter/deleteMeterNode', params);

// nb-iot注册表
// 水表查询
export const getMeterNbIotL = params => axios.post('/watermeter/getMeterNbIotL', params);

// 水表添加
export const addMeterNbIot = params => axios.post('/watermeter/addMeterNbIot', params);

// 水表编辑
export const updateMeterNbIot = params => axios.post('/watermeter/updateMeterNbIot', params);

// 水表删除
export const deleteMeterNbIot = params => axios.post('/watermeter/deleteMeterNbIot', params);

// 大表管理
// 大表查询
export const getMeterBigList = params => axios.post('/watermeter/getMeterBigList', params);

// 大表添加
export const addMeterBig = params => axios.post('/watermeter/addMeterBig', params);

// 大表编辑
export const updateMeterBig = params => axios.post('/watermeter/updateMeterBig', params);

// 大表删除
export const deleteMeterBig = params => axios.post('/watermeter/deleteMeterBig', params);

// 用户水型
// 用户水型添加
export const addWaterHouseTypes = params => axios.post('/watermeter/addWaterHouseTypes', params);

// 用户水型查询
export const findWaterHouseTypes = params => axios.post('/watermeter/findWaterHouseTypes', params);

// 用户水型编辑
export const updateWaterHouseTypes = params => axios.post('/watermeter/updateWaterHouseTypes', params);

// 用户水型删除
export const deleteWaterHouseTypes = params => axios.post('/watermeter/deleteWaterHouseTypes', params);

// 用水性质
// 用水性质添加
export const addWaterNatures = params => axios.post('/watermeter/addWaterNatures', params);

// 用水性质查询
export const findWaterNatures = params => axios.post('/watermeter/findWaterNatures', params);

// 用水性质编辑
export const updateWaterNatures = params => axios.post('/watermeter/updateWaterNatures', params);

// 用水性质删除
export const deleteWaterNatures = params => axios.post('/watermeter/deleteWaterNatures', params);

// 抄表管理
// 最近抄表查询
export const recentMeterReading = params => axios.post('/watermeter/recentMeterReading', params);

// 档案管理
// 户表管理-添加用户
export const addMeterUser = params => axios.post('/watermeter/addMeterUser', params);

// 户表管理-编辑用户
export const updateMeterUser = params => axios.post('/watermeter/updateMeterUser', params);

// 户表管理-删除用户
export const deleteMeterUser = params => axios.post('/watermeter/deleteMeterUser', params);

// 户表查询
export const getMeterUserAndMeterNbIot = params => axios.post('/watermeter/getMeterUserAndMeterNbIot', params);

// 菜单资源添加
export const addResource = params => axios.post('watermeter/addResource', params)

// 菜单资源删除
export const delResource = params => axios.post('watermeter/delResource', params)

// 菜单资源修改
export const updResource = params => axios.post('watermeter/updResource', params)

// 菜单资源查询
export const getUserResource = params => axios.post('watermeter/getUserResource', params)

// 菜单资源全部查询
export const getAllResource = params => axios.post('watermeter/getAllResource', params)

// 组织机构小区树结构
export const getTreeAreas = params => axios.post('/watermeter/getTreeAreas', params)

// 首页  数据查询
export const countMeterNbIotL = params => axios.post('/watermeter/countMeterNbIotL', params)

// 户表导入, 上传excel
export const uploadUserAndMeter = params => axios.post('/watermeter/uploadUserAndMeter', formUtil(params))

// 操作指令接口
export const operInstruct = params => axios.post('/watermeter/operInstruct', params)

// 指令查询接口
export const findInstructLog = params => axios.post('/watermeter/findInstructLog', params)

// 子区域查询
export const findChildDistrict = params => axios.post('/watermeter/findChildDistrict', params)

// 系统日志查询
export const findSysLogInfo = params => axios.post('/watermeter/findSysLogInfo', params)

// 手工抄表（上传excel）
export const uploadMeterRead = params => axios.post('/watermeter/uploadMeterRead', formUtil(params))

// 上传logo
export const logoUpload = params => axios.post('/watermeter/logoUpload', formUtil(params))

// 水表管理excel导出
export const meterNbIotLDownLoad = params => axios.post('/watermeter/meterNbIotLDownLoad', params)

// 按月统计水表用量
export const waterAnalysisByMonth = params => axios.post('/watermeter/waterAnalysisByMonth', params)

// 统计抄表失败
export const meterIsNotOnline = params => axios.post('/watermeter/meterIsNotOnline', params)

// 统计抄表安装
export const meterIsInstall = params => axios.post('/watermeter/meterIsInstall', params)

// 大表管理excel导出
export const meterBigDownLoad = params => axios.post('/watermeter/meterBigDownLoad', params)

// 地图显示
export const showDistrictInMap = params => axios.post('/watermeter/showDistrictInMap', params)

// 统计分析
export const meterReadAnalysisByYearQuarterMonth = params => axios.post('/watermeter/meterReadAnalysisByYearQuarterMonth', params)

// 水表报警
export const getMeterNbIotAlarm = params => axios.post('/watermeter/getMeterNbIotAlarm', params)

// 水表ALL报警
export const getMeterNbIotAllAlarm = params => axios.post('/watermeter/getMeterNbIotAllAlarm', params)

// 抄表记录
export const getMeterRecord = params => axios.post('/watermeter/getMeterRecord', params)

// 抄表导出
export const recentMeterDownLoad = params => axios.post('/watermeter/recentMeterDownLoad', params)

// 定时抄表添加
export const addGatherTimer = params => axios.post('/watermeter/addGatherTimer', params)

// 定时抄表查询
export const findGatherTimer = params => axios.post('/watermeter/findGatherTimer', params)

// 定时抄表修改
export const updateGatherTimer = params => axios.post('/watermeter/updateGatherTimer', params)

// 定时抄表删除
export const delGatherTimer = params => axios.post('/watermeter/delGatherTimer', params)

// 同步读数到收费系统 
export const synchronizeMeterData = params => axios.post('/watermeter/synchronizeMeterData', params)

// 个人用水量统计
export const meterUserAnalysisMeterRead = params => axios.post('/watermeter/meterUserAnalysisMeterRead', params)
