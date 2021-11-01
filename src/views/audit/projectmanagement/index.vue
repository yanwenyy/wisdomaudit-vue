<template>
  <!-- 项目管理列表 -->
  <div class="projectmanagement">
    <el-row>
      <el-col :span="18">
        <!-- 添加按钮 -->
        <el-button class="queryBtn"  @click="addProject">新增项目</el-button>
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
          <div class="search_icon"
                 style=" background: rgb(12, 135, 214) !important;"
                 @click="queryName">
              <i class="el-icon-search"
                 style="color: white;   "></i>
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
      class="table"
      :data="tableData"
      style="margin-top: 1%; width: 100%"
      border
      stripe
      fit
      :header-cell-style="{'background-color': '#F4FAFF',}"
    >
      <el-table-column type="selection" width="40"> </el-table-column>
      <el-table-column align="center" prop="projectCode" width="105" label="项目编号" show-overflow-tooltip >
      </el-table-column>
      <el-table-column min-width="90px" align="center" prop="projectName" label="审计项目名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" min-width="90px" prop="auditOrgName" label="被审计对象" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" prop="projectTypeName" label="项目类型" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" prop="specialName" label="专题" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="fieldName" label="领域" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" min-width="90px" prop="projectLeaderName" label="项目负责人" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" prop="projectChargemanName" label="项目组长" show-overflow-tooltip>
      </el-table-column>
      <el-table-column  prop="auditStartData" label="审计期间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.auditStartData }} - {{ scope.row.auditFinishData }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createUserName" label="创建人" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建日期" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            style="color: #44a3df; background: none; border: 0"
            size="small"
            @click="editDialog(scope.row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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
      @close="addDialogClosed"
    >
      <div class="title">新增项目</div>
      <!-- 新增专项以及其他的页面 -->
      <div class="addzhuanForm" v-if="prjType == 1">
        <el-form
          label-width="100px"
          :rules="rules"
          :model="addProjectManagement"
          ref="form"
          v-loading="loadingForm"
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
          <el-row>
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
          </el-row>
          <el-row>
            <el-form-item label="ㅤ审计期间:" class="zhuandataTime">
              <el-col :span="8">
                <el-form-item prop="auditStartData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addProjectManagement.auditStartData"
                    @change="changStartTime"
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
                    :picker-options="pickerOptions2"
                    @focus="changeTime"
                    :disabled="isdisabled"
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
            :header-cell-style="{'background-color': '#F4FAFF',}"
          >
            <el-table-column  label="项目编号" prop="projectCode" width="110">
            </el-table-column>
            <el-table-column  prop="auditOrgName" label="被审计单位" width="330">
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
            <!-- <el-table-column label="角色" width="60">组长 </el-table-column> -->
            <el-table-column
              prop="projectChargemanName"
              label="分配组长"
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
          <div class="addIcon" @click="addData">
            <i class="el-icon-plus"></i>
            <span>新增</span>
          </div>
        </el-form>

        <div class="addzhuanBtn">
          <el-button @click="addDialogVisible = false" class="cancel"
            >取消</el-button
          >
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
          v-loading="loadingForm"
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
          <el-row>
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
                <el-form-item prop="auditStartData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addprojectjing.auditStartData"
                    @change="changStartTime"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="margin-left: -5px">
                <el-form-item prop="auditFinishData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addprojectjing.auditFinishData"
                    style="margin-left: 3px"
                    :picker-options="pickerOptions1"
                    @focus="changeTime"
                    :disabled="isdisabled"
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
          <el-button class="nextBtn" @click="nextBtn('addjingForm')"
            >确认</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="editDialogVisible"
      @close="addDialogClosed"
      width="50%"
    >
      <div class="title">编辑审计项目</div>
      <!-- 专项 -->
      <div class="addzhuanForm" v-if="prjType == 1">
        <el-form
          label-width="100px"
          :rules="rules"
          :model="addProjectManagement"
          ref="form"
          v-loading="loadingForm"
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
            <el-form-item label="ㅤ项目类型:">
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
            <el-form-item label="ㅤㅤㅤ专题:" prop="specialName">
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
            <el-form-item label="ㅤㅤㅤ领域:" prop="fieldName">
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
            <el-form-item label="ㅤ审计期间:" class="zhuandataTime">
              <el-col :span="8">
                <el-form-item prop="auditStartData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addProjectManagement.auditStartData"
                    @change="changStartTime"
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
                    :picker-options="pickerOptions2"
                    @focus="changeTime"
                    :disabled="isdisabled"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-col :span="15">
              <el-form-item label="ㅤ设置组长:">123</el-form-item>
            </el-col>
            <el-table
              :data="addProjectManagement.auditList"
              style="width: 100%"
              border
              class="projectTable"
              :header-cell-style="{'background-color': '#F4FAFF',}"
            >
              <el-table-column label="项目编号" prop="projectCode" width="160">
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
              <el-table-column
                prop="projectChargemanName"
                label="设置组长"
                width="330"
              >
                <template slot-scope="scope">
                  <el-form-item prop="projectChargemanName">
                    <el-select
                      placeholder="请选择"
                      v-model="scope.row.projectChargemanName"
                      @change="LeaderSelectEdit(scope.row)"
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
          v-loading="loadingForm"
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
          <el-row>
            <el-form-item label="ㅤㅤㅤ专题:" prop="specialName">
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
            <el-form-item label="ㅤㅤㅤ领域:" prop="fieldName">
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
            <el-form-item label="ㅤ项目组长:" prop="projectChargemanName">
              <el-select
                placeholder="请选择"
                v-model="addprojectjing.projectChargemanName"
                @change="selectChargeman"
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
                <el-form-item prop="auditStartData">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addprojectjing.auditStartData"
                    @change="changStartTime"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="auditFinishData" style="margin-left: -5px">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="addprojectjing.auditFinishData"
                    style="margin-left: 3px"
                    :picker-options="pickerOptions1"
                    @focus="changeTime"
                    :disabled="isdisabled"
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
          <el-button class="nextBtn" @click="editSave">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
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

