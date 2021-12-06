<template>
  <!-- 被审计 编辑-->
  <div>
    <div class="header_dlag">
      <div class="search">
        <el-button type="primary"
                   @click="go_back()">
          返回上一页
        </el-button>
        <el-input placeholder="请输入项目名称"
                  v-model="list_query.problem"> </el-input>
        <div class="search_icon"
             style=" background: rgb(12, 135, 214) !important;"
             @click="search_list_details()">
          <i class="el-icon-search"
             style="color: white;"></i>
        </div>
      </div>
    </div>

    <div class="padding">
      <el-table :data="tableData.records"
                :header-cell-style="{'background-color': '#F4FAFF',}"
                v-loading="loading"
                style="width: 100%">
        <el-table-column type="index"
                         label="序号"
                         width="50">
        </el-table-column>
        <el-table-column prop="problem"
                         show-overflow-tooltip
                         label="问题">

          <template slot-scope="scope">
            <p v-if="scope.row.problem">
              {{scope.row.problem}}
            </p>
            <p v-else>
              --
            </p>
          </template>

        </el-table-column>
        <el-table-column prop="dutyDeptName"
                         show-overflow-tooltip
                         label="主要负责部门">
          <template slot-scope="scope">
            <p v-if="scope.row.dutyDeptName">
              {{scope.row.dutyDeptName}}
            </p>
            <p v-else>
              --
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="dutyPersonName"
                         show-overflow-tooltip
                         label="整改责任人">

          <template slot-scope="scope">
            <p v-if="scope.row.dutyPersonName">
              {{scope.row.dutyPersonName}}
            </p>
            <p v-else>
              --
            </p>
          </template>

        </el-table-column>
        <el-table-column prop="planContent"
                         show-overflow-tooltip
                         label="整改计划">

          <template slot-scope="scope">
            <p v-if="scope.row.planContent">
              {{scope.row.planContent}}
            </p>
            <p v-else>
              --
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="limitTime"
                         show-overflow-tooltip
                         label="预计整改完成时限">

          <template slot-scope="scope">
            <p v-if="scope.row.limitTime">
              {{scope.row.limitTime}}
            </p>
            <p v-else>
              --
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="remark"
                         show-overflow-tooltip
                         label="备注">
          <template slot-scope="scope">
            <p v-if="scope.row.remark">
              {{scope.row.remark}}
            </p>
            <p v-else>
              --
            </p>
          </template>
        </el-table-column>

        <el-table-column prop="problem"
                         label="操作">
          <template slot-scope="scope">

            <el-button type="text"
                       v-if="!type"
                       @click="edit(scope.row)"
                       style="color: #0c87d6!important;
                               font-size: 14px !important;
">
              编辑
            </el-button>

            <p v-else>
              --
            </p>

          </template>
        </el-table-column>

      </el-table>

      <!-- 分页 -->
      <div class="page">
        <el-button type="primary"
                   v-if="!type"
                   :disabled="isDisable"
                   @click="post()"
                   class="post">
          提交审核
        </el-button>
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

    <!-- 编辑 -->
    <el-dialog title=""
               center
               @close="resetForm_verify('save')"
               :visible.sync="dialogVisible_edit"
               width="40%">
      <div class="title">编辑问题</div>

      <div class="dialog">
        <el-form ref="save"
                 label-width="150px"
                 :rules="saveRules"
                 :model="save">
          <el-form-item label="主要负责部门："
                        prop="dutyDeptName">
            <el-input placeholder="请输入主要负责部门"
                      v-model="save.dutyDeptName">
            </el-input>
          </el-form-item>

          <el-form-item prop="dutyPersonName"
                        label="整改责任人：">
            <el-input placeholder="请输入整改责任人"
                      v-model="save.dutyPersonName"></el-input>
          </el-form-item>

          <el-form-item prop="planContent"
                        label="整改计划：">
            <el-input type="textarea"
                      class="resizeNone"
                      placeholder="请输入整改计划"
                      v-model="save.planContent"></el-input>
          </el-form-item>

          <el-form-item prop="limitEndTime"
                        label="预计整改完成时限：">
            <el-date-picker type="date"
                            value-format="yyyy-MM-dd"
                            v-model="save.limitEndTime"
                            placeholder="请选择预计整改完成时限">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea"
                      placeholder="请输入备注"
                      v-model="save.remark"
                      class="resizeNone"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">

        <el-button @click="dialogVisible_edit = false"
                   plain
                   style="background: #FFFFFF;
    border: 1px solid #DCDFE6;">取 消</el-button>
        <el-button type="primary"
                   :disabled="isDisable"
                   @click="save_btn('save')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { pageList, editProblemCorrect, submitReview, post_rules } from "@SDMOBILE/api/shandong/rectificationPlan_audited_edit";//lhg
