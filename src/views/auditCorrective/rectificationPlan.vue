<template>
  <div class="rectificationPlan">
    <!-- 筛选 -->
    <el-row>

      <div class="search">
        <el-input placeholder="请输入项目名称"
                  v-model="list_query.projectName"
                  @keyup.enter.native="search">
        </el-input>
        <div class="search_icon"
             style="background: rgb(12, 135, 214) !important"
             @click="search()">
          <i class="el-icon-search"
             style="color: white"></i>
        </div>
      </div>
    </el-row>
    <!-- 筛选 end-->

    <!-- 整改列表 -->
    <div class="table_padding">

      <el-table :data="tableData.records"
                v-loading="loading"
                @selection-change="handleSelectionChange_list"
                :header-cell-style="{'background-color': '#F4FAFF',}"
                stripe
                style="width: 100%;min-height:400px">

        <el-table-column type="selection"
                         align="center"> </el-table-column>

        <el-table-column type="index"
                         label="序号"
                         width="50">
        </el-table-column>
        <el-table-column prop="projectName"
                         label="审计项目名称">
        </el-table-column>
        <el-table-column prop="projectTypeName"
                         label="项目类型"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="projectLeaderName"
                         label="项目负责人"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="correctUserName"
                         label="整改跟进人"
                         show-overflow-tooltip>

          <template slot-scope="scope">
            <div v-if="scope.row.correctUserName">
              {{scope.row.correctUserName }}
            </div>
            <div v-else>
              --
            </div>
          </template>

        </el-table-column>
        <el-table-column prop="correctSend"
                         label="计划是否下发"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.correctSend">
              {{
                  scope.row.correctSend == 0
                    ? "未下发"
                    : scope.row.correctSend == 1
                    ? "已下发":''
                }}
            </div>
            <div v-else>--</div>
          </template>

        </el-table-column>
        <el-table-column prop="problem"
                         label="操作"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text"
                       @click="details_click(scope.row.managementProjectUuid)"
                       style="color: #0c87d6!important;
                               font-size: 14px !important;
">
              查看
            </el-button>
            <el-button type="text"
                       v-if="scope.row.auditConf == 2"
                       @click="push(scope.row)"
                       style="color: #0c87d6!important;
                               font-size: 14px !important;
">
              下发
            </el-button>
            <!--  -->
            <el-button type="text"
                       v-if="scope.row.auditConf == 3"
                       @click="examine(scope.row.managementProjectUuid)"
                       style="color: #0c87d6!important;
                               font-size: 14px !important;
">
              审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 整改列表 end-->

      <!--  启动整改 -->
      <div class="setting_people">
        <el-button type="primary"
                   @click="run_rectification()">启动整改</el-button>
      </div>
      <!-- 分页 -->
      <div class="page">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="this.tableData.current"
                       :page-size="this.tableData.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="this.tableData.total">
        </el-pagination>
      </div>
      <!-- 分页 end-->
    </div>

    <!-- 启动整改 -->
    <el-dialog :visible.sync="dialogVisible_rectification"
               center
               :append-to-body='true'
               class="up_person"
               @close="resetForm2('save_project_prople')"
               width="45%">
      <div class="title">启动整改</div>

      <div class="dialog">
        <div class="dialog ">
          <el-form ref="save_project_prople"
                   :model="save_project_prople"
                   :inline="false"
                   v-loading="edit_people_loading"
                   :rules='rules_people'>
            <div class="people">
              <p><span style="color:red">*</span> 整改期限：</p>
              <el-form-item label-width="80px"
                            prop="beginTime">
                <el-date-picker type="date"
                                value-format="yyyy-MM-dd"
                                v-model="save_project_prople.beginTime"
                                style="margin-right:15px;"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label-width="80px"
                            prop="endTime">
                <el-date-picker type="date"
                                value-format="yyyy-MM-dd"
                                v-model="save_project_prople.endTime"
                                :picker-options="pickeroptions"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="people err_select">
              <el-form-item label-width="80px"
                            prop="setting_people_key">
                <p><span style="color:red">*</span>整改跟进人：</p>
                <el-select v-model="save_project_prople.setting_people_key"
                           @change="change_peoplr"
                           filterable
                           placeholder="请选择整改跟进人">
                  <el-option v-for="item in setting_people"
                             :key="item.id"
                             :label="item.realName"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="footer">
        <el-button plain
                   @click="dialogVisible_rectification = false">取 消</el-button>
        <el-button type="primary"
                   :disabled="isDisable"
                   @click="save_people('save_project_prople')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 启动整改 end-->

  </div>
