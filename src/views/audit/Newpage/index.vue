<template>
  <div style="width:100vw;height:100vh;">
 <iframe :src="openurl" frameborder="0"  width="100%"
                height="100%"></iframe>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      openurl:''
    };
  },
  created(){
    this.shortcutEvent()
    
    
  },
  mounted() {

   
  },
  methods: {
       shortcutEvent() {
         console.log('我调用了');
        axios({
          url:
            `/wisdomaudit/dataAuditApi/getSignature?userName=` +
            this.$store.state.user.datauserid,
          headers: {
            TOKEN: this.dqtoken,
          },
          method: "get",
          data: {},
        }).then((res) => {
          if (res.data.code == 0) {
            let reptoken = res.data.data.token;
            let url =
              "http://10.19.206.196:8088/WebReport/decision/third/auth/cross/login";
            $.ajax({
              url: url,
              dataType: "jsonp",
              data: { third_token: reptoken },
              success: function (res2) {
                if (res2.errorCode) {
                  console.log("帆软认证接口调用失败");
                } else {
                  console.log("帆软认证接口调用成功");
                  // window.open(item.url);
                  
                  this.openurl='http://10.19.206.196:8088/WebReport/decision/view/form?viewlet=vendor/zhuowang/Form18.frm&ref_t=design&ref_c=d6740dbd-0279-40d0-b361-3cc1adb80d35'
                  return;
                }
              },
              error: function () {
                alert("超时或服务器其他错误"); // 登录失败（超时或服务器其他错误）
                return;
              },
            });
          } else {
            return;
          }
        });
      
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

