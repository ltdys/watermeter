/**
 * 此文件为公共js方法文件
 * wgs 2019.06.05
 */

/* 把对象转化为formData表单格式 */
export const formUtil = (obj) => {
  const formData = new FormData()
  if (Object.keys(obj).length === 0) { return formData }
  for (const key in obj) {
    formData.append(key, obj[key])
  }
  return formData
}

/* 将数据格式转换成树状格式*/
export const treeData = (data) => {
  let result = data.reduce(function (prev, item) {
    item._parentId = item._parentId === null ? 0 : item._parentId;
    prev[item._parentId] ? prev[item._parentId].push(item) : prev[item._parentId] = [item];
    return prev;
  }, {});
  for (const prop in result) {
    result[prop].forEach(function (item, i) {
      result[item.id] ? item.children = result[item.id] : ''
    });
  }
  result = result[0];
  return JSON.stringify(result)
}

/* 递归删除children为[]的属性 */
export const recursionDelete = (list) => {
  list.forEach(function (item, index) {
    if (item.children.length === 0) {
      delete item.children
    } else {
      recursionDelete(item.children)
    }
  })
  return list
}

/* 资源管理模块 --  将数据格式转换成树状格式*/
export const wealthTreeData = (data) => {
  let result = data.reduce(function (prev, item) {
    item.parent = item.parent === null ? 0 : item.parent;
    prev[item.parent] ? prev[item.parent].push(item) : prev[item.parent] = [item];
    return prev;
  }, {});
  for (const prop in result) {
    result[prop].forEach(function (item, i) {
      result[item.id] ? item.children = result[item.id] : ''
    });
  }
  result = result[0];
  return JSON.stringify(result)
}

/* 组织管理模块 --  将数据格式转换成树状格式*/
export const orgTreeData = (data) => {
  if(data.length === 1) {
    return JSON.stringify(data) 
  }
  let result = data.reduce(function (prev, item) {
    item.parentId = item.parentId === null ? 0 : item.parentId;
    prev[item.parentId] ? prev[item.parentId].push(item) : prev[item.parentId] = [item];
    return prev;
  }, {});
  for (const prop in result) {
    result[prop].forEach(function (item, i) {
      result[item.id] ? item.children = result[item.id] : ''
    });
  }
  result = result[0];
  return JSON.stringify(result)
}

// 公用
export const treeDataUtil = (data, parent, id) => {
  let result = data.reduce(function (prev, item) {
    item[parent] = item[parent] === null ? 0 : item[parent];
    prev[item[parent]] ? prev[item[parent]].push(item) : prev[item[parent]] = [item];
    return prev;
  }, {});
  for (const prop in result) {
    result[prop].forEach(function (item, i) {
      result[item[id]] ? item.children = result[item[id]] : ''
    });
  }
  result = result[0];
  return JSON.stringify(result)
}

/* 将数据格式转换成树状格式*/
export const treeDataTest = (data) => {
  let result = data.reduce(function (prev, item) {
    item.companyId = item.companyId === null ? 0 : item.companyId;
    prev[item.companyId] ? prev[item.companyId].push(item) : prev[item.companyId] = [item];
    return prev;
  }, {});
  for (const prop in result) {
    result[prop].forEach(function (item, i) {
      result[item.id] ? item.children = result[item.id] : ''
    });
  }
  result = result[0];
  return JSON.stringify(result)
}

// 递归删除，只保留两层children
export const saveTwo = (data) => {
  return data
}
