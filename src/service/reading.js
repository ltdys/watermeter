import axios from 'axios'

// 获取最近抄表
export const getLately = params => axios.post('/reading/getLately', params);

// 获取定时方案
export const getReading = params => axios.post('/reading/getReading', params);

// 获取水表报警
export const getAlarm = params => axios.post('/reading/getAlarm', params);

// 获取指令纪录
export const getRecord = params => axios.post('/reading/getRecord', params);