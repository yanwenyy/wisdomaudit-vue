import request from '@/utils/request'
import $ from "jquery"
const analysisUrl = '/analysis'
const baseURL = '/wisdomaudit_son'


/**
 * 获取所有母版参数集合以及模型用到的参数集合
 */
export function findParamsAndModelRelParams () {
  return request({
    baseURL: analysisUrl,
    url: '/paramController/findParamsAndModelRelParams',
    method: 'post'
  })
}
/**
 * 执行当前参数SQL语句
 * @param {*} data   SQL语句
 */
export function executeParamSql (sql) {
  return request({
    baseURL: analysisUrl,
    url: '/paramController/executeParamSql',
    method: 'post',
    async: false,
    params: { sql: sql }
  })
}
/**
 * 查询下拉树参数SQL的结果集
 * @param {*} sqlValue sql语句
 */
export function getSelectTreeData (sqlValue) {
  const data = {
    sqlValue: sqlValue
  }
  return request({
    baseURL: analysisUrl,
    url: '/paramController/getSelectTreeData',
    method: 'post',
    data
  })
}

export function recplaceParams (sql, paramArr) {
  let result;
  let url = analysisUrl + '/paramController/replaceModelSqlByParamsOne'
  const data = {
    sql: sql,
    paramArr: paramArr
  }
  $.ajax({
    type: "post",
    url: url,
    dataType: "json",
    data: data,
    async: false,
    success: function (res) {
      result = res
    },
    error: function (res) {

    }
  });
  return result;
}

/**
 * 移除js或css
 * @param filename 要移除的文件名
 * @param filetype 文件类型
 */
export function removeJcCssfile (filename, filetype) {
  var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none"
  var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none"
  var allsuspects = document.getElementsByTagName(targetelement)
  for (var i = allsuspects.length; i >= 0; i--) {
    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
      allsuspects[i].parentNode.removeChild(allsuspects[i])
  }
}

/**
 * 动态添加Js文件
 * @param src 路径
 * @param id 添加的id
 */
export function addJsFile (src, id) {
  if (!document.getElementById(id)) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.id = id;
    document.body.appendChild(script);
  }
}


