<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="组员维护" name="first">
        <!-- <el-button  type="success" class="add">添加</el-button> -->
        <!-- 组员维护列表 -->
        <el-form>
          <el-table
            ref="singleTable"
            :data="tableData"
            style="width: 100%"
            border
            v-loading="loading"
          >
            <el-table-column label="角色" width="200">组员 </el-table-column>
            <el-table-column
              label="姓名"
              width="280"
              prop="peopleTable.peopleName"
            >
              <template slot-scope="scope">
                <el-form-item>
                  <el-select
                    v-model="scope.row.peopleTable.peopleName"
                    filterable
                    @change="selectChange(scope.row)"
                  >
                    <el-option
                      v-for="item in form"
                      :key="item.peopleTableUuid"
                      :label="item.peopleName"
                      :value="item.peopleName"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              property="peopleTable.memberPhone"
              label="联系方式"
            >
            </el-table-column>
            <el-table-column
              property="peopleTable.memberCompany"
              label="所属单位"
            >
            </el-table-column>
            <el-table-column
              property="peopleTable.memberDepartment"
              label="所属部门"
            >
            </el-table-column>
            <el-table-column
              property="isLiaison"
              label="是否接口人"
              width="150"
            >
              <template slot-scope="scope">
                <el-form-item>
                  <el-select
                    v-model="scope.row.isLiaison"
                    placeholder="请选择"
                    @change="selectisLiaison(scope.row)"
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
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  style="color: #db454b"
                  size="small"
                  @click.native.prevent="deleteRow(scope.row, tableData)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>

        <div class="addBtn" @click="addPerson">
          <i class="el-icon-plus"></i>
          <span>新增</span>
        </div>
        <!-- 分页 -->
        <!-- <div class="page">
          <el-pagination
            background
            :hide-on-single-page="false"
            layout="prev, pager, next"
            :page-sizes="[2, 4, 6, 8]"
            :current-page="this.tableData.current"
            @current-change="handleCurrentChange"
            :page-size="this.tableData.size"
            :total="this.tableData.total"
          ></el-pagination>
        </div> -->
        <!-- 分页 end-->
      </el-tab-pane>
      <el-tab-pane label="审计任务维护" name="second">
        <TaskMaintenance />
      </el-tab-pane>
    </el-tabs>

    <!-- 组员维护添加弹框 -->
    <el-dialog
      :visible.sync="addDialogVisible"
      width="60%"
      @close="addDialogClosed"
    >
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
            ref="multipleModel"
          >
            <el-table-column type="selection" :reserve-selection="true">
            </el-table-column>
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
          <el-form label-width="80px">
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
          <el-button class="nextBtn" @click="saveBtn">完成</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TaskMaintenance from "@/views/audit/task-maintenance/index";
import {
  projectMembership,
  editprojectMembership,
  getProjectMember,
  deletprojectMembership,
  addprojectMembership,
  auditModelList,
  quoteModel,
  editprojectMembershipList,
} from "@SDMOBILE/api/shandong/memberMaintenance.js";

