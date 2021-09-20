import request from '@/utils/request'

const baseURL = 'sdmobile'
// 问题分页
export function listByPage(data) {
  return request({
    baseURL: baseURL,
    url: `/problem/pageList`,
    method: 'post',
    data
  })
}

// 问题明细分页
export function detailListByPage(data) {
  return request({
    baseURL: baseURL,
    url: `/problemDetail/pageList`,
    method: 'post',
    data
  })
}

// 根据id查找
export function getById(id) {
  return request({
    baseURL: baseURL,
    url: `/project/getById/${id}`,
    method: 'get'
  })
}
// 添加问题
export function save(data) {
  return request({
    baseURL: baseURL,
    url: `/problem/save`,
    method: 'post',
    data
  })
}

// 添加问题明细
export function detailSave(data) {
  return request({
    baseURL: baseURL,
    url: `/problemDetail/save`,
    method: 'post',
    data
  })
}
// 删除对象
export function del(ids) {
  return request({
    baseURL: baseURL,
    url: `/problem/delete/${ids}`,
    method: 'delete'
  })
}
// 修改对象
export function update(data) {
  return request({
    baseURL: baseURL,
    url: `/problem/update`,
    method: 'put',
    data
  })
}

// 根据id查找
export function getAuditedTree() {
  return request({
    baseURL: baseURL,
    url: `/auditedOrg/getAuditedTree`,
    method: 'get'
  })
}

// 获取项目所有项目信息
export function projectList(data) {
  return request({
    baseURL: baseURL,
    url: `/project/pageList`,
    method: 'post',
    data
  })
}

// 查询项目列表
export function getProjectList() {
  return request({
    baseURL: baseURL,
    url: `/project/getList`,
    method: 'get'
  })
}

// 获取当前项目人员信息
export function personList(id) {
  return request({
    baseURL: baseURL,
    url: `/projectMember/getByProjectId/${id}`,
    method: 'get'
  })
}

// 根据id查找
export function getProjectById(id) {
  return request({
    baseURL: baseURL,
    url: `/project/getById/${id}`,
    method: 'get'
  })
}

//问题分类缓存数据tree化处理
export function toTreeData(data,id,pid,name,headUuid) {

  //debugger
// 建立个树形结构,需要定义个最顶层的父节点headUuid
  let parent = [];
  //判断缓存数据顶级节点是否存在
  if (data[0].dataSortValue !== null){
    let obj = {
      label: data[0].dataSortName,
      id: data[0].dataSortValue,
      children: []
    }
    parent.push(obj)
  }else {
  for (let i = 0; i < data.length; i++) {
    if(data[i][pid] !== headUuid){
    }else{
      let obj = {
        label: data[i][name],
        id: data[i][id],
        children: []
      };
      parent.push(obj);//数组追加数组值
    }
    // console.log(obj);
    //  console.log(parent,"bnm");
    }
  }

  children(parent);

// 调用子节点方法,参数为父节点的数组
  function children(parent) {
    //console.log(parent)
    if (data.length !== 0) {
      for (let i = 0; i < parent.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (parent[i].id === data[j][pid]){
            let obj = {
              label: data[j][name],
              id: data[j][id],
              children: []
            };
            parent[i].children.push(obj);
          }
        }
        children(parent[i].children);
      }
    }
  }
  //console.log(parent,"jwTest")
  return parent;
}
