<template>
  <div style="width:100vw;height:100vh;">
 <iframe :src="openurl" frameborder="0"  width="100%"
                height="100%"></iframe>
  </div>
</template>

<script>
import {
  getTabList,
  getTypes,
  getSignature,
  getdataAuditApi,
} from "@SDMOBILE/api/risk/personage";
import Watermark from '@WISDOMAUDIT/utils/watermark.js'
import { get_userInfo } from "@SDMOBILE/api/shandong/ls";
export default {
  data() {
    return {
      openurl:'',
      dqtoken: "",
    };
  },
  created(){
    
    
    
  },
  mounted() {
        //获取当前登录人信息
    get_userInfo().then((resp) => {
      this.userInfo = resp.data;
        let time =  this.transformTimestamp(this.userInfo.user.lastLoginTime);
       // 水印
      Watermark.set(this.userInfo.user.realName,this.userInfo.user.mobile,time)
    });
   this.gettapylist()
   

   
  },
  methods: {
       gettapylist () {
      let p = this.$route.query.id
      console.log(p,'用户名');
      getSignature(p).then((result) => {
        if (result.code == 0 && result.data.url !== null) {
          getdataAuditApi(result.data.token).then((res) => {
            if (res.status == 'success') {
              this.openurl='http://10.19.206.196:8088/WebReport/decision/view/form?viewlet=vendor/zhuowang/Form18.frm&ref_t=design&ref_c=d6740dbd-0279-40d0-b361-3cc1adb80d35'
            }
          });


        }
      }).catch(err => {
        console.log(err);
        
      });
    },
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

  },
};
</script>

<style scoped>
img {
  width: 100%;
}
.signout {
  position: absolute;
  z-index: 999;
  right: 20px;
  color: #fff;
  top: 10px;
}
</style>

