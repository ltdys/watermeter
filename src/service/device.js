import axios from 'axios'

// 获取集中器
export const getConcentrator = params => axios.post('/device/getConcentrator', params);

// 获取采集器
export const getCollector = params => axios.post('/device/getCollector', params)

// 获取nb-iot注册表
export const getNbIotRegister = params => axios.post('/device/getNbIotRegister', params)

// 获取大表
export const getLargeScale = params => axios.post('/device/getLargeScale', params)