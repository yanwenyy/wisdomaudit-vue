<template>
  <div class="modelList">
    <p class="title">知识库/模型清单</p>

    <!--知识库/模型清单 筛选 -->
    <div class="search">
      <div class="search_conter">
        <el-input placeholder="请输入模型名称"
                  v-model="model_liat_query.modelName"> </el-input>
        <div class="search_icon"
             @click="search_list()">
          <i class="el-icon-search"></i>
        </div>
      </div>
    </div>
    <!--知识库/模型清单 筛选 -->

    <!-- 列表 -->
    <div class="model_list_table">
      <el-table :data="tableData.records"
                v-loading="loading"
                :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
                style="width: 100%">

        <el-table-column label="模型编号"
                         width="80"
                         align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column prop="belongField"
                         align="center"
                         label="所属领域">
        </el-table-column>
        <el-table-column prop="belongSpcial"
                         align="center"
                         label="所属专题">
        </el-table-column>
        <el-table-column prop="modelName"
                         align="center"
                         label="模型名称">

          <template slot-scope="scope">
            <p class="details"
               @click="look_details(scope.row.auditModelUuid,scope.$index+1 )">{{scope.row.modelName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="logicalDescription"
                         align="center"
                         label="逻辑说明">
        </el-table-column>

        <el-table-column prop="ruleDescription"
                         align="center"
                         label="业务规则">

        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="page">

        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :page-size="this.tableData.size"
                       :current-page="this.tableData.current"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="this.tableData.total">
        </el-pagination>

      </div>
      <!-- 分页 end-->

    </div>
    <!-- 列表 end-->

    <!-- 查看 -->
    <el-dialog title=""
               center=""
               :visible.sync="dialogVisible"
               width="width">
      <div class="title_dlag">查看</div>

      <div class="dlag">
        <div class="son list_four">
          <p>模型编号：<span>{{list_index}}</span> </p>
          <p>所属领域：<span>{{details.belogField}}</span> </p>
          <p>所属专题：<span>{{details.belogSpcial}}</span> </p>
          <p>模型名称：<span>{{details.modelName}}</span> </p>
        </div>
        <div class="son flex">
          <p>业务规则：</p><span>{{details.ruleDescription}}</span>
        </div>
        <div class="son flex">
          <p>逻辑说明：</p><span>{{details.logicalDescription}}</span>

        </div>

      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>
<script>
import { model_list, model_list_details } from
  '@SDMOBILE/api/shandong/model_list'
import { fmtDate } from '@SDMOBILE/model/time.js';
export default {
  components: {},
  data () {
    return {
      loading: false,
      dialogVisible: false,//查看
      audit_modelid: '',//详情id
      model_liat_query: {
        modelName: '',//筛选
        pageNo: 1,
        pageSize: 10,
      },
      tableData: [],//列表
      list_index: '',//模型编号
      details: [],//详情
    }
  },
  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      // return fmtDate(t, 'yyyy-MM-dd hh:mm:ss');
      return fmtDate(t, 'yyyy-MM-dd ');
    }
  },
  computed: {},
  watch: {},
  created () {
    let params = {
      condition: {
        modelName: this.model_liat_query.modelName
      },
      pageNo: this.model_liat_query.pageNo,
      pageSize: this.model_liat_query.pageSize
    };
    this.model_list_data(params);
  },
  mounted () {

  },
  methods: {
    // 列表
    model_list_data (params) {
      this.loading = true;
      model_list(params).then(resp => {
        this.tableData = resp.data;
        this.loading = false;
      })
    },
    // 筛选
    search_list () {
      let params = {
        condition: {
          modelName: this.model_liat_query.modelName
        },
        pageNo: this.model_liat_query.pageNo,
        pageSize: this.model_liat_query.pageSize
      };
      this.model_list_data(params);
    },
    // 分页
    handleCurrentChange (val) {
      let params = {
        condition: {
          modelName: this.model_liat_query.modelName
        },
        pageNo: val,
        pageSize: this.model_liat_query.pageSize
      };
      this.model_list_data(params);
    },
    // 控制每页条数
    handleSizeChange (val) {
      this.model_liat_query.pageSize = val
    },
    // 查看
    look_details (id, index) {
      this.list_index = index
      this.dialogVisible = true;
      this.audit_modelid = id
      let params = {
        AuditModelID: this.audit_modelid,
      }
      this.look_details_data(params)//查看详情
    },
    // 查看详情
    look_details_data (params) {
      model_list_details(params).then(resp => {
        console.log(resp);
        this.details = resp.data
      })
    },
  },
}
</script>

<style scoped>
@import "../../../assets/styles/css/lhg.css";
.modelList {
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
}
.title {
  width: 100%;
}
/* 筛选 */
.search {
  display: flex;
  justify-content: flex-start;
  position: relative;
  padding: 20px 0 10px;
  box-sizing: border-box;
}
.search_conter {
  position: relative;
}
.search >>> .el-input__inner {
  width: 250px !important;
  display: flex;
  float: left;
  border-radius: 0 !important;
}
.titleMes .el-button {
  border-radius: 0 !important;
}
.search >>> .search_icon {
  position: absolute;
  top: 0;
  right: 0;
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
  background: rgb(12, 135, 214) !important;
}
.search >>> .el-icon-search {
  color: #fff;
}
.search >>> .el-button {
  border-radius: 0 5px 5px 0;
  /* background: #1371cc !important; */
}
/* 筛选 end */

/* 模型列表 */
.model_list_table {
}
/* 模型列表 end*/
.page {
  display: flex;
  justify-content: flex-end;
}
.details {
  color: #79bdf0 !important;
  cursor: pointer;
}
/* 查看 */
.dlag {
  padding: 0 20px 20px;
  box-sizing: border-box;
}
.son {
  display: flex;
  padding: 20px 30px 10px;
  box-sizing: border-box;
}
.list_four p {
  width: 25%;
}
.flex p {
  min-width: 75px;
}
</style>