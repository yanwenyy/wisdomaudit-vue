<template>
  <div class="sjyj-body">
    <el-button @click="openVault"
               style="margin-left:15px;">金库认证测试</el-button>
    <el-row type="flex"
            :gutter="20">
      <div class="searchBbtn">
        <el-col :span="6">
          <div class="kuan">资料名称:</div>
          <el-input v-model="searchForm.basyName"
                    placeholder="请输入资料名称"></el-input>
        </el-col>
        <el-col :span="6">
          <div class="kuan">发文时间:</div>
          <el-date-picker v-model="searchForm.issueDate"
                          format="yyyy-MM-dd"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <div class="kuan">发文部门:</div>
          <el-input v-model="searchForm.publishDepartment"
                    placeholder="请输入发文部门"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary"
                     @click="getData">查询</el-button>

        </el-col>
      </div>
    </el-row>
    <!--<div class="addbtn"><el-button type="primary" @click="addlist">新增依据</el-button></div>-->
    <auditbasis ref="listShow"></auditbasis>
    <Vault :vaultV="vaultV"
           :sceneId="sceneId"
           :approvers="approvers"
           :maxTime="maxTime"
           :dqtime="dqtime"
           :account="account"
           :appSessionId="appSessionId"
           @changevault="changevault"
           @download="download"></Vault>
  </div>
</template>

<script>
import Vault from "@WISDOMAUDIT/components/Vaultcertification";
import axios from "axios";
import auditbasis from "@WISDOMAUDIT/components/workbench/auditbasis/index";

export default {
  components: {
    auditbasis,
    Vault,
  },
  data () {
    return {
      dqtoken: "",
      searchForm: {
        basyName: "",
        issueDate: "",
        publishDepartment: "",
      },
      input: "",
      name: "",
      vaultV: false,
      sceneId: 1556, //经营指标、模型结果编号:1556 附件上传后下载编号:1557
      approvers: [], //审批人列表
      maxTime: "",
      account: "",
      appSessionId: "",
      dqtime: "",
    };
  },
  created () {
    this.dqtoken = sessionStorage.getItem("TOKEN");
  },
  methods: {
    //通过认证后的方法
    download () { },
    //控制认证弹窗
    changevault (val) {
      this.vaultV = val;
    },
    //打开金库
    openVault () {
      axios({
        method: "post",
        url: `/wisdomaudit/treasury/getTreasuryStatus`,
        headers: {
          TOKEN: this.dqtoken,
        },
        data: {
          sceneId: this.sceneId,
          sceneName: "导出授权场景", //场景名称
          sensitiveData: "data_export", //敏感数据对应的编号：  data_export 经营指标、模型结果 report_download 附件上传后下载;
          sensitiveOperate: "export", //敏感操作对应的编号：export： 导出   select：查询
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
          return;
        }
      });
    },
    //查询按钮点击
    getData () {
      this.$nextTick(() => {
        this.$refs.listShow.getSearchForm(this.searchForm);
      });
    },
    //新增依据
    addlist () {
      this.$nextTick(() => {
        this.$refs.listShow.addlist();
      });
    },
  },
};
</script>

<style scoped>
.el-col {
  display: flex;
  align-items: center;
}

.kuan {
  width: 50%;
}

.el-row {
  padding: 10px 0 0 1%;
}
.sjyj-body {
  background: #fff;
}
.addbtn {
  margin-top: 10px;
  margin-left: 10px;
}
</style>>
