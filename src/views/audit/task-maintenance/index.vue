<template>
  <!-- 审计任务维护列表 -->
  <div class="sjzl">
    <div class="conter">
      <div class="two">
        <div class="projectTab">
          <el-row :gutter="24" class="titleMes">
            <el-col :span="1.5">
              <el-button type="primary" @click="addPerson()">新增</el-button>
            </el-col>
          </el-row>
          <!-- 表单 -->
          <el-table :data="taskData" style="width: 100%">
            <el-table-column prop="auditModelName" label="模型任务名称">
            </el-table-column>
            <el-table-column prop="belongField" label="领域"> </el-table-column>
            <el-table-column prop="belongSpcial" label="专题">
            </el-table-column>
            <el-table-column prop="peopleName" label="责任人">
              <template slot-scope="scope">
                <el-form>
                  <el-form-item>
                    <el-select
                      v-model="scope.row.peopleTableUuid"
                      filterable
                      @change="selectChange(scope.row)"
                    >
                      <el-option
                        v-for="item in tableData"
                        :key="item.peopleTable.peopleTableUuid"
                        :label="item.peopleTable.peopleName"
                        :value="item.peopleTable.peopleTableUuid"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="taskDescription" label="任务描述">
            </el-table-column>
            <el-table-column prop="address" label="附件" width="90">
              <div class="update">
                <i class="update_icon">
                  <svg
                    t="1631877671204"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="9939"
                    width="200"
                    height="200"
                  >
                    <path
                      d="M825.6 198.4H450.1l-14.4-28.7c-18.8-37.6-56.5-60.9-98.5-60.9H174.1C113.4 108.8 64 158.2 64 218.9v561.9c0 74.1 60.3 134.4 134.4 134.4h627.2c74.1 0 134.4-60.3 134.4-134.4v-448c0-74.1-60.3-134.4-134.4-134.4z m44.8 582.4c0 24.7-20.1 44.8-44.8 44.8H198.4c-24.7 0-44.8-20.1-44.8-44.8V467.2h716.8v313.6z m0-403.2H153.6V218.9c0-11.3 9.2-20.5 20.5-20.5h163.1c7.8 0 14.9 4.4 18.4 11.4l39.1 78.2h430.9c24.7 0 44.8 20.1 44.8 44.8v44.8z"
                      fill="#FD9D27"
                      p-id="9940"
                    ></path>
                  </svg>
                </i>
                <span>2</span>
              </div>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- <el-button
                  type="text"
                  style="color: #1371cc"
                  size="small"
                  @click.native.prevent="editModel()"
                >
                  编辑
                </el-button> -->
                <el-button
                  type="text"
                  style="color: #db454b"
                  size="small"
                  @click.native.prevent="deleteModel(scope.row)"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 表单 end-->
        </div>

        <!-- 分页 -->
        <div class="page">
          <el-pagination
            background
            :hide-on-single-page="false"
            layout="prev, pager, next"
            :page-sizes="[2, 4, 6, 8]"
            :current-page="project.current"
            @current-change="handleCurrentChangeTask"
            :page-size="project.size"
            :total="project.total"
          ></el-pagination>
        </div>
        <!-- 分页 end-->
      </div>
    </div>

    <!-- 审计任务维护编辑弹框 -->
    <el-dialog title="增加" :visible.sync="editModelDialogVisible" width="50%">
      <el-form label-width="80px" class="selfTask">
        <el-form-item label="自建任务名称：">
          <el-input placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="责任人：">
          <el-select placeholder="请选择" class="auditeeInput" v-model="value">
            <el-option label="是" value="shi"></el-option>
            <el-option label="否" value="fou"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述：">
          <el-input type="textarea" style="top: -35px; width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="上传附件：">
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
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editModelDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editModelDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 审计任务维护添加弹框 -->
    <el-dialog :visible.sync="addDialogVisible" width="60%">
      <div class="title">2021年泰安分公司xxx领导经责审计</div>
      <div class="addPerson" v-if="step == 1">
        <div class="stepNew">
          <div class="stepOneN">
            <div>1.第一步：添加组员</div>
            <span></span>
          </div>
          <div class="stepTwoN">
            <span></span>
            <div>2.第二步：添加审计任务</div>
            <span></span>
          </div>
        </div>
        <div class="text">请选择组员，可多选</div>
        <div class="personMessage">
          <el-table :data="personMes" @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="全选组员">
              <template slot-scope="scope">
                {{ scope.row.peopleName }} {{ scope.row.memberPhone }}
                {{ scope.row.memberDepartment }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="editPerson">
          <el-table :data="peopleSelection">
            <el-table-column label="已选组员">
              <template slot-scope="scope">
                {{ scope.row.peopleTable.peopleName }}
                {{ scope.row.peopleTable.memberPhone }}
                {{ scope.row.peopleTable.memberDepartment }}
              </template>
            </el-table-column>
            <el-table-column label="项目接口人">
              <template slot-scope="scope">
                <el-form>
                  <el-form-item>
                    <el-select
                      v-model="scope.row.isLiaison"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in isconperOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  style="color: #db454b"
                  size="small"
                  @click.native.prevent="
                    deletePerson(scope.$index, peopleSelection)
                  "
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="stepBtn">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button class="nextBtn" @click="nextBtn">下一步</el-button>
        </div>
      </div>

      <div class="addAudit" v-else-if="step == 2">
        <div class="stepNew">
          <div class="auditStepOneN">
            <div>1.第一步：添加组员</div>
            <span></span>
          </div>
          <div class="auditStepTwoN">
            <span></span>
            <div>2.第二步：添加审计任务</div>
            <span></span>
          </div>
        </div>
        <div class="optionBtn" v-if="radio == '1'">
          <span>类型：</span>
          <el-radio v-model="radio" label="1">模型任务</el-radio>
          <el-radio v-model="radio" label="2">自建任务</el-radio>
          <el-row style="margin-top: 10px">
            <el-col :span="15">
              <div style="margin-top: 2.5%; color: #5f6165">
                请选择想要引用的模型(可多选)
              </div>
            </el-col>
            <el-col :span="9">
              <el-input
                placeholder="请输入内容"
                v-model="modelQuery.condition.modelName"
                class="input-with-select"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="queryModel"
                ></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table
            :data="modelTableData"
            style="width: 100%"
            @selection-change="handleSelectionChangeModel"
          >
            <el-table-column type="selection"> </el-table-column>
            <el-table-column prop="auditModelUuid" label="模型编号">
            </el-table-column>
            <el-table-column prop="belongField" label="所属领域">
            </el-table-column>
            <el-table-column prop="belongSpcial" label="所属专题">
            </el-table-column>
            <el-table-column prop="modelName" label="模型名称">
            </el-table-column>
            <el-table-column prop="address" label="说明" width="300">
            </el-table-column>
            <el-table-column prop="ruleDescription" label="规则" width="300">
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="page">
            <el-pagination
              background
              :hide-on-single-page="false"
              layout="prev, pager, next"
              :page-sizes="[2, 4, 6, 8]"
              :current-page="project.current"
              @current-change="handleCurrentChangeModel"
              :page-size="project.size"
              :total="project.total"
            ></el-pagination>
          </div>
          <!-- 分页 end-->
        </div>
        <div v-else-if="radio == '2'" class="selfTask">
          <el-form label-width="80px" >
            <el-form-item label="类型：" style="margin-bottom: 50px">
              <div style="margin-top: -7.7%; margin-bottom: 20px">
                <el-radio v-model="radio" label="1">模型任务</el-radio>
                <el-radio v-model="radio" label="2">自建任务</el-radio>
              </div>
            </el-form-item>
            <el-form-item label="自建任务名称：">
              <el-input placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="责任人：">
              <el-select
                placeholder="请选择"
                class="auditeeInput"
                v-model="value"
              >
                <el-option label="是" value="shi"></el-option>
                <el-option label="否" value="fou"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务描述：">
              <el-input
                type="textarea"
                style="top: -35px; width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="上传附件：">
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
                <div class="el-upload__tip" slot="tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>

        <div class="stepBtn">
          <el-button @click="prevoius">上一步</el-button>
          <el-button class="saveBtn">完成</el-button>
        </div>
      </div>

      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="dialogVisible = false" class="nextBtn"
          >下一步</el-button
        >
        </span> -->
    </el-dialog>
  </div>
</template>

<script>
import {
  projectMembership,
  editprojectMembership,
  getProjectMember,
  deletprojectMembership,
  addprojectMembership,
  auditModelList,
  quoteModel,
  editprojectMembershipList,
  modelTaskList,
  editmodelPerson,
  deletmodelTask
} from "@SDMOBILE/api/shandong/memberMaintenance.js";
export default {
  data() {
    return {
      taskData: [],
      radio: "1",
      project: "",
      step: 1, //判断步骤条
      addDialogVisible: false, //添加弹框的隐藏与显示
      editModelDialogVisible: false, //审计任务维护编辑
      color: "white", // 上传文件icon 颜色
      query: {
        condition: {
          managementProjectUuid: "",
        },
        pageNo: 1,
        pageSize: 10,
      },
      queryInfo: {
        condition: {
          managementProjectUuid: "8351286cd70c3f41c92f59ed425a4659",
          taskType: "1",
        },
        pageNo: 1,
        pageSize: 5,
      },

      tab: [{ name: "审计资料任务列表" }, { name: "已操作的资料列表" }],
      label: "黄金糕",
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      value: "",
      input3: "",
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
      ],
      leaderData: [
        {
          projectItem: "hk123456",
          name: "",
          mobile: "13564578989",
          company: "审计局",
          Department: "事业部",
          personCharge: "",
        },
      ],
      select: {},
      modelQuery: {
        condition: {
          modelName: "",
        },
        pageNo: 1,
        pageSize: 10,
      },
      personMes: [],
      peopleSelection: [],
      isconperOptions: [
        {
          value: 0,
          label: "是",
        },
        {
          value: 1,
          label: "否",
        },
      ],
      modelPerson: {
        managementProjectUuid: "",
        peopleName: "",
        peopleTableUuid: "",
        auditTaskUuid:''
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    nextBtn() {
      this.step = 2;
    },
    prevoius() {
      this.step = 1;
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    addData() {
      // alert(11);
      this.leaderData.push({
        projectItem: "hk123456",
        mobile: "13564578989",
        company: "审计局",
        Department: "事业部",
        role: "组长",
        personCharge: "",
      });
    },
    editModel() {
      this.editModelDialogVisible = true;
    },

    // 列表显示
    getmodelTaskList(data) {
      modelTaskList(data).then((resp) => {
        this.taskData = resp.data.records;
        console.log(this.taskData);
        this.project = resp.data;
      });
    },

    deleteModel(row){
      console.log(row.auditTaskUuid);
       deletmodelTask(row.auditTaskUuid).then((resp)=>{
         this.$message.success("删除成功！")
         this.$router.go(0)
       })
    },

    handleCurrentChangeTask(val) {
      let query = {
        pageNo: val,
        pageSize: this.project.pageSize,
        condition: {
          queryNum: "",
        },
      };
      this.getmodelTaskList(query);
    },
    // 组员查询
    getSelectData(data) {
      getProjectMember(data).then((resp) => {
        this.form = resp.data.records;
      });
    },

    selectChange(rows) {
      console.log(rows);
      this.modelPerson.managementProjectUuid = rows.managementProjectUuid;
      this.modelPerson.peopleTableUuid = rows.peopleTableUuid;
      this.modelPerson.auditTaskUuid = rows.auditTaskUuid;
      for(var i=0;i<this.tableData.length;i++){
        if(rows.peopleTableUuid == this.tableData[i].peopleTableUuid){
          this.modelPerson.peopleName = this.tableData[i].peopleTable.peopleName
        }
      }
      console.log(this.modelPerson);
      editmodelPerson(this.modelPerson).then((resp)=>{
        this.$message.success("设置成功！")
      })
    },
    // 添加人员页面
    addPerson() {
      this.addDialogVisible = true;
      this.getSelectData(this.select);
      this.personMes = this.form;
      auditModelList(this.modelQuery).then((resp) => {
        // console.log(resp);
        this.modelTableData = resp.data.records;
      });
    },
    handleSelectionChange(val) {
      for (var i = 0; i < val.length; i++) {
        for (var j = 0; j < this.peopleSelection.length; j++) {
          if (
            val[i].peopleTableUuid ==
            this.peopleSelection[j].peopleTable.peopleTableUuid
          ) {
            return this.$message.error("请勿选择已有的组员！");
          }
        }
        this.peopleSelection.push({
          peopleRole: 2,
          isLiaison: 0,
          peopleTableUuid: val[i].peopleTableUuid,
          peopleTable: {
            peopleTableUuid: val[i].peopleTableUuid,
            peopleName: val[i].peopleName,
            memberPhone: val[i].memberPhone,
            memberDepartment: val[i].memberDepartment,
          },
        });
        this.$nextTick(() => {
          this.$refs.multipleModel.clearSelection();
        });
      }
    },
    // 审计任务添加组员已选组员页面展示
    projectMember(data) {
      projectMembership(data).then((resp) => {
        this.loading = true;
        this.tableData = resp.data.records;
        console.log(this.tableData);
        this.peopleSelection = resp.data.records;
        // console.log(this.tableData);
        this.loading = false;
      });
    },
    //模型模糊查询
    queryModel() {
      auditModelList(this.modelQuery).then((resp) => {
        // console.log(resp);
        this.modelTableData = resp.data.records;
      });
    },
    //引入模型选择事件
    handleSelectionChangeModel(val) {
      for (var i = 0; i < val.length; i++) {
        this.selectauditModelList.auditModelList.push({
          auditModelUuid: val[i].auditModelUuid,
          modelName: val[i].modelName,
        });
      }
    },

    //  完成按钮
    saveBtn() {
      quoteModel(this.selectauditModelList).then((resp) => {
        console.log(resp);
      });
      editprojectMembershipList(this.peopleSelection).then((resp) => {
        console.log(this.resp);
        this.$message.success("修改成功！");
      });
    },
  },
  created() {
    this.getmodelTaskList(this.queryInfo);
    this.getSelectData(this.select);
    this.projectMember(this.query);
  },
  mounted() {},
};
</script>

<style scoped>
.sjzl .conter {
  width: 100%;
  float: left;
  padding: 10px;
}
/* 内容  按钮 */
.sjzl >>> .el-button--primary {
  background-color: #42d7a5 !important;
  border: none;
}
.titleMes {
  box-sizing: border-box;
}
.table {
}
.sjzl >>> .el-button {
  background: none;
  border: none;
}
.sjzl >>> .el-table__header {
  border-top: none !important;
}
.update {
  display: flex;
  align-items: center;
  justify-content: center;
}
.update_icon {
  width: 15px;
  height: 15px;
}
.update_icon svg {
  float: left;
  width: 15px;
  height: 15px;
}
.update span {
  color: #1371cc;
  margin-left: 5px;
}

.search {
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.search >>> .el-input__inner {
  width: 180px;
  display: flex;
  float: right;
}
.search >>> .search_icon {
  position: absolute;
  top: 0;
  right: 70px;
  background: #1371cc;
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
.search >>> .el-button {
  background: #1371cc !important;
}

.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
.title {
  border-bottom: 1px solid #d2d2d2;
  padding: 10px;
  text-align: center;
}
/* 方法二 */
.stepNew {
  /* border: 1px solid red; */
  width: 45%;
  height: 50px;
  margin: 30px auto;
}

/*  */
.stepOneN {
  width: 230px;
  font-size: 0;
  position: relative;
  float: left;
  background: #508ce6;
  z-index: 50;
  /* 更改此处的颜色即可完成 */
}

.stepOneN div {
  width: 180px;
  height: 50px;
  vertical-align: text-bottom;
  font-size: 15px;
  color: #fff;
  line-height: 50px;
  text-align: center;
}

.stepOneN span:nth-of-type(1) {
  border-width: 25px 0 25px 25px;
  border-style: solid;
  border-color: #e0e0e0 transparent #e0e0e0 transparent;
  position: absolute;
  top: 0;
  right: 0;
}

.auditStepOneN {
  width: 230px;
  font-size: 0;
  position: relative;
  float: left;
  background: #e0e0e0;
  z-index: 50;
  /* 更改此处的颜色即可完成 */
}

.auditStepOneN div {
  width: 180px;
  height: 50px;
  vertical-align: text-bottom;
  font-size: 15px;
  color: #000;
  line-height: 50px;
  text-align: center;
}

.auditStepOneN span:nth-of-type(1) {
  border-width: 25px 0 25px 25px;
  border-style: solid;
  border-color: #508ce6 transparent #508ce6 transparent;
  position: absolute;
  top: 0;
  right: 0;
}

/*  */
.stepTwoN {
  width: 230px;
  font-size: 0;
  position: relative;
  left: -5%;
  float: left;
  background: #e0e0e0;
}

.stepTwoN div {
  width: 180px;
  height: 50px;
  vertical-align: text-bottom;
  font-size: 15px;
  color: #000;
  line-height: 50px;
  text-align: right;
  margin-left: 8%;
}

.stepTwoN span:nth-of-type(1) {
  border-width: 25px 0 25px 25px;
  border-style: solid;
  border-color: transparent transparent transparent #fff;
  position: absolute;
  top: 0;
  left: 0;
}

.stepTwoN span:nth-of-type(2) {
  border-width: 25px 0 25px 25px;
  border-style: solid;
  border-color: #fff transparent #fff transparent;
  position: absolute;
  top: 0;
  right: 0;
}
.auditStepTwoN {
  width: 230px;
  font-size: 0;
  position: relative;
  left: -5%;
  float: left;
  background: #508ce6;
}
.auditStepTwoN div {
  width: 180px;
  height: 50px;
  vertical-align: text-bottom;
  font-size: 15px;
  color: #000;
  line-height: 50px;
  text-align: right;
  margin-left: 8%;
}

.auditStepTwoN span:nth-of-type(1) {
  border-width: 25px 0 25px 25px;
  border-style: solid;
  border-color: transparent transparent transparent #fff;
  position: absolute;
  top: 0;
  left: 0;
}

.auditStepTwoN span:nth-of-type(2) {
  border-width: 25px 0 25px 25px;
  border-style: solid;
  border-color: #fff transparent #fff transparent;
  position: absolute;
  top: 0;
  right: 0;
}
.addIcon {
  background-color: #fff;
  width: 100%;
  padding: 10px;
  color: #128ad7;
  text-align: center;
  border: 1px solid #ebeef2;
  cursor: pointer;
  margin: 1% 0 2% 0;
}

.stepBtn {
  /* border: 1px solid red; */
  margin-top: 5%;
  text-align: center;
}
.addAudit .nextBtn {
  background: #508ce6 !important;
  color: #fff;
}
.addPerson .nextBtn {
  background: #508ce6 !important;
  color: #fff;
}
.optionBtn {
  /* border: 1px solid red; */
  padding: 2%;
}
.selfTask {
  width: 50%;
  margin: 0 auto;
  /* border: 1px solid red; */
}
.selfTask .el-input {
  position: relative;
  top: -35px;
  width: 400px;
}
.selfTask .el-select {
  position: relative;
  top: -35px;
  width: 400px;
}
.selfTask .el-form-item {
  margin-bottom: -10px !important;
}
.upload-demo {
  margin-top: -35px;
}

.addPerson .text {
  font-size: 14px;
  font-weight: 700;
  margin-left: 5%;
}
.addPerson .personMessage {
  width: 35%;
  border: 1px solid #000;
  height: 500px;
  margin: 2% 1% 0 5%;
  padding: 10px;
  overflow: scroll;
  border-radius: 5px;
}
.addPerson .editPerson {
  width: 53%;
  border: 1px solid #000;
  height: 500px;
  float: right;
  margin-top: -45.08%;
  margin-right: 5%;
  padding: 10px;
  overflow: scroll;
  border-radius: 5px;
}
</style>
