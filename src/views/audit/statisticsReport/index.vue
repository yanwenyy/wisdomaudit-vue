<template>
  <div class="statisticsReport">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="审计人员情况" name="first"></el-tab-pane>
      <el-tab-pane label="审计项目情况" name="second"></el-tab-pane>
    </el-tabs>
    <div v-show="activeName == 'first'">
      <div class="result">
        共 <span class="orange"> {{ total1 }} </span> 条
      </div>
      <div class="filter-container">
        <QueryField
          ref="queryfield1"
          :form-data="queryFields1"
          date-type="month"
          @submit="getList1"
        />
        <el-button type="primary" class="right" @click="out1()">导出</el-button>
      </div>
      <div class="tablebox">
        <el-table
          :data="tableData1"
          border
          v-loading="listLoading"
          style="width: 100%"
          stripe
        >
          <el-table-column fixed label="序号" width="60">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column fixed prop="personName" label="姓名" width="100">
          </el-table-column>
          <el-table-column
            fixed
            prop="age"
            label="年龄"
            width="80"
          ></el-table-column>
          <el-table-column prop="sex" label="性别" width="80" :formatter="formatSex">
          </el-table-column>
          <el-table-column prop="job" label="职务" width="120" :formatter="formatJob">
          </el-table-column>
          <el-table-column prop="major" label="专业" width="120">
          </el-table-column>
          <el-table-column prop="jobtitle" label="职称" width="120">
          </el-table-column>
          <el-table-column
            prop="mainJobExperience"
            label="主要岗位经历"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="entryOrgTime"
            label="入职审计工作时间（年月）"
            width="150"
          >
          </el-table-column>
          <el-table-column
            prop="auditWorkTime"
            label="从事审计工作时间（年月）"
            width="150"
          >
          </el-table-column>
          <el-table-column label="调离审计部门时间" width="120">
          </el-table-column>
          <el-table-column prop="adeptAudit" label="擅长业务审计" width="120">
          </el-table-column>
          <el-table-column label="本年度担任主审计项目数" width="150">
          </el-table-column>
          <el-table-column label="参加省联社组织的行业审计次数" width="100">
          </el-table-column>
          <el-table-column
            label="有无审计任职资格证"
            width="100"
          >
          <template slot-scope="scope">
              {{ scope.row.hasCertificate==1?"有":"无" }}
            </template>
          </el-table-column>
          <el-table-column label="证书编号" width="120"> </el-table-column>
          <el-table-column
            prop="otherCertificate"
            label="考取的其他专业证书"
            width="120"
          >
          </el-table-column>
          <!-- <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small">{{scope.row||''}}</el-button>
        </template>
      </el-table-column> -->
        </el-table>
      </div>
    </div>

    <div v-show="activeName == 'second'">
      <div class="result">
        共 <span class="orange"> {{ total2 }} </span> 条
      </div>
      <div class="filter-container">
        <QueryField
          ref="queryfield2"
          :form-data="queryFields2"
          date-type="month"
          @submit="getList2"
        />
        <el-button type="primary" class="right" @click="out2()">导出</el-button>
      </div>
      <div class="tablebox">
        <el-table
          :data="tableData2"
          style="width: 100%"
          stripe
          v-loading="listLoading"
        >
          <el-table-column fixed label="序号" width="80">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="projectName"
            label="项目名称"
            width="150"
          ></el-table-column>
          <el-table-column
            fixed
            prop="auditedOrgName"
            label="被审计对象"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="projectType"
            label="项目性质"
            width="120"
          ></el-table-column>
          <el-table-column label="审计项目起止时间" width="150">
            <template slot-scope="scope">
              {{
                scope.row.auditStartTime
                  ? scope.row.auditStartTime
                  : scope.row.auditEndTime
                  ? "-"
                  : ""
              }}<span v-if="scope.row.auditStartTime || scope.row.auditEndTime"
                >至</span
              >{{
                scope.row.auditEndTime
                  ? scope.row.auditEndTime
                  : scope.row.auditStartTime
                  ? "-"
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="projectMemberNum"
            label="参加审计项目人数"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="auditDays"
            label="现场审计时间（天数）"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="auditContent"
            label="审计范围"
            width="150"
          ></el-table-column>
          <el-table-column label="审计报告情况">
            <el-table-column
              prop="problemNum"
              label="问题条数"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="mainProblem"
              label="其中重要问题（文字示例）"
              width="200"
            ></el-table-column>
          </el-table-column>
          <el-table-column label="问题整改率" width="120">
            <template slot-scope="scope">
              {{ valueToPercent(scope.row.rectifyProb) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="manageSuggestNum"
            label="管理建议条数"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="riskWarningNum"
            label="风险提示条数"
            width="120"
          ></el-table-column>
          <el-table-column label="经济处罚情况">
            <el-table-column
              prop="violationPersonNum"
              label="人数"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="violationMoney"
              label="金额"
              width="120"
            ></el-table-column>
            <el-table-column label="是否入账" width="120">
              <template slot-scope="scope">
                {{ scope.row.isEnterAccount == 1 ? "是" : "否" }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop=""
            label="移交监察处理人数"
            width="120"
          ></el-table-column>
          <el-table-column
            prop=""
            label="是否已作为优秀项目申报"
            width="120"
          ></el-table-column>
          <!-- <el-table-column label="地址">
          <el-table-column prop="province" label="省份" width="120">
          </el-table-column>
          <el-table-column prop="city" label="市区" width="120">
          </el-table-column>
          <el-table-column prop="address" label="地址" width="300">
          </el-table-column>
          <el-table-column prop="zip" label="邮编" width="120">
          </el-table-column>
        </el-table-column> -->
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import QueryField from "@/components/public/query-field/index";
import {
  personReportList,
  exportPersonReportExcel,
} from "@WISDOMAUDIT/api/wisdomaudit/personalManage";
import { projectReportList } from "@WISDOMAUDIT/api/wisdomaudit/project";
import axios from "axios";
import { getPositionList } from '@WISDOMAUDIT/api/wisdomaudit/personalManage'
export default {
  components: { QueryField },
  data() {
    return {
      dqtoken: "",
      listLoading: false,
      activeName: "first",
      total1: 20,
      total2: 4,
      queryFields1: [
        {
          label: "入行时间",
          name: "entryOrgTime",
          type: "timePeriod",
          value: [],
        },
        // { label: '模糊查询', name: 'keyword', type: 'fuzzyText' },
      ],
      queryFields2: [
        {
          label: "审计时间",
          name: "auditStartTime",
          type: "timePeriod",
          value: [],
        },
        { label: "项目名称", name: "projectName", type: "text", value: "" },
        // { label: '模糊查询', name: 'keyword', type: 'fuzzyText' },
      ],
      tableData1: [
        // {
        //   personName: "王小虎",
        //   age: 34,
        //   sex: "男",
        //   job: "科员",
        //   eduid: "本科",
        //   major: "会计",
        //   jobtitle: "助理会计师",
        //   mainJobExperience: "记账储蓄",
        //   entryOrgTime: "2005-05-02",
        //   auditWorkTime: "2005-09-02",
        //   adeptAudit: "信贷",
        //   hasCertificate: "有",
        //   otherCertificate: "无",
        // }
      ],
      tableData2: [
        // {
        //   number: 1,
        //   projectName: "xxx",
        //   auditedOrgName: "xxx支行",
        //   auditContent: "xxxxxxx",
        //   projectType: "专项审计",
        //   auditStartTime: "6月10日",
        //   auditEndTime: "6月24日",
        //   projectMemberNum: 5,
        //   auditDays: 5,
        //   auditStartTimeStart: "xxxxxxxx",
        //   auditStartTimeEnd: "xxxxxxxx",
        //   problemNum: 5,
        //   mainProblem: "重要问题",
        //   rectifyProb: "94.5%",
        //   manageSuggestNum: 4,
        //   riskWarningNum: 6,
        //   violationPersonNum: 5,
        //   violationMoney: 600,
        //   isEnterAccount: 1,
        // },
      ],
      // 格式化参数列表
      formatMap: {
        // 职务
        job: {
        },
        // 性别
        sex: {
          0: '女',
          1: '男',
          null: ''
        },
      },
      // 系统职务查询分页参数
      pageQueryPositionList: {
        condition: {},
        pageNo: 1,
        pageSize: 1000,
        sortBy: 'asc',
        sortName: 'createtime'
      },
    };
  },
  created() {
    this.dqtoken = sessionStorage.getItem("TOKEN");
    this.getdate();
    // 打开窗口前获取所有的职务
    getPositionList(this.pageQueryPositionList).then(resp => {
      this.positionList = resp.data.records
      for (let i=0;i<this.positionList.length;i++){
        this.$set(this.formatMap.job,this.positionList[i].pid,this.positionList[i].pname)
      }
      console.log(this.formatMap.job)
    })
  },
  methods: {
    //转百分比
    valueToPercent(value) {
      if (value) {
        var str = Number(value * 100).toFixed(2);
        str += "%";
        return str;
      } else {
        return "";
      }
    },
    //获取时间 上月到这月
    getdate() {
      var date = new Date();
      var dateStrings =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-02";
      if (date.getMonth() == 0) {
      } else {
        date.setMonth(date.getMonth() - 1);
      }
      var dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-02";
      //给筛选器复制
      let datelist = [dateString, dateStrings];
      this.queryFields1[0].value = datelist;
      this.queryFields2[0].value = datelist;
      this.queryFields1[0].value = [
        new Date(new Date(dateString).setHours(0, 0, 0, 0)),
        new Date(new Date(dateStrings).setHours(0, 0, 0, 0)),
      ];
      this.queryFields2[0].value = [
        new Date(new Date(dateString).setHours(0, 0, 0, 0)),
        new Date(new Date(dateStrings).setHours(0, 0, 0, 0)),
      ];
      this.getList1({
        entryOrgTimeEnd: this.queryFields1[0].value[1],
        entryOrgTimeStart: this.queryFields1[0].value[0],
      });
      this.getList2({
        auditStartTimeEnd: this.queryFields2[0].value[1],
        auditStartTimeStart: this.queryFields2[0].value[0],
        projectName: this.queryFields2[1].value,
      });
    },
    //时间格式化
    parserDate(date) {
      var t = Date.parse(date);
      if (!isNaN(t)) {
        return new Date(Date.parse(date.replace(/-/g, "/")));
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 格式化职务
    formatJob(data) {
      return this.formatMap.job[data.job]
    },
    // 格式化性别
    formatSex(data) {
      return this.formatMap.sex[data.sex]
    },
    //人员列表
    getList1(query) {
      personReportList(query).then((res) => {
        this.tableData1 = res.data;
        this.total1=res.data.length;
      });
    },
    //项目情况
    getList2(query) {
      projectReportList(query).then((res) => {
        this.tableData2 = res.data;
        this.total2=res.data.length;
      });
    },
    //人员导出
    out1() {
      // 下载项目模板excel
      axios({
        method: "post",
        url: `/wisdomaudit/report/exportPersonReportExcel`,
        headers: {
          TOKEN: this.dqtoken,
        },
        responseType: "blob",
        data: {
          entryOrgTimeEnd: this.$refs.queryfield1.query.entryOrgTimeEnd,
          entryOrgTimeStart: this.$refs.queryfield1.query.entryOrgTimeStart,
        },
      })
        .then((res) => {
          // if (res.code !== 0) this.$message.error(res.msg)
          const filename = decodeURI(
            res.headers["content-disposition"].split(";")[1].split("=")[1]
          );
          const blob = new Blob([res.data], {
            type: "application/octet-stream",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "导出审计人员情况时发生异常",
            duration: 0,
            showClose: true,
          });
        });
    },
    //项目导出
    out2() {
      // 下载项目模板excel
      axios({
        method: "post",
        url: `/wisdomaudit/report/auditItemReportExcel`,
        headers: {
          TOKEN: this.dqtoken,
        },
        responseType: "blob",
        data: {
          auditStartTimeEnd: this.$refs.queryfield2.query.auditStartTimeEnd,
          auditStartTimeStart: this.$refs.queryfield2.query.auditStartTimeStart,
          projectName: this.$refs.queryfield2.query.projectName,
        },
      })
        .then((res) => {
          // if (res.code !== 0) this.$message.error(res.msg)
          const filename = decodeURI(
            res.headers["content-disposition"].split(";")[1].split("=")[1]
          );
          const blob = new Blob([res.data], {
            type: "application/octet-stream",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "导出审计人员情况时发生异常",
            duration: 0,
            showClose: true,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.statisticsReport {
  padding: 20px;
  .orange {
    font-size: 16px;
    font-weight: bold;
  }
  .right {
    float: right;
  }
  .tablebox {
    margin-top: 40px;
    height: calc(100vh - 220px);
    overflow: auto;
  }
}
</style>
