<template>
  <!-- 项目管理列表 -->
  <div class="projectmanagement">
    <el-row>
      <el-col :span="18">
        <!-- 添加按钮 -->
        <el-button class="queryBtn"
                   @click="addProject('addjingForm')">新增项目</el-button>
      </el-col>
      <!-- <el-col :span="4" > -->
      <div class="search">
        <el-input placeholder="请输入项目名称"
                  v-model="query.condition.projectName"
                  @keyup.enter.native="queryName">
          <!-- <el-button
            class="queryBtn"
            slot="append"
            type="primary"
            icon="el-icon-search"
            @click="queryName"
          ></el-button> -->
        </el-input>
        <div class="search_icon"
             style="background: rgb(12, 135, 214) !important"
             @click="queryName">
          <i class="el-icon-search"
             style="color: white"></i>
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
    <el-table class="table"
              :data="tableData"
              style="margin-top: 1%; width: 100%"
              border
              stripe
              fit
              :header-cell-style="{ 'background-color': '#F4FAFF' }">
      <el-table-column type="selection"
                       width="40"> </el-table-column>
      <el-table-column align="center"
                       prop="projectCode"
                       width="105"
                       label="项目编号"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column min-width="90px"
                       align="center"
                       prop="projectName"
                       label="审计项目名称"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center"
                       min-width="90px"
                       prop="auditOrgName"
                       label="被审计对象"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center"
                       prop="projectTypeName"
                       label="项目类型"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center"
                       prop="specialName"
                       label="专题"
                       show-overflow-tooltip></el-table-column>
      <el-table-column align="center"
                       prop="fieldName"
                       label="领域"
                       show-overflow-tooltip></el-table-column>
      <el-table-column align="center"
                       min-width="90px"
                       prop="projectLeaderName"
                       label="项目负责人"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center"
                       prop="projectChargemanName"
                       label="项目组长"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="auditStartData"
                       label="审计期间"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.auditStartData }} - {{ scope.row.auditFinishData }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       prop="createUserName"
                       label="创建人"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center"
                       prop="createTime"
                       label="创建日期"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作"
                       width="180">
        <template slot-scope="scope">
          <el-button type="text"
                     style="color: #44a3df; background: none; border: 0"
                     size="small"
                     @click="editDialog(scope.row)">
            编辑
          </el-button>

          <el-button type="text"
                     style="color: #44a3df; background: none; border: 0"
                     size="small"
                     @click="confirm_problem(scope.row.managementProjectUuid)">
            确认整改问题清单
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <!-- 设置整改跟进人 启动整改 -->
    <div class="setting_people">
      <el-button type="primary"
                 @click="setting_prople()">设置整改跟进人</el-button>
      <el-button type="primary"
                 @click="run_rectification()">启动整改</el-button>
    </div>

    <!-- 分页 -->
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="query.pageNo"
                :limit.sync="query.pageSize"
                @pagination="queryName" />
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
    <el-dialog :visible.sync="addDialogVisible"
               width="47%"
               @close="addDialogClosed('addjingForm')">
      <div class="title">新增项目</div>
      <!-- 新增专项以及其他的页面 -->
      <div class="addzhuanForm"
           v-if="prjType == 1">
        <el-form label-width="100px"
                 :rules="rules"
                 :model="addProjectManagement"
                 ref="addjingForm"
                 label-position="right"
                 hide-required-asterisk>
          <el-row>
            <el-form-item label="ㅤ项目编号:"
                          prop="projectCode">
              <el-input placeholder=""
                        v-model="addProjectManagement.projectCode"
                        disabled></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目类型:"
                          prop="projectTypeName">
              <el-select placeholder="请选择"
                         v-model="addProjectManagement.projectTypeName"
                         :label-in-value="true"
                         @change="selectprojectType"
                         filterable>
                <el-option v-for="item in projectTypeoptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目名称:"
                          prop="projectName">
              <el-input placeholder="请输入"
                        v-model="addProjectManagement.projectName">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目负责人:"
                          prop="projectLeaderName">
              <el-select placeholder="请选择"
                         v-model="addProjectManagement.projectLeaderName"
                         @change="selectprojectLeader"
                         filterable>
                <el-option v-for="item in projectpeopleoptions"
                           :key="item.id"
                           :label="item.realName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
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
          </el-row>
          <el-row>
            <el-form-item label="ㅤㅤㅤ领域:"
                          prop="fieldName">
              <el-select placeholder="请选择"
                         v-model="addProjectManagement.fieldName"
                         @change="selectField"
                         filterable>
                <el-option v-for="item in areasOption"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ审计期间:"
                          class="zhuandataTime">
              <el-col :span="8">
                <el-form-item prop="auditStartData">
                  <el-date-picker type="date"
                                  placeholder="请选择"
                                  v-model="addProjectManagement.auditStartData"
                                  @change="changStartTime"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="auditFinishData"
                              style="margin-left: -5px">
                  <el-date-picker type="date"
                                  placeholder="请选择"
                                  v-model="addProjectManagement.auditFinishData"
                                  style="margin-left: 5px"
                                  :picker-options="pickerOptions2"
                                  @focus="changeTime"
                                  :disabled="isdisabled"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-col :span="15">
              <el-form-item label="ㅤ设置组长:">&nbsp;&nbsp;</el-form-item>
            </el-col>
          </el-row>
          <el-table :data="addProjectManagement.auditList"
                    style="width: 100%"
                    border
                    class="projectTable"
                    :header-cell-style="{ 'background-color': '#F4FAFF' }">
            <el-table-column label="项目编号"
                             prop="projectCode"
                             width="150px">
            </el-table-column>
            <el-table-column prop="auditOrgName"
                             label="被审计单位">
              <template slot-scope="scope">
                <el-form-item :prop="'auditList.' + scope.$index + '.auditOrgName'"
                              :rules="[
                    {
                      required: true,
                      message: '请选择被审计单位',
                      trigger: 'change',
                    },
                  ]">
                  <el-select style="width: 120%"
                             placeholder="请选择"
                             v-model="scope.row.auditOrgUuid"
                             @change="orgSelect(scope.row)">
                    <el-option v-for="item in loadaudittorgoptions"
                               :key="item.auditOrgUuid"
                               :label="item.orgName"
                               :value="item.auditOrgUuid">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- <el-table-column label="角色" width="60">组长 </el-table-column> -->
            <el-table-column prop="projectChargemanName"
                             label="分配组长">
              <template slot-scope="scope">
                <el-form-item :prop="'auditList.' + scope.$index + '.projectChargemanName'"
                              :rules="[
                    {
                      required: true,
                      message: '请选择负责人',
                      trigger: 'change',
                    },
                  ]">
                  <el-select style="width: 120%"
                             placeholder="请选择"
                             v-model="scope.row.projectChargemanID"
                             @change="LeaderSelect(scope.row)">
                    <el-option v-for="item in projectpeopleoptions"
                               :key="item.id"
                               :label="item.realName"
                               :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             width="80">
              <template slot-scope="scope">
                <el-button type="text"
                           style="color: #db454b; background: none; border: 0"
                           size="small"
                           @click.native.prevent="
                    deleteRow(scope.$index, addProjectManagement.auditList)
                  ">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="addIcon"
               @click="addData">
            <i class="el-icon-plus"></i>
            <span>新增</span>
          </div>
        </el-form>

        <div class="addzhuanBtn">
          <el-button @click="addDialogVisible = false"
                     class="cancel">取消</el-button>
          <el-button class="nextBtn"
                     @click="addSave('addjingForm')">确认</el-button>
        </div>
      </div>
      <!-- 新增经责的页面 -->
      <div class="addForm"
           v-if="prjType == 2">
        <el-form label-width="100px"
                 :model="addprojectjing"
                 ref="addjingForm"
                 :rules="addprojectjingRules"
                 hide-required-asterisk>
          <el-row>
            <el-form-item label="ㅤ项目编号:"
                          prop="projectCode">
              <el-input placeholder=""
                        v-model="addprojectjing.projectCode"
                        disabled></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目类型:"
                          prop="projectTypeName">
              <el-select placeholder="请选择"
                         v-model="addprojectjing.projectTypeName"
                         :label-in-value="true"
                         @change="selectprojectType"
                         filterable>
                <el-option v-for="item in projectTypeoptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目名称:"
                          prop="projectName">
              <el-input placeholder="请输入"
                        v-model="addprojectjing.projectName">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目负责人:"
                          prop="projectLeaderName">
              <el-select placeholder="请选择"
                         v-model="addprojectjing.projectLeaderName"
                         @change="selectprojectLeader"
                         filterable>
                <el-option v-for="item in projectpeopleoptions"
                           :key="item.id"
                           :label="item.realName"
                           :value="item.id">
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
            <el-form-item label="被审计单位:"
                          prop="auditOrgName">
              <el-select placeholder="请选择"
                         v-model="addprojectjing.auditOrgName"
                         @change="selectorg"
                         filterable>
                <el-option v-for="item in loadaudittorgoptions"
                           :key="item.auditOrgUuid"
                           :label="item.orgName"
                           :value="item.auditOrgUuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="被审计领导:"
                          prop="auditOrgLeader">
              <el-input placeholder="请输入"
                        v-model="addprojectjing.auditOrgLeader">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目组长:"
                          prop="projectChargemanName">
              <el-select placeholder="请选择"
                         v-model="addprojectjing.projectChargemanName"
                         @change="selectChargeman"
                         filterable>
                <el-option v-for="item in projectpeopleoptions"
                           :key="item.id"
                           :label="item.realName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ审计期间:"
                          class="dataTime"
                          required>
              <el-col :span="8">
                <el-form-item prop="auditStartData">
                  <el-date-picker type="date"
                                  placeholder="请选择"
                                  v-model="addprojectjing.auditStartData"
                                  @change="changStartTime"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8"
                      style="margin-left: -5px">
                <el-form-item prop="auditFinishData">
                  <el-date-picker type="date"
                                  placeholder="请选择"
                                  v-model="addprojectjing.auditFinishData"
                                  style="margin-left: 3px"
                                  :picker-options="pickerOptions1"
                                  @focus="changeTime"
                                  :disabled="isdisabled"></el-date-picker>
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
          <el-button @click="addDialogVisible = false"
                     class="cancel">取消</el-button>
          <el-button class="nextBtn"
                     @click="nextBtn('addjingForm')">确认</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="editDialogVisible"
               @close="editDialogClosed('addjingForm')"
               width="50%">
      <div class="title">编辑项目</div>
      <!-- 专项 -->
      <div class="addzhuanForm"
           v-if="prjType == 1">
        <el-form label-width="100px"
                 :rules="rules"
                 :model="addProjectManagement"
                 ref="editform"
                 hide-required-asterisk>
          <el-row>
            <el-form-item label="ㅤ项目编号:"
                          prop="projectCode">
              <el-input placeholder=""
                        v-model="addProjectManagement.projectCode"
                        disabled></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目类型:"
                          prop="projectTypeName">
              <el-select placeholder="请选择"
                         v-model="addProjectManagement.projectTypeName"
                         :label-in-value="true"
                         @change="selectprojectType"
                         disabled>
                <el-option v-for="item in projectTypeoptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目名称:">
              <el-input placeholder="请输入"
                        v-model="addProjectManagement.projectName">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目负责人:"
                          prop="projectLeaderName">
              <el-select placeholder="请选择"
                         v-model="addProjectManagement.projectLeaderName"
                         @change="selectprojectLeader">
                <el-option v-for="item in projectpeopleoptions"
                           :key="item.id"
                           :label="item.realName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
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
          </el-row>
          <el-row>
            <el-form-item label="ㅤㅤㅤ领域:"
                          prop="fieldName">
              <el-select placeholder="请选择"
                         v-model="addProjectManagement.fieldName"
                         @change="selectField">
                <el-option v-for="item in areasOption"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ审计期间:"
                          class="zhuandataTime">
              <el-col :span="8">
                <el-form-item prop="auditStartData">
                  <el-date-picker type="date"
                                  placeholder="请选择"
                                  v-model="addProjectManagement.auditStartData"
                                  @change="changStartTime"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="auditFinishData"
                              style="margin-left: -5px">
                  <el-date-picker type="date"
                                  placeholder="请选择"
                                  v-model="addProjectManagement.auditFinishData"
                                  style="margin-left: 5px"
                                  :picker-options="pickerOptions2"
                                  @focus="changeTime"
                                  :disabled="isdisabled"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-col :span="15">
              <el-form-item label="ㅤ设置组长:">&nbsp;&nbsp;</el-form-item>
            </el-col>
            <el-table :data="addProjectManagement.auditList"
                      style="width: 100%"
                      border
                      class="projectTable"
                      :header-cell-style="{ 'background-color': '#F4FAFF' }">
              <el-table-column label="项目编号"
                               prop="projectCode"
                               width="160">
              </el-table-column>
              <el-table-column prop="auditOrgName"
                               label="被审计单位">
                <template slot-scope="scope">
                  <el-form-item prop="auditOrgName">
                    <el-select style="width: 120%"
                               placeholder="请选择"
                               v-model="scope.row.auditOrgUuid"
                               @change="orgSelect(scope.row)">
                      <el-option v-for="item in loadaudittorgoptions"
                                 :key="item.auditOrgUuid"
                                 :label="item.orgName"
                                 :value="item.auditOrgUuid">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="projectChargemanName"
                               label="设置组长">
                <template slot-scope="scope">
                  <el-form-item prop="projectChargemanName">
                    <el-select style="width: 120%"
                               placeholder="请选择"
                               v-model="scope.row.projectChargemanName"
                               @change="LeaderSelectEdit(scope.row)">
                      <el-option v-for="item in projectpeopleoptions"
                                 :key="item.id"
                                 :label="item.realName"
                                 :value="item.realName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作"
                               width="80">
                <template slot-scope="scope">
                  <el-button type="text"
                             style="color: #db454b; background: none; border: 0"
                             size="small"
                             @click.native.prevent="
                      deleteProjectrow(
                        scope.$index,
                        addProjectManagement.auditList,
                        scope.row
                      )
                    ">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="addIcon"
                 @click="addData">
              <i class="el-icon-plus"></i>
              <span>新增</span>
            </div>
          </el-row>
        </el-form>

        <div class="addzhuanBtn">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button class="nextBtn"
                     @click="editBtn">确认</el-button>
        </div>
      </div>
      <!-- 经责 -->
      <div class="addForm"
           v-if="prjType == 2">
        <el-form label-width="100px"
                 :model="addprojectjing"
                 :rules="addprojectjingRules"
                 ref="editform"
                 hide-required-asterisk>
          <el-row>
            <el-form-item label="ㅤ项目编号:"
                          prop="projectCode">
              <el-input placeholder=""
                        v-model="addprojectjing.projectCode"
                        disabled></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目类型:">
              <el-select placeholder="请选择"
                         v-model="addprojectjing.projectTypeName"
                         :label-in-value="true"
                         @change="selectprojectType"
                         disabled>
                <el-option v-for="item in projectTypeoptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目名称:">
              <el-input placeholder="请输入"
                        v-model="addprojectjing.projectName">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目负责人:"
                          prop="projectLeaderName">
              <el-select placeholder="请选择"
                         v-model="addprojectjing.projectLeaderName"
                         @change="selectprojectLeader">
                <el-option v-for="item in projectpeopleoptions"
                           :key="item.id"
                           :label="item.realName"
                           :value="item.id">
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
            <el-form-item label="被审计单位:"
                          prop="auditOrgName">
              <el-select placeholder="请选择"
                         v-model="addprojectjing.auditOrgName"
                         @change="selectorg">
                <el-option v-for="item in loadaudittorgoptions"
                           :key="item.auditOrgUuid"
                           :label="item.orgName"
                           :value="item.auditOrgUuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="被审计领导:"
                          prop="auditOrgLeader">
              <el-input placeholder="请输入"
                        v-model="addprojectjing.auditOrgLeader">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ项目组长:"
                          prop="projectChargemanName">
              <el-select placeholder="请选择"
                         v-model="addprojectjing.projectChargemanName"
                         @change="selectChargeman">
                <el-option v-for="item in projectpeopleoptions"
                           :key="item.id"
                           :label="item.realName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="ㅤ审计期间:"
                          class="editdataTime">
              <el-col :span="8">
                <el-form-item>
                  <el-date-picker type="date"
                                  placeholder="请选择"
                                  v-model="addprojectjing.auditStartData"
                                  @change="changStartTime"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item style="margin-left: -5px">
                  <el-date-picker type="date"
                                  placeholder="请选择"
                                  v-model="addprojectjing.auditFinishData"
                                  style="margin-left: 3px"
                                  :picker-options="pickerOptions1"
                                  @focus="changeTime"
                                  :disabled="isdisabled"></el-date-picker>
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
          <el-button class="nextBtn"
                     @click="editSave">确认</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 设置整改跟进人 -->
    <el-dialog title=""
               center
               :visible.sync="dialogVisible_setting_prople"
               width="width">
      <div slot="footer">
        <el-button @click="dialogVisible_setting_prople = false">取 消</el-button>
        <el-button type="primary"
                   @click="save_follow_up_person()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 设置整改跟进人 end-->

    <!-- 启动整改 -->
    <el-dialog title=""
               center
               :visible.sync="dialogVisible_rectification"
               width="15%">
      <div class="title">是否确认启动整改</div>

      <div class="dialog"></div>
      <div slot="footer">
        <el-button plain
                   @click="dialogVisible_rectification = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogVisible_rectification = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 启动整改 end-->

    <!-- 确认整改清单 -->
    <el-dialog title=""
               center
               :visible.sync="confirm_problem_dlag"
               width="width">
      <div class="title">确认问题整改清单</div>

      <div class="dialog">
        <div class="header_dlag">
          <!-- search -->
          <div class="search">
            <el-input placeholder="请输入问题"
                      v-model="problem_list_query.search_issues_list"> </el-input>
            <div class="search_icon"
                 style=" background: rgb(12, 135, 214) !important;"
                 @click="search_list_issues()">
              <i class="el-icon-search"
                 style="color: white;   "></i>
            </div>
          </div>
          <!-- search end -->
          <el-button type="primary"
                     style="margin: 0 10px;"
                     size="small"
                     @click="select_problem()">选择问题</el-button>
        </div>
        <!-- 选择后的的问题清单 -->
        <div class="table_list">
          <el-table :data="issues_list.records"
                    :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
                    v-loading="issues_list_loading"
                    style="width: 100%"
                    @selection-change="handleSelectionChange_problem">

            <!-- <el-table-column type="selection"
                             align="center"> </el-table-column> -->
            <el-table-column type="index"
                             label="序号"
                             width="50">
            </el-table-column>
            <el-table-column align="center"
                             prop="problem"
                             label="问题"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center"
                             prop="discoveryTime"
                             label="发表日期"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center"
                             prop="riskAmount"
                             label="风险金额(元)"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center"
                             prop="problemFindPeople"
                             label="发现人"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center"
                             label="操作"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="primary"
                           size="small"
                           @click="edit(1,scope.row)">编辑</el-button>
                <el-button type="primary"
                           size="small"
                           @click="edit(2,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
        <div class="page">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="this.issues_list.current"
                         :page-sizes="[100, 200, 300, 400]"
                         :page-size="this.issues_list.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="this.issues_list.total">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
    <!-- 确认整改清单 end-->

    <!-- 确认整改清单 编辑 -->
    <el-dialog center
               title=""
               :close-on-click-modal="false"
               :visible.sync="confirm_problem_dlag_edit"
               width="width">
      <div class="title">编辑问题</div>
      <div class="dialog2 auditproblem">
        <el-form ref="detailForm"
                 :model="dqProblem"
                 :rules="rules"
                 label-position="right"
                 label-width="120px"
                 class="problem-form">
          <el-form-item label="问题"
                        prop="problem">
            <el-input v-model="dqProblem.problem"
                      placeholder="请输入问题" />
          </el-form-item>
          <el-form-item label="领域"
                        prop="field">
            <el-select v-model="dqProblem.field"
                       placeholder="请选择领域">
              <el-option v-for="item in CategoryList"
                         :key="item.label"
                         :label="item.label"
                         :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专题"
                        prop="special">
            <el-select v-model="dqProblem.special"
                       placeholder="请选择专题">
              <el-option v-for="item in SPECIALList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item></el-form-item>
          <el-form-item label="依据"
                        prop="basis"
                        class="long">
            <el-select v-model="dqProblem.basis"
                       multiple
                       @visible-change="toopen"
                       placeholder="请选择"
                       no-data-text="请点击引用审计依据">
            </el-select>
          </el-form-item>
          <el-button type="primary"
                     ref="basisbtn0"
                     class="citebtn"
                     @click="openbasis()">引用审计依据</el-button>
          <el-form-item label="描述"
                        prop="describe"
                        class="long">
            <el-input v-model="dqProblem.describe"
                      placeholder="请输入描述" />
          </el-form-item>
          <el-form-item label="管理建议"
                        prop="managementAdvice"
                        class="long">
            <el-input v-model="dqProblem.managementAdvice"
                      placeholder="请输入管理建议" />
          </el-form-item>
          <el-form-item label="发现日期"
                        prop="problemDiscoveryTime">
            <el-date-picker type="date"
                            placeholder="选择日期"
                            v-model="dqProblem.problemDiscoveryTime"
                            style="width: 100%"></el-date-picker>
          </el-form-item>
          <el-form-item label="发现人"
                        prop="problemFindPeople">
            <el-select v-model="dqProblem.problemFindPeople"
                       placeholder="请选择发现人">
              <el-option v-for="(item,i) in personlist"
                         :key="'person'+i"
                         :label="item.realName"
                         :value="item.realName">
                {{item.realName}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="风险金额（万元）"
                        prop="riskAmount"
                        width="180">
            <el-input v-model.number="dqProblem.riskAmount"
                      placeholder="请输入风险金额" />
          </el-form-item>
          <el-form-item label="关联任务"
                        prop="auditTaskUuid">
            <el-select v-model="dqProblem.auditTaskUuid"
                       multiple
                       disabled
                       placeholder="请选择">
              <el-option v-for="item in auditTasklList"
                         :key="item.auditTaskUuid"
                         :label="item.taskName"
                         :value="item.auditTaskUuid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="confirm_problem_dlag_edit = false">取 消</el-button>
        <el-button type="primary"
                   @click="updateData()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 确认整改清单 编辑 end-->

    <!-- 引用审计依据 -->
    <el-dialog title=""
               center
               :visible.sync="basisdialog"
               width="60%"
               custom-class="outmax">

      <div class="title">编辑问题</div>
      <div class="auditproblem">
        <div style="display: flex; height: 100%; padding: 20px">
          <div style="max-height: 60vh; width: 50%; overflow: scroll">
            <el-form ref="basisform"
                     class="problem-form"
                     :model="dqbasis"
                     label-width="120px"
                     label-position="right">
              <el-form-item label="审计依据名称"
                            class="long">
                <el-select v-model="dqbasis.val"
                           placeholder="请选择依据名称"
                           @change="getbasisdetail(dqbasis.val)">
                  <el-option v-for="item in basislist"
                             :key="item.basy_uuid"
                             :label="item.basy_name"
                             :value="item.basy_uuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-card class="box-card"
                     style="width: 70%; min-height: 300px; margin: auto">
              <el-tree :data="dqbasis.info.tree"
                       :props="defaultProps"
                       @node-click="treeNodeClick"
                       default-expand-all
                       v-loading="basisload"></el-tree>
            </el-card>
          </div>
          <el-card class="box-card basiscard"
                   style="width: 50%"
                   v-loading="basisload">
            <div v-for="(item, index) in dqbasis.info.arr"
                 :key="'dqbasisarr' + index">
              <div slot="header"
                   class="clearfix">
                <span style="font-weight: bold"
                      :style="
                  item.contentLev == 1
                    ? 'font-size:18px;'
                    : item.contentLev == 2
                    ? 'font-size:16px;'
                    : 'font-size:14px;'
                ">{{ item.label }}</span>
                <el-button style="padding: 3px 0 3px 20px; color: #ffba00"
                           v-if="item.contentLev == 3"
                           @click="choosebasis(item.label)"
                           type="text">引用</el-button>
              </div>
              <p class="">{{ item.attachmentContent }}</p>
            </div>
          </el-card>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="basisdialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="surebasis()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 引用审计依据 end -->

    <!-- 选择问题 -->
    <el-dialog title=""
               center
               :visible.sync="dialogVisible_select_dialog"
               width="width">
      <div class="title">选择问题</div>

      <div class="dialog">
        <div class="header_dlag">
          <div class="search">
            <el-input placeholder="请输入问题"
                      v-model="queryProblemList_query.search_problem"> </el-input>
            <div class="search_icon"
                 style=" background: rgb(12, 135, 214) !important;"
                 @click="search_list_problem()">
              <i class="el-icon-search"
                 style="color: white;   "></i>
            </div>
          </div>

        </div>
        <div class="table_list over_auto">
          <el-table :data="problem_list"
                    :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
                    v-loading="problem_loading"
                    style="width: 100%"
                    @selection-change="handleSelectionChange_issues">

            <el-table-column type="selection"
                             align="center"> </el-table-column>
            <el-table-column align="center"
                             prop="problem"
                             label="问题"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <p class="problem_name"> {{scope.row.problem}}</p>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             prop="field"
                             label="领域"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center"
                             prop="discoveryTime"
                             label="发现日期"
                             show-overflow-tooltip>

            </el-table-column>
            <el-table-column align="center"
                             prop="riskAmount"
                             label="风险金额"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center"
                             prop="problemFindPeople"
                             label="发现人"
                             show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>

      </div>
      <div slot="footer">
        <el-button plain
                   @click="dialogVisible_select_dialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="save_problem()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { get_userInfo } from "@SDMOBILE/api/shandong/ls";
import { confirm_rectification, selection_questions_list, saveProblemCorrect, edit_remove } from "@SDMOBILE/api/shandong/adminProject";//lhg
import axios from "axios";
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
import { Checkbox } from 'element-ui';
import { fmtDate } from '@SDMOBILE/model/time.js';

export default {
  components: { Pagination },
  data () {
    return {
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
          projectName: "2021年度某公司经责审计项目03",
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
          {
            required: true,
            message: "请选择项目负责人",
            trigger: ["blur", "change"],
          },
        ],
        specialName: [
          {
            required: true,
            message: "请选择专题",
            trigger: ["blur", "change"],
          },
        ],
        fieldName: [
          {
            required: true,
            message: "请选择领域",
            trigger: ["blur", "change"],
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
      },
      // 添加经责表单校验
      addprojectjingRules: {
        // projectName: [
        //   { required: true, message: "请填写项目名称", trigger: "blur" },
        // ],
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
        search_issues_list: '',//筛选清单
        managementProjectUuid: '',//清单列表项目id
        pageNo: 1,
        pageSize: 10,
      },
      confirm_problem_dlag: false,//问题确认清单
      issues_list_loading: false,//清单loading
      issues_list: [],//问题清单
      search_details: '',//  筛选清单
      check_detailed: [],//勾选的清单

      entity_isDeleted: '',//'':编辑 1:删除 清单编辑删除
      list_check: {},// 编辑删除 穿参
      // //选择问题 参数
      queryProblemList_query: {
        search_problem: '',//  筛选问题
      },

      confirm_problem_dlag_edit: false,//问题清单编辑
      dqProblem: {},
      // 新增的表单验证
      rules: {
        auditTaskUuid: [
          { required: true, message: "请选择关联任务", trigger: "change" },
        ],
        basis: [{ required: true, message: "请选择依据", trigger: "change" }],
        describe: [
          { required: true, message: "请填写描述", trigger: "blue" },
        ],
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
      basisdialog: false,//引用依据

      closeStatus: false,
      downloadLoading: false,
      headers: { "Content-Type": "multipart/form-data" },
      file: "",
      problemtableSelection: [],
      CategoryList: [],//领域
      SPECIALList: [],//专题
      auditTasklList: [],
      basislist: [],//获取的依据
      dqbasis: {
        val: "",
        info: "",
        choose: [],
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      basisload: false,
      ifadd: 0,
      personlist: [],
      me: '',


      dialogVisible_select_dialog: false,//选择问题
      problem_loading: false,//问题loading
      problem_list: [],//问题列表
      check_problem: [],//勾选的问题

      dialogVisible_setting_prople: false,//项目整改跟进人
      dialogVisible_rectification: false,//启动整改




    };
  },
  created () {
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
    this.getbasis();//获取依据 任务select 
    this.getSelectTask();//关联任务


  },
  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      // return fmtDate(t, 'yyyy-MM-dd hh:mm:ss');
      return fmtDate(t, 'yyyy-MM-dd ');
    }
  },
  methods: {
    changStartTime () {
      this.isdisabled = false;
      this.changeTime();
    },
    //审计期间禁用判断
    changeTime () {
      let _this = this;
      this.pickerOptions1 = {
        disabledDate (time) {
          // 
          return time.getTime() < _this.addprojectjing.auditStartData.getTime();
        },
      };
      this.pickerOptions2 = {
        disabledDate (time) {
          // 
          return (
            time.getTime() < _this.addProjectManagement.auditStartData.getTime()
          );
        },
      };
    },
    //项目列表
    projectData (data) {
      this.loading = true;
      projectList(data).then((resp) => {
        this.tableData = resp.data.records;
        this.project = resp.data;
        this.total = resp.data.total;
        this.loading = false;
      });
    },
    // 专题下拉框
    thematicSelect (data) {
      thematicAreas(data).then((resp) => {
        this.thematicOption = resp.data;
        // 
      });
    },
    //领域下拉框
    areasSelect (data) {
      thematicAreas(data).then((resp) => {
        this.areasOption = resp.data;
        // 
      });
    },
    // 项目类行下拉框
    selectProjectData (data) {
      projectType(data).then((resp) => {
        this.projectTypeoptions = resp.data;
      });
    },
    //项目负责人接口
    selectprojectPeople (num, size) {
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
    selectloadaudittorg (data) {
      loadaudittorg(data).then((resp) => {
        this.loadaudittorgoptions = resp.data;
      });
    },
    //新增项目按钮事件
    addProject () {
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
      this.isdisabled = true;
      // 
      // 
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
    get_user () {
      get_userInfo().then((resp) => {
        this.userInfo = resp.data;

      });
    },
    //增加专项项目table假数据
    addData () {
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
    deleteRow (index, rows) {
      rows.splice(index, 1);
    },
    nextBtn (addjingForm) {
      this.$refs[addjingForm].validate((valid) => {
        if (valid) {
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
    addDialogClosed (ref) {
      // this.$router.go(0);
      this.$refs[ref].resetFields();
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
    },
    //编辑项目对话框关闭事件
    editDialogClosed (editref) {
      this.$refs[editref].resetFields();
      // this.addProjectManagement = [];
      // this.addprojectjing = [];
      // if (this.$refs["editref"] != undefined) {
      //   this.$refs["editref"].clearValidate();
      // }
    },
    // 项目管理列表分页
    handleCurrentChangeProject (val) {
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
    queryName () {
      this.projectData(this.query);
    },
    // 项目分类下拉框事件
    selectprojectType (val) {
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
          if (that.$refs["addjingForm"] != undefined) {
            that.$refs["addjingForm"].clearValidate();
          } else {
            that.$refs["form"].clearValidate();
          }
        });
      }
    },
    // 经责项目负责任人下拉框事件
    selectprojectLeader (val) {
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
    selectSpecia (val) {
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
    selectField (val) {
      this.addProjectManagement.field = val;
      this.addprojectjing.field = val;
      for (let i = 0; i < this.areasOption.length; i++) {
        if (val == this.areasOption[i].value) {
          this.addProjectManagement.fieldName = this.areasOption[i].label;
          this.addprojectjing.fieldName = this.areasOption[i].label;
        }
      }
    },
    selectorg (val) {

      this.addprojectjing.auditOrgUuid = val;
      for (var i = 0; i < this.loadaudittorgoptions.length; i++) {
        if (val == this.loadaudittorgoptions[i].auditOrgUuid) {
          this.addprojectjing.auditOrgName =
            this.loadaudittorgoptions[i].orgName;
          this.addprojectjing.projectName = "2021年度" + this.addprojectjing.auditOrgName + "经责审计项目";
        }
      }
      // 
      // 
    },
    //经责项目组长下拉框事件
    selectChargeman (val) {
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
    orgSelect (row) {
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
    LeaderSelect (row) {
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
    LeaderSelectEdit (row) {
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

    addSave (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          addProject(this.addProjectManagement).then((resp) => {
            this.$message.success("添加项目成功！");
            this.addDialogVisible = false;
            this.projectData(this.query);
          });
        } else {

          return false;
        }
      });
    },

    // 编辑
    editDialog (rows) {
      this.editDialogVisible = true;
      //  this.$refs.rules.clearValidate();
      //   this.$refs.addjingForm.clearValidate();
      this.selectprojectPeople(1, 1000);
      if (rows.projectType == "jzsj") {

        this.prjType = 2;
        editProject(rows.managementProjectUuid).then((resp) => {
          this.addprojectjing = resp.data;

        });
      } else {
        this.prjType = 1;
        editProject(rows.managementProjectUuid).then((resp) => {
          this.addProjectManagement = resp.data;

        });
      }
    },
    // 专项修改按钮事件
    editBtn () {
      this.$refs.editform.validate((valid) => {
        if (valid) {
          editProjectUpdata(this.addProjectManagement).then((resp) => {
            this.$message.success("修改成功！");
            this.editDialogVisible = false;
            this.projectData(this.query);
          });
        } else {

          return false;
        }
      });
    },
    // 经责项目类型按钮事件
    editSave () {
      this.$refs.editform.validate((valid) => {
        if (valid) {
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
    deleteProjectrow (index, rows, obj) {
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
    // 设置整改跟进人
    setting_prople () {
      this.dialogVisible_setting_prople = true;//设置整改跟进人
    },
    // 确认整改跟进人
    save_follow_up_person () {

    },

    // 启动整改
    run_rectification () {
      this.dialogVisible_rectification = true;//启动整改
    },
    // 确认问题整改清单=============
    confirm_problem (id) {
      this.confirm_problem_dlag = true;//显示确认清单
      this.problem_list_query.managementProjectUuid = id
      this.confirm_problem_data()//确认整改问题清单列表
    },
    // 确认整改问题清单列表
    confirm_problem_data () {
      this.issues_list_loading = true;
      let params = {
        pageNo: this.problem_list_query.pageNo,
        pageSize: this.problem_list_query.pageSize,
        condition: {
          problem: this.problem_list_query.search_issues_list,
          managementProjectUuid: this.problem_list_query.managementProjectUuid
        }
      }
      confirm_rectification(params).then(resp => {
        console.log(resp);
        this.issues_list = resp.data
        this.issues_list_loading = false;
      })
    },
    // 问题整改清单  每页条数
    handleSizeChange (val) {
      this.problem_list_query.pageSize = val
    },
    // 问题整改清单  分页
    handleCurrentChange (val) {
      this.problem_list_query.pageNo = val
      this.confirm_problem_data()//确认整改问题清单列表
    },
    // 筛选问题整改清单
    search_list_issues () {
      this.confirm_problem_data()//确认整改问题清单列表
    },
    // 勾选清单
    handleSelectionChange_problem (val) {
      this.check_detailed = val
    },
    toopen (val) {
      console.log(val);
      if (val) {
        let _this = this;
        setTimeout(function () {
          _this.$refs["basisbtn0"].handleClick();
        }, 100);

        console.log(_this.$refs["basisbtn0"]);
        return false;
      }
    },
    // 专题 领域
    getloadcascader (str) {
      axios({
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
    getSelectTask () {
      axios({
        url: `/wisdomaudit/auditTask/selectTask`,
        method: "post",
        data: {
          managementProjectUuid: this.active_project,
        },
      }).then((res) => {
        this.auditTasklList = res.data.data;
        console.log(this.auditTasklList);
      });
    },

    //依据树
    treeNodeClick () { },
    //打开依据
    openbasis () {
      this.basisdialog = true;
      this.dqbasis.choose = [];
    },
    //获取依据
    getbasis () {
      axios({
        url: `/wisdomaudit/auditBasy/getAuditbasyList`,
        method: "get",
        data: {},
      }).then((res) => {
        this.basislist = res.data.data;
      });
    },
    //获取依据详情
    getbasisdetail (bid) {
      this.basisload = true;
      axios({
        url: `/wisdomaudit/auditBasy/getById/` + bid + ``,
        method: "get",
        data: {},
      }).then((res) => {
        this.dqbasis.info = res.data.data.treeData;
        this.basisload = false;
      });
    },

    //选择右侧依据 点击引用
    choosebasis (val) {
      if (this.dqbasis.choose.indexOf(val) > -1) {
        this.$message({
          message: '您已引用这一条',
          type: 'warning'
        });
        return;
      } else {
        this.dqbasis.choose.push(val);
        this.$message({
          message: '引用成功',
          type: 'success'
        });

      }
    },
    //确定选择依据
    surebasis () {
      this.basisdialog = false;
      if (this.ifadd == 0) {
        this.temp.basis = this.dqbasis.choose;
      } else {
        this.dqProblem.basis = this.dqbasis.choose;
      }
      this.dqbasis.choose = [];
    },

    // 编辑删除
    edit (index, data) {
      this.list_check = data;
      if (index == 1) {
        let entity = this.list_check//当前的数据
        this.edit_remove_data(1, entity)// 编辑 删除  数据
        this.confirm_problem_dlag_edit = true;//审计问题清单 编辑
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
            let entity = this.list_check//当前的数据
            this.edit_remove_data(2, entity)// 编辑 删除  数据
          })
          .catch(() => { });
      }
    },
    // 编辑 删除  数据
    edit_remove_data (index, params) {
      edit_remove(params).then(resp => {
        if (resp.code == 0) {
          // 编辑回显
          if (index == 1) {
            console.log(resp.data);
            let _data = resp.data
            this.dqProblem.problem = _data.problem//问题
            this.dqProblem.field = _data.field//领域
            this.dqProblem.special = _data.special//专题
            this.dqProblem.describe = _data.describe//描述
            this.dqProblem.managementAdvice = _data.managementAdvice//建议
            this.dqProblem.problemDiscoveryTime = _data.problemDiscoveryTime//发现日期
            this.dqProblem.problemFindPeople = _data.problemFindPeople//发现人
            this.dqProblem.riskAmount = _data.riskAmount//风险金额
            this.dqProblem.basis = _data.basis.split(",");//依据
            this.dqProblem.auditTaskUuid = _data.auditTaskUuid.split(",")//关联任务
            this.dqProblem = JSON.parse(JSON.stringify(this.dqProblem));

            this.$nextTick(() => {
              this.$refs["detailForm"].clearValidate();
            });
            console.log(this.dqProblem);
          } else {
            // 删除
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.confirm_problem_data()//刷新 整改问题清单列表
          }
        } else {
          this.$message({
            message: resp.msg,
            type: "error",
          });
        }
      })
    },
    // 编辑保存 确认清单
    updateData (detailForm) {
      this.$refs["detailForm"].validate((valid) => {
        //rep.auditTaskUuid = rep.auditTaskUuid.join(",");
        // rep.basis = rep.basis.join(",");
        if (valid) {
          this.$message({
            message: "编辑成功",
            type: "success",
          });

        } else {
          this.$message({
            message: "请填写信息",
            type: "error",
          });
        }
      })
    },


    //领域返显
    fieldFilter (str) {
      let rep = "";
      this.CategoryList.forEach((e) => {
        if (e.value == str) {
          rep = e.label;
        }
      });
      return rep;
    },
    //专题返显
    specialFilter (str) {
      let rep = "";
      this.SPECIALList.forEach((e) => {
        if (e.value == str) {
          rep = e.label;
        }
      });
      return rep;
    },


    // 选择问题==============
    select_problem () {
      this.dialogVisible_select_dialog = true;//显示选择问题列表
      this.selection_questions_list_data();//选择问题列表
    },
    // 选择问题列表
    selection_questions_list_data () {
      this.problem_loading = true;
      let params = {
        managementProjectUuid: this.problem_list_query.managementProjectUuid,//当前项目的id
        problem: this.queryProblemList_query.search_problem,///
      }
      selection_questions_list(params).then(resp => {
        this.problem_list = resp.data
        this.problem_loading = false;
      })
    },

    // 问题筛选
    search_list_problem () {
      this.selection_questions_list_data();//选择问题列表
    },
    // 选择问题
    handleSelectionChange_issues (val) {
      this.check_problem = val;
      // 数组 添加id
      // this.check_problem.forEach(item => {
      //   this.$set(item, 'managementProjectUuid', this.problem_list_query.managementProjectUuid)//核实意见
      // })
    },
    // 保存问题
    save_problem () {
      this.issues_list = this.check_problem;
      console.log(this.issues_list);
      if (this.check_problem.length == 0) {
        this.$message({ message: '请选择一条问题进行保存' })
      } else {
        this.save_ProblemCorrect_data();
      }
    },
    // 问题 保存
    save_ProblemCorrect_data () {
      let problemList = this.check_problem;//传参
      saveProblemCorrect(problemList).then(resp => {
        if (resp.code == 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.dialogVisible_select_dialog = false;//显示选择问题列表
          this.confirm_problem_data()// 刷新 确认整改问题清单列表

        } else {
          this.$message({
            message: resp.data.msg,
            type: 'error'
          });
        }
      })
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
    margin-bottom: -25px !important;
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
    background: #508ce6 !important;
    color: #fff;
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
.long {
  width: 70% !important;
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
</style>
