import {
  Random
} from 'mockjs';

const houseTable = []; // 户表

for (let i = 0; i < 66; i++) {
  houseTable.push({
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

export {
  houseTable
}