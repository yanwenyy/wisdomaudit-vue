<template>
  <div>
   <img :src="imgUrl" alt="" />
    <router-link :to="newUrl "> </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: require("@/assets/styles/image/Auditoverview.png"),
    };
  },
  mounted(){
 let newUrl = this.$router.resolve({
          path: "/Newpage"
        });
window.open(newUrl.href, "_blank");
  },
  methods:{
   
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