</template>

<script>
import { isStartProject, startProject, follow_up_person } from "@SDMOBILE/api/shandong/adminProject";//lhg

import { pageProblemCorrectList, details_pageList, isProjectLeader, issueProject } from "@SDMOBILE/api/shandong/recitFicationPlan";//lhg

export default {
  data () {
    return {
      pickeroptions: {
        disabledDate: (time) => {
          if (this.save_project_prople.beginTime) {
            return time.getTime() < new Date(this.save_project_prople.beginTime).getTime();
          }
        }
      },
      // 列表参数
      list_query: {
        pageNo: 1,
        pageSize: 10,
        projectName: '',//筛选项目name
      },
      loading: false,
      tableData: [],//列表数据
      project_list: [],//列表多选

      dialogVisible_setting_prople: false,//项目整改跟进人
      dialogVisible_rectification: false,//启动整改



      // 设置整改跟进人
      project_list: [],//项目列表 多选
      setting_people: [],//跟进人
      edit_people_loading: false,
      save_project_prople: {
        setting_people_name: '',//选择的整改跟进人
        setting_people_key: '',
        beginTime: '',//开始时间
        endTime: '',//结束时间
      },

      rules_people: {
        setting_people_key: [{ required: true, message: '请选择跟进人', trigger: 'change' }],
        beginTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
      },

      projectid: '',//获取项目的id
      isDisable: false,//防止重复提交

    }
  },
  created () {
    this.pageProblemCorrectList_data();//列表
  },
  methods: {

    // 列表
    pageProblemCorrectList_data () {
      this.loading = true;
      let params = {
        pageNo: this.list_query.pageNo,
        pageSize: this.list_query.pageSize,
        condition: {
          projectName: this.list_query.projectName,
        }
      }
      pageProblemCorrectList(params).then(resp => {

        this.loading = false;
        this.tableData = resp.data
      })
    },

    // 列表 筛选
    search () {
      this.list_query.pageNo = 1;
      this.pageProblemCorrectList_data();//列表
    },
    // 列表每条条数
    handleSizeChange (val) {
      this.list_query.pageSize = val;
      this.pageProblemCorrectList_data();//列表

    },
    // 列表分页
    handleCurrentChange (val) {
      this.list_query.pageNo = val;
      this.pageProblemCorrectList_data();//列表

    },

    // 列表多选
    handleSelectionChange_list (val) {
      this.project_list = val;
    },



    // 整改人  change
    change_peoplr (val) {
      let obj = {};
      obj = this.setting_people.find((item) => {
        return item.id === val;
      });
      this.save_project_prople.setting_people_name = obj.realName//选择的整改人   key
      this.save_project_prople.setting_people_key = val//选择的整改人
    },

    // 启动整改显示弹窗
    run_rectification () {
      if (this.project_list.length !== 1) {
        this.$message({ message: '请选择一条项目进行启动整改' })
        return
      } else {
        this.run_startProject();//是否启动整改
      }
    },

    // 启动整改
    run_startProject () {
      let params = {
        managementProjectUuid: this.project_list[0].managementProjectUuid,
        managementAdvice: this.project_list[0].managementAdvice,//
        projectLeaderUuid: this.project_list[0].projectLeaderUuid,
        correctSend: this.project_list[0].correctSend
      }

      // 是否启动整改
      isProjectLeader(params).then(resp => {
        if (resp.code == 0) {
          let _data = resp.data
          if (_data.isStartProject == 0) {
            this.dialogVisible_rectification = true;//启动整改 弹窗
            // 获取整改人
            var ids = []
            this.project_list.forEach((r, i) => {
              ids.push(r.managementProjectUuid)
            })
            this.projectid = ids[0]
            this.setting_follow_prople()//整改人 数据

            // 启动过整改  回显
            if (_data.managementAdvice == 1) {
              this.edit_people_loading = true;
              // 整改期限
              this.save_project_prople.beginTime = this.project_list[0].beginTime;
              this.save_project_prople.endTime = this.project_list[0].endTime;
            }
          } else {
            this.$message({ message: "请选择可以启动整改的项目进行整改" });
          }
        } else {
          this.$message({
            message: resp.msg,
            type: "error"
          });
        }
      })
    },

    // 设置跟进人 data
    setting_follow_prople () {
      let params = {
        projectid: this.projectid,
        pageSize: '1000',
        pageCurrent: '1',
      }
      // 获取跟进人
      follow_up_person(params).then(resp => {
        this.setting_people = resp.data.list;
        this.setting_people.forEach(item => {
          if (item.id == this.project_list[0].correctUser) {
            this.save_project_prople.setting_people_key = item.id;
            this.save_project_prople.setting_people_name = item.realName
          }
        })
        this.edit_people_loading = false;

      })
    },


    // 设置整改跟进人 参数
    save_people (save_project_prople) {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      this.$refs[save_project_prople].validate((valid) => {
        if (valid) {
          let params2 = {
            correctUser: this.save_project_prople.setting_people_key,//跟进人 key
            correctUserName: this.save_project_prople.setting_people_name,//跟进人 name
            managementProjectUuid: this.projectid,//项目id
            beginTime: this.save_project_prople.beginTime,//开始时间
            endTime: this.save_project_prople.endTime,//结束时间
            managementAdvice: "1",
          }
          // 去整改
          startProject(params2).then(resp => {

            if (resp.code == 0) {
              this.$message({
                message: '整改成功',
                type: 'success'
              });
              this.dialogVisible_rectification = false;//启动整改 弹窗
              this.pageProblemCorrectList_data();//刷新列表

            } else {
              this.$message({
                message: resp.msg,
                type: "error"
              });
            }
          })
          // 去整改 end
        } else {
          this.$message.info("请填写信息");
          return false;
        }
      })
    },
    // 关闭整改 弹窗
    resetForm2 (save_project_prople) {
      this.$refs[save_project_prople].resetFields();
    },


    // 查看详情
    details_click (id) {
      this.$router.push({ path: 'rectificationPlan/details/' + id })
    },
    // 下发
    push (data) {

      this.$confirm(`确认下发吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            managementProjectUuid: data.managementProjectUuid,//项目id
            projectName: data.projectName,//项目名称
            auditOrgUuid: data.auditOrgUuid,//被审计单位
            correctSend: 1,//是否下发
          };
          issueProject(params).then(resp => {

            if (resp.code == 0) {
              this.$message({
                message: '下发成功',
                type: 'success'
              });
              this.pageProblemCorrectList_data();//刷新列表
            } else {
              this.$message({
                message: resp.msg,
                type: 'error'
              });
            }
          })
        })
        .catch(() => { });
    },
    // 审核
    examine (id) {
      this.$router.push({ path: 'rectificationPlan/examine/' + id })
    },



  }
}
</script>

<style scoped>
/* @import "../../../assets/styles/css/lhg.css"; */
>>> .foot .el-button {
  font-weight: normal;
}
>>> .el-dialog--center .el-dialog__body {
  padding: 0 !important;
}
>>> .el-dialog--center .el-dialog__body .el-form-item__label {
  font-size: 14px;
}
/* 筛选 */
.search >>> .el-input__inner::-webkit-input-placeholder {
  color: #c0c4cc !important;
}
.search {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
}
.search >>> .el-input__inner {
  width: 250px !important;
  display: flex;
  float: right;
  border-radius: 0 !important;
}
.search >>> .el-button {
  border-radius: 0 !important;
}
.search >>> .search_icon {
  position: absolute;
  top: 20px;
  right: 20px;
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
  cursor: pointer;
}
/* 筛选  end*/

.table_padding {
  padding: 0 20px 20px;
  box-sizing: border-box;
}
/* 分页 */
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}

/* 整改跟进人 */
.up_person {
  min-width: 650px;
}
.follow_up_person {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.follow_up_person p {
  min-width: 90px;
  text-align: right;
}

.follow_up_person >>> .el-form {
  margin: 0 auto;
  width: 520px;
}
.up_person >>> .el-form-item {
  margin-bottom: 0 !important;
}
.people {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 20px !important;
}
.people p {
  width: 100px;
  text-align: right;
}
.people >>> .el-form-item__content {
  margin-left: 0 !important;
}
.people >>> .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.people >>> .el-form-item__content {
  display: flex;
}
.err_select >>> .el-form-item__error {
  left: 90px;
}
/* 整改跟进人 end*/

/* 弹窗 title */
.dialog {
  padding: 0 20px 20px;
  box-sizing: border-box;
}

.title {
  border-bottom: 1px solid #d2d2d2;
  padding: 10px;
  text-align: center;
  margin-bottom: 3%;
}
/* 弹窗 title end*/

.setting_people {
  padding: 10px 20px 20px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}
.setting_people >>> .el-button {
  margin: 0 20px;
}
</style>
