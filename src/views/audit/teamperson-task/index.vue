<template>
  <div class="personMain" v-if="userRole == 1">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="组员维护" name="first" style="padding: 1%">
        <el-row :gutter="24">
          <el-col :span="17">
            <el-button
              style="background: #1897e4; color: #fff"
              @click="addgroupMember()"
              >组员维护</el-button
            >
          </el-col>
          <div class="search">
            <el-input
              placeholder="请输入姓名"
              v-model="query.condition.peopleName"
              @keyup.enter.native="queryNameInput"
            >
            </el-input>
            <div
              class="search_icon"
              style="background: #1897e4 !important"
              @click="queryNameInput"
            >
              <i class="el-icon-search" style="color: white"></i>
            </div>
          </div>
          <!-- <el-col :span="6">
            <el-input
              placeholder="请输入姓名"
              v-model="query.condition.peopleName"
              class="input-with-select"
              @keyup.enter.native="queryName"
            >
              <el-button
                slot="append"
                style="background:#1897E4;color:#FFF;"
                icon="el-icon-search"
                @click="queryName"
              ></el-button>
            </el-input>
          </el-col> -->
        </el-row>
        <!-- 组员维护列表 -->
        <el-form>
          <el-table
            ref="singleTable"
            :data="tableData"
            style="width: 100%"
            border
            align="center"
            :header-cell-style="{
              'background-color': '#F4FAFF',
              'font-weight': '400',
            }"
          >
            <el-table-column
              align="center"
              label="姓名"
              width="150"
              prop="peopleName"
            >
            </el-table-column>
            <el-table-column align="center" label="角色" width="100"
              >组员
            </el-table-column>
            <el-table-column
              align="center"
              property="userMobile"
              label="联系方式"
              width="200"
            >
            </el-table-column>
            <el-table-column
              align="center"
              property="belongCompany"
              label="所属单位"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              align="center"
              property="belongDept"
              label="所属部门"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              property="isLiaison"
              label="是否接口人"
              width="150"
              align="center"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isLiaison"
                  active-color="#13ce66"
                  inactive-color="gray"
                  active-value="1"
                  inactive-value="0"
                  @change="switchChange(scope.row)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  style="color: #db454b; background: none; border: 0"
                  size="small"
                  @click.native.prevent="deleteRow(scope.row, tableData)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>

        <!-- 分页 -->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="query.pageNo"
          :limit.sync="query.pageSize"
          @pagination="queryName"
        />
        <!-- 分页 end -->
      </el-tab-pane>
      <el-tab-pane label="审计任务维护" name="second">
        <TaskMaintenance :active_project="active_project" :key="timer" />
      </el-tab-pane>
    </el-tabs>

    <!-- 添加组员维护弹框 -->
    <el-dialog
      :visible.sync="addgroupDialog"
      @close="addDialogClosed"
      width="60%"
    >
      <div class="title">组员维护</div>
      <div class="addPerson">
        <el-row>
          <div class="text" style="margin-top: 20px">请选择组员，可多选</div>
        </el-row>
        <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入组员名称"
          v-model="value"
          :titles="['组员列表', '已选组员']"
          :data="data"
          @change="selectMember"
        >
        </el-transfer>
      </div>

      <div class="stepBtn" style="margin-right: 2%">
        <el-button @click="addgroupDialog = false">取消</el-button>
        <el-button
          type="primary"
          @click="saveGroupMember"
          :disabled="savedisabled"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@WISDOMAUDIT/components/Pagination";
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
  setinterFaceperson,
} from "@WISDOMAUDIT/api/shandong/memberMaintenance.js";

