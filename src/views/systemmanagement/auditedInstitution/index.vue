<template>
  <div class="auditedInstitution">
    <Vault :vaultV="vaultV"
           :sceneId="sceneId"
           :approvers="approvers"
           :maxTime="maxTime"
           :dqtime="dqtime"
           :account="account"
           :appSessionId="appSessionId"
           @changevault="changevault"
           @vdownload="vdownload"></Vault>
    <el-row :gutter="24">
      <el-col :span="6"
              class="filterTree">
        <el-input placeholder="输入关键字进行过滤"
                  v-model="filterText">
        </el-input>

        <el-tree class="filter-tree"
                 :data="data"
                 :props="defaultProps"
                 default-expand-all
                 :filter-node-method="filterNode"
                 ref="tree"
                 @node-click="getCheckedNodes">
        </el-tree>
      </el-col>
      <el-col :span="18">
        <el-row>
          <el-col :span="2">
            <!-- 导入按钮 -->
            <el-upload ref="upload"
                       class="upload-demo"
                       action="#"
                       :on-change="handleChange"
                       :file-list="fileList">
              <el-button size="small"
                         style="background: #0c87d6; color: #fff">文件导入</el-button>
            </el-upload>
          </el-col>
          <el-col :span="2">
            <el-button type="text"
                       style="color: #44a3df; background: none; border: 0;"
                       size="small xz"
                       @click="openVault({})">下载模板</el-button>
          </el-col>
          <div class="search">
            <el-input placeholder="请输入机构名称"
                      v-model="queryInfo.condition.orgName"
                      @keyup.enter.native="queryNameInput">
            </el-input>
            <div class="search_icon"
                 style="background: rgb(12, 135, 214) !important"
                 @click="queryNameInput">
              <i class="el-icon-search"
                 style="color: white"></i>
            </div>
          </div>
        </el-row>

        <!-- 项目管理列表 -->
        <el-table class="table"
                  :data="orgTableData"
                  style="margin-top: 1%; width: 100%"
                  border
                  stripe
                  fit
                  :header-cell-style="{ 'background-color': '#F4FAFF' }">
          <el-table-column type="selection"
                           width="40"> </el-table-column>
          <el-table-column align="center"
                           prop="orgCode"
                           width="105"
                           label="机构编码"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="120px"
                           align="center"
                           prop="orgName"
                           label="机构名称"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center"
                           prop="leaderName"
                           label="被审计单位领导"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center"
                           prop="userName"
                           label="被审计单位接口人"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作"
                           width="180px">
            <template slot-scope="scope">
              <el-button type="text"
                         style="color: #44a3df; background: none; border: 0"
                         size="small"
                         @click="auditOrgLook(scope.row)">
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <pagination v-show="total > 0"
                    :total="total"
                    :page.sync="queryInfo.pageNo"
                    :limit.sync="queryInfo.pageSize"
                    @pagination="queryName" />
        <!-- 分页end -->
      </el-col>
    </el-row>

    <!-- 查看弹框 -->
    <el-dialog :visible.sync="look_auditOrg"
               :append-to-body='true'
               width="40%">
      <div class="mainTitle">被审计机构</div>
      <div class="formStyle">
        <el-form label-width="130px"
                 ref="dictionaryRef"
                 :model="auditOrgForm"
                 disabled>
          <el-form-item prop="orgCode"
                        label="机构编码:">
            <el-input v-model="auditOrgForm.orgCode"> </el-input>
          </el-form-item>
          <el-form-item prop="orgName"
                        label="机构名称:">
            <el-input v-model="auditOrgForm.orgName"> </el-input>
          </el-form-item>
          <el-form-item prop="leaderName"
                        label="被审计单位领导:">
            <el-input v-model="auditOrgForm.leaderName"> </el-input>
          </el-form-item>
          <el-form-item prop="userName"
                        label="被审计单位接口人:">
            <el-input v-model="auditOrgForm.userName"> </el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import Vault from "@WISDOMAUDIT/components/Vaultcertification";

