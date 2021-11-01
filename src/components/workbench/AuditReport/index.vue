<template>
  <div class="report anmition_show">
    <div class="header">
      <el-col :span="12">
        <p>审计项目：2021经费审计项目</p>
      </el-col>
      <el-col :span="12">
        <p>被审计单位：2021经费审计项目</p>
      </el-col>
    </div>

    <!-- <div class="header">
      <el-col :span="12"
              v-for="(it,index) in tt"
              :key="index">
        <p @click="listTop(it,index)">{{it.name}}</p>
      </el-col>
    </div> -->

    <div class="conter">
      <div class="top">
        <el-row>
          <el-col>
            <p>经营评价：</p>
            <el-button plain
                       @click="Correlation_zb()">关联指标</el-button>
          </el-col>

          <div class="text">
            <el-input type="textarea"
                      resize="none"
                      disabled
                      v-model="administrativeAdvice">
              1.23o239139219830921832390131
            </el-input>
          </div>

        </el-row>

      </div>

      <div class="top">
        <el-row>
          <el-col>
            <p>管理建议：</p>
            <el-button plain
                       @click="Correlation_wt()">关联问题</el-button>
          </el-col>

          <div class="text">
            <el-input type="textarea"
                      disabled
                      resize="none"
                      v-model="businessEvaluation">
              1.23o239139219830921832390131
            </el-input>
          </div>

        </el-row>

      </div>

      <div class="bottom">
        <span slot="footer">
          <el-button size="small"
                     @click="dlag_Correlation_zb = false">
            取消</el-button>
          <el-button size="small"
                     type="primary"
                     @click="query_report()">生成报告</el-button>
        </span>

        <div class="flex_end">
          <p>附件：</p>
          <ul>
            <li> <a href="#">关于引发的文件.zip</a><span>版本1.0</span><span>时间2011-1102</span></li>
            <li> <a href="#">关于引发的文件.zip</a><span>版本1.0</span><span>时间2011-1102</span></li>

          </ul>

        </div>
      </div>

    </div>

    <!-- 关联指标 -->
    <el-dialog width="40%"
               popper-class="status_data_dlag_verify"
               :visible.sync="dlag_Correlation_zb"
               style="padding-bottom: 59px">
      <div class="title_dlag">关联指标</div>

      <div class="dlag_conter3">
        <!-- 表单 -->
        <el-table :data="correlation"
                  ref="multipleTable"
                  tooltip-effect="dark"
                  v-loading="loading"
                  style="width: 100%"
                  :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
                  @selection-change="handleSelectionChange_zb">
          >
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column prop="indexTypeName"
                           align="center"
                           label="指标类型"> </el-table-column>

          <el-table-column prop="accessCaliberName"
                           align="center"
                           label="依据"> </el-table-column>

          <el-table-column prop="indexUnitName"
                           align="center"
                           label="单位"> </el-table-column>

          <el-table-column prop="dataProvideDepartmentName"
                           align="center"
                           label="资料提供部门"> </el-table-column>
          <!-- <el-table-column prop="name"
                           align="center"
                           label="管理建议"> </el-table-column> -->

          <el-table-column prop="indexValue"
                           align="center"
                           label="指标值">

          </el-table-column>
        </el-table>

        <span slot="footer"
              class="foot">
          <el-button size="small"
                     @click="dlag_Correlation_zb = false">
            取消</el-button>
          <el-button size="small"
                     type="primary"
                     @click="query_save_zb()">确定</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 关联问题 -->
    <el-dialog width="60%"
               popper-class="status_data_dlag_verify"
               :visible.sync="dlag_Correlation_wt"
               style="padding-bottom: 59px">

      <div class="title_dlag">关联问题</div>

      <div class="dlag_conter3">
        <!-- 表单 -->
        <el-table :data="tableData2_list"
                  ref="multipleTable"
                  tooltip-effect="dark"
                  v-loading="loading"
                  style="width: 100%"
                  :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
                  @selection-change="handleSelectionChange_wt">
          >
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column prop="field"
                           align="center"
                           label="领域"> </el-table-column>

          <el-table-column prop="problem"
                           align="center"
                           label="问题"> </el-table-column>

          <el-table-column prop="basis"
                           align="center"
                           label="依据"> </el-table-column>

          <el-table-column prop="describe"
                           align="center"
                           label="描述">
          </el-table-column>
          <el-table-column prop="problemDiscoveryTime"
                           align="center"
                           label="发现日期">
            <template slot-scope="scope">
              <p>{{scope.row.problemDiscoveryTime|filtedate}}</p>
            </template>

          </el-table-column>
          <el-table-column prop="riskAmount"
                           align="center"
                           label="风险金额（元）"> </el-table-column>
          <el-table-column prop="managementAdvice"
                           align="center"
                           label="管理建议"> </el-table-column>
          <el-table-column prop="problemFindPeople"
                           align="center"
                           label="发现人"> </el-table-column>
        </el-table>

        <span slot="footer"
              class="foot">

          <el-button size="small"
                     @click="dlag_Correlation_wt = false">
            取消</el-button>
          <el-button size="small"
                     type="primary"
                     @click="query_save_wt()">确定</el-button>
        </span>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { operatingIndicators_list, task_pageList_wt, task_pageList_export, export_selectFile } from '@SDMOBILE/api/shandong/AuditReport'
