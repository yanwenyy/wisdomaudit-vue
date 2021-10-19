<template>
  <!-- 项目管理列表 -->
  <div class="projectmanagement">
    <el-row>
      <el-col :span="17">
        <!-- 添加按钮 -->
        <el-button type="success" class="addBtn" @click="addProject"
          >新增审计项目</el-button
        >
      </el-col>
      <el-col :span="5">
        <el-input
          placeholder="请输入内容"
          v-model="query.condition.projectName"
          class="input-with-select"
          @keyup.enter.native="queryName"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="queryName"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button
          style="margin-left: 10%; border: 1px solid #ebeef2"
          @click="queryName"
          >筛选</el-button
        >
      </el-col>
    </el-row>

    <!-- 项目管理列表 -->
    <el-table
      class="table"
      :data="tableData"
      style="margin-top: 1%; width: 100%"
      border
      stripe
      v-loading="loading"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="projectCode" label="项目编号" width="180">
      </el-table-column>
      <el-table-column prop="projectName" label="审计项目名称" width="180">
      </el-table-column>
      <el-table-column prop="auditOrgName" label="被审计对象">
      </el-table-column>
      <el-table-column prop="projectTypeName" label="项目类型">
      </el-table-column>
      <el-table-column prop="specialName" label="专题"></el-table-column>
      <el-table-column prop="fieldName" label="领域"></el-table-column>
      <el-table-column prop="projectLeaderName" label="项目负责人">
      </el-table-column>
      <el-table-column prop="projectChargemanName" label="项目组长">
      </el-table-column>
      <el-table-column prop="auditStartData" label="审计期间" width="250">
        <template slot-scope="scope">
          {{ scope.row.auditStartData }} - {{ scope.row.auditFinishData }}
        </template>
      </el-table-column>
      <el-table-column prop="createUserName" label="创建人"> </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="250">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            style="color: #44a3df"
            size="small"
            @click="editDialog(scope.row)"
          >
            编辑
          </el-button>
        </template>
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
        @current-change="handleCurrentChangeProject"
        :page-size="project.size"
        :total="project.total"
      ></el-pagination>
    </div>
    <!-- 分页 end-->

    <!-- 新增页面 -->
    <el-dialog
      title="新增"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 新增专项的页面 -->
      <div class="addForm" v-if="prjType == 1">
        <el-form
          label-width="100px"
          :rules="rules"
          :model="addProjectManagement"
          ref="form"
        >
          <el-row>
            <el-form-item label="项目编号:" prop="projectCode">
              <el-input
                placeholder=""
                v-model="addProjectManagement.projectCode"
                disabled 
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目类型:" prop="projectTypeName">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.projectTypeName"
                :label-in-value="true"
                @change="selectprojectType"
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
            <el-form-item label="项目名称:" prop="projectName">
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
                  :key="item.peopleTableUuid"
                  :label="item.peopleName"
                  :value="item.peopleTableUuid"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="专  题:" prop="specialName">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.specialName"
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
            <el-form-item label="领   域:" prop="fieldName">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.fieldName"
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
          </el-row>
          <el-row>
            <el-form-item label="审计期间:" class="dataTime">
              <el-col :span="6">
                <el-form-item prop="auditStartData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addProjectManagement.auditStartData"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="auditFinishData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addProjectManagement.auditFinishData"
                    style="margin-left: 5px"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-col :span="15">
              <el-form-item label="设置组长">123</el-form-item>
            </el-col>
          </el-row>
          <el-table
            :data="addProjectManagement.auditList"
            style="width: 100%"
            border
            class="projectTable"
          >
            <el-table-column label="项目编号" prop="projectCode" width="110">
            </el-table-column>
            <el-table-column prop="auditOrgName" label="被审计单位" width="330">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'auditList.' + scope.$index + '.auditOrgName'"
                  :rules="[
                    {
                      required: true,
                      message: '请选择被审计单位',
                      trigger: 'change',
                    },
                  ]"
                >
                  <el-select
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
            <el-table-column label="角色" width="60">组长 </el-table-column>
            <el-table-column
              prop="projectChargemanName"
              label="负责人"
              width="330"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'auditList.' + scope.$index + '.projectChargemanName'"
                  :rules="[
                    {
                      required: true,
                      message: '请选择负责人',
                      trigger: 'change',
                    },
                  ]"
                >
                  <el-select
                    placeholder="请选择"
                    v-model="scope.row.projectChargemanID"
                    @change="LeaderSelect(scope.row)"
                  >
                    <el-option
                      v-for="item in projectpeopleoptions"
                      :key="item.peopleTableUuid"
                      :label="item.peopleName"
                      :value="item.peopleTableUuid"
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
                  style="color: #db454b"
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
          <div class="addIcon" @click="addData">
            <i class="el-icon-plus"></i>
            <span>新增</span>
          </div>
        </el-form>

        <div class="stepBtn">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button class="nextBtn" @click="addSave('form')">确认</el-button>
        </div>
      </div>
      <!-- 新增经责的页面 -->
      <div class="addForm" v-if="prjType == 2">
        <el-form
          label-width="100px"
          :model="addprojectjing"
          ref="addjingForm"
          :rules="addprojectjingRules"
        >
          <el-row>
            <el-form-item label="项目编号:" prop="projectCode">
              <el-input
                placeholder=""
                v-model="addprojectjing.projectCode"
                disabled 
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目类型:" prop="projectTypeName">
              <el-select
                placeholder="请选择"
                v-model="addprojectjing.projectTypeName"
                :label-in-value="true"
                @change="selectprojectType"
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
            <el-form-item label="项目名称:" prop="projectName">
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
                  :key="item.peopleTableUuid"
                  :label="item.peopleName"
                  :value="item.peopleTableUuid"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="专  题:" prop="specialName">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.specialName"
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
            <el-form-item label="领   域:" prop="fieldName">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.fieldName"
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
            <el-form-item label="项目组长:" prop="projectChargemanName">
              <el-select
                placeholder="请选择"
                v-model="addprojectjing.projectChargemanName"
                @change="selectChargeman"
              >
                <el-option
                  v-for="item in projectpeopleoptions"
                  :key="item.peopleTableUuid"
                  :label="item.peopleName"
                  :value="item.peopleTableUuid"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="审计期间:" class="dataTime" required>
              <el-col :span="6">
                <el-form-item prop="auditStartData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addprojectjing.auditStartData"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="auditFinishData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addprojectjing.auditFinishData"
                    style="margin-left: 3px"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="地市接口人:" prop="areaUserName">
              <el-input
                placeholder="请输入"
                v-model="addprojectjing.areaUserName"
              >
              </el-input>
            </el-form-item>
          </el-row>
        </el-form>

        <div class="stepBtn">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button class="nextBtn" @click="nextBtn('addjingForm')"
            >确认</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="编辑"
      :visible.sync="editDialogVisible"
      @close="addDialogClosed"
      width="50%"
    >
     <!-- 专项 -->
      <div class="addForm" v-if="prjType == 1">
        <el-form
          label-width="100px"
          :rules="rules"
          :model="addProjectManagement"
          ref="form"
        >
          <el-row>
            <el-form-item label="项目编号:" prop="projectCode">
              <el-input
                placeholder=""
                v-model="addProjectManagement.projectCode"
                disabled 
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目类型:">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.projectTypeName"
                :label-in-value="true"
                @change="selectprojectType"
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
            <el-form-item label="项目名称:" prop="projectName">
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
                  :key="item.peopleTableUuid"
                  :label="item.peopleName"
                  :value="item.peopleTableUuid"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
           <el-row>
            <el-form-item label="专  题:" prop="specialName">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.specialName"
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
            <el-form-item label="领   域:" prop="fieldName">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.fieldName"
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
          </el-row>
          <el-row>
            <el-form-item label="审计期间:" class="dataTime">
              <el-col :span="6">
                <el-form-item prop="auditStartData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addProjectManagement.auditStartData"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="auditFinishData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addProjectManagement.auditFinishData"
                    style="margin-left: 5px"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
             <el-col :span="15">
              <el-form-item label="设置组长">123</el-form-item>
            </el-col>
            <el-table
              :data="addProjectManagement.auditList"
              style="width: 100%"
              border
              class="projectTable"
            >
              <el-table-column label="项目编号" prop="projectCode" width="110">
              </el-table-column>
              <el-table-column
                prop="auditOrgName"
                label="被审计单位"
                width="330"
              >
                <template slot-scope="scope">
                  <el-form-item prop="auditOrgName">
                    <el-select
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
              <el-table-column label="角色" width="60">组长 </el-table-column>
              <el-table-column
                prop="projectChargemanName"
                label="负责人"
                width="330"
              >
                <template slot-scope="scope">
                  <el-form-item prop="projectChargemanName">
                    <el-select
                      placeholder="请选择"
                      v-model="scope.row.projectChargemanID"
                      @change="LeaderSelect(scope.row)"
                    >
                      <el-option
                        v-for="item in projectpeopleoptions"
                        :key="item.peopleTableUuid"
                        :label="item.peopleName"
                        :value="item.peopleTableUuid"
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
                    style="color: #db454b"
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

        <div class="stepBtn">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button class="nextBtn" @click="editBtn">确认</el-button>
        </div>
      </div>
      <!-- 经责 -->
      <div class="addForm" v-if="prjType == 2">
        <el-form
          label-width="100px"
          :model="addprojectjing"
          :rules="addprojectjingRules"
          ref="editform"
        >
          <el-row>
            <el-form-item label="项目编号:" prop="projectCode">
              <el-input
                placeholder=""
                v-model="addprojectjing.projectCode"
                disabled 
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目类型:">
              <el-select
                placeholder="请选择"
                v-model="addprojectjing.projectTypeName"
                :label-in-value="true"
                @change="selectprojectType"
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
            <el-form-item label="项目名称:" prop="projectName">
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
                  :key="item.peopleTableUuid"
                  :label="item.peopleName"
                  :value="item.peopleTableUuid"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
           <el-row>
            <el-form-item label="专  题:" prop="specialName">
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
            <el-form-item label="领   域:" prop="fieldName">
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
            <el-form-item label="项目组长:" prop="projectChargemanName">
              <el-select
                placeholder="请选择"
                v-model="addprojectjing.projectChargemanName"
                @change="selectChargeman"
              >
                <el-option
                  v-for="item in projectpeopleoptions"
                  :key="item.peopleTableUuid"
                  :label="item.peopleName"
                  :value="item.peopleTableUuid"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="审计期间:" class="dataTime">
              <el-col :span="6">
                <el-form-item prop="auditStartData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addprojectjing.auditStartData"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="auditFinishData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addprojectjing.auditFinishData"
                    style="margin-left: 3px"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="地市接口人:" prop="areaUserName">
              <el-input
                placeholder="请输入"
                v-model="addprojectjing.areaUserName"
              >
              </el-input>
            </el-form-item>
          </el-row>
        </el-form>

        <div class="stepBtn">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button class="nextBtn" @click="editSave">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
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
} from "@WISDOMAUDIT/api/shandong/projectmanagement.js";

