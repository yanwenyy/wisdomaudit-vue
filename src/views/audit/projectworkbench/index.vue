<template>
  <div class="projectWorkbench"
       style="background:#fff">
    <div class="title">未初始化项目</div>
    <ul class="projectInit"
        v-if="projectNum">
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
      <span style="cursor: pointer;color: #12579a;"
             v-if="projectAll.length >4"
            @click="moreProjectBtn()">更多>></span>
    </ul>

    <ul class="projectInit"
        v-else>
      暂无未初始化项目...
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

    <!-- 初始化项目 -->
    <div class="initializeProject"
         v-if="active_project">
      <div class="title">初始化项目</div>
      <ul v-if="projectInit">
        <li v-for="(item, index) in projectInit"
            :key="index"
            style="cursor: pointer"
            class="initProjectItem anmition_show"
            @click="look_project(index, item)"
            :class=" active_project == item.managementProjectUuid ? 'active_class' : ''">
          {{ item.projectName }}
        </li>
        <span @click="project_more()"
              v-if="projectInitMore.length>6">更多>></span>
      </ul>
      <ul v-else>
        暂无更多初始化项目...
      </ul>
    </div>

    <el-empty description="暂无数据"
              v-if="!active_project"
              style="margin-top:5%;border:2px solid #EBF0F6;height:600px"></el-empty>

    <el-row class="tac"
            v-else>
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
      <div class="right_conter"
           v-if="active_project">
        <el-col v-if="!refreash">
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
               v-else-if="index == '2-4'">
            <AuditConfirmation :active_project="active_project"></AuditConfirmation>
          </div>
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

    <!-- 查看更多初始化项目 -->
    <div class="project_data"
         :class="project_data == true ? 'opctin' : ''">
      <div class="right_data"
           @click="close()">
        <ul :class="project_data == true ? 'style_width' : ''"
            class="ul_data">
          <li @click.stop="look_project(index,item)"
              v-for="(item, index) in projectInitMore"
              :key="index"
              :class="
            active_project == item.managementProjectUuid ? 'active_class' : ''
          ">
            {{ item.projectName }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 未初始化项目添加弹框 -->
    <el-dialog :visible.sync="addDialogVisible" :before-close="addClosed"
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
                <div>2.第二步：分配审计任务</div>
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
          <el-button @click="addDialogVisibleRes()">取消</el-button>
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
            <div>2.第二步：分配审计任务</div>
            <span></span>
          </div>
        </div>
        <div class="optionBtn"
             v-if="radio == '1'">
          <!-- <span>类型：</span>
          <el-radio v-model="radio"
                    label="1">模型任务</el-radio>
          <el-radio v-model="radio"
                    label="2">自建任务</el-radio> -->
          <el-row>
            <el-col :span="3">
              <el-button type="primary"
                         @click="selectModel">新增模型任务</el-button>
              <!-- <span style="margin-top: 2.5%; color: #5f6165; margin-left: 10px">
                请选择想要引用的模型
              </span> -->
            </el-col>
            <el-col :span="5">
              <el-button type="primary" @click="addTaskSelf">新增自建任务</el-button>
            </el-col>
          </el-row>
          <!-- <el-table :data="modelListTab"
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
          </el-table> -->
           <el-table :data="modelListTab" style="width: 100%" v-loading="loading">
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
                <el-button
                  type="text"
                  style="color: #1371cc"
                  size="small"
                   v-if="scope.row.taskType == 2"
                  @click.native.prevent="edit_data(scope.row)"
                >
                  编辑
                </el-button>
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
          <!-- 分页 -->
          <div class="page">
            <el-pagination background
                           :hide-on-single-page="false"
                           layout="prev, pager, next"
                           :page-sizes="[2, 4, 6, 8]"
                           :current-page="modelListTabSize.current"
                           @current-change="handleCurrentChangeModelTab"
                           :page-size="modelListTabSize.size"
                           :total="modelListTabSize.total"></el-pagination>
          </div>
          <!-- 分页 end-->
        </div>

        <div class="stepBtn">
          <el-button @click="prevoius">上一步</el-button>
          <el-button class="nextBtn"
                     @click="saveBtn">完成</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 选择模型 -->
    <el-dialog title="模型列表"
               :visible.sync="modelDialog"
               width="60%"
               :before-close="MedolDialogClosed"
               >
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
                ref="multipleModelRef">
        <el-table-column type="selection"
                         :reserve-selection="true">
        </el-table-column>
         <el-table-column type="index" label="模型编号" width="80">
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
      <div class="stepBtn" style="margin-top:-15px">
        <el-button @click="res">取消</el-button>
        <el-button type="primary"
                   @click="modelInfo">确认</el-button>
      </div>
    </el-dialog>

    <!-- 自建任务弹出框 -->
    <el-dialog title="自建任务"
               :visible.sync="taskSelfDialogVisible"
              :before-close="TaskDialogClosed"
               width="50%">
      <div class="selfTask">
        <el-form label-width="80px"
                 :model="taskSelf"
                 ref="selfTaskRef"
                 :rules="taskSelfRules"
                 >
          <el-form-item label="自建任务名称：" prop="taskName">
            <el-input placeholder="请输入"
                      v-model="taskSelf.taskName"></el-input>
          </el-form-item>
          <el-form-item label="责任人：" prop="peopleName">
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
          <el-form-item label="专  题:"
                        prop="belongSpcial">
            <el-select placeholder="请选择"
                       v-model="taskSelf.belongSpcial">
              <el-option v-for="item in thematicOption"
                         :key="item.value"
                         :label="item.label"
                         :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="领   域:"
                        prop="belongField">
            <el-select placeholder="请选择"
                       v-model="taskSelf.belongField">
              <el-option v-for="item in areasOption"
                         :key="item.value"
                         :label="item.label"
                         :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务描述：" prop="taskDescription">
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
          <el-button @click="TaskSelf_res">取消</el-button>
          <el-button type="primary"
                     @click="taskSelfInfo('selfTaskRef')">确认</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="编辑自建项目"
               :visible.sync="editTaskSelfDialogVisible"
               width="50%">
      <div class="selfTask">
        <el-form label-width="80px"
                 :model="edittaskSelfForm">
          <!-- <el-form-item label="类型：" style="margin-bottom: 50px">
            <div style="margin-top: -5%; margin-bottom: 20px">
              <el-radio v-model="radio" label="1">模型任务</el-radio>
              <el-radio v-model="radio" label="2">自建任务</el-radio>
            </div>
          </el-form-item> -->
          <el-form-item label="自建任务名称："
                        style="margin-top: 20px">
            <el-input placeholder="请输入"
                      v-model="edittaskSelfForm.taskName"></el-input>
          </el-form-item>
          <el-form-item label="责任人："
                        prop="peopleName">
            <el-select v-model="edittaskSelfForm.peopleTableUuid"
                       filterable
                       @change="selectChangePerson">
              <el-option v-for="item in tableData"
                         :key="item.peopleTableUuid"
                         :label="item.peopleName"
                         :value="item.peopleTableUuid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专  题:"
                        prop="belongSpcial">
            <el-select placeholder="请选择"
                       v-model="edittaskSelfForm.belongSpcial">
              <el-option v-for="item in thematicOption"
                         :key="item.value"
                         :label="item.label"
                         :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="领   域:"
                        prop="belongField">
            <el-select placeholder="请选择"
                       v-model="edittaskSelfForm.belongField">
              <el-option v-for="item in areasOption"
                         :key="item.value"
                         :label="item.label"
                         :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务描述：">
            <el-input type="textarea"
                      style="top: -35px; width: 400px"
                      v-model="edittaskSelfForm.taskDescription"></el-input>
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
          <el-button @click="editTaskSelfDialogVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="edittaskSelf">确认</el-button>
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
import AuditConfirmation from "@WISDOMAUDIT/views/audit/auditconfirmationform/index"
import {
  projectList,
  thematicAreas,
} from "@WISDOMAUDIT/api/shandong/projectmanagement.js";
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
  editTaskSelf,
  editTaskSelfInfo,
} from "@WISDOMAUDIT/api/shandong/memberMaintenance.js";

