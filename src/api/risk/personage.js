import request from '@/utils/request'

const baseURL = '/wisdomaudit'


export function  getTabList (data) {
  return request({
    baseURL: baseURL,
    url:  `/dataAuditApi/getTabList?${data}`,
    method: 'get',
  })
}


export function  getTypes (data) {
  return request({
    baseURL: baseURL,
    url:  `/dataAuditApi/getTypes?${data}`,
    method: 'get',
  })
}


export function  getSignature (data) {
  return request({
    baseURL: baseURL,
    url:  `/dataAuditApi/getSignature?userName=${data}`,
    method: 'get',
  })
}

// export function  getdataAuditApi (date) {
//   return request({
//     url:  'http://10.19.206.196:8088/WebReport/decision/third/auth/cross/login',
//     method: 'get',
//     data:{third_token:date}
//   })
// }


export function getdataAuditApi (Thirdtoken) {
  let request =''
  var url = "http://10.19.206.196:8088/WebReport/decision/third/auth/cross/login";
 return  $.ajax({
          url: url,
          dataType: "jsonp",
          data:{third_token:Thirdtoken},
          success: function (res) {
                
                  if (res.errorCode) {
                    console.log('帆软认证接口调用失败',res);
                  } else {
                    console.log('帆软认证接口调用成功',res);
                     request =res

                  
                  }
          },
          error: function () {
                  alert("超时或服务器其他错误");// 登录失败（超时或服务器其他错误）
          }
  });



}

