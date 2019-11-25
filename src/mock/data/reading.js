import {
  Random
} from 'mockjs';
import { random } from 'node-forge';

const lately = []; // 最近抄表
const reading = []; // 定时方案
const alarm = [];  // 水表报警
const record = [];  // 指令纪录

for (let i = 0; i < 66; i++) {
  lately.push({
    id: Random.guid(),
    name: Random.cname(),
    address: Random.county(),
    phone: '13611112222',
    tableId: '1810000',
    tableAddress: Random.county(),
    IMEI: '12345789123456',
    communication: '无',
    installTime: Random.date() + ' ' + Random.time(),
    readNum: Random.float(0, 100),
    useNum: Random.float(0, 100),
    balance: Random.float(0, 100),
    rechargeTime: Random.date() + ' ' + Random.time(),
    tableType: '水表',
    valveStatus: '无阀',
    surchargeType: '--',
    chargeType: '--',
    calculation: '不用计量',
    magnification: Random.float(0, 10)  
  })
}

for (let i = 0; i < 66; i++) {
  reading.push({
    id: Random.guid(),
    name: Random.cname(),
    concentratorAddress: Random.county(),
    collectorAddress: Random.county(),
    tableAddress: Random.county(),
    operationType: '读取数据',
    interval: Random.integer(1, 100),
    timeTpe: '小时',
    beginTime: Random.date() + ' ' + Random.time()
  })
}

for (let i = 0; i < 66; i++) {
  alarm.push({
    id: Random.guid(),
    name: Random.cname(),
    tableId: Random.guid(),
    tableType: 'NB-IOT表',
    IMEI: '--',
    currentNum: Random.integer(0, 1000),
    lastNum: Random.integer(0, 1000),
    useNum: Random.float(0, 1000),
    isAlarm: '是',
    alarmType: '告警',
    alarmToplimit: Random.integer(1000, 10000),
    alarmBottomlimit: Random.integer(0, 100),
    surchargeType: '--'
  })
}

for (let i = 0; i < 66; i++) {
  record.push({
    id: Random.guid(),
    recordId: Random.guid(),
    tableId: Random.guid(),
    address: Random.county(),
    controlInfo: '远程请求',
    controlType: '数据读取',
    time: Random.date() + ' ' + Random.time()
  })
}

export {
  lately,
  reading,
  alarm,
  record
}