import mock from './mock';
import {
  resourceManage,
  userManage,
  roles,
  jurisdiction,
  log,
  region
} from './data/system';

let _resourceManage = resourceManage
let _userManage = userManage
let _roles = roles
let _jurisdiction = jurisdiction
let _log = log
let _region = region


// 获取组织（不分页）
// mock.onPost('/system/getResourceManage').reply(config => {
//   let mockStock = _resourceManage
//   return new Promise((resolve, reject) => {
//     resolve([200, {
//       data: mockStock
//     }]);
//   });
// });

// 获取组织（分页）
mock.onPost('/system/getResourceManage').reply(config => {
  let {
    page,
    rows
  } = JSON.parse(config.data);
  let mockStock = _resourceManage

  let allTotal = mockStock.length;
  mockStock = mockStock.filter((u, index) => index < rows * page && index >= rows * (page - 1));
  return new Promise((resolve, reject) => {
    resolve([200, {
      allTotal: allTotal,
      data: mockStock
    }]);
  });
});

// 获取用户（分页）
mock.onPost('/system/getUser').reply(config => {
  let {
    page,
    rows
  } = JSON.parse(config.data);
  let mockStock = _userManage

  let allTotal = mockStock.length;
  mockStock = mockStock.filter((u, index) => index < rows * page && index >= rows * (page - 1));
  return new Promise((resolve, reject) => {
    resolve([200, {
      allTotal: allTotal,
      data: mockStock
    }]);
  });
});

// 获取角色（分页）
mock.onPost('/system/getRole').reply(config => {
  let {
    page,
    rows
  } = JSON.parse(config.data);
  let mockStock = _roles

  let allTotal = mockStock.length;
  mockStock = mockStock.filter((u, index) => index < rows * page && index >= rows * (page - 1));
  return new Promise((resolve, reject) => {
    resolve([200, {
      allTotal: allTotal,
      data: mockStock
    }]);
  });
});

// 获取权限（不分页）
mock.onPost('/system/getJurisdiction').reply(config => {
  let mockStock = _jurisdiction
  return new Promise((resolve, reject) => {
    resolve([200, {
      data: mockStock
    }]);
  });
});

// 获取系统日志(分页)
mock.onPost('/system/getLog').reply(config => {
  let {
    page,
    rows
  } = JSON.parse(config.data);
  let mockStock = _log
  let allTotal = mockStock.length;
  mockStock = mockStock.filter((u, index) => index < rows * page && index >= rows * (page - 1));
  return new Promise((resolve, reject) => {
    resolve([200, {
      allTotal: allTotal,
      data: mockStock
    }]);
  });
});

// 获取区域（分页）
mock.onPost('/system/getRegion').reply(config => {
  let {
    page,
    rows
  } = JSON.parse(config.data);
  let mockStock = _region

  let allTotal = mockStock.length;
  mockStock = mockStock.filter((u, index) => index < rows * page && index >= rows * (page - 1));
  return new Promise((resolve, reject) => {
    resolve([200, {
      allTotal: allTotal,
      data: mockStock
    }]);
  });
});

