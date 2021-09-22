<template>
  <div class="page-container indocator">
    <div class="filter-container">
      <el-button type="primary" @click="add()">新增指标</el-button>
      <div class="indocator-btn-box">
        <el-button class="gary-border">导入</el-button>
        <el-button class="gary-border">下发</el-button>
        <el-button class="gary-border">更新</el-button>
        <el-button class="gary-border">查看指标结果</el-button>
      </div>
    </div>
    <!-- @sort-change="sortChange"
      @selection-change="handleSelectionChange" -->
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
    >
      <el-table-column type="selection" align="center" />
      <el-table-column label="指标类型" prop="type" />
      <el-table-column label="指标名称" prop="name" />
      <el-table-column label="单位" show-overflow-tooltip prop="danwei" />
      <el-table-column label="资料提供部门" align="center" prop="bumen" />
      <el-table-column label="取数口径或公式" prop="gongshi" />
      <el-table-column label="指标值" width="180px" align="center" prop="int">
        <template slot-scope="scope">
          <el-input v-model="scope.row.int" />
        </template>
      </el-table-column>
      <el-table-column label="是否被审计单位提供" prop="iftigong" />
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
        <el-form-item label="指标类型" prop="type">
          <el-input v-model="temp.type" placeholder="请输入指标类型" />
        </el-form-item>
        <el-form-item label="指标名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入指标名称" />
        </el-form-item>
        <el-form-item label="单位" prop="danwei">
          <el-input v-model="temp.danwei" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="资料提供部门" prop="bumen">
          <el-input v-model="temp.bumen" placeholder="请输入资料提供部门" />
        </el-form-item>
        <el-form-item label="取数口径或公式" prop="gongshi">
          <el-input v-model="temp.gongshi" placeholder="请输入取数口径或公式" />
        </el-form-item>
        <el-form-item label="指标值" prop="int">
          <el-input v-model="temp.int" placeholder="请输入指标值" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button v-if="!closeStatus" @click="dialogFormVisible = false"
          >取消</el-button
        >
        <el-button
          v-if="closeStatus"
          type="primary"
          @click="dialogFormVisible = false"
          >关闭</el-button
        >
        <el-button
          v-if="!closeStatus"
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
          >保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import _ from "lodash";

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
        sortBy: "desc",
        sortName: "createTime",
      },
      temp: {
        // 业务分类
        name: null,
        danwei: null,
        bumen: null,
        gongshi: null,
        int: null,
        iftigong: null,
      },
      selections: [],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改指标",
        create: "新增指标",
        show: "查看指标",
      },
      // 新增的表单验证
      rules: {
        type: [
          { required: true, message: "请填写指标类型", trigger: "change" },
        ],
        name: [
          { required: true, message: "请填写指标名称", trigger: "change" },
        ],
        danwei: [{ required: false, message: "请填写单位", trigger: "change" }],
        bumen: [
          { required: false, message: "请填写资料提供部门", trigger: "change" },
        ],
        gongshi: [
          {
            required: false,
            message: "请填写取数口径或公式",
            trigger: "change",
          },
        ],
      },
      closeStatus: false,
      downloadLoading: false,
      headers: { "Content-Type": "multipart/form-data" },
      file: "",
    };
  },
  watch: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.list = [
        {
          type: "xxx",
          name: "x",
          danwei: "xxx",
          bumen: "xxxx",
          gongshi: "xx",
          int: "",
          iftigong: "xxxx",
        },
      ];
    },
    add(){
      this.dialogFormVisible = true
    },
    createData(){

    },
    updateData(){
      
    }

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
</style>

