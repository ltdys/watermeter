import {
  Random
} from 'mockjs';
import { random } from 'node-forge';

const concentrator= []; // 集中器
const collector = []; // 采集器
const nbIotRegister = []; // nb-iot注册表
const largeScale = [];  // 大表管理

for (let i = 0; i < 66; i++) {
  concentrator.push({
    id: Random.guid(),
    name: Random.cname(),
    address: Random.county(),
    currentStatus: '未上线',
    useStatus: '使用',
    lastSeen: Random.date() + " " + Random.time(),
    region: '江西省新余水务集团',
    communication: '--',
    waterDivision: 'admin'
  })
}

for (let i = 0; i < 108; i++) {
  collector.push({
    id: Random.guid(),
    concentratorId: Random.guid(),
    collectorId: Random.guid(),
    useStatus: '使用',
    readType: '未知',
    currentStatus: '不在线',
    readTime: Random.date() + " " + Random.time(),
    useRemark: '--'
  })
}

for (let i = 0; i < 66; i++) {
  nbIotRegister.push({
    id: Random.guid(),
    address: Random.county(),
    updateTime: Random.date() + " " + Random.time(),
    readNum: Random.integer(1, 100),
    valveStatus: '无阀',
    deviceType: 'NB-IOT表',
    IMEI: '--',
    bindingStatus: '已绑定',
    cycle: Random.integer(1, 10000),
    signalIntensity: Random.integer(1, 1000),
    batteryStatus: '正常',
    version: '1.0',
    communicationStatus: '正常',
    createTime: Random.date() + ' ' + Random.time(),
    support: '不支持'  
  })
}

for (let i = 0; i < 66; i++) {
  largeScale.push({
    id: Random.guid(),
    address: Random.county(),
    model: 'M',
    tableNumber: Random.integer(1, 100),
    caliber: Random.float(1, 50),
    SIMCCID: '--',
    isOnline: '在线',
    signalIntensity: Random.integer(1, 100),
    batteryLevel: Random.integer(1, 100),
    batteryVoltage: Random.integer(1, 100),
    atcStatus: '正常',
    pressureAlarm: '--',
    tableStatus: '正常'
  })
}

export {
  concentrator,
  collector,
  nbIotRegister,
  largeScale
}