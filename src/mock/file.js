import mock from './mock';

import {
  houseTable
} from './data/file';

let _houseTable = houseTable

// 获取户表(分页)
mock.onPost('/file/getHouseTable').reply(config => {
  let {
    page,
    rows
  } = JSON.parse(config.data);
  let mockStock = _houseTable

  let allTotal = mockStock.length;
  mockStock = mockStock.filter((u, index) => index < rows * page && index >= rows * (page - 1));
  return new Promise((resolve, reject) => {
    resolve([200, {
      allTotal: allTotal,
      data: mockStock
    }]);
  });
});