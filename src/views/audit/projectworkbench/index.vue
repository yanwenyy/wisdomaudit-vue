<template>
  <div class="projectWorkbench">
    <div class="title">未初始化项目</div>
    <ul class="projectInit">
      <li @click="projectClick(index)"
          v-for="(value, index) in projectNum"
          :key="index">
        <p class="companyName"
           style="margin-bottom: 2%">
          {{ value.projectName }}
        </p>
        <el-row>
          <el-col :span="9">
            <div>
              <p>被审计对象：</p>
              <p>{{ value.auditOrgName }}</p>
            </div>
          </el-col>
          <el-col :span="15">
            <div>
              <p>审计周期：</p>
              <p>{{ value.auditStartData }}至{{ value.auditFinishData }}</p>
            </div>
          </el-col>
        </el-row>
      </li>
      <span style="line-height: 70px; cursor: pointer"
            @click="moreProject()">更多>></span>
    </ul>

    <el-drawer title="未初始化项目"
               :visible.sync="drawer"
               :direction="direction"
               :size="size">
      <ul class="projectAll">
        <li @click="projectClick(index)"
            v-for="(value, index) in projectAll"
            :key="index">
          <p class="companyName"
             style="margin-bottom: 2%">
            {{ value.projectName }}
          </p>
          <el-row>
            <el-col :span="9">
              <div>
                <p>被审计对象：</p>
                <p>{{ value.auditOrgName }}</p>
              </div>
            </el-col>
            <el-col :span="15">
              <div>
                <p>审计周期：</p>
                <p>{{ value.auditStartData }}至{{ value.auditFinishData }}</p>
              </div>
            </el-col>
          </el-row>
        </li>
      </ul>
    </el-drawer>

    <div class="initializeProject">
      <div class="title">初始化项目</div>
      <ul>
        <li v-for="(item, index) in projectInit"
            :key="index"
            style="cursor: pointer"
            class="initProjectItem"
            @click="look_project(index,item)"
            :class="active_project == item.managementProjectUuid ? 'active_class' : ''">
          {{ item.projectName }}
        </li>
        <span @click="project_more()">更多>></span>
      </ul>
    </div>

    <el-row class="tac">
      <!-- 左侧导航 -->
      <div class="left_menu">
        <el-col>
          <div class="menu">
            <el-menu class="el-menu-vertical-demo"
                     @select="open"
                     background-color="#F1F5FB"
                     default-active="1-1">
              <el-submenu index="1">
                <template slot="title">
                  <span style="margin-left: 20px; font-weight: 400">审计准备</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1">组员及任务维护 <span></span></el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <span style="margin-left: 20px; font-weight: 400">审计实施</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="2-1">审计资料<span></span></el-menu-item>
                  <el-menu-item index="2-2">审计任务<span></span></el-menu-item>
                  <el-menu-item index="2-3">审计问题<span></span></el-menu-item>
                  <el-menu-item index="2-4">审计确认单<span></span></el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <span style="margin-left: 20px; font-weight: 400">报告阶段</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="3-1">审计报告<span></span></el-menu-item>
                  <el-menu-item index="3-2">经营指标<span></span></el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </div>
        </el-col>
      </div>
      <!-- 左侧导航 end -->

      <!-- 右侧内容 -->
      <div class="right_conter">
        <el-col>
          <!-- 组员及任务维护 -->
          <div class="routerView"
               v-if="index == '1-1'">
            <TeamPersonTask ref="temPersonRef"
                            :active_project="active_project" />
          </div>
          <!-- 审计资料 -->
          <div class="routerView"
               v-else-if="index == '2-1'">
            <AuditData :active_project="active_project"></AuditData>
          </div>
          <!-- 审计任务 -->
          <div class="routerView"
               v-else-if="index == '2-2'">
            <AuditTask :active_project="active_project"></AuditTask>
          </div>
          <div class="routerView"
               v-else-if="index == '2-3'">
            <Auditproblem :active_project="active_project"></Auditproblem>
          </div>
          <div class="routerView"
               v-else-if="index == '2-4'">3</div>
          <div class="routerView"
               v-else-if="index == '3-1'">
            <!-- 审计报告 -->
            <AuditReport :active_project="active_project"></AuditReport>
          </div>
          <div class="routerView"
               v-else>
            <Businessindicator :active_project="active_project"></Businessindicator>
          </div>
        </el-col>
      </div>
      <!-- 右侧内容 end -->
    </el-row>

    <!-- 查看更多未初始化项目 -->
    <div class="project_data"
         :class="project_data == true ? 'opctin' : ''">
      <div class="right_data"
           @click="close()">
        <ul :class="project_data == true ? 'style_width' : ''"
            class="ul_data">
          <li @click.stop="look_project(index)"
              v-for="(item, index) in projectInitMore"
              :key="index">
            {{ item.projectName }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 未初始化项目添加弹框 -->
    <el-dialog :visible.sync="addDialogVisible"
               width="60%">
      <div class="title">2021年泰安分公司xxx领导经责审计</div>
      <div class="addPerson"
           v-if="step == 1">
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
              <el-table :data="personMes"
                        @selection-change="handleSelectionChange"
                        ref="personRef">
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
              <el-table :data="peopleSelection"
                        ref="editPerson">
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
                        <el-select v-model="scope.row.isLiaison"
                                   placeholder="请选择">
                          <el-option v-for="item in isconperOptions"
                                     :key="item.value"
                                     :label="item.label"
                                     :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="操作"
                                 width="100">
                  <template slot-scope="scope">
                    <el-button type="text"
                               style="color: #db454b"
                               size="small"
                               @click.native.prevent="
                        deletePerson(scope.$index, peopleSelection, scope.row)
                      ">
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
          <el-button class="nextBtn"
                     @click="nextBtn">下一步</el-button>
        </div>
      </div>

      <div class="addAudit"
           v-else-if="step == 2">
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
        <div class="optionBtn"
             v-if="radio == '1'">
          <span>类型：</span>
          <el-radio v-model="radio"
                    label="1">模型任务</el-radio>
          <el-radio v-model="radio"
                    label="2">自建任务</el-radio>
          <el-row style="margin-top: 10px">
            <el-col :span="15">
              <el-button type="primary"
                         @click="selectModel">选择模型</el-button>
              <span style="margin-top: 2.5%; color: #5f6165; margin-left: 10px">
                请选择想要引用的模型
              </span>
            </el-col>
            <!-- <el-col :span="9">
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
            </el-col> -->
          </el-row>
          <el-table :data="modelListTab"
                    style="width: 100%">
            <el-table-column type="index"
                             label="序号"
                             width="50">
            </el-table-column>
            <el-table-column prop="belongField"
                             label="所属领域"
                             width="180">
            </el-table-column>
            <el-table-column prop="belongSpcial"
                             label="所属专题"
                             width="180">
            </el-table-column>
            <el-table-column prop="auditModelName"
                             label="模型名称">
            </el-table-column>
            <el-table-column prop="address"
                             label="业务规则"> </el-table-column>
            <el-table-column prop="peopleName"
                             label="负责人">
              <template slot-scope="scope">
                <el-form>
                  <el-form-item>
                    <el-select v-model="scope.row.peopleTableUuid"
                               filterable
                               @change="selectChangenumber(scope.row)">
                      <el-option v-for="item in tableData"
                                 :key="item.peopleTableUuid"
                                 :label="item.peopleName"
                                 :value="item.peopleTableUuid">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text"
                           style="color: #db454b"
                           size="small"
                           @click.native.prevent="deletePerson(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="modelDialog = false">取 消</el-button>
        <el-button type="primary" @click="modelDialog = false">确 定</el-button>
      </span> -->
        </div>
        <div v-else-if="radio == '2'"
             class="selfTask">
          <el-row>
            <el-col>
              <div style="margin-top: 0; margin-bottom: 20px">
                <el-radio v-model="radio"
                          label="1">模型任务</el-radio>
                <el-radio v-model="radio"
                          label="2">自建任务</el-radio>
              </div>
            </el-col>
          </el-row>
          <el-button type="primary"
                     @click="addTaskSelf">新增</el-button>
          <el-table :data="tableData"
                    style="width: 100%">
            <el-table-column type="index"
                             label="序号"
                             width="50">
            </el-table-column>
            <el-table-column prop="taskName"
                             label="任务名称">
            </el-table-column>
            <el-table-column prop="taskDescription"
                             label="任务描述">
            </el-table-column>
            <el-table-column prop="task_text"
                             label="问题描述">
            </el-table-column>
            <el-table-column prop="basis"
                             label="依据"> </el-table-column>
            <el-table-column prop="peopleName"
                             label="责任人 "
                             width="200">
              <!-- <template slot-scope="scope">
                <el-select
                  style="margin-top:50px;width:150px"
                  v-model="scope.row.peopleName"
                  @change="changeHeader(scope.row, 2)"
                >
                  <el-option
                    v-for="item in select_list"
                    :key="item.peopleTable.peopleTableUuid"
                    :label="item.peopleTable.peopleName"
                    :value="item.peopleTable.peopleName"
                  >
                  </el-option>
                </el-select>
              </template> -->
            </el-table-column>

            <el-table-column prop="address"
                             label="附件"
                             width="90">
              <div class="update">
                <i class="update_icon">
                  <svg t="1631877671204"
                       class="icon"
                       viewBox="0 0 1024 1024"
                       version="1.1"
                       xmlns="http://www.w3.org/2000/svg"
                       p-id="9939"
                       width="20"
                       height="20">
                    <path d="M825.6 198.4H450.1l-14.4-28.7c-18.8-37.6-56.5-60.9-98.5-60.9H174.1C113.4 108.8 64 158.2 64 218.9v561.9c0 74.1 60.3 134.4 134.4 134.4h627.2c74.1 0 134.4-60.3 134.4-134.4v-448c0-74.1-60.3-134.4-134.4-134.4z m44.8 582.4c0 24.7-20.1 44.8-44.8 44.8H198.4c-24.7 0-44.8-20.1-44.8-44.8V467.2h716.8v313.6z m0-403.2H153.6V218.9c0-11.3 9.2-20.5 20.5-20.5h163.1c7.8 0 14.9 4.4 18.4 11.4l39.1 78.2h430.9c24.7 0 44.8 20.1 44.8 44.8v44.8z"
                          fill="#FD9D27"
                          p-id="9940"></path>
                  </svg>
                </i>
                <span>2</span>
              </div>
            </el-table-column>

            <el-table-column label="操作">
              <template scope="scope">
                <!-- 编辑 -->
                <el-button @click="edit_data(scope.row)"
                           type="text"
                           style="color: #1371cc"
                           size="small">
                  编辑
                </el-button>
                <el-button @click="delete_zj(scope.row.auditTaskUuid)"
                           type="text"
                           style="color: red"
                           size="small">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="stepBtn">
          <el-button @click="prevoius">上一步</el-button>
          <el-button class="nextBtn"
                     @click="saveBtn">完成</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 选择模型 -->
    <el-dialog title="提示"
               :visible.sync="modelDialog"
               width="60%">
      <el-row style="margin-top: 10px">
        <el-col :span="15">
          <div style="margin-top: 2.5%; color: #5f6165; margin-top: 10px">
            请选择想要引用的模型
          </div>
        </el-col>
        <el-col :span="9">
          <el-input placeholder="请输入内容"
                    v-model="modelQuery.condition.modelName"
                    class="input-with-select">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="queryModel"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="modelTableData"
                style="width: 100%"
                @selection-change="handleSelectionChangeModel"
                ref="multipleModel">
        <el-table-column type="selection"
                         :reserve-selection="true">
        </el-table-column>
        <el-table-column prop="auditModelUuid"
                         label="模型编号">
        </el-table-column>
        <el-table-column prop="belongField"
                         label="所属领域"> </el-table-column>
        <el-table-column prop="belongSpcial"
                         label="所属专题">
        </el-table-column>
        <el-table-column prop="modelName"
                         label="模型名称"> </el-table-column>
        <el-table-column prop="address"
                         label="说明"
                         width="300">
        </el-table-column>
        <el-table-column prop="ruleDescription"
                         label="规则"
                         width="300">
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="page">
        <el-pagination background
                       :hide-on-single-page="false"
                       layout="prev, pager, next"
                       :page-sizes="[2, 4, 6, 8]"
                       :current-page="modelSize.current"
                       @current-change="handleCurrentChangeModel"
                       :page-size="modelSize.size"
                       :total="modelSize.total"></el-pagination>
      </div>
      <!-- 分页 end-->
      <div class="stepBtn">
        <el-button @click="res">取消</el-button>
        <el-button type="primary"
                   @click="modelInfo">确认</el-button>
      </div>
    </el-dialog>

    <!-- 自建任务弹出框 -->
    <el-dialog title="自建任务"
               :visible.sync="taskSelfDialogVisible"
               width="50%">
      <div class="selfTask">
        <el-form label-width="80px"
                 :model="taskSelf">
          <el-form-item label="类型："
                        style="margin-bottom: 50px">
            <div style="margin-top: -5%; margin-bottom: 20px">
              <el-radio v-model="radio"
                        label="1">模型任务</el-radio>
              <el-radio v-model="radio"
                        label="2">自建任务</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="自建任务名称：">
            <el-input placeholder="请输入"
                      v-model="taskSelf.taskName"></el-input>
          </el-form-item>
          <el-form-item label="责任人：">
            <el-select v-model="tableData.peopleTableUuid"
                       filterable
                       @change="selectChangePerson">
              <el-option v-for="item in tableData"
                         :key="item.peopleTableUuid"
                         :label="item.peopleName"
                         :value="item.peopleTableUuid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专题：">
            <el-select v-model="tableData.peopleTableUuid"
                       filterable
                       @change="selectChangePerson">
              <el-option v-for="item in tableData"
                         :key="item.peopleTableUuid"
                         :label="item.peopleName"
                         :value="item.peopleTableUuid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="领域：">
            <el-select v-model="tableData.peopleTableUuid"
                       filterable
                       @change="selectChangePerson">
              <el-option v-for="item in tableData"
                         :key="item.peopleTableUuid"
                         :label="item.peopleName"
                         :value="item.peopleTableUuid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务描述：">
            <el-input type="textarea"
                      style="top: -35px; width: 400px"
                      v-model="taskSelf.taskDescription"></el-input>
          </el-form-item>
          <el-form-item label="上传附件：">
            <el-upload class="upload-demo"
                       drag
                       action="https://jsonplaceholder.typicode.com/posts/"
                       multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div class="el-upload__tip"
                   slot="tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="stepBtn">
          <el-button @click="res">取消</el-button>
          <el-button type="primary"
                     @click="modelInfo">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TeamPersonTask from "@/views/audit/teamperson-task/index";
import AuditData from "@/components/workbench/AuditData/index"; //审计资料
import AuditTask from "@/components/workbench/AuditTask/index"; //审计任务
import Auditproblem from "@/components/workbench/auditproblem/index"; //审计问题
import Businessindicator from "@/components/workbench/businessindicator/index"; //经营指标
import AuditReport from "@/components/workbench/AuditReport/index"; //审计问题
import { projectList } from "@WISDOMAUDIT/api/shandong/projectmanagement.js";
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
  editProjectCode,
  initProject,
  modelTaskList,
  editmodelPerson,
  deletmodelTask,
  isModel,
} from "@WISDOMAUDIT/api/shandong/memberMaintenance.js";

