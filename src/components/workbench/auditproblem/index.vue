<template>
  <div class="page-container auditproblem">
    <div class="filter-container">
      <el-button type="primary" @click="add()">新增</el-button>
      <div class="auditproblem-btn-box"></div>
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
      <el-table-column label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="领域" prop="type" />
      <el-table-column label="问题" prop="name" />
      <el-table-column label="依据" show-overflow-tooltip prop="danwei" />
      <el-table-column label="描述" align="center" prop="bumen" />
      <el-table-column label="发现日期" prop="gongshi" />
      <el-table-column
        label="风险金额（元）"
        width="180px"
        align="center"
        prop="int"
      />
      <el-table-column label="管理建议" prop="iftigong" />
      <el-table-column label="发现人" prop="iftigong" />
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
        <el-form-item label="领域" prop="type">
          <el-select v-model="temp.type" placeholder="请选择领域">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题" prop="name">
          <el-input v-model="temp.name" placeholder="请输入问题" />
        </el-form-item>
        <el-form-item label="依据" prop="danwei">
          <el-select v-model="temp.danwei" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" class="citebtn">引用知识库</el-button>
        <el-form-item label="描述" prop="bumen">
          <el-input v-model="temp.bumen" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="管理建议" prop="int">
          <el-input v-model="temp.int" placeholder="请输入管理建议" />
        </el-form-item>
        <el-form-item label="发现日期" prop="gongshi">
          <el-input
            v-model="temp.gongshi"
            type="date"
            placeholder="请输入发现日期"
          />
        </el-form-item>
        <el-form-item label="发现人" prop="int">
          <el-input v-model="temp.int" />
        </el-form-item>
        <el-form-item label="风险金额（万元）" prop="int">
          <el-input v-model="temp.int" placeholder="请输入风险金额" />
        </el-form-item>
        <el-form-item label="关联任务" prop="int">
          <el-select v-model="temp.int" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传附件" prop="int">
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <!-- <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div> -->
          </el-upload>
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
      options: [
        { value: "xxx1", label: "xxx1" },
        { value: "xxx2", label: "xxx2" },
      ],
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
        danwei: [],
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
    this.getList();
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
    add() {
      this.dialogFormVisible = true;
    },
    createData() {},
    updateData() {},
  },
};
</script>
<style scoped>
.auditproblem-btn-box {
  float: right;
}
.gary-border {
  border: 1px solid #ccc;
}
</style>
<style>
.auditproblem .el-form-item {
  width: 49%;
  margin-right: 1%;
}
.auditproblem .detail-form {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  flex-wrap: wrap;
}
.auditproblem .el-select {
  width: 100%;
}
.auditproblem .citebtn {
  height: 40px;
}
</style>

