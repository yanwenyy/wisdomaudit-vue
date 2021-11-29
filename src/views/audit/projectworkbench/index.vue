<template>
  <div class="projectWorkbench" style="background: #fff">
    <div class="title1" v-show="projectNum.length > 0">未初始化项目</div>
    <ul class="projectInit" v-show="projectNum.length > 0">
      <li
        @click="projectClick(index)"
        v-for="(value, index) in projectNum"
        :key="index"
      >
        <div class="peojectMessage">
          <p class="projectName" style="margin-bottom: 2%">
            {{ value.projectName }}
          </p>
          <el-row>
            <el-col :span="12">
              <div>
                <p class="textOver">被审计对象：</p>
                <p class="textOver">{{ value.auditOrgName }}</p>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <p>审计周期：</p>
                <p class="textOver">
                  {{ value.auditStartData }}至{{ value.auditFinishData }}
                </p>
              </div>
            </el-col>
          </el-row>
        </div>
      </li>
      <span
        class="moreBtn"
        style="cursor: pointer; color: #12579a"
        v-if="projectAll.length > 4"
        @click="moreProjectBtn()"
        >更多>></span
      >
    </ul>

    <!-- <ul class="projectInit">
      暂无未初始化项目...
    </ul> -->

    <el-drawer
      title="未初始化项目"
      :visible.sync="drawer"
      :direction="direction"
      :size="size"
    >
      <ul class="projectAll">
        <li
          @click="projectClick(index)"
          v-for="(value, index) in projectAll"
          :key="index"
        >
          <p class="companyName" style="margin-bottom: 2%">
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
    <!-- v-show="projectNum.length > 0" -->
    <div class="initializeProject" v-if="active_project">
      <div class="title1" style="margin-top: 0%">初始化项目</div>
      <ul v-if="projectInit">
        <li
          v-for="(item, index) in projectInit"
          :key="index"
          style="cursor: pointer"
          class="initProjectItem anmition_show"
          @click="look_project(index, item)"
          :class="
            active_project == item.managementProjectUuid ? 'active_class' : ''
          "
        >
          {{ item.projectName }}
        </li>
        <span class="moreBtn" @click="look_more()" v-if="ifmore">更多>></span>
      </ul>
      <ul v-else>
        暂无更多初始化项目...
      </ul>
    </div>

    <el-empty
      description="暂无数据"
      v-if="!active_project"
      style="margin-top: 5%; border: 2px solid #ebf0f6; height: 600px"
    ></el-empty>

    <el-row class="tac" v-else>
      <!-- 左侧导航 -->
      <div class="left_menu">
        <el-col>
          <div class="menu">
            <el-menu
              ref="selfMenu"
              :key="key"
              :default-active="defaultActive"
              :active="defaultActive"
              class="el-menu-vertical-demo"
              @select="open"
              background-color="#F1F5FB"
              :default-openeds="['1', '2', '3']"
            >
              <el-submenu
                v-show="userInfo.userRole == '1' || userInfo.userRole == '3'"
                index="1"
              >
                <template slot="title">
                  <span style="font-weight: 400">审计准备</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1"
                    >组员及任务维护 <span></span
                  ></el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu
                v-show="
                  userInfo.userRole == '1' ||
                  userInfo.userRole == '2' ||
                  userInfo.userRole == '3'
                "
                index="2"
              >
                <template slot="title">
                  <span style="font-weight: 400">审计实施</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="2-1">审计资料<span></span></el-menu-item>
                  <el-menu-item index="2-2">审计任务<span></span></el-menu-item>
                  <el-menu-item index="2-3">审计问题<span></span></el-menu-item>
                  <el-menu-item index="2-4"
                    >审计确认单<span></span
                  ></el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu
                v-show="userInfo.userRole == '1' || userInfo.userRole == '3'"
                index="3"
              >
                <template slot="title">
                  <span style="font-weight: 400">报告阶段</span>
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
      <div class="right_conter" v-if="active_project">
        <el-col v-if="!refreash">
          <!-- 组员及任务维护 -->
          <div class="routerView" v-if="index == '1-1'">
            <TeamPersonTask
              ref="temPersonRef"
              :active_project="active_project"
              :userRole="userInfo.userRole"
              :isLiaison="userInfo.isLiaison"
            />
          </div>
          <!-- 审计资料 -->
          <div class="routerView" v-else-if="index == '2-1'">
            <AuditData
              :active_project="active_project"
              :userRole="userInfo.userRole"
              :isLiaison="userInfo.isLiaison"
            ></AuditData>
          </div>
          <!-- 审计任务 -->
          <div class="routerView" v-else-if="index == '2-2'">
            <AuditTask
              :active_project="active_project"
              :userRole="userInfo.userRole"
              :isLiaison="userInfo.isLiaison"
            ></AuditTask>
          </div>
          <div class="routerView" v-else-if="index == '2-3'">
            <Auditproblem
              :active_project="active_project"
              :userRole="userInfo.userRole"
              :isLiaison="userInfo.isLiaison"
            ></Auditproblem>
          </div>
          <div class="routerView" v-else-if="index == '2-4'">
            <AuditConfirmation
              :active_project="active_project"
              :userRole="userInfo.userRole"
              :isLiaison="userInfo.isLiaison"
            ></AuditConfirmation>
          </div>
          <div class="routerView" v-else-if="index == '3-1'">
            <!-- 审计报告 -->
            <AuditReport
              :active_project="active_project"
              :userRole="userInfo.userRole"
              :isLiaison="userInfo.isLiaison"
            ></AuditReport>
          </div>
          <div class="routerView" v-else>
            <Businessindicator
              :active_project="active_project"
              :userRole="userInfo.userRole"
              :isLiaison="userInfo.isLiaison"
            ></Businessindicator>
          </div>
        </el-col>
      </div>
      <!-- 右侧内容 end -->
    </el-row>

    <!-- 查看更多初始化项目 -->
    <div
      class="project_data"
      :class="project_data == true ? 'opctin' : ''"
      @click="close()"
    >
      <div class="right_data">
        <div :class="project_data == true ? 'style_width' : ''" class="ul_data">
          <ul style="height: 100%; overflow-y: auto">
            <li
              @click.stop="look_project(index, item)"
              v-for="(item, index) in projectInitMore"
              :key="index"
              :class="
                active_project == item.managementProjectUuid
                  ? 'active_class'
                  : ''
              "
            >
              {{ item.projectName }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 未初始化项目添加弹框 -->
    <el-dialog
      :visible.sync="addDialogVisible"
      :before-close="addClosed"
      width="60%"
    >
      <div class="dialogTitle">
        {{ name }}
      </div>
      <div class="addPerson" v-if="step == 1">
        <el-row>
          <el-col :span="24">
            <div class="stepNew">
              <div class="stepOneN">
                <div>第一步：添加组员</div>
                <span></span>
              </div>
              <div class="stepTwoN">
                <span></span>
                <div>第二步：分配审计任务</div>
                <span></span>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <div class="text">请选择组员，可多选</div>
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
          <div slot-scope="{ option }" class="setinterPerson">
            {{ option.label }}
            <span
              v-if="option.isLiaison == 0"
              class="setinterPersonBtn"
              @click="isLiaison_Btn(option, value)"
              >设为接口人</span
            >
            <span
              v-else-if="option.isLiaison == 1"
              style="
                float: right;
                color: #8492a6;
                font-size: 13px;
                margin-right: 0px;
                cursor: pointer;
              "
              @click="cancel_Btn(option)"
              >取消接口人</span
            >
          </div>
        </el-transfer>
        <div class="stepBtn">
          <el-button @click="addDialogVisibleRes()">取消</el-button>
          <el-button class="nextBtn" @click="nextBtn">下一步</el-button>
        </div>
      </div>

      <div class="addAudit" v-else-if="step == 2" style="padding: 1%">
        <div class="stepNew">
          <div class="auditStepOneN">
            <div>第一步：添加组员</div>
            <span></span>
          </div>
          <div class="auditStepTwoN">
            <span></span>
            <div>第二步：分配审计任务</div>
            <span></span>
          </div>
        </div>
        <div class="optionBtn" v-if="radio == '1'">
          <el-row :gutter="24">
            <el-col :span="15" style="margin-right: 4%">
              <el-button
                style="background: #0c87d6; color: #fff"
                @click="selectModel"
                >新增模型任务</el-button
              >
              <!-- <span style="margin-top: 2.5%; color: #5f6165; margin-left: 10px">
                请选择想要引用的模型
              </span> -->

              <el-button
                style="background: #0c87d6; color: #fff"
                @click="addTaskSelf"
                >新增自建任务</el-button
              >
            </el-col>

            <!-- 条件查询模型名称 -->
            <div class="search">
              <el-input
                placeholder="请输入任务名称"
                v-model="getModelList.condition.taskName"
                @keyup.enter.native="queryNameInput"
              >
              </el-input>
              <div
                class="search_icon"
                style="background: #0c87d6 !important"
                @click="queryNameInput"
              >
                <i class="el-icon-search" style="color: white"></i>
              </div>
            </div>
            <!-- <el-col :span="8" >
              <el-input
                placeholder="请输入模型任务名称"
                v-model="getModelList.condition.taskName"
                class="input-with-select"
                @keyup.enter.native="queryName"
              >
                <el-button
                  slot="append"
                  style="background:#1897E4;color:#FFF"
                  icon="el-icon-search"
                  @click="queryName"
                ></el-button>
              </el-input>
            </el-col> -->
          </el-row>
          <el-table
            :data="modelListTab"
            style="width: 100%"
            :header-cell-style="{ 'background-color': '#F4FAFF' }"
          >
            <el-table-column prop="taskName" label="任务名称">
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
                      style="margin-top:5px"
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
                <el-popover placement="bottom" width="300" trigger="click">
                  <el-table :data="enclosure_details_list">
                    <el-table-column prop="fileName" label="文件名称">
                      <template slot-scope="scope">
                        <el-link
                          type="primary"
                          @click="
                            enclosureDownload(
                              scope.row.attachmentUuid,
                              scope.row.fileName
                            )
                          "
                          >{{ scope.row.fileName }}</el-link
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <div
                    class="update"
                    style="margin-top: 5px; cursor: pointer"
                    @click="nearbyDetails(scope.row)"
                    slot="reference"
                  >
                    <i class="update_icon" style="margin-top: -3px">
                      <svg
                        t="1631877671204"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="9939"
                        width="15"
                        height="15"
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
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  style="color: #0c87d6; background: none; border: 0;font-size:14px"
                  size="small"
                  v-if="scope.row.taskType == 2"
                  @click.native.prevent="edit_data(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  style="color: #ff8a72; background: none; border: 0;font-size:14px"
                  size="small"
                  @click.native.prevent="deleteModel(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination
            v-show="taskTotal > 0"
            :total="taskTotal"
            :page.sync="getModelList.pageNo"
            :limit.sync="getModelList.pageSize"
            @pagination="queryName"
          />
          <!-- <div class="page">
            <el-pagination
              background
              :hide-on-single-page="false"
              layout="prev, pager, next"
              :page-sizes="[2, 4, 6, 8]"
              :current-page="modelListTabSize.current"
              @current-change="handleCurrentChangeModelTab"
              :page-size="modelListTabSize.size"
              :total="modelListTabSize.total"
            ></el-pagination>
          </div> -->
          <!-- 分页 end-->
        </div>

        <div class="stepBtn">
          <el-button @click="prevoius()">上一步</el-button>
          <el-button class="nextBtn" @click="saveBtn">完成</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 选择模型 -->
    <el-dialog
      :visible.sync="modelDialog"
      width="60%"
      :before-close="MedolDialogClosed"
    >
      <div class="dialogTitle">模型列表</div>
      <div style="padding: 2%">
        <el-row>
          <el-col :span="15">
            <div style="margin-top: 2.5%; color: #5f6165; margin-top: 10px">
              请选择想要引用的模型
            </div>
          </el-col>
          <div class="search">
            <el-input
              placeholder="请输入模型名称"
              v-model="modelQuery.condition.modelName"
              @keyup.enter.native="queryModelInput"
            >
            </el-input>
            <div
              class="search_icon"
              style="background: #1897e4 !important"
              @click="queryModelInput"
            >
              <i class="el-icon-search" style="color: white"></i>
            </div>
          </div>
          <!-- <el-col :span="9">
            <el-input
              placeholder="请输入内容"
              v-model="modelQuery.condition.modelName"
              class="input-with-select"
            >
              <el-button
                slot="append"
                style="background:#1897E4;color:#FFF"
                icon="el-icon-search"
                @click="queryModel"
              ></el-button>
            </el-input>
          </el-col> -->
        </el-row>
        <el-table
          :data="modelTableData"
          style="width: 100%"
          @selection-change="handleSelectionChangeModel"
          ref="multipleModelRef"
          :row-key="getRowKey"
        >
          <el-table-column type="selection" :reserve-selection="true">
          </el-table-column>
          <el-table-column type="index" label="模型编号" width="80">
          </el-table-column>
          <el-table-column prop="belongField" label="所属领域">
          </el-table-column>
          <el-table-column prop="belongSpcial" label="所属专题">
          </el-table-column>
          <el-table-column prop="modelName" label="模型名称"> </el-table-column>
          <el-table-column prop="address" label="说明" width="300">
          </el-table-column>
          <el-table-column prop="ruleDescription" label="规则" width="300">
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination
          v-show="modelTotal > 0"
          :total="modelTotal"
          :page.sync="modelQuery.pageNo"
          :limit.sync="modelQuery.pageSize"
          @pagination="queryModel"
        />
        <!-- <div class="page">
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
      </div> -->
        <!-- 分页 end-->
        <div class="stepBtn" style="margin-top: 25px">
          <el-button @click="res">取消</el-button>
          <el-button
            style="background: #1897e4; color: #fff"
            @click="modelInfo"
            :disabled="isdisabled"
            >确认</el-button
          >
        </div>
      </div>
    </el-dialog>

    <!-- 自建任务弹出框 -->
    <el-dialog
      :visible.sync="taskSelfDialogVisible"
      :before-close="TaskDialogClosed"
      @close="resetForm2('selfTaskRef')"
      width="50%"
    >
      <div class="dialogTitle">自建任务</div>
      <div class="selfTask">
        <el-form
          label-width="100px"
          :model="taskSelf"
          ref="selfTaskRef"
          :rules="taskSelfRules"
          hide-required-asterisk
        >
          <el-form-item label="自建任务名称：" prop="taskName">
            <el-input
              placeholder="请输入"
              v-model="taskSelf.taskName"
            ></el-input>
          </el-form-item>
          <el-form-item label="ㅤㅤㅤ责任人：" prop="peopleName">
            <el-select
              v-model="taskSelf.peopleName"
              filterable
              @change="selectChangePerson"
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
          <el-form-item label="ㅤㅤㅤ专ㅤ题:" prop="belongSpcial">
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
          <el-form-item label="ㅤㅤㅤ领ㅤ域:" prop="belongField">
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
          <el-form-item label="ㅤㅤ任务描述：" prop="taskDescription">
            <el-input
              type="textarea"
              style="top: -35px"
              v-model="taskSelf.taskDescription"
            ></el-input>
          </el-form-item>
          <el-form-item label="ㅤㅤ上传附件：">
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
          <el-button @click="TaskSelf_res">取消</el-button>
          <el-button
            type="primary"
            @click="taskSelfInfo('selfTaskRef')"
            :disabled="isdisabled"
            >确认</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="editTaskSelfDialogVisible"
      width="50%"
      @close="editResetForm2('editTaskRef')"
    >
      <div class="dialogTitle">编辑自建任务</div>
      <div class="selfTask">
        <el-form
          label-width="100px"
          :model="edittaskSelfForm"
          ref="editTaskRef"
          hide-required-asterisk
        >
          <!-- <el-form-item label="类型：" style="margin-bottom: 50px">
            <div style="margin-top: -5%; margin-bottom: 20px">
              <el-radio v-model="radio" label="1">模型任务</el-radio>
              <el-radio v-model="radio" label="2">自建任务</el-radio>
            </div>
          </el-form-item> -->
          <el-form-item label="自建任务名称：" style="margin-top: 20px">
            <el-input
              placeholder="请输入"
              v-model="edittaskSelfForm.taskName"
            ></el-input>
          </el-form-item>
          <el-form-item label="ㅤㅤㅤ责任人：" prop="peopleName">
            <el-select
              v-model="edittaskSelfForm.peopleTableUuid"
              filterable
              @change="selectChangePerson"
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
          <el-form-item label="ㅤㅤㅤ专ㅤ题:" prop="belongSpcial">
            <el-select
              placeholder="请选择"
              v-model="edittaskSelfForm.belongSpcial"
            >
              <el-option
                v-for="item in thematicOption"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="ㅤㅤㅤ领ㅤ域:" prop="belongField">
            <el-select
              placeholder="请选择"
              v-model="edittaskSelfForm.belongField"
            >
              <el-option
                v-for="item in areasOption"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="ㅤㅤ任务描述：">
            <el-input
              type="textarea"
              style="top: -35px"
              v-model="edittaskSelfForm.taskDescription"
            ></el-input>
          </el-form-item>
          <el-form-item label="ㅤㅤ上传附件：">
            <el-upload
              class="upload-demo"
              drag
              action="#"
              v-model="edittaskSelfForm.enclosure"
              :on-change="handleChangePic"
              :on-remove="handleRemove"
              :file-list="edit_file_list"
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
          <el-button @click="editTaskSelfDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="edittaskSelfSave"
            :disabled="isdisabled"
            >确认</el-button
          >
        </div>
      </div>
    </el-dialog>

    <!-- 附件详情 -->
    <!-- <el-dialog
      title="附件详情"
      width="40%"
      :visible.sync="nearbyDialogVisible"
      style="padding-bottom: 59px"
    >
      <el-table :data="enclosure_details_list" style="width: 100%">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="fiileType" label="文件类型"> </el-table-column>
        <el-table-column prop="fileName" label="文件名称">
          <template slot-scope="scope">
            <el-link
              type="primary"
              style=""
              @click="
                enclosureDownload(scope.row.attachmentUuid, scope.row.fileName)
              "
              >{{ scope.row.fileName }}</el-link
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog> -->
  </div>
</template>

<script>
import Pagination from "@WISDOMAUDIT/components/Pagination";
import TeamPersonTask from "@WISDOMAUDIT/views/audit/teamperson-task/index";
import AuditData from "@WISDOMAUDIT/components/workbench/AuditData/index"; //审计资料
import AuditTask from "@WISDOMAUDIT/components/workbench/AuditTask/index"; //审计任务
import Auditproblem from "@WISDOMAUDIT/components/workbench/auditproblem/index"; //审计问题
import Businessindicator from "@WISDOMAUDIT/components/workbench/businessindicator/index"; //经营指标
import AuditReport from "@WISDOMAUDIT/components/workbench/AuditReport/index"; //审计问题
import AuditConfirmation from "@WISDOMAUDIT/views/audit/auditconfirmationform/index";
import { get_userInfo } from "@SDMOBILE/api/shandong/ls";
import {
  projectList,
  projectListByuser,
  thematicAreas,
  setprojectInit,
  attachmentEcho,
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
    AuditConfirmation, //审计确认单
    Pagination,
  },
  data() {
    return {
      defaultActive: "1-1",
      queryInfo: {},
      isdisabled: false,
      key: 0,
      enclosure_details_list: [],
      nearbyDialogVisible: false, //附件详情
      userInfo: {},
      data: [],
      value: [],
      loading: false,
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
      ifmore: false,
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
          peopleTableUuid: "",
        },
        pageNo: 1,
        pageSize: 6,
      },
      queryProjectAll: {
        //初始化项目更多入参
        condition: {
          peopleTableUuid: "",
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
      modelTotal: 0,
      modelQuery: {
        condition: {
          projectId: "",
          modelName: "",
        },
        pageNo: 1,
        pageSize: 10,
      },
      selectauditModelList: {
        auditModelList: [],
        projectId: "",
      },
      project: [],
      fileList: [], //上传的文件
      file: [], //
      Upload_file: [], //上传文件更新id
      edit_file_list: [],
      fileList_Delet: [],
      taskSelf: {
        //创建自建任务传参
        managementProjectUuid: "",
        peopleName: "",
        peopleTableUuid: "",
        taskDescription: "",
        taskName: "",
        belongField: "",
        belongSpcial: "",
        taskType: "2",
        enclosure: "",
        attachmentList: [],
      },
      edittaskSelfForm: {
        managementProjectUuid: "",
        peopleName: "",
        peopleTableUuid: "",
        taskDescription: "",
        taskName: "",
        belongField: "",
        belongSpcial: "",
        taskType: "",
        enclosure: "", //附件
        attachmentList: [], //附件上传入参
      },
      editTaskSelfData: {
        auditTaskUuid: "",
        peopleName: "",
        peopleTableUuid: "",
        taskDescription: "",
        belongField: "",
        belongSpcial: "",
        taskName: "",
        taskType: "2",
        enclosure: "", //附件
        attachmentList: [], //附件上传入参
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
      taskSelfTabSize: [], //自建任务分页
      taskTotal: 0,
      getModelList: {
        condition: {
          managementProjectUuid: "",
          taskName: "",
        },
        pageNo: 1,
        pageSize: 10,
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
      taskSelfTab: [], //自建任务列表
      name: "", //未初始化项目名称
      modelPerson: {
        managementProjectUuid: "",
        peopleName: "",
        peopleTableUuid: "",
        auditTaskUuid: "",
      },
      query: {
        //查询组员入参
        condition: {
          managementProjectUuid: "",
          peopleRole: "",
        },
        pageNo: 1,
        pageSize: 1000,
      },
      queryleader: {
        condition: {
          managementProjectUuid: "",
        },
        pageNo: 1,
        pageSize: 1000,
      },
      updataPerson: {
        projectId: "",
        projectMembershipUuid: "",
        projectMemberships: [],
      },
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
  watch: {
    active_project(val) {
      this.refreash = true; // loading
      let _this = this;
      setTimeout(function name() {
        _this.refreash = false;
      }, 500);
    },
    userRole(val) {
      this.refreash = true; // loading
      let _this = this;
      setTimeout(function name() {
        _this.refreash = false;
      }, 500);
    },
  },

  created() {
    this.get_user();
    // console.log(this.active_project);
  },
  mounted() {
    this.defaultActive = "";
    this.index = "";
    this.queryInfo = this.$route.query;
    if (this.queryInfo.index && this.queryInfo.projectId) {
      // debugger;
      // console.log(this.queryInfo.projectId)
      this.active_project = this.queryInfo.projectId;
      this.defaultActive = this.queryInfo.index;
      this.index = this.queryInfo.index;
      // this.key=Math.random();
      // 更新项目接口
      setprojectInit(this.active_project).then((resp) => {});
    } else {
      this.get_user(true);
    }
    this.getprojectList(this.queryManage);
    this.thematicSelect(this.thematic);
    this.areasSelect(this.areas);
    this.moreProject(this.queryManageAll);
  },
  methods: {
    //获取当前登录人信息
    get_user(ifMounted) {
      get_userInfo().then((resp) => {
        this.userInfo = resp.data;
        this.queryProject.condition.peopleTableUuid =
          this.userInfo.people.userId;
        if (ifMounted) {
          this.defaultActive =
            this.userInfo.userRole == "1" || this.userInfo.userRole == "3"
              ? "1-1"
              : "2-1";
          this.index =
            this.userInfo.userRole == "1" || this.userInfo.userRole == "3"
              ? "1-1"
              : "2-1";
        }
      });
    },
    filterMethod(query, item) {
      if (!query) return true;
      return item.label.indexOf(query) > -1;
    },
    //查询未初始化项目
    getprojectList(data) {
      projectListByuser(data).then((resp) => {
        this.projectNum = resp.data.records;
        // console.log(this.queryProject);
        this.getInitProject(this.queryProject);
        this.project_more();
      });
    },
    // 初始化项目
    getInitProject(data) {
      this.ifshow = true;
      initProject(data).then((resp) => {
        this.projectInit = resp.data.records;
        if (resp.data.records) {
          this.active_project = resp.data.records[0].managementProjectUuid;
        }
        this.ifshow = false;
      });
    },
    open(index) {
      this.defaultActive = index;
      this.index = 0;
      this.index = index;
    },
    look_more() {
      this.project_data = true;
    },
    // 查看更多初始化项目
    project_more() {
      this.queryProjectAll.condition.peopleTableUuid =
        this.userInfo.people.userId;
      initProject(this.queryProjectAll).then((resp) => {
        this.projectInitMore = resp.data.records;
        if (this.projectInitMore.length > 6) {
          this.ifmore = true;
        }
      });
    },
    close() {
      this.project_data = false;
    },
    // 点击初始化项目事件
    look_project(index, item) {
      // console.log(index);
      // console.log(item);
      this.active_project = item.managementProjectUuid; //点击选择添加高亮
      // console.log(this.active_project);
      if (index > 6) {
        this.projectInitMore.splice(index, 1);
        this.projectInitMore.unshift(item);
        this.projectInit.splice(5, 1);
        this.projectInit.unshift(item);
      } else {
        this.projectInitMore.splice(index, 1);
        this.projectInitMore.unshift(item);
        this.projectInit.splice(index, 1);
        this.projectInit.unshift(item);
      }

      // console.log(this.projectInit);

      if (index > 6) {
        this.projectInitUuid =
          this.projectInitMore[index].managementProjectUuid;
        this.project_data = false;
      } else {
        this.projectInitUuid = this.projectInit[index].managementProjectUuid;
        this.project_data = false;
      }
      var that = this;

      // 更新项目接口
      setprojectInit(this.active_project).then((resp) => {
        if (resp.code == 0) {
          that.$forceUpdate();
          that.defaultActive = "";
          that.userInfo.userRole = resp.data.peopleRole;
          that.userInfo.isLiaison = resp.data.isLiaison;
          that.$set(that.userInfo, "userRole", resp.data.peopleRole);
          that.$set(that.userInfo, "isLiaison", resp.data.isLiaison);
          that.defaultActive =
            that.userInfo.userRole == "1" || that.userInfo.userRole == "3"
              ? "1-1"
              : "2-1";
          that.$set(that.$data, "defaultActive", that.defaultActive);
          that.$refs.selfMenu.$attrs.active = that.defaultActive;
          that.index = that.defaultActive;
          that.$set(that.$data, "index", this.index);
          // this.key=Math.random();
        }
      });
    },

    //责任人选择事件
    selectChange(row) {
      // console.log(row);
      this.modelPerson.managementProjectUuid = row.managementProjectUuid;
      this.modelPerson.peopleTableUuid = row.peopleTableUuid;
      this.modelPerson.auditTaskUuid = row.auditTaskUuid;
      for (let i = 0; i < this.tableData.length; i++) {
        if (row.peopleTableUuid == this.tableData[i].peopleTableUuid) {
          this.modelPerson.peopleName = this.tableData[i].peopleName;
        }
      }
      editmodelPerson(this.modelPerson).then((resp) => {
        this.$message.success("设置成功！");
      });
    },

    //调用组员维护组件的第一步第二步弹框事件
    projectClick(index) {
      if (index > 4) {
        this.managementProjectUuid =
          this.projectAll[index].managementProjectUuid;
        this.notInitType = this.projectAll[index].projectType;
        this.name = this.projectAll[index].projectName;
      } else {
        this.managementProjectUuid =
          this.projectNum[index].managementProjectUuid;
        this.notInitType = this.projectNum[index].projectType;
        this.name = this.projectNum[index].projectName;
      }
      // console.log(this.managementProjectUuid);
      this.addDialogVisible = true;
      this.getSelectData(1, 1000);
      // auditModelList(this.modelQuery).then((resp) => {
      //   this.modelTableData = resp.data.records;
      //   this.modelSize = resp.data;
      // });
      // console.log(this.managementProjectUuid);
      this.getTaskSelfList.condition.managementProjectUuid =
        this.managementProjectUuid;
      this.getTaskSelf(this.getTaskSelfList);
      this.drawer = false;

      this.query.condition.managementProjectUuid = this.managementProjectUuid;
    },
    // 更多未初始化项目
    moreProject(data) {
      projectListByuser(data).then((resp) => {
        this.projectAll = resp.data.records;
        // console.log(this.projectAll);
      });
    },
    // 更多按钮

    moreProjectBtn() {
      this.drawer = true;
    },
    // 选择组员事件
    selectMember(val, to, list) {
      // console.log(val, to, list);
      // this.updataPerson.projectId = this.managementProjectUuid;
      // this.updataPerson.projectMemberships = [];
      // for (let i = 0; i < val.length; i++) {
      //   this.updataPerson.projectMemberships.push({
      //     peopleRole: 2,
      //     isLiaison: 0,
      //     managementProjectUuid: this.managementProjectUuid,
      //     peopleTableUuid: val[i],
      //     projectMembershipUuid: val[i].projectMembershipUuid,
      //   });
      // }
      if (to == "left") {
        this.data.forEach((e) => {
          if (list.indexOf(e.key) != -1) {
            e.isLiaison = 2;
          }
        });
      } else {
        this.data.forEach((e) => {
          if (list.indexOf(e.key) != -1) {
            // console.log(e);
            e.isLiaison = 0;
          }
        });
      }
    },
    // 组员查询
    getSelectData(num, size, id) {
      // alert(2)
      this.loading = true;
      getProjectMember(num, size, id).then((resp) => {
        this.personMes = resp.data.list;
        // console.log(this.personMes);

        // console.log(this.value+'');
        this.data = [];
        resp.data.list.forEach((e) => {
          this.data.push({
            key: String(e.id),
            label: e.realName + e.mobile,
            disabled: false,
            isLiaison: 2,
            peopleTableUuid: String(e.id),
          });
        });
        // console.log(resp.data.list);
        this.projectMember(this.query);
        this.loading = false;
      });
    },
    //查询责任人下拉框接口
    leaderSelect(data) {
      projectMembership(data).then((resp) => {
        this.tableData = resp.data.records;
      });
    },

    // 查询已选组员
    projectMember(data) {
      // alert(11)
      projectMembership(data).then((resp) => {
        console.log(resp);
        this.peopleSelection = resp.data.records;
        this.tableData = resp.data.records;
        // console.log(this.peopleSelection);
        this.value = [];
        this.peopleSelection.forEach((e) => {
          if (e.isCanDelete == 0) {
            for (let j = 0; j < this.data.length; j++) {
              if (this.data[j].key == e.peopleTableUuid) {
                this.data[j].disabled = true;
                this.data[j].projectMembershipUuid = e.projectMembershipUuid;
              }
            }
          }
          for (let k = 0; k < this.data.length; k++) {
            if (e.isLiaison == 0 && this.data[k].key == e.peopleTableUuid) {
              this.data[k].isLiaison = 0;
            }
            if (e.isLiaison == 1 && this.data[k].key == e.peopleTableUuid) {
              this.data[k].isLiaison = 1;
              this.data[k].disabled = true;
            }
          }
          this.value.push(e.peopleTableUuid);
          console.log(this.value);
        });
      });
    },
    //查询责任人列表

    addDialogClosed() {
      this.$router.go(0);
    },

    //设为接口人事件
    isLiaison_Btn(row, list) {
      console.log(row);
      console.log(list);
      let leader = {};
      this.peopleSelection.forEach((a) => {
        if (a.peopleRole == 1) {
          leader = a;
        }
      });
      console.log(leader);
      // && item.key != leader.peopleTableUuid
      this.data.forEach((item) => {
        if (list.indexOf(item.key) != -1) {
          if (item.key == leader.peopleTableUuid) {
            item.isLiaison = 0;
            item.disabled = true;
          } else {
            item.isLiaison = 0;
            item.disabled = false;
          }
        }
      });
      row.isLiaison = 1;
      row.disabled = true;
    },
    //取消设为接口人
    cancel_Btn(row) {
      console.log(row);
      console.log(this.peopleSelection);
      // alert(123)
      row.isLiaison = 0;
      this.peopleSelection.forEach((a) => {
        if (a.peopleTableUuid == row.key && a.peopleRole == 1) {
          row.disabled = true;
        } else {
          row.disabled = false;
        }
      });
      // row.disabled = true;
    },
    // 下一步按钮事件
    nextBtn() {
      var selectedPeople = [];
      console.log(this.data);
      // console.log(this.value);
      console.log(this.peopleSelection);
      this.data.forEach((item) => {
        if (this.value.indexOf(item.key) != -1) {
          // this.peopleSelection.forEach((a)=>{
          //   if(a.peopleTableUuid == item.key && a.peopleRole == 1){
          //      item.peopleRole = 1;
          //   }else{
          //      item.peopleRole = 2;
          //   }
          // })
          item.managementProjectUuid = this.managementProjectUuid;
          item.peopleRole = 2;
          // item.peopleTableUuid=this.key;
          selectedPeople.push(item);
        }
      });
      console.log(selectedPeople);
      let next = 0;
      selectedPeople.forEach((item) => {
        if (item.isLiaison == 1) {
          next = 1;
        }
      });
      if (next == 1) {
        this.step = 2;
        this.updataPerson.projectId = this.managementProjectUuid;

        this.updataPerson.projectMemberships = selectedPeople;
        console.log(this.updataPerson);
        //下一步 保存组员
        editprojectMembershipList(this.updataPerson).then((resp) => {
          this.queryleader.condition.managementProjectUuid =
            this.managementProjectUuid;
          this.leaderSelect(this.queryleader);
        });

        this.getModelList.condition.managementProjectUuid =
          this.managementProjectUuid;
        this.getauditModelList(this.getModelList);
      } else {
        this.$message.info("请设置接口人！");
      }
    },
    //删除任务按钮事件
    deleteModel(row) {
      this.$confirm("你将删除此任务分配", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "放弃删除",
      })
        .then(() => {
          deletmodelTask(row.auditTaskUuid).then((resp) => {
            // 为了在删除最后一页的最后一条数据时能成功跳转回最后一页的上一页
            const totalPage = Math.ceil(
              (this.taskTotal - 1) / this.getModelList.pageSize
            ); // 总页数
            this.getModelList.pageNo =
              this.getModelList.pageNo > totalPage
                ? totalPage
                : this.getModelList.pageNo;
            this.getModelList.pageNo =
              this.getModelList.pageNo < 1 ? 1 : this.getModelList.pageNo;
            this.getModelList.condition.managementProjectUuid =
              this.managementProjectUuid;
            // console.log(this.getModelList);
            this.getauditModelList(this.getModelList);
          });
        })
        .catch((action) => {
          // this.$message({
          //   type: "info",
          //   message: action === "cancel" ? "放弃删除并离开页面" : "删除成功！",
          // });
        });
    },
    prevoius() {
      this.step = 1;
      this.getSelectData(1, 1000); //左侧
      // this.projectMember(this.query);//右侧
    },
    // 模糊查询引入模型名称
    queryModelInput() {
      let query = {
        condition: {
          modelName: this.modelQuery.condition.modelName,
          projectId: this.managementProjectUuid,
        },
        pageNo: 1,
        pageSize: 10,
      };
      this.getauditModelListSql(query);
    },
    queryModel() {
      this.modelQuery.condition.modelName = "";
      this.getauditModelListSql(this.modelQuery);
    },
    // 导入模型列表渲染
    getauditModelListSql(data) {
      auditModelList(data).then((resp) => {
        this.modelTableData = resp.data.records;
        this.modelTotal = resp.data.total;
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
        this.modelSize = resp.data;
      });
    },
    // 模型选择事件
    handleSelectionChangeModel(val) {
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
    },
    // 自建任务责任人下拉框事件
    selectChangePerson(val) {
      console.log(val);
      // console.log(this.tableData);
      this.taskSelf.peopleTableUuid = val;
      this.edittaskSelfForm.peopleTableUuid = val;
      for (let i = 0; i < this.tableData.length; i++) {
        if (val == this.tableData[i].peopleTableUuid) {
          this.taskSelf.peopleName = this.tableData[i].peopleName;
          this.edittaskSelfForm.peopleName = this.tableData[i].peopleName;
        }
      }
    },
    selectChangenumber(val) {
      // console.log(val);
      // this.changePerson.peopleTableUuid = val.peopleTableUuid;
      // for (let i = 0; i < this.tableData.length; i++) {
      //   if (val.peopleTableUuid == this.tableData[i].peopleTableUuid) {
      //     this.changePerson.peopleName = this.tableData[i].peopleName;
      //   }
      // }
      // this.changePerson.managementProjectUuid = this.managementProjectUuid;
      // this.changePerson.auditTaskUuid = val.auditTaskUuid;
      // editmodelPerson(this.changePerson).then((resp) => {
      // });
    },

    //  完成按钮
    saveBtn() {
      this.projectCode.managementProjectUuid = this.managementProjectUuid;
      // this.projectCode.projectType = this.notInitType;
      editProjectCode(this.projectCode).then((resp) => {
        this.$message.success("初始化项目完成！");
      });

      setInterval(() => {
        this.$router.go(0);
      }, 1000);
    },
    // 增加模型任务按钮事件
    selectModel() {
      this.addDialogVisible = false;
      this.modelDialog = true;
      for (let i = 0; i < this.modelTableData.length; i++) {
        this.$refs.multipleModelRef.toggleRowSelection(
          this.modelTableData[i],
          false
        );
      }
      this.modelQuery.condition.projectId = this.managementProjectUuid;
      this.getauditModelListSql(this.modelQuery);
    },
    // 未初始化弹框关闭事件
    addClosed() {
      this.step = 1;
      this.addDialogVisible = false;
      this.data = this.personMes;
      this.value = [];
    },
    // 新增模型任务弹框取消按钮
    res() {
      this.modelDialog = false;
      this.addDialogVisible = true;
    },
    // 新增自建任务弹框取消按钮
    TaskSelf_res() {
      this.taskSelfDialogVisible = false;
      this.taskSelf = {};
      this.addDialogVisible = true;
    },
    // 新增自建任务弹框关闭事件
    TaskDialogClosed() {
      this.taskSelf = {};
      this.taskSelfDialogVisible = false;
      this.addDialogVisible = true;
    },
    // 新增自建任务弹框关闭事件
    MedolDialogClosed() {
      this.modelDialog = false;
      this.addDialogVisible = true;
    },
    getRowKey(row) {
      return row.auditModelUuid;
    },
    // 分页模糊查询模型列表
    queryNameInput() {
      let query = {
        condition: {
          taskName: this.getModelList.condition.taskName,
          managementProjectUuid: this.managementProjectUuid,
        },
        pageNo: 1,
        pageSize: 10,
      };
      this.getauditModelList(query);
    },
    queryName() {
      this.getModelList.condition.taskName = "";
      this.getauditModelList(this.getModelList);
    },
    // 分页模糊查询模型列表
    // queryName() {
    //   this.getauditModelList(this.getModelList);
    // },
    // 模型列表渲染
    getauditModelList(data) {
      modelTaskList(data).then((resp) => {
        this.modelListTab = resp.data.records;
        this.modelListTabSize = resp.data;
        this.taskTotal = resp.data.total;

        // console.log(this.modelListTab);
      });
    },
    // 模型引入
    modelInfo() {
      // console.log(this.selectauditModelList);

      if (this.selectauditModelList.auditModelList.length > 0) {
        this.isdisabled = true;
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
        setTimeout(() => {
          this.isdisabled = false;
        }, 3000);
      } else {
        this.$message.info("请选择要引入的模型!");
      }
    },
    // 模型列表分页事件
    handleCurrentChangeModelTab(val) {
      let getModelList = {
        condition: {
          managementProjectUuid: this.managementProjectUuid,
        },
        pageNo: val,
        pageSize: 5,
      };
      this.getauditModelList(getModelList);
    },
    // 新增自建任务
    addTaskSelf() {
      this.addDialogVisible = false;
      this.taskSelfDialogVisible = true;
    },
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
    // 确定自建任务
    taskSelfInfo(selfTaskRef) {
      this.$refs[selfTaskRef].validate((valid) => {
        if (valid) {
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
                this.Upload_file = resp.data.data;
                loading.close();

                //新增自建任务接口
                this.taskSelf.attachmentList = this.Upload_file;
                this.taskSelf.managementProjectUuid =
                  this.managementProjectUuid;
                this.taskSelf.taskType = 2;
                selfTaskFunction(this.taskSelf).then((resp) => {
                  this.$message.success("自建任务创建成功！");
                  this.taskSelfDialogVisible = false;
                  this.addDialogVisible = true;
                  this.getModelList.condition.managementProjectUuid =
                    this.managementProjectUuid;
                  // console.log(this.getModelList);
                  this.getauditModelList(this.getModelList);
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
            this.isdisabled = true;
            this.taskSelf.taskType = 2;
            this.taskSelf.managementProjectUuid = this.managementProjectUuid;
            selfTaskFunction(this.taskSelf).then((resp) => {
              this.$message.success("自建任务创建成功！");
              this.taskSelfDialogVisible = false;
              this.addDialogVisible = true;
              this.getModelList.condition.managementProjectUuid =
                this.managementProjectUuid;
              // console.log(this.getModelList);
              this.getauditModelList(this.getModelList);
            });

            setTimeout(() => {
              this.isdisabled = false;
            }, 3000);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 自建任务列表渲染
    getTaskSelf(data) {
      modelTaskList(data).then((resp) => {
        this.taskSelfTab = resp.data.records;
        this.taskSelfTabSize = resp.data;
      });
    },
    // 编辑自建按钮
    edit_data(row) {
      this.edit_file_list = [];
      this.Upload_file = [];
      this.fileList_Delet = [];
      this.editTaskSelfDialogVisible = true;
      editTaskSelf(row.auditTaskUuid).then((resp) => {
        this.edittaskSelfForm = resp.data;
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
    // 自建任务编辑完成按钮
    edittaskSelfSave() {
      // console.log(this.fileList);
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
            this.edittaskSelfForm.attachmentList = upList;
            this.edittaskSelfForm.managementProjectUuid =
              this.managementProjectUuid;
            editTaskSelfInfo(this.edittaskSelfForm).then((resp) => {
              if (resp.code == 0) {
                this.$message.success("修改自建任务成功！");
                this.editTaskSelfDialogVisible = false;
                this.addDialogVisible = true;
                this.getModelList.condition.managementProjectUuid =
                  this.managementProjectUuid;
                this.getauditModelList(this.getModelList);
              }
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
        this.isdisabled = true;
        var upList = this.edit_file_list.concat(this.fileList_Delet);
        this.edittaskSelfForm.attachmentList = upList;
        this.edittaskSelfForm.managementProjectUuid =
          this.managementProjectUuid;
        editTaskSelfInfo(this.edittaskSelfForm).then((resp) => {
          if (resp.code == 0) {
            this.$message.success("修改自建任务成功！");
            this.editTaskSelfDialogVisible = false;
          }
        });

        this.addDialogVisible = true;
        this.getModelList.condition.managementProjectUuid =
          this.managementProjectUuid;
        this.getauditModelList(this.getModelList);
        setTimeout(() => {
          this.isdisabled = false;
        }, 3000);
      }
    },
    // 自建任务删除
    delete_zj(id) {
      deletmodelTask(id).then((resp) => {
        // console.log(this.managementProjectUuid);
        this.getTaskSelfList.condition.managementProjectUuid =
          this.managementProjectUuid;
        this.getTaskSelf(this.getTaskSelfList);
      });
    },
    //步骤关闭事件
    addDialogVisibleRes() {
      this.addDialogVisible = false;
      this.data = this.personMes;
      this.value = [];
    },
    resetForm2(resetForm2) {
      this.$refs[resetForm2].resetFields();
      this.fileList = [];
    },
    editResetForm2(ref) {
      this.$refs[ref].resetFields();
      this.fileList = [];
    },
    //新增自建任务上传附件
    handleChangePic(file, fileList) {
      this.fileList = fileList;
      this.file = file.raw;
    },
    // 附件下载
    enclosureDownload(id, name) {
      const fileName = name.split(".")[0];
      let formData = new FormData();
      formData.append("fileId", id);
      this.$axios({
        method: "post",
        url: "/wisdomaudit/auditPreviousDemandData/downloadByFileId",
        data: formData,
        responseType: "blob",
      })
        .then((res) => {
          const content = res.data;
          // console.log(res);
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
          // console.log(err);
        });
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
            // this.$message("暂无上传的附件");
            return false;
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
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/css/lhg.css";
::v-deep.el-menu .el-submenu__title {
  padding: 0 !important;
}
// 二级导航 穿透样式
// 选中高亮
::v-deep.el-menu .el-submenu__title span {
  margin-left: 20px;
  // padding-left: 20px !important;
}
::v-deep.el-menu .el-menu-item,
::v-deep.el-menu .el-submenu__title {
  position: relative;
  font-size: 12px;
  height: 40px !important;
  line-height: 40px !important;
}
::v-deep.el-menu .el-menu-item {
  height: 45px !important;
  line-height: 45px !important;
}
::v-deep.el-menu .el-menu-item-group__title {
  display: none;
  padding: 0 !important;
}
// 新增高亮样式
::v-deep.el-menu .el-menu-item span {
  width: 5px;
  height: 20px;
  background-color: #0e87d6;
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
  margin-top: -1%;
  padding: 1%;
  .title1 {
    font-weight: 700;
    font-size: 15px;
    // border-bottom: 1px solid #d2d2d2;
    padding: 10px;
  }
}
// 未初始化项目
.projectInit {
  // border: 1px solid red;
  // display: none;
  min-height: 100px;
  margin-bottom: 3%;
  // display: flex;
  align-items: center;
  li {
    width: 22%;
    max-width: 22%;
    font-size: 0.1vw;
    border-radius: 10px;
    float: left;
    margin-right: 0.5%;
    padding: 1%;
    border: 3px solid #ebf0f6;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      box-shadow: 0 2px 10px 5px rgba(0, 0, 0, 0.05);
    }
  }
  .moreBtn {
    padding: 0.5%;
    border-radius: 5px;
    border: 2px solid #ebf0f6;
    line-height: 100px;
    &:hover {
      box-shadow: 0 2px 10px 5px rgba(0, 0, 0, 0.05);
    }
  }
}
.initializeProject {
  margin: 0% 1% 1% 0;
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
      font-size: 14px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      font-size: 13px;
      &:hover {
        box-shadow: 0 2px 10px 5px rgba(0, 0, 0, 0.05);
        // border: 1px solid #ebf0f6;
        text-overflow: inherit;
        overflow: visible;
        white-space: pre-line;
      }
    }
    span {
      color: #12579a;
      margin: 0 10px;
      min-width: 80px;
      box-sizing: border-box;
      cursor: pointer;
      padding: 0.5%;
      border-radius: 5px;
      border: 2px solid #ebf0f6;
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
    overflow-x: hidden;
  }
  .routerView {
    // border: 1px solid red;
    padding: 0 10px;
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
      position: absolute;
      right: -300px;
      top: 0;
      height: 100%;
      position: fixed;
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
  background:#0c87d6;
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
  border-color: #0c87d6 transparent #0c87d6 transparent;
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
  margin-left: 11%;
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
  background: #0c87d6;
}
.auditStepTwoN div {
  width: 70%;
  height: 50px;
  vertical-align: text-bottom;
  font-size: 0.7vw;
  color: #000;
  line-height: 50px;
  text-align: right;
  margin-left: 11%;
  overflow: hidden;
}

.auditStepTwoN span:nth-of-type(1) {
  border-width: 25px 0 25px 25px;
  border-style: solid;
  border-color: transparent transparent transparent #0c87d6;
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
.temBtn {
  width: 100%;
  // border: 1px solid red;
  margin-top: 2%;
  margin-bottom: 1%;
  text-align: center;
}
.stepBtn {
  //  border: 1px solid red;
  margin-top: 2%;
  margin-bottom: 1%;
  text-align: center;
}
.addAudit .nextBtn {
  background: #0c87d6 !important;
  color: #fff;
}
.addPerson .nextBtn {
  background: #0c87d6 !important;
  color: #fff;
}

.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
.addPerson {
  padding: 1%;
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
  margin: 20px auto;
  // border: 1px solid red;
}
.selfTask .el-form-item__error {
  top: -58%;
  left: 279px;
}
.selfTask .el-input {
  position: relative;
  top: -35px;
  width: 100%;
}
.selfTask .el-select {
  position: relative;
  top: -35px;
  width: 100%;
}
.selfTask >>> .el-textarea__inner {
  width: 100%;
}
.selfTask .el-form-item {
  // margin-bottom: -10px !important;
}
.upload-demo {
  margin-top: -35px;
}
.initProjectItem {
  background-color: #f4faff;
  color: #a1a5b9;
}
.el-transfer {
  // border: 1px solid red;
  // text-align: center;
  margin-top: 1%;
  margin-left: 5%;
}
.setinterPerson {
  width: 200px;
  // border: 1px solid red;
  position: relative;
  .setinterPersonBtn {
    position: absolute;
    right: 0;
    color: #8492a6;
    font-size: 13px;
    cursor: pointer;
  }
}
</style>
<style scoped>
>>> .el-input__inner::-webkit-input-placeholder {
  color: #c0c4cc !important;
}
.dialogTitle {
  /* border: 1px solid red; */
  padding: 10px;
  font-weight: bolder;
  color: #000;
  font-size: 14px;
  margin-bottom: 1%;
  border-bottom: 1px solid #d2d2d2;
  text-align: center;
}
/deep/ .el-drawer__open .el-drawer.rtl {
  width: 21%;
}
.active_class {
  background: rgb(12, 135, 214) !important;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s;
}
.active_class:hover {
  box-shadow: 0 2px 10px 5px rgb(12, 135, 214, 0.5) !important;
  border: 1px solid rgb(12, 135, 214, 1) !important;
}
.peojectMessage {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
.projectName {
  font-weight: 500;
  font-size: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.peojectMessage:hover {
  text-overflow: inherit;
  overflow: visible;
  white-space: pre-line;
}
.textOver {
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
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
.el-transfer /deep/ .el-transfer-panel {
  width: 35%;
}
.selfTask /deep/ .el-form-item__error {
  position: absolute;
  top: -70%;
  left: 35%;
}
>>> .el-input.is-disabled .el-input__inner {
  background: #f5f7fa !important;
  color: #c0c4cc !important;
}
/deep/ .el-upload-dragger {
  width: 100% !important;
}
>>> .el-upload {
  width: 80% !important;
}
>>> .el-dialog__body {
  padding: 5px 0 !important;
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
/* .textOver {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  font-size: 13px;
}
.textOver:hover {
  text-overflow: inherit;
  overflow: visible;
  white-space: pre-line;
} */
.projectWorkbench >>> .el-table__header {
  border-top: none !important;
}
.addPerson >>>  .el-button--primary{
  background:#0c87d6 !important;
}
</style>
