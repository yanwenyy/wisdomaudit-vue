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
export default {
  data() {
    return {
      openurl:'',
      dqtoken: "",
    };
  },
  created(){
   this.gettapylist()
    
    
  },
  mounted() {
   

   
  },
  methods: {
       gettapylist () {
      let p = this.$route.query.id
      getSignature(p).then((result) => {
        if (result.code == 0 && result.data.url !== null) {
          getdataAuditApi(result.data.token).then((res) => {
            if (res.status == 'success') {
              this.openurl='http://10.19.206.196:8088/WebReport/decision/view/form?viewlet=vendor/zhuowang/Form18.frm&ref_t=design&ref_c=d6740dbd-0279-40d0-b361-3cc1adb80d35'
            }
          });


        }
      }).catch(err => {
        
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

