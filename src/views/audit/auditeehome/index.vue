<template>
  <div class="auditeehome">
    <div class="ahtitle">
      <span class="blue"><i class="el-icon-message-solid"></i></span>我的任务
    </div>
    <el-main v-loading="ahloading">
      <div v-for="(item, index) in modellist" :key="'auditeehome' + index">
        <el-card shadow="hover">
          <div class="ahmaintop">
            {{ item.projectName || "--" }}
            <span>{{ timefilter(item.createTime || "") }}</span>
          </div>
          <div class="ahmainbottom"></div>
        </el-card>
        <div class="bottomplaceholderbox"></div>
      </div>
    </el-main>
  </div>
</template>
<script>
import moment from "moment";
import axios from "axios";
export default {
  data() {
    return {
      modellist: [],
      ahloading: false,
      dqtoken: "",
    };
  },
  mounted() {
    this.dqtoken = sessionStorage.getItem("TOKEN");
    if (this.dqtoken) {
      this.getmodellist();
    } else {
      window.reload();
    }
  },
  methods: {
    getmodellist() {
      this.ahloading = true;
      axios({
        url: `/wisdomaudit/homePage/homeToList`,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "post",
      }).then((res) => {
        this.ahloading = false;
        this.modellist = res.data.data || "";
        console.log(this.modellist);
      });
    },
    timefilter(time) {
      let pattern = "YYYY-MM-DD HH:mm:ss";
      if (time) {
        return moment(time).format(pattern);
      } else {
        return "";
      }
    },
  },
};
</script>
<style  lang="scss" scoped>
.auditeehome {
  height: 100%;
  overflow: auto;
  .ahtitle {
    padding: 20px 20px 0 20px;
    font-size: 16px;
    font-weight: bold;
  }
  .blue {
    color: #439bd8;
    padding-right: 10px;
  }
  .bottomplaceholderbox {
    height: 20px;
    width: 100%;
  }
  .ahmaintop {
  }
  .ahmainbottom {
  }
}
</style>