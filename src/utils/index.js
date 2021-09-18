/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/*
* 获取系统字典信息
* 1.数据维护：
*   需要在AMSBASE.AB_DICT中维护数据，参照示例“性别”
* 2.调用方式（以第一个为例）
*  import { getDictList } from '@/utils'
*  getDictList('001001').then(data => {
        console.log(data)
   });
  3. 实现细节
  采用懒加载的方式，第一次调用getDict的时候将远程数据库字典信息加载到sessionStorage，
  当字典信息变更的时候，需要重新打开浏览器才能加载最新的字典信息
* */
export function getDictList(code) {
  var sysDict = JSON.parse(sessionStorage.getItem('sysDict'))
  var parent = sysDict.filter(obj => { return obj.dataSortValue === code })
  if (parent.length === 0) {
    return parent
  } else {
    return sysDict.filter(obj => { return obj.dataSortUuid === parent[0].dataSortUuid })
  }
}
// 根据codeValue的得到所有下级节点的方法
export function getDictSonList(code) {
  var sysDict = JSON.parse(sessionStorage.getItem('sysDict'))
  var parent = sysDict.filter(obj => { return obj.codeValue === code })
  if (parent.length === 0) {
    return parent
  } else {
    return sysDict.filter(obj => { return obj.parentCodeUuid === parent[0].codeUuid })
  }
}

export function getOneDict(code) {
  var sysDict = JSON.parse(sessionStorage.getItem('sysDict'))
  return sysDict.filter(obj => { return obj.codeValue === code })
}

export function getArrLength(arr) {
  if (arr === undefined || arr <= 0) {
    return 0
  } else {
    return arr.length
  }
}
