import {
  Random
} from 'mockjs';
import { longStackSupport } from 'q';


const resourceManage= []; // 组织
const userManage = []; // 用户
const roles = []; // 角色
const jurisdiction = [];  // 权限
const log = []; // 系统日志
const region = [];  // 区域

resourceManage.push({
  name: '江西省水务集团',
  areaCode: 'DA01923CF01212',
  areaName: '南通片区',
  status: '有效',
  remark: '哈中工了'
}, {
  name: '广东省水务集团',
  areaCode: 'DA01923CF01212',
  areaName: '西丽片区',
  status: '有效',
  remark: '哈中工了'
}, {
  name: '贵州省水务集团',
  areaCode: 'DA01923CF01212',
  areaName: '贵阳片区',
  status: '无效',
  remark: '在右国'
})

for (let i = 0; i < 30; i++) {
  resourceManage.push({
    name: '广东省水务集团',
    areaCode: 'DA01923CF01212',
    areaName: Random.cname(),
    status: '王下',
    remark: '--'
  });
}

for (let i = 0; i < 66; i++) {
  userManage.push({
    id: Random.guid(),
    name: Random.cname(),
    branch: '江西省新余水务集团',
    jurisdiction: '修改和更改信息',
    jurisdictionType: '管理员',
    time: Random.date()
  })
}

roles.push({
  name: Random.cname(),
  account: '123456',
  role: '管理员',
  time: Random.date(),
  lastLoginIp: '116.77.33.175' 
}, {
  name: Random.cname(),
  account: '111111',
  role: '超级管理员',
  time: Random.date(),
  lastLoginIp: '116.77.33.175'
})

jurisdiction.push({
  text: '系统管理',
  id: 1,
  children: [{
    text: '组织管理',
    id: 2,
  }, {
    text: '权限管理',
    id: 3
  }]
}, {
  text: '设备管理',
  id: 4,
  children: [{
    text: '集中管理器',
    id: 5
  }, {
    text: '大表管理',
    id: 6
  }]
})

for (let i = 0; i < 86; i++) {
  log.push({
    menu: '设备管理-抄表管理-显示',
    operator: 'admin',
    waterDevision: 'admin',
    operatorIP: '192.168.1.1',
    browser: 'chrome',
    time: Random.date() + Random.time(),
    remark: '--'
  })
}

region.push({
  id: 1,
  regionName: '测试区域',
  regionId: '90',
  parentId: 1,
  navy: '大水师A',
  children: [{
    id: 11,
    regionName: '测试区域-子级1',
    regionId: '91',
    parentId: 1,
    navy: '大水师A-1',
    children: [{
      id: 111,
      regionName: '测试区域-子级1-子级1',
      regionId: '911',
      parentId: 11,
      navy: '大水师A-1',
    }]
  }, {
    id: 12,
    regionName: '测试区域-子级2',
    regionId: '92',
    parentId: 1,
    navy: '大水师A-1'
  }]
}, {
  id: 2,
  regionName: '广东测试区域',
  regionId: '100',
  parentId: 2,
  navy: '广东水师A',
  children: [{
    id: 21,
    regionName: '广东测试区域-子级1',
    regionId: '101',
    parentId: 2,
    navy: '广东水师A'
  }]
})

export {
  resourceManage,
  userManage,
  roles,
  jurisdiction,
  log,
  region
}

