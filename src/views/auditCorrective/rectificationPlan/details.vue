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
    <div class="dialog table"
         ref="myBox">

      <el-table :data="tableData_details.records"
                :header-cell-style="{'background-color': '#F4FAFF',}"
                v-loading="loading_details"
                ref="table_width"
                stripe
                style="width: 100%;min-height:400px">
        <el-table-column type="index"
                         label="序号"
                         width="50">
        </el-table-column>
        <el-table-column prop="problem"
                         label="问题">
          <template slot-scope="scope">
            <el-popover placement="bottom"
                        visible-arrow='false'
                        popper-class="popover"
                        :width=" details_list.style_width"
                        @show="details_show(scope.row,scope.$index+1)"
                        trigger="click">

              <!-- 详情 -->
              <div class="problem_details_conter"
                   :width=" details_list.style_width + 'px'"
                   v-if="details == true">
                <ul class="list">
                  <li>
                    <span class="fl  sp">问题：</span>
                    <p><span v-if="details_list.problem">{{details_list.problem}}</span>
                      <span v-else>--</span>
                    </p>

                  </li>
                  <li>
                    <span class="fl sp">描述：</span>
                    <p><span v-if="details_list.describe">{{details_list.describe}}</span>
                      <span v-else>--</span>
                    </p>

                  </li>
                  <li>
                    <span class="fl sp">管理建议：</span>
                    <p><span v-if="details_list.managementAdvice">{{details_list.managementAdvice}}</span>
                      <span v-else>--</span>
                    </p>
                  </li>

                </ul>
              </div>
              <!-- 详情 end-->
              <div slot="reference"
                   class="pointer">
                <span v-if="scope.row.problem"
                      style="cursor: pointer;color:rgb(68, 163, 223);">{{scope.row.problem}}</span>

                <span v-else>--</span>
              </div>
            </el-popover>
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
                         label="涉及金额(万元)"
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

      style_w: '',

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
      this.details_data();

    },
    // 详情 分页
    handleCurrentChange_details (val) {
      this.details_query.pageNo = val;
      this.details_data();
    },
    details_show (data, index) {
      this.style_w = this.$refs.myBox.offsetWidth
      console.log(this.style_w);

      this.details = true
      this.details_list = data;

      // let top_px = (this.style_px * index + 8) + 'px'
      this.$set(this.details_list, 'style_width', this.style_w - '43')
      console.log(this.details_list.style_width);
    },
    close_mose () {
      this.details = false
    }

  },

}
</script>
<style >
.el-popover.popover {
  padding: 0 !important;
  /* transform: translate(-50%, 0%);
  left: 50% !important; */
  left: inherit !important;
  right: 20px !important;
  box-shadow: none !important;
  border: none !important;
  background: none !important;
}
.el-popover.popover[x-placement^="bottom"] .popper__arrow {
  left: 150px !important;
}
</style> 
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
  /* position: absolute; */
  /* top: 90px; */
  /* left: 0; */
  /* padding: 0 20px; */
  box-sizing: border-box;
  /* z-index: 100;
  border: 1px solid red; */
  float: right;
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
  height: 250px;
  overflow-x: auto;
}
.list li {
  width: 100%;
  margin-bottom: 20px;
  box-sizing: border-box;
}
.list li:last-child {
  margin-bottom: 0;
}
.list li .sp {
  width: 70px;
  text-align: right;
}
.list li p {
  /* width: 33%;
  float: left;
  text-align: left;
  box-sizing: border-box; */
  text-align: left;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  width: calc(100% - 80px);
  line-height: 20px;
}
.list li p span {
  font-weight: 500;
}
</style>