export default {
  components: {
    TaskMaintenance,
    Pagination,
  },
  // props:{
  //   projectNum:[],
  // },
  props: ["active_project", "userRole"],
  data() {
    return {
      timer: "", //重新刷新子组件
      savedisabled: false,
      data: [],
      value: [],
      managementProjectUuid: "",
      modelTableData: [],
      radio: "1",
      addDialogVisible: false, //添加未初始化项目弹框
      addgroupDialog: false, //添加组员弹框
      step: 1, //步骤条
      selectName: {},
      editId: "",
      loading: false,
      activeName: "first",
      active_projectchild: "",
      query: {
        condition: {
          managementProjectUuid: "",
          peopleRole: "2",
          peopleName: "",
        },
        pageNo: 1,
        pageSize: 10,
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
          managementProjectUuid: "",
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
      updataPerson: {
        //更新组员
        projectId: "",
        projectMemberships: [],
      },
      personTableList: [], //组员分页
      total: 0,
    };
  },
  created() {
    console.log(this.userRole);
    this.query.condition.managementProjectUuid = this.active_project;
    // 组员维护组员列表接口
    this.projectMember(this.query);

    // this.queryInfo.condition.managementProjectUuid = this.active_project;
    // this.getmodelTaskList(this.queryInfo);
  },
  watch: {
    userRole(newValue, oldValue) {
      this.userRole = newValue;
    },
  },
  methods: {
    queryNameInput() {
      let query = {
        condition: {
          managementProjectUuid: this.active_project,
          peopleRole: this.query.condition.peopleRole,
          peopleName: this.query.condition.peopleName,
        },
        pageNo: 1,
        pageSize: 10,
      };
      this.projectMember(query);
    },
    queryName() {
      this.query.condition.peopleName = "";
      this.query.condition.managementProjectUuid = this.active_project;
      // 组员维护组员列表接口
      this.projectMember(this.query);
    },
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1;
    },
    // 获取数据库模型任务数据
    getmodelTaskList(data) {
      modelTaskList(data).then((resp) => {
        this.taskData = resp.data.records;
      });
    },
    addDialogClosed() {
      this.query.condition.managementProjectUuid = this.active_project;
      // 组员维护接口
      this.projectMember(this.query);
    },
    handleClick(tab, event) {
      console.log(tab);
      console.log(event);
      if (tab.index == "0") {
        // console.log(this.active_project);
        this.query.condition.managementProjectUuid = this.active_project;
        // 组员维护组员列表接口
        this.projectMember(this.query);
      } else {
        this.timer = new Date().getTime();
      }
    },
    // 新增组员弹框事件
    addgroupMember() {
      this.addgroupDialog = true;
      this.savedisabled = false;
      this.getSelectData(1, 1000);
      this.personMes = this.form;
      auditModelList(this.modelQuery).then((resp) => {
        this.modelTableData = resp.data.records;
        this.modelSize = resp.data;
      });
    },
    //新增组员确认事件
    saveGroupMember() {
      console.log(this.updataPerson);

      if (this.updataPerson.projectId == "") {
        this.updataPerson.projectId = this.active_project;
        this.updataPerson.projectMemberships = [];
        for (let i = 0; i < this.peopleSelection.length; i++) {
          this.updataPerson.projectMemberships.push({
            peopleRole: 2,
            isLiaison: 0,
            managementProjectUuid: this.active_project,
            peopleTableUuid: this.peopleSelection[i].peopleTableUuid,
            projectMembershipUuid:
              this.peopleSelection[i].projectMembershipUuid,
          });
        }
        this.savedisabled = true;
        editprojectMembershipList(this.updataPerson).then((resp) => {
          this.$message.success("修改成功！");
          this.addgroupDialog = false;
          this.query.condition.managementProjectUuid = this.active_project;
          // 组员维护接口
          this.projectMember(this.query);
        });
      } else {
        this.savedisabled = true;
        editprojectMembershipList(this.updataPerson).then((resp) => {
          this.$message.success("修改成功！");
          this.addgroupDialog = false;
          this.query.condition.managementProjectUuid = this.active_project;
          // 组员维护接口
          this.projectMember(this.query);
        });
      }

      // this.savedisabled = true;
      // editprojectMembershipList(this.updataPerson).then((resp) => {
      //   this.$message.success("修改成功！");
      //   this.addgroupDialog = false;
      //   this.query.condition.managementProjectUuid = this.active_project;
      //   // 组员维护接口
      //   this.projectMember(this.query);
      // });
    },
    // 删除当前人员
    deleteRow(row, rows) {
      console.log(row);
      this.$confirm("你将删除数据库中的组员数据", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "放弃删除",
      })
        .then(() => {
          if (row.isCanDelete == 0) {
            this.$message.info("此用户已被分配任务，不允许删除！");
          } else {
            deletprojectMembership(row.projectMembershipUuid).then(
              (resp) => {}
            );
            this.projectMember(this.query);
            this.message.success("删除成功！");
          }
        })
        .catch((action) => {
          // this.$message({
          //   type: "info",
          //   message: action === "cancel" ? "放弃删除并离开页面" : "取消删除",
          // });
        });
    },
    // 组员维护列表回显展示
    projectMember(data) {
      projectMembership(data).then((resp) => {
        this.tableData = resp.data.records;
        this.personTableList = resp.data;
        this.total = resp.data.total;
        // console.log(this.personTableList);
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].isLiaison = this.tableData[i].isLiaison + "";
        }
        this.peopleSelection = resp.data.records;
        // console.log(this.peopleSelection);
        this.value = [];
        this.peopleSelection.forEach((e) => {
          if (e.isCanDelete == 0) {
            for (let j = 0; j < this.data.length; j++) {
              if (this.data[j].key == e.peopleTableUuid) {
                this.data[j].disabled = true;
              }
            }
          }
          this.value.push(e.peopleTableUuid);
        });
      });
    },
    //组员列表分页点击事件
    handleCurrentChangePersonList(val) {
      let query = {
        condition: {
          managementProjectUuid: this.active_project,
        },
        pageNo: val,
        pageSize: 5,
      };
      this.projectMember(query);
    },
    // 全部组员查询
    getSelectData(num, size) {
      this.loading = true;
      getProjectMember(num, size).then((resp) => {
        this.form = resp.data.list;
        this.data = [];
        resp.data.list.forEach((e) => {
          this.data.push({
            key: String(e.id),
            label: e.realName + e.mobile,
            disabled: false,
          });
          this.query.condition.managementProjectUuid = this.active_project;
          this.loading = false;
        });
        this.projectMember(this.query);
        // console.log(this.tableData);
      });
    },
    //swicth 改变事件
    switchChange(row) {
      var Data = {
        managmentProjectId: this.active_project,
        isLiaison: row.isLiaison,
        projectMembershipUuid: row.projectMembershipUuid,
      };
      setinterFaceperson(
        row.isLiaison,
        this.active_project,
        row.projectMembershipUuid
      ).then((resp) => {
        this.$message.success("修改成功！");
        this.projectMember(this.query);
      });
      // editprojectMembership(Data).then((resp) => {
      //   this.$message.success("修改成功！");
      //   this.projectMember(this.query);
      // });
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
    // 选择组员事件
    selectMember(val) {
      console.log(val);
      console.log(this.tableData);
      this.updataPerson.projectId = this.active_project;
      this.updataPerson.projectMemberships = [];
      for (let i = 0; i < val.length; i++) {
        this.updataPerson.projectMemberships.push({
          peopleRole: 2,
          isLiaison: 0,
          managementProjectUuid: this.active_project,
          peopleTableUuid: val[i],
        });
      }
    },
    // 模糊查询任务模型
    queryModel() {
      auditModelList(this.modelQuery).then((resp) => {
        // console.log(resp);
        this.modelTableData = resp.data.records;
      });
    },
    // 分页跳转事件
    PersonListModel(val) {
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
  width: 100%;
  //  border: 1px solid red;
  margin-top: 4%;
  margin-bottom: 2%;
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
.el-transfer {
  // border: 1px solid red;
  // text-align: center;
  margin-top: 1%;
  margin-left: 5%;
}
</style>
<style scoped>
.el-transfer /deep/ .el-transfer-panel {
  width: 35%;
}
.search {
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.search >>> .el-input__inner {
  width: 220px !important;
  border-radius: 5px 0 0 5px;
}
.search >>> .el-input__inner {
  width: 250px !important;
  display: flex;
  float: right;
  border-radius: 0 !important;
}
.search >>> .search_icon {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0%;
  width: 36px;
  height: 36px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border-radius: 0 5px 5px 0;
}
.personMain >>> .el-table__header {
  border-top: none !important;
}
</style>
