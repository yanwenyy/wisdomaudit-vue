<template>
  <div class="audit-history">
    <div class="projectTab">
      <el-form :model="formState" label-position="left" :inline="true">
        <el-row>
          <el-col :span="7">
            <el-form-item label="历史审计发现描述：" name="describe" prop="describe">
              <el-input v-model="formState.describe" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发现人：" name="discoverer" prop="discoverer">
              <el-input v-model="formState.discoverer" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="search">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="24" class="titleMes">
        <el-col :span="1.5">
          <el-button type="primary" @click="addRow">新增省内历史审计发现</el-button>
        </el-col>
      </el-row>
      <!-- 表单 -->
      <el-table :data="tableData" style="width: 100%;">
        <el-table-column prop="number" label="序号">
        </el-table-column>
        <el-table-column prop="describe" label="历史审计发现描述">
        </el-table-column>
        <el-table-column prop="unit" label="被审计单位">
        </el-table-column>
        <el-table-column prop="discoverer" label="发现人">
        </el-table-column>
        <el-table-column prop="gist" label="审计依据">
        </el-table-column>
        <el-table-column prop="date" label="发现时间">
        </el-table-column>
        <el-table-column prop="source" label="发现来源">
        </el-table-column>
        <el-table-column prop="association" label="关联项目">
        </el-table-column>
        <el-table-column prop="money" label="风险金额（元）">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="handle-list" v-if="scope.row.source=='页面新增'">
              <div class="blue pointer" @click="editRow(scope.row)">编辑</div>
              <div class="red pointer" @click="deteleRow(scope.$index)">删除</div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表单 end-->
    </div>

    <!-- 分页 -->
    <div class="page">
      <el-pagination background layout="prev, pager, next" :total="1000">
      </el-pagination>
    </div>
    <!-- 分页 end-->
    <!-- 新增历史 -->
    <el-dialog title="新增省内历史审计发现" :visible.sync="addVisible" :destroy-on-close="true" width="70%">
      <AuditHistoryAdd></AuditHistoryAdd>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑历史 -->
    <el-dialog title="编辑省内历史审计发现" :visible.sync="editVisible" :destroy-on-close="true" width="70%">
      <AuditHistoryEdit></AuditHistoryEdit>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AuditHistoryAdd from "@WISDOMAUDIT/components/repository/AuditHistoryAdd/index";
import AuditHistoryEdit from "@WISDOMAUDIT/components/repository/AuditHistoryEdit/index";
export default {
  components: {
    AuditHistoryAdd,
    AuditHistoryEdit,
  },
  data() {
    return {
      formState: {
        describe: "",
        discoverer: "",
      },
      tableData: [
        {
          number: "1",
          describe: "描述xxxx",
          unit: "单位xx",
          discoverer: "小明",
          gist: "依据xx",
          date: "2021-09-21",
          source: "系统同步",
          association: "xx",
          money: "111,222",
        },
        {
          number: "2",
          describe: "描述xxxx",
          unit: "单位xx",
          discoverer: "小明",
          gist: "依据xx",
          date: "2021-09-21",
          source: "系统同步",
          association: "xx",
          money: "111,222",
        },
        {
          number: "3",
          describe: "描述xxxx",
          unit: "单位xx",
          discoverer: "小明",
          gist: "依据xx",
          date: "2021-09-21",
          source: "页面新增",
          association: "xx",
          money: "111,222",
        },
        {
          number: "4",
          describe: "描述xxxx",
          unit: "单位xx",
          discoverer: "小明",
          gist: "依据xx",
          date: "2021-09-21",
          source: "页面新增",
          association: "xx",
          money: "111,222",
        },
      ],
      addVisible: false,
      editVisible: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    search() {},
    // 新增
    addRow() {
      this.addVisible = true;
    },
    addSubmit() {
      this.addVisible = false;
      this.$message({
        message: "新增成功！",
        type: "success",
      });
    },
    // 编辑
    editRow() {
      this.editVisible = true;
    },
    editSubmit() {
      this.editVisible = false;
      this.$message({
        message: "编辑成功！",
        type: "success",
      });
    },
    // 删除
    deteleRow(index) {
      this.tableData.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.audit-history {
  padding: 20px 20px;
  .orange {
    color: #fd9d27;
  }
  .blue {
    color: #0d87d6;
  }
  .red {
    color: #db2526;
  }
  .pointer {
    cursor: pointer;
  }
  .conter {
    width: 100%;
    float: left;
  }
  >>> .el-button--primary {
    background-color: #42d7a5 !important;
    border: none;
  }
  .titleMes {
    padding: 10px 0 0;
    box-sizing: border-box;
  }
  >>> .el-button {
    background: none;
    border: none;
  }
  >>> .el-table__header {
    border-top: none !important;
  }

  .handle-list {
    display: flex;
    flex-wrap: nowrap;
    padding-right: 5%;
    > div {
      padding-right: 10px;
      white-space: nowrap;
    }
  }

  .page {
    width: 100%;
    padding: 20px 10px;
    display: flex;
    justify-content: flex-end;
  }
}
.audit-history .el-table ::v-deep .el-table__header {
  border: none !important;
}
</style>