export default {
  components: { Pagination },
  data() {
    return {
      total:0,
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
      pickerOptions1: {}, //新增经责审计期间判断
      pickerOptions2: {}, //新增专项审计期间判断
      // 新增专项的表单验证
      rules: {
        projectTypeName: [
          { required: true, message: "请选择项目分类", trigger: "change" },
        ],
        projectName: [
          { required: true, message: "请填写项目名称", trigger: "blur" },
        ],
        projectLeaderName: [
          { required: true, message: "请选择项目负责人", trigger: ["blur","change"] },
        ],
        specialName: [
          { required: true, message: "请选择专题", trigger: ["blur","change"] },
        ],
        fieldName: [
          { required: true, message: "请选择领域", trigger: ["blur","change"] },
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
        projectName1: [
          { required: true, message: "请填写项目名称", trigger: "blur" },
        ],
        projectTypeName: [
          { required: true, message: "请选择项目类型", trigger: "change" },
        ],
        projectLeaderName: [
          { required: true, message: "请选择项目负责人", trigger:  ["blur","change"]  },
        ],
        specialName: [
          { required: true, message: "请选择专题", trigger:  ["blur","change"]  },
        ],
        fieldName: [
          { required: true, message: "请选择领域", trigger:  ["blur","change"] },
        ],
        auditOrgName: [
          { required: true, message: "请选择被审计单位", trigger:  ["blur","change"]  },
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
    // this.selectprojectPeople(this.selectprojectPeopleNum);
    this.selectloadaudittorg(this.selectprojectPeopleNum);
    this.thematicSelect(this.thematic);
    this.areasSelect(this.areas);
  },
  methods: {

    changStartTime() {
      this.isdisabled = false;
    },
    //审计期间禁用判断
    changeTime() {
      let _this = this;
      this.pickerOptions1 = {
        disabledDate(time) {
          // console.log(time.getTime());
          return time.getTime() < _this.addprojectjing.auditStartData.getTime();
        },
      };
      this.pickerOptions2 = {
        disabledDate(time) {
          // console.log(time.getTime());
          return (
            time.getTime() < _this.addProjectManagement.auditStartData.getTime()
          );
        },
      };
    },
    //项目列表
    projectData(data) {
      this.loading = true;
      projectList(data).then((resp) => {
        this.tableData = resp.data.records;
        this.project = resp.data;
        
        this.total =resp.data.total;
        console.log(this.total);
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
    //项目负责人接口
    selectprojectPeople(num, size) {
      this.loadingForm = true;
      getProjectMember(num, size).then((resp) => {
        this.projectpeopleoptions = resp.data.list;
        console.log(this.projectpeopleoptions);
        this.loadingForm = false;
      });
    },
    // selectprojectPeople(data) {
    //   projectPeople(data).then((resp) => {
    //     this.projectpeopleoptions = resp.data;
    //     // console.log(this.projectpeopleoptions);
    //   });
    // },
    selectloadaudittorg(data) {
      loadaudittorg(data).then((resp) => {
        this.loadaudittorgoptions = resp.data;
      });
    },
    //新增项目按钮事件
    addProject() {
      this.addDialogVisible = true;
      this.selectprojectPeople(1, 1000);
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
      console.log(val);
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
      console.log(val);
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
        for (let i = 0; i < this.projectTypeoptions.length; i++) {
          if (val == this.projectTypeoptions[i].value) {
            this.addprojectjing.projectTypeName =
              this.projectTypeoptions[i].label;
            this.addProjectManagement.projectTypeName =
              this.projectTypeoptions[i].label;
          }
        }
        // 获取项目编号
        this.projectTypeSelect.typecode = val;
        getItemId(this.projectTypeSelect).then((resp) => {
          this.addprojectjing.projectCode = resp.data;
          // console.log(this.addprojectjing.projectCode);
        });
      }
      var that=this;
      if(val){
        this.$nextTick(() => {
          if(that.$refs['addjingForm']!=undefined){
            that.$refs['addjingForm'].clearValidate()
          }else{
            that.$refs['form'].clearValidate()
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
      console.log(this.addProjectManagement);
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
    //经责项目组长下拉框事件
    selectChargeman(val) {
      this.addprojectjing.projectChargemanID = val;
      for (let i = 0; i < this.projectpeopleoptions.length; i++) {
        if (val == this.projectpeopleoptions[i].id) {
          this.addprojectjing.projectChargemanName =
            this.projectpeopleoptions[i].realName;
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

        //添加专项table数组根据某一个字段去重
      var result = [];
      var obj = {};
      for (let i = 0; i < this.addProjectManagement.auditList.length; i++) {
        if (!obj[this.addProjectManagement.auditList[i].auditOrgUuid] || !obj[this.addProjectManagement.auditList[i].projectChargemanID]) {
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
      // console.log(this.addProjectManagement.auditList);
      // console.log(row);
      // this.addProjectManagement.auditList.forEach(item =>{
      //   if(item.auditOrgUuid == row.auditOrgUuid && item.projectChargemanID == row.projectChargemanID){
      //     alert(123)
      //   }
      // })
      //添加专项table数组根据某一个字段去重
      var result = [];
      var obj = {};
      for (let i = 0; i < this.addProjectManagement.auditList.length; i++) {
        if (!obj[this.addProjectManagement.auditList[i].auditOrgUuid] || !obj[this.addProjectManagement.auditList[i].projectChargemanID]) {
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
        if (!obj[this.addProjectManagement.auditList[i].auditOrgUuid] || !obj[this.addProjectManagement.auditList[i].projectChargemanID]) {
          result.push(this.addProjectManagement.auditList[i]);
          obj[this.addProjectManagement.auditList[i].auditOrgUuid] = true;
          obj[this.addProjectManagement.auditList[i].projectChargemanID] = true;
        }
      }
      this.addProjectManagement.auditList = result;
    },

    addSave(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          addProject(this.addProjectManagement).then((resp) => {
            this.$message.success("添加项目成功！");
           // this.addDialogVisible = false;
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
      this.selectprojectPeople(1, 1000);
      if (rows.projectType == "jzsj") {
        this.prjType = 2;
        editProject(rows.managementProjectUuid).then((resp) => {
          this.addprojectjing = resp.data;
          console.log(this.addprojectjing);
        });
      } else {
         this.prjType = 1;
        editProject(rows.managementProjectUuid).then((resp) => {
          this.addProjectManagement = resp.data;
          console.log(this.addProjectManagement);
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
            this.editDialogVisible = false;
          });    
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
  margin-left: 20%;
  .el-select,
  .el-input {
    position: relative;
    top: -35px;
    width: 65%;
  }
  .el-form-item {
    margin-bottom: -25px !important;
  }
  .addIcon {
    background-color: #fff;
    width: 95%;
    padding: 10px;
    color: #128ad7;
    text-align: center;
    border: 1px solid #ebeef2;
    cursor: pointer;
    margin-bottom: 5%;
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
    margin-bottom: -25px !important;
  }
  .addIcon {
    background-color: #fff;
    width: 98.5%;
    padding: 10px;
    color: #128ad7;
    text-align: center;
    border: 1px solid #ebeef2;
    cursor: pointer;
    margin-bottom: 5%;
  }
}
.addzhuanBtn {
  //  border: 1px solid red;
  margin-top: 3%;
  text-align: right;
  .nextBtn {
    background: #508ce6 !important;
    color: #fff;
  }
}
.stepBtn {
  width: 100%;
  padding: 2%;
  // border: 1px solid red;
  margin-top: 3%;
  text-align: right;
  .nextBtn {
    background: #508ce6 !important;
    color: #fff;
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
    margin: 45px 0 0 -100px;
  }
}
.title {
  border-bottom: 1px solid #d2d2d2;
  padding: 10px;
  text-align: center;
  margin-bottom: 3%;
}
.cancel {
  border: 1px solid #d2d2d2;
}
</style>
<style scoped>
  @import '../../../assets/styles/css/yw.css';
.addForm /deep/ .el-form-item__error {
  position: absolute;
  top: -70%;
  left: 35%;
}
.addzhuanForm /deep/ .el-form-item__error {
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
.projectmanagement{
  background: #FFF;
}
>>> .el-input__inner::-webkit-input-placeholder {
  color: #C0C4CC !important;
}
>>> .queryBtn{
  background: #0C87D6 !important;
  color: #FFF;
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
  right:0%;
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
>>> .el-dialog__body{
  padding: 5px 0 !important;
}
.addForm >>> .el-input.is-disabled .el-input__inner{
  background-color: #F5F7FA!important;
  color:#C0C4CC!important;
}
.addzhuanForm >>> .el-input.is-disabled .el-input__inner{
  background-color: #F5F7FA!important;
  color:#C0C4CC!important;
}
</style>