import { fmtDate } from '@SDMOBILE/model/time.js';

export default {
  components: {},
  data () {
    return {
      file_list: [],//附件
      loading: false,
      dlag_Correlation_zb: false,//添加关联指标
      dlag_Correlation_wt: false,//添加关联问题

      multipleSelection: [],//指标多选
      multipleSelection2: [],//问题多选
      correlation: [],//关联指标数据


      administrativeAdvice: '',//管理建议
      businessEvaluation: '',//经营评价
      // 模糊查询
      query: {
        problem: '',//模糊查询
      },
      tableData2: [],//关联问题
      tableData2_list: [],//关联问题 list
      wt_listl: [],//问题 选择
    }
  },
  props: ['active_project'],

  computed: {},
  watch: {},
  created () {
    let params = {
      id: this.active_project,//项目id
    }
    this.export_selectFile_data(params)
  },
  mounted () {

  },
  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      return fmtDate(t, 'yyyy-MM-dd ');
    }
  },
  methods: {
    // 附件
    export_selectFile_data (params) {
      export_selectFile(params).then(resp => {
        console.log(resp);
        this.file_list = resp.data
      })
    },
    // listTop (item, index) {
    //   this.tt.splice(index, 1)
    //   this.tt.unshift(item)
    // },


    // 添加关联指标
    Correlation_zb () {
      let params = {
        managementProjectUuid: this.active_project,//项目id
      }
      this.dlag_Correlation_zb = true;//添加关联指标
      operatingIndicators_list(params).then(resp => {
        this.correlation = resp.data;
        console.log(resp);
      })
    },
    // 指标多选
    handleSelectionChange_zb (val) {
      this.multipleSelection = val;
    },
    // 指标确认保存
    query_save_zb () {
      if (this.multipleSelection.length == 0) {
        this.$message.info("至少关联一条数据！");
        return false;
      }

      let array1 = [];//数组1
      this.multipleSelection.forEach((item, i) => {
        array1.push((i + 1) + '.' + item.accessCaliberName + item.dataProvideDepartmentName);
      });
      console.log(array1);
      this.administrativeAdvice = array1
      // 拼接
      // this.dlag_Correlation_zb = false;//添加关联指标

    },



    // 添加关联问题====================================
    Correlation_wt () {
      let params = {
        condition: {
          managementProjectUuid: this.managementProjectUuid,//项目id
        },
        problem: this.query.problem,//模糊查询
      }
      this.dlag_Correlation_wt = true;//添加关联问题
      task_pageList_wt(params).then(resp => {
        // console.log(resp.data);
        this.tableData2 = resp.data;
        this.tableData2_list = resp.data.records;
      })
    },
    // 问题多选
    handleSelectionChange_wt (val) {
      this.multipleSelection2 = val;
    },
    // 指标确认保存
    query_save_wt () {
      if (this.multipleSelection2.length == 0) {
        this.$message.info("至少关联一条数据！");
        return false;
      }
      let array1 = [];//数组1
      this.multipleSelection2.forEach((item) => {
        array1.push(item);
      });
      console.log(array1);
      return
      // this.businessEvaluation = array1;

      this.dlag_Correlation_wt = false;//添加关联问题

    },
    // 生成报告
    query_report () {
      let params = {
        managementProjectUuid: this.managementProjectUuid,//项目id
        administrativeAdvice: this.administrativeAdvice,//管理建议
        businessEvaluation: this.businessEvaluation//经营评价
      }
      this.generate(params);//生成
    },
    // 生成
    generate (params) {
      task_pageList_export(params).then(resp => {
        console.log(resp.data);
      })
    },

  },

}
</script>

<style scoped>
.title_dlag {
  border-bottom: 1px solid #d2d2d2;
  padding: 10px;
  text-align: left;
}

.report {
}
.report >>> .header {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
}
.header >>> .el-row {
}
.top {
  padding: 20px;
  box-sizing: border-box;
}
.top >>> .el-row .el-col {
  width: 100%;
  display: flex;
  align-items: center;
}
.report >>> .el-textarea__inner {
  min-height: 250px !important;
  padding: 10px;
  box-sizing: border-box;
}
.report >>> .el-textarea.is-disabled,
.el-textarea__inner {
  background-color: #f5f7fa;
  border-color: #dfe4ed;
  color: #c0c4cc;
  cursor: n-resize;
  background: #fff;
}
.text {
  width: 100%;
  float: left;
  box-sizing: border-box;
  margin-top: 20px;
}
.dlag_conter3 {
  padding: 20px;
  box-sizing: border-box;
}
.dlag_conter3 >>> .el-table {
  overflow-y: auto;
  height: 300px;
}

.dlag_conter3 >>> .foot {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  padding-bottom: 25px;
  margin-top: 20px;
}
.bottom {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 20px;
  box-sizing: border-box;
}
.bottom p {
  display: flex;
  margin-right: 5px;
}
.flex_end {
  display: flex;
  margin-left: 100px;
}
.flex_end ul {
  display: flex;
  flex-wrap: wrap;
}
.flex_end ul li {
  width: 100%;
  display: flex;
  color: #4f9fdd;
  margin-bottom: 20px;
}
.flex_end ul li span {
  margin: 0 10px;
  color: rgba(0, 0, 0, 1);
  font-weight: 400;
}
</style>
