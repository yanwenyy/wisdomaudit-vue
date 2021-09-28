<template>
  <div class="page-container indocator">
    <div class="filter-container">
      <el-button type="primary" v-if="ifprojectmanage" @click="add()"
        >新增指标</el-button
      >
      <div class="indocator-btn-box" v-if="!ifprojectmanage">
        <el-button class="gary-border">提交</el-button>
        <el-button class="gary-border">导入</el-button>
        <el-button class="gary-border" @click="exportData()">导出</el-button>
      </div>
      <div class="indocator-btn-box" v-else>
        <el-button class="gary-border" @click="openExamine()">审核</el-button>
        <el-button class="gary-border">下发</el-button>
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
      <el-table-column label="状态" prop="status" />
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
        <el-form-item label="指标类型" prop="indexType">
          <el-input
            v-model="temp.indexType"
            placeholder="请输入指标类型"
            :disabled="dialogStatus == 'show'"
          />
        </el-form-item>
        <el-form-item label="指标名称" prop="indexName">
          <el-input
            v-model="temp.indexName"
            placeholder="请输入指标名称"
            :disabled="dialogStatus == 'show'"
          />
        </el-form-item>
        <el-form-item label="单位" prop="indexUnit">
          <el-input
            v-model="temp.indexUnit"
            placeholder="请输入单位"
            :disabled="dialogStatus == 'show'"
          />
        </el-form-item>
        <el-form-item label="资料提供部门" prop="dataProvideDepartment">
          <el-input
            v-model="temp.dataProvideDepartment"
            placeholder="请输入资料提供部门"
            :disabled="dialogStatus == 'show'"
          />
        </el-form-item>
        <el-form-item label="取数口径或公式" prop="accessCaliber">
          <el-input
            v-model="temp.accessCaliber"
            placeholder="请输入取数口径或公式"
            :disabled="dialogStatus == 'show'"
          />
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
          <el-input type="textarea" v-model="examine.text" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
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
        condition: {},
        pageNo: 1,
        pageSize: 20,
        sortBy: "",
        sortName: "",
      },
      temp: {
        // 业务分类
        indexType: null,
        indexName: null,
        indexUnit: null,
        dataProvideDepartment: null,
        accessCaliber: null,
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
        accessCaliber: [
          {
            required: true,
            message: "请填写取数口径或公式",
            trigger: "change",
          },
        ],
      },
      downloadLoading: false,
      headers: { "Content-Type": "multipart/form-data" },
      file: "",
      indicatortableSelection: [],
      ifprojectmanage: false,
      dialogtextVisible: false,
      examine: { text: "" },
    };
  },
  watch: {},
  created() {
    this.getList();
    this.getManage();
  },
  methods: {
    getManage() {
      this.ifprojectmanage = true;
    },
    getList() {
      this.list = [
        {
          accessCaliber: "1",
          status: "审核中",
          indexName: "xxxxxxxxxxxxxxx",
          indexId: "111",
          indexValue: "2019-111",
          indexType: "1类",
          indexUnit: "什么居",
          dataProvideDepartment: "提供人",
        },
      ];
      return;
      axios({
        url: `/wisdomaudit/operatingIndicators/pageList`,
        method: "post",
        data: this.pageQuery,
      }).then((res) => {
        if (res.code == 0) {
          this.list = this.res.data.data;
        }
      });
    },
    openExamine() {
      this.dialogtextVisible = true;
    },
    handleSelectionChange(val) {
      this.indicatortableSelection = val;
    },
    add() {
      this.temp = {
        indexType: null,
        indexName: null,
        indexUnit: null,
        dataProvideDepartment: null,
        accessCaliber: null,
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
        if (res.code == 0) {
          this.$message({
            message: "新增成功",
            type: "success",
          });
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
        if (res.code == 0) {
          this.$message({
            message: "修改成功",
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

