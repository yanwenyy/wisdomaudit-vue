<template>
  <div class="audithome">
    <!-- <el-button @click="openVault">金库认证测试</el-button> -->
    <Vault
      :vaultV="vaultV"
      :sceneId="sceneId"
      :approvers="approvers"
      :maxTime="maxTime"
      :dqtime="dqtime"
      :account="account"
      :appSessionId="appSessionId"
      @changevault="changevault"
      @vdownload="vdownload"
    ></Vault>
    <div class="filter-container">
      <el-card class="box-card" v-loading="floading1">
        <div slot="header" class="clearfix">
          <span>
            <svg-icon icon-class="edit" class="homepage-icon" /> 审计项目</span
          >
          <el-button
            style="float: right; padding: 0; color: #439bd8; font-size: 18px"
            type="text"
            @click="goWorkbench()"
            >···</el-button
          >
        </div>

        <div class="project-wapper homeheight1" style="height: 178px">
          <div v-if="projectlist.length == 0" class="homeheight1">
            <div class="homeemptyicon">
              <svg-icon icon-class="home-empty" className="homeempty" />
            </div>
            <div class="homeemptytext">暂无数据</div>
          </div>
          <div
            class="project-item"
            v-for="(item, index) in projectlist"
            :key="'project' + index"
            :style="index == 0 ? '' : 'border-left:1px solid #ccc;'"
            v-else
          >
            <el-tooltip
              class="item"
              effect="light"
              :content="item.projectName"
              placement="top"
            >
              <div class="homepagetitle">
                {{ item.projectName || "--" }}
              </div>
            </el-tooltip>

            <ul>
              <li>
                <div
                  class="icon-wapper pointer"
                  @click="projectEvent('1', item.projectId)"
                >
                  <svg-icon icon-class="fmodel" />
                  <br />
                  <span>模型任务 {{ item.mxCount }}</span>
                </div>
              </li>
              <li>
                <div
                  class="icon-wapper pointer"
                  @click="projectEvent('2', item.projectId)"
                >
                  <svg-icon icon-class="ftrask" /><br />
                  <span>自建任务 {{ item.zjCount }}</span>
                </div>
              </li>
              <li>
                <div
                  class="icon-wapper pointer"
                  @click="projectEvent('3', item.projectId)"
                >
                  <svg-icon icon-class="fproblem" /><br />
                  <span>问题 {{ item.wtCount }}</span>
                </div>
              </li>
              <li>
                <div
                  class="icon-wapper pointer"
                  @click="projectEvent('4', item.projectId)"
                >
                  <svg-icon icon-class="fconfirm" /><br />
                  <span>审计确认单 {{ item.qrdCount }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-card>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="14">
          <el-card class="body-padding" v-loading="floading2">
            <div slot="header" class="clearfix">
              <span>
                <svg-icon
                  icon-class="task"
                  class="homepage-icon"
                />我的任务</span
              >
            </div>
            <div v-if="modellist.length == 0" class="homeheight3">
              <div class="homeemptyicon">
                <svg-icon icon-class="home-empty" className="homeempty" />
              </div>
              <div class="homeemptytext">暂无内容，稍后再来</div>
            </div>
            <ul class="homeheight3 odd-even" v-else>
              <li v-for="(item, index) in modellist" :key="'model' + index">
                <div class="li-item">
                  <h5
                    @click="taskModelEvent('2-2', item.projectId, item)"
                    class="pointer"
                  >
                    {{ item.projectName || "--" }}
                  </h5>
                  <span>{{ timefilter(item.createTime || "") }}</span>
                </div>
                <el-divider></el-divider>
                <div class="li-item">
                  <p>
                    【{{ item.toTaskType || "" }}】{{ item.toTaskName || "--" }}
                  </p>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="taskModelEvent('2-2', item.projectId, item)"
                    >前去处理<i class="el-icon-d-arrow-right el-icon--right"></i
                  ></el-button>
                </div>
              </li>
            </ul>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card v-loading="floading3">
            <div slot="header" class="clearfix">
              <span>
                <svg-icon
                  icon-class="view"
                  class="homepage-icon"
                />审计资料</span
              >
            </div>
            <div v-if="datalist.length == 0" class="homeheight2">
              <div class="homeemptyicon">
                <svg-icon icon-class="home-empty" className="homeempty" />
              </div>
              <div class="homeemptytext">暂无内容，稍后再来</div>
            </div>

            <ul class="homeheight2 odd-even" v-else>
              <li v-for="(item, index) in datalist" :key="'data' + index">
                <div class="li-item">
                  <h5
                    @click="auditInfoEvent('2-1', item.projectNumber)"
                    class="pointer"
                  >
                    {{ item.projectName || "--" }}
                  </h5>
                  <span>{{ timefilter(item.createTime || "") }}</span>
                </div>
                <el-divider></el-divider>
                <div class="li-item">
                  <p>{{ item.title || "--" }}</p>
                </div>
              </li>
            </ul>
          </el-card>

          <el-card style="margin-top: 20px" v-loading="floading4">
            <div slot="header" class="clearfix">
              <span>
                <svg-icon
                  icon-class="star"
                  class="homepage-icon"
                />快捷功能</span
              >
              <el-button
                style="float: right; padding: 3px 0; color: #439bd8"
                type="text"
                @click="openfast"
                ><i class="el-icon-setting" style="font-size: 18px"></i
              ></el-button>
            </div>

            <div v-if="outfastlist.length == 0" style="height: 70px">
              <div class="homeemptyicon"></div>
              <div class="homeemptytext">设置您的常用功能</div>
            </div>
            <div class="shortcut-wapper" style="" v-else>
              <div
                @click="shortcutEvent(item)"
                v-for="(item, index) in outfastlist"
                :key="'fastli' + index"
                class="fastli"
              >
                <span
                  class="item-icon"
                  :class="
                    index % 5 == 1
                      ? 'icon-warning'
                      : index % 5 == 2
                      ? 'icon-green'
                      : index % 5 == 3
                      ? 'icon-error'
                      : index % 5 == 4
                      ? 'icon-blue'
                      : ''
                  "
                ></span>
                <span>{{ item.menuName }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="快捷功能设置"
      :visible.sync="fastDialogVisible"
      width="60%"
      center
      :before-close="beforeclosefastlist"
    >
      <div class="fastoutbox">
        <div class="fastleft">
          <el-table
            ref="multipleTable"
            :data="fastlist"
            style="width: 100%"
            stripe
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="可选菜单选项">
              <template slot-scope="scope">{{ scope.row.menuName }}</template>
            </el-table-column>
          </el-table>
        </div>
        <div class="fastright">
          <el-table
            :data="dqfastlist"
            style="width: 100%"
            stripe
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="" width="55"></el-table-column>
            <el-table-column label="已选菜单选项">
              <template slot-scope="scope">{{ scope.row.menuName }}</template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  style="color: red"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="beforeclosefastlist()">取 消</el-button>
        <el-button type="primary" @click="savefastlist()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import Vault from "@WISDOMAUDIT/components/Vaultcertification";
import moment from "moment";
import { validUsername } from "@/utils/validate";
export default {
  components: { Vault },
  data() {
    return {
      modellist: [],
      projectlist: [],
      datalist: [],
      floading1: false,
      floading2: false,
      floading3: false,
      floading4: false,
      fastDialogVisible: false,
      fastlist: [],
      dqfastlist: [],
      outfastlist: [],
      ifpush: true,

      vaultV: false,
      sceneId: 1557, //经营指标、模型结果编号:1556 附件上传后下载编号:1557
      approvers: [], //审批人列表
      maxTime: "",
      account: "",
      appSessionId: "",
      dqtime: "",
      dqtoken: "",
    };
  },
  mounted() {
    this.dqtoken = sessionStorage.getItem("TOKEN");
    if (this.dqtoken) {
      this.getmodellist();
      this.getprojectlist();
      this.getdatalist();
      this.getmeunlist();
    } else {
      window.reload();
    }
  },
  methods: {
    //通过认证后的方法
    vdownload() {},
    //控制认证弹窗
    changevault(val) {
      this.vaultV = val;
    },
    //打开金库
    openVault() {
      axios({
        method: "post",
        url: `/wisdomaudit/treasury/getTreasuryStatus`,
        headers: {
          TOKEN: this.dqtoken,
        },
        data: {
          sceneId: this.sceneId,
          sceneName: "附件上传后下载", //场景名称
          sensitiveData: "report_download", //敏感数据对应的编号：  data_export 经营指标、模型结果 report_download 附件上传后下载;
          sensitiveOperate: "download", //敏感操作对应的编号：export： 导出   select：查询
        },
      }).then((resp) => {
        //result 是否开启 开启：1  无需开启：0
        //resultDesc 无需开启原因（成功错误信息）
        //historyAppSessionId 历史有效应用sessionid（仅当已授权状态时必填属性）
        //relation 多值授权方式与访问方式关系
        //policyAuthMethod 授权方式： remoteAuth远程授权
        //policyAccessMethod
        //maxTime 授权条件（必填属性）单位为小时： 当为0时，为单次授权；否则为时间段授权即允许以当前时间为开始时间，开始时间+maxTime时间为最大结束时间，允许用户在此范围选择；
        //approvers 审批人列表
        //如果是线上环境
        if (resp.data.data.isVaultProfiles) {
          let rep = resp.data.data.treasuryStatusRsp;
          if (rep.result == 0) {
            return;
          } else {
            this.approvers = rep.approvers || "";
            this.maxTime = rep.maxTime;
            this.dqtime = new Date();
            this.account = resp.data.data.account;
            this.appSessionId = resp.data.data.appSessionId;
            this.vaultV = true;
          }
        } else {
          //否则不处理或在此处直接进行后面的操作
          return;
        }
      });
    },

    //保存快捷功能
    savefastlist() {
      if (this.dqfastlist.length > 6) {
        this.$message({
          message: "选择请不要超过6条",
          type: "warning",
        });
      } else {
        if (this.ifpush) {
          this.ifpush = false;
          axios({
            url: `/wisdomaudit/homePage/shortCutSet`,
            headers: {
              TOKEN: this.dqtoken,
            },
            method: "post",
            data: this.dqfastlist,
          }).then((res) => {
            if (res.data.code == 0) {
              this.fastDialogVisible = false;
              this.$refs.multipleTable.clearSelection();
              this.$message({
                message: "设置成功",
                type: "success",
              });
              this.ifpush = true;
              this.getdqfastlist();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          return;
        }
      }
    },
    //关闭快捷功能设置前
    beforeclosefastlist() {
      this.$confirm("取消不会保存您的操作，是否继续取消?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "返回",
        type: "warning",
      })
        .then(() => {
          this.fastDialogVisible = false;
          this.$refs.multipleTable.clearSelection();
        })
        .catch(() => {});
    },
    //选择快捷功能Change事件
    handleSelectionChange(val) {
      this.dqfastlist = val;
    },
    //删除选择
    handleDelete(val) {
      this.$refs.multipleTable.toggleRowSelection(val);
    },
    //添加选择
    handlechoose(val) {
      this.$refs.multipleTable.toggleRowSelection(val, true);
    },
    //整理菜单数据
    finishinglist(list, pr) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].type != 2) {
          if (pr && list[i].url) {
            this.fastlist.push({
              menuName: pr + "-" + list[i].name,
              url: list[i].url,
            });
          } else if (list[i].url) {
            this.fastlist.push({ menuName: list[i].name, url: list[i].url });
          }
          if (list[i].children) {
            this.finishinglist(list[i].children, list[i].name);
          }
        }
      }
    },
    //获取当前快捷功能
    getdqfastlist() {
      (this.floading4 = true),
        axios({
          url: `/wisdomaudit/homePage/pageList`,
          headers: {
            TOKEN: this.dqtoken,
          },
          method: "post",
          data: {},
        }).then((res) => {
          this.floading4 = false;
          let rep = [];
          for (let j = 0; j < res.data.data.records.length; j++) {
            rep.push({
              menuName: res.data.data.records[j].menuName,
              url: res.data.data.records[j].url,
            });
          }
          this.dqfastlist = rep;
          if ((rep == '')) {
            this.outfastlist = this.fastlist.slice(0, 3);
          } else {
            this.outfastlist = rep;
          }

          let _this = this;
          for (let i = 0; i < res.data.data.records.length; i++) {
            this.fastlist.forEach((row) => {
              if (row.menuName == res.data.data.records[i].menuName) {
                _this.handlechoose(row);
              }
            });
          }
        });
    },
    //获取菜单权限列表
    getmeunlist() {
      (this.floading4 = true),
        axios({
          url: `/wisdomaudit/permission/getUserPermissionList`,
          headers: {
            TOKEN: this.dqtoken,
          },
          method: "get",
          data: {},
        }).then((res) => {
          this.finishinglist(res.data.data);
          this.getdqfastlist();
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
    //打开快捷功能设置
    openfast() {
      this.getdqfastlist();
      this.fastDialogVisible = true;
      this.$refs.multipleTable.clearSelection();
    },
    getmodellist() {
      this.floading2 = true;
      axios({
        url: `/wisdomaudit/homePage/homeToList`,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "post",
      }).then((res) => {
        this.floading2 = false;
        this.modellist = res.data.data || "";
        console.log(this.modellist);
      });
    },
    getprojectlist() {
      this.floading1 = true;
      axios({
        url: `/wisdomaudit/homePage/homeProjectList`,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "post",
        data: {},
      }).then((res) => {
        this.floading1 = false;
        if (res.data.data.homePageDtoList) {
          this.projectlist = res.data.data.homePageDtoList.slice(0, 3) || "";
        }
      });
    },
    getdatalist() {
      this.floading3 = true;
      axios({
        url: `/wisdomaudit/homePage/homeZlList`,
        headers: {
          TOKEN: this.dqtoken,
        },
        method: "post",
        data: {},
      }).then((res) => {
        this.floading3 = false;
        this.datalist = res.data.data || "";
      });
    },
    goWorkbench() {
      this.$router.push({
        path: "/audit/auditItems/projectWorkbench",
      });
    },
    projectEvent(type, projectId) {
      switch (type) {
        case "1":
          this.$router.push({
            path: "/audit/auditItems/projectWorkbench",
            query: { index: "2-2", projectId: projectId },
          });
          break;
        case "2":
          this.$router.push({
            path: "/audit/auditItems/projectWorkbench",
            query: { index: "2-2", projectId: projectId },
          });
          break;
        case "3":
          this.$router.push({
            path: "/audit/auditItems/projectWorkbench",
            query: { index: "2-3", projectId: projectId },
          });
          break;
        case "4":
          this.$router.push({
            path: "/audit/auditItems/projectWorkbench",
            query: { index: "2-4", projectId: projectId },
          });
          break;

        default:
          break;
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
    auditInfoEvent(data, projectId) {
      this.$router.push({
        path: "/audit/auditItems/projectWorkbench",
        query: { index: "2-1", projectId: projectId },
      });
    },

     shortcutEvent(item) {
      // if (item.menuName == "审计概览") {
      //   axios({
      //     url:
      //       `/wisdomaudit/dataAuditApi/getSignature?userName=` +
      //       this.$store.state.user.datauserid,
      //     headers: {
      //       TOKEN: this.dqtoken,
      //     },
      //     method: "get",
      //     data: {},
      //   }).then((res) => {
      //     if (res.data.code == 0) {
      //       let reptoken = res.data.data.token;
      //       let url =
      //         "http://10.19.206.196:8088/WebReport/decision/third/auth/cross/login";
      //       $.ajax({
      //         url: url,
      //         dataType: "jsonp",
      //         data: { third_token: reptoken },
      //         success: function (res2) {
      //           if (res2.errorCode) {
      //             console.log("帆软认证接口调用失败");
      //           } else {
      //             console.log("帆软认证接口调用成功");
      //             window.open(item.url);
      //             return;
      //           }
      //         },
      //         error: function () {
      //           alert("超时或服务器其他错误"); // 登录失败（超时或服务器其他错误）
      //           return;
      //         },
      //       });
      //     } else {
      //       return;
      //     }
      //   });
      // } else {
        this.$router.push({
          path: item.url,
        });
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.homeempty {
  height: 50px !important;
  width: 50px !important;
}
.homeemptyicon {
  padding: 20px 0;
  text-align: center;
}
.homeemptytext {
  font-size: 14px;
  text-align: center;
  color: #999;
}
.fastli {
  width: 33%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
.fastoutbox {
  display: flex;
  padding: 10px;
  .fastleft {
    width: 45%;
    height: 400px;
    border: 1px solid #ccc;
    margin: 0 4%;
    overflow: auto;
  }
  .fastright {
    width: 44%;
    height: 400px;
    border: 1px solid #ccc;
    overflow: auto;
  }
}
.el-card {
  padding: 0 20px;
}

.project-wapper {
  display: flex;

  .el-divider {
    height: 178px;
  }

  .project-item {
    width: 33%;
    min-width: 350px;
    font-size: 0;
    height: 178px;
    // display: flex;
    .homepagetitle {
      font-size: 16px;
      height: 20px;
      padding: 0 10px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    ul {
      width: 240px;
      margin: 0 auto;
    }

    li {
      display: inline-block;
      width: 50%;
      // height: 90px;
      // height: 50px;
      // font-size: 16px;
      margin: 0 auto;

      .icon-wapper {
        height: 70px;
        width: 110px;
        margin: 3px auto;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 10px;

        text-align: center;

        .svg-icon {
          width: 30px;
          height: 30px;
        }

        span {
          display: inline-block;
          margin-top: 5px;
          font-size: 16px;

          width: 106px;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .icon-wapper:hover {
        background-image: linear-gradient(#e0edf8, #4d7cfd);
        color: #fff;
      }
    }

    // li:nth-of-type(odd) {
    //   margin: 0 5px 0 auto;
    // }
    // li:nth-of-type(even) {
    //   margin: 0 auto 0 5px;
    // }
  }
}

.odd-even {
  font-size: 18px;
  li:nth-of-type(even) {
    background: #f4f4f4;
  }

  li {
    margin-bottom: 5px;
    padding: 10px;
    .el-divider {
      margin: 5px 0;
    }

    .li-item {
      display: flex;
      justify-content: space-between;
    }

    h5 {
      color: rgb(67, 155, 216);
      font-size: 15px;
    }

    span {
      font-size: 13px;
    }

    p {
      font-size: 13px;
    }
  }
}

.shortcut-wapper {
  height: 70px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .fastli {
    width: 33%;
    height: 35px;
    display: flex;
    align-items: center;
    span {
      cursor: pointer;
    }
    span.item-icon {
      display: inline-block;
      width: 8px;
      height: 18px;

      border-radius: 8px;
      background-image: linear-gradient(#e0a6fb, #8478f3);
      margin-right: 5px;
    }

    span.item-icon.icon-warning {
      background-image: linear-gradient(#ffe8a7, #ff9d3a);
    }

    span.item-icon.icon-error {
      background-image: linear-gradient(#feaad1, #f24c76);
    }

    span.item-icon.icon-green {
      background-image: linear-gradient(#85f4ea, #03cdbb);
    }

    span.item-icon.icon-blue {
      background-image: linear-gradient(#67baee, #5584fc);
    }
  }
}
.el-card .el-card__header {
  font-size: 15px;
  font-weight: bold;
  padding: 10px !important;
}
.homepage-icon {
  margin-right: 3px;
  height: 1.2rem !important;
  width: 1.2rem !important;
  vertical-align: -0.3em !important;
}
.pointer {
  cursor: pointer;
}
.fastoutbox .el-table__header {
  border: none !important;
}
</style>
<style scoped>
.audithome .el-card >>> .el-card__body {
  padding: 5px !important;
}
.audithome >>> .el-card__header {
  padding: 5px !important;
}
.homeheight1 {
  height: 178px;
  width: 100%;
}
.homeheight2 {
  height: calc(100vh - 485px);
  overflow: scroll;
}
.homeheight3 {
  height: calc(100vh - 348px);
  overflow: scroll;
}
</style>

