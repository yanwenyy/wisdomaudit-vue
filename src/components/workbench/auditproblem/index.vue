<template>
  <div class="page-container auditproblem">
    <div class="filter-container">
      <el-row :gutter="24" class="titleMes">
        <!-- 自建新增   -->
        <el-col :span="1.5">
          <el-button type="primary" @click="add()">新增审计问题</el-button>
        </el-col>

        <div class="search">
          <el-input placeholder="请输入" v-model="pageQuery.condition.problem">
          </el-input>
          <div class="search_icon">
            <i class="el-icon-search" style="color: rgba(0, 0, 0, 0.5)"></i>
          </div>
          <el-button type="primary" @click="getList">筛选</el-button>
        </div>
      </el-row>

      <!-- <div class="auditproblem-btn-box"></div> -->
    </div>
    <!-- @sort-change="sortChange"
       -->
    <el-table
      ref="problemtable"
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
      <el-table-column label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="问题">
        <template slot-scope="scope">
          <div class="canclick" @click="openDetail(scope.$index)">
            {{ scope.row.problem }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="领域" prop="field">
        <template slot-scope="scope">
          <div>
            {{ fieldFilter(scope.row.field) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="专题" prop="special">
        <template slot-scope="scope">
          <div>
            {{ specialFilter(scope.row.special) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="风险金额（万元）"
        width="180px"
        align="center"
        prop="riskAmount"
      />
      <el-table-column label="发现日期">
        <template slot-scope="scope">
          {{ repDate(scope.row.problemDiscoveryTime) }}
        </template>
      </el-table-column>
      <el-table-column label="发现人" prop="problemFindPeople" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="checkDetail(scope.row.problemListUuid)"
            type="text"
            style="color: #1371cc"
            >查看</el-button
          >
          <el-button
            @click="del(scope.row.problemListUuid)"
            type="text"
            style="color: red"
            >删除</el-button
          >
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
      title="新增问题"
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
        <el-form-item label="问题" prop="problem">
          <el-input v-model="temp.problem" placeholder="请输入问题" />
        </el-form-item>
        <el-form-item label="领域" prop="field">
          <el-select v-model="temp.field" placeholder="请选择领域">
            <el-option
              v-for="item in CategoryList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专题" prop="special">
          <el-select v-model="temp.special" placeholder="请选择专题">
            <el-option
              v-for="item in SPECIALList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item> </el-form-item>
        <el-form-item label="依据" prop="basis" class="long">
          <el-select v-model="temp.basis" multiple placeholder="请选择" >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" class="citebtn" @click="openbasis()">引用审计依据</el-button>
        <el-form-item label="描述" prop="describe" class="long">
          <el-input v-model="temp.describe" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="管理建议" prop="managementAdvice" class="long">
          <el-input
            v-model="temp.managementAdvice"
            placeholder="请输入管理建议"
          />
        </el-form-item>
        <el-form-item label="发现日期" prop="problemDiscoveryTime">
          <!-- <el-input
            v-model="temp.problemDiscoveryTime"
            type="date"
            placeholder="请输入发现日期"
          /> -->
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="temp.problemDiscoveryTime"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="发现人" prop="problemFindPeople">
          <el-input
            v-model="temp.problemFindPeople"
            placeholder="请输入发现人"
          />
        </el-form-item>
        <el-form-item label="风险金额（万元）" prop="riskAmount">
          <el-input
            v-model.number="temp.riskAmount"
            placeholder="请输入风险金额"
          />
        </el-form-item>
        <el-form-item label="关联任务" prop="auditTaskUuid">
          <el-select v-model="temp.auditTaskUuid" multiple placeholder="请选择">
            <el-option
              v-for="item in auditTasklList"
              :key="item.auditTaskUuid"
              :label="item.taskName"
              :value="item.auditTaskUuid"
            >
            </el-option>
          </el-select>
        </el-form-item>
        
        <!-- <el-form-item label="上传附件" prop="int">
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
          </el-upload>
        </el-form-item> -->
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
        <el-button v-if="!closeStatus" type="primary" @click="createData()"
          >保存</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="问题详情"
      :visible.sync="dialogDetailVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="detailForm"
        :model="dqProblem"
        :rules="rules"
        label-position="right"
        class="detail-form"
      >
        <el-form-item label="问题" prop="problem">
          <el-input v-model="dqProblem.problem" placeholder="请输入问题" />
        </el-form-item>
        <el-form-item label="领域" prop="field">
          <el-select v-model="dqProblem.field" placeholder="请选择领域">
            <el-option
              v-for="item in CategoryList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专题" prop="special">
          <el-select v-model="dqProblem.special" placeholder="请选择专题">
            <el-option
              v-for="item in SPECIALList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="describe">
          <el-input v-model="dqProblem.describe" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="管理建议" prop="managementAdvice">
          <el-input
            v-model="dqProblem.managementAdvice"
            placeholder="请输入管理建议"
          />
        </el-form-item>
        <el-form-item label="发现日期" prop="problemDiscoveryTime">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="dqProblem.problemDiscoveryTime"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="发现人" prop="problemFindPeople">
          <el-input
            v-model="dqProblem.problemFindPeople"
            placeholder="请输入发现人"
          />
        </el-form-item>
        <el-form-item label="风险金额（万元）" prop="riskAmount">
          <el-input
            v-model.number="dqProblem.riskAmount"
            placeholder="请输入风险金额"
          />
        </el-form-item>
        <el-form-item label="关联任务" prop="auditTaskUuid">
          <el-select
            disabled
            v-model="dqProblem.auditTaskUuid"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in auditTasklList"
              :key="item.auditTaskUuid"
              :label="item.taskName"
              :value="item.auditTaskUuid"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item> </el-form-item>
        <el-form-item label="依据" prop="basis">
          <el-select v-model="dqProblem.basis" multiple placeholder="请选择">
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

        <!-- <el-form-item label="领域" prop="field">
          <el-input
            v-model="dqProblem.field"
            disabled
            placeholder="请输入问题"
          />
        </el-form-item>
        <el-form-item label="问题" prop="problem">
          <el-input
            v-model="dqProblem.problem"
            disabled
            placeholder="请输入问题"
          />
        </el-form-item>
        <el-form-item label="描述" prop="describe">
          <el-input
            v-model="dqProblem.describe"
            disabled
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="管理建议" prop="managementAdvice">
          <el-input
            v-model="dqProblem.managementAdvice"
            disabled
            placeholder="请输入管理建议"
          />
        </el-form-item>
        <el-form-item label="发现日期" prop="problemDiscoveryTime">
          <el-input
            :value="repDate(dqProblem.problemDiscoveryTime)"
            disabled
            placeholder="请输入发现日期"
          />
        </el-form-item>
        <el-form-item label="发现人" prop="problemFindPeople">
          <el-input
            v-model="dqProblem.problemFindPeople"
            disabled
            placeholder="请输入发现人"
          />
        </el-form-item>
        <el-form-item label="风险金额（万元）" prop="riskAmount">
          <el-input
            v-model="dqProblem.riskAmount"
            disabled
            placeholder="请输入风险金额"
          />
        </el-form-item>
        <el-form-item label="关联任务" prop="auditTaskUuid">
          <el-input
            v-model="dqProblem.auditTaskUuid"
            disabled
            placeholder="请输入关联任务"
          />
        </el-form-item>
        <el-form-item label="依据" prop="basis">
          <el-input
            v-model="dqProblem.basis"
            disabled
            placeholder="请输入依据"
          />
        </el-form-item> -->
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="updateData()" v-if="ifupdata"
          >保存修改</el-button
        >
        <el-button type="primary" @click="dialogDetailVisible = false"
          >关闭</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
  title="引用审计依据"
  :visible.sync="basisdialog"
  width="80%">
  <span>审计依据正在完善</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="basisdialog = false">取 消</el-button>
    <el-button type="primary" @click="basisdialog = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import Pagination from "@WISDOMAUDIT/components/Pagination"; // secondary package based on el-pagination
import _ from "lodash";
import axios from "axios";
export default {
  props: ["active_project"],
  components: { Pagination },
  filters: {},
  data() {
    return {
      dqProblem: {},
      options: [
        { value: "xxx1", label: "xxx1" },
        { value: "xxx2", label: "xxx2" },
      ],
      tableKey: "indicator",
      list: null,
      total: 0,
      listLoading: false,
      pageQuery: {
        condition: {
          managementProjectUuid: this.active_project,
          problem: "",
        },
        pageNo: 1,
        pageSize: 20,
        sortBy: "",
        sortName: "",
      },
      temp: {
        managementProjectUuid: this.active_project,
        // 业务分类
        auditTaskUuid: [],
        basis: "",
        describe: "",
        field: "",
        special: "",
        isDeleted: 0,
        problem: "",
        problemDiscoveryTime: "",
        problemFindPeople: "",
        managementAdvice: "",
        problemListUuid: "",
        riskAmount: "",
        status: 0,
      },
      selections: [],
      dialogFormVisible: false,
      ifupdata: false,
      dialogDetailVisible: false,
      dialogStatus: "",
      // 新增的表单验证
      rules: {
        auditTaskUuid: [
          { required: true, message: "请选择关联任务", trigger: "change" },
        ],
        basis: [{ required: true, message: "请选择依据", trigger: "change" }],
        describe: [
          { required: true, message: "请填写描述", trigger: "change" },
        ],
        field: [{ required: true, message: "请选择领域", trigger: "change" }],
        managementAdvice: [
          { required: true, message: "请填写意见", trigger: "change" },
        ],
        problem: [{ required: true, message: "请填写问题", trigger: "change" }],
        problemDiscoveryTime: [
          { required: true, message: "请填写发现时间", trigger: "change" },
        ],
        problemFindPeople: [
          { required: true, message: "请填写发现人", trigger: "change" },
        ],
        special: [{ required: true, message: "请选择专题", trigger: "change" }],
        riskAmount: [
          { required: true, message: "请填写风险金额", trigger: "change" },
        ],
      },
      closeStatus: false,
      downloadLoading: false,
      headers: { "Content-Type": "multipart/form-data" },
      file: "",
      problemtableSelection: [],
      CategoryList: [],
      SPECIALList: [],
      auditTasklList: [],
      basisdialog:false
    };
  },
  watch: {},
  created() {
    this.getloadcascader("Category");
    this.getloadcascader("SPECIAL");
    this.getSelectTask();
    this.getList();
  },
  methods: {
    //打开依据
    openbasis(){
      this.basisdialog = true
    },
    //领域返显
    fieldFilter(str) {
      let rep = "";
      this.CategoryList.forEach((e) => {
        if (e.value == str) {
          rep = e.label;
        }
      });
      return rep;
    },
    //专题返显
    specialFilter(str) {
      let rep = "";
      this.SPECIALList.forEach((e) => {
        if (e.value == str) {
          rep = e.label;
        }
      });
      return rep;
    },
    getSelectTask() {
      axios({
        url: `/wisdomaudit/auditTask/selectTask`,
        method: "post",
        data: {
          managementProjectUuid: this.active_project,
        },
      }).then((res) => {
        this.auditTasklList = res.data.data;
      });
    },
    getloadcascader(str) {
      axios({
        url: `/wisdomaudit/init/loadcascader`,
        method: "post",
        data: {
          typecode: str,
        },
      }).then((res) => {
        if (str == "Category") {
          this.CategoryList = res.data.data;
        } else if (str == "SPECIAL") {
          this.SPECIALList = res.data.data;
        }
      });
    },
    openDetail(int) {
      axios({
        url:
          `/wisdomaudit/problemList/getById/` + this.list[int].problemListUuid,
        method: "get",
        data: {},
      }).then((res) => {
        this.dqProblem = res.data.data;
        this.dqProblem.auditTaskUuid = this.dqProblem.auditTaskUuid.split(",");
        this.dqProblem.basis = this.dqProblem.basis.split(",");
        this.ifupdata = true;
        this.dialogDetailVisible = true;
        this.$nextTick(() => {
          this.$refs["detailForm"].clearValidate();
        });
      });
    },
    checkDetail(pid) {
      axios({
        url: `/wisdomaudit/problemList/getById/` + pid,
        method: "get",
        data: {},
      }).then((res) => {
        this.dqProblem = res.data.data;
        this.dqProblem.auditTaskUuid = this.dqProblem.auditTaskUuid.split(",");
        this.dqProblem.basis = this.dqProblem.basis.split(",");
        this.ifupdata = false;
        this.dialogDetailVisible = true;
        this.$nextTick(() => {
          this.$refs["detailForm"].clearValidate();
        });
      });
    },
    repDate(data) {
      let date = new Date(data);
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      let h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      let m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D;
    },
    getList() {
      this.listLoading = true;
      axios({
        url: `/wisdomaudit/problemList/pageList`,
        method: "post",
        data: this.pageQuery,
      }).then((res) => {
        console.log(res.data.data);
        this.listLoading = false;
        if (res.data.code == 0) {
          this.list = res.data.data.records;
          this.total = res.data.data.total;
        }
      });
    },
    add() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleSelectionChange(val) {
      this.problemtableSelection = val;
    },
    del(pid) {
      this.$confirm("确认删除该条数据吗?删除后数据不可恢复?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        axios({
          url: `/wisdomaudit/problemList/delete/` + pid,
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
      });
      let rep = [];
      // for(let i = 0;i<this.problemtableSelection.length;i++){
      //   rep.push(this.problemtableSelection[i].problemListUuid)
      // }
      // rep =  rep.join(",")
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let rep = this.temp;
          rep.auditTaskUuid = rep.auditTaskUuid.join(",");
          rep.basis = rep.basis.join(",");
          axios({
            url: `/wisdomaudit/problemList/save`,
            method: "post",
            data: rep,
          }).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.dialogFormVisible = false;
              this.temp.auditTaskUuid = [];
              this.temp.basis = "";
              this.temp.describe = "";
              this.temp.field = "";
              this.temp.problem = "";
              this.temp.problemDiscoveryTime = "";
              this.temp.problemFindPeople = "";
              this.temp.managementAdvice = "";
              this.temp.riskAmount = "";
              this.temp.special = "";
              this.getList();
            }
          });
        } else {
          return false;
        }
      });
    },
    updateData() {
      this.$refs["detailForm"].validate((valid) => {
        if (valid) {
          let rep = this.dqProblem;
          rep.auditTaskUuid = rep.auditTaskUuid.join(",");
          rep.basis = rep.basis.join(",");
          axios({
            url: `/wisdomaudit/problemList/update`,
            method: "put",
            data: rep,
          }).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                message: "编辑成功",
                type: "success",
              });
              this.dialogDetailVisible = false;
              this.getList();
            }
          });
        }
      });
    },
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
.auditproblem .el-button {
  background: none;
  border: none;
}
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
.canclick {
  color: rgb(27, 168, 250);
  cursor: pointer;
}
.search {
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.search .el-input__inner {
  width: 220px !important;
  border-radius: 5px 0 0 5px;
}
.search .el-input__inner {
  width: 180px;
  display: flex;
  float: right;
}
.search .search_icon {
  position: absolute;
  top: 0;
  right: 70px;
  width: 37px;
  height: 37px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.search .el-button {
  border-radius: 0 5px 5px 0;
  /* background: #1371cc !important; */
}
.long {
  width: 70% !important;
}
</style>