import {
  auditOrgList,
  auditOrgTree,
  auditDetail,
} from "@SDMOBILE/api/shandong/auditedInstitution";
import Pagination from "@WISDOMAUDIT/components/Pagination";
export default {
  components: { Vault,Pagination },
  data () {
    return {
      vaultV: false,
      sceneId: 1557, //经营指标、模型结果编号:1556 附件上传后下载编号:1557
      approvers: [], //审批人列表
      maxTime: "",//最大时间
      dqtime: "",//当前时间
      account: "",//返回的账户
      appSessionId: "",//应用sessionid
      downloaobj: {},//暂存的下载目标

      dqtoken: "",
      orgTableData: [], //被审计机构table
      total: 0, //table 总条数
      queryTree: {},
      queryInfo: {
        //模糊查询入参
        condition: {
          orgName: "",
          parentOrgCode: 1,
        },
        pageNo: 1,
        pageSize: 10,
      },
      fileList: [],
      filterText: "",
      data: [], //树形数据
      defaultProps: {
        children: "auditOrgs",
        label: "orgName",
      },
      look_auditOrg: false, //查看弹框
      auditOrgForm: {}, //查看详情表单
    };
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    },
  },
  created () {
    this.dqtoken = sessionStorage.getItem("TOKEN");
    // 获取左侧树形List
    this.getauditOrgTree(this.queryTree);
  },
  methods: {
    //通过认证后的方法
    vdownload () {
      this.orgDownload()
    },
    //控制认证弹窗
    changevault (val) {
      this.vaultV = val;
    },
    //打开金库
    openVault (obj) {
      console.log("芝麻开门")
      this.downloaobj = obj
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
            this.$message('因金库未开启或服务异常，文件下载失败，请联系系统管理员。');
            return;
          } else {
            console.log(rep);
            this.approvers = rep.approvers || "";
            this.maxTime = rep.maxTime;
            this.dqtime = new Date();
            this.account = resp.data.data.account;
            this.appSessionId = resp.data.data.appSessionId;
            this.vaultV = true;
          }
        } else {
          //否则不处理或在此处直接进行后面的操作
          this.vdownload()
        }
      });
    },

    //对树节点进行筛选时执行的方法
    filterNode (value, data) {
      console.log(value);
      console.log(data);
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
    },

    //被审计机构管理树形列表
    getauditOrgTree (data) {
      auditOrgTree(data).then((resp) => {
        this.data = resp.data;
        // 获取右侧列表数据
        this.getauditOrgList(this.queryInfo);
      });
    },

    //点击树形查看事件
    getCheckedNodes (data) {
      if (data.auditOrgs.length > 0) {
        this.queryInfo.condition.parentOrgCode = data.orgCode;
        // 获取右侧列表数据
        this.getauditOrgList(this.queryInfo);
      } else {
        return this.$message({
          showClose: true,
          message: "该节点没有下级节点！",
          type: "warning",
        });
      }
    },

    // 被审计机构列表查询
    getauditOrgList (data) {
      auditOrgList(data).then((resp) => {
        this.orgTableData = resp.data.records;
        this.total = resp.data.total;
      });
    },
    //模糊查询被审计机构
    queryNameInput () {
      let query = {
        condition: {
          orgName: this.queryInfo.condition.orgName,
          parentOrgCode: this.queryInfo.condition.parentOrgCode,
        },
        pageNo: 1,
        pageSize: 10,
      };
      this.getauditOrgList(query);
    },
    queryName () {
      this.queryInfo.condition.orgName = "";
      this.getauditOrgList(this.queryInfo);
    },
    //点击上传文件
    handleChange (file, fileList) {
      // console.log(file);
      // console.log(fileList);
      // this.$refs.upload.clearFiles();
      if(file.status=="ready"){
        let formData = new FormData();

        fileList.forEach((item) => {
          if (item.raw) {
            formData.append("orgFile", item.raw);
          }
        });

        axios({
          method: "post",
          url: "/wisdomaudit/auditOrg/importFiles",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            TOKEN: this.dqtoken,
          },
        }).then((resp) => {
          console.log(resp);
          if (resp.data.data == 'SUCCESS') {
            this.$message.success("文件导入成功！")
            this.getauditOrgList(this.queryInfo);
          } else {
            this.$message.info("请检查文件格式以及导入数据是否重复！")
          }
        });
      }

    },

    //下载模板
    orgDownload () {
      axios({
        method: "get",
        // timeout: -1,
        url: "/wisdomaudit/auditOrg/downloadAuditOrgModel",
        headers: {
          TOKEN: this.dqtoken,
        },
        responseType: "blob",
      })
        .then((res) => {
          const content = res.data;
          const blob = new Blob([content], {
            type: "application/octet-stream,charset=UTF-8",
          });
          const fileName =
            res.headers["content-disposition"].split("filename=")[1];
          // const fileName = fileName1.split()[1];
          // console.log(fileName);
          const filteType = res.headers["content-disposition"].split(".")[1];
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = '模板.xlsx'; //下载后文件名
            elink.style.display = "none";
            elink.href = window.URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            window.URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            // navigator.msSaveBlob(blob, fileName);
            navigator.msSaveBlob(blob, "模板.xlsx");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //查看按钮事件
    auditOrgLook (row) {
      console.log(row);
      this.look_auditOrg = true;
      auditDetail(row.auditOrgUuid).then((resp) => {
        this.auditOrgForm = resp.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.auditedInstitution {
  padding: 1%;
  // border: 1px solid red;
}
.el-tree {
  margin-top: 5.5%;
}
.mainTitle {
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid #d2d2d2;
}

.formStyle {
  // border: 1px solid red;
  text-align: center;
  padding: 5%;
}
</style>
<style scoped>
@import "../../../assets/styles/css/yw.css";
.formStyle >>> .el-form-item {
  width: 100%;
  margin-bottom: 20px !important;
}
.formStyle >>> .el-form {
  width: 400px;
  margin: 0 auto;
}
.formStyle >>> .el-input__inner {
  width: 100%;
  /* padding-bottom: 15px; */
  box-sizing: border-box;
}
.formStyle >>> .el-form-item__label {
  width: 90px;
  height: 100%;
  display: block;
  text-align: right;
  float: left !important;
}
.formStyle >>> .el-input.is-disabled .el-input__inner {
  color: #606266 !important;
  background: #f5f7fa !important;
  opacity: 0.8;
}

.search {
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.search >>> .el-input__inner {
  width: 220px !important;
  border-radius: 5px 0 0 5px;
}
.search >>> .el-input__inner {
  width: 250px !important;
  display: flex;
  float: right;
  border-radius: 0 !important;
}
.search >>> .search_icon {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0%;
  width: 36px;
  height: 36px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border-radius: 0 5px 5px 0;
}
.search >>> .el-input__inner::-webkit-input-placeholder {
  color: #c0c4cc !important;
}
.filterTree {
  border: 1px solid #c0c4cc;
  padding: 1%;
  border-radius: 1%;
}
.filterTree >>> .el-input__inner::-webkit-input-placeholder {
  color: #c0c4cc !important;
}
.xz{
  margin-left: 15px;
}
@media (min-width: 1000px) and (max-width: 1400px) {
  .xz{
    margin-left: 30px;
  }
}
  >>>.el-tree-node__children{
    overflow: auto!important;
  }
</style>
