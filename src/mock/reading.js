import mock from './mock';

import {
  lately,
  reading,
  alarm,
  record
} from './data/reading';

let _lately = lately
let _reading = reading
let _alarm = alarm
let _record = record

// 获取最近抄表(分页)
mock.onPost('/reading/getLately').reply(config => {
  let {
    page,
    rows
  } = JSON.parse(config.data);
  let mockStock = _lately

  let allTotal = mockStock.length;
  mockStock = mockStock.filter((u, index) => index < rows * page && index >= rows * (page - 1));
  return new Promise((resolve, reject) => {
    resolve([200, {
      allTotal: allTotal,
      data: mockStock
    }]);
  });
});

// 获取定时方案(分页)
mock.onPost('/reading/getReading').reply(config => {
  let {
    page,
    rows
  } = JSON.parse(config.data);
  let mockStock = _reading

  let allTotal = mockStock.length;
  mockStock = mockStock.filter((u, index) => index < rows * page && index >= rows * (page - 1));
  return new Promise((resolve, reject) => {
    resolve([200, {
      allTotal: allTotal,
      data: mockStock
    }]);
  });
});

// 获取水表报警(分页)
mock.onPost('/reading/getAlarm').reply(config => {
  let {
    page,
    rows
  } = JSON.parse(config.data);
  let mockStock = _alarm

  let allTotal = mockStock.length;
  mockStock = mockStock.filter((u, index) => index < rows * page && index >= rows * (page - 1));
  return new Promise((resolve, reject) => {
    resolve([200, {
      allTotal: allTotal,
      data: mockStock
    }]);
  });
});

// 获取指令纪录(分页)
mock.onPost('/reading/getRecord').reply(config => {
  let {
    page,
    rows
  } = JSON.parse(config.data);
  let mockStock = _record

  let allTotal = mockStock.length;
  mockStock = mockStock.filter((u, index) => index < rows * page && index >= rows * (page - 1));
  return new Promise((resolve, reject) => {
    resolve([200, {
      allTotal: allTotal,
      data: mockStock
    }]);
  });
});