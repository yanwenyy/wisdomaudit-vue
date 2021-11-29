<template>
  <!-- 项目管理列表 -->
  <div class="projectmanagement">
    <el-row>
      <el-col :span="18">
        <!-- 添加按钮 -->
        <el-button class="queryBtn" @click="addProject_s()">新增项目</el-button>
      </el-col>
      <!-- <el-col :span="4" > -->
      <div class="search">
        <el-input
          placeholder="请输入项目名称"
          v-model="query.condition.projectName"
          @keyup.enter.native="queryName"
        >
          <!-- <el-button
            class="queryBtn"
            slot="append"
            type="primary"
            icon="el-icon-search"
            @click="queryName"
          ></el-button> -->
        </el-input>
        <div
          class="search_icon"
          style="background: #0c87d6 !important"
          @click="queryName"
        >
          <i class="el-icon-search" style="color: white"></i>
        </div>
      </div>

      <!-- </el-col> -->
      <!-- <el-col :span="2">
        <el-button
          style="margin-left: 10%; border: 1px solid #ebeef2"
          @click="queryName"
          >筛选</el-button
        >
      </el-col> -->
    </el-row>

    <!-- 项目管理列表 -->
    <el-table
      v-loading="projectTableLoading"
      class="table"
      :data="tableData"
      style="margin-top: 1%; width: 100%; min-height: 400px"
      border
      stripe
      fit
      @selection-change="handleSelectionChange_list"
      :header-cell-style="{ 'background-color': '#F4FAFF' }"
    >
      <el-table-column type="selection" width="40"> </el-table-column>
      <!-- <el-table-column
        align="center"
        prop="projectCode"
        width="105"
        label="项目编号"
        show-overflow-tooltip
      >
      </el-table-column> -->
      <el-table-column
        min-width="130px"
        align="left"
        prop="projectName"
        label="审计项目名称"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        align="left"
        min-width="90px"
        prop="auditOrgName"
        label="被审计单位"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        align="left"
        prop="projectTypeName"
        label="项目类型"
        show-overflow-tooltip
      >
      </el-table-column>
      <!-- <el-table-column
        align="center"
        prop="specialName"
        label="专题"
        show-overflow-tooltip
      ></el-table-column> -->
      <el-table-column
        align="left"
        prop="fieldName"
        label="领域"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="left"
        min-width="90px"
        prop="projectLeaderName"
        label="项目负责人"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        align="left"
        prop="projectChargemanName"
        label="项目组长"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="auditStartData"
        align="left"
        label="审计期间"
        show-overflow-tooltip
        min-width="130px"
      >
        <template slot-scope="scope">
          {{ scope.row.auditStartData }} 至 {{ scope.row.auditFinishData }}
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        prop="createUserName"
        label="创建人"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        align="left"
        prop="createTime"
        label="创建日期"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.createTime | filtedate }}
        </template>
      </el-table-column>

      <el-table-column
        align="left"
        prop="managementAdvice"
        label="是否启动整改"
        show-overflow-tooltip
        min-width="110px"
      >
        <template slot-scope="scope">
          {{
            scope.row.managementAdvice == 0
              ? "否"
              : scope.row.managementAdvice == 1
              ? "是"
              : ""
          }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            type="text"
            style="color: #0c87d6; background: none; border: 0; font-size: 14px"
            size="small"
            @click="editDialog(scope.row)"
          >
            编辑
          </el-button>

          <el-button
            type="text"
            v-if="scope.row.auditConf == 1"
            style="color: #0c87d6; background: none; border: 0; font-size: 14px"
            size="small"
            @click="confirm_problem(scope.row.managementProjectUuid)"
          >
            确认整改问题清单
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  启动整改 -->
    <div class="setting_people">
      <el-button
        style="color: #fff; background: #0c87d6; border: 0"
        @click="run_rectification()"
        >启动整改</el-button
      >
    </div>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="query.pageNo"
      :limit.sync="query.pageSize"
      @pagination="queryName"
    />
    <!-- 分页 -->
    <!-- <div class="page">
      <el-pagination
        background
        :hide-on-single-page="false"
        layout="prev, pager, next"
        :page-sizes="[2, 4, 6, 8]"
        :current-page="project.current"
        @current-change="handleCurrentChangeProject"
        :page-size="project.size"
        :total="project.total"
      ></el-pagination>
    </div> -->
    <!-- 分页 end-->

    <!-- 新增页面 -->
    <el-dialog
      :visible.sync="addDialogVisible"
      width="47%"
      @close="addDialogClosed()"
    >
      <div class="title">新增项目</div>
      <!-- 新增专项以及其他的页面 -->
      <div class="addzhuanForm" v-if="prjType == 1">
        <el-form
          label-width="100px"
          :model="addProjectManagement"
          :rules="addzhuanRules"
          ref="addProjectManagement"
          label-position="right"
          hide-required-asterisk
        >
          <el-row>
            <el-form-item label="ㅤ项目编号:" prop="projectCode">
              <el-input
                placeholder=""
                v-model="addProjectManagement.projectCode"
                disabled
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目类型:" prop="projectTypeName">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.projectTypeName"
                :label-in-value="true"
                @change="selectprojectType"
                filterable
              >
                <el-option
                  v-for="item in projectTypeoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目名称:" prop="projectName">
              <el-input
                placeholder="请输入"
                v-model="addProjectManagement.projectName"
              >
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目负责人:" prop="projectLeaderName">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.projectLeaderName"
                @change="selectprojectLeader"
                filterable
              >
                <el-option
                  v-for="item in projectpeopleoptions"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <!-- <el-row>
            <el-form-item label="ㅤㅤㅤ专题:"
                          prop="specialName">
              <el-select placeholder="请选择"
                         v-model="addProjectManagement.specialName"
                         @change="selectSpecia"
                         filterable>
                <el-option v-for="item in thematicOption"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row> -->
          <el-row>
            <el-form-item label="ㅤㅤㅤ领域:" prop="field">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.field"
                value-key="addProjectManagement.field"
                @change="selectField"
                multiple
                filterable
              >
                <el-option
                  v-for="item in areasOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ审计期间:" class="zhuandataTime">
              <el-col :span="8">
                <el-form-item prop="auditStartData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addProjectManagement.auditStartData"
                    :picker-options="startPickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="auditFinishData" style="margin-left: -5px">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addProjectManagement.auditFinishData"
                    style="margin-left: 5px"
                    :picker-options="endPickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-col :span="15">
              <el-form-item label="ㅤ设置组长:">&nbsp;&nbsp;</el-form-item>
            </el-col>
          </el-row>
          <el-table
            :data="addProjectManagement.auditList"
            style="width: 100%"
            border
            class="projectTable"
            :header-cell-style="{ 'background-color': '#F4FAFF' }"
          >
            <el-table-column label="项目编号" prop="projectCode" width="150px">
            </el-table-column>
            <el-table-column prop="auditOrgName" label="被审计单位">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'auditList.' + scope.$index + '.auditOrgName'"
                  :rules='addzhuanRules.auditOrgName'
                >
                  <el-select
                    style="width: 120%"
                    placeholder="请选择"
                    v-model="scope.row.auditOrgUuid"
                    @change="orgSelect(scope.row)"
                  >
                    <el-option
                      v-for="item in loadaudittorgoptions"
                      :key="item.auditOrgUuid"
                      :label="item.orgName"
                      :value="item.auditOrgUuid"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- <el-table-column label="角色" width="60">组长 </el-table-column> -->
            <el-table-column prop="projectChargemanName" label="分配组长">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'auditList.' + scope.$index + '.projectChargemanName'"
                  :rules="addzhuanRules.projectChargemanName"
                >
                  <el-select
                    style="width: 120%"
                    placeholder="请选择"
                    v-model="scope.row.projectChargemanID"
                    @change="LeaderSelect(scope.row)"
                  >
                    <el-option
                      v-for="item in projectpeopleoptions"
                      :key="item.id"
                      :label="item.realName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  style="color: #db454b; background: none; border: 0"
                  size="small"
                  @click.native.prevent="
                    deleteRow(scope.$index, addProjectManagement.auditList)
                  "
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="addIcon" :disabled="isDisable" @click="addData">
            <i class="el-icon-plus"></i>
            <span>新增</span>
          </div>
        </el-form>

        <div class="addzhuanBtn">
          <el-button @click="addDialogVisible = false" class="cancel"
            >取消</el-button
          >
          <el-button class="nextBtn" :disabled="isDisable" @click="addSave()"
            >确认</el-button
          >
        </div>
      </div>
      <!-- 新增经责的页面 -->
      <div class="addForm" v-if="prjType == 2">
        <el-form
          label-width="100px"
          :model="addprojectjing"
          ref="addprojectjing"
          :rules="addprojectjingRules"
          hide-required-asterisk
        >
          <el-row>
            <el-form-item label="ㅤ项目编号:" prop="projectCode">
              <el-input
                placeholder=""
                v-model="addprojectjing.projectCode"
                disabled
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目类型:" prop="projectTypeName">
              <el-select
                placeholder="请选择"
                v-model="addprojectjing.projectTypeName"
                :label-in-value="true"
                @change="selectprojectType"
                filterable
              >
                <el-option
                  v-for="item in projectTypeoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="被审计单位:" prop="auditOrgName">
              <el-select
                placeholder="请选择"
                v-model="addprojectjing.auditOrgName"
                @change="selectorg"
                filterable
              >
                <el-option
                  v-for="item in loadaudittorgoptions"
                  :key="item.auditOrgUuid"
                  :label="item.orgName"
                  :value="item.auditOrgUuid"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="被审计领导:" prop="auditOrgLeader">
              <el-input
                placeholder="请输入"
                v-model="addprojectjing.auditOrgLeader"
              >
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目名称:" prop="projectName">
              <el-input
                placeholder="请输入"
                v-model="addprojectjing.projectName"
              >
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目负责人:" prop="projectLeaderName">
              <el-select
                placeholder="请选择"
                v-model="addprojectjing.projectLeaderName"
                @change="selectprojectLeader"
                filterable
              >
                <el-option
                  v-for="item in projectpeopleoptions"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <!-- <el-row>
            <el-form-item label="ㅤㅤㅤ专题:" prop="specialName">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.specialName"
                @change="selectSpecia"
                filterable
              >
                <el-option
                  v-for="item in thematicOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤㅤㅤ领域:" prop="fieldName">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.fieldName"
                @change="selectField"
                filterable
              >
                <el-option
                  v-for="item in areasOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row> -->

          <el-row>
            <el-form-item label="ㅤ项目组长:" prop="projectChargemanName">
              <el-select
                placeholder="请选择"
                v-model="addprojectjing.projectChargemanName"
                @change="selectChargeman"
                filterable
              >
                <el-option
                  v-for="item in projectpeopleoptions"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ审计期间:" class="dataTime" required>
              <el-col :span="8">
                <!-- @change="changStartTime" -->
                <el-form-item prop="auditStartData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addprojectjing.auditStartData"
                    :picker-options="startPickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <!-- :disabled="isdisabled" -->
              <el-col :span="8" style="margin-left: -5px">
                <el-form-item prop="auditFinishData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addprojectjing.auditFinishData"
                    style="margin-left: 3px"
                    :picker-options="endPickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-row>
          <!-- <el-row>
            <el-form-item label="地市接口人:" prop="areaUserName">
              <el-input
                placeholder="请输入"
                v-model="addprojectjing.areaUserName"
              >
              </el-input>
            </el-form-item>
          </el-row> -->
        </el-form>
        <div class="stepBtn">
          <el-button @click="addDialogVisible = false" class="cancel"
            >取消</el-button
          >
          <el-button
            class="nextBtn"
            :disabled="isDisable"
            @click="nextBtn('addProjectManagement')"
            >确认</el-button
          >
        </div>
      </div>
    </el-dialog>

    <!-- 编辑项目 -->
    <el-dialog
      :visible.sync="editDialogVisible"
      @close="editDialogClosed()"
      width="50%"
    >
      <div class="title">编辑项目</div>
      <!-- 专项 -->
      <div class="addzhuanForm" v-if="prjType == 1">
        <el-form
          label-width="100px"
          :model="addProjectManagement"
          hide-required-asterisk
        >
          <el-row>
            <el-form-item label="ㅤ项目编号:" prop="projectCode">
              <el-input
                placeholder=""
                v-model="addProjectManagement.projectCode"
                disabled
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目类型:" prop="projectTypeName">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.projectTypeName"
                :label-in-value="true"
                @change="selectprojectType"
                disabled
              >
                <el-option
                  v-for="item in projectTypeoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label="ㅤ项目名称:"
              :rules="[
                {
                  required: true,
                  message: '请输入项目名称',
                  trigger: 'change',
                },
              ]"
            >
              <el-input
                placeholder="请输入"
                v-model="addProjectManagement.projectName"
              >
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目负责人:" prop="projectLeaderName">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.projectLeaderName"
                @change="selectprojectLeader"
              >
                <el-option
                  v-for="item in projectpeopleoptions"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <!-- <el-row>
            <el-form-item label="ㅤㅤㅤ专题:"
                          prop="specialName">
              <el-select placeholder="请选择"
                         v-model="addProjectManagement.specialName"
                         @change="selectSpecia">
                <el-option v-for="item in thematicOption"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row> -->
          <el-row>
            <el-form-item label="ㅤㅤㅤ领域:" prop="field">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.field"
                @change="selectField"
                multiple
                filterable
              >
                <el-option
                  v-for="item in areasOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ审计期间:" class="zhuandataTime">
              <el-col :span="8">
                <el-form-item prop="auditStartData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addProjectManagement.auditStartData"
                    :picker-options="startPickerOptions"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="auditFinishData" style="margin-left: -5px">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addProjectManagement.auditFinishData"
                    style="margin-left: 5px"
                    :picker-options="endPickerOptions"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-col :span="15">
              <el-form-item label="ㅤ设置组长:">&nbsp;&nbsp;</el-form-item>
            </el-col>
            <el-table
              :data="addProjectManagement.auditList"
              style="width: 100%"
              border
              class="projectTable"
              :header-cell-style="{ 'background-color': '#F4FAFF' }"
            >
              <el-table-column label="项目编号" prop="projectCode" width="160">
              </el-table-column>
              <el-table-column prop="auditOrgName" label="被审计单位">
                <template slot-scope="scope">
                  <el-form-item prop="auditOrgName">
                    <el-select
                      style="width: 120%"
                      placeholder="请选择"
                      v-model="scope.row.auditOrgUuid"
                      @change="orgSelect(scope.row)"
                    >
                      <el-option
                        v-for="item in loadaudittorgoptions"
                        :key="item.auditOrgUuid"
                        :label="item.orgName"
                        :value="item.auditOrgUuid"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="projectChargemanName" label="设置组长">
                <template slot-scope="scope">
                  <el-form-item prop="projectChargemanName">
                    <el-select
                      style="width: 120%"
                      placeholder="请选择"
                      v-model="scope.row.projectChargemanName"
                      @change="LeaderSelectEdit(scope.row)"
                      :disabled="setLeaderDisable"
                    >
                      <el-option
                        v-for="item in projectpeopleoptions"
                        :key="item.id"
                        :label="item.realName"
                        :value="item.realName"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    style="color: #db454b; background: none; border: 0"
                    size="small"
                    @click.native.prevent="
                      deleteProjectrow(
                        scope.$index,
                        addProjectManagement.auditList,
                        scope.row
                      )
                    "
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="addIcon" @click="addData">
              <i class="el-icon-plus"></i>
              <span>新增</span>
            </div>
          </el-row>
        </el-form>

        <div class="addzhuanBtn">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button
            class="nextBtn"
            :disabled="isDisable"
            @click="editBtn('addProjectManagement')"
            >确认</el-button
          >
        </div>
      </div>
      <!-- 编辑经责 -->
      <div class="addForm" v-if="prjType == 2">
        <el-form
          label-width="100px"
          :model="addprojectjing"
          hide-required-asterisk
        >
          <el-row>
            <el-form-item label="ㅤ项目编号:" prop="projectCode">
              <el-input
                placeholder=""
                v-model="addprojectjing.projectCode"
                disabled
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目类型:">
              <el-select
                placeholder="请选择"
                v-model="addprojectjing.projectTypeName"
                :label-in-value="true"
                @change="selectprojectType"
                disabled
              >
                <el-option
                  v-for="item in projectTypeoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="被审计单位:" prop="auditOrgName">
              <el-select
                placeholder="请选择"
                v-model="addprojectjing.auditOrgName"
                @change="selectorg"
              >
                <el-option
                  v-for="item in loadaudittorgoptions"
                  :key="item.auditOrgUuid"
                  :label="item.orgName"
                  :value="item.auditOrgUuid"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="被审计领导:" prop="auditOrgLeader">
              <el-input
                placeholder="请输入"
                v-model="addprojectjing.auditOrgLeader"
              >
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目名称:" prop="projectName">
              <el-input
                placeholder="请输入"
                v-model="addprojectjing.projectName"
              >
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目负责人:" prop="projectLeaderName">
              <el-select
                placeholder="请选择"
                v-model="addprojectjing.projectLeaderName"
                @change="selectprojectLeader"
              >
                <el-option
                  v-for="item in projectpeopleoptions"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <!-- <el-row>
            <el-form-item label="ㅤㅤㅤ专题:">
              <el-select
                placeholder="请选择"
                v-model="addprojectjing.specialName"
                @change="selectSpecia"
              >
                <el-option
                  v-for="item in thematicOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤㅤㅤ领域:">
              <el-select
                placeholder="请选择"
                v-model="addprojectjing.fieldName"
                @change="selectField"
              >
                <el-option
                  v-for="item in areasOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row> -->

          <el-row>
            <el-form-item label="ㅤ项目组长:" prop="projectChargemanName">
              <el-select
                placeholder="请选择"
                v-model="addprojectjing.projectChargemanName"
                @change="selectChargeman"
                :disabled="setLeaderDisable"
              >
                <el-option
                  v-for="item in projectpeopleoptions"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ审计期间:" class="editdataTime">
              <el-col :span="8">
                <el-form-item>
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addprojectjing.auditStartData"
                    :picker-options="startPickerOptions"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item style="margin-left: -5px">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addprojectjing.auditFinishData"
                    style="margin-left: 3px"
                    :picker-options="endPickerOptions"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-row>
          <!-- <el-row>
            <el-form-item label="地市接口人:" prop="areaUserName">
              <el-input
                placeholder="请输入"
                v-model="addprojectjing.areaUserName"
              >
              </el-input>
            </el-form-item>
          </el-row> -->
        </el-form>

        <div class="stepBtn">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button class="nextBtn" :disabled="isDisable" @click="editSave"
            >确认</el-button
          >
        </div>
      </div>
    </el-dialog>

    <!-- 启动整改 -->
    <el-dialog
      :visible.sync="dialogVisible_rectification"
      center
      @close="resetForm2('save_project_prople')"
      :width="dialogWidth"
    >
      <div class="title">启动整改</div>

      <div class="dialog">
        <div class="dialog follow_up_person">
          <el-form
            ref="save_project_prople"
            :model="save_project_prople"
            :inline="false"
            :rules="rules_people"
          >
            <div class="people">
              <p><span style="color: red">*</span> 整改期限：</p>
              <el-form-item label-width="80px" prop="beginTime">
                <el-date-picker
                  type="date"
                  @change="selectTime"
                  value-format="yyyy-MM-dd"
                  :picker-options="startDatePicker"
                  v-model="save_project_prople.beginTime"
                  style="margin-right: 15px"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label-width="80px" prop="endTime">
                <el-date-picker
                  type="date"
                  :picker-options="endDatePicker"
                  value-format="yyyy-MM-dd"
                  v-model="save_project_prople.endTime"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="people err_select">
              <el-form-item label-width="80px" prop="setting_people_key">
                <p><span style="color: red">*</span>整改跟进人：</p>
                <el-select
                  v-model="save_project_prople.setting_people_key"
                  @change="change_peoplr"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in setting_people"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="footer">
        <el-button plain @click="dialogVisible_rectification = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          :disabled="isDisable"
          @click="save_people('save_project_prople')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 启动整改 end-->

    <!-- 确认整改清单 -->
    <el-dialog
      title=""
      center
      :visible.sync="confirm_problem_dlag"
      width="width"
    >
      <div class="title">确认问题整改清单</div>

      <div class="dialog">
        <div class="header_dlag">
          <!-- search -->
          <div class="search">
            <el-input
              placeholder="请输入问题"
              v-model="problem_list_query.search_issues_list"
            >
            </el-input>
            <div
              class="search_icon"
              style="background: rgb(12, 135, 214) !important"
              @click="search_list_issues()"
            >
              <i class="el-icon-search" style="color: white"></i>
            </div>
          </div>
          <!-- search end -->
          <el-button
            type="primary"
            style="margin: 0 10px"
            size="small"
            @click="select_problem()"
            >选择问题</el-button
          >
        </div>
        <!-- 选择后的的问题清单 -->
        <div class="table_list">
          <el-table
            :data="issues_list.records"
            :header-cell-style="{
              'text-align': 'center',
              'background-color': '#F4FAFF',
            }"
            v-loading="issues_list_loading"
            style="width: 100%"
            @selection-change="handleSelectionChange_problem"
          >
            <!-- <el-table-column type="selection"
                             align="center"> </el-table-column> -->
            <el-table-column type="index" label="序号" width="50">
            </el-table-column>
            <el-table-column
              align="center"
              prop="problem"
              label="问题"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="discoveryTime"
              label="发表日期"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="riskAmount"
              label="风险金额(元)"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="problemFindPeople"
              label="发现人"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column align="center" label="操作" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  :disabled="isDisable"
                  @click="edit(1, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  :disabled="isDisable"
                  @click="edit(2, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <div class="page">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="this.issues_list.current"
                         :page-size="this.issues_list.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="this.issues_list.total">
          </el-pagination>
        </div> -->
      </div>
    </el-dialog>
    <!-- 确认整改清单 end-->

    <!-- 确认整改清单 编辑 -->
    <el-dialog
      center
      title=""
      :close-on-click-modal="false"
      :visible.sync="confirm_problem_dlag_edit"
      width="width"
    >
      <div class="title">编辑问题</div>
      <div class="dialog2 auditproblem">
        <el-form
          ref="detailForm"
          :model="dqProblem"
          :rules="rules"
          label-position="right"
          label-width="120px"
          class="problem-form"
        >
          <el-form-item label="问题" prop="problem">
            <el-input v-model="dqProblem.problem" placeholder="请输入问题" />
          </el-form-item>
          <el-form-item label="领域" prop="field">
            <el-select v-model="dqProblem.field" placeholder="请选择领域">
              <el-option
                v-for="item in CategoryList"
                :key="item.label"
                :label="item.label"
                :value="item.label"
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
          <el-form-item></el-form-item>
          <el-form-item label="依据" prop="basis" class="long">
            <el-input
              v-model="dqProblem.basis"
              placeholder=""
              type="textarea"
            ></el-input>
            <!-- <el-select v-model="dqProblem.basis"
                       multiple
                       @visible-change="toopen"
                       placeholder="请选择"
                       no-data-text="请点击引用审计依据">
            </el-select> -->
          </el-form-item>
          <!-- <el-button type="primary"
                     ref="basisbtn0"
                     class="citebtn"
                     @click="openbasis()">引用审计依据</el-button> -->
          <el-form-item label="描述" prop="describe" class="long">
            <el-input v-model="dqProblem.describe" placeholder="请输入描述" />
          </el-form-item>
          <el-form-item label="管理建议" prop="managementAdvice" class="long">
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
            <el-select
              v-model="dqProblem.problemFindPeople"
              placeholder="请选择发现人"
            >
              <el-option
                v-for="(item, i) in personlist"
                :key="'person' + i"
                :label="item.realName"
                :value="item.realName"
              >
                {{ item.realName }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="风险金额（万元）" prop="riskAmount" width="180">
            <el-input
              v-model.number="dqProblem.riskAmount"
              placeholder="请输入风险金额"
            />
          </el-form-item>
          <el-form-item label="关联任务" prop="auditTaskUuid">
            <el-select
              v-model="dqProblem.auditTaskUuid"
              multiple
              disabled
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
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="confirm_problem_dlag_edit = false">取 消</el-button>
        <el-button type="primary" :disabled="isDisable" @click="updateData()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 确认整改清单 编辑 end-->

    <!-- 选择问题 -->
    <el-dialog
      title=""
      center
      :visible.sync="dialogVisible_select_dialog"
      width="width"
    >
      <div class="title">选择问题</div>

      <div class="dialog">
        <div class="header_dlag">
          <div class="search">
            <el-input
              placeholder="请输入问题"
              v-model="queryProblemList_query.search_problem"
            >
            </el-input>
            <div
              class="search_icon"
              style="background: rgb(12, 135, 214) !important"
              @click="search_list_problem()"
            >
              <i class="el-icon-search" style="color: white"></i>
            </div>
          </div>
        </div>
        <div class="table_list over_auto">
          <el-table
            :data="problem_list"
            :header-cell-style="{
              'text-align': 'center',
              'background-color': '#F4FAFF',
            }"
            v-loading="problem_loading"
            style="width: 100%"
            @selection-change="handleSelectionChange_issues"
          >
            <el-table-column type="selection" align="center"> </el-table-column>
            <el-table-column
              align="center"
              prop="problem"
              label="问题"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <p class="problem_name">{{ scope.row.problem }}</p>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="field"
              label="领域"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="discoveryTime"
              label="发现日期"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="riskAmount"
              label="风险金额"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="problemFindPeople"
              label="发现人"
              show-overflow-tooltip
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer">
        <el-button plain @click="dialogVisible_select_dialog = false"
          >取 消</el-button
        >
        <el-button type="primary" :disabled="isDisable" @click="save_problem()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { get_userInfo } from "@SDMOBILE/api/shandong/ls";
