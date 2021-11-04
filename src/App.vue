<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Bus from '@WISDOMAUDIT/utils/bus';
import Watermark from '@WISDOMAUDIT/utils/watermark.js'
import { get_userInfo } from "@SDMOBILE/api/shandong/ls";
export default {
  name: 'App',
  mounted(){
   
      //获取当前登录人信息
    get_userInfo().then((resp) => {
      this.userInfo = resp.data;
        let time =  this.transformTimestamp(this.userInfo.user.lastLoginTime);
     
      console.log(this.userInfo);
       // 水印
      Watermark.set(this.userInfo.user.realName,this.userInfo.user.mobile,time)
    });
    
 },
 methods:{
    transformTimestamp(timestamp){
          let a = new Date(timestamp).getTime();
          const date = new Date(a);
          const Y = date.getFullYear() + '-';
          const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
          const D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + '  ';
          const h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
          const m = (date.getMinutes() <10 ? '0'+date.getMinutes() : date.getMinutes()) ;
          // const s = date.getSeconds(); // 秒
          const dateString = Y + M + D + h + m;
          // console.log('dateString', dateString); // > dateString 2021-07-06 14:23
          return dateString;
      },
 }
}
</script>
<style>

@import url('assets/styles/css/index.css');
.el-loading-mask{
  z-index: 1998;
}
.el-button--text{
  border: none !important;
  background-color: transparent !important;
}
</style>
