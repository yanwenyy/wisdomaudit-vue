<template>
  <div class="auditeehome">
    <div class="ahtitle">
      <span class="blue"><i class="el-icon-message-solid"></i></span>我的任务
    </div>
    <el-main v-loading="ahloading">
      <div v-for="(item, index) in modellist" :key="'auditeehome' + index">
        <el-card shadow="hover">
          <div class="ahmaintop">
            <span class="ahmaintop-title">{{ item.projectName|| "--" }}</span>
            <span class="ahmaintop-type" :class="item.toTaskName.indexOf('待修改') != -1?'ahmaintop-type3':item.toTaskName.indexOf('待提交') != -1?'ahmaintop-type2':'ahmaintop-type1'">{{ item.toTaskType}}</span>
            <div class="ahmaintop-time">{{ timefilter(item.createTime || "") }}</div>
          </div>
          <div class="ahmainbottom">
            {{ item.toTaskName|| "--"}}
            <div class="ahmainbottom-button">
              <el-button type="primary" size="mini" @click="taskModelEvent('2-2', item.projectId, item)">去处理</el-button>
            </div>
          </div>
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
    taskModelEvent(data, projectId, obj) {
      if (obj.ext1 == "审计任务") {
        this.$router.push({
          path: "/audit/auditItems/projectWorkbench",
          query: { index: "2-2", projectId: projectId },
        });
      } else if (obj.ext1 == "审计项目") {
        if (obj.toTaskType == "新的整改任务") {
          this.$router.push({
            path: "/audit/auditItems/application",
            query: { projectId: projectId },
          });
        } else if (obj.toTaskType == "项目待初始化") {
          this.$router.push({
            path: "/audit/auditItems/projectWorkbench",
          });
        }
      } else if (obj.ext1 == "审计资料任务") {
        if (obj.toTaskType == "资料任务待发起") {
          this.$router.push({
            path: "/audit/auditItems/projectWorkbench",
            query: { index: "2-1", projectId: projectId },
          });
        } else if (obj.toTaskType == "资料待提交") {
          this.$router.push({
            path: "/audit/auditItems/feedback",
            query: { projectId: projectId },
          });
        } else if (obj.toTaskType == "资料待审核") {
          this.$router.push({
            path: "/audit/auditItems/projectWorkbench",
            query: { index: "2-1", projectId: projectId },
          });
        } else if (obj.toTaskType == "资料待修改") {
          this.$router.push({
            path: "/audit/auditItems/feedback",
            query: { projectId: projectId },
          });
        }
      } else if (obj.ext1 == "整改计划") {
        if (obj.toTaskType == "整改计划待下发") {
          this.$router.push({
            path: "/auditCorrective/rectificationPlan",
            query: { projectId: projectId },
          });
        } else if (obj.toTaskType == "整改计划待提交") {
          this.$router.push({
            path: "/auditCorrective/rectificationPlan_audited",
            query: { projectId: projectId },
          });
        } else if (obj.toTaskType == "整改计划待审核") {
          this.$router.push({
            path: "/auditCorrective/rectificationPlan",
            query: { projectId: projectId },
          });
        } else if (obj.toTaskType == "整改计划待修改") {
          this.$router.push({
            path: "/auditCorrective/rectificationPlan_audited",
            query: { projectId: projectId },
          });
        }
      } else if (obj.ext1 == "整改措施") {
        if (obj.toTaskType == "整改措施待提交") {
          this.$router.push({
            path: "/auditCorrective/rectificationMeasuresInterface",
            query: { projectId: projectId },
          });
        } else if (obj.toTaskType == "整改措施待审批") {
          this.$router.push({
            path: "/auditCorrective/rectificationMeasuresLeader",
            query: { projectId: projectId },
          });
        } else if (obj.toTaskType == "整改措施待修改" || obj.toTaskType == "整改措施待修改(整改跟进人)") {
          this.$router.push({
            path: "/auditCorrective/rectificationMeasuresInterface",
            query: { projectId: projectId },
          });
        } else if (obj.toTaskType == "整改措施待审核") {
          this.$router.push({
            path: "/auditCorrective/rectificationMeasures",
            query: { projectId: projectId },
          });
        }
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
    height: 30px;
    .ahmaintop-title{
      font-weight: bold;
    }
    .ahmaintop-type{
      padding: 0 5px;
      margin-left: 10px;
    }
    .ahmaintop-type1{
      border: 1px solid #A5DDFF;
      color:#2997FF;
      background-color:#E6F7FF;
    }
    .ahmaintop-type2{
      border: 1px solid #FFDDA8;
      color:#FA962B;
      background-color:#FFF7E6;
    }
    .ahmaintop-type3{
      border: 1px solid #FFB8B5;
      color:#F6343E;
      background-color:#FFF1F0;
    }
    .ahmaintop-time{
      float: right;
    }
  }
  .ahmainbottom {
    .ahmainbottom-button{
      float: right;
    }
  }
}
</style>