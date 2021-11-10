<template>
  <div>
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
    <div class="dialog table">

      <el-table :data="tableData_details.records"
                :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
                v-loading="loading_details"
                ref="table_width"
                style="width: 100%;min-height:400px">
        <el-table-column type="index"
                         label="序号"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         prop="problem"
                         label="问题"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="problem_details">
              <ul class="list">
                <li class="tableFileList-title">文件名称</li>

              </ul>

              <!-- <el-popover placement="bottom"
                          width="100"
                          popper-class="problem_details_conter"
                          @show="open_details(scope.row)"
                          trigger="click">
                <ul class="list">
                  <li class="tableFileList-title">文件名称</li>

                </ul>
                <div slot="reference"
                     class="pointer">{{scope.row.problem}}
                </div>
              </el-popover> -->

            </div>
          </template>

        </el-table-column>
        <el-table-column align="center"
                         prop="discoveryTime"
                         label="发现日期"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center"
                         prop="riskAmount"
                         label="风险金额（元）"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center"
                         prop="problemFindPeople"
                         label="发现人"
                         show-overflow-tooltip>
        </el-table-column>

      </el-table>

      <!-- 分页 -->
      <div class="page">
        <el-pagination @size-change="handleSizeChange_details"
                       @current-change="handleCurrentChange_details"
                       :current-page="this.tableData_details.current"
                       :page-sizes="[100, 200, 300, 400]"
                       :page-size="this.tableData_details.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="this.tableData_details.total">
        </el-pagination>
      </div>
      <!-- 分页 end-->
    </div>
  </div>
</template>

<script>
import { details_pageList } from "@SDMOBILE/api/shandong/recitFicationPlan";//lhg
export default {
  components: {},
  data () {
    return {
      // 查看详情
      details_query: {
        problem: '',
        pageNo: 1,
        pageSize: 10,
        id: '',//项目id
      },
      loading_details: false,//详情loading
      tableData_details: [],//详情数据
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
    // 详情接口
    details_data () {
      this.loading_details = true;
      let params = {
        pageNo: this.details_query.pageNo,
        pageSize: this.details_query.pageSize,
        condition: {
          problem: this.details_query.problem,//筛选
          managementProjectUuid: this.details_query.id//项目id
        }
      }
      details_pageList(params).then(resp => {
        this.tableData_details = resp.data;
        this.loading_details = false
      })
    },
    //详情 查看筛选
    search_list_details () {
      this.details_data();
    },

    // 详情每页
    handleSizeChange_details (val) {
      this.details_query.pageSize = val
    },
    // 详情 分页
    handleCurrentChange_details (val) {
      this.details_query.pageNo = val;
      this.details_data();
    },

    open_details () {
      console.log(222);
    },
  },

}
</script>
<style>
/* 开启 */
#app >>> .sidebar-container .problem_details_conter {
  border: 1px solid red;
  /* width: 87% !important; */
  width: calc(100% - 215px) !important;
}
/* 关闭 */
#app >>> .hideSidebar .sidebar-container .problem_details_conter {
  border: 1px solid green;
  width: calc(100% - 60px) !important;
}
.problem_details_conter {
  /* width: 87% !important; */
  left: auto !important;
  right: 20px !important;
  /* background: transparent; */
  /* box-shadow: none; */
  /* border: none; */
  /* padding: 0; */
}
.problem_details_conter .el-popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: none;
}
.problem_details_conter
  .el-popper[x-placement^="bottom"]
  .popper__arrow::after {
  border-bottom-color: none;
}
</style>
<style scoped>
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
.dialog {
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

.problem_details {
  border: 1px solid red;
  width: 100%;
}
.table {
  position: relative;
}
.list {
  padding: 10px;
  box-sizing: border-box;

  margin: 0 auto;
  background: #e6f1fc;
}
</style>

