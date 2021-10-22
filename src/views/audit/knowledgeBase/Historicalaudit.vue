<template>
  <div class="sjzl anmition_show">
    <div class="header">
      <div class="search_ms">
        <p>历史审计发现描述</p>
        <el-input v-model="query.historyAuditFindDescribe "
                  placeholder="请输入文件名称"></el-input>
      </div>

      <!--自建任务 模型任务 筛选 -->
      <div class="search">
        <el-input placeholder="请输入发现人"
                  v-model="query.findPeople"> </el-input>
        <div class="search_icon">
          <i class="el-icon-search"
             style="color: rgba(0, 0, 0, 0.5)"></i>
        </div>
        <el-button type="primary"
                   @click="search_list()">筛选</el-button>
      </div>
    </div>
    <div class="header">
      <el-button type="primary"
                 @click="add_sj()">新增省内历史审计发现</el-button>
    </div>

    <div class="conter">

      <!-- 表单 -->
      <el-table :data="tableData_list"
                v-loading="loading"
                style="width: 100%">

        <el-table-column type="index"
                         label="序号"
                         width="50">
        </el-table-column>
        <!-- 历史审计发现 -->
        <el-table-column prop="historyAuditFindDescribe"
                         label="历史审计发现描述">
        </el-table-column>
        <!-- 被审计单位 -->
        <el-table-column prop="auditedEntity"
                         label="被审计单位">
        </el-table-column>

        <!-- 发现人 -->
        <el-table-column prop="findPeople"
                         label="发现人">
        </el-table-column>

        <!-- 审计依据 -->
        <el-table-column prop="auditBasis"
                         label="审计依据">

        </el-table-column>
        <!-- 发现时间 -->
        <el-table-column prop="findData"
                         label="发现时间">
          <template slot-scope="scope">
            <p>{{scope.row.findData |filtedate}}</p>
          </template>
        </el-table-column>
        <!-- 发现来源 -->
        <el-table-column prop="source"
                         label="发现来源 ">
        </el-table-column>

        <!-- 风险金额 -->
        <el-table-column prop="riskAmount"
                         label="风险金额">
        </el-table-column>

        <!-- 操作 -->
        <el-table-column prop="edit"
                         label="操作">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row.historyAuditFindUuid)"
                       type="primary"
                       style="color: #1371cc"
                       size="small">
              编辑
            </el-button>
            <el-button @click="delete_model(scope.row.historyAuditFindUuid)"
                       type="primary"
                       style="color: red"
                       size="small">
              删除
            </el-button>
          </template>

        </el-table-column>

      </el-table>
      <!-- 表单 end-->
    </div>

    <!-- 分页 -->
    <div class="page">
      <el-pagination background
                     layout="prev, pager, next"
                     :current-page="this.tableData.current"
                     @current-change="handleCurrentChange"
                     :page-size="this.tableData.size"
                     :total="this.tableData.total"></el-pagination>

    </div>
    <!-- 分页 end-->

    <!-- 新增 -->

    <!-- 自建任务新增 -->
    <el-dialog :title="title"
               :visible.sync="dialogVisible"
               style="padding-bottom: 59px">
      <div class="dlag_conter">
        <!-- 历史审计发现描述 -->
        <el-form label-width="80px">
          <p style="padding-top: 10px;">历史审计发现描述：</p>
          <el-input v-model="add.historyAuditFindDescribe"
                    placeholder="请输入历史审计发现描述"></el-input>
        </el-form>

        <!-- 被审计单位 -->
        <el-form label-width="80px">
          <p style="padding-top: 10px;">被审计单位：</p>

          <el-select v-model="add.auditedEntity"
                     @change="changeHeader_danwei">
            <el-option v-for="item in audit_Company"
                       :key="item.orgName"
                       :label="item.orgName"
                       :value="item.orgName">
            </el-option>
          </el-select>

        </el-form>

        <!-- 领域 -->
        <el-form label-width="80px">
          <p style="padding-top: 10px;">领域：</p>
          <el-select v-model="add.field"
                     @change="changeHeader_ly">
            <el-option v-for="item in problems_slect_ly"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form>

        <!-- 专题 -->
        <el-form label-width="80px">
          <p style="padding-top: 10px;">专题：</p>
          <el-select v-model="add.special"
                     @change="changeHeader_zt">
            <el-option v-for="item in problems_slect_zt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form>

        <!-- 发现人 -->
        <el-form label-width="80px">
          <p style="padding-top: 10px;">发现人：</p>
          <el-input v-model="add.findPeople"
                    placeholder="请输入发现人"></el-input>
        </el-form>

        <!--评审依据 -->
        <el-form label-width="80px">
          <p style="padding-top: 10px;">评审依据：</p>
          <el-select v-model="add.auditBasis"
                     @change="changeHeader_yj">
            <el-option v-for="item in problems_slect_yj"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form>

        <!--发现日期 -->
        <el-form label-width="80px">
          <p style="padding-top: 10px;">发现日期：</p>
          <el-date-picker v-model="add.findData"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form>

        <!--所属年份 -->
        <el-form label-width="80px">
          <p style="padding-top: 10px;">所属年份：</p>
          <!-- <el-select v-model="add.year"
                     @change="changeHeader_nf">
            <el-option v-for="item in problems_slect"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select> -->
          <el-date-picker v-model="add.year"
                          type="year"
                          placeholder="选择年"
                          value-format="yyyy"> </el-date-picker>

        </el-form>

        <!-- 发现来源 -->
        <el-form label-width="80px">
          <p style="padding-top: 10px;">发现来源：</p>
          <el-input v-model="add.source"
                    placeholder="请输入发现来源"></el-input>
        </el-form>

        <!-- 风险金额 -->
        <el-form label-width="80px">
          <p style="padding-top: 10px;">风险金额：</p>
          <el-input v-model="add.riskAmount"
                    placeholder="请输入风险金额"></el-input>
        </el-form>

        <span slot="footer">
          <el-button size="small"
                     type="primary"
                     v-if="title=='新增'"
                     @click="save(1)">确 定</el-button>
          <el-button size="small"
                     type="primary"
                     v-else
                     @click="save(2)">确 定</el-button>
          <el-button size="small"
                     @click="dialogVisible = false">取 消</el-button>
        </span>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fmtDate } from '@SDMOBILE/model/time.js';
