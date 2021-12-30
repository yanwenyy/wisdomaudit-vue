<template>
  <div>

    <div class="search">
      <el-button class="back-group"
                 style="float: left"
                 @click="go_back()"><i class="el-icon-arrow-left backBtn"></i>返回</el-button>

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
                :header-cell-style="{'background-color': '#F4FAFF',}"
                v-loading="loading_details"
                ref="table_width"
                style="width: 100%;min-height:400px">
        <el-table-column type="index"
                         label="序号"
                         width="50">
        </el-table-column>
        <el-table-column prop="problem"
                         label="问题"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <p @click="details_show(scope.row,scope.$index+1)"
               v-if="scope.row.problem"
               style="cursor: pointer;color:rgb(68, 163, 223);">{{scope.row.problem}}</p>

            <p v-else>--</p>
          </template>

        </el-table-column>
        <el-table-column prop="discoveryTime"
                         label="发现日期"
                         show-overflow-tooltip>

          <template slot-scope="scope">
            <p v-if="scope.row.discoveryTime">
              {{scope.row.discoveryTime}}
            </p>
            <p v-else>
              --
            </p>
          </template>

        </el-table-column>
        <el-table-column prop="riskAmount"
                         align="center"
                         label="风险金额（万元）"
                         show-overflow-tooltip>

          <template slot-scope="scope">
            <p v-if="scope.row.riskAmount">
              {{ parseFloat(scope.row.riskAmount.toString()) }}
            </p>
            <p v-else>
              --
            </p>
          </template>

        </el-table-column>
        <el-table-column prop="problemFindPeople"
                         label="发现人"
                         show-overflow-tooltip>

          <template slot-scope="scope">
            <p v-if="scope.row.problemFindPeople">
              {{scope.row.problemFindPeople}}
            </p>
            <p v-else>
              --
            </p>
          </template>

        </el-table-column>

      </el-table>
      <div class="mose"
           @click="close_mose"
           v-if="details == true"></div>
      <!-- 分页 -->
      <div class="page">
        <el-pagination @size-change="handleSizeChange_details"
                       @current-change="handleCurrentChange_details"
                       :current-page="this.tableData_details.current"
                       :page-size="this.tableData_details.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="this.tableData_details.total">
        </el-pagination>
      </div>
      <!-- 分页 end-->
      <!-- 详情 -->
      <div class="problem_details_conter"
           :style="{'top':details_list.style_top}"
           v-if="details == true">
        <ul class="list">
          <li>
            <!-- <p>序号：<span v-if="Index">{{Index}}</span>
              <span v-else>--</span>
            </p>
            <p>领域：<span v-if="details_list.field">{{details_list.field}}</span>
              <span v-else>--</span>
            </p> -->

            <p>问题：<span v-if="details_list.problem">{{details_list.problem}}</span>
              <span v-else>--</span>
            </p>
            <p>描述：<span v-if="details_list.describe">{{details_list.describe}}</span>
              <span v-else>--</span>
            </p>
            <p>管理建议：<span v-if="details_list.managementAdvice">{{details_list.managementAdvice}}</span>
              <span v-else>--</span>
            </p>
          </li>
          <!-- <li>
            <p>发现日期：<span v-if="details_list.discoveryTime">{{details_list.discoveryTime}}</span>
              <span v-else>--</span>
            </p>
            <p>风险金额（万元）：<span v-if="details_list.riskAmount">{{
               parseFloat(details_list.riskAmount.toString()) 
              }}</span>
              <span v-else>--</span>
            </p>
            <p>描述：<span v-if="details_list.describe">{{details_list.describe}}</span>
              <span v-else>--</span>
            </p>
          </li>
          <li>
            <p>发现人：<span v-if="details_list.problemFindPeople">{{details_list.problemFindPeople}}</span>
              <span v-else>--</span>
            </p>
            <p>管理建议：<span v-if="details_list.managementAdvice">{{details_list.managementAdvice}}</span>
              <span v-else>--</span>
            </p>
          </li> -->
        </ul>
      </div>
      <!-- 详情 end-->

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
      details: false,//悬浮问题 背景
      style_px: 40,//悬浮定位
      details_list: [],//悬浮数据
      Index: '',
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
    go_back () {
      this.$router.push({ path: '/auditCorrective/rectificationPlan' })
    },
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
      this.details_query.pageNo = 1;
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
    details_show (data, index) {
      this.Index = index
      this.details = true
      this.details_list = data;
      if (index == 0) {
        this.$set(this.details_list, 'style_top', '90px')//核实意见
      } else {
        let top_px = (this.style_px * index + 45) + 'px'
        this.$set(this.details_list, 'style_top', top_px)//核实意见
      }
    },
    close_mose () {
      this.details = false
    }

  },

}
</script>
<style scoped>
.back-group >>> span {
  display: flex;
  align-items: center;
}
>>> .foot .el-button {
  font-weight: normal;
}
/* 筛选 */
.search {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
}
.search >>> .el-input__inner::-webkit-input-placeholder {
  color: #c0c4cc !important;
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
.table >>> .el-table__header {
  margin-top: 0 !important;
}

.mose {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
}
.table {
  position: relative;
}

.problem_details_conter {
  width: 100%;
  position: absolute;
  /* top: 90px; */
  left: 0;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 100;
}
.problem_details_conter .list {
  margin: 0 auto;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #f5f5f9;
  display: flex;
  flex-wrap: wrap;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.list li {
  width: 100%;
  margin-bottom: 20px;
  box-sizing: border-box;
}
.list li:last-child {
  margin-bottom: 0;
}
.list li p {
  width: 33%;
  float: left;
  text-align: left;
  box-sizing: border-box;
}
.list li p span {
  font-weight: 600;
}
</style>

