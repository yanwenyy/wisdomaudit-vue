<template>
  <div class="page-container indocator">
    <div class="filter-container">
      <el-button type="primary" v-if="ifprojectmanage" @click="add()"
        >新增指标</el-button
      >
      <!--<div class="indocator-btn-box" v-if="!ifprojectmanage">-->
        <!--<el-button class="gary-border">提交</el-button>-->
        <!--<el-button class="gary-border" @click="importData()">导入</el-button>-->
        <!--<el-button class="gary-border" @click="exportData()">导出</el-button>-->
      <!--</div>-->
      <!--<div class="indocator-btn-box" v-else>-->
        <!--<el-button class="gary-border" @click="openExamine()">审核</el-button>-->
        <!--<el-button class="gary-border" @click="issued()">下发</el-button>-->
        <!--&lt;!&ndash; <el-button class="gary-border" @click="deleteData()">删除</el-button> &ndash;&gt;-->
      <!--</div>-->
    </div>
    <!-- @sort-change="sortChange" -->
    <!--<el-table-->
      <!--:key="tableKey"-->
      <!--v-loading="listLoading"-->
      <!--fit-->
      <!--style="width: 100%"-->
      <!--:data="list"-->
      <!--border-->
      <!--highlight-current-row-->
      <!--height="calc(100vh - 300px)"-->
      <!--max-height="calc(100vh - 300px)"-->
      <!--@selection-change="handleSelectionChange"-->
    <!--&gt;-->
      <!--<el-table-column type="selection" align="center" />-->
      <!--<el-table-column label="指标类型" prop="indexType" />-->
      <!--<el-table-column label="指标名称" prop="indexName">-->
        <!--<template slot-scope="scope">-->
          <!--<div class="canclick" @click="openDetail(scope.$index)">-->
            <!--{{ scope.row.indexName }}-->
          <!--</div>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="单位" show-overflow-tooltip prop="indexUnit" />-->
      <!--<el-table-column-->
        <!--label="资料提供部门"-->
        <!--align="center"-->
        <!--prop="dataProvideDepartment"-->
      <!--/>-->
      <!--<el-table-column label="取数口径或公式" prop="accessCaliber" />-->
      <!--<el-table-column-->
        <!--label="指标值"-->
        <!--width="180px"-->
        <!--align="center"-->
        <!--prop="indexValue"-->
      <!--&gt;-->
        <!--<template slot-scope="scope">-->
          <!--<el-input v-model="scope.row.indexValue" />-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="状态" prop="status">-->
        <!--<template slot-scope="scope">-->
          <!--{{-->
            <!--scope.row.status == 1-->
              <!--? "启用"-->
              <!--: scope.row.status == 0-->
              <!--? "停用"-->
              <!--: "&#45;&#45;"-->
          <!--}}-->
        <!--</template>-->
      <!--</el-table-column>-->
    <!--</el-table>-->
    <div class="jyzb-div">
      <table class="jyzb">
        <tr>
          <th width="150">指标分类</th>
          <th width="150">指标名称</th>
          <th width="100">单位</th>
          <th width="100">2018年4月初</th>
          <th width="100" v-for="item in yearRange">{{item}}</th>
          <th width="100">2020年8月</th>
          <th width="150">资料提供部门</th>
          <th width="100">联系人</th>
          <th colspan="2" width="150">操作</th>
        </tr>
        <tr>
          <td>考核得分指标</td>
        </tr>
        <tr v-for="item in 2">
          <td></td>
          <td>业绩考核得分</td>
          <td>分</td>
          <td></td>
          <td v-for="item in yearRange"></td>
          <td></td>
          <td>财务部</td>
          <td>方静</td>
          <td><el-button type="text" class="blue">编辑</el-button></td>
          <td><el-button type="text" class="red">删除</el-button></td>
        </tr>
        <tr>
          <td>收益及收入结构指标</td>
        </tr>
      </table>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="pageQuery.pageNo"
      :limit.sync="pageQuery.pageSize"
      @pagination="getList"
    />
    <!-- 新增和编辑的弹框 -->
    <el-dialog
      title="经营指标审批"
      :visible.sync="dialogtextVisible"
      :close-on-click-modal="false"
    >
      <el-form v-model="examine">
        <el-form-item label="审批意见">
          <el-input
            type="textarea"
            v-model="examine.text"
            :autosize="{ minRows: 4, maxRows: 8 }"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogtextVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogtextVisible = false"
          >通过</el-button
        >
        <el-button type="danger" @click="dialogtextVisible = false"
          >驳回</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="经营指标列表"
      :visible.sync="dialoglistVisible"
      :close-on-click-modal="false"
    >
      <div style="display: flex; padding: 20px">
        指标名称：
        <el-input
          placeholder=""
          v-model="kupageQuery.condition.indexName"
          style="width: 300px"
        >
        </el-input>
        <el-button type="primary" class="gary-border" @click="getkulist()"
          >查询</el-button
        >
      </div>
      <el-table
        :data="kulistData"
        style="width: 100%"
        @selection-change="kulistSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column prop="indexName" label="指标名称"></el-table-column>
      </el-table>
      <pagination
        v-show="kutotal > 0"
        :total="kutotal"
        :page.sync="kupageQuery.pageNo"
        :limit.sync="kupageQuery.pageSize"
        @pagination="getList"
      />
      <div slot="footer">
        <el-button @click="dialoglistVisible = false">取消</el-button>
        <el-button type="primary" @click="importSave()">确定</el-button>
      </div>
    </el-dialog>
    <search-list ref="searchTabel"></search-list>
  </div>