export default {
  components: {
    TeamPersonTask, //组员及任务维护
    AuditData, //审计资料
    AuditTask, //审计任务
    Auditproblem, //审计问题
    Businessindicator, //经营指标
    AuditReport, //审计报告
    AuditConfirmation //审计确认单
  },
  data () {
    return {
      loading:false,
      ifshow: false,
      refreash: false,
      active_project: "", //初始化项目有 默认选择
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
          peopleTableUuid: "dfb11b4e26c4f4a0647a3f8238aa0a11",
        },
        pageNo: 1,
        pageSize: 6,
      },
      queryProjectAll: {
        //初始化项目更多入参
        condition: {
          peopleTableUuid: "dfb11b4e26c4f4a0647a3f8238aa0a11",
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
      taskSelf: {
        //创建自建任务传参
        managementProjectUuid: "",
        peopleName: "",
        peopleTableUuid: "",
        taskDescription: "",
        taskName: "",
        belongField: "",
        belongSpcial: "",
        taskType: ""
      },
      edittaskSelfForm: {
        peopleName: "",
        peopleTableUuid: "",
        taskDescription: "",
        taskName: "",
        belongField: "",
        belongSpcial: "",
        taskType: "2",
      },
      editTaskSelfData: {
        auditTaskUuid: "",
        peopleName: "",
        peopleTableUuid: "",
        taskDescription: "",
        belongField: "",
        belongSpcial: "",
        taskName: "",
        taskType: "",
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
      modelListTabSize: [], //模型分页返回值
      taskSelfTabSize: [],//自建任务分页
      getModelList: {
        condition: {
          managementProjectUuid: ""
        },
        pageNo: 1,
        pageSize: 5,
      },
      getTaskSelfList: {
        condition: {
          managementProjectUuid: "",
          taskType: "2",
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
      thematicOption: [],
      areasOption: [],
      thematic: {
        typecode: "SPECIAL",
      },
      areas: {
        typecode: "Category",
      },
      editTaskSelfDialogVisible: false, //编辑自建任务窗口
      taskSelfTab: [],//自建任务列表
      // 自建任务校验
      taskSelfRules:{
       taskName: [
            { required: true, message: '请输入自建任务名称', trigger: 'blur' }
       ],
       peopleName: [
          { required: true, message: '请选择责任人', trigger: 'change' }
       ],
        belongSpcial: [
          { required: true, message: '请选择专题', trigger: 'change' }
       ],
       belongField: [
         { required: true, message: '请选择领域', trigger: 'change' }
       ],
       taskDescription:[
          { required: true, message: '请输入任务描述', trigger: 'change' }
       ]
      }
    };
  },
  watch: {
    'active_project' (val) {
      this.refreash = true
      // console.log('-----------------------'+this.active_project)
      let _this = this
      setTimeout(function name () {
        _this.refreash = false
      }, 500)
    }
  },
  created () {
    // console.log(this.active_project);
    this.getprojectList(this.queryManage);
    this.getInitProject(this.queryProject);
    this.thematicSelect(this.thematic);
    this.areasSelect(this.areas);
    this.moreProject(this.queryManageAll);
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
      this.ifshow = true;
      initProject(data).then((resp) => {
        this.projectInit = resp.data.records;
        if (resp.data.records) {
          this.active_project = resp.data.records[0].managementProjectUuid;
        }
        this.ifshow = false;
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
      this.active_project = item.managementProjectUuid; //点击选择添加高亮
      this.projectInit.splice(index, 1);
      this.projectInit.unshift(item);

      if (index > 6) {
        this.projectInitUuid =
          this.projectInitMore[index].managementProjectUuid;
      } else {
        this.projectInitUuid = this.projectInit[index].managementProjectUuid;
      }
      // console.log(this.active_project);
    },
    // 组员查询
    getSelectData (data) {
      getProjectMember(data).then((resp) => {
        this.personMes = resp.data.records;
        this.tableData = resp.data.records;
        // console.log(this.tableData);
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
      this.getTaskSelfList.condition.managementProjectUuid =
        this.managementProjectUuid;
      this.getTaskSelf(this.getTaskSelfList);
    },
    // 更多
    moreProject (data) {
      projectList(data).then((resp) => {
        this.projectAll = resp.data.records;
        // console.log(this.projectAll);
      });
    },
    // 更多按钮
   
    moreProjectBtn(){
       this.drawer = true;
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
       this.getModelList.condition.managementProjectUuid =
        this.managementProjectUuid;
      // console.log(this.getModelList);
      this.getauditModelList(this.getModelList);
      // console.log(this.modelListTab);
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
      // console.log(val);
      this.selectauditModelList.auditModelList = [];
      for (let i = 0; i < val.length; i++) {
        this.selectauditModelList.auditModelList.push({
          auditModelUuid: val[i].auditModelUuid,
          modelName: val[i].modelName,
          belongField: val[i].belongField,
          belongSpcial: val[i].belongSpcial,
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
          this.$refs.multipleModelRef.toggleRowSelection(val[val.length - 1]);
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
          this.edittaskSelfForm.peopleName = this.tableData[i].peopleName;
        }
      }
    },
    selectChangenumber (val) {
      // console.log(val);
      this.changePerson.peopleTableUuid = val.peopleTableUuid;
      for (let i = 0; i < this.tableData.length; i++) {
        if (val.peopleTableUuid == this.tableData[i].peopleTableUuid) {
          this.changePerson.peopleName = this.tableData[i].peopleName;
        }
      }
      this.changePerson.managementProjectUuid = this.managementProjectUuid;
      this.changePerson.auditTaskUuid = val.auditTaskUuid;
      editmodelPerson(this.changePerson).then((resp) => {
        // console.log(resp);
      });
    },

    //  完成按钮
    saveBtn () {
      editprojectMembershipList(this.peopleSelection).then((resp) => {
        this.$message.success("修改成功！");
      });
      this.projectCode.managementProjectUuid = this.managementProjectUuid;
      // this.projectCode.projectType = this.notInitType;
      editProjectCode(this.projectCode).then((resp) => {
        // console.log(resp);
      });

      setInterval(() => {
        this.$router.go(0)
      }, 1000);
    },
    selectModel () {
      this.addDialogVisible = false;
      this.modelDialog = true;
    },
    // 未初始化弹框关闭事件
    addClosed(){
      this.step = 1;
      this.addDialogVisible = false;
    },
    // 新增模型任务弹框取消按钮
    res () {
      this.modelDialog = false;
      this.addDialogVisible = true;
      for (let i = 0; i < this.modelTableData.length; i++) {
        this.$refs.multipleModelRef.toggleRowSelection(this.modelTableData[i], false);
      }

    },
    // 新增自建任务弹框取消按钮
    TaskSelf_res(){
       this.taskSelfDialogVisible = false;
       this.taskSelf = {}
      this.addDialogVisible = true;
    },
    // 新增自建任务弹框关闭事件
    TaskDialogClosed(){
       this.taskSelf = {};
       this.taskSelfDialogVisible = false;
       this.addDialogVisible = true;
    },
    // 新增自建任务弹框关闭事件
    MedolDialogClosed(){
       this.modelDialog = false;
      this.addDialogVisible = true;
      for (let i = 0; i < this.modelTableData.length; i++) {
        this.$refs.multipleModelRef.toggleRowSelection(this.modelTableData[i], false);
      }
    },
    // 模型列表渲染
    getauditModelList (data) {
      this.loading = true;
      modelTaskList(data).then((resp) => {
        this.modelListTab = resp.data.records;
        this.modelListTabSize = resp.data;
        this.loading = false;
        // console.log(this.modelListTab);
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
      deletmodelTask(rows.auditTaskUuid).then((resp) => {
        // console.log(this.managementProjectUuid);
        this.getModelList.condition.managementProjectUuid =
          this.managementProjectUuid;
        // console.log(this.getModelList);
        this.getauditModelList(this.getModelList);
      });
    },
    // 模型列表分页事件
    handleCurrentChangeModelTab (val) {
      let getModelList = {
        condition: {
          managementProjectUuid: this.managementProjectUuid,
        },
        pageNo: val,
        pageSize: 5,
      }
      this.getauditModelList(getModelList);
    },
    // handleCurrentChangeTaskTab (val) {
    //   let getTaskSelfList = {
    //     condition: {
    //       managementProjectUuid: this.managementProjectUuid,
    //       taskType: "2",
    //     },
    //     pageNo: val,
    //     pageSize: 5,
    //   }
    //   this.getTaskSelf(getTaskSelfList);
    // },
    // 新增自建任务
    addTaskSelf () {
      this.addDialogVisible = false;
      this.taskSelfDialogVisible = true;
    },
    // 专题下拉框
    thematicSelect (data) {
      thematicAreas(data).then((resp) => {
        this.thematicOption = resp.data;
        // console.log(this.thematicOption);
      });
    },
    //领域下拉框
    areasSelect (data) {
      thematicAreas(data).then((resp) => {
        this.areasOption = resp.data;
        // console.log(this.areasOption);
      });
    },
    // 确定自建任务
    taskSelfInfo (selfTaskRef) {
       this.$refs[selfTaskRef].validate((valid) => {
          if (valid) {
            this.taskSelf.managementProjectUuid = this.managementProjectUuid;
            selfTaskFunction(this.taskSelf).then((resp) => {
              this.$message.success("自建任务创建成功！");
              this.taskSelfDialogVisible = false;
              this.addDialogVisible = true;
              this.getTaskSelfList.condition.managementProjectUuid =
                this.managementProjectUuid;
              this.getTaskSelf(this.getTaskSelfList);
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      
    },
    // 自建任务列表渲染
    getTaskSelf (data) {
      modelTaskList(data).then((resp) => {
        this.taskSelfTab = resp.data.records;
        this.taskSelfTabSize = resp.data;
      });
    },
    // 编辑自建按钮
    edit_data (row) {
      this.editTaskSelfDialogVisible = true;
      editTaskSelf(row.auditTaskUuid).then((resp) => {
        this.edittaskSelfForm = resp.data;
      });
    },
    // 自建任务编辑完成按钮
    edittaskSelf () {
      this.editTaskSelfData.auditTaskUuid = this.edittaskSelfForm.auditTaskUuid;
      this.editTaskSelfData.peopleName = this.edittaskSelfForm.peopleName;
      this.editTaskSelfData.peopleTableUuid =
        this.edittaskSelfForm.peopleTableUuid;
      this.editTaskSelfData.taskDescription =
        this.edittaskSelfForm.taskDescription;
      this.editTaskSelfData.taskName = this.edittaskSelfForm.taskName;
      this.editTaskSelfData.belongSpcial = this.edittaskSelfForm.belongSpcial;
      this.editTaskSelfData.belongField = this.edittaskSelfForm.belongField;
      editTaskSelfInfo(this.editTaskSelfData).then((resp) => {
        if (resp.code == 0) {
          this.$message.success("修改自建任务成功！");
          this.editTaskSelfDialogVisible = false;
        }
      });
      this.addDialogVisible = true;
      this.getTaskSelfList.condition.managementProjectUuid =
        this.managementProjectUuid;
      this.getTaskSelf(this.getTaskSelfList);

    },
    // 自建任务删除
    delete_zj (id) {
      deletmodelTask(id).then((resp) => {
        // console.log(this.managementProjectUuid);
        this.getTaskSelfList.condition.managementProjectUuid =
          this.managementProjectUuid;
        this.getTaskSelf(this.getTaskSelfList);
      });
    },
    //步骤关闭事件
    addDialogVisibleRes () {
      this.addDialogVisible = false;
      for (let i = 0; i < this.personMes.length; i++) {
        this.$refs.personRef.toggleRowSelection(this.personMes[i], false);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/css/lhg.css";

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
// 未初始化项目
.projectInit {
  // border: 1px solid red;
  min-height: 100px;
  margin-bottom: 2%;
  display: flex;
  align-items: center;
  li {
    width: 20%;
    border-radius: 10px;
    float: left;
    margin-right: 2%;
    padding: 1%;
    border: 2px solid #ebf0f6;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      box-shadow: 0 2px 10px 5px rgba(0, 0, 0, 0.05);
    }
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
      margin-right: 0.5%;
      padding: 1.5%;
      border-radius: 10px;
      transition: all 0.3s;
      border: 1px solid #fff;

      &:hover {
        box-shadow: 0 2px 10px 5px rgba(0, 0, 0, 0.1);
        border: 1px solid #ebf0f6;
      }
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
  z-index: 9999;
  transition: opacity 0.5s, background 0.3s;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  .right_data {
    position: relative;
    display: flex;
    height: 100%;

    .ul_data {
      width: 0;
      height: 100%;
      position: absolute;
      right: -300px;
      top: 0;
      // width: 300px;
      padding: 40px 20px 20px;
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
  // border: 1px solid red; 
  margin-top: -2%;
  padding: 2%;
}
.selfTask {
  width: 60%;
  margin: 10px auto;
  // border: 1px solid red; 
}
.selfTask .el-form-item__error{
  top: -58%;
  left: 279px;
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
  background-color: rgb(242, 242, 242);
  color: #000;
}
</style>
<style scoped>
/deep/ .el-drawer__open .el-drawer.rtl {
  width: 21%;
}
.active_class {
  background: rgb(12, 135, 214) !important;
  color: #fff;
  transition: all 0.3s;
}
.active_class:hover {
  box-shadow: 0 2px 10px 5px rgb(12, 135, 214, 0.5) !important;
  border: 1px solid rgb(12, 135, 214, 1) !important;
}
.companyName {
  font-weight: 500;
  font-size: 16px;
}
.projectInit >>> .el-row div p {
  margin-top: 10px;
}
.initializeProject ul {
  min-height: 70px;
}
.projectWorkbench >>> .el-submenu__title:hover,
.projectWorkbench >>> .el-menu-item:hover {
  background-color: rgb(12, 135, 214, 0.3) !important;
}
</style>