export default {
  components: {},
  data () {
    return {
      loading: false,
      type: '',//查看
      list_query: {
        pageNo: 1,
        pageSize: 10,
        id: '',
        problem: '',
      },
      tableData: [],
      tableData2: [],
      dialogVisible_edit: false,//编辑
      save: {
        dutyDeptName: '',//主要负责部门
        dutyPersonName: '',//整改责任人
        planContent: '',//整改计划
        limitEndTime: '',//选择日期
        remark: '',//备注
      },
      isDisable: false,//防止重复提交
      // 添加经责表单校验
      saveRules: {
        dutyDeptName: [
          { required: true, message: "请填写主要部门", trigger: "blur" },
        ],
        dutyPersonName: [
          { required: true, message: "请填写整改责任人", trigger: "blur" },
        ],
        planContent: [
          { required: true, message: "请填写整改计划", trigger: "blur" },
        ],
        limitEndTime: [
          { required: true, message: "请选择预计完成时限", trigger: "change" },
        ],
        remark: [
          { required: true, message: "请填写备注", trigger: "blur" },
        ],
      },

    }
  },
  computed: {},
  watch: {},
  created () {
    this.list_query.id = this.$route.params && this.$route.params.id
    this.type = this.$route.query.type
    this.page_list_data()
  },
  mounted () {

  },
  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      // return fmtDate(t, 'yyyy-MM-dd hh:mm:ss');
      return fmtDate(t, 'yyyy-MM-dd ');
    }
  },
  methods: {
    go_back () {
      this.$router.push({ path: '/auditCorrective/rectificationPlan_audited' })
    },


    // 列表
    page_list_data () {
      this.loading = true;
      let params = {
        pageNo: this.list_query.pageNo,
        pageSize: this.list_query.pageSize,
        condition: {
          managementProjectUuid: this.list_query.id,
          problem: this.list_query.problem,
        }
      };
      pageList(params).then(resp => {
        this.tableData = resp.data;
        this.loading = false;
      })
    },
    // 每页条数
    handleSizeChange (val) {
      this.list_query.pageSize = val
    },
    // 分页
    handleCurrentChange (val) {
      this.list_query.pageNo = val;
      this.page_list_data();//刷新列表
    },
    // 筛选
    search_list_details () {
      this.page_list_data();//刷新列表
    },
    // 编辑
    edit (data) {
      console.log(data);
      this.dialogVisible_edit = true;
      this.tableData2 = data
      this.save.dutyDeptName = data.dutyDeptName;//主要负责部门
      this.save.dutyPersonName = data.dutyPersonName;//整改责任人
      this.save.planContent = data.planContent;//整改计划
      this.save.limitEndTime = data.limitEndTime;//预计整改完成时限
      this.save.remark = data.remark;//备注

      this.save = JSON.parse(JSON.stringify(this.save));

      this.$nextTick(() => {
        this.$refs["save"].clearValidate();
      });
    },


    // 提交
    post () {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
      let params = {
        managementProjectUuid: this.list_query.id
      };
      // 判断是否可以审核
      post_rules(params).then(resp => {
        if (resp.code == 0) {
          if (resp.data.submitPro == 0) {
            submitReview(params).then(resp => {
              console.log(resp.data);
              if (resp.code == 0) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                // this.page_list_data()//刷新列表
                this.$router.push({ path: '/auditCorrective/rectificationPlan_audited' })
              } else {
                this.$message({
                  message: resp.msg,
                  type: 'error'
                });
              }
            })
          } else {
            this.$message({
              message: '请先完善信息再提交',
              type: 'warning'
            });
          }
        } else {
          this.$message({
            message: resp.msg,
            type: 'error'
          });
        }
      })
    },

    // 关闭弹窗
    resetForm_verify (save) {
      this.save.limitTime = '';//清空时间
      this.save = {};
      this.$refs[save].resetFields();
    },
    // 保存
    save_btn (save) {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 2000);

      this.$refs[save].validate((valid) => {
        if (valid) {
          let params = {
            dutyDeptName: this.save.dutyDeptName,//主要负责部门
            dutyPersonName: this.save.dutyPersonName,//整改责任人
            planContent: this.save.planContent,//整改计划
            limitEndTime: this.save.limitEndTime,//选择日期
            remark: this.save.remark,//备注
            problemCorrectUuid: this.tableData2.problemCorrectUuid,//  problemCorrectUuid
          };
          this.post_save(params);
        } else {
          this.$message.info("请填写信息");
          return false;
        }
      })
    },

    post_save (params) {
      editProblemCorrect(params).then(resp => {
        console.log(resp);
        if (resp.code == 0) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          });
          this.dialogVisible_edit = false;
          this.page_list_data()//刷新列表
        } else {
          this.$message({
            message: resp.msg,
            type: 'error'
          });
        }
      })
    }
  },
}
</script>

<style scoped>
>>> .foot .el-button {
  font-weight: normal;
}
.search >>> .el-input__inner::-webkit-input-placeholder {
  color: #c0c4cc !important;
}
>>> .el-dialog--center .el-dialog__body {
  padding: 0 !important;
}

>>> .el-dialog--center .el-dialog__body .el-form-item__label {
  font-size: 14px;
}
/* 筛选 */
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
/* 分页 */
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.page >>> .post {
  position: absolute;
  left: 50%;
  top: 0;
  left: 50%;
  transform: translate(-50%, 15px);
}

.padding {
  padding: 0 20px 20px;
  box-sizing: border-box;
}
.dialog >>> .el-textarea__inner {
  height: 35px;
}

.resizeNone .el-textarea__inner {
  resize: none;
}

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
.dialog >>> .el-form-item__content {
  flex: inherit !important;
  margin-left: 0 !important;
}
.dialog >>> .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100% !important;
}

.dialog >>> .el-form-item {
  display: flex;
  justify-content: center;
  margin-bottom: 20px !important;
}

.dialog >>> .el-form-item--medium .el-form-item__label {
  line-height: 36px;
  float: left !important;
  min-width: 120px;
}

.dialog >>> .el-input--medium .el-input__inner {
  height: 36px;
  line-height: 36px;
  width: 220px !important;
}
.dialog >>> .el-input__inner::-webkit-input-placeholder,
.dialog >>> textarea::-webkit-input-placeholder {
  color: #c0c4cc !important;
  font-weight: 400 !important;
  font-size: 12px !important;
  letter-spacing: 0px !important;
  font-family: -apple-system-font, BlinkMacSystemFont, "Helvetica Neue",
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei",
    Arial, sans-serif !important;
}
.dialog >>> textarea {
  min-height: 37px !important;
  padding: 0 10px !important;
  line-height: 36px;
  width: 220px !important;
}
</style>