</template>

<script>
import Pagination from "@WISDOMAUDIT/components/Pagination"; // secondary package based on el-pagination
import SearchList from "./searchList"
import _ from "lodash";
import axios from "axios";
export default {
  components: { Pagination ,SearchList},
  filters: {},
  data() {
    return {
      yearRange:['2018','2019','2020'],
      tableKey: "indicator",
      list: null,
      total: 0,
      listLoading: false,
      pageQuery: {
        condition: {
          managementProjectUuid: "", //项目管理主键
          auditStartData: "", //项目周期
          auditFinishData: "", //项目周期
        },
        pageNo: 1,
        pageSize: 20,
      },
      temp: {
        // 业务分类
        indexType: null,
        indexName: null,
        indexUnit: null,
        dataProvideDepartment: null,
        accessCaliber: null,
        status: 1,
      },
      selections: [],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑指标",
        create: "新增指标",
        show: "查看指标",
      },
      // 新增的表单验证
      rules: {
        indexType: [
          { required: true, message: "请填写指标类型", trigger: "change" },
        ],
        indexName: [
          { required: true, message: "请填写指标名称", trigger: "change" },
        ],
        indexUnit: [
          { required: true, message: "请填写单位", trigger: "change" },
        ],
        dataProvideDepartment: [
          { required: true, message: "请填写资料提供部门", trigger: "change" },
        ],
        state: [
          {
            required: true,
            message: "请填写取数口径或公式",
            trigger: "change",
          },
        ],
      },
      options: [
        { value: "xxx1", label: "xxx1" },
        { value: "xxx2", label: "xxx2" },
      ],
      downloadLoading: false,
      headers: { "Content-Type": "multipart/form-data" },
      file: "",
      indicatortableSelection: [],
      ifprojectmanage: false,
      dialogtextVisible: false,
      examine: { text: "" },
      //导入经营指标相关
      dialoglistVisible: false,
      kulistData: [],
      kupageQuery: {
        condition: {
          indexName: "",
        },
        pageNo: 1,
        pageSize: 20,
      },
      kutotal: 0,
      kutableSelection: [],
    };
  },
  watch: {},
  created() {
    this.pageQuery.condition.managementProjectUuid =
      "a1sa0d13as5d13asd1a3s00001";
    this.pageQuery.condition.auditStartData = "2016-02-22T01:39:34.665Z";
    this.pageQuery.condition.auditFinishData = "2016-02-22T01:39:34.665Z";
    this.getList();
    this.getManage();
  },
  methods: {
    getManage() {
      this.ifprojectmanage = true;
    },
    getList() {
      this.listLoading = true
      axios({
        url: `/wisdomaudit/operatingIndicators/pageList`,
        method: "post",
        data: this.pageQuery,
      }).then((res) => {
        console.log(res);
        this.listLoading = false
        if (res.data.code == 0) {
          this.list = res.data.data.data;
          this.total = res.data.data.total;
        }
      });
    },
    openExamine() {
      this.dialogtextVisible = true;
    },
    handleSelectionChange(val) {
      this.indicatortableSelection = val;
    },
    kulistSelectionChange(val) {
      this.kutableSelection = val;
    },
    add() {
      // this.temp = {
      //   indexType: null,
      //   indexName: null,
      //   indexUnit: null,
      //   dataProvideDepartment: null,
      //   accessCaliber: null,
      //   status: 1,
      //   managementProjectUuid: this.pageQuery.condition.managementProjectUuid,
      // };
      // this.dialogStatus = "create";
      // this.dialogFormVisible = true;
      // this.$nextTick(() => {
      //   this.$refs.dataForm.clearValidate();
      // });
      this.$nextTick(() => {
        this.$refs.searchTabel.init();
      });
    },
    openDetail(int) {
      this.temp = this.list[int];
      this.dialogStatus = "show";
      this.dialogFormVisible = true;
      return;
      axios({
        url:
          `/wisdomaudit/operatingIndicators/getById/` +
          this.list[int].problemListUuid,
        method: "get",
        data: {},
      }).then((res) => {
        console.log(res);
        this.temp = res.data.data;
        this.dialogDetailVisible = true;
      });
    },
    importData() {
      this.getkulist();
      this.dialoglistVisible = true;
    },
    importSave() {
      axios({
        url: `/wisdomaudit/`,
        method: "post",
        data: this.kutableSelection,
      }).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "导入成功",
            type: "success",
          });
          this.dialoglistVisible = false;
        }
      });
    },
    getkulist() {
      this.kulistData = [{ indexName: "11" }];
      return;
      axios({
        url: `/wisdomaudit/`,
        method: "post",
        data: this.kupageQuery,
      }).then((res) => {
        this.kulistData = res.data.data;
        this.kutotal = res.data.total;
      });
    },
    exportData() {
      axios({
        url: `/wisdomaudit/`,
        method: "post",
        data: this.temp,
      }).then((res) => {});
    },
    createData() {
      axios({
        url: `/wisdomaudit/operatingIndicators/save`,
        method: "post",
        data: this.temp,
      }).then((res) => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message({
            message: "新增成功",
            type: "success",
          });
          this.dialogFormVisible = false;
          this.getList();
        }
      });
    },
    updateData() {
      axios({
        url: `/wisdomaudit/operatingIndicators/update`,
        method: "put",
        data: this.temp,
      }).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.dialogFormVisible = false;
          this.getList();
        }
      });
    },
    issued() {
      let rep = []
      for(let i =0;i<this.indicatortableSelection.length;i++){
        rep.push({operatingIndicatorsUuid:this.indicatortableSelection[i].operatingIndicatorsUuid})
      }
      let params = {
        managementProjectUuid: this.pageQuery.condition.managementProjectUuid,
        operatingIndicatorsList: rep,
      };
      axios({
        url: `/wisdomaudit/operatingIndicatorsBackTask/sendTask`,
        method: "post",
        data: params,
      }).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "下发成功",
            type: "success",
          });
          this.getList();
        }
      });
    },
    deleteData() {
      console.log(this.indicatortableSelection);
      let rep = [];
      for (let i = 0; i < this.indicatortableSelection.length; i++) {
        rep.push(this.indicatortableSelection[i].indexId);
      }
      rep = rep.join(",");
      axios({
        url: `/wisdomaudit/operatingIndicators/delete/` + rep,
        method: "delete",
        data: {},
      }).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.getList();
        }
      });
    },
  },
};
</script>
<style scoped>
.indocator-btn-box {
  float: right;
}
.gary-border {
  border: 1px solid #ccc;
}
.canclick {
  color: rgb(27, 168, 250);
  cursor: pointer;
}
  .jyzb-div{
    width:100%;
    overflow:scroll;
  }
  .jyzb{
    border: 1px solid #ddd;
    min-width: 100vw;
    width: auto;
    overflow-x: auto;
    box-sizing: border-box;
  }
  .jyzb tr:not(:last-child){
    border-bottom: 1px solid #ddd;
  }
  .jyzb td:not(:last-child),.jyzb th:not(:last-child){
     border-right: 1px solid #ddd;
   }
  .jyzb td,.jyzb th{
    padding: 10px;
    background: #fff;
    text-align: center;
  }
  .blue{
    color: blue;
  }
  .red{
    color:red;
  }
</style>

