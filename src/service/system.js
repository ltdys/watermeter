import axios from 'axios'

// 获取组织
export const getResourceManage = params => axios.post('/system/getResourceManage', params);

// 获取用户
export const getUser = params => axios.post('/system/getUser', params);

// 获取角色
export const getRole = params => axios.post('/system/getRole', params);

// 获取权限
export const getJurisdiction = params => axios.post('/system/getJurisdiction', params)

// 获取系统日志
export const getLog = params => axios.post('/system/getLog', params)

// 获取区域
export const getRegion = params => axios.post('/system/getRegion', params)
