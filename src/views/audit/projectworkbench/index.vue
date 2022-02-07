<template>
  <div class="projectWorkbench"
       style="background: #fff">
    <Vault :vaultV="vaultV"
           :sceneId="sceneId"
           :approvers="approvers"
           :maxTime="maxTime"
           :dqtime="dqtime"
           :account="account"
           :appSessionId="appSessionId"
           @changevault="changevault"
           @vdownload="vdownload"></Vault>
    <!-- 未初始化项目 -->
    <div class="title1"
         v-show="projectNum.length > 0">未初始化项目</div>
    <ul class="projectInit"
        :class="projectNum.length > 0 ?'mabtom':''"
        v-show="projectNum.length > 0">
      <li @click="projectClick(index,value)"
          v-for="(value, index) in projectNum"
          :key="index">
        <div class="peojectMessage">
          <p class="projectName"
             v-if="value.projectName"
             style="margin-bottom: 2%">
            {{ value.projectName }}
          </p>
          <p class="projectName"
             v-else
             style="margin-bottom: 2%">
            --
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
      <span class="moreBtn"
            style="cursor: pointer; color: #12579a"
            v-if="projectAll.length > 4"
            @click="moreProjectBtn()">更多>></span>
    </ul>
    <el-drawer title="未初始化项目"
               :visible.sync="drawer"
               :direction="direction"
               :size="size">
      <ul class="projectAll">
        <li @click="projectClick(index,value)"
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
    <!-- 初始化项目 end-->

    <!-- 初始化项目 -->
    <div class="initializeProject"
         v-if="active_project">
      <div class="title1">初始化项目</div>
      <ul v-if="projectInit">
        <li v-for="(item, index) in projectInit"
            :key="index"
            class="initProjectItem anmition_show">
          <div class="position"
               @click="look_project(index, item)"
               :class="
            active_project == item.managementProjectUuid ? 'active_class' : ''
          ">
            <p class="hide">
              <span class="hide_title"> {{ item.projectName }}</span>
              <span class="show_title"> {{ item.projectName }}</span>
            </p>

          </div>

          <div class="tips">
            <p>{{ item.projectName }}</p>
            <p>被审计对象：{{item.auditOrgName}}</p>
            <p>审计周期：{{item.auditStartData}}至{{item.auditFinishData}}</p>
          </div>
        </li>
        <span class="moreBtn"
              @click="look_more()"
              v-if="ifmore">更多>></span>
      </ul>
      <ul v-else>
        暂无更多初始化项目...
      </ul>
    </div>

    <el-empty description="暂无数据"
              v-if="!active_project"
              style="margin-top: 5%; border: 2px solid #ebf0f6; height: 600px"></el-empty>
    <!-- 初始化项目 end-->

    <el-row class="tac"
            v-else>
      <!-- 左侧导航 -->
      <div class="left_menu">
        <el-col>
          <div class="menu">
            <el-menu ref="selfMenu"
                     :key="key"
                     :default-active="defaultActive"
                     :active="defaultActive"
                     class="el-menu-vertical-demo"
                     @select="open"
                     background-color="#F1F5FB"
                     :default-openeds="['1', '2', '3']">
              <el-submenu v-show="userInfo.userRole == '1' || userInfo.userRole == '3'"
                          index="1">
                <template slot="title">
                  <span style="font-weight: bold">审计准备</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1">组员及任务维护<span></span></el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu v-show="
                  userInfo.userRole == '1' ||
                  userInfo.userRole == '2' ||
                  userInfo.userRole == '3'
                "
                          index="2">
                <template slot="title">
                  <span style="font-weight: bold">审计实施</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="2-1">审计资料<span></span></el-menu-item>
                  <el-menu-item index="2-2">审计任务<span></span></el-menu-item>
                  <el-menu-item index="2-4">审计确认单<span></span></el-menu-item>
                  <el-menu-item index="2-3">审计问题<span></span></el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-submenu v-show="
                  userInfo.userRole == '1' ||
                  userInfo.userRole == '3' ||
                  (userInfo.isLiaison == '1' && userInfo.userRole == '2')
                "
                          index="3">
                <template slot="title">
                  <span style="font-weight: bold;">报告阶段</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="3-2">经营指标<span></span></el-menu-item>
                  <el-menu-item index="3-1">审计报告<span></span></el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <!--<el-menu-item v-show="-->
              <!--userInfo.userRole == '1' ||-->
              <!--userInfo.userRole == '3' ||-->
              <!--(userInfo.isLiaison == '1' && userInfo.userRole == '2')-->
              <!--"-->
              <!--index="3-2"-->
              <!--class="one-menu_y-title">-->
              <!--<span class="one-menu_y"-->
              <!--style="font-weight: bold;">经营指标</span>-->
              <!--</el-menu-item>-->
            </el-menu>
          </div>
        </el-col>
      </div>
      <!-- 左侧导航 end -->
      <!-- 右侧内容 -->
      <div class="right_conter"
           v-if="active_project">
        <el-col v-if="!refreash">
          <!-- 业务说明-业务规则 -->
          <div class="routerView"
               v-if="index == '1-1'">
            <TeamPersonTask ref="temPersonRef"
                            :active_project="active_project"
                            :userRole="userInfo.userRole"
                            :isLiaison="userInfo.isLiaison" />
          </div>
          <!-- 审计资料 -->
          <div class="routerView"
               v-if="index == '2-1'">
            <AuditData :active_project="active_project"
                       :userRole="userInfo.userRole"
                       :isLiaison="userInfo.isLiaison"></AuditData>
          </div>
          <!-- 审计任务 -->
          <div class="routerView"
               v-if="index == '2-2'">
            <AuditTask :active_project="active_project"
                       :userRole="userInfo.userRole"
                       :isLiaison="userInfo.isLiaison"></AuditTask>
          </div>
          <div class="routerView"
               v-if="index == '2-3'">
            <Auditproblem :active_project="active_project"
                          :userRole="userInfo.userRole"
                          :isLiaison="userInfo.isLiaison"></Auditproblem>
          </div>
          <div class="routerView"
               v-if="index == '2-4'">
            <AuditConfirmation :active_project="active_project"
                               :userRole="userInfo.userRole"
                               :isLiaison="userInfo.isLiaison"></AuditConfirmation>
          </div>
          <div class="routerView"
               v-if="index == '3-1'">
            <!-- 审计报告 -->
            <AuditReport :active_project="active_project"
                         :userRole="userInfo.userRole"
                         :isLiaison="userInfo.isLiaison"></AuditReport>
          </div>
          <div class="routerView"
               v-if="index == '3-2'">
            <Businessindicator :active_project="active_project"
                               :userRole="userInfo.userRole"
                               :isLiaison="userInfo.isLiaison"></Businessindicator>
          </div>
        </el-col>
      </div>
      <!-- 右侧内容 end -->
    </el-row>

    <!-- 查看更多初始化项目 -->
    <div class="project_data"
         :class="project_data == true ? 'opctin' : ''"
         @click="close()">
      <div class="right_data">
        <div :class="project_data == true ? 'style_width' : ''"
             class="ul_data">
          <ul style="height: 100%; overflow-y: auto">
            <li @click.stop="look_project(index, item)"
                v-for="(item, index) in projectInitMore"
                :key="index"
                :class="
                active_project == item.managementProjectUuid
                  ? 'active_class'
                  : ''
              ">
              {{ item.projectName }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 未初始化项目添加弹框 -->
    <el-dialog :visible.sync="addDialogVisible"
               :before-close="addClosed"
               :append-to-body='true'
               :width="dialogWidth">
      <div class="dialogTitle">
        {{ name }}
      </div>
      <div class="addPerson"
           v-if="step == 1">
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

        <el-transfer filterable
                     :filter-method="filterMethod"
                     filter-placeholder="请输入组员名称"
                     target-order="push"
                     @right-check-change="rightArray"
                     v-model="value"
                     :titles="['组员列表', '已选组员']"
                     :data="data"
                     @change="selectMember">
          <div slot-scope="{ option }"
               class="setinterPerson">
            {{ option.label }}
            <span v-if="option.isLiaison == 0"
                  class="setinterPersonBtn"
                  @click="isLiaison_Btn(option, value)">设为接口人</span>
            <span v-else-if="option.isLiaison == 1"
                  style="
                float: right;
                color: #8492a6;
                font-size: 13px;
                margin-right: 0px;
                cursor: pointer;
              "
                  @click="cancel_Btn(option)">取消接口人</span>
          </div>
        </el-transfer>
        <div class="stepBtn">
          <el-button @click="addDialogVisibleRes()">取消</el-button>
          <el-button class="nextBtn"
                     @click="nextBtn">下一步</el-button>
        </div>
      </div>

      <div class="addAudit"
           v-else-if="step == 2"
           style="padding: 1%">
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
        <div class="optionBtn"
             v-if="radio == '1'">
          <el-row :gutter="24">
            <el-col :span="15"
                    style="margin-right: 4%">
              <el-button style="background: #0c87d6; color: #fff"
                         @click="selectModel">新增模型任务</el-button>
              <!-- <span style="margin-top: 2.5%; color: #5f6165; margin-left: 10px">
                请选择想要引用的模型
              </span> -->

              <el-button style="background: #0c87d6; color: #fff"
                         @click="addTaskSelf">新增自建任务</el-button>
            </el-col>

            <!-- 条件查询模型名称 -->
            <div class="search">
              <el-input placeholder="请输入任务名称"
                        v-model="getModelList.condition.taskName"
                        @keyup.enter.native="queryNameInput">
              </el-input>
              <div class="search_icon"
                   style="background: #0c87d6 !important"
                   @click="queryNameInput">
                <i class="el-icon-search"
                   style="color: white"></i>
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
          <el-table :data="modelListTab"
                    v-loading="modelloading"
                    style="width: 100%"
                    stripe
                    :header-cell-style="{ 'background-color': '#F4FAFF' }">
            <el-table-column prop="taskName"
                             label="任务名称">
            </el-table-column>
            <el-table-column prop="taskType"
                             label="任务类型">
              <template slot-scope="scope">
                <span v-if="scope.row.taskType == 1">模型任务</span>
                <span v-else-if="scope.row.taskType == 2">自建任务</span>
              </template>
            </el-table-column>
            <el-table-column prop="peopleName"
                             label="责任人">
              <template slot-scope="scope">
                <el-form>
                  <el-form-item>
                    <el-select style="margin-top: 5px"
                               v-model="scope.row.peopleTableUuid"
                               filterable
                               @change="selectChange(scope.row)">
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
            <el-table-column prop="taskDescription"
                             label="任务描述">
              <template slot-scope="scope">
                <div v-if="scope.row.taskDescription == null || scope.row.taskDescription == ''">--</div>
                <div v-else>{{scope.row.taskDescription}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="address"
                             label="附件"
                             width="90">
              <template slot-scope="scope">
                <el-popover placement="bottom"
                            width="300"
                            trigger="click"
                            :popper-options="{ boundariesElement: 'body' }">
                  <el-table :data="enclosure_details_list">
                    <el-table-column prop="fileName"
                                     label="文件名称">
                      <template slot-scope="scope">
                        <el-link type="primary"
                                 @click="
                            openVault( scope.row )
                          ">{{ scope.row.fileName }}</el-link>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="update"
                       style="cursor: pointer"
                       @click="nearbyDetails(scope.row)"
                       slot="reference">
                    <i class="el-icon-folder-opened list-folder"></i>
                    <span style="margin-top: -5px;    color: #1371cc;
     margin-left: 4px">{{
                      scope.row.count
                    }}</span>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text"
                           style="
                    color: #0c87d6;
                    background: none;
                    border: 0;
                    font-size: 14px;
                  "
                           size="small"
                           v-if="scope.row.taskType == 2"
                           @click.native.prevent="edit_data(scope.row)">
                  编辑
                </el-button>
                <el-button type="text"
                           style="
                    color: #ff8a72;
                    background: none;
                    border: 0;
                    font-size: 14px;
                  "
                           size="small"
                           @click.native.prevent="deleteModel(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination v-show="taskTotal > 0"
                      :total="taskTotal"
                      :page.sync="getModelList.pageNo"
                      :limit.sync="getModelList.pageSize"
                      @pagination="queryName" />
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
          <el-button class="nextBtn"
                     @click="saveBtn">完成</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 选择模型 -->
    <el-dialog :visible.sync="modelDialog"
               width="70%"
               :append-to-body='true'
               :before-close="MedolDialogClosed">
      <div class="dialogTitle">模型列表</div>
      <div style="padding: 2%">
        <el-row>
          <el-col :span="15">
            <div style="margin-top: 2.5%; color: #5f6165; margin-top: 10px">
              请选择想要引用的模型
            </div>
          </el-col>
          <div class="search">
            <el-input placeholder="请输入模型名称"
                      v-model="modelQuery.condition.modelName"
                      @keyup.enter.native="queryModelInput">
            </el-input>
            <div class="search_icon"
                 style="background: #1897e4 !important"
                 @click="queryModelInput">
              <i class="el-icon-search"
                 style="color: white"></i>
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
        <el-table :data="modelTableData"
                  style="width: 100%"
                  stripe
                  @selection-change="handleSelectionChangeModel"
                  ref="multipleModelRef"
                  v-loading="lding_model"
                  :row-key="getRowKey">
          <el-table-column type="selection"
                           :reserve-selection="true">
          </el-table-column>
          <el-table-column type="index"
                           label="模型编号"
                           width="80">
          </el-table-column>
          <el-table-column prop="belongField"
                           label="所属领域">
          </el-table-column>
          <el-table-column prop="belongSpcial"
                           label="所属专题">
          </el-table-column>
          <el-table-column prop="modelName"
                           label="模型名称"> </el-table-column>
          <el-table-column prop="logicalDescription"
                           label="逻辑说明"
                           width="300">
          </el-table-column>
          <el-table-column prop="ruleDescription"
                           label="业务规则"
                           width="300">
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination v-show="modelTotal > 0"
                    :total="modelTotal"
                    :page.sync="modelQuery.pageNo"
                    :limit.sync="modelQuery.pageSize"
                    @pagination="queryModel" />
        <!-- 分页 end-->
        <div class="stepBtn"
             style="margin-top: 25px">
          <el-button @click="res">取消</el-button>
          <el-button style="background: #1897e4; color: #fff"
                     @click="modelInfo()"
                     :disabled="isdisabled">确认</el-button>
        </div>
      </div>
    </el-dialog>

    <!--新增 自建任务弹出框 -->
    <el-dialog :visible.sync="taskSelfDialogVisible"
               :before-close="TaskDialogClosed"
               :append-to-body='true'
               @close="resetForm2('selfTaskRef')"
               width="50%">
      <div class="dialogTitle">自建任务</div>
      <div class="selfTask">
        <el-form label-width="125px"
                 :model="taskSelf"
                 ref="selfTaskRef"
                 :rules="taskSelfRules">
          <el-form-item label="自建任务名称:"
                        prop="taskName">
            <el-input placeholder="请输入自建任务名称"
                      v-model="taskSelf.taskName"></el-input>
          </el-form-item>
          <el-form-item label="责任人:"
                        prop="peopleName">
            <el-select v-model="taskSelf.peopleName"
                       filterable
                       placeholder="请选择责任人"
                       @change="selectChangePerson">
              <el-option v-for="item in tableData"
                         :key="item.peopleTableUuid"
                         :label="item.peopleName"
                         :value="item.peopleTableUuid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="领ㅤ域:"
                        prop="belongField">
            <el-select placeholder="请选择领域"
                       v-model="taskSelf.belongField">
              <el-option v-for="item in areasOption"
                         :key="item.value"
                         :label="item.label"
                         :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专ㅤ题:"
                        prop="belongSpcial">
            <el-select placeholder="请选择专题"
                       v-model="taskSelf.belongSpcial"
                       v-if="other_input == true"
                       @change="changeBelongSpcial">
              <el-option v-for="item in thematicOption"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
            <el-input v-model="taskSelf.belongSpcial"
                      v-if="other_input == false"></el-input>
            <el-button v-if="other_input == false"
                       type="primary"
                       class="inline-block"
                       style="position: absolute;top:0;right: -70px"
                       @click="other_input=!other_input">重选</el-button>
          </el-form-item>

          <!-- prop="taskDescription" -->
          <el-form-item label="任务描述:">
            <textarea placeholder="请输入任务描述"
                      class="textarea"
                      v-model="taskSelf.taskDescription"></textarea>
            <!-- <el-input type="textarea"
                      placeholder="请输入任务描述"
                      v-model="taskSelf.taskDescription"></el-input> -->
          </el-form-item>
          <el-form-item label="上传附件:">
            <el-upload class="upload-demo"
                       :headers="headers"
                       drag
                       action="#"
                       v-model="taskSelf.enclosure"
                       :on-change="handleChangePic"
                       :file-list="fileList"
                       :auto-upload="false"
                       multiple>
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
          <el-button type="primary"
                     @click="taskSelfInfo('selfTaskRef')"
                     :disabled="isdisabled">确认</el-button>
        </div>
      </div>
    </el-dialog>

    <!--编辑 自建任务弹出框 -->
    <el-dialog :visible.sync="editTaskSelfDialogVisible"
               width="50%"
               :append-to-body='true'
               @close="editResetForm2('editTaskRef')">
      <div class="dialogTitle">编辑自建任务</div>
      <div class="selfTask">
        <el-form label-width="125px"
                 :rules="taskSelfRules"
                 :model="edittaskSelfForm"
                 ref="editTaskRef">
          <!-- hide-required-asterisk -->
          <!-- <el-form-item label="类型：" style="margin-bottom: 50px">
            <div style="margin-top: -5%; margin-bottom: 20px">
              <el-radio v-model="radio" label="1">模型任务</el-radio>
              <el-radio v-model="radio" label="2">自建任务</el-radio>
            </div>
          </el-form-item> -->
          <el-form-item label="自建任务名称:"
                        prop="taskName">
            <el-input placeholder="请输入自建任务名称"
                      v-model="edittaskSelfForm.taskName"></el-input>
          </el-form-item>
          <el-form-item label="责任人:"
                        prop="peopleName">
            <el-select v-model="edittaskSelfForm.peopleTableUuid"
                       filterable
                       placeholder="请选择责任人"
                       @change="selectChangePerson">
              <el-option v-for="item in tableData"
                         :key="item.peopleTableUuid"
                         :label="item.peopleName"
                         :value="item.peopleTableUuid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="领ㅤ域:"
                        prop="belongField">
            <el-select placeholder="请选择领域"
                       v-model="edittaskSelfForm.belongField">
              <el-option v-for="item in areasOption"
                         :key="item.value"
                         :label="item.label"
                         :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="专ㅤ题:"
                        prop="belongSpcial">
            <el-select placeholder="请选择专题"
                       v-model="edittaskSelfForm.belongSpcial"
                       v-if="other_input == true"
                       @change="changeBelongSpcial">
              <el-option v-for="item in thematicOption"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
            <el-input v-model="edittaskSelfForm.belongSpcial"
                      v-if="other_input == false"></el-input>

            <el-button v-if="other_input == false"
                       type="primary"
                       class="inline-block"
                       style="position: absolute;top:0;right: -70px"
                       @click="other_input=!other_input">重选</el-button>
          </el-form-item>

          <el-form-item label="任务描述:">
            <textarea placeholder="请输入任务描述"
                      class="textarea"
                      v-model="edittaskSelfForm.taskDescription"></textarea>
            <!-- <el-input type="textarea"
                      placeholder="请输入任务描述"
                      v-model="edittaskSelfForm.taskDescription"></el-input> -->
          </el-form-item>
          <el-form-item label="上传附件:">
            <el-upload class="upload-demo"
                       drag
                       action="#"
                       v-model="edittaskSelfForm.enclosure"
                       :on-change="handleChangePic"
                       :on-remove="handleRemove"
                       :file-list="edit_file_list"
                       :auto-upload="false"
                       multiple>
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
          <el-button type="primary"
                     @click="edittaskSelfSave('editTaskRef')"
                     :disabled="isdisabled">确认</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";
