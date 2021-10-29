<template>
  <!-- 审计任务维护列表 -->
  <div class="sjzl">
    <div class="conter">
      <div class="two">
        <div class="projectTab">
          <el-row :gutter="24" class="titleMes">
            <el-col :span="1.5">
              <el-button type="primary" @click="addModel()"
                >新增模型任务</el-button
              >
            </el-col>
            <el-col :span="5">
              <el-button type="primary" @click="addTask()"
                >新增自建任务</el-button
              >
            </el-col>
            <!-- 条件查询模型名称 -->
            <el-col :span="6" style="margin-left: 40%">
              <el-input
                placeholder="请输入模型任务名称"
                v-model="queryInfo.condition.taskName"
                class="input-with-select"
                @keyup.enter.native="queryName"
              >
                <el-button
                  slot="append"
                  type="primary"
                  icon="el-icon-search"
                  @click="queryName"
                ></el-button>
              </el-input>
            </el-col>
          </el-row>
          <!-- 表单 -->
          <el-table
            :data="taskData"
            style="width: 100%"
            :header-cell-style="{ 'background-color': '#F4FAFF' }"
          >
            <el-table-column prop="taskName" label="模型任务名称">
            </el-table-column>
            <el-table-column prop="taskType" label="任务类型">
              <template slot-scope="scope">
                <span v-if="scope.row.taskType == 1">模型任务</span>
                <span v-else-if="scope.row.taskType == 2">自建任务</span>
              </template>
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
                        :key="item.peopleTableUuid"
                        :label="item.peopleName"
                        :value="item.peopleTableUuid"
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
              <template slot-scope="scope">
                <div
                  class="update"
                  style="margin-left: -40px; cursor: pointer"
                  @click="nearbyDetails(scope.row)"
                >
                  <i class="update_icon" style="margin-top: -3px">
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
                  <span>{{ scope.row.count }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  style="color: #1371cc"
                  size="small"
                  v-if="scope.row.taskType == 2"
                  @click.native.prevent="editModel(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  style="color: #db454b"
                  size="small"
                  @click.native.prevent="deleteModel(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 表单 end-->
        </div>

        <!-- 分页 -->
        <pagination
          v-show="modelTotal > 0"
          :total="modelTotal"
          :page.sync="queryInfo.pageNo"
          :limit.sync="queryInfo.pageSize"
          @pagination="queryName"
        />
        <!-- 分页 end-->
      </div>
    </div>

    <!-- 审计任务维护编辑弹框 -->
    <el-dialog
      :visible.sync="editModelDialogVisible"
      width="50%"
      @close="editResetForm2('editTaskRef')"
    >
      <div class="title">编辑任务</div>
      <el-form
        label-width="80px"
        class="selfTask"
        :model="editTask"
        ref="editTaskRef"
      >
        <el-form-item label="自建任务名称：">
          <el-input placeholder="请输入" v-model="editTask.taskName"></el-input>
        </el-form-item>
        <el-form-item label="责任人：">
          <el-select
            v-model="editTask.peopleTableUuid"
            filterable
            @change="personLiableSelect"
          >
            <el-option
              v-for="item in tableData"
              :key="item.peopleTableUuid"
              :label="item.peopleName"
              :value="item.peopleTableUuid"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专  题:" prop="belongSpcial">
          <el-select placeholder="请选择" v-model="editTask.belongSpcial">
            <el-option
              v-for="item in thematicOption"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领   域:" prop="belongField">
          <el-select placeholder="请选择" v-model="editTask.belongField">
            <el-option
              v-for="item in areasOption"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述：">
          <el-input
            type="textarea"
            style="top: -35px; width: 400px"
            v-model="editTask.taskDescription"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传附件：">
          <el-upload
            class="upload-demo"
            drag
            action="#"
            v-model="editTask.enclosure"
            :on-change="handleChangePic"
            :on-remove="handleRemove"
            :file-list="edit_file_list"
            :auto-upload="false"
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
      <div class="stepBtn">
        <el-button @click="resBtn">取消</el-button>
        <el-button
          style="background: #0c87d6; color: #fff"
          @click="editTaskSelfBtn"
          >完成</el-button
        >
      </div>
    </el-dialog>

    <!-- 审计任务维护新增弹框 -->
    <el-dialog
      :visible.sync="TaskDialogVisible"
      width="55%"
      @close="resetForm2('selfTaskRef')"
    >
      <div class="taskTitle">新增任务</div>
      <div class="taskAdd" v-if="task == '1'">
        <el-form
          label-width="90px"
          :model="taskSelf"
          style="margin-left: 20%; margin-top: 5%"
          ref="selfTaskRef"
          :rules="taskSelfRules"
        >
          <el-form-item label="自建任务名称：" prop="taskName">
            <el-input
              placeholder="请输入"
              v-model="taskSelf.taskName"
            ></el-input>
          </el-form-item>
          <el-form-item label="责任人：" prop="peopleName">
            <el-select
              v-model="taskSelf.peopleName"
              filterable
              @change="personLiableSelect"
            >
              <el-option
                v-for="item in tableData"
                :key="item.peopleTableUuid"
                :label="item.peopleName"
                :value="item.peopleTableUuid"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专  题:" prop="belongSpcial">
            <el-select placeholder="请选择" v-model="taskSelf.belongSpcial">
              <el-option
                v-for="item in thematicOption"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="领   域:" prop="belongField">
            <el-select placeholder="请选择" v-model="taskSelf.belongField">
              <el-option
                v-for="item in areasOption"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务类型">
            <el-select
              v-model="taskSelf.taskType"
              filterable
              @change="taskTypeSelect"
              disabled
            >
              <el-option
                v-for="item in taskTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务描述：" prop="taskDescription">
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
              action="#"
              v-model="taskSelf.enclosure"
              :on-change="handleChangePic"
              :file-list="fileList"
              :auto-upload="false"
              multiple
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                点击上传或将文件拖到虚线框
                <br />支持.zip,.doc,.docx,.xls,.xlsx,.txt
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="temBtn">
          <el-button @click="resBtn" style="border: 1px solid #d2d2d2"
            >取消</el-button
          >
          <el-button
            style="background: #0c87d6; color: #fff"
            @click="saveTask('selfTaskRef')"
            >完成</el-button
          >
        </div>
      </div>
      <div class="model_Info" v-else-if="task == '2'">
        <el-row style="margin-top: 30px">
          <el-col :span="15">
            <div style="margin-top: 2.5%; color: #5f6165; margin-top: 10px">
              请选择想要引用的模型
            </div>
          </el-col>
          <el-col :span="9">
            <el-input
              placeholder="请输入内容"
              v-model="model_QueryInfo.condition.modelName"
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
          ref="multipleModelRef"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column type="index" label="模型编号" width="80">
          </el-table-column>
          <el-table-column prop="belongField" label="所属领域">
          </el-table-column>
          <el-table-column prop="belongSpcial" label="所属专题">
          </el-table-column>
          <el-table-column prop="modelName" label="模型名称"> </el-table-column>
          <el-table-column prop="address" label="说明" width="250">
          </el-table-column>
          <el-table-column prop="ruleDescription" label="规则" width="300">
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination
          v-show="taskTotal > 0"
          :total="taskTotal"
          :page.sync="model_QueryInfo.pageNo"
          :limit.sync="model_QueryInfo.pageSize"
          @pagination="queryModel"
        />
        <div class="stepBtn">
          <el-button @click="returnStep" style="border: 1px solid #d2d2d2"
            >取消</el-button
          >
          <el-button
            style="background: #0c87d6; color: #fff"
            @click="modelInfoBtn"
            >完成</el-button
          >
        </div>
      </div>
    </el-dialog>

    <!-- 附件详情 -->
    <el-dialog
      title="附件详情"
      width="40%"
      :visible.sync="nearbyDialogVisible"
      style="padding-bottom: 59px"
    >
      <el-table
        :data="enclosure_details_list"
        style="width: 100%"
        v-loading="nearbyLoading"
      >
        <!-- <el-table-column prop="dataTaskNumber"
                             label="流水单号">
            </el-table-column> -->
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="fiileType" label="文件类型"> </el-table-column>
        <el-table-column prop="fileName" label="文件名称">
          <template slot-scope="scope">
            <el-link
              type="primary"
              style=""
              @click="enclosureDownload(scope.row.attachmentUuid,scope.row.fileName)"
              >{{ scope.row.fileName }}</el-link
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@WISDOMAUDIT/components/Pagination";
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
  deletmodelTask,
  selfTaskFunction,
  isModel,
  editTaskSelf,
  editTaskSelfInfo,
} from "@WISDOMAUDIT/api/shandong/memberMaintenance.js";
import {
  thematicAreas,
  attachmentEcho,
} from "@WISDOMAUDIT/api/shandong/projectmanagement.js";
export default {
  components: { Pagination },
  props: ["active_project"],
  data() {
    return {
      task: 1,
      loading: false,
      nearbyLoading: false,
      taskData: [],
      radio: "1",
      project: "",
      step: 1, //判断步骤条
      addDialogVisible: false, //添加弹框的隐藏与显示
      TaskDialogVisible: false, //添加任务弹框
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
          managementProjectUuid: "",
          taskName: "",
        },
        pageNo: 1,
        pageSize: 10,
      },
      model_QueryInfo: {
        condition: {
          modelName: "",
          projectId: "",
        },
        pageNo: 1,
        pageSize: 10,
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
      tableData: [],
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
      taskTypeList: [
        {
          value: 1,
          label: "模型任务",
        },
        {
          value: 2,
          label: "自建任务",
        },
      ],
      modelPerson: {
        managementProjectUuid: "",
        peopleName: "",
        peopleTableUuid: "",
        auditTaskUuid: "",
      },
      selectauditModelList: {
        auditModelList: [],
        projectId: "",
      },
      fileList: [], //上传的文件
      file: [], //
      Upload_file: [], //上传文件更新id
      taskSelf: {
        //创建自建任务传参
        managementProjectUuid: "",
        peopleName: "",
        peopleTableUuid: "",
        taskDescription: "",
        taskName: "",
        taskType: "",
        belongField: "",
        belongSpcial: "",
        enclosure: "", //附件
        attachmentList: [],
      },
      modelSize: [],
      ismodelList: {
        condition: {
          managementProjectUuid: "",
          auditModelUuid: "",
        },
        pageNo: 1,
        pageSize: 1000,
      },
      managementProjectUuid: "",
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
      editTask: {
        managementProjectUuid: "",
        peopleName: "",
        peopleTableUuid: "",
        taskDescription: "",
        taskName: "",
        taskType: "",
        belongField: "",
        belongSpcial: "",
        enclosure: "", //附件
        attachmentList: [], //附件上传入参
      },
      modelTableData: [],
      thematicOption: [],
      areasOption: [],
      deletFileList: [],
      fileList_Delet: [], //删除本条数据
      thematic: {
        typecode: "SPECIAL",
      },
      areas: {
        typecode: "Category",
      },
      nearbyDialogVisible: false, //附件详情弹框
      enclosure_details_list: [], //附件table数据
      edit_file_list: [], // 编辑回显 上传文件
      enclosureInfo: {
        condition: {
          businessUuid: "",
        },
        pageNo: 1,
        pageSize: 10,
        sortBy: "string",
        sortName: "string",
      },
      modelTotal: 0,
      taskTotal: 0,
      // 自建任务校验
      taskSelfRules: {
        taskName: [
          { required: true, message: "请输入自建任务名称", trigger: "blur" },
        ],
        peopleName: [
          { required: true, message: "请选择责任人", trigger: "change" },
        ],
        belongSpcial: [
          { required: true, message: "请选择专题", trigger: "change" },
        ],
        belongField: [
          { required: true, message: "请选择领域", trigger: "change" },
        ],
        taskDescription: [
          { required: true, message: "请输入任务描述", trigger: "change" },
        ],
      },
    };
  },
  computed: {},
  // watch: {
  //   'active_project' (val) {    //message即为父组件的值，val参数为值
  //     this.managementProjectUuid  =val;
  //     console.log(0);
  //     console.log(this.managementProjectUuid);
  //   }
  // },
  methods: {
    // 专题下拉框
    thematicSelect(data) {
      thematicAreas(data).then((resp) => {
        this.thematicOption = resp.data;
        // console.log(this.thematicOption);
      });
    },
    //领域下拉框
    areasSelect(data) {
      thematicAreas(data).then((resp) => {
        this.areasOption = resp.data;
        // console.log(this.areasOption);
      });
    },
    Task() {
      this.$router.go(0);
    },
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
    //编辑任务
    editModel(row) {
      this.edit_file_list = [];
      this.Upload_file = [];
      this.fileList_Delet = [];
      this.editModelDialogVisible = true;
      editTaskSelf(row.auditTaskUuid).then((resp) => {
        this.editTask = resp.data;
      });
      this.thematicSelect(this.thematic);
      this.areasSelect(this.areas);

      let params = {
        pageNo: 1,
        pageSize: 10,
        condition: {
          businessUuid: row.auditTaskUuid,
        },
      };
      this.file_details(params, 1);
      this.deletFileList = [];
    },
    queryName() {
      this.getmodelTaskList(this.queryInfo);
    },
    // 列表显示
    getmodelTaskList(data) {
      this.loading = true;
      modelTaskList(data).then((resp) => {
        this.taskData = resp.data.records;
        this.modelTotal = resp.data.total;
        console.log(this.taskData);
        this.project = resp.data;
        this.loading = false;
      });
    },

    deleteModel(row) {
      this.$confirm("你将删除引入的模型任务分配", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "放弃删除",
      })
        .then(() => {
          deletmodelTask(row.auditTaskUuid).then((resp) => {
            this.getmodelTaskList(this.queryInfo);
          });
          this.loading = false;
        })
        .catch((action) => {
          this.$message({
            type: "info",
            message: action === "cancel" ? "放弃删除并离开页面" : "删除成功！",
          });
        });
    },

    handleCurrentChangeTask(val) {
      let query = {
        pageNo: val,
        pageSize: 5,
        condition: {
          managementProjectUuid: this.active_project,
        },
      };
      this.getmodelTaskList(query);
      this.loading = false;
    },
    // 组员查询
    getSelectData(data) {
      getProjectMember(data).then((resp) => {
        this.form = resp.data.records;
      });
    },

    selectChange(rows) {
      // console.log(rows);
      this.modelPerson.managementProjectUuid = rows.managementProjectUuid;
      this.modelPerson.peopleTableUuid = rows.peopleTableUuid;
      this.modelPerson.auditTaskUuid = rows.auditTaskUuid;
      for (let i = 0; i < this.tableData.length; i++) {
        if (rows.peopleTableUuid == this.tableData[i].peopleTableUuid) {
          this.modelPerson.peopleName = this.tableData[i].peopleName;
        }
      }
      // console.log(this.modelPerson);
      editmodelPerson(this.modelPerson).then((resp) => {
        this.$message.success("设置成功！");
      });
    },
    // 添加模型任务按钮
    addModel() {
      this.TaskDialogVisible = true;
      this.task = 2;
      this.loading = true;
      this.model_QueryInfo.condition.modelName = "";
      this.model_QueryInfo.condition.projectId = this.active_project;
      this.queryModelSql(this.model_QueryInfo);
    },
    // 添加自建任务页面
    addTask() {
      this.task = 1;
      this.taskSelf.taskType = 2;
      this.TaskDialogVisible = true;
      this.loading = true;
      auditModelList(this.model_QueryInfo).then((resp) => {
        console.log(resp);
        this.modelTableData = resp.data.records;
        this.modelSize = resp.data;
        this.loading = false;
      });
      this.thematicSelect(this.thematic);
      this.areasSelect(this.areas);
    },
    handleSelectionChange(val) {
      if (val.length == this.personMes.length) {
        for (let o = 0; o < val.length; o++) {
          this.peopleSelection.push({
            peopleRole: 2,
            isLiaison: 0,
            peopleTableUuid: val[o].peopleTableUuid,
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
    },
    // 分页跳转页面的方法
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
        this.modelSize = resp.data;
      });
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
      this.model_QueryInfo.condition.projectId = this.active_project;
      this.queryModelSql(this.model_QueryInfo);
    },
    queryModelSql(data) {
      auditModelList(data).then((resp) => {
        this.modelTableData = resp.data.records;
        this.taskTotal = resp.data.total;
        this.modelSize = resp.data;
      });
    },

    //引入模型选择事件
    handleSelectionChangeModel(val) {
      this.selectauditModelList.auditModelList = [];
      for (var i = 0; i < val.length; i++) {
        this.selectauditModelList.auditModelList.push({
          auditModelUuid: val[i].auditModelUuid,
          modelName: val[i].modelName,
        });
      }
      this.ismodelList.condition.auditModelUuid =
        val[val.length - 1].auditModelUuid;
      this.ismodelList.condition.managementProjectUuid = this.active_project;
      // 判断项目中模型是否存在
      isModel(this.ismodelList).then((resp) => {
        // console.log(resp);
        if (resp.data.total > 0) {
          this.$refs.multipleModelRef.toggleRowSelection(val[val.length - 1]);
          this.$message.error("项目中已存在该模型！");
        }
      });
      // for(let i =0; i<val.length;i++){
      //   // alert(123)
      //    this.ismodelList.condition.auditModelUuid =
      //   val[val.length - 1].auditModelUuid;
      // this.ismodelList.condition.managementProjectUuid = this.active_project;
      // // 判断项目中模型是否存在
      // isModel(this.ismodelList).then((resp) => {
      //   // console.log(resp);
      //   if (resp.data.total > 0) {
      //     this.$refs.multipleModelRef.toggleRowSelection(val[i]);
      //     this.$message.error("项目中已存在该模型！");
      //   }
      // });
      // }
    },
    // 弹框页面组员删除
    deletePerson(index, rows, obj) {
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
    //创建任务责任人下拉框的事件
    personLiableSelect(val) {
      console.log(val);
      console.log(this.tableData);
      this.taskSelf.peopleTableUuid = val;
      this.editTask.peopleTableUuid = val;
      for (let i = 0; i < this.tableData.length; i++) {
        if (val == this.tableData[i].peopleTableUuid) {
          this.taskSelf.peopleName = this.tableData[i].peopleName;
          this.editTask.peopleName = this.tableData[i].peopleName;
        }
      }
      console.log(this.taskSelf);
    },
    // 模型任务完成按钮
    modelInfoBtn() {
      if (this.selectauditModelList.auditModelList.length > 0) {
        this.selectauditModelList.projectId = this.active_project;
        quoteModel(this.selectauditModelList).then((resp) => {
          this.$message.success("创建成功！");
          this.TaskDialogVisible = false;
          this.queryInfo.condition.managementProjectUuid = this.active_project;
          this.getmodelTaskList(this.queryInfo);
          this.task = 1;
        });
      } else {
        this.$message.info("请选择要引入的模型!")
      }
    },
    //新增自建任务上传附件
    handleChangePic(file, fileList) {
      this.fileList = fileList;
      this.file = file.raw;
    },
    //新增自建任务完成按钮
    saveTask(selfTaskRef) {
      this.$refs[selfTaskRef].validate((valid) => {
        if (valid) {
          // this.TaskDialogVisible = false;
          if (this.fileList.length > 0) {
            const loading = this.$loading({
              lock: true,
              text: "上传中",
              spinner: "el-icon-loading",
              background: "transparent",
            });
            let formData = new FormData();
            formData.append("file", this.file.raw);
            this.fileList.forEach((item) => {
              formData.append("files", item.raw);
            });

            this.$axios({
              method: "post",
              url: "/wisdomaudit/attachment/fileUploads",
              data: formData,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }).then((resp) => {
              if (resp.data.code == 0) {
                this.$message.success("上传成功！");
                loading.close();
                this.Upload_file = resp.data.data;

                //新增自建任务接口
                this.taskSelf.attachmentList = this.Upload_file;
                this.taskSelf.managementProjectUuid = this.active_project;
                selfTaskFunction(this.taskSelf).then((resp) => {
                  this.$message.success("新增任务成功！");
                  this.TaskDialogVisible = false;
                  this.taskSelf = {};
                  this.queryInfo.condition.managementProjectUuid =
                    this.active_project;
                  this.getmodelTaskList(this.queryInfo);
                  this.loading = false;
                });
              } else {
                loading.close();
                this.$message({
                  message: resp.msg,
                  type: "error",
                });
              }
            });
          } else {
            this.taskSelf.managementProjectUuid = this.active_project;
            selfTaskFunction(this.taskSelf).then((resp) => {
              this.$message.success("新增任务成功！");
              this.TaskDialogVisible = false;
              this.taskSelf = {};
              this.queryInfo.condition.managementProjectUuid =
                this.active_project;
              this.getmodelTaskList(this.queryInfo);
              this.loading = false;
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 编辑成功按钮
    editTaskSelfBtn() {
      if (this.fileList.length > 0) {
        const loading = this.$loading({
          lock: true,
          text: "上传中",
          spinner: "el-icon-loading",
          background: "transparent",
        });
        let formData = new FormData();
        // formData.append("file", this.file.raw);
        this.fileList.forEach((item) => {
          if (item.raw) {
            formData.append("files", item.raw);
          }
        });

        this.$axios({
          method: "post",
          url: "/wisdomaudit/attachment/fileUploads",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((resp) => {
          if (resp.data.code == 0) {
            this.$message.success("上传成功！");
            this.Upload_file = resp.data.data;
            console.log(this.Upload_file);
            loading.close();

            if (this.Upload_file) {
              for (let p = 0; p < this.Upload_file.length; p++) {
                this.Upload_file[p].isDeleted = 2;
              }
            }

            this.edit_file_list.forEach((item) => {
              item.status = null;
            });
            this.fileList_Delet.forEach((item) => {
              item.status = null;
            });
            var upList = this.edit_file_list
              .concat(this.Upload_file)
              .concat(this.fileList_Delet);
            this.editTask.attachmentList = upList;
            // console.log(this.Upload_file);
            this.editTask.managementProjectUuid = this.active_project;
            editTaskSelfInfo(this.editTask).then((resp) => {
              this.editModelDialogVisible = false;
              this.queryInfo.condition.managementProjectUuid =
                this.active_project;
              this.getmodelTaskList(this.queryInfo);
            });
          } else {
            loading.close();
            this.$message({
              message: resp.msg,
              type: "error",
            });
          }
        });
      } else {
        this.edit_file_list.forEach((item) => {
          item.status = null;
        });
        this.fileList_Delet.forEach((item) => {
          item.status = null;
        });
        var upList = this.edit_file_list.concat(this.fileList_Delet);
        this.editTask.attachmentList = upList;
        this.editTask.managementProjectUuid = this.active_project;
        editTaskSelfInfo(this.editTask).then((resp) => {
          this.editModelDialogVisible = false;
          this.queryInfo.condition.managementProjectUuid = this.active_project;
          this.getmodelTaskList(this.queryInfo);
        });
      }
    },
    // 自建取消按钮
    resBtn() {
      this.taskSelf = [];
      this.TaskDialogVisible = false;
      this.editModelDialogVisible = false;
    },
    // 模型取消按钮
    returnStep() {
      for (let i = 0; i < this.modelTableData.length; i++) {
        this.$refs.multipleModelRef.toggleRowSelection(
          this.modelTableData[i],
          false
        );
      }
      this.TaskDialogVisible = false;
    },
    // 增加任务弹框关闭事件
    TaskDialogClosed() {
      this.taskSelf = {};
      this.TaskDialogVisible = false;
      this.task = 1;
    },
    // 选择任务类型切换页面
    taskTypeSelect(val) {
      // console.log(val);
      if (val == 1) {
        this.task = 2;
      } else {
        this.task = 1;
      }
    },
    // 附件点击弹框事件
    nearbyDetails(rows) {
      let params = {
        pageNo: 1,
        pageSize: 10,
        condition: {
          businessUuid: rows.auditTaskUuid,
        },
      };
      this.file_details(params, 2);
    },
    //附件详情
    file_details(params, index) {
      attachmentEcho(params).then((resp) => {
        // index=1  列表查看附件详情
        if (index == 2) {
          this.enclosure_details_list = resp.data;
          if (this.enclosure_details_list.length == 0) {
            this.$message("暂无上传的附件");
            return false;
          } else {
            this.nearbyDialogVisible = true;
          }
        } else {
          var list = resp.data; //
          // 编辑回显
          if (list) {
            this.edit_file_list = [];
            // 回显
            list.forEach((item) => {
              item.isDeleted = 0;
              item.url = item.filePath;
              item.name = item.fileName;
              this.edit_file_list.push(item);
            });
          }
        }
      });
    },
    // 附件下载
    enclosureDownload(id, name) {
      const fileName = name.split('.')[0];
      let formData = new FormData();
      formData.append("fileId", id);
      this.$axios({
        method: "post",
        url: "http://localhost:9529/wisdomaudit/auditPreviousDemandData/downloadByFileId",
        data: formData,
        responseType: "blob",
      })
        .then((res) => {
          const content = res.data;
          console.log(res);
          const blob = new Blob([content], {
            type: "application/octet-stream,charset=UTF-8",
          });
          const fileName =
            res.headers["content-disposition"].split("fileName*=utf-8''")[1];
          const filteType = res.headers["content-disposition"].split(".")[1];
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = name; //下载后文件名
            elink.style.display = "none";
            elink.href = window.URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            window.URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetForm2(resetForm2) {
      this.$refs[resetForm2].resetFields();
      this.fileList = [];
    },
    editResetForm2(ref) {
      this.$refs[ref].resetFields();
      this.fileList = [];
    },
    //
    handleRemove(file, fileList) {
      if (file.response) {
        this.fileList.remove(file.response.data);
        this.key = Math.random();
      } else {
        this.edit_file_list.remove(file);
        file.isDeleted = 1;
        this.fileList_Delet.push(file);
      }
    },
  },
  created() {
    this.queryInfo.condition.managementProjectUuid = this.active_project;
    this.getmodelTaskList(this.queryInfo);
    // this.getSelectData(this.select);
    //已选组员接口
    this.query.condition.managementProjectUuid = this.active_project;
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
/* .sjzl >>> .el-button--primary {
  background-color: #42d7a5 !important;
  border: none;
} */
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
  font-size: 0;
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
  font-size: 0;
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
  text-align: right;
}
.temBtn {
  width: 120%;
  /* border: 1px solid red; */
  margin-top: 5%;
  text-align: right;
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
.taskAdd {
  width: 70%;
  margin: 10px auto;
  /* border: 1px solid red; */
}
.taskAdd .el-input {
  position: relative;
  top: -35px;
  width: 300px;
}
.taskAdd .el-select {
  position: relative;
  top: -35px;
  width: 300px;
}
.taskAdd .el-form-item {
  margin-bottom: -10px !important;
}
/deep/ .taskAdd .el-textarea__inner {
  width: 75%;
}
/deep/ .taskAdd .el-upload-dragger {
  width: 300px;
}
.addPerson .text {
  font-size: 14px;
  font-weight: 700;
  margin-left: 5%;
}
.addPerson .personMessage {
  border: 1px solid #000;
  height: 500px;
  margin: 2% 1% 0 8%;
  padding: 10px;
  overflow: scroll;
  border-radius: 5px;
}
.addPerson .editPerson {
  border: 1px solid #000;
  height: 500px;
  margin: 1.5% 0 0 3%;
  padding: 10px;
  overflow: scroll;
  border-radius: 5px;
}
.taskTitle {
  text-align: left;
  padding: 10px;
  color: #000;
  font-weight: 700;
  border-bottom: 1px solid #d2d2d2;
}
.title {
  border-bottom: 1px solid #d2d2d2;
  padding: 10px;
  text-align: center;
  margin-bottom: 3%;
  font-weight: 700;
}
</style>
