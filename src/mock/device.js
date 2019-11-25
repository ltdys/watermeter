import mock from './mock';

import {
  concentrator,
  collector,
  nbIotRegister,
  largeScale
} from './data/device';

let _concentrator = concentrator
let _collector = collector
let _nbIotRegister = nbIotRegister
let _largeScale = largeScale

// 获取集中器（分页）
mock.onPost('/device/getConcentrator').reply(config => {
  let {
    page,
    rows
  } = JSON.parse(config.data);
  let mockStock = _concentrator

  let allTotal = mockStock.length;
  mockStock = mockStock.filter((u, index) => index < rows * page && index >= rows * (page - 1));
  return new Promise((resolve, reject) => {
    resolve([200, {
      allTotal: allTotal,
      data: mockStock
    }]);
  });
});

// 获取采集器(分页)
mock.onPost('/device/getCollector').reply(config => {
  let {
    page,
    rows
  } = JSON.parse(config.data);
  let mockStock = _collector

  let allTotal = mockStock.length;
  mockStock = mockStock.filter((u, index) => index < rows * page && index >= rows * (page - 1));
  return new Promise((resolve, reject) => {
    resolve([200, {
      allTotal: allTotal,
      data: mockStock
    }]);
  });
});

//获取nb-iot表(分页)
mock.onPost('/device/getNbIotRegister').reply(config => {
  let {
    page,
    rows
  } = JSON.parse(config.data);
  let mockStock = _nbIotRegister

  let allTotal = mockStock.length;
  mockStock = mockStock.filter((u, index) => index < rows * page && index >= rows * (page - 1));
  return new Promise((resolve, reject) => {
    resolve([200, {
      allTotal: allTotal,
      data: mockStock
    }]);
  });
});

//获取大表(分页)
mock.onPost('/device/getLargeScale').reply(config => {
  let {
    page,
    rows
  } = JSON.parse(config.data);
  let mockStock = _largeScale

  let allTotal = mockStock.length;
  mockStock = mockStock.filter((u, index) => index < rows * page && index >= rows * (page - 1));
  return new Promise((resolve, reject) => {
    resolve([200, {
      allTotal: allTotal,
      data: mockStock
    }]);
  });
});