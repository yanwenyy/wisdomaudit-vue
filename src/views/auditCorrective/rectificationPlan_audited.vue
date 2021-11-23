3<template>
  <!-- 被审计 -->
  <div>
    <div class="header_dlag">
      <div class="search">
        <el-input placeholder="请输入项目名称"
                  v-model="list_query.projectName"> </el-input>
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
                style="width: 100%;min-height:400px">
        <el-table-column type="index"
                         label="编号"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         prop="projectName"
                         label="审计项目名称">
        </el-table-column>
        <el-table-column align="center"
                         prop="auditOrgName"
                         label="被审计单位">
        </el-table-column>
        <el-table-column align="center"
                         prop="projectType"
                         label="项目类型">
        </el-table-column>
        <el-table-column align="center"
                         prop="projectLeaderName"
                         label="项目负责人">
        </el-table-column>
        <el-table-column align="center"
                         prop="projectChargemanName"
                         label="项目组长">
        </el-table-column>
        <el-table-column align="center"
                         prop="problem"
                         label="操作">
          <template slot-scope="scope">

            <el-button type="text"
                       v-if="scope.row.correctStatus==1 || scope.row.correctStatus==4"
                       @click="edit(scope.row)"
                       style="color: rgb(68, 163, 223);">
              编辑
            </el-button>
            <el-button type="text"
                       v-if="scope.row.correctStatus==1 || scope.row.correctStatus==4"
                       :disabled="isDisable"
                       @click="post(scope.row.managementProjectUuid)"
                       style="color: rgb(68, 163, 223);">
              提交
            </el-button>

            <el-button type="text"
                       @click="look(scope.row)"
                       style="color: rgb(68, 163, 223);">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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

    <!-- 启动整改 弹窗 -->
    <!-- <el-dialog title=""
               :close-on-click-modal="false"
               center
               width="70%"
               :visible.sync="dialogVisible_isrun">
      <div class="title">启动整改</div>

      <div class="dialog">
        <h1>2021项目哈哈哈哈哈哈哈哈哈哈哈哈哈哈</h1>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible_isrun = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogVisible_isrun = false">确 定</el-button>
      </div>
    </el-dialog> -->

  </div>
</template>

<script>
import { pageBsjProblemCorrectList, submitReview, notice, post_rules } from "@SDMOBILE/api/shandong/rectificationPlan_audited";//lhg
export default {
  components: {},
  data () {
    return {
      loading: false,
      list_query: {
        pageNo: 1,
        pageSize: 10,
        projectName: '',
      },
      tableData: [],
      dialogVisible_isrun: false,//启动整改
      isDisable: false,//防止重复提交

    }
  },
  computed: {},
  watch: {},
  created () {
    this.pageBsjProblemCorrectList_data();
  },
  mounted () {

  },
  methods: {
    // 列表
    pageBsjProblemCorrectList_data () {
      this.loading = true;
      let params = {
        pageNo: this.list_query.pageNo,
        pageSize: this.list_query.pageSize,
        condition: {
          projectName: this.list_query.projectName,
        }
      };
      pageBsjProblemCorrectList(params).then(resp => {
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
      this.pageBsjProblemCorrectList_data();//刷新列表

    },
    // 筛选
    search_list_details () {
      this.pageBsjProblemCorrectList_data();//刷新列表
    },
    // 编辑
    edit (data) {
      this.$router.push({ path: 'rectificationPlan_audited/edit/' + data.managementProjectUuid })
    },
    look (data) {
      this.$router.push({ path: 'rectificationPlan_audited/edit/' + data.managementProjectUuid + '?type=1' })
    },
    // 提交
    post (id) {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
      let params = {
        managementProjectUuid: id
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
                this.pageBsjProblemCorrectList_data();//刷新列表
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

.padding {
  padding: 0 20px 20px;
  box-sizing: border-box;
}
</style>
