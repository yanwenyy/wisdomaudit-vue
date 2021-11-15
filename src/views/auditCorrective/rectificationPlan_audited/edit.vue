<template>
  <!-- 被审计 编辑-->
  <div>
    <div class="header_dlag">
      <div class="search">
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
                :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
                v-loading="loading"
                style="width: 100%">
        <el-table-column type="index"
                         label="序号"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         prop="problem"
                         show-overflow-tooltip
                         label="问题">
        </el-table-column>
        <el-table-column align="center"
                         prop="dutyDeptName"
                         show-overflow-tooltip
                         label="主要负责部门">
        </el-table-column>
        <el-table-column align="center"
                         prop="dutyPersonName"
                         show-overflow-tooltip
                         label="整改责任人">

        </el-table-column>
        <el-table-column align="center"
                         prop="planContent"
                         show-overflow-tooltip
                         label="整改计划">
        </el-table-column>
        <el-table-column align="center"
                         prop="limitTime"
                         show-overflow-tooltip
                         label="预计整改完成时限">
        </el-table-column>
        <el-table-column align="center"
                         prop="remark"
                         show-overflow-tooltip
                         label="备注">

        </el-table-column>

        <el-table-column align="center"
                         prop="problem"
                         label="操作">
          <template slot-scope="scope">

            <el-button type="text"
                       @click="edit(scope.row)"
                       style="color: rgb(68, 163, 223);">
              编辑
            </el-button>

          </template>
        </el-table-column>

      </el-table>

      <!-- 分页 -->
      <div class="page">
        <el-button type="primary"
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
               :visible.sync="dialogVisible_edit"
               width="60%">
      <div class="title">启动整改</div>
      <div class="dialog">
        <el-table :data="tableData.records"
                  :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
                  v-loading="loading"
                  style="width: 100%">
          <el-table-column type="index"
                           label="序号"
                           width="50">
          </el-table-column>
          <el-table-column align="center"
                           prop="problem"
                           show-overflow-tooltip
                           label="问题">
          </el-table-column>
          <el-table-column align="center"
                           prop="dutyDeptName"
                           label="主要负责部门">
            <template slot-scope="scope">
              <el-input placeholder=""
                        v-model="save.dutyDeptName"></el-input>
            </template>

          </el-table-column>
          <el-table-column align="center"
                           prop="dutyPersonName"
                           label="整改责任人">
            <template slot-scope="scope">
              <el-input placeholder=""
                        v-model="save.dutyPersonName"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           prop="planContent"
                           label="整改计划">
            <template slot-scope="scope">
              <el-input type="textarea"
                        class="resizeNone"
                        v-model="save.planContent"></el-input>
            </template>

          </el-table-column>
          <el-table-column align="center"
                           prop="limitTime"
                           label="预计整改完成时限">
            <template slot-scope="scope">
              <el-date-picker type="date"
                              v-model="save.limitTime"
                              placeholder="选择日期">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           prop="remark"
                           label="备注">
            <template slot-scope="scope">
              <el-input type="textarea"
                        v-model="save.remark"
                        class="resizeNone"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible_edit = false">取 消</el-button>
        <el-button type="primary"
                   @click="save_btn()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { pageList, editProblemCorrect, submitReview } from "@SDMOBILE/api/shandong/rectificationPlan_audited_edit";//lhg
export default {
  components: {},
  data () {
    return {
      loading: false,
      list_query: {
        pageNo: 1,
        pageSize: 10,
        id: '',
        problem: '',
      },
      tableData: [],
      dialogVisible_edit: false,//编辑
      save: {
        dutyDeptName: '',//主要负责部门
        dutyPersonName: '',//整改责任人
        planContent: '',//整改计划
        limitEndTime: '',//选择日期
        remark: '',//备注
      },
      isDisable: false,//防止重复提交

      edit_list_data: '',//进编辑的数据
    }
  },
  computed: {},
  watch: {},
  created () {
    this.list_query.id = this.$route.params && this.$route.params.id
    this.page_list_data()
  },
  mounted () {

  },
  methods: {
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
      console.log(params);
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
      this.edit_list_data = data;//选择的数据
      this.dialogVisible_edit = true;
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
      submitReview(params).then(resp => {
        console.log(resp.data);
        if (resp.code == 0) {
          this.$message({
            message: '提交成功',
            type: 'success'
          });
          this.page_list_data()//刷新列表
        } else {
          this.$message({
            message: resp.msg,
            type: 'error'
          });
        }
      })
    },

    // 保存
    save_btn () {
      let params = {
        dutyDeptName: this.save.dutyDeptName,//主要负责部门
        dutyPersonName: this.save.dutyPersonName,//整改责任人
        planContent: this.save.planContent,//整改计划
        limitEndTime: this.save.limitEndTime,//选择日期
        remark: this.save.remark,//备注
        problemCorrectUuid: this.edit_list_data.problemCorrectUuid,//  problemCorrectUuid
      };
      this.post_save(params);
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
.search >>> .el-input__inner::-webkit-input-placeholder {
  color: #c0c4cc !important;
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

.dialog >>> .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100% !important;
}
</style>