export default {
  components: {
    TaskMaintenance,
  },
  data() {
    return {
      modelTableData: [],
      radio: "1",
      addDialogVisible: false, //添加弹框
      step: 1, //步骤条
      selectName: {},
      editId: "",
      loading: false,
      activeName: "first",
      query: {
        condition: {
          managementProjectUuid: "",
        },
        pageNo: 1,
        pageSize: 10,
      },
      modelQuery: {
        condition: {
          modelName: "",
        },
        pageNo: 1,
        pageSize: 10,
      },
      select: {},
      tableData: [],
      form: [],
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
      value: "",
      personMes: [], //选择组员的回显
      peopleSelection: [], //选中的组员
      selectauditModelList: {
        auditModelList: [],
        projectId: "8351286cd70c3f41c92f59ed425a4659",
      },
      project: [],
    };
  },
  created() {
    this.projectMember(this.query);
    this.getSelectData(this.select);
  },
  methods: {
    addDialogClosed() {
      this.$router.go(0);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 删除当前人员
    deleteRow(row, rows) {
      if (!row.peopleTableUuid) {
        rows.splice(row.index + 3, 1);
      } else {
        deletprojectMembership(row.projectMembershipUuid).then((resp) => {
          console.log(this.resp);
        });
        this.projectMember(this.query);
      }
    },
    deletePerson(index, rows) {
      rows.splice(index, 1);
    },
    // 添加一行新数据
    addData() {
      var id = 0;
      id++,
        this.tableData.push({
          index: id,
          role: "组员",
          peopleTableUuid: "",
          peopleTable: {
            peopleName: "",
            memberPhone: "",
            memberCompany: "",
            memberDepartment: "",
          },
          isLiaison: "",
        });
    },
    // 组员维护页面展示
    projectMember(data) {
      projectMembership(data).then((resp) => {
        this.loading = true;
        this.tableData = resp.data.records;
        this.peopleSelection = resp.data.records;
        console.log(this.tableData);
        this.loading = false;
      });
    },
    // 组员查询
    getSelectData(data) {
      getProjectMember(data).then((resp) => {
        this.form = resp.data.records;
      });
    },
    // 姓名下拉框的方法
    selectChange(obj) {
      for (var i = 0; i < this.form.length; i++) {
        if (obj.peopleTable.peopleName == this.form[i].peopleName) {
          this.editId = this.form[i].peopleTableUuid;
        }
      }
      for (var i = 0; i < this.tableData.length; i++) {
        if (
          obj.peopleTable.peopleName ==
            this.tableData[i].peopleTable.peopleName &&
          obj.peopleTable.peopleTableUuid !==
            this.tableData[i].peopleTable.peopleTableUuid
        ) {
          this.$message.warning("请勿选择相同组员");
          return this.projectMember(this.query);
        }
      }
      if (!obj.peopleTableUuid) {
        var Data = {
          peopleTableUuid: this.editId,
        };
        addprojectMembership(Data).then((resp) => {
          this.$message.success("添加成功！");
        });
        this.projectMember(this.query);
      } else {
        var Data = {
          peopleTableUuid: this.editId,
          projectMembershipUuid: obj.projectMembershipUuid,
        };
        editprojectMembership(Data).then((resp) => {
          this.$message.success("修改成功！");
        });

        this.projectMember(this.query);
      }
    },

    //  是否接口人下拉框
    selectisLiaison(obj, val) {
      // console.log(obj);
      // console.log(val);
      if (!obj.peopleTableUuid) {
        this.$message.warning("请选择姓名！");
      } else {
        var Data = {
          isLiaison: obj.isLiaison,
          projectMembershipUuid: obj.projectMembershipUuid,
        };
        editprojectMembership(Data).then((resp) => {
          this.$message.success("修改成功！");
        });
      }
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

    nextBtn() {
      this.step = 2;
    },
    prevoius() {
      this.step = 1;
    },
    // 组员选中事件
    handleSelectionChange(val) {
      console.log(val);
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
    queryModel() {
      auditModelList(this.modelQuery).then((resp) => {
        // console.log(resp);
        this.modelTableData = resp.data.records;
      });
    },
    handleCurrentChangeModel(val) {
      let query = {
        pageNo: val,
        pageSize: this.project.pageSize,
        condition: {
          queryNum: "",
        },
      };
      auditModelList(query).then((resp) => {
        // console.log(resp);
        this.modelTableData = resp.data.records;
        this.project = resp.data;
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
};
</script>
  
<style lang="scss" scoped>
// .el-button{
//   background: #4BDCB4;
// }
.deleteBtn {
  color: red;
}
.addBtn {
  width: 100%;
  padding: 10px;
  color: #128ad7;
  text-align: center;
  border: 1px solid #ebeef2;
  cursor: pointer;
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
.addPerson {
  .text {
    font-size: 14px;
    font-weight: 700;
    margin-left: 5%;
  }
  .personMessage {
    width: 35%;
    border: 1px solid #000;
    height: 500px;
    margin: 2% 1% 0 5%;
    padding: 10px;
    overflow: scroll;
    border-radius: 5px;
  }
  .editPerson {
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
</style>