import { historicalaudit_pageList, historicalaudit_add, historicalaudit_details, historicalaudit_update, historicalaudit_delete, historicalaudit_loaauditorg } from '@SDMOBILE/api/shandong/Historicalaudit'

import { task_problems_loadcascader } from '@SDMOBILE/api/shandong/task'
export default {
  components: {},
  data () {
    return {
      loading: false,
      dialogVisible: false,
      title: '',
      tableData: [],//列表
      tableData_list: [],//列表
      historyAuditFindUuid: '',//id 删除 编辑 

      query: {
        pageNo: 1,
        pageSize: 10,
        findPeople: '',//发现人 
        historyAuditFindDescribe: '',//描述
      },

      // 新增
      add: {
        historyAuditFindDescribe: '',//发现描述
        auditedEntity: '',//被审计单位
        field: '',//领域
        special: '',//专题
        findPeople: '',//发现人
        auditBasis: '',//依据
        findData: '',//发现日期
        year: '',//所属年份
        source: '',//来源
        riskAmount: '',//金额
      },
      problems_slect_ly: [],//领域
      problems_slect_zt: [],//专题
      audit_Company: [],//审计单位
      problems_slect_yj: [],//评审依据
    }
  },
  computed: {},
  watch: {},
  created () {
    // list
    let params = {
      pageNo: this.query.pageNo,
      pageSize: this.query.pageSize,
      condition: {
        findPeople: this.query.findPeople,
        historyAuditFindDescribe: this.query.historyAuditFindDescribe,
      }
    };
    this.page_list(params);

    let params2 = {
      typecode: 'Category',
    }
    this.lingyu(params2);//领域

    let params3 = {
      typecode: 'SPECIAL',
    }
    this.zhuanti(params3);//专题


    let params4 = {
      entity: {},
    }
    this.Company(params4);//审计单位
  },
  mounted () {

  },

  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      // return fmtDate(t, 'yyyy-MM-dd hh:mm:ss');
      return fmtDate(t, 'yyyy-MM-dd');

    }
  },

  methods: {
    // 列表
    page_list (params) {
      this.loading = true
      historicalaudit_pageList(params).then(resp => {
        this.tableData = resp.data
        this.tableData_list = resp.data.records;
        console.log(this.tableData);
        this.loading = false
      })
    },
    // 分页
    handleCurrentChange (val) {
      let params = {
        pageNo: val,
        pageSize: this.query.pageSize,
        condition: {
          findPeople: this.query.findPeople,
          historyAuditFindDescribe: this.query.historyAuditFindDescribe,
        }
      }
      this.page_list(params);

    },
    // 筛选人
    search_list () {
      let params = {
        pageNo: this.query.pageNo,
        pageSize: this.query.pageSize,
        condition: {
          findPeople: this.query.findPeople,
          historyAuditFindDescribe: this.query.historyAuditFindDescribe,
        }
      }
      this.page_list(params);

    },
    // 新增
    add_sj () {
      this.add = {};
      this.title = '新增';
      this.dialogVisible = true;
    },
    // 新增 编辑保存
    save (index) {
      if (index == 1) {
        // 新增保存
        let params = {
          historyAuditFindDescribe: this.add.historyAuditFindDescribe,//发现描述
          auditedEntity: this.add.auditedEntity,//被审计单位
          field: this.add.field,//领域
          special: this.add.special,//专题
          findPeople: this.add.findPeople,//发现人
          auditBasis: this.add.auditBasis,//依据
          findData: this.add.findData,//发现日期
          year: this.add.year,//所属年份
          source: this.add.source,//来源
          riskAmount: this.add.riskAmount,//金额

        }
        // 新增
        historicalaudit_add(params).then(resp => {
          console.log(resp.data);
          if (resp.code == 0) {
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            this.dialogVisible = false;
            // 刷新列表
            let params2 = {
              pageNo: this.query.pageNo,
              pageSize: this.query.pageSize,
              condition: {
                findPeople: this.query.findPeople,
                historyAuditFindDescribe: this.query.historyAuditFindDescribe,
              }
            }
            this.page_list(params);
          } else {
            this.$message({
              message: resp.msg,
              type: 'error'
            });
          }
        })

      } else {
        // 编辑保存
        let params = {
          historyAuditFindDescribe: this.add.historyAuditFindDescribe,//发现描述
          auditedEntity: this.add.auditedEntity,//被审计单位
          field: this.add.field,//领域
          special: this.add.special,//专题
          findPeople: this.add.findPeople,//发现人
          auditBasis: this.add.auditBasis,//依据
          findData: this.add.findData,//发现日期
          year: this.add.year,//所属年份
          source: this.add.source,//来源
          riskAmount: this.add.riskAmount,//金额
          historyAuditFindUuid: this.historyAuditFindUuid// 主键id

        }
        // 编辑保存
        historicalaudit_update(params).then(resp => {
          if (resp.code == 0) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            });
            this.dialogVisible = false;
            // 刷新列表
            let params2 = {
              pageNo: this.query.pageNo,
              pageSize: this.query.pageSize,
              condition: {
                findPeople: this.query.findPeople,
                historyAuditFindDescribe: this.query.historyAuditFindDescribe,
              }
            }
            this.page_list(params);
          } else {
            this.$message({
              message: resp.msg,
              type: 'error'
            });
          }
        })


      }
    },
    // 编辑
    edit (id) {
      this.historyAuditFindUuid = id
      this.title = '编辑';
      this.dialogVisible = true;
      let params = {
        id: this.historyAuditFindUuid
      }
      // 编辑详情
      historicalaudit_details(params).then(resp => {
        console.log(resp.data);
        let data = resp.data;
        this.add.historyAuditFindDescribe = data.historyAuditFindDescribe,//发现描述
          this.add.auditedEntity = data.auditedEntity//被审计单位
        this.add.field = data.field//领域
        this.add.special = data.special;//专题
        this.add.findPeople = data.findPeople;//发现人
        this.add.auditBasis = data.auditBasis; //依据
        this.add.findData = data.findData;//发现日期
        this.add.year = data.year;//所属年份
        this.add.source = data.source;//来源
        this.add.riskAmount = data.riskAmount;//金额


      })
    },
    // 删除
    delete_model (id) {
      this.historyAuditFindUuid = id
      let params = {
        ids: this.historyAuditFindUuid
      }
      // 删除
      historicalaudit_delete(params).then(resp => {
        console.log(resp.data);
        if (resp.code == 0) {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          // 刷新列表
          let params2 = {
            pageNo: this.query.pageNo,
            pageSize: this.query.pageSize,
            condition: {
              findPeople: this.query.findPeople,
              historyAuditFindDescribe: this.query.historyAuditFindDescribe,
            }
          }
          this.page_list(params);
        } else {
          this.$message({
            message: resp.msg,
            type: 'error'
          })
        }
      })
    },

    // 领域select
    lingyu (params) {
      task_problems_loadcascader(params).then(resp => {
        this.problems_slect_ly = resp.data
      })
    },
    // 专题
    zhuanti (params) {
      task_problems_loadcascader(params).then(resp => {
        this.problems_slect_zt = resp.data
      })
    },
    // 审计单位
    Company (params) {
      historicalaudit_loaauditorg(params).then(resp => {
        this.audit_Company = resp.data
      })
    },
    // 单位
    changeHeader_danwei (val) {
      this.add.auditedEntity = val
    },

    // 领域change  
    changeHeader_ly (val) {
      this.add.field = val
    },
    // 专题change  
    changeHeader_zt (val) {
      this.add.special = val
    },

    // 依据change  
    changeHeader_yj (val) {
      this.add.auditBasis = val
    },
    // 年份change  
    changeHeader_nf (val) {
      this.add.year = val
    },

  },

}
</script>

<style scoped>
.app-main {
  background-color: #fff;
}
.header {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
}
.search_ms {
  display: flex;
  align-items: center;
}
.search_ms p {
  min-width: 130px;
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
  width: 180px;
  display: flex;
  float: right;
}
.search >>> .search_icon {
  position: absolute;
  top: 0;
  right: 70px;
  width: 37px;
  height: 37px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.search >>> .el-button {
  border-radius: 0 5px 5px 0;
  /* background: #1371cc !important; */
}

.conter {
  display: flex;
  padding: 0 20px;
  box-sizing: border-box;
}
.conter >>> .el-table {
  min-height: 500px;
}
.dlag_conter {
  padding-bottom: 25px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.dlag_conter >>> p {
  min-width: 120px;
  text-align: right;
}
.dlag_conter >>> .el-form {
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  box-sizing: border-box;
}
.dlag_conter >>> .el-input {
  width: 300px;
}
.dlag_conter >>> .el-form-item {
  margin-bottom: 20px !important;
  display: flex;
}

.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
