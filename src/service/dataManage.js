import axios from 'axios'

// 抄表记录
export const getMeterReading = params => axios.post('/dataManage/getMeterReading', params);

// 异常抄表
export const getException = params => axios.post('/dataManage/getException', params);