export default {
  data() {
    return {
      loading: false,

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
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
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
      // 新增专项的表单验证
      rules: {
        projectTypeName: [
          { required: true, message: "请选择项目分类", trigger: "change" },
        ],
        projectName: [
          { required: true, message: "请填写项目名称", trigger: "blur" }
        ],
        projectLeaderName: [
          { required: true, message: "请选择项目负责人", trigger: "change" },
        ],
        specialName: [
          { required: true, message: "请选择专题", trigger: "change" },
        ],
        fieldName: [
          { required: true, message: "请选择领域", trigger: "change" },
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
      // 添加经责表单校验
      addprojectjingRules: {
        projectName: [
          { required: true, message: "请填写项目名称", trigger: "blur" },
        ],
        projectTypeName: [
          { required: true, message: "请选择项目类型", trigger: "change" },
        ],
        projectLeaderName: [
          { required: true, message: "请选择项目负责人", trigger: "change" },
        ],
        specialName: [
          { required: true, message: "请选择专题", trigger: "change" },
        ],
        fieldName: [
          { required: true, message: "请选择领域", trigger: "change" },
        ],
        auditOrgName: [
          { required: true, message: "请选择被审计单位", trigger: "change" },
        ],
        auditOrgLeader: [
          { required: true, message: "请填写被审计领导", trigger: "blur" },
          { max: 5, message: "被审计领导在5个字符之内", trigger: "change" },
        ],
        projectChargemanName: [
          { required: true, message: "请选择项目组长", trigger: "change" },
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
        areaUserName: [
          { required: true, message: "请填写地市接口人", trigger: "blur" },
          { max: 5, message: "项目名称在5个字符之内", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.projectData(this.query);
    this.selectProjectData(this.projectTypeNum);
    this.selectprojectPeople(this.selectprojectPeopleNum);
    this.selectloadaudittorg(this.selectprojectPeopleNum);
    this.thematicSelect(this.thematic);
    this.areasSelect(this.areas);
  },
  methods: {
    projectData(data) {
      this.loading = true;
      projectList(data).then((resp) => {
        this.tableData = resp.data.records;
        this.project = resp.data;
        this.loading = false;
      });
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
    // 项目类行下拉框
    selectProjectData(data) {
      projectType(data).then((resp) => {
        this.projectTypeoptions = resp.data;
      });
    },

    selectprojectPeople(data) {
      projectPeople(data).then((resp) => {
        this.projectpeopleoptions = resp.data;
        // console.log(this.projectpeopleoptions);
      });
    },
    selectloadaudittorg(data) {
      loadaudittorg(data).then((resp) => {
        this.loadaudittorgoptions = resp.data;
      });
    },
    addProject() {
      this.addDialogVisible = true;
    },
    addData() {
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
    nextBtn(addjingForm) {
      this.$refs[addjingForm].validate((valid) => {
        if (valid) {
          addProject(this.addprojectjing).then((resp) => {
            // console.log(this.addprojectjing);
            this.$message.success("添加项目成功！");
            this.addDialogVisible = false;
            this.projectData(this.query);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$router.go(0);
      this.$refs["form"].resetFields();
    },

    // 项目管理列表分页
    handleCurrentChangeProject(val) {
      // console.log(val);
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
      // 如果不是专项分类
      if (val !== "zxsj") {
        this.prjType = 2;
        this.addprojectjing.projectType = val;
        for (var i = 0; i < this.projectTypeoptions.length; i++) {
          if (val == this.projectTypeoptions[i].value) {
            this.addprojectjing.projectTypeName =
              this.projectTypeoptions[i].label;
            this.addProjectManagement.projectTypeName =
              this.projectTypeoptions[i].label;
          }
        }
        // 获取项目编号
        this.projectTypeSelect.typeCode = val;
        getItemId(this.projectTypeSelect).then((resp) => {
          this.addprojectjing.projectCode = resp.data;
          // console.log(this.addprojectjing.projectCode);
        });
      } else {
        this.prjType = 1;
        this.addProjectManagement.projectType = val;
        for (var i = 0; i < this.projectTypeoptions.length; i++) {
          if (val == this.projectTypeoptions[i].value) {
            this.addProjectManagement.projectTypeName =
              this.projectTypeoptions[i].label;
          }
        }
        // 获取项目编号
        this.projectTypeSelect.typeCode = val;
        getItemId(this.projectTypeSelect).then((resp) => {
          this.addProjectManagement.projectCode = resp.data;
          this.addProjectManagement.auditList[0].projectCode = resp.data;
        });
      }
    },
    selectprojectLeader(val) {
      this.addprojectjing.projectLeaderUuid = val;
      this.addProjectManagement.projectLeaderUuid = val;
      for (let i = 0; i < this.projectpeopleoptions.length; i++) {
        if (val == this.projectpeopleoptions[i].peopleTableUuid) {
          this.addprojectjing.projectLeaderName =
            this.projectpeopleoptions[i].peopleName;
          this.addProjectManagement.projectLeaderName =
            this.projectpeopleoptions[i].peopleName;
        }
      }
      // console.log(this.addprojectjing.projectLeaderUuid);
      // console.log(this.addprojectjing.projectTypeName);
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
      //  console.log(this.addProjectManagement.specialName);
      // console.log(this.addProjectManagement.special);
    },
    //领域下拉框
    selectField(val) {
      this.addProjectManagement.field = val;
      this.addprojectjing.field = val;
      for (let i = 0; i < this.areasOption.length; i++) {
        if (val == this.areasOption[i].value) {
          this.addProjectManagement.fieldName = this.areasOption[i].label;
          this.addprojectjing.fieldName = this.areasOption[i].label;
        }
      }
    },
    selectorg(val) {
      this.addprojectjing.auditOrgUuid = val;
      for (var i = 0; i < this.loadaudittorgoptions.length; i++) {
        if (val == this.loadaudittorgoptions[i].auditOrgUuid) {
          this.addprojectjing.auditOrgName =
            this.loadaudittorgoptions[i].orgName;
        }
      }
      // console.log(this.addprojectjing.auditOrgUuid);
      // console.log(this.addprojectjing.auditOrgName);
    },
    selectChargeman(val) {
      this.addprojectjing.projectChargemanID = val;
      for (var i = 0; i < this.projectpeopleoptions.length; i++) {
        if (val == this.projectpeopleoptions[i].peopleTableUuid) {
          this.addprojectjing.projectChargemanName =
            this.projectpeopleoptions[i].peopleName;
        }
      }
      // console.log(this.addprojectjing.projectChargemanID);
      // console.log(this.addprojectjing.projectChargemanName);
    },
    orgSelect(row) {
      for (var i = 0; i < this.loadaudittorgoptions.length; i++) {
        if (row.auditOrgUuid == this.loadaudittorgoptions[i].auditOrgUuid) {
          row.auditOrgName = this.loadaudittorgoptions[i].orgName;
        }
      }
    },
    LeaderSelect(row) {
      for (var i = 0; i < this.projectpeopleoptions.length; i++) {
        if (
          row.projectChargemanID == this.projectpeopleoptions[i].peopleTableUuid
        ) {
          row.projectChargemanName = this.projectpeopleoptions[i].peopleName;
        }
      }
    },
    addSave(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          addProject(this.addProjectManagement).then((resp) => {
            this.$message.success("添加项目成功！");
            this.addDialogVisible = false;
            this.projectData(this.query);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 编辑
    editDialog(rows) {
      this.editDialogVisible = true;
      if (rows.projectType == "zxsj") {
        this.prjType = 1;
        editProject(rows.managementProjectUuid).then((resp) => {
          this.addProjectManagement = resp.data;
          console.log(this.addProjectManagement);
        });
      } else {
        this.prjType = 2;
        editProject(rows.managementProjectUuid).then((resp) => {
          this.addprojectjing = resp.data;
          console.log(this.addprojectjing);
        });
      }
    },
    // 专项修改按钮事件
    editBtn() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          editProjectUpdata(this.addProjectManagement).then((resp) => {
            this.$message.success("修改成功！");
            this.projectData(this.query);
          });
          this.editDialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 其他项目类型按钮事件
    editSave() {
      this.$refs.editform.validate((valid) => {
        if (valid) {
          editProjectUpdata(this.addprojectjing).then((resp) => {
            this.$message.success("修改成功！");
             this.editDialogVisible = false;
          });
          
         
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteProjectrow(index, rows, obj) {
      // console.log(obj);
      if (!obj.managementProjectUuid) {
        rows.splice(index, 1);
      } else {
        deleteProject(obj.managementProjectUuid).then((resp) => {
          // console.log(resp);
          rows.splice(index, 1);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.projectmanagement {
  padding: 1%;
  .addBtn {
    background: #4bdcb4 !important;
  }
}
.addForm {
  margin-top: 2%;
  .el-select,
  .el-input {
    position: relative;
    top: -35px;
    width: 400px;
  }
  .el-form-item {
    margin-bottom: -25px !important;
  }
  .auditeeInput {
    position: relative;
    top: 0px !important;
    left: -110px !important;
    height: 100%;
    width: 200px;
    height: 64px;
  }
  .addIcon {
    background-color: #fff;
    width: 100%;
    padding: 10px;
    color: #128ad7;
    text-align: center;
    border: 1px solid #ebeef2;
    cursor: pointer;
    margin-bottom: 5%;
  }
}
.stepBtn {
  /* border: 1px solid red; */
  margin-top: 3%;
  text-align: center;
  .nextBtn {
    background: #508ce6 !important;
    color: #fff;
  }
}
.dataTime .el-input {
  width: 190px;
}
.projectTable {
  .el-select {
    width: 200px;
    margin: 45px 0 0 -100px;
  }
}
</style>
<style scoped>
.addForm /deep/ .el-form-item__error {
  position: absolute;
  top: -70%;
  left: 35%;
}
.projectTable /deep/ .el-form-item__error {
  position: absolute;
  top: 15%;
  left: 45%;
}
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
</style>