import Vault from "@WISDOMAUDIT/components/Vaultcertification";
import Pagination from "@WISDOMAUDIT/components/Pagination";
import TeamPersonTask from "@WISDOMAUDIT/views/audit/teamperson-task/index";
import AuditData from "@WISDOMAUDIT/components/workbench/AuditData/index"; //审计资料
import AuditTask from "@WISDOMAUDIT/components/workbench/AuditTask/index"; //审计任务
import Auditproblem from "@WISDOMAUDIT/components/workbench/auditproblem/index"; //审计问题
import Businessindicator from "@WISDOMAUDIT/components/workbench/businessindicator/index"; //经营指标
import AuditReport from "@WISDOMAUDIT/components/workbench/AuditReport/index"; //审计问题
import AuditConfirmation from "@WISDOMAUDIT/views/audit/auditconfirmationform/index";
import { get_userInfo, down_file } from "@SDMOBILE/api/shandong/ls";
import {
  projectList,
  thematicAreas,
  setprojectInit,
  attachmentEcho,
  projectListByuser
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
  projectListByuser2,

} from "@WISDOMAUDIT/api/shandong/memberMaintenance.js";

export default {
  components: {
    TeamPersonTask, //业务说明-业务规则
    AuditData, //审计资料
    AuditTask, //审计任务
    Auditproblem, //审计问题
    Businessindicator, //经营指标
    AuditReport, //审计报告
    AuditConfirmation, //审计确认单
    Pagination,
    Vault,
  },
  data () {
    return {
      vaultV: false,
      sceneId: 1557, //经营指标、模型结果编号:1556 附件上传后下载编号:1557
      approvers: [], //审批人列表
      maxTime: "",//最大时间
      dqtime: "",//当前时间
      account: "",//返回的账户
      appSessionId: "",//应用sessionid
      downloaobj: {},//暂存的下载目标

      lding_model: false,
      dialogWidth: 0,
      headers: '',
      dqtoken: "",
      other_input: true, //专题下拉框显示隐藏
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
      modelloading: true,
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
        // taskDescription: [
        //   { required: true, message: "请输入任务描述", trigger: "change" },
        // ],
      },
      arrRightValue: [],
    };
  },
  watch: {
    active_project (val) {
      this.refreash = true; // loading
      let _this = this;
      setTimeout(function name () {
        _this.refreash = false;
      }, 500);
    },
    userRole (val) {
      this.refreash = true; // loading
      let _this = this;
      setTimeout(function name () {
        _this.refreash = false;
      }, 500);
    },
  },

  created () {
    this.setDialogWidth();//dloag宽度
    this.get_user();
    this.dqtoken = sessionStorage.getItem("TOKEN");
    this.headers = { 'TOKEN': sessionStorage.getItem('TOKEN') }
    //
  },
  mounted () {
    this.defaultActive = "";
    this.index = "";
    this.queryInfo = this.$route.query;
    if (this.queryInfo.index && this.queryInfo.projectId) {
      // debugger;
      //
      this.active_project = this.queryInfo.projectId;
      console.log(this.active_project)
      this.getprojectList(this.queryManage, 'home');
      document.body.scrollTop = 0;
      // firefox
      // safari
      window.pageYOffset = 0;
    } else {
      this.get_user(true);
      this.getprojectList(this.queryManage);
    }
    // this.getprojectList(this.queryManage);
    this.thematicSelect(this.thematic);
    this.areasSelect(this.areas);
    this.moreProject(this.queryManageAll);

    //监听窗口宽度
    window.onresize = () => {
      return (() => {
        this.setDialogWidth()
      })()
    }
  },
  methods: {

    //通过认证后的方法
    vdownload () {
      this.enclosureDownload(this.downloaobj.attachmentUuid, this.downloaobj.fileName)
    },
    //控制认证弹窗
    changevault (val) {
      this.vaultV = val;
    },
    //打开金库
    openVault (obj) {
      console.log("芝麻开门")
      this.downloaobj = obj
      axios({
        method: "post",
        url: `/wisdomaudit/treasury/getTreasuryStatus`,
        headers: {
          TOKEN: this.dqtoken,
        },
        data: {
          sceneId: this.sceneId,
          sceneName: "附件上传后下载", //场景名称
          sensitiveData: "report_download", //敏感数据对应的编号：  data_export 经营指标、模型结果 report_download 附件上传后下载;
          sensitiveOperate: "download", //敏感操作对应的编号：export： 导出   select：查询
        },
      }).then((resp) => {
        //result 是否开启 开启：1  无需开启：0
        //resultDesc 无需开启原因（成功错误信息）
        //historyAppSessionId 历史有效应用sessionid（仅当已授权状态时必填属性）
        //relation 多值授权方式与访问方式关系
        //policyAuthMethod 授权方式： remoteAuth远程授权
        //policyAccessMethod
        //maxTime 授权条件（必填属性）单位为小时： 当为0时，为单次授权；否则为时间段授权即允许以当前时间为开始时间，开始时间+maxTime时间为最大结束时间，允许用户在此范围选择；
        //approvers 审批人列表
        //如果是线上环境
        if (resp.data.data.isVaultProfiles) {
          let rep = resp.data.data.treasuryStatusRsp;
          if (rep.result == 0) {
            this.$message('因金库未开启或服务异常，文件下载失败，请联系系统管理员。');
            return;
          } else {
            console.log(rep);
            this.approvers = rep.approvers || "";
            this.maxTime = rep.maxTime;
            this.dqtime = new Date();
            this.account = resp.data.data.account;
            this.appSessionId = resp.data.data.appSessionId;
            this.vaultV = true;
          }
        } else {
          //否则不处理或在此处直接进行后面的操作
          this.vdownload()
        }
      });
    },

    setDialogWidth () {

      var val = document.body.clientWidth
      const def = 1400 //宽度最小为800,可修改
      //窗口宽度小于默认宽度时，将弹框看度设置为50%,可修改
      if (val < def) {
        this.dialogWidth = '900px'
      } else {
        //窗口宽度大于默认宽度1200时，将弹框设置为400宽度,可修改
        this.dialogWidth = '65%'
      }
    },

    // 专题选择其他变成可输入
    changeBelongSpcial (value) {
      let obj = {};
      obj = this.thematicOption.find((item) => {
        return item.value === value; //筛选出匹配数据
      });
      let val = obj.value;
      this.taskSelf.belongSpcial = obj.label;
      this.edittaskSelfForm.belongSpcial = obj.label;


      if (val == "otherzt") {
        this.other_input = false;
        this.taskSelf.belongSpcial = "";
        this.edittaskSelfForm.belongSpcial = "";
      }
    },
    //获取当前登录人信息
    get_user (ifMounted) {
      get_userInfo().then((resp) => {
        this.userInfo = resp.data;

        if (this.userInfo.people.userId) {

          this.project_more();
          this.queryProject.condition.peopleTableUuid = this.userInfo.people.userId;
        }
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
    filterMethod (query, item) {
      if (!query) return true;
      return item.label.indexOf(query) > -1;
    },
    //查询未初始化项目
    getprojectList (data, from) {
      projectListByuser(data).then((resp) => {
        this.projectNum = resp.data.records;
        //
        this.getInitProject(this.queryProject);
        // this.project_more();
        if (from == 'home') {
          this.active_project = this.queryInfo.projectId;
          this.defaultActive = this.queryInfo.index;
          this.index = this.queryInfo.index;
          this.get_user();
          // 更新项目接口
          setprojectInit(this.active_project).then((resp) => { });
        }
      });
    },
    // 初始化项目
    getInitProject (data) {
      this.ifshow = true;
      initProject(data).then((resp) => {
        this.projectInit = resp.data.records;
        if (resp.data.records && resp.data.records != '') {
          var datas = resp.data.records[0];
          this.active_project = this.queryInfo.projectId || datas.managementProjectUuid;
          // 更新项目接口
          setprojectInit(this.active_project).then((resp) => {
            var that = this;
            if (resp.code == 0) {
              that.$forceUpdate();
              that.userInfo.userRole = resp.data.peopleRole;
              that.userInfo.isLiaison = resp.data.isLiaison;
              that.$set(that.userInfo, "userRole", resp.data.peopleRole);
              that.$set(that.userInfo, "isLiaison", resp.data.isLiaison);
            }
          });
        }
        this.ifshow = false;
      });
    },
    open (index) {
      this.defaultActive = index;
      this.index = 0;
      this.index = index;
    },
    look_more () {
      this.project_data = true;
    },
    // 查看更多初始化项目
    project_more () {
      if (this.userInfo.people.userId) {
        this.queryProjectAll.condition.peopleTableUuid = this.userInfo.people.userId;
      }
      initProject(this.queryProjectAll).then((resp) => {
        this.projectInitMore = resp.data.records;
        if (this.projectInitMore.length > 6) {
          this.ifmore = true;
        }
      });
    },
    close () {
      this.project_data = false;
    },
    // 点击初始化项目事件
    look_project (index, item) {
      //
      //
      this.active_project = item.managementProjectUuid; //点击选择添加高亮
      //
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

      //

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
    selectChange (row) {
      //
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
    projectClick (index, data) {
      // console.log(index);
      // console.log(data);
      // return false
      if (index > 4) {
        // this.managementProjectUuid = this.projectAll[index].managementProjectUuid;
        this.managementProjectUuid = data.managementProjectUuid
        // this.notInitType = this.projectAll[index].projectType;
        this.notInitType = data.projectType;
        // this.name = this.projectAll[index].projectName;
        this.name = data.projectName;
      } else {
        // this.managementProjectUuid = this.projectNum[index].managementProjectUuid;
        this.managementProjectUuid = data.managementProjectUuid;
        // this.notInitType = this.projectNum[index].projectType;
        this.notInitType = data.projectType;
        // this.name = this.projectNum[index].projectName;
        this.name = data.projectName;
      }
      //
      this.addDialogVisible = true;
      this.getSelectData(1, 1000);
      // auditModelList(this.modelQuery).then((resp) => {
      //   this.modelTableData = resp.data.records;
      //   this.modelSize = resp.data;
      // });
      //
      this.getTaskSelfList.condition.managementProjectUuid =
        this.managementProjectUuid;
      this.getTaskSelf(this.getTaskSelfList);
      this.drawer = false;

      this.query.condition.managementProjectUuid = this.managementProjectUuid;
    },
    // 更多未初始化项目
    moreProject (data) {
      projectListByuser(data).then((resp) => {
        this.projectAll = resp.data.records;
        //
      });
    },
    // 更多按钮

    moreProjectBtn () {
      this.drawer = true;
    },
    // 选择组员事件
    selectMember (val, to, list) {
      //
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
            //
            e.isLiaison = 0;
          }
        });
      }
    },
    // 组员查询
    getSelectData (num, size, id) {
      // alert(2)
      this.loading = true;
      getProjectMember(num, size, id).then((resp) => {
        this.personMes = resp.data.list;
        //

        //
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
        //
        this.projectMember(this.query);
        this.loading = false;
      });
    },
    //查询责任人下拉框接口
    leaderSelect (data) {
      projectMembership(data).then((resp) => {
        this.tableData = resp.data.records;
      });
    },

    // 查询已选组员
    projectMember (data) {
      // alert(11)
      projectMembership(data).then((resp) => {

        this.peopleSelection = resp.data.records;
        this.tableData = resp.data.records;
        //
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

        });
      });
    },
    //重加载接口
    reset () {
      this.getprojectList(this.queryManage);
      this.thematicSelect(this.thematic);
      this.areasSelect(this.areas);
      this.moreProject(this.queryManageAll);
    },
    //查询责任人列表

    addDialogClosed () {
      this.reset()
      // this.$router.go(0);
    },

    //设为接口人事件
    isLiaison_Btn (row, list) {
      this.arrRightValue.splice(this.arrRightValue.indexOf(row), 1);
      let leader = {};
      this.peopleSelection.forEach((a) => {
        if (a.peopleRole == 1) {
          leader = a;
        }
      });

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
    rightArray (arr) {
      // alert(23)
      this.arrRightValue = arr;
    },
    //取消设为接口人
    cancel_Btn (row) {


      //
      row.isLiaison = 0;
      for (let k = 0; k < this.peopleSelection.length; k++) {
        if (
          this.peopleSelection[k].peopleTableUuid == row.key &&
          this.peopleSelection[k].peopleRole == 1
        ) {
          return (row.disabled = true);
        } else {
          row.disabled = false;
          //
          // for(let p=0; p<this.arrRightValue.length;p++){
          //   if(this.arrRightValue[p] == row.peopleTableUuid){
          //    return this.arrRightValue.remove('this.arrRightValue[p')
          //   }

          // }
          //
          // this.value = [];
        }
      }
      // row.disabled = true;
    },
    // 下一步按钮事件
    nextBtn () {
      var selectedPeople = [];

      //

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
    deleteModel (row) {
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
            //
            this.getauditModelList(this.getModelList);
            this.modelQuery.condition.modelName = "";
            this.getauditModelListSql(this.modelQuery);
          });
        })
        .catch((action) => {
          // this.$message({
          //   type: "info",
          //   message: action === "cancel" ? "放弃删除并离开页面" : "删除成功！",
          // });
        });
    },
    prevoius () {
      this.step = 1;
      this.getSelectData(1, 1000); //左侧
      // this.projectMember(this.query);//右侧
    },
    // 模糊查询引入模型名称
    queryModelInput () {
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
    queryModel () {
      this.modelQuery.condition.modelName = "";
      this.getauditModelListSql(this.modelQuery);
    },
    // 导入模型列表渲染
    getauditModelListSql (data) {
      this.lding_model = true;
      auditModelList(data).then((resp) => {
        this.lding_model = false;
        this.modelTableData = resp.data.records;
        this.modelTotal = resp.data.total;

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
        //
        this.modelTableData = resp.data.records;
        this.modelSize = resp.data;
      });
    },
    // 模型选择事件
    handleSelectionChangeModel (val) {
      //
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
    selectChangePerson (val) {

      //
      this.taskSelf.peopleTableUuid = val;
      this.edittaskSelfForm.peopleTableUuid = val;
      for (let i = 0; i < this.tableData.length; i++) {
        if (val == this.tableData[i].peopleTableUuid) {
          this.taskSelf.peopleName = this.tableData[i].peopleName;
          this.edittaskSelfForm.peopleName = this.tableData[i].peopleName;
        }
      }
    },
    selectChangenumber (val) {
      //
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
    saveBtn () {
      this.projectCode.managementProjectUuid = this.managementProjectUuid;
      // this.projectCode.projectType = this.notInitType;
      editProjectCode(this.projectCode).then((resp) => {
        this.$message({
          message: '初始化项目完成',
          type: 'success',
          duration: 1500
        });
        this.addDialogVisibleRes();
        this.reset()
      });
      // setInterval(() => {
      //   this.$router.go(0);
      // }, 1000);
    },
    // 增加模型任务按钮事件
    selectModel () {
      this.addDialogVisible = false;
      for (let i = 0; i < this.modelTableData.length; i++) {
        this.$refs.multipleModelRef.toggleRowSelection(
          this.modelTableData[i],
          false
        );
      }
      this.modelQuery.condition.projectId = this.managementProjectUuid;
      this.getauditModelListSql(this.modelQuery);

      this.modelDialog = true;//显示弹窗
    },
    // 未初始化弹框关闭事件
    addClosed () {
      this.step = 1;
      this.addDialogVisible = false;
      this.data = this.personMes;
      this.value = [];
    },
    // 新增模型任务弹框取消按钮
    res () {
      this.modelDialog = false;//模型列表 弹窗关闭
      this.addDialogVisible = true;


    },
    // 新增自建任务弹框取消按钮
    TaskSelf_res () {
      this.taskSelfDialogVisible = false;
      this.taskSelf = {};
      this.addDialogVisible = true;
    },
    // 新增自建任务弹框关闭事件
    TaskDialogClosed () {
      this.taskSelf = {};
      this.taskSelfDialogVisible = false;
      this.addDialogVisible = true;
    },
    // 新增自建任务弹框关闭事件
    MedolDialogClosed () {
      this.modelDialog = false;
      this.addDialogVisible = true;
    },
    getRowKey (row) {
      return row.auditModelUuid;
    },
    // 分页模糊查询模型列表
    queryNameInput () {
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
    queryName () {
      this.getModelList.condition.taskName = "";
      this.getauditModelList(this.getModelList);
    },
    // 分页模糊查询模型列表
    // queryName() {
    //   this.getauditModelList(this.getModelList);
    // },
    // 模型列表渲染
    getauditModelList (data) {
      this.modelloading = true;
      this.modelListTab = [];
      modelTaskList(data).then((resp) => {
        this.modelloading = false;
        this.modelListTab = resp.data.records;
        this.modelListTabSize = resp.data;
        this.taskTotal = resp.data.total;

        //
      });
    },
    // 模型引入
    modelInfo () {
      if (this.selectauditModelList.auditModelList.length > 0) {
        this.isdisabled = true;
        this.selectauditModelList.projectId = this.managementProjectUuid;
        quoteModel(this.selectauditModelList).then((resp) => {
          this.$message.success("创建成功！");
          this.modelDialog = false;
          this.addDialogVisible = true;
          this.getModelList.condition.managementProjectUuid =
            this.managementProjectUuid;
          //
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
    handleCurrentChangeModelTab (val) {
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
    addTaskSelf () {
      this.addDialogVisible = false;
      this.fileList_Delet = [];
      this.fileList = [];
      this.Upload_file = [];
      this.taskSelf.attachmentList = [];
      this.taskSelf = {};//清空传的集合
      this.taskSelfDialogVisible = true;//显示新增任务
      this.taskSelf.taskDescription = '';//清空描述
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
    // 确定自建任务
    taskSelfInfo (selfTaskRef) {
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


            axios({
              method: "post",
              url: "/wisdomaudit/attachment/fileUploads",
              headers: {
                TOKEN: this.dqtoken,
                'Content-Type': 'multipart/form-data'
              },
              data: formData,

            }).then((resp) => {
              if (resp.data.code == 0) {
                // this.$message.success("上传成功！");
                this.Upload_file = resp.data.data;
                loading.close();

                //新增自建任务接口
                this.taskSelf.attachmentList = this.Upload_file;
                this.taskSelf.managementProjectUuid =
                  this.managementProjectUuid;
                this.taskSelf.taskType = 2;


                // this.taskSelf = JSON.parse(JSON.stringify(this.taskSelf));

                console.log(this.taskSelf);
                selfTaskFunction(this.taskSelf).then((resp) => {
                  this.$message.success("自建任务创建成功！");
                  this.taskSelfDialogVisible = false;
                  this.addDialogVisible = true;
                  this.getModelList.condition.managementProjectUuid =
                    this.managementProjectUuid;
                  //
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

            console.log(this.Upload_file);
            console.log(this.fileList);
            console.log(this.taskSelf);

            this.isdisabled = true;
            this.taskSelf.taskType = 2;
            this.taskSelf.managementProjectUuid = this.managementProjectUuid;
            selfTaskFunction(this.taskSelf).then((resp) => {
              this.$message.success("自建任务创建成功！");
              this.taskSelfDialogVisible = false;
              this.addDialogVisible = true;
              this.getModelList.condition.managementProjectUuid =
                this.managementProjectUuid;
              //
              this.getauditModelList(this.getModelList);
            });

            setTimeout(() => {
              this.isdisabled = false;
            }, 3000);
          }
        } else {

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
      this.other_input = true;
      this.Upload_file = [];
      this.fileList_Delet = [];
      this.fileList = [];
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
    edittaskSelfSave (editTaskRef) {
      this.$refs[editTaskRef].validate((valid) => {
        if (valid) {

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

            axios({
              method: "post",
              url: "/wisdomaudit/attachment/fileUploads",
              headers: {
                TOKEN: this.dqtoken,
                'Content-Type': 'multipart/form-data'
              },
              data: formData,

            }).then((resp) => {
              if (resp.data.code == 0) {
                // this.$message.success("上传成功！");
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
        } else {
          return false;

        }
      });

    },
    // 自建任务删除
    delete_zj (id) {
      deletmodelTask(id).then((resp) => {
        //
        this.getTaskSelfList.condition.managementProjectUuid =
          this.managementProjectUuid;
        this.getTaskSelf(this.getTaskSelfList);
      });
    },
    //步骤关闭事件
    addDialogVisibleRes () {
      this.addDialogVisible = false;
      this.data = this.personMes;
      this.value = [];
    },
    resetForm2 (resetForm2) {
      this.$refs[resetForm2].resetFields();
      this.fileList = [];
      this.other_input = true;
      this.fileList_Delet = [];
      this.Upload_file = [];
    },
    editResetForm2 (ref) {
      this.$refs[ref].resetFields();
      this.fileList = [];
      this.fileList_Delet = [];
      this.Upload_file = [];
    },
    //新增自建任务上传附件
    handleChangePic (file, fileList) {
      this.fileList = fileList;
      this.file = file.raw;
    },
    // 附件下载
    enclosureDownload (id, fileName) {
      let formData = new FormData()
      formData.append('fileId', id)
      down_file(formData).then(resp => {
        const content = resp;
        const blob = new Blob([content],
          { type: 'application/octet-stream,charset=UTF-8' }
        )
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName //下载后文件名
          elink.style.display = 'none'
          elink.href = window.URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          window.URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }).catch((err) => {
        console.log(err);
      })
    },
    // 附件点击弹框事件
    nearbyDetails (rows) {
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
    file_details (params, index) {
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
    handleRemove (file, fileList) {
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
.mabtom {
  margin-bottom: 3%;
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
.el-menu-item.one-menu_y {
  font-size: 12px !important;
}

// 新增高亮样式
::v-deep.el-menu .el-menu-item span::not(".one-menu_y") {
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
  padding: 0 0 0 45px !important;
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
    font-size: 0.73vw;
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
      height: 60px;
      // overflow: hidden;
      // background: #f1f5fb;
      margin-right: 0.5%;
      border-radius: 10px;
      transition: all 0.3s;
      position: relative;
      cursor: pointer;
      .position {
        height: 100%;
        width: 100%;
        background-color: #f4faff;
        color: #a1a5b9;
        border-radius: 10px;
        // transition: height 0.3s;
        padding: 0 10px;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        border: 1px solid #fff;
        overflow: hidden;
        display: flex;
        align-items: center;
        .hide {
          position: relative;
          width: 100%;
          .hide_title {
            // opacity: 1;
            display: block;
            width: 100%;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            font-size: 13px;
          }
          .show_title {
            width: 100%;
            position: absolute;
            top: 16px;
            left: 0%;
            transition: top 0.3s;
            opacity: 0;
          }
        }
      }
      &:hover .hide .hide_title {
        // opacity: 0;
        display: none;
      }
      &:hover .hide .show_title {
        overflow: initial;
        position: absolute;
        top: 50%;
        left: 0%;
        opacity: 1;
        -webkit-transform: translate(0%, -50%);
        transform: translate(0%, -50%);
      }

      &:hover .position {
        height: 70px;
        box-shadow: 0 2px 10px 5px rgba(0, 0, 0, 0.05);
      }

      .tips {
        display: none;
        border-radius: 10px;
        opacity: 0;
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        left: 50%;
        top: 80px;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        -webkit-transform: translate(30px, -50%);
        transform: translate(-50%, 0%);
        -webkit-transition: opacity 0.4s;
        transition: opacity 0.4s;
        z-index: 2000;
        transition: all 0.3s;
      }
      .tips::before {
        content: "";
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 10px solid rgba(0, 0, 0, 0.8);
        position: absolute;
        left: 50%;
        top: -10px;

        -webkit-transform: translate(0px, -50%);
        transform: translate(-50%, 0%);
      }
      .tips p {
        margin-bottom: 10px;
        color: #fff;
        font-size: 13px;
        line-height: 16px;
      }
      &:hover {
        overflow: initial;
      }
      &:hover .tips {
        display: block;
        top: 70px;
        opacity: 1;
      }
    }
    .moreBtn {
      color: #12579a;
      margin: 0 0px;
      min-width: 70px;
      box-sizing: border-box;
      cursor: pointer;
      padding: 0.5%;
      border-radius: 5px;
      border: 2px solid #ebf0f6;
      font-size: 0.73vw;
      text-align: center;
      &:hover {
        box-shadow: 0 2px 10px 5px rgba(0, 0, 0, 0.05);
      }
    }
  }
}

.position .show_title {
  background-color: #f4faff;
}
.active_class .show_title {
  background: rgb(12, 135, 214) !important;
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
    min-height: 500px;
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
  width: 55%;
  height: 40px;
  margin: 30px auto;
}

/*  */
.stepOneN {
  width: 50%;
  font-size: 0;
  position: relative;
  float: left;
  background: #0c87d6;
  z-index: 50;
  /* 更改此处的颜色即可完成 */
}

.stepOneN div {
  width: 80%;
  height: 40px;
  vertical-align: text-bottom;
  font-size: 14px;
  color: #fff;
  line-height: 40px;
  text-align: center;
}

.stepOneN span:nth-of-type(1) {
  border-width: 20px 0 20px 15px;
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
  height: 40px;
  vertical-align: text-bottom;
  font-size: 14px;
  color: #000;
  line-height: 40px;
  text-align: center;
}

.auditStepOneN span:nth-of-type(1) {
  border-width: 20px 0 20px 15px;
  border-style: solid;
  border-color: #0c87d6 transparent #0c87d6 transparent;
  position: absolute;
  top: 0;
  right: 0;
}

/*  */
.stepTwoN {
  width: 50%;
  font-size: 0.7vw;
  position: relative;
  left: -5%;
  float: left;
  background: #e0e0e0;
}

.stepTwoN div {
  width: 70%;
  height: 40px;
  vertical-align: text-bottom;
  font-size: 14px;
  color: #000;
  line-height: 40px;
  text-align: center;
  margin-left: 11%;
  overflow: hidden;
}

.stepTwoN span:nth-of-type(1) {
  border-width: 20px 0 20px 15px;
  border-style: solid;
  border-color: transparent transparent transparent #e0e0e0;
  position: absolute;
  top: 0;
  left: 0;
}

.stepTwoN span:nth-of-type(2) {
  border-width: 20px 0 20px 15px;
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
  height: 40px;
  vertical-align: text-bottom;
  font-size: 14px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  margin-left: 11%;
  overflow: hidden;
}

.auditStepTwoN span:nth-of-type(1) {
  border-width: 20px 0 20px 15px;
  border-style: solid;
  border-color: transparent transparent transparent #0c87d6;
  position: absolute;
  top: 0;
  left: 0;
}

.auditStepTwoN span:nth-of-type(2) {
  border-width: 20px 0 20px 15px;
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
.addPerson >>> .el-transfer {
  // border: 1px solid red;
  // text-align: center;
  margin-top: 1%;
}
// .el-transfer {
//   // border: 1px solid red;
//   // text-align: center;
//   margin-top: 1%;
//   margin-left: 5%;
// }
.setinterPerson {
  width: 230px;
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
.addPerson >>> .el-transfer-panel__filter .el-input__inner {
  border-radius: 6px !important;
  padding: 7px !important;
  box-sizing: border-box;
}
.textarea::-webkit-input-placeholder {
  color: #c0c4cc;
  font-size: 12px;
}
.textarea::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #c0c4cc;
  font-size: 12px;
}
.textarea:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #c0c4cc;
  font-size: 12px;
}
.textarea:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #c0c4cc;
  font-size: 12px;
}

.textarea {
  width: 270px;
  min-height: 37px;
  font-size: inherit;
  color: #606266 !important;
  background-color: #ffffff;
  background-image: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: none;
}
.textarea:focus {
  outline: none;
  border-color: #1890ff;
}
.addPerson >>> .el-transfer {
  margin-top: 1%;
  padding: 0 5%;
  margin-left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.addPerson >>> .el-transfer__button:first-child {
  margin-bottom: 0;
}

.optionBtn >>> .el-form-item {
  margin-bottom: 0px !important;
}
.optionBtn >>> .el-select {
  margin-top: 0px !important;
}
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
  color: #fff !important;
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
  font-size: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.projectInit >>> .el-row div p {
  margin-top: 10px;
  font-size: 14px;
}
.initializeProject ul {
  min-height: 70px;
}
.projectWorkbench >>> .el-submenu__title:hover,
.projectWorkbench >>> .el-menu-item:hover {
  background-color: rgb(12, 135, 214, 0.3) !important;
}
.el-transfer /deep/ .el-transfer-panel {
  width: 38%;
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
.addPerson >>> .is-disabled {
  /* background: #0c87d6 !important;/ */
  opacity: 0.6 !important;
}
.one-menu_y-title {
  padding-left: 0 !important;
}
.one-menu_y {
  margin-left: 20px !important;
}
.selfTask {
  padding: 10px 0 0;
  box-sizing: border-box;
}
.selfTask >>> .el-form-item {
  margin-bottom: 25px !important;
  display: flex;
  -ms-flex-wrap: wrap;
  width: 450px;
  margin: 0 auto;
}
.selfTask >>> .el-form-item__content {
  margin-left: 10px !important;
}
.selfTask >>> .el-input,
.selfTask >>> .el-select,
.selfTask >>> .el-textarea__inner {
  width: 270px;
}

.selfTask >>> .el-upload-dragger {
  width: 100% !important;
}
.selfTask >>> .el-upload {
  width: 100% !important;
}
.selfTask >>> .upload-demo {
  /* margin-top: -35px; */
  width: 270px;
}
.selfTask >>> .el-form-item__label {
  font-size: 14px !important;
  color: #606266 !important;
}
.update {
  display: flex;
  align-items: center;
}
</style>