import {
  confirm_rectification,
  selection_questions_list,
  saveProblemCorrect,
  edit_remove,
  follow_up_person,
  updateManagementProject,
  isStartProject,
  startProject,
} from "@SDMOBILE/api/shandong/adminProject"; //lhg
// import axios from "axios";
import Pagination from "@WISDOMAUDIT/components/Pagination";
import {
  projectList,
  projectType,
  projectPeople,
  loadaudittorg,
  addProject,
  getItemId,
  editProject,
  editProjectUpdata,
  deleteProject,
  thematicAreas,
  getProjectMember,
} from "@WISDOMAUDIT/api/shandong/projectmanagement.js";
import { Checkbox } from "element-ui";
import { fmtDate } from "@SDMOBILE/model/time.js";

export default {
  components: { Pagination },
  data() {
    return {
      projectTableLoading: false, //项目管理Loading
      setLeaderDisable: false, //设置组长可编辑
      total: 0,
      isdisabled: true,
      loading: false,
      loadingForm: false,
      selectprojectPeopleNum: {},
      prjType: "2", //判断项目类型
      projectTypeNum: {
        typecode: "PrjType",
      },
      query: {
        condition: {
          projectName: "",
        },
        pageNo: 1,
        pageSize: 10,
      },
      addDialogVisible: false,
      editDialogVisible: false,
      input3: "",
      project: [],
      tableData: [],
      //编辑专项表单数据
      editProjectManagement: {
        projectCode: "",
        projectType: "",
        projectTypeName: "",
        projectName: "",
        projectLeaderUuid: "",
        projectLeaderName: "",
        special: "",
        specialName: "",
        field: "",
        fieldName: "",
        auditStartData: "",
        auditFinishData: "",
        auditList: [
          {
            projectCode: "",
            auditOrgUuid: "",
            auditOrgName: "",
            projectChargemanID: "",
            projectChargemanName: "",
          },
        ],
      },
      //专项新增项目管理的表单
      addProjectManagement: {
        projectCode: "",
        projectType: "",
        projectTypeName: "",
        projectName: "",
        projectLeaderUuid: "",
        projectLeaderName: "",
        special: "",
        specialName: "",
        field: "",
        fieldName: "",
        auditStartData: "",
        auditFinishData: "",
        auditList: [
          {
            projectCode: "",
            auditOrgUuid: "",
            auditOrgName: "",
            projectChargemanID: "",
            projectChargemanName: "",
          },
        ],
      },
      // 经责新增项目管理的表单
      addprojectjing: {
        projectCode: "",
        projectType: "",
        projectTypeName: "",
        projectName: "",
        projectLeaderUuid: "",
        projectLeaderName: "",
        special: "",
        specialName: "",
        field: "",
        fieldName: "",
        auditOrgUuid: "",
        auditOrgName: "",
        auditOrgLeader: "",
        projectChargemanID: "",
        projectChargemanName: "",
        auditStartData: "",
        auditFinishData: "",
        areaUserName: "",
      },
      projectTypeoptions: [], //项目类型下拉框的数据
      projectpeopleoptions: [], //项目类型下拉框的数据
      loadaudittorgoptions: [],
      thematicOption: [], //专题下拉框
      areasOption: [], //领域下拉框
      projectTypeSelect: {
        typecode: "",
      },
      thematic: {
        typecode: "SPECIAL",
      },
      areas: {
        typecode: "Category",
      },
      startPickerOptions: this.startDate(), //新增经责审计期间判断
      endPickerOptions: this.endDate(), //新增专项审计期间判断
      // 新增专项的表单验证
      addzhuanRules: {
        projectName: [
          { required: true, message: "请填写项目名称", trigger: "blur" },
          { max: 20, message: "项目名称在20个字符之内", trigger: "change" },
        ],
        projectTypeName: [
          { required: true, message: "请选择项目分类", trigger: "change" },
        ],
        field: [
          {
            required: true,
            message: "请选择领域",
            trigger: "change",
          },
        ],
        auditStartData: [
          {
            required: true,
            message: "请选择审计开始时间",
            trigger: "change",
          },
        ],
        auditFinishData: [
          {
            required: true,
            message: "请选择审计结束时间",
            trigger: "change",
          },
        ],
        projectChargemanName: [
          {
            required: true,
            message: "请选择负责人",
            trigger: "change",
          },
        ],
        auditOrgName: [
          {
            required: true,
            message: "请选择被审计单位",
            trigger: "change",
          },
        ],
      },
      // 添加经责表单校验
      addprojectjingRules: {
        projectTypeName: [
          {
            required: true,
            message: "请选择项目类型",
            trigger: "change",
          },
        ],
        auditOrgName: [
          {
            required: true,
            message: "请选择被审计单位",
            trigger: "change",
          },
        ],
        projectName: [
          { required: true, message: "请填写项目名称", trigger: "blur" },
        ],
        auditOrgLeader: [
          { required: true, message: "请填写被审计领导", trigger: "blur" },
          { max: 5, message: "被审计领导在5个字符之内", trigger: "change" },
        ],
        auditStartData: [
          {
            required: true,
            message: "请选择审计开始时间",
            trigger: "change",
          },
        ],
        auditFinishData: [
          {
            required: true,
            message: "请选择审计结束时间",
            trigger: "change",
          },
        ],
      },

      // 确认问题整改清单 参数
      problem_list_query: {
        search_issues_list: "", //筛选清单
        managementProjectUuid: "", //清单列表项目id
        pageNo: 1,
        pageSize: 10,
      },
      confirm_problem_dlag: false, //问题确认清单
      issues_list_loading: false, //清单loading
      issues_list: [], //问题清单
      search_details: "", //  筛选清单
      check_detailed: [], //勾选的清单

      entity_isDeleted: "", //'':编辑 1:删除 清单编辑删除
      list_check: {}, // 编辑删除 穿参
      // //选择问题 参数
      queryProblemList_query: {
        search_problem: "", //  筛选问题
      },

      confirm_problem_dlag_edit: false, //问题清单编辑
      dqProblem: {},
      // auditTaskUuidArr: [],//关联人物
      // basisArr: [],//依据

      // 新增的表单验证
      rules: {
        auditTaskUuid: [
          { required: true, message: "请选择关联任务", trigger: "change" },
        ],
        basis: [{ required: true, message: "请选择依据", trigger: "change" }],
        describe: [{ required: true, message: "请填写描述", trigger: "blue" }],
        field: [{ required: true, message: "请选择领域", trigger: "change" }],
        managementAdvice: [
          { required: true, message: "请填写意见", trigger: "blue" },
        ],
        problem: [{ required: true, message: "请填写问题", trigger: "blue" }],
        problemDiscoveryTime: [
          { required: true, message: "请填写发现时间", trigger: "blue" },
        ],
        problemFindPeople: [
          { required: true, message: "请填写发现人", trigger: "blue" },
        ],
        special: [{ required: true, message: "请选择专题", trigger: "change" }],
        riskAmount: [
          { required: true, message: "请填写风险金额", trigger: "blue" },
        ],
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
      dialogDetailVisible: false,
      dialogStatus: "",
      basisdialog: false, //引用依据

      closeStatus: false,
      downloadLoading: false,
      headers: { "Content-Type": "multipart/form-data" },
      file: "",
      problemtableSelection: [],
      CategoryList: [], //领域
      SPECIALList: [], //专题
      auditTasklList: [],
      personlist: [], //发现人
      me: "",
      dialogVisible_select_dialog: false, //选择问题
      problem_loading: false, //问题loading
      problem_list: [], //问题列表
      check_problem: [], //勾选的问题

      // dialogVisible_setting_prople: false,//项目整改跟进人
      dialogVisible_rectification: false, //启动整改
      dialogWidth: 0, //启动整改宽度
      // 设置整改跟进人
      project_list: [], //项目列表 多选
      setting_people: [],
      save_project_prople: {
        setting_people_name: "", //选择的整改跟进人
        setting_people_key: "",
        beginTime: "", //开始时间
        endTime: "", //结束时间
      },
      // 设置时间范围
      // pickerOptionscreate: {
      //   disabledDate (time) {
      //     return time.getTime() > this.save_project_prople.beginTime;
      //   },
      // },

      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),

      rules_people: {
        setting_people_key: [
          { required: true, message: "请选择跟进人", trigger: "change" },
        ],
        beginTime: [
          { required: true, message: "请选择开始时间", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
      },
      isDisable: false, //防止重复提交
      projectid: "", //获取项目的id
    };
  },
  created() {
    this.projectData(this.query);
    this.selectProjectData(this.projectTypeNum);
    // this.selectprojectPeople(this.selectprojectPeopleNum);
    this.selectloadaudittorg(this.selectprojectPeopleNum);
    this.thematicSelect(this.thematic);
    this.areasSelect(this.areas);
    this.get_user(); //获取当前登录人接口

    // 编辑  审计整改问题  引用
    this.getloadcascader("Category");
    this.getloadcascader("SPECIAL");
    // this.getbasis();//获取依据 任务select
    this.getSelectTask(); //关联任务

    this.setDialogWidth(); //启动整改动态宽度
  },
  mounted() {
    //监听窗口宽度
    window.onresize = () => {
      return (() => {
        this.setDialogWidth();
      })();
    };
  },
  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      // return fmtDate(t, 'yyyy-MM-dd hh:mm:ss');
      return fmtDate(t, "yyyy-MM-dd ");
    },
  },
  // watch: {
  //     active_project(val) {
  //       this.refreash = true; // loading
  //       let _this = this;
  //       setTimeout(function name() {
  //         _this.refreash = false;
  //       }, 500);
  //     },
  // },
  methods: {
    // 限制开始  结束时间范围
    beginDate() {
      const that = this;
      return {
        disabledDate(time) {
          if (that.save_project_prople.endTime) {
            //如果结束时间不为空，则小于结束时间
            return (
              new Date(that.save_project_prople.endTime).getTime() <
              time.getTime()
            );
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        },
      };
    },
    processDate() {
      const that = this;
      return {
        disabledDate(time) {
          if (that.save_project_prople.beginTime) {
            //如果开始时间不为空，则结束时间大于开始时间
            return (
              new Date(that.save_project_prople.beginTime).getTime() >
              time.getTime()
            );
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        },
      };
    },

    setDialogWidth() {
      var val = document.body.clientWidth;
      const def = 400; //宽度最小为800,可修改
      //窗口宽度小于默认宽度时，将弹框看度设置为50%,可修改
      if (val < def) {
        this.dialogWidth = "300px";
      } else {
        //窗口宽度大于默认宽度1200时，将弹框设置为400宽度,可修改
        this.dialogWidth = "580px";
      }
    },

    //审计期间禁用判断
    // 开始选择器禁用
    startDate() {
      const that = this;
      return {
        disabledDate(time) {
          if (that.addprojectjing.auditFinishData) {
            //如果结束时间不为空，则小于结束时间
            return (
              new Date(that.addprojectjing.auditFinishData).getTime() <
              time.getTime()
            );
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
          if (that.addProjectManagement.auditFinishData) {
            //如果结束时间不为空，则小于结束时间
            return (
              new Date(that.addProjectManagement.auditFinishData).getTime() <
              time.getTime()
            );
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        },
      };
    },
    //结束选择器禁用
    endDate() {
      const that = this;
      return {
        disabledDate(time) {
          if (that.addprojectjing.auditStartData) {
            //如果结束时间不为空，则小于结束时间
            return (
              new Date(that.addprojectjing.auditStartData).getTime() >
              time.getTime()
            );
          }
          if (that.addProjectManagement.auditStartData) {
            //如果结束时间不为空，则小于结束时间
            return (
              new Date(that.addProjectManagement.auditStartData).getTime() >
              time.getTime()
            );
          }
        },
      };
    },
    //项目列表
    projectData(data) {
      this.projectTableLoading = true;
      projectList(data).then((resp) => {
        this.tableData = resp.data.records;
        this.project = resp.data;
        this.total = resp.data.total;
        this.projectTableLoading = false;
      });
    },
    // 专题下拉框
    thematicSelect(data) {
      thematicAreas(data).then((resp) => {
        this.thematicOption = resp.data;
        //
      });
    },
    //领域下拉框
    areasSelect(data) {
      thematicAreas(data).then((resp) => {
        this.areasOption = resp.data;
        //
      });
    },
    // 项目类行下拉框
    selectProjectData(data) {
      projectType(data).then((resp) => {
        this.projectTypeoptions = resp.data;
      });
    },
    //项目负责人接口
    selectprojectPeople(num, size) {
      this.loadingForm = true;
      getProjectMember(num, size).then((resp) => {
        this.projectpeopleoptions = resp.data.list;

        this.loadingForm = false;
      });
    },
    // selectprojectPeople(data) {
    //   projectPeople(data).then((resp) => {
    //     this.projectpeopleoptions = resp.data;
    //     //
    //   });
    // },
    selectloadaudittorg(data) {
      loadaudittorg(data).then((resp) => {
        this.loadaudittorgoptions = resp.data;
      });
    },
    //新增项目按钮事件
    addProject_s() {
      this.addprojectjing = {
        projectCode: "",
        projectType: "",
        projectTypeName: "",
        projectName: "",
        projectLeaderUuid: "",
        projectLeaderName: "",
        special: "",
        specialName: "",
        field: "",
        fieldName: "",
        auditOrgUuid: "",
        auditOrgName: "",
        auditOrgLeader: "",
        projectChargemanID: "",
        projectChargemanName: "",
        auditStartData: "",
        auditFinishData: "",
        areaUserName: "",
      };
      this.addProjectManagement = {
        projectCode: "",
        projectType: "",
        projectTypeName: "",
        projectName: "",
        projectLeaderUuid: "",
        projectLeaderName: "",
        special: "",
        specialName: "",
        field: "",
        fieldName: "",
        auditStartData: "",
        auditFinishData: "",
        auditList: [
          {
            projectCode: "",
            auditOrgUuid: "",
            auditOrgName: "",
            projectChargemanID: "",
            projectChargemanName: "",
          },
        ],
      };
      var that = this;
      this.$nextTick(() => {
        that.$refs["addprojectjing"].clearValidate();
        // that.$refs["addProjectManagement"].clearValidate();
      });
      this.isdisabled = true;
      this.prjType = 2;
      this.addDialogVisible = true;
      //  this.$refs.addjingForm.clearValidate();
      this.selectprojectPeople(1, 1000);
      this.addProjectManagement.projectLeaderName = this.userInfo.user.realName;
      //
      this.addProjectManagement.projectLeaderUuid = this.userInfo.user.id;
      this.addprojectjing.projectLeaderUuid = this.userInfo.user.id;
      this.addprojectjing.projectLeaderName = this.userInfo.user.realName;
      this.addprojectjing.projectChargemanID = this.userInfo.user.id;
      this.addprojectjing.projectChargemanName = this.userInfo.user.realName;
    },
    //获取当前登录人信息
    get_user() {
      get_userInfo().then((resp) => {
        this.userInfo = resp.data;
      });
    },
    //增加专项项目table假数据
    addData() {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 2000);
      // alert(11);
      this.addProjectManagement.auditList.push({
        projectCode: this.addProjectManagement.projectCode,
        auditOrgUuid: "",
        auditOrgName: "",
        role: "组长",
        projectChargemanID: "",
        projectChargemanName: "",
      });
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    //新增经责项目确认按钮
    nextBtn() {
      this.$refs.addprojectjing.validate((valid) => {
        if (valid) {
          this.isDisable = true;
          setTimeout(() => {
            this.isDisable = false;
          }, 2000);
          addProject(this.addprojectjing).then((resp) => {
            //
            this.$message.success("添加项目成功！");
            this.addDialogVisible = false;
            this.projectData(this.query);
          });
        } else {
          return false;
        }
      });
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.addprojectjing = {
        projectCode: "",
        projectType: "",
        projectTypeName: "",
        projectName: "",
        projectLeaderUuid: "",
        projectLeaderName: "",
        special: "",
        specialName: "",
        field: "",
        fieldName: "",
        auditOrgUuid: "",
        auditOrgName: "",
        auditOrgLeader: "",
        projectChargemanID: "",
        projectChargemanName: "",
        auditStartData: "",
        auditFinishData: "",
        areaUserName: "",
      };
      this.addProjectManagement = {
        projectCode: "",
        projectType: "",
        projectTypeName: "",
        projectName: "",
        projectLeaderUuid: "",
        projectLeaderName: "",
        special: "",
        specialName: "",
        field: "",
        fieldName: "",
        auditStartData: "",
        auditFinishData: "",
        auditList: [
          {
            projectCode: "",
            auditOrgUuid: "",
            auditOrgName: "",
            projectChargemanID: "",
            projectChargemanName: "",
          },
        ],
      };
      // this.$router.go(0);
      var that = this;
      this.$nextTick(() => {
        if (that.$refs["addprojectjing"] != undefined) {
          that.$refs["addprojectjing"].clearValidate();
        }
        if (that.$refs["addProjectManagement"] != undefined) {
          that.$refs["addProjectManagement"].clearValidate();
        }
      });
    },
    //编辑项目对话框关闭事件
    editDialogClosed() {
      if (this.$refs["addprojectjing"] != undefined) {
        this.$refs["addprojectjing"].resetFields();
      } else {
        this.$refs["addProjectManagement"].resetFields();
      }
      // var that = this;
      //   this.$nextTick(() => {
      //     if (that.$refs["addprojectjing"] != undefined) {
      //       that.$refs["addprojectjing"].clearValidate();
      //     } else {
      //       that.$refs["addProjectManagement"].clearValidate();
      //     }
      //   });
    },
    // 项目管理列表分页
    handleCurrentChangeProject(val) {
      //
      // 模型列表
      let query = {
        pageNo: val,
        pageSize: this.query.pageSize,
        condition: {
          queryNum: "",
        },
      };
      this.projectData(query);
    },
    queryName() {
      this.projectData(this.query);
    },
    // 项目分类下拉框事件
    selectprojectType(val) {
      // 如果不是经责分类
      if (val !== "jzsj") {
        this.prjType = 1;
        this.addProjectManagement.projectType = val;
        for (let i = 0; i < this.projectTypeoptions.length; i++) {
          if (val == this.projectTypeoptions[i].value) {
            this.addProjectManagement.projectTypeName =
              this.projectTypeoptions[i].label;
          }
        }
        // 获取项目编号
        this.projectTypeSelect.typecode = val;
        getItemId(this.projectTypeSelect).then((resp) => {
          this.addProjectManagement.projectCode = resp.data;
          this.addProjectManagement.auditList[0].projectCode = resp.data;
        });
      } else {
        this.prjType = 2;
        this.addprojectjing.projectType = val;
        // this.addprojectjing.projectName = "2021年度某公司经责审计项目";
        for (let i = 0; i < this.projectTypeoptions.length; i++) {
          if (val == this.projectTypeoptions[i].value) {
            this.addprojectjing.projectTypeName =
              this.projectTypeoptions[i].label;
            // this.addProjectManagement.projectTypeName =
            //   this.projectTypeoptions[i].label;
          }
        }
        // 获取项目编号
        this.projectTypeSelect.typecode = val;
        getItemId(this.projectTypeSelect).then((resp) => {
          this.addprojectjing.projectCode = resp.data;
          //
        });
      }
      var that = this;
      if (val) {
        this.$nextTick(() => {
          if (that.$refs["addprojectjing"] != undefined) {
            that.$refs["addprojectjing"].clearValidate();
          } else {
            that.$refs["addProjectManagement"].clearValidate();
          }
        });
      }
    },
    // 经责项目负责任人下拉框事件
    selectprojectLeader(val) {
      this.addprojectjing.projectLeaderUuid = val;
      this.addProjectManagement.projectLeaderUuid = val;
      for (let i = 0; i < this.projectpeopleoptions.length; i++) {
        if (val == this.projectpeopleoptions[i].id) {
          this.addprojectjing.projectLeaderName =
            this.projectpeopleoptions[i].realName;
          this.addProjectManagement.projectLeaderName =
            this.projectpeopleoptions[i].realName;
        }
      }

      //
    },
    //专题下拉框
    selectSpecia(val) {
      this.addProjectManagement.special = val;
      this.addprojectjing.special = val;
      for (let i = 0; i < this.thematicOption.length; i++) {
        if (val == this.thematicOption[i].value) {
          this.addProjectManagement.specialName = this.thematicOption[i].label;
          this.addprojectjing.specialName = this.thematicOption[i].label;
        }
      }
      //
      //
    },
    //领域下拉框
    selectField(val) {
      console.log(this.addProjectManagement);
    },
    selectorg(val) {
      this.addprojectjing.auditOrgUuid = val;
      for (var i = 0; i < this.loadaudittorgoptions.length; i++) {
        if (val == this.loadaudittorgoptions[i].auditOrgUuid) {
          this.addprojectjing.auditOrgName =
            this.loadaudittorgoptions[i].orgName;
          this.addprojectjing.projectName =
            "2021年度" + this.addprojectjing.auditOrgName + "经责审计项目";
        }
      }
      //
      //
    },
    //经责项目组长下拉框事件
    selectChargeman(val) {
      this.addprojectjing.projectChargemanID = val;
      for (let i = 0; i < this.projectpeopleoptions.length; i++) {
        if (val == this.projectpeopleoptions[i].id) {
          this.addprojectjing.projectChargemanName =
            this.projectpeopleoptions[i].realName;
        }
      }
      //
      //
    },
    orgSelect(row) {
      for (var i = 0; i < this.loadaudittorgoptions.length; i++) {
        if (row.auditOrgUuid == this.loadaudittorgoptions[i].auditOrgUuid) {
          row.auditOrgName = this.loadaudittorgoptions[i].orgName;
        }
      }

      //添加专项table数组根据某一个字段去重
      var result = [];
      var obj = {};
      for (let i = 0; i < this.addProjectManagement.auditList.length; i++) {
        if (
          !obj[this.addProjectManagement.auditList[i].auditOrgUuid] ||
          !obj[this.addProjectManagement.auditList[i].projectChargemanID]
        ) {
          result.push(this.addProjectManagement.auditList[i]);
          obj[this.addProjectManagement.auditList[i].auditOrgUuid] = true;
          obj[this.addProjectManagement.auditList[i].projectChargemanID] = true;
        }
      }
      this.addProjectManagement.auditList = result;
    },
    //专项项目负责人下拉框事件
    LeaderSelect(row) {
      for (let i = 0; i < this.projectpeopleoptions.length; i++) {
        if (row.projectChargemanID == this.projectpeopleoptions[i].id) {
          row.projectChargemanName = this.projectpeopleoptions[i].realName;
        }
      }
      //
      //
      // this.addProjectManagement.auditList.forEach(item =>{
      //   if(item.auditOrgUuid == row.auditOrgUuid && item.projectChargemanID == row.projectChargemanID){
      //     alert(123)
      //   }
      // })
      //添加专项table数组根据某一个字段去重
      var result = [];
      var obj = {};
      for (let i = 0; i < this.addProjectManagement.auditList.length; i++) {
        if (
          !obj[this.addProjectManagement.auditList[i].auditOrgUuid] ||
          !obj[this.addProjectManagement.auditList[i].projectChargemanID]
        ) {
          result.push(this.addProjectManagement.auditList[i]);
          obj[this.addProjectManagement.auditList[i].auditOrgUuid] = true;
          obj[this.addProjectManagement.auditList[i].projectChargemanID] = true;
        }
      }
      this.addProjectManagement.auditList = result;
    },
    // 编辑专项项目table负责人下拉框事件
    LeaderSelectEdit(row) {
      for (let j = 0; j < this.projectpeopleoptions.length; j++) {
        if (row.projectChargemanName == this.projectpeopleoptions[j].realName) {
          row.projectChargemanID = this.projectpeopleoptions[j].id;
        }
      }

      //编辑专项table数组根据某一个字段去重
      var result = [];
      var obj = {};
      for (let i = 0; i < this.addProjectManagement.auditList.length; i++) {
        if (
          !obj[this.addProjectManagement.auditList[i].auditOrgUuid] ||
          !obj[this.addProjectManagement.auditList[i].projectChargemanID]
        ) {
          result.push(this.addProjectManagement.auditList[i]);
          obj[this.addProjectManagement.auditList[i].auditOrgUuid] = true;
          obj[this.addProjectManagement.auditList[i].projectChargemanID] = true;
        }
      }
      this.addProjectManagement.auditList = result;
    },

    addSave() {
      this.$refs["addProjectManagement"].validate((valid) => {
        if (valid) {
          this.isDisable = true;
          setTimeout(() => {
            this.isDisable = false;
          }, 2000);

          // this.addProjectManagement.field = this.addProjectManagement.field.toString();
          // let addParams = this.addProjectManagement;
          let addParams = {
            projectCode: this.addProjectManagement.projectCode,
            projectType: this.addProjectManagement.projectType,
            projectTypeName: this.addProjectManagement.projectTypeName,
            projectName: this.addProjectManagement.projectName,
            projectLeaderUuid: this.addProjectManagement.projectLeaderUuid,
            projectLeaderName: this.addProjectManagement.projectLeaderName,
            special: this.addProjectManagement.special,
            specialName: this.addProjectManagement.specialName,
            field: this.addProjectManagement.field.toString(),
            fieldName: this.addProjectManagement.fieldName,
            auditStartData: this.addProjectManagement.auditStartData,
            auditFinishData: this.addProjectManagement.auditFinishData,
            auditList: [],
          };
          addParams.auditList = this.addProjectManagement.auditList;
          // addParams.field = addParams.field.toString();
          addProject(addParams).then((resp) => {
            if (resp.code == 0) {
              this.$message.success("添加项目成功！");
              this.addDialogVisible = false;
              this.projectData(this.query);
            }
          });
          // if (this.$refs["addprojectjing"] != undefined) {
          //   this.$refs["addprojectjing"].clearValidate();
          // } else {

          // }
        } else {
          return false;
        }
      });
    },

    // 编辑
    editDialog(rows) {
      this.editDialogVisible = true;
      this.selectprojectPeople(1, 1000);
      if (rows.projectType == "jzsj") {
        var that = this;
        this.$nextTick(() => {
          if (that.$refs["addprojectjing"] != undefined) {
            that.$refs["addprojectjing"].clearValidate();
          } else {
            that.$refs["addProjectManagement"].clearValidate();
          }
        });
        this.prjType = 2;
        editProject(rows.managementProjectUuid).then((resp) => {
          this.addprojectjing = resp.data;
          if (this.addprojectjing.isChargemanCanChenge == 0) {
            this.setLeaderDisable = true;
          } else {
            this.setLeaderDisable = false;
          }
        });
      } else {
        var that = this;
        this.$nextTick(() => {
          if (that.$refs["addprojectjing"] != undefined) {
            that.$refs["addprojectjing"].clearValidate();
          } else {
            that.$refs["addProjectManagement"].clearValidate();
          }
        });
        this.prjType = 1;
        editProject(rows.managementProjectUuid).then((resp) => {
          this.addProjectManagement = resp.data;
          this.addProjectManagement.field =
            this.addProjectManagement.field.split(",");
          if (this.addProjectManagement.isChargemanCanChenge == 0) {
            this.setLeaderDisable = true;
          } else {
            this.setLeaderDisable = false;
          }
        });
      }
    },
    // 专项修改按钮事件
    editBtn(addProjectManagement) {
      this.$refs[addProjectManagement].validate((valid) => {
        if (valid) {
          this.isDisable = true;
          setTimeout(() => {
            this.isDisable = false;
          }, 2000);

          let editParams = {
            projectCode: this.addProjectManagement.projectCode,
            projectType: this.addProjectManagement.projectType,
            projectTypeName: this.addProjectManagement.projectTypeName,
            projectName: this.addProjectManagement.projectName,
            projectLeaderUuid: this.addProjectManagement.projectLeaderUuid,
            projectLeaderName: this.addProjectManagement.projectLeaderName,
            special: this.addProjectManagement.special,
            specialName: this.addProjectManagement.specialName,
            field: this.addProjectManagement.field.toString(),
            fieldName: this.addProjectManagement.fieldName,
            auditStartData: this.addProjectManagement.auditStartData,
            auditFinishData: this.addProjectManagement.auditFinishData,
            auditList: [],
          };
          editParams.auditList = this.addProjectManagement.auditList;
          editProjectUpdata(editParams).then((resp) => {
            if (resp.code == 0) {
              this.$message.success("修改成功！");
              this.editDialogVisible = false;
              this.projectData(this.query);
            }
          });
        } else {
          return false;
        }
      });
    },
    // 经责项目类型按钮事件
    editSave() {
      this.$refs.addprojectjing.validate((valid) => {
        if (valid) {
          this.isDisable = true;
          setTimeout(() => {
            this.isDisable = false;
          }, 2000);
          editProjectUpdata(this.addprojectjing).then((resp) => {
            this.$message.success("修改成功！");
            this.editDialogVisible = false;
            this.projectData(this.query);
          });
        } else {
          return false;
        }
      });
    },
    deleteProjectrow(index, rows, obj) {
      //
      if (!obj.managementProjectUuid) {
        rows.splice(index, 1);
      } else {
        deleteProject(obj.managementProjectUuid).then((resp) => {
          //
          rows.splice(index, 1);
        });
      }
    },
    //项目列表 多选
    handleSelectionChange_list(val) {
      this.project_list = val;
    },

    // 设置跟进人 data
    setting_follow_prople() {
      let params = {
        projectid: this.projectid,
        pageSize: "1000",
        pageCurrent: "1",
      };
      // 获取跟进人
      follow_up_person(params).then((resp) => {
        console.log(resp.data);
        this.setting_people = resp.data.list;
      });
    },

    // 整改人  change
    change_peoplr(val) {
      let obj = {};
      obj = this.setting_people.find((item) => {
        return item.id === val;
      });
      this.save_project_prople.setting_people_name = obj.realName; //选择的整改人   key
      this.save_project_prople.setting_people_key = val; //选择的整改人
    },

    // 启动整改显示弹窗
    run_rectification() {
      if (this.project_list.length !== 1) {
        this.$message({ message: "请选择一条项目进行启动整改" });
        return;
      } else {
        this.run_startProject(); //是否启动整改
      }
    },

    // 启动整改
    run_startProject() {
      let params = {
        managementProjectUuid: this.project_list[0].managementProjectUuid,
        managementAdvice: this.project_list[0].managementAdvice, //
      };
      // 是否启动整改
      isStartProject(params).then((resp) => {
        if (resp.code == 0) {
          let _data = resp.data;
          if (_data.isStartProject == 0) {
            this.dialogVisible_rectification = true; //启动整改 弹窗
            // 获取整改人
            var ids = [];
            this.project_list.forEach((r, i) => {
              ids.push(r.managementProjectUuid);
            });
            this.projectid = ids[0];
            this.setting_follow_prople(); //整改人 数据
          } else {
            this.$message({
              message: "请确认整改问题清单",
              type: "error",
            });
          }
        } else {
          this.$message({
            message: resp.msg,
            type: "error",
          });
        }
      });
    },
    selectTime(val) {
      this.save_project_prople.beginTime = val;
    },
    // 设置整改跟进人 参数
    save_people(save_project_prople) {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 2000);
      this.$refs[save_project_prople].validate((valid) => {
        if (valid) {
          let params2 = {
            correctUser: this.save_project_prople.setting_people_key, //跟进人 key
            correctUserName: this.save_project_prople.setting_people_name, //跟进人 name
            managementProjectUuid: this.projectid, //项目id
            beginTime: this.save_project_prople.beginTime, //开始时间
            endTime: this.save_project_prople.endTime, //结束时间
            managementAdvice: "1",
          };
          // 去整改
          startProject(params2).then((resp) => {
            console.log(params2);
            if (resp.code == 0) {
              this.$message({
                message: "整改成功",
                type: "success",
              });
              this.dialogVisible_rectification = false; //启动整改 弹窗
              this.projectData(this.query); //刷新外面列表
            } else {
              this.$message({
                message: resp.msg,
                type: "error",
              });
            }
          });
          // 去整改 end
        } else {
          this.$message.info("请填写信息");
          return false;
        }
      });
    },
    // 关闭整改 弹窗
    resetForm2(save_project_prople) {
      this.$refs[save_project_prople].resetFields();
    },
    // 确认问题整改清单=============
    confirm_problem(id) {
      this.confirm_problem_dlag = true; //显示确认清单
      this.problem_list_query.managementProjectUuid = id;
      this.confirm_problem_data(); //确认整改问题清单列表
    },
    // 确认整改问题清单列表
    confirm_problem_data() {
      this.issues_list_loading = true;
      let params = {
        pageNo: this.problem_list_query.pageNo,
        pageSize: this.problem_list_query.pageSize,
        condition: {
          problem: this.problem_list_query.search_issues_list,
          managementProjectUuid: this.problem_list_query.managementProjectUuid,
        },
      };
      confirm_rectification(params).then((resp) => {
        console.log(resp);
        this.issues_list = resp.data;
        this.issues_list_loading = false;
      });
    },
    // 问题整改清单  每页条数
    handleSizeChange(val) {
      this.problem_list_query.pageSize = val;
    },
    // 问题整改清单  分页
    handleCurrentChange(val) {
      this.problem_list_query.pageNo = val;
      this.confirm_problem_data(); //确认整改问题清单列表
    },
    // 筛选问题整改清单
    search_list_issues() {
      this.confirm_problem_data(); //确认整改问题清单列表
    },
    // 勾选清单
    handleSelectionChange_problem(val) {
      this.check_detailed = val;
    },
    // 专题 领域
    getloadcascader(str) {
      this.$axios({
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
    // 关联任务
    getSelectTask() {
      this.$axios({
        url: `/wisdomaudit/auditTask/selectTask`,
        method: "post",
        data: {
          managementProjectUuid: this.active_project,
        },
      }).then((res) => {
        this.auditTasklList = res.data.data;
      });
    },
    // 编辑删除
    edit(index, data) {
      this.list_check = data;
      if (index == 1) {
        let entity = this.list_check; //当前的数据
        this.problemCorrectUuid = entity.problemCorrectUuid;
        // let _data = resp.data
        this.dqProblem.problem = entity.problem; //问题
        this.dqProblem.field = entity.field; //领域
        this.dqProblem.special = entity.special; //专题
        this.dqProblem.describe = entity.describe; //描述
        this.dqProblem.managementAdvice = entity.managementAdvice; //建议
        this.dqProblem.problemDiscoveryTime = entity.problemDiscoveryTime; //发现日期
        this.dqProblem.problemFindPeople = entity.problemFindPeople; //发现人
        this.dqProblem.riskAmount = entity.riskAmount; //风险金额
        this.dqProblem.basis = entity.basis.split(","); //依据
        this.dqProblem.auditTaskUuid = entity.auditTaskUuid.split(","); //关联任务

        this.dqProblem = JSON.parse(JSON.stringify(this.dqProblem));
        // this.edit_remove_data(1, entity)// 编辑 删除  数据
        this.confirm_problem_dlag_edit = true; //审计问题清单 编辑
        this.$nextTick(() => {
          this.$refs["detailForm"].clearValidate();
        });
      } else {
        this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.entity_isDeleted = data.isDeleted = 1;
            let entity = this.list_check; //当前的数据
            this.edit_remove_data(2, entity); // 编辑 删除  数据
          })
          .catch(() => {});
      }
    },
    // 编辑 删除  数据
    edit_remove_data(index, params) {
      edit_remove(params).then((resp) => {
        if (resp.code == 0) {
          if (index == 2) {
            // 删除
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.confirm_problem_data(); //刷新 整改问题清单列表
          } else {
            this.$message({
              message: "编辑成功",
              type: "success",
            });
            this.confirm_problem_dlag_edit = false; //关闭编辑弹窗
            this.confirm_problem_data(); //确认整改问题清单列表
          }
        } else {
          this.$message({
            message: resp.msg,
            type: "error",
          });
        }
      });
    },
    // 编辑保存 确认清单
    updateData(detailForm) {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 2000);
      this.$refs["detailForm"].validate((valid) => {
        if (valid) {
          var a = this.dqProblem.auditTaskUuid; //定义数组
          this.dqProblem.auditTaskUuid = a.toString(); //把数组转换为字符串
          var b = this.dqProblem.basis;
          this.dqProblem.basis = b.toString();
          this.$set(
            this.dqProblem,
            "problemCorrectUuid",
            this.problemCorrectUuid
          ); //id
          this.$set(this.dqProblem, "isDeleted", 0); //依据
          let entity = this.dqProblem; //当前的数据
          this.edit_remove_data(3, entity); // 编辑 删除  数据
        } else {
          this.$message({
            message: "请填写信息",
            type: "error",
          });
        }
      });
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
    // 选择问题==============
    select_problem() {
      this.dialogVisible_select_dialog = true; //显示选择问题列表
      this.selection_questions_list_data(); //选择问题列表
    },
    // 选择问题列表
    selection_questions_list_data() {
      this.problem_loading = true;
      let params = {
        managementProjectUuid: this.problem_list_query.managementProjectUuid, //当前项目的id
        problem: this.queryProblemList_query.search_problem, ///
      };
      selection_questions_list(params).then((resp) => {
        this.problem_list = resp.data;
        this.problem_loading = false;
      });
    },

    // 问题筛选
    search_list_problem() {
      this.selection_questions_list_data(); //选择问题列表
    },
    // 选择问题
    handleSelectionChange_issues(val) {
      this.check_problem = val;
      // 数组 添加id
      // this.check_problem.forEach(item => {
      //   this.$set(item, 'managementProjectUuid', this.problem_list_query.managementProjectUuid)//核实意见
      // })
    },
    // 保存问题
    save_problem() {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 2000);
      this.issues_list = this.check_problem;
      console.log(this.issues_list);
      if (this.check_problem.length == 0) {
        this.$message({ message: "请选择一条问题进行保存" });
      } else {
        this.save_ProblemCorrect_data();
      }
    },
    // 问题 保存
    save_ProblemCorrect_data() {
      let problemList = this.check_problem; //传参
      saveProblemCorrect(problemList).then((resp) => {
        if (resp.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          this.dialogVisible_select_dialog = false; //显示选择问题列表
          this.confirm_problem_data(); // 刷新 确认整改问题清单列表
        } else {
          this.$message({
            message: resp.data.msg,
            type: "error",
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.projectmanagement {
  padding: 1.2%;
  .addBtn {
    background: #4bdcb4 !important;
  }
}
.addForm {
  margin-top: 2%;
  margin-left: 20%;
  .el-select,
  .el-input {
    position: relative;
    top: -35px;
    width: 65%;
  }
  .el-form-item {
    margin-bottom: -15px !important;
  }
  .addIcon {
    background-color: #fff;
    width: 95%;
    padding: 10px;
    color: #128ad7;
    text-align: center;
    border: 1px solid #ebeef2;
    cursor: pointer;
    // margin-bottom: 5%;
  }
}

.addzhuanForm {
  padding: 2%;
  margin-top: 2%;
  .el-select,
  .el-input {
    position: relative;
    top: -35px;
    width: 65%;
  }
  .el-form-item {
    margin-bottom: -15px !important;
  }
  .addIcon {
    background-color: #fff;
    width: 100%;
    padding: 10px;
    color: #128ad7;
    text-align: center;
    border: 1px solid #ebeef2;
    cursor: pointer;
    // margin-bottom: 5%;
  }
}
.addzhuanBtn {
  //  border: 1px solid red;
  margin-top: 3%;
  text-align: center;
  .nextBtn {
    background: #0c87d6 !important;
    color: #fff;
  }
  .el-button {
    font-weight: 400 !important;
  }
}
.stepBtn {
  width: 125%;
  padding: 2%;
  margin-left: -25%;
  // border: 1px solid red;
  margin-top: 3%;
  text-align: center;
  .nextBtn {
    background: #0c87d6 !important;
    color: #fff;
  }
  .el-button {
    font-weight: 400 !important;
  }
}
.dataTime .el-input {
  width: 96%;
}
.zhuandataTime .el-input {
  width: 93%;
}
.editdataTime .el-input {
  width: 94%;
}
.projectTable {
  .el-select {
    width: 200px;
    margin: 20px 0 0 -100px;
  }
}
.title {
  border-bottom: 1px solid #d2d2d2;
  padding: 10px;
  text-align: center;
  margin-bottom: 3%;
  font-size: 14px;
  color: #000;
}
.cancel {
  border: 1px solid #d2d2d2;
}
</style>
<style scoped>
@import "../../../assets/styles/css/yw.css";
.setting_people {
  padding: 20px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}
.setting_people >>> .el-button {
  margin: 0 20px;
}
/* 确认问题整改清单 */
.dialog {
  padding: 0 20px 20px;
  box-sizing: border-box;
}

.header_dlag {
  display: flex;
  justify-content: flex-end;
}
.search {
  display: flex;
  position: relative;
}
.search >>> .el-input__inner {
  width: 250px !important;
  display: flex;
  float: right;
  border-radius: 0 !important;
}
.search >>> .el-button {
  border-radius: 0 !important;
}
.search >>> .search_icon {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
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
}
.over_auto {
  height: 400px;
  overflow-y: auto;
}

/* 列表 */
.table_list {
  margin-top: 10px;
}
.problem_name {
  color: rgb(68, 163, 223);
  /* cursor: pointer; */
}
/* 分页 */
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}

/* 整改清单编辑 */
.dialog2 {
  box-sizing: border-box;
}
.dialog2 .el-form-item {
  width: 49%;
  margin: 10px 1% 10px 0 !important;
  box-sizing: border-box;
}

.auditproblem >>> .problem-form {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  flex-wrap: wrap;
  padding: 0px 20px;
}
.auditproblem >>> .el-form-item__label {
  float: left !important;
}
.auditproblem >>> .el-select {
  width: 100%;
}
.auditproblem >>> .citebtn {
  height: 40px;
  margin-bottom: 6px;
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
  cursor: pointer;
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

.basiscard p {
  padding: 10px 0 10px 20px;
}

.problem-form .el-form-item__label {
  float: left !important;
}
.problem-form .el-form-item__label {
  float: left !important;
}
.long {
  width: 70% !important;
}
/* 整改清单编辑 end*/

/* 整改跟进人 */
.follow_up_person {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.follow_up_person p {
  min-width: 90px;
  text-align: right;
}

.people {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.people >>> .el-form-item__content {
  margin-left: 0 !important;
}
.people >>> .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 200px;
}
.people >>> .el-form-item__content {
  display: flex;
}
.err_select >>> .el-form-item__error {
  left: 90px;
}
/* 整改跟进人 end*/

.addForm /deep/ .el-form-item__error {
  position: absolute;
  top: 0%;
  left: 0%;
}
.addzhuanForm /deep/ .el-form-item__error {
  position: absolute;
  top: 0%;
  left: 0%;
}
.projectTable /deep/ .el-form-item__error {
  position: absolute;
  top: 20%;
  left: 0%;
}
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
.projectmanagement {
  background: #fff;
}
>>> .el-input__inner::-webkit-input-placeholder {
  color: #c0c4cc !important;
}
>>> .queryBtn {
  background: #0c87d6 !important;
  color: #fff;
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
}
>>> .el-dialog__body {
  padding: 5px 0 !important;
}
.addForm >>> .el-input.is-disabled .el-input__inner {
  background-color: #f5f7fa !important;
  color: #c0c4cc !important;
}
.addzhuanForm >>> .el-input.is-disabled .el-input__inner {
  background-color: #f5f7fa !important;
  color: #c0c4cc !important;
}
.projectmanagement >>> .el-table__header {
  border-top: none !important;
}
>>> .el-form-item__label {
  font-size: 14px !important;
  color: #606266 !important;
  font-weight: 500;
}
.projectTable >>> .el-select {
  position: relative;
  top: -17px !important;
}
</style>
