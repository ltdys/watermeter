import {
  Random
} from 'mockjs';
import { random } from 'node-forge';

const meterReading = []; // 抄表记录
const exception = [];  // 异常抄表

for (let i = 0; i < 66; i++) {
  meterReading.push({
    id: Random.guid(),
    village: '通州花园',
    floor: '1号',
    unit: Random.integer(1, 100),
    plateNum: Random.integer(1, 500),
    meterType: 'LXY型DN15',
    num: Random.integer(1, 100),
    readingStatus: '正常',
    time: Random.date() + ' ' + Random.time()
  })
}

for (let i = 0; i < 66; i++) {
  exception.push({
    id: Random.guid(),
    region: Random.county(),
    address: Random.county(),
    num: Random.integer(1, 100),
    name: Random.cname(),
    card: '431103111139510000'
  })
}

export {
  meterReading,
  exception
}