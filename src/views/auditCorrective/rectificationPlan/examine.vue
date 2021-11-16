<template>
  <div>
    <div class="header_dlag">
      <div class="search">
        <el-input placeholder="请输入问题"
                  v-model="details_query.problem"> </el-input>
        <div class="search_icon"
             style=" background: rgb(12, 135, 214) !important;"
             @click="search_list_details()">
          <i class="el-icon-search"
             style="color: white;"></i>
        </div>
      </div>
    </div>

    <div class="dialog">
      <el-table :data="details_data_list.problemCorrectList"
                :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
                v-loading="loading"
                style="width: 100%">
        <el-table-column type="index"
                         label="编号"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         prop="problem"
                         label="问题"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center"
                         prop="dutyDeptName"
                         label="主要负责部门"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center"
                         prop="dutyPersonName"
                         label="整改责任人"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center"
                         prop="planContent"
                         label="整改计划"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center"
                         prop="limitTime"
                         label="预计完成时限"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center"
                         prop="remark"
                         label="备注"
                         show-overflow-tooltip>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="page">
        <!-- <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="this.issues_list.current"
                     :page-sizes="[100, 200, 300, 400]"
                     :page-size="this.issues_list.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="this.issues_list.total">
      </el-pagination> -->
      </div>
      <!-- 分页 end-->

      <!-- 备注 -->
      <div class="remarks">
        <p>审核意见：</p>
        <el-input type="textarea"
                  v-model="remark"
                  class="resizeNone"></el-input>
      </div>
      <!-- 备注 end-->

    </div>

    <div class="footer">
      <el-button type="primary"
                 @click="succes()"
                 :disabled="isDisable">通过</el-button>
      <el-button @click="reject()"
                 :disabled="isDisable"
                 style="color:#DD5656;border:1px solid #DD5656;">驳回</el-button>

    </div>

  </div>
</template>

<script>
import { toReviewPage, reviewResult } from "@SDMOBILE/api/shandong/recitFicationPlan_examine";//lhg
export default {
  components: {},
  data () {
    return {
      loading: false,
      tableData: [],
      // 查看审核
      details_query: {
        problem: '',
        id: '',//项目id
      },
      remark: '',//备注
      details_data_list: [],//审核数据
      isDisable: false,//防止重复提交

    }
  },
  computed: {},
  watch: {},
  created () {
    this.details_query.id = this.$route.params && this.$route.params.id
    this.details_data()
  },
  mounted () {

  },
  methods: {
    // 审核信息
    details_data () {
      let params = {
        problem: this.details_query.problem,
        managementProjectUuid: this.details_query.id
      };
      toReviewPage(params).then(resp => {
        console.log(resp.data);
        this.details_data_list = resp.data;
      })
    },
    // 筛选
    search_list_details () {
      this.details_data()//刷新列表
    },


    // 通过
    succes () {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
      this.$set(this.details_data_list.correctLog, 'remark', this.remark)//备注
      this.$set(this.details_data_list.correctLog, 'isPassed', '通过')//依据
      this.examine(1);//审核数据
    },
    // 驳回
    reject () {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
      this.$set(this.details_data_list.correctLog, 'remark', this.remark)//备注
      this.$set(this.details_data_list.correctLog, 'isPassed', '驳回')//依据
      this.examine(2);//审核数据
    },

    // 审核数据
    examine (index) {
      let params = this.details_data_list;
      reviewResult(params).then(resp => {
        console.log(resp.data);
        if (resp.code == 0) {
          if (index == 1) {
            this.$message({
              message: '审核成功',
              type: 'success'
            });
            // this.details_data()//刷新列表
            // this.$router.push({ path: 'rectificationPlan_audited/' })
            this.$router.push({ path: '/auditCorrective/rectificationPlan' })


          } else {
            this.$message({
              message: '驳回成功',
              type: 'success'
            });
            // this.details_data()//刷新列表
            this.$router.push({ path: '/auditCorrective/rectificationPlan' })
          }

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
/* 分页 */
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}

.dialog {
  padding: 0 20px 20px;
  box-sizing: border-box;
}
/* 备注 */
.remarks {
  margin-top: 20px;
  display: flex;
}
.remarks p {
  min-width: 75px;
}
.resizeNone >>> .el-textarea__inner {
  resize: none;
  height: 150px;
}
.footer {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}
</style>
