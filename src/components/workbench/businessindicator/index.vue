<template>
  <div class="page-container indocator">
    <div class="filter-container">
      <el-button type="primary" v-if="ifprojectmanage" @click="add()"
        >新增指标</el-button
      >
      <div class="indocator-btn-box" v-if="!ifprojectmanage">
        <el-button class="gary-border">提交</el-button>
        <el-button class="gary-border" @click="importData()">导入</el-button>
        <el-button class="gary-border" @click="exportData()">导出</el-button>
      </div>
      <div class="indocator-btn-box" v-else>
        <el-button class="gary-border" @click="openExamine()">审核</el-button>
        <el-button class="gary-border" @click="issued()">下发</el-button>
        <!-- <el-button class="gary-border" @click="deleteData()">删除</el-button> -->
      </div>
    </div>
    <!-- @sort-change="sortChange" -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      fit
      style="width: 100%"
      :data="list"
      border
      highlight-current-row
      height="calc(100vh - 300px)"
      max-height="calc(100vh - 300px)"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column label="指标类型" prop="indexType" />
      <el-table-column label="指标名称" prop="indexName">
        <template slot-scope="scope">
          <div class="canclick" @click="openDetail(scope.$index)">
            {{ scope.row.indexName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="单位" show-overflow-tooltip prop="indexUnit" />
      <el-table-column
        label="资料提供部门"
        align="center"
        prop="dataProvideDepartment"
      />
      <el-table-column label="取数口径或公式" prop="accessCaliber" />
      <el-table-column
        label="指标值"
        width="180px"
        align="center"
        prop="indexValue"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.indexValue" />
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          {{
            scope.row.status == 1
              ? "启用"
              : scope.row.status == 0
              ? "停用"
              : "--"
          }}
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="pageQuery.pageNo"
      :limit.sync="pageQuery.pageSize"
      @pagination="getList"
    />
    <!-- 新增和编辑的弹框 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        class="detail-form"
      >
        <el-form-item label="指标名称" prop="indexName">
          <el-input
            v-model="temp.indexName"
            placeholder="请输入指标名称"
            :disabled="dialogStatus == 'show'"
          />
        </el-form-item>

        <el-form-item label="父指标名" prop="parentIndexName">
          <el-input
            v-model="temp.parentIndexName"
            placeholder="请输入父指标名"
            :disabled="dialogStatus == 'show'"
          />
        </el-form-item>
        <el-form-item label="指标类型" prop="indexType">
          <el-input
            v-model="temp.indexType"
            placeholder="请输入指标类型"
            :disabled="dialogStatus == 'show'"
          />
        </el-form-item>
        <el-form-item label="指标单位" prop="indexUnit">
          <!-- <el-input
            v-model="temp.indexUnit"
            placeholder="请输入单位"
            :disabled="dialogStatus == 'show'"
          /> -->
          <el-select v-model="temp.indexUnit" placeholder="请选择指标单位">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资料提供部门" prop="dataProvideDepartment">
          <!-- <el-input
            v-model="temp.dataProvideDepartment"
            placeholder="请输入资料提供部门"
            :disabled="dialogStatus == 'show'"
          /> -->
          <el-select
            v-model="temp.dataProvideDepartment"
            placeholder="请选择资料提供部门"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="取数口径或公式" prop="accessCaliber">
          <el-input
            v-model="temp.accessCaliber"
            placeholder="请输入取数口径或公式"
            :disabled="dialogStatus == 'show'"
          />
        </el-form-item>
        <el-form-item label="指标状态" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="dialogStatus === 'show'"
          type="primary"
          @click="dialogFormVisible = false"
          >关闭</el-button
        >
        <el-button
          v-if="dialogStatus != 'show'"
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
          >保存</el-button
        >
      </div>
    </el-dialog>
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import _ from "lodash";
import axios from "axios";
export default {
  components: { Pagination },
  filters: {},
  data() {
    return {
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
      this.temp = {
        indexType: null,
        indexName: null,
        indexUnit: null,
        dataProvideDepartment: null,
        accessCaliber: null,
        status: 1,
        managementProjectUuid: this.pageQuery.condition.managementProjectUuid,
      };
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate();
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
</style>