export default {
  components: {
    TeamPersonTask, //组员及任务维护
    AuditData, //审计资料
    AuditTask, //审计任务
    Auditproblem, //审计问题
    Businessindicator, //经营指标
    AuditReport, //审计报告
  },
  data () {
    return {
      active_project: '0',//初始化项目有 默认选择
      index: "1-1", //默认指定项
      project_data: false, //更多项目
      drawer: false, //更多未初始化项目
      direction: "rtl",
      size: "21%",
      projectNum: [],
      projectAll: [],
      projectInit: [],
      projectInitMore: [],
      queryManage: {
        condition: {
          status: 0,
        },
        pageNo: 1,
        pageSize: 4,
      },
      queryManageAll: {
        condition: {
          status: 0,
        },
        pageNo: 1,
        pageSize: 10000,
      },

      queryProject: {
        //初始化项目展示入参
        condition: {
          status: 1,
          peopleTableUuid: 'dfb11b4e26c4f4a0647a3f8238aa0a11',
        },
        pageNo: 1,
        pageSize: 6,
      },
      queryProjectAll: {
        //初始化项目更多入参
        condition: {
          status: 1,
        },
        pageNo: 1,
        pageSize: 10000,
      },
      notInitType: "",
      managementProjectUuid: "",
      projectInitUuid: "", //当前项目ID
      addDialogVisible: false,
      step: 1, //步骤条
      radio: "1",
      select: {},
      peopleSelection: [],
      personMes: [],
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
      modelQuery: {
        condition: {
          modelName: "",
        },
        pageNo: 1,
        pageSize: 5,
      },
      selectauditModelList: {
        auditModelList: [],
        projectId: "",
      },
      project: [],
      modelTableData: [],
      taskSelf: {
        //创建自建任务传参
        managementProjectUuid: "",
        peopleName: "",
        peopleTableUuid: "",
        taskDescription: "",
        taskName: "",
        taskType: "2",
      },
      tableData: [],
      modelSize: [],
      projectCode: {
        managementProjectUuid: "",
        status: 1,
      },
      isInfo: 1,
      modelDialog: false,
      modelTableData: [],
      getModelList: {
        condition: {
          managementProjectUuid: "",
          taskType: "1",
        },
        pageNo: 1,
        pageSize: 5,
      },
      modelListTab: [],
      changePerson: {
        managementProjectUuid: "",
        auditTaskUuid: "",
        peopleName: "",
        peopleTableUuid: "",
      },
      ismodelList: {
        condition: {
          managementProjectUuid: "",
          auditModelUuid: "",
        },
        pageNo: 1,
        pageSize: 1000,
      },
      taskSelfDialogVisible: false, //自建任务
    };
  },
  created () {
    this.getprojectList(this.queryManage);
    this.getInitProject(this.queryProject);
    console.log(this.active_project);
  },
  methods: {
    //查询项目
    getprojectList (data) {
      projectList(data).then((resp) => {
        this.projectNum = resp.data.records;
      });
    },
    // 初始化项目
    getInitProject (data) {
      initProject(data).then((resp) => {
        this.projectInit = resp.data.records;
        console.log(this.projectInit);
        this.active_project = resp.data.records[0].managementProjectUuid
      });
    },
    open (index) {
      this.index = 0;
      this.index = index;
    },
    // 查看更多初始化项目
    project_more () {
      this.project_data = true;

      initProject(this.queryProjectAll).then((resp) => {
        this.projectInitMore = resp.data.records;
        console.log(this.projectInitMore);
      });
    },
    close () {
      this.project_data = false;
    },
    look_project (index, item) {
      this.active_project = item.managementProjectUuid;//点击选择添加高亮
      this.projectInit.splice(index, 1)
      this.projectInit.unshift(item)


      if (index > 6) {
        this.projectInitUuid =
          this.projectInitMore[index].managementProjectUuid;
      } else {
        this.projectInitUuid = this.projectInit[index].managementProjectUuid;
      }
      console.log(this.projectInitUuid);
    },
    // 组员查询
    getSelectData (data) {
      getProjectMember(data).then((resp) => {
        this.personMes = resp.data.records;
        this.tableData = resp.data.records;
        console.log(this.tableData);
      });
    },
    //调用组员维护组件的第一步第二步弹框事件
    projectClick (index) {
      if (index > 4) {
        this.managementProjectUuid =
          this.projectAll[index].managementProjectUuid;
        this.notInitType = this.projectAll[index].projectType;
      } else {
        this.managementProjectUuid =
          this.projectNum[index].managementProjectUuid;
        this.notInitType = this.projectNum[index].projectType;
      }
      // console.log(this.managementProjectUuid);
      this.addDialogVisible = true;
      this.getSelectData(this.select);
      auditModelList(this.modelQuery).then((resp) => {
        this.modelTableData = resp.data.records;
        this.modelSize = resp.data;
      });
      // console.log(this.managementProjectUuid);
      this.getModelList.condition.managementProjectUuid =
        this.managementProjectUuid;
      // console.log(this.getModelList);
      this.getauditModelList(this.getModelList);
    },
    // 更多
    moreProject () {
      this.drawer = true;
      projectList(this.queryManageAll).then((resp) => {
        this.projectAll = resp.data.records;
        console.log(this.projectAll);
      });
    },
    // 选择组员事件
    handleSelectionChange (val) {
      // console.log(val);
      this.peopleSelection = [];
      for (let i = 0; i < val.length; i++) {
        this.peopleSelection.push({
          peopleRole: 2,
          isLiaison: 0,
          managementProjectUuid: this.managementProjectUuid,
          peopleTableUuid: val[i].peopleTableUuid,
          peopleTable: {
            peopleTableUuid: val[i].peopleTableUuid,
            peopleName: val[i].peopleName,
            memberPhone: val[i].memberPhone,
            memberDepartment: val[i].memberDepartment,
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
    },
    // 删除组员事件
    deletePerson (index, rows, obj) {
      rows.splice(index, 1);
      for (let i = 0; i < this.personMes.length; i++) {
        if (
          this.personMes[i].peopleTableUuid == obj.peopleTable.peopleTableUuid
        ) {
          this.$refs.personRef.toggleRowSelection(this.personMes[i], false);
        }
      }
    },
    addDialogClosed () {
      this.$router.go(0);
    },
    // 下一步按钮事件
    nextBtn () {
      this.step = 2;
    },
    prevoius () {
      this.step = 1;
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
    // 模糊查询任务模型
    queryModel () {
      auditModelList(this.modelQuery).then((resp) => {
        // console.log(resp);
        this.modelTableData = resp.data.records;
        // console.log(this.modelTableData);
      });
    },
    // 分页跳转事件
    handleCurrentChangeModel (val) {
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
    // 模型选择事件
    handleSelectionChangeModel (val) {
      console.log(val);
      this.selectauditModelList.auditModelList = [];
      for (let i = 0; i < val.length; i++) {
        this.selectauditModelList.auditModelList.push({
          auditModelUuid: val[i].auditModelUuid,
          modelName: val[i].modelName,
        });
      }
      this.selectauditModelList.projectId = this.managementProjectUuid;
      this.ismodelList.condition.auditModelUuid =
        val[val.length - 1].auditModelUuid;
      this.ismodelList.condition.managementProjectUuid =
        this.managementProjectUuid;
      isModel(this.ismodelList).then((resp) => {
        // console.log(resp);
        if (resp.data.total > 0) {
          this.$refs.multipleModel.toggleRowSelection(val[val.length - 1]);
          this.$message.error("项目中已存在该模型！");
        }
      });
    },
    // 自建任务责任人下拉框事件
    selectChangePerson (val) {
      // console.log(val);
      // console.log(this.tableData);
      this.taskSelf.peopleTableUuid = val;
      for (let i = 0; i < this.tableData.length; i++) {
        if (val == this.tableData[i].peopleTableUuid) {
          this.taskSelf.peopleName = this.tableData[i].peopleName;
        }
      }
    },
    selectChangenumber (val) {
      console.log(val);
      this.changePerson.peopleTableUuid = val.peopleTableUuid;
      for (let i = 0; i < this.tableData.length; i++) {
        if (val.peopleTableUuid == this.tableData[i].peopleTableUuid) {
          this.changePerson.peopleName = this.tableData[i].peopleName;
        }
      }
      this.changePerson.managementProjectUuid = this.managementProjectUuid;
      this.changePerson.auditTaskUuid = val.auditTaskUuid;
      editmodelPerson(this.changePerson).then((resp) => {
        console.log(resp);
      });
    },

    //  完成按钮
    saveBtn () {
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
        this.taskSelf.managementProjectUuid = this.managementProjectUuid;
        selfTaskFunction(this.taskSelf).then((resp) => {
          this.$message.success("自建任务创建成功！");
        });
      }

      editprojectMembershipList(this.peopleSelection).then((resp) => {
        this.$message.success("修改成功！");
      });
      this.projectCode.managementProjectUuid = this.managementProjectUuid;
      // this.projectCode.projectType = this.notInitType;
      editProjectCode(this.projectCode).then((resp) => {
        console.log(resp);
      });

      // setInterval(() => {
      //   this.addDialogVisible = false;
      // }, 3000);
    },
    //
    selectModel () {
      this.addDialogVisible = false;
      this.modelDialog = true;
    },
    res () {
      this.modelDialog = false;
      this.addDialogVisible = true;
    },
    // 模型列表渲染
    getauditModelList (data) {
      modelTaskList(data).then((resp) => {
        this.modelListTab = resp.data.records;
        console.log(this.modelListTab);
      });
    },
    // 模型引入
    modelInfo () {
      this.selectauditModelList.projectId = this.managementProjectUuid;
      quoteModel(this.selectauditModelList).then((resp) => {
        this.$message.success("创建成功！");
        this.modelDialog = false;
        this.addDialogVisible = true;
        this.getModelList.condition.managementProjectUuid =
          this.managementProjectUuid;
        // console.log(this.getModelList);
        this.getauditModelList(this.getModelList);
      });
    },
    deletePerson (rows) {
      console.log(rows);
      deletmodelTask(rows.auditTaskUuid).then((resp) => {
        console.log(resp);
        // console.log(this.managementProjectUuid);
        this.getModelList.condition.managementProjectUuid =
          this.managementProjectUuid;
        // console.log(this.getModelList);
        this.getauditModelList(this.getModelList);
      });
    },
    // 新增自建任务
    addTaskSelf () {
      this.addDialogVisible = false;
      this.taskSelfDialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
// 二级导航 穿透样式
// 选中高亮
::v-deep.el-menu .el-menu-item {
  position: relative;
}
// 新增高亮样式
::v-deep.el-menu .el-menu-item span {
  width: 3px;
  height: 20px;
  background-color: #12579a;
  position: absolute;
  top: 50%;
  transform: translate(0%, -50%);
  left: 0;
  cursor: pointer;
  transition: all 0.3s;
  opacity: 0;
}
// 高亮样式
::v-deep.el-menu-item.is-active span {
  opacity: 1 !important;
}

.el-menu-item {
  padding: 0 0 0 30px !important;
  min-width: 160px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
::v-deep.el-menu {
  border-right: none;
}

::v-deep.el-menu-item-group__title {
  color: red !important;
  padding: 0 !important;
}
// 二级导航 穿透样式 end

.projectWorkbench {
  padding: 2%;
  .title {
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 1%;
  }
  // .text {
  //   background: #fff;
  //   border: 1px solid #ebf0f6;
  //   border-radius: 10px;
  //   padding: 5%;
  //   color: #000;
  //   box-shadow: 0px 15px 10px -15px #dee4e8;
  //   cursor: pointer;
  //   .companyName {
  //     margin-bottom: 5%;
  //   }
  // }
}

.projectInit {
  // border: 1px solid red;
  height: 100px;
  margin-bottom: 2%;
  li {
    width: 20%;
    border-radius: 10px;
    float: left;
    margin-right: 2%;
    padding: 1%;
    box-shadow: 0px 15px 10px -15px #dee4e8;
    border: 2px solid #ebf0f6;
    cursor: pointer;
  }
}
.initializeProject {
  margin: 2% 1% 1% 0;
  ul {
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    // margin-bottom: 1%;
    li {
      float: left;
      width: 16%;
      // background: #f1f5fb;
      margin-left: 0.2%;
      padding: 1.5%;
      border-radius: 10px;
    }
    span {
      color: #12579a;
      margin: 0 10px;
      min-width: 60px;
      box-sizing: border-box;
      cursor: pointer;
    }
  }
}
.tac {
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  .left_menu {
    width: 160px;
    display: flex;
    box-sizing: border-box;
    background-color: rgb(241, 245, 251);
  }
  .right_conter {
    width: calc(100% - 160px);
  }
  .menu {
    width: 100%;
    //   border: 1px solid red;
    background: #f1f5fb;
  }
  .routerView {
    // border: 1px solid red;
    padding: 10px;
  }
}
// 展示更多项目
.project_data {
  width: 0;
  overflow-y: auto;
  height: 100%;
  position: fixed;
  right: 0;
  top: 0;
  opacity: 0;
  z-index: 10;
  transition: opacity 0.5s, background 0.3s;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  .right_data {
    position: relative;
    display: flex;
    height: 100%;

    .ul_data {
      width: 0;
      // height: 100%;
      position: absolute;
      right: -300px;
      top: 0;
      // width: 300px;
      padding: 20px 0;
      background-color: #fff;
      float: left;
      transition: width 0.3s;
      // margin-bottom: 1%;
      li {
        margin: 0 auto;
        width: 80%;
        min-height: 60px;
        margin-bottom: 20px;
        background: #f1f5fb;
        padding: 10px;
        border-radius: 10px;
        transition: all 0.3s;
        cursor: pointer;
      }
      li:hover {
        background-color: rgb(66, 130, 254, 0.4);
      }
    }
  }
}
.opctin {
  width: 100% !important;
  opacity: 1 !important;
}
.style_width {
  right: 0px !important;
  width: 300px !important;
}
.projectAll {
  // border: 1px solid red;
  padding: 20px;
  li {
    border: 1px solid #000;
    border-radius: 5px;
    background-color: rgb(241, 245, 251);
    border: 2px solid #ebf0f6;
    cursor: pointer;
    padding: 20px;
    box-shadow: 0px 15px 10px -15px #dee4e8;
    margin-bottom: 5%;
  }
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
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
.addPerson {
  .text {
    font-size: 14px;
    font-weight: 700;
    height: 20px;
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
  width: 90%;
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
.initProjectItem {
  background-color: gainsboro;
  color: #000;
}
</style>
<style scoped>
/deep/ .el-drawer__open .el-drawer.rtl {
  width: 21%;
}
.active_class {
  background: #0c87d6 !important;
}
</style>