import axios from 'axios'

// 获取集中器
export const getHouseTable = params => axios.post('/file/getHouseTable', params);