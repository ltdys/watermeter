import mock from './mock';

import {
  meterReading,
  exception
} from './data/dataManage';

let _meterReading = meterReading
let _exception = exception

// 获取抄表记录（分页）
mock.onPost('/dataManage/getMeterReading').reply(config => {
  let {
    page,
    rows
  } = JSON.parse(config.data);
  let mockStock = _meterReading

  let allTotal = mockStock.length;
  mockStock = mockStock.filter((u, index) => index < rows * page && index >= rows * (page - 1));
  return new Promise((resolve, reject) => {
    resolve([200, {
      allTotal: allTotal,
      data: mockStock
    }]);
  });
});

// 获取异常抄表（分页）
mock.onPost('/dataManage/getException').reply(config => {
  let {
    page,
    rows
  } = JSON.parse(config.data);
  let mockStock = _exception

  let allTotal = mockStock.length;
  mockStock = mockStock.filter((u, index) => index < rows * page && index >= rows * (page - 1));
  return new Promise((resolve, reject) => {
    resolve([200, {
      allTotal: allTotal,
      data: mockStock
    }]);
  });
});