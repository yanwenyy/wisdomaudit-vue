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

        <div class="addBtn" @click="addgroupMember()">
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
        <TaskMaintenance :active_project="active_project"/>
      </el-tab-pane>
    </el-tabs>

    <!-- 未初始化项目添加弹框 -->
    <el-dialog
      :visible.sync="addDialogVisible"
      width="60%"
      @close="addDialogClosed"
    >
      <div class="title">2021年泰安分公司xxx领导经责审计</div>
      <div class="addPerson" v-if="step == 1">
        <el-row>
          <el-col :span="24">
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
          </el-col>
        </el-row>

        <el-row>
          <div class="text">请选择组员，可多选</div>
        </el-row>
        <el-row>
          <el-col :span="10">
            <div class="personMessage">
              <el-table
                :data="personMes"
                @selection-change="handleSelectionChange"
                ref="personRef"
              >
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="全选组员">
                  <template slot-scope="scope">
                    {{ scope.row.peopleName }} {{ scope.row.memberPhone }}
                    {{ scope.row.memberDepartment }}
                  </template>
                </el-table-column>
              </el-table>
              <!-- <el-button @click="toggleSelection([personMes[0], personMes[2]])"
                >切换第二、第三行的选中状态</el-button
              >
              <el-button @click="toggleSelection()">取消选择</el-button> -->
            </div>
          </el-col>
          <el-col :span="13">
            <div class="editPerson">
              <el-table :data="peopleSelection" ref="editPerson">
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
                        deletePerson(scope.$index, peopleSelection, scope.row)
                      "
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>

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
              :current-page="modelSize.current"
              @current-change="handleCurrentChangeModel"
              :page-size="modelSize.size"
              :total="modelSize.total"
            ></el-pagination>
          </div>
          <!-- 分页 end-->
        </div>
        <div v-else-if="radio == '2'" class="selfTask">
          <el-form label-width="80px" :model="taskSelf">
            <el-form-item label="类型：" style="margin-bottom: 50px">
              <div style="margin-top: -7.7%; margin-bottom: 20px">
                <el-radio v-model="radio" label="1">模型任务</el-radio>
                <el-radio v-model="radio" label="2">自建任务</el-radio>
              </div>
            </el-form-item>
            <el-form-item label="自建任务名称：">
              <el-input
                placeholder="请输入"
                v-model="taskSelf.taskName"
              ></el-input>
            </el-form-item>
            <el-form-item label="责任人：">
              <el-select
                v-model="tableData.peopleTableUuid"
                filterable
                @change="selectChangePerson"
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
            <el-form-item label="任务描述：">
              <el-input
                type="textarea"
                style="top: -35px; width: 400px"
                v-model="taskSelf.taskDescription"
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

    <!-- 添加组员维护弹框 -->
    <el-dialog :visible.sync="addgroupDialog" @close="addDialogClosed" width="60%">
      <div class="title">组员维护</div>
      <div class="addPerson">
        <el-row>
          <div class="text" style="margin-top:20px">请选择组员，可多选</div>
        </el-row>
        <el-row>
          <el-col :span="10">
            <div class="personMessage">
              <el-table
                :data="personMes"
                @selection-change="handleSelectionChange"
                ref="personRef"
              >
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="全选组员">
                  <template slot-scope="scope">
                    {{ scope.row.peopleName }} {{ scope.row.memberPhone }}
                    {{ scope.row.memberDepartment }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :span="13">
            <div class="editPerson">
              <el-table :data="peopleSelection" ref="editPerson">
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
                        deletePerson(scope.$index, peopleSelection, scope.row)
                      "
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>

    <div class="stepBtn">
          <el-button @click="addgroupDialog = false">取消</el-button>
          <el-button type="primary" @click="saveGroupMember">确认</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import TaskMaintenance from "@WISDOMAUDIT/views/audit/task-maintenance/index";
import {
  projectMembership,
  editprojectMembership,
  getProjectMember,
  deletprojectMembership,
  addprojectMembership,
  auditModelList,
  quoteModel,
  editprojectMembershipList,
  selfTaskFunction,
  modelTaskList,
  isModel,
} from "@WISDOMAUDIT/api/shandong/memberMaintenance.js";

export default {
  components: {
    TaskMaintenance,
  },
  // props:{
  //   projectNum:[],
  // },
  props:['managementProjectUuid','active_project'],
  data() {
    return {
      modelTableData: [],
      radio: "1",
      addDialogVisible: false, //添加未初始化项目弹框
      addgroupDialog: false, //添加组员弹框
      step: 1, //步骤条
      selectName: {},
      editId: "",
      loading: false,
      activeName: "first",
      active_projectchild:'',
      query: {
        condition: {
          managementProjectUuid:"",
        },
        pageNo: 1,
        pageSize: 5,
      },
      modelQuery: {
        condition: {
          modelName: "",
        },
        pageNo: 1,
        pageSize: 5,
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
      taskSelf: {
        //创建自建任务传参
        managementProjectUuid: "8351286cd70c3f41c92f59ed425a4659",
        peopleName: "",
        peopleTableUuid: "",
        taskDescription: "",
        taskName: "",
        taskType: "2",
      },
      taskData: [], //获取数据库模型任务数据
      queryInfo: {
        condition: {
          managementProjectUuid: ""
        },
        pageNo: 1,
        pageSize: 5,
      },
      modelSize: [],
      ismodelList: {
        condition: {
          managementProjectUuid: "8351286cd70c3f41c92f59ed425a4659",
          auditModelUuid: "",
        },
        pageNo: 1,
        pageSize: 5,
      },
      groupMemberEcho: [], //组员选框回显
    };
  },
  created() {
    console.log(this.active_project)
    this.query.condition.managementProjectUuid = this.active_project;
    // 组员维护接口
    this.projectMember(this.query);

    this.getSelectData(this.select);
    
    // this.queryInfo.condition.managementProjectUuid = this.active_project;
    // this.getmodelTaskList(this.queryInfo);
  },
  methods: {
    // 获取数据库模型任务数据
    getmodelTaskList(data) {
      modelTaskList(data).then((resp) => {
        this.taskData = resp.data.records;
      });
    },
    addDialogClosed() {
      this.$router.go(0);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 新增组员弹框事件
    addgroupMember() {
      this.addgroupDialog = true;
       this.getSelectData(this.select);
      this.personMes = this.form;
      auditModelList(this.modelQuery).then((resp) => {
        this.modelTableData = resp.data.records;
        this.modelSize = resp.data;
      });
      let _this = this;
      for (let i = 0; i < this.peopleSelection.length; i++) {
        for (let j = 0; j < this.personMes.length; j++) {
          if (
            this.peopleSelection[i].peopleTableUuid ==
            this.personMes[j].peopleTableUuid
          ) {
            this.$nextTick(() => {
              _this.$refs.personRef.toggleRowSelection(
                _this.personMes[j],
                true
              );
            });
          }
        }
      }
    },
     //新增组员确认事件
     saveGroupMember(){
       editprojectMembershipList(this.peopleSelection).then((resp) => {
        this.$message.success("修改成功！");
         this.addgroupDialog = false;
       });
      
     },
    // 删除当前人员
    deleteRow(row, rows) {
      this.$confirm("你将删除数据库中的组员数据", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "放弃删除",
      })
        .then(() => {
          deletprojectMembership(row.projectMembershipUuid).then((resp) => {});
          this.projectMember(this.query);
          this.message.success("删除成功！");
        })
        .catch((action) => {
          this.$message({
            type: "info",
            message: action === "cancel" ? "放弃删除并离开页面" : "取消删除！",
          });
        });
    },
    // 弹框页面组员删除
    deletePerson(index, rows, obj) {
      console.log(obj);
      if (!obj.projectMembershipUuid) {
        rows.splice(index, 1);
        for (let i = 0; i < this.personMes.length; i++) {
          if (
            this.personMes[i].peopleTableUuid == obj.peopleTable.peopleTableUuid
          ) {
            this.$refs.personRef.toggleRowSelection(this.personMes[i], false);
          }
        }
      } else {
        this.$confirm("你将删除数据库中的组员数据", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "放弃删除",
        })
          .then(() => {
            deletprojectMembership(obj.projectMembershipUuid).then(
              (resp) => {}
            );
            this.projectMember(this.query);
            this.$message.success("删除成功！");
            for (let i = 0; i < this.personMes.length; i++) {
              if (
                this.personMes[i].peopleTableUuid ==
                obj.peopleTable.peopleTableUuid
              ) {
                this.$refs.personRef.toggleRowSelection(
                  this.personMes[i],
                  false
                );
              }
            }
          })
          .catch((action) => {
            this.$message({
              type: "info",
              message:
                action === "cancel" ? "放弃删除并离开页面" : "取消删除！",
            });
          });
      }
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
      this.loading = true;
      projectMembership(data).then((resp) => {
        this.tableData = resp.data.records;
        // console.log(this.tableData);
        this.peopleSelection = resp.data.records;
        // console.log(this.peopleSelection);
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

    // 添加未初始化项目弹框
    addPerson() {
      this.addDialogVisible = true;
      this.getSelectData(this.select);
      this.personMes = this.form;
      auditModelList(this.modelQuery).then((resp) => {
        this.modelTableData = resp.data.records;
        this.modelSize = resp.data;
      });
      
      let _this = this;
      for (let i = 0; i < this.peopleSelection.length; i++) {
        for (let j = 0; j < this.personMes.length; j++) {
          if (
            this.peopleSelection[i].peopleTableUuid ==
            this.personMes[j].peopleTableUuid
          ) {
            this.$nextTick(() => {
              _this.$refs.personRef.toggleRowSelection(
                _this.personMes[j],
                true
              );
            });
          }
        }
      }
    },
    // 下一步按钮事件
    nextBtn() {
      this.step = 2;
    },
    prevoius() {
      this.step = 1;
    },
    // 组员选中事件
    handleSelectionChange(val) {
      console.log(this.personMes);
      if (val.length == this.personMes.length) {
        for (let o = 0; o < val.length; o++) {
          this.peopleSelection.push({
            peopleRole: 2,
            isLiaison: 0,
            peopleTableUuid: val[o].peopleTableUuid,
            managementProjectUuid: this.active_project,
            peopleTable: {
              peopleTableUuid: val[o].peopleTableUuid,
              peopleName: val[o].peopleName,
              memberPhone: val[o].memberPhone,
              memberDepartment: val[o].memberDepartment,
            },
          });
        }
        var result = [];
        var obj = {};
        for (let i = 0; i < this.peopleSelection.length; i++) {
          if (!obj[this.peopleSelection[i].peopleTableUuid]) {
            result.push(this.peopleSelection[i]);
            obj[this.peopleSelection[i].peopleTableUuid] = true;
          }
        }
        this.peopleSelection = result;
      } else {
        this.peopleSelection.push({
          peopleRole: 2,
          isLiaison: 0,
          managementProjectUuid: this.active_project,
          peopleTableUuid: val[val.length - 1].peopleTableUuid,
          peopleTable: {
            peopleTableUuid: val[val.length - 1].peopleTableUuid,
            peopleName: val[val.length - 1].peopleName,
            memberPhone: val[val.length - 1].memberPhone,
            memberDepartment: val[val.length - 1].memberDepartment,
          },
        });
        var result = [];
        var obj = {};
        for (let i = 0; i < this.peopleSelection.length; i++) {
          if (!obj[this.peopleSelection[i].peopleTableUuid]) {
            result.push(this.peopleSelection[i]);
            obj[this.peopleSelection[i].peopleTableUuid] = true;
          }
        }
        this.peopleSelection = result;
      }
      console.log(this.peopleSelection);
    },
    // 模糊查询任务模型
    queryModel() {
      auditModelList(this.modelQuery).then((resp) => {
        // console.log(resp);
        this.modelTableData = resp.data.records;
      });
    },
    // 分页跳转事件
    handleCurrentChangeModel(val) {
      let query = {
        pageNo: val,
        pageSize: 5,
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
      this.ismodelList.condition.auditModelUuid = "";
      // let replist = []
      for (let i = 0; i < val.length; i++) {
        this.selectauditModelList.auditModelList.push({
          auditModelUuid: val[i].auditModelUuid,
          modelName: val[i].modelName,
        });
        //  replist.push(
        //    val[i].auditModelUuid
        // )
      }
      this.ismodelList.condition.auditModelUuid =
        val[val.length - 1].auditModelUuid;
      // this.ismodelList.condition.auditModelUuid = replist.join(",")
      // console.log(this.ismodelList.condition.auditModelUuid);
      // 判断项目中模型是否存在
      isModel(this.ismodelList).then((resp) => {
        // console.log(resp);
        if (resp.data.total > 0) {
          this.$refs.multipleModel.toggleRowSelection(val[val.length - 1]);
          this.$message.error("项目中已存在该模型！");
        }
      });
    },
    // 自建任务责任人下拉框事件
    selectChangePerson(val) {
      // console.log(val);
      // console.log(this.tableData);
      this.taskSelf.peopleTableUuid = val;
      for (let i = 0; i < this.tableData.length; i++) {
        if (val == this.tableData[i].peopleTableUuid) {
          this.taskSelf.peopleName = this.tableData[i].peopleTable.peopleName;
        }
      }
    },
    //  完成按钮
    saveBtn() {
      //判断是模型任务还是自建任务
      // console.log(this.selectauditModelList.auditModelList);
      if (
        this.radio == 1 &&
        this.selectauditModelList.auditModelList.length !== 0
      ) {
        quoteModel(this.selectauditModelList).then((resp) => {
          this.$message.success("创建成功！");
        });
      }

      if (this.radio == 2) {
        selfTaskFunction(this.taskSelf).then((resp) => {
          this.$message.success("自建任务创建成功！");
        });
      }

      editprojectMembershipList(this.peopleSelection).then((resp) => {
        this.$message.success("修改成功！");
      });

      setInterval(() => {
        this.addDialogVisible = false;
      }, 3000);
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
  width: 40%;
  font-size: 0;
  position: relative;
  float: left;
  background: #508ce6;
  z-index: 50;
  /* 更改此处的颜色即可完成 */
}

.stepOneN div {
  width: 80%;
  height: 50px;
  vertical-align: text-bottom;
  font-size: 0.7vw;
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
  width: 45%;
  font-size: 0;
  position: relative;
  float: left;
  background: #e0e0e0;
  z-index: 50;
  /* 更改此处的颜色即可完成 */
}

.auditStepOneN div {
  width: 80%;
  height: 50px;
  vertical-align: text-bottom;
  font-size: 0.7vw;
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
  width: 48%;
  font-size: 0.7vw;
  position: relative;
  left: -5%;
  float: left;
  background: #e0e0e0;
}

.stepTwoN div {
  width: 70%;
  height: 50px;
  vertical-align: text-bottom;
  font-size: 0.7vw;
  color: #000;
  line-height: 50px;
  text-align: right;
  margin-left: 8%;
  overflow: hidden;
}

.stepTwoN span:nth-of-type(1) {
  border-width: 25px 0 25px 25px;
  border-style: solid;
  border-color: transparent transparent transparent #e0e0e0;
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
  width: 48%;
  position: relative;
  left: -5%;
  float: left;
  background: #508ce6;
}
.auditStepTwoN div {
  width: 70%;
  height: 50px;
  vertical-align: text-bottom;
  font-size: 0.7vw;
  color: #000;
  line-height: 50px;
  text-align: right;
  margin-left: 8%;
  overflow: hidden;
}

.auditStepTwoN span:nth-of-type(1) {
  border-width: 25px 0 25px 25px;
  border-style: solid;
  border-color: transparent transparent transparent #508ce6;
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
    border: 1px solid #000;
    height: 500px;
    margin: 2% 1% 0 5%;
    padding: 10px;
    overflow: scroll;
    border-radius: 5px;
  }
  .editPerson {
    border: 1px solid #000;
    height: 500px;
    margin: 1.5% 0 0 3%;
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
