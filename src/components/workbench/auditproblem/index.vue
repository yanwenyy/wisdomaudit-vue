<template>
  <div class="page-container auditproblem">
    <div class="filter-container">
      <el-button type="primary" @click="add()">新增</el-button>
      <div class="auditproblem-btn-box">
      </div>
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
      <el-table-column label="领域" prop="field" >
        <template slot-scope="scope">
          <div>
            {{ fieldFilter(scope.row.field) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="问题">
        <template slot-scope="scope">
          <div class="canclick" @click="openDetail(scope.$index)">
            {{ scope.row.problem }}
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
          <el-button @click="checkDetail(scope.row.problemListUuid)">查看</el-button>
          <el-button @click="del(scope.row.problemListUuid)" style="color:red;">删除</el-button>
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
        <el-form-item label="问题" prop="problem">
          <el-input v-model="temp.problem" placeholder="请输入问题" />
        </el-form-item>
        <el-form-item label="描述" prop="describe">
          <el-input v-model="temp.describe" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="管理建议" prop="managementAdvice">
          <el-input
            v-model="temp.managementAdvice"
            placeholder="请输入管理建议"
          />
        </el-form-item>
        <el-form-item label="发现日期" prop="problemDiscoveryTime">
          <el-input
            v-model="temp.problemDiscoveryTime"
            type="date"
            placeholder="请输入发现日期"
          />
        </el-form-item>
        <el-form-item label="发现人" prop="problemFindPeople">
          <el-input
            v-model="temp.problemFindPeople"
            placeholder="请输入发现人"
          />
        </el-form-item>
        <el-form-item label="风险金额（万元）" prop="riskAmount">
          <el-input v-model="temp.riskAmount" placeholder="请输入风险金额" />
        </el-form-item>
        <el-form-item label="关联任务" prop="auditTaskUuid">
          <el-select
            v-model="temp.auditTaskUuid"
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
        <el-form-item>
        </el-form-item>
        <el-form-item label="依据" prop="basis">
          <el-select v-model="temp.basis" multiple placeholder="请选择">
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
        ref="dataForm"
        :model="dqProblem"
        label-position="right"
        class="detail-form"
      >
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
        <el-form-item label="问题" prop="problem">
          <el-input v-model="dqProblem.problem" placeholder="请输入问题" />
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
          <el-input v-model="dqProblem.problemDiscoveryTime"/>
          <el-input
            v-model="dqProblem.problemDiscoveryTime"
            type="date"
            placeholder="请输入发现日期"
          />
        </el-form-item>
        <el-form-item label="发现人" prop="problemFindPeople">
          <el-input
            v-model="dqProblem.problemFindPeople"
            placeholder="请输入发现人"
          />
        </el-form-item>
        <el-form-item label="风险金额（万元）" prop="riskAmount">
          <el-input v-model="dqProblem.riskAmount" placeholder="请输入风险金额" />
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
  </div>
</template>

<script>
import Pagination from "@WISDOMAUDIT/components/Pagination"; // secondary package based on el-pagination
import _ from "lodash";
import axios from "axios";
export default {
  props:['active_project'],
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
          managementProjectUuid: this.active_project
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
      ifupdata:false,
      dialogDetailVisible: false,
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
      problemtableSelection:[],
      CategoryList:[],
      SPECIALList:[],
      auditTasklList:[]
    };
  },
  watch: {},
  created() {
    this.getloadcascader('Category')
    this.getloadcascader('SPECIAL')
    this.getSelectTask()
    this.getList();
  },
  methods: {
    //领域返显
    fieldFilter(str){
      let rep = ''
      this.CategoryList.forEach( e =>{
       if(e.value == str) {
         rep = e.label
       }
      })
      return rep
    },
    //专题返显
    specialFilter(str){
      let rep = ''
      this.SPECIALList.forEach( e =>{
       if(e.value == str) {
         rep = e.label
       }
      })
      return rep
    },
    getSelectTask(){
      axios({
        url: `/wisdomaudit/auditTask/selectTask`,
        method: "post",
        data: {
          managementProjectUuid: this.active_project
        },
      }).then((res) => {
        this.auditTasklList = res.data.data
      })
    },
    getloadcascader(str){
      axios({
        url: `/wisdomaudit/init/loadcascader`,
        method: "post",
        data: {
          "typecode": str
        },
      }).then((res) => {
        if(str=='Category'){
          this.CategoryList = res.data.data
        }else if(str=='SPECIAL'){
          this.SPECIALList = res.data.data
        }
      })

    },
    openDetail(int) {
      axios({
        url: `/wisdomaudit/problemList/getById/`+this.list[int].problemListUuid,
        method: "get",
        data: {},
      }).then((res) => {
        this.dqProblem = res.data.data;
        this.dqProblem.auditTaskUuid = this.dqProblem.auditTaskUuid.split(',')
        this.dqProblem.basis = this.dqProblem.basis.split(',')
        this.ifupdata = true
        this.dialogDetailVisible = true;
      })
    },
    checkDetail(pid){
      axios({
        url: `/wisdomaudit/problemList/getById/`+pid,
        method: "get",
        data: {},
      }).then((res) => {
        this.dqProblem = res.data.data;
        this.dqProblem.auditTaskUuid = this.dqProblem.auditTaskUuid.split(',')
        this.dqProblem.basis = this.dqProblem.basis.split(',')
        this.ifupdata = false
        this.dialogDetailVisible = true;
      })
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
      this.listLoading = true
      axios({
        url: `/wisdomaudit/problemList/pageList`,
        method: "post",
        data: this.pageQuery,
      }).then((res) => {
        console.log(res.data.data);
        this.listLoading = false
        if (res.data.code == 0) {
          this.list = res.data.data.records;
        }
      });
    },
    add() {
      this.dialogFormVisible = true;
    },
    handleSelectionChange (val) {
      this.problemtableSelection = val;
    },
    del(pid){
      console.log(pid)
      let rep = []
      // for(let i = 0;i<this.problemtableSelection.length;i++){
      //   rep.push(this.problemtableSelection[i].problemListUuid)
      // }
      // rep =  rep.join(",")
      axios({
        url: `/wisdomaudit/problemList/delete/`+pid,
        method: "delete",
        data: {},
      }).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.getList()
        }
      })
    },
    createData() {
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
          this.temp.basis = '';
          this.temp.describe = '';
          this.temp.field = '';
          this.temp.problem = '';
          this.temp.problemDiscoveryTime = '';
          this.temp.problemFindPeople = '';
          this.temp.managementAdvice = '';
          this.temp.riskAmount = '';
          this.temp.special = '';
          this.getList()
        }
      });
    },
    updateData() {
      let rep = this.dqProblem
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
          this.getList()
        }
      })
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
</style>

