<template>
  <div class="sjzl ">
    <!-- tab 切换 -->
    <el-tabs v-model="activeName"
             @tab-click="handleClick">

      <!-- 未完成 -->
      <el-tab-pane label="审计资料任务列表"
                   name="0">
        <div class="projectTab ">
          <!-- 新增 -->
          <el-row class="titleMes">
            <el-col :span="1.5">
              <el-button type="primary"
                         style="border:none;"
                         v-if="is_add==1"
                         :disabled="isDisable"
                         @click="add_data_task()">新增资料任务</el-button>
            </el-col>
            <!--未完成筛选 -->
            <div class="search">
              <el-input placeholder="请输入审计资料任务名称"
                        v-model="search_title"> </el-input>
              <div class="search_icon"
                   style="background: rgb(12, 135, 214) !important;"
                   @click="search_list(1)">
                <i class="el-icon-search"
                   style="color: rgba(255, 255, 255, 1);"></i>
              </div>
              <!-- <el-button type="primary"
                      >筛选</el-button> -->
            </div>
          </el-row>
          <el-table :data="tableData_list"
                    style="width: 100%;"
                    v-loading="loading"
                    :header-cell-style="{'background-color': '#F4FAFF',}">

            <el-table-column type="index"
                             align="center"
                             label="序号">
            </el-table-column>
            <!-- <el-table-column prop="dataTaskNumber"
                             label="流水单号"> -->
            <!-- </el-table-column> -->
            <el-table-column prop="title"
                             show-overflow-tooltip
                             label="标题">
            </el-table-column>
            <el-table-column prop="launchPeople"
                             show-overflow-tooltip
                             label="发起人">
            </el-table-column>
            <el-table-column prop="addTime"
                             show-overflow-tooltip
                             label="发起日期">
              <template slot-scope="scope">
                {{  scope.row.createTime|filtedate }}
              </template>
            </el-table-column>
            <el-table-column prop="status"
                             label="状态">
              <template slot-scope="scope">
                {{
                  scope.row.status == 0
                    ? "待开始"
                    : scope.row.status == 1
                    ? "资料待反馈":"已完成"
                }}
              </template>
            </el-table-column>

            <!-- <el-table-column prop="status"
                             show-overflow-tooltip
                             label="操作记录">
              <template slot-scope="scope">
                <a href="javascript:;"
                   style="color:rgb(19, 113, 204)"
                   @click="on_list(scope.row.addDataTaskUuid)">操作记录</a>

              </template>
            </el-table-column> -->

            <el-table-column label="操作"
                             width="200">
              <template slot-scope="scope">
                <!-- isDeleted  0:不是接口人 1:s是接口人 -->
                <div v-if="scope.row.isDeleted==1"
                     style="    display: flex;">
                  <el-button @click="on_list(scope.row.addDataTaskUuid)"
                             type="text"
                             :disabled="isDisable"
                             style="color:#0c87d6;
                                 font-size: 14px !important;background:none;border:none"
                             size="small">
                    操作记录
                  </el-button>
                  <el-button @click="exportList(scope.row)"
                             type="text"
                             style="color:#0c87d6;
                               margin-left:10px;
                                 font-size: 14px !important;background:none;border:none"
                             size="small">
                    导出
                  </el-button>
                  <div v-if="scope.row.status == 0">

                    <el-button @click="edit_common(scope.row)"
                               type="text"
                               :disabled="isDisable"
                               style="color:#0c87d6;
                               margin-left:10px;
                                 font-size: 14px !important;background:none;border:none"
                               size="small">
                      编辑
                    </el-button>
                    <el-button @click="yes_push(scope.row)"
                               type="text"
                               :disabled="isDisable"
                               style="color:#0c87d6;
                                 font-size: 14px !important;background:none;border:none"
                               size="small">
                      下发
                    </el-button>
                    <el-button @click="deleteRow(scope.row)"
                               type="text"
                               :disabled="isDisable"
                               style="color:#ff8a72;
                                 font-size: 14px !important;background:none;border:none"
                               size="small">
                      删除
                    </el-button>

                  </div>

                  <div v-if=" scope.row.status == 1">
                    <el-button @click="operation(scope.row)"
                               v-if="scope.row.doingCount>=1"
                               type="text"
                               :disabled="isDisable"
                               style="color:#0c87d6;
                               margin-left:10px;
                                 font-size: 14px !important;background:none;border:none"
                               size="small">
                      审批
                    </el-button>
                    <el-button @click="deleteRow(scope.row)"
                               type="text"
                               :disabled="isDisable"
                               style="color:#ff8a72;margin-left:10px;
                                 font-size: 14px !important;background:none;border:none"
                               size="small">
                      删除
                    </el-button>
                  </div>

                </div>
                <div v-else>

                  <!-- -- -->
                  <el-button @click="on_list(scope.row.addDataTaskUuid)"
                             type="text"
                             :disabled="isDisable"
                             style="color:#0c87d6;
                                 font-size: 14px !important;background:none;border:none"
                             size="small">
                    操作记录
                  </el-button>

                </div>
              </template>

            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="page"
             v-show="this.tableData.total>0">
          <el-pagination @size-change="handleSizeChange_model"
                         @current-change="handleCurrentChange_model"
                         :page-size="this.tableData.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="this.tableData.total">
          </el-pagination>
        </div>
        <!-- 分页 end-->
      </el-tab-pane>

      <!-- 已完成 -->
      <el-tab-pane label="已反馈的资料列表"
                   name="1">
        <!-- 新增 -->
        <el-row class="titleMes">

          <!--已完成 筛选 -->
          <div class="search">
            <el-input placeholder="请输入已完成资料列表名称"
                      v-model="search_title2"> </el-input>
            <div class="search_icon"
                 style="background: rgb(12, 135, 214) !important;"
                 @click="search_list(2)">
              <i class="el-icon-search"
                 style="color: rgba(255, 255, 255, 1);"></i>
            </div>
          </div>
        </el-row>

        <div class="projectTab anmition_show">
          <el-table :data="tableData_list2"
                    style="width: 100%;"
                    v-loading="loading"
                    :header-cell-style="{'background-color': '#F4FAFF',}">
            <!-- <el-table-column prop="dataTaskNumber"
                             label="流水单号">
            </el-table-column> -->
            <el-table-column type="index"
                             label="序号">
            </el-table-column>
            <el-table-column prop="dataName"
                             show-overflow-tooltip
                             label="资料名称">
            </el-table-column>

            <el-table-column prop="addPeople"
                             show-overflow-tooltip
                             label="反馈人">
            </el-table-column>

            <!-- <el-table-column prop="dataNumber"
                             show-overflow-tooltip
                             label="编号">
            </el-table-column>
            <el-table-column prop="secondLevelDataNumber"
                             show-overflow-tooltip
                             label="二级编号">
            </el-table-column> -->

            <el-table-column prop="department"
                             show-overflow-tooltip
                             label="部门">
            </el-table-column>
            <el-table-column prop="remarks"
                             show-overflow-tooltip
                             label="备注">
              <template slot-scope="scope">
                <p v-if="scope.row.remarks">
                  {{scope.row.remarks}}
                </p>
                <p v-else>
                  --
                </p>
              </template>
            </el-table-column>

            <el-table-column prop="createTime"
                             show-overflow-tooltip
                             label="反馈日期">

              <template slot-scope="scope">
                <span>{{scope.row.createTime|filtedate}}</span>
              </template>
            </el-table-column>

            <!-- 附件 -->
            <el-table-column prop="enclosureCount"
                             label="附件"
                             show-overflow-tooltip>
              <template slot-scope="scope">

                <el-popover :popper-class="enclosure_details_list==''?'no-padding':''"
                            v-if="scope.row.enclosureCount"
                            placement="bottom"
                            width="250"
                            @show="open_enclosure_details(scope.row.auditPreviousDemandDataUuid)"
                            trigger="click">
                  <ul v-if="enclosure_details_list!=''"
                      class="fileList-ul">
                    <li class="tableFileList-title">文件名称</li>
                    <li v-for="(item,index) in enclosure_details_list"
                        :key="index"
                        class="pointer blue"
                        @click="download(item.attachmentUuid,item.fileName)">
                      {{item.fileName}}</li>
                  </ul>
                  <div slot="reference"
                       style="color: #1371cc;"
                       class="pointer"><i class="el-icon-folder-opened list-folder"></i>{{scope.row.enclosureCount}}
                  </div>
                </el-popover>
                <p v-else>--</p>

              </template>
            </el-table-column>
            <!--附件 end  -->

          </el-table>
        </div>

        <!-- 分页 -->
        <div class="page"
             v-show="this.tableData2.total>0">>
          <el-pagination @size-change="handleSizeChange_zj"
                         @current-change="handleCurrentChange_zj"
                         :page-size="this.tableData2.size"
                         :current-page="this.tableData2.current"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="this.tableData2.total">
          </el-pagination>

        </div>
        <!-- 分页 end-->
      </el-tab-pane>
    </el-tabs>

    <!-- 新增资料 编辑资料-->
    <el-dialog width="60%"
               center
               @close="close_model"
               :visible.sync="dialogVisible"
               style="padding-bottom: 59px; ">
      <div class="title_dlag">{{title}}</div>

      <div class="dlag_conter">
        <el-form ref="add_form"
                 :inline="false"
                 :model="add_form"
                 label-width="80px">
          <!-- 标题 -->

          <el-form-item label="标题"
                        prop="title">
            <el-input v-model="add_form.title"
                      style="width:260px;"></el-input>
          </el-form-item>

          <!-- 发起人 -->
          <el-form-item label="发起人"
                        prop="name">
            <el-input v-model="add_form.name"
                      :disabled="disabled"
                      style="width:260px;"></el-input>

          </el-form-item>
        </el-form>
        <!-- 获取资料清单 -->
        <el-form label-width="80px">
          <div style="display:flex;align-items: center;padding:10px 0;box-sizing: border-box;">
            <p>获取资料清单：</p>
            <el-button plain
                       style="background: #FFFFFF;
    border: 1px solid #DCDFE6;"
                       @click="add_data_click()">添加资料</el-button>
          </div>
        </el-form>

        <!-- 模版列表 新增-->
        <div v-if="title =='新增审计资料任务' "
             class="log">
          <el-form label-width="80px">
            <el-table ref="multipleTable"
                      row-key="id"
                      v-loading="loading"
                      :data="task_list_records"
                      tooltip-effect="dark"
                      style="width: 100%"
                      :header-cell-style="{'background-color': '#F4FAFF',}"
                      @selection-change="handleSelectionChange_query">
              <el-table-column type="selection"
                               width="55">
              </el-table-column>
              <el-table-column prop="dataName"
                               label="资料名称"
                               show-overflow-tooltip>

                <template slot-scope="scope">
                  <div v-if="scope.row.dataName">
                    {{
                  scope.row.dataName
                }}
                  </div>
                  <div v-else>--</div>
                </template>

              </el-table-column>
              <el-table-column prop="dataCategory"
                               show-overflow-tooltip
                               label="类别">

                <template slot-scope="scope">
                  <div v-if="scope.row.dataCategory">
                    {{
                  scope.row.dataCategory
                }}
                  </div>
                  <div v-else>--</div>
                </template>

                <!-- <template slot-scope="scope">{{ scope.row.dataCategory }}</template> -->
              </el-table-column>
              <!-- <el-table-column prop="dataNumber"
                               show-overflow-tooltip
                               label="编号">

                <template slot-scope="scope">
                  <div v-if="scope.row.dataNumber">
                    {{
                  scope.row.dataNumber
                }}
                  </div>
                  <div v-else>--</div>
                </template>
              </el-table-column>
              <el-table-column prop="secondLevelDataNumber"
                               label="二级编号"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="scope.row.secondLevelDataNumber">
                    {{
                  scope.row.secondLevelDataNumber
                }}
                  </div>
                  <div v-else>--</div>
                </template>

              </el-table-column> -->
              <el-table-column prop="dataNumber"
                               label="附件">
                <template slot-scope="scope">

                  <!-- createUserUuid fileCount-->
                  <el-popover placement="bottom"
                              width="350"
                              v-if="scope.row.attachmentList.length!==0"
                              @show="open_file_details(scope.row.attachmentList)"
                              :popper-class="enclosure_moban_list==''?'no-padding':''"
                              trigger="click">
                    <ul class="fileList-ul">
                      <li class="tableFileList-title">模版列表 </li>
                      <li v-for="(item,index) in enclosure_moban_list"
                          :key="index"
                          class="pointer blue"
                          @click="download(item.attachmentUuid,item.fileName)">
                        {{item.fileName}}</li>
                    </ul>
                    <div slot="reference"
                         style="color: #1371cc;"
                         class="pointer"><i
                         class="el-icon-folder-opened list-folder"></i>{{scope.row.attachmentList.length}}
                    </div>
                  </el-popover>
                  <p v-else>--</p>
                </template>
              </el-table-column>

              <el-table-column prop="department"
                               label="部门"
                               show-overflow-tooltip>

                <template slot-scope="scope">
                  <div v-if="scope.row.department">
                    {{
                  scope.row.department
                }}
                  </div>
                  <div v-else>--</div>
                </template>

              </el-table-column>
              <el-table-column prop="remarks"
                               label="备注"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="scope.row.remarks">
                    {{
                  scope.row.remarks
                }}
                  </div>
                  <div v-else>--</div>
                </template>

              </el-table-column>

            </el-table>
          </el-form>
          <!-- 分页 -->
          <div class="page">

            <el-pagination @size-change="handleSizeChange_csh"
                           @current-change="handleCurrentChange_csh"
                           :current-page="this.task_list.current"
                           :page-size="this.task_list.size"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="this.task_list.total">
            </el-pagination>

          </div>
          <!-- 分页 end-->
        </div>

        <!-- 模版列表 编辑 -->
        <div v-else>
          <el-form label-width="80px">
            <el-table ref="multipleTable"
                      row-key="id"
                      :data="task_list_records_details"
                      tooltip-effect="dark"
                      style="width: 100%"
                      @selection-change="handleSelectionChange_query">
              <el-table-column type="selection"
                               width="55">
              </el-table-column>
              <el-table-column prop="dataCategory"
                               label="类别">

              </el-table-column>
              <el-table-column prop="dataNumber"
                               show-overflow-tooltip
                               label="编号">
              </el-table-column>
              <el-table-column prop="secondLevelDataNumber"
                               label="二级编号"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="dataName"
                               label="资料名称"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="department"
                               label="部门"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="remarks"
                               label="备注"
                               show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-form>
          <div class="page">

            <el-pagination @size-change="handleSizeChange_details"
                           @current-change="handleCurrentChange_details"
                           :current-page="this.edit_details.pageCurrent"
                           :page-size="this.edit_details.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="this.edit_details.pageTotal">
            </el-pagination>
          </div>
          <!-- 分页 end-->
        </div>

      </div>
      <span slot="footer">
        <el-button plain
                   @click="close()">取 消</el-button>
        <!-- 新增保存 -->
        <el-button type="primary"
                   v-if="title=='新增审计资料任务'"
                   :disabled="isDisable"
                   @click="query_add_form(1)">保存</el-button>
        <!-- 编辑保存 -->
        <el-button type="primary"
                   v-else
                   :disabled="isDisable"
                   @click="query_add_form(2)">保存</el-button>
        <!-- 新增直接下发 -->
        <el-button type="primary"
                   :disabled="isDisable"
                   v-if="success_btn_push ==0"
                   @click="add_push_save()">下发</el-button>
        <el-button v-if="success_btn_push ==1"
                   type="primary"
                   :loading="true">下发中</el-button>
      </span>
    </el-dialog>

    <!-- 添加资料  审批的时候  查看详情-->
    <el-dialog @close="resetForm('add_data')"
               center
               width="55%"
               :visible.sync="dialogVisible2"
               style="padding-bottom: 59px; ">
      <div class="title_dlag">{{edit_title}} </div>
      <div class="dlag_conter2 shenhe">

        <el-form :rules="rules"
                 :model="add_data"
                 ref="add_data">

          <div class="son">
            <el-form-item prop="dataCategory"
                          label-width="130px"
                          style="padding:0 0 0 0"
                          label="类别：">
              <el-select v-model="add_data.dataCategory"
                         @change="PrjType_change"
                         :disabled="edit_title == '详细信息'"
                         placeholder="请选择类别">
                <el-option v-for="item in sensitiveOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="资料名称："
                          style="padding:0 0 0 0"
                          label-width="130px"
                          prop="dataName">
              <el-input v-model="add_data.dataName"
                        :disabled="edit_title == '详细信息'"
                        placeholder="请输入资料名称"></el-input>
            </el-form-item>
          </div>

          <div class="son"
               v-if="user_data">
            <el-form-item label="编号："
                          style="padding:0 0 0 0"
                          label-width="130px"
                          prop="dataNumber">
              <el-input v-model="add_data.dataNumber"
                        :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="二级编号："
                          style="padding:0 0 0 0"
                          label-width="130px"
                          prop="secondLevelDataNumber">
              <el-input v-model="add_data.secondLevelDataNumber"
                        :disabled="disabled"></el-input>
            </el-form-item>
          </div>
          <div class="son"
               v-else>
            <el-form-item label="编号："
                          style="padding:0 0 0 0"
                          label-width="130px"
                          prop="dataNumber">
              <el-input :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="二级编号："
                          style="padding:0 0 0 0"
                          label-width="130px"
                          prop="secondLevelDataNumber">
              <el-input :disabled="disabled"></el-input>
            </el-form-item>
          </div>
          <div class="son">

            <el-form-item label="部门："
                          style="padding:0 0 0 0"
                          label-width="130px"
                          prop="department">
              <el-select v-model="add_data.department"
                         @change="Department_change"
                         :disabled="edit_title == '详细信息'"
                         placeholder="请选择资料部门">
                <el-option v-for="item in sensitiveDepartment"
                           :key="item.auditOrgUuid"
                           :label="item.orgName"
                           :value="item.orgName">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label-width="130px"
                          label="来源："
                          style="padding:0 0 0 0;visibility: hidden;">
              <el-select v-model="add_data.source"
                         @change="DataSource_change"
                         :disabled="edit_title == '详细信息'"
                         placeholder="请选择来源">
                <el-option v-for="item in sensitiveDataSource"
                           :key="item.value"
                           :label="item.label"
                           :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="来源："
                          label-width="120px"
                          prop="source">
              <el-select v-model="add_data.source"
                         @change="DataSource_change"
                         :disabled="edit_title == '详细信息'"
                         placeholder="请选择来源">
                <el-option v-for="item in sensitiveDataSource"
                           :key="item.value"
                           :label="item.label"
                           :value="item.label">
                </el-option>
              </el-select>
            </el-form-item> -->
          </div>
          <div class="son"
               v-if="user_data">
            <el-form-item label="添加人："
                          style="padding:0 0 0 0"
                          label-width="130px"
                          prop="addPeople">
              <el-input v-model="add_data.addPeople"
                        :disabled="disabled"
                        class="addPeople"></el-input>
              <!-- <div class="addPeople">{{add_data.addPeople}}</div> -->
            </el-form-item>

            <el-form-item label="添加日期："
                          style="padding:0 0 0 0"
                          label-width="130px"
                          prop="addTime">
              <div class="block">
                <el-date-picker v-model="add_data.addTime"
                                :disabled="disabled"
                                type="date">
                </el-date-picker>
              </div>
            </el-form-item>
          </div>
          <div class="son"
               v-else>
            <el-form-item label="添加人："
                          style="padding:0 0 0 0"
                          label-width="130px"
                          prop="addPeople">
              <el-input class="addPeople"></el-input>
              <!-- <div class="addPeople">{{add_data.addPeople}}</div> -->
            </el-form-item>

            <el-form-item label="添加日期："
                          style="padding:0 0 0 0"
                          label-width="130px"
                          prop="addTime">
              <div class="block">
                <el-date-picker type="date">
                </el-date-picker>
              </div>
            </el-form-item>

          </div>

          <div class="son cd">
            <el-form-item label="是否沉淀为常规需求资料："
                          style="padding:0 0 0 10px"
                          label-width="254px"
                          prop="status">
              <el-radio-group v-model="add_data.status"
                              style="padding-top:10px;    box-sizing: border-box;"
                              @change="changeHandler">
                <el-radio :label="2"
                          :disabled="edit_title == '详细信息'">否</el-radio>
                <el-radio :label="1"
                          :disabled="edit_title == '详细信息'">是</el-radio>
              </el-radio-group>
            </el-form-item>

          </div>

          <div class="son cd">
            <el-form-item label="备注："
                          label-width="260px"
                          prop="remarks">
              <el-input type="textarea"
                        :disabled="edit_title == '详细信息'"
                        v-model="add_data.remarks"
                        placeholder=""></el-input>
            </el-form-item>
          </div>

          <div class="son cd">
            <!-- <el-form-item label-width="260px"
                          style="margin-bottom:0!important"
                          class="up"> -->
            <el-form-item label="模版新增："
                          label-width="260px"
                          style="margin-bottom:0!important"
                          class="up">

              <!-- <p>模版新增：</p> -->
              <!-- <el-input type="textarea"
                        v-model="add_data.file"
                        placeholder=""></el-input> -->
              <el-upload class="upload-demo"
                         :disabled="edit_title == '详细信息'?true:false"
                         drag
                         ref="upload"
                         action="#"
                         :headers="headers"
                         :on-change="handleChangePic_verify"
                         :on-remove="handleRemoveApk"
                         :file-list="edit_file_list"
                         :auto-upload="false"
                         accept=".zip,.doc,.docx,.xls,.xlsx,.txt"
                         multiple>

                <i class="el-icon-upload"></i>
                <div class="el-upload__text">点击上传或将文件拖到虚线框<br />支持.zip,.doc,.docx,.xls,.xlsx,.txt</div>
              </el-upload>

            </el-form-item>
          </div>

        </el-form>
      </div>

      <span slot="footer">
        <el-button plain
                   @click="dialogVisible2 = false">取 消</el-button>

        <el-button type="primary"
                   v-if="success_btn==0"
                   @click="save_data_btn('add_data')">确定</el-button>
        <el-button v-if="success_btn==1"
                   type="primary"
                   :loading="true">上传中</el-button>
        <el-button v-if="success_btn==2"
                   type="primary"
                   :loading="true">添加中</el-button>
      </span>
    </el-dialog>

    <!-- 操作 审批-->
    <el-dialog width="90%"
               center
               @close="editDialogClosed()"
               :visible.sync="dialogVisibl_operation"
               style="padding-bottom: 59px; ">
      <div class="title_dlag">审批</div>

      <div class="dlag_conter3">

        <div class="tt">资料列表</div>

        <div class="operation_header">
          <div>
            <p>资料名称：</p>
            <el-input v-model="operation_query.dataName"
                      align="center"
                      placeholder="请输入资料名称"></el-input>
            <p>资料类型：</p>
            <el-select v-model="operation_query.dataCategory"
                       style="width:180px"
                       clearable
                       placeholder="请选择类别">
              <el-option v-for="item in sensitiveOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.label">
              </el-option>
            </el-select>

          </div>
          <el-button type="primary"
                     @click="search_operation_list()">查询</el-button>
        </div>

        <el-table ref="multipleTable"
                  :data="operation_tableData"
                  tooltip-effect="dark"
                  style="width: 100%"
                  v-loading="loading"
                  :header-cell-style="{'background-color': '#F4FAFF',}"
                  @selection-change="handleSelectionChange_operation">
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column label="类型"
                           prop="dataCategory"
                           width="120">
            <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
          </el-table-column>
          <!-- <el-table-column prop="dataNumber"
                           label="编号"
                           width="120">
          </el-table-column>
          <el-table-column prop="secondLevelDataNumber"
                           label="二级编号"
                           show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column prop="dataName"
                           label="资料名称"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="department"
                           label="部门"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="remarks"
                           label="备注"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="createTime"
                           label="提供时间"
                           show-overflow-tooltip>

            <template slot-scope="scope">
              {{  scope.row.createTime |filtedate }}
            </template>

          </el-table-column>
          <!-- 状态 -->
          <el-table-column prop="status"
                           label="状态"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              {{
                  scope.row.status == 0
                    ? "待提交"
                    : scope.row.status == 1
                    ? "已提交"
                    : scope.row.status ==2
                    ?'已拒绝 ':'审核通过'
                }}
            </template>

          </el-table-column>
          <!-- 附件 -->
          <el-table-column prop="enclosureCount"
                           label="附件"
                           show-overflow-tooltip>
            <template slot-scope="scope">

              <el-popover :popper-class="enclosure_details_list==''?'no-padding':''"
                          v-if="scope.row.enclosureCount"
                          placement="bottom"
                          width="250"
                          @show="open_enclosure_details(scope.row.auditPreviousDemandDataUuid)"
                          trigger="click">
                <ul v-if="enclosure_details_list!=''"
                    class="fileList-ul">
                  <li class="tableFileList-title">文件名称</li>
                  <li v-for="(item,index) in enclosure_details_list"
                      :key="index"
                      class="pointer blue"
                      @click="download(item.attachmentUuid,item.fileName)">
                    {{item.fileName}}</li>
                </ul>
                <div slot="reference"
                     style="color: #1371cc;"
                     class="pointer"><i class="el-icon-folder-opened list-folder"></i>{{scope.row.enclosureCount}}
                </div>
              </el-popover>
            </template>

          </el-table-column>
          <!--附件 end  -->

          <el-table-column prop="address"
                           align="center"
                           label="操作">
            <template slot-scope="scope">
              <el-button size="small"
                         type="text"
                         plain
                         style="border:none!important;background:none!important; color: #49bae8!important;"
                         :disabled="isDisable"
                         @click="look_record(scope.row)">查看</el-button>
              <!-- <el-button size="small"
                         type="primary"
                         @click="post(scope.row)">提交</el-button> -->
            </template>
          </el-table-column>

        </el-table>

        <!-- 分页 -->
        <div class="page">
          <el-pagination @size-change="handleSizeChange_list_data"
                         @current-change="handleCurrentChange_list_data"
                         :current-page="this.operation_table.current"
                         :page-size="this.operation_table.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="this.operation_table.total">
          </el-pagination>
        </div>
        <!-- 分页 end-->

        <div class="tt"
             v-if="record_status==true">操作记录</div>

        <!-- 操作记录 -->
        <div v-if="record_status==true">

          <el-table :data="record_list_table"
                    :header-cell-style="{
                    'background-color': '#F4FAFF',}"
                    style="width: 100%">

            <el-table-column prop="opOperate"
                             label="操作类型"
                             width="180">
            </el-table-column>
            <el-table-column prop="opUserName"
                             label="操作人"
                             width="180">
            </el-table-column>
            <el-table-column prop="opTime"
                             label="操作时间">
              <template slot-scope="scope">
                {{scope.row.opTime |filtedate }}
              </template>
            </el-table-column>
            <el-table-column prop="opInfo"
                             label="备注">
            </el-table-column>

            <!-- 附件 -->
            <el-table-column prop="count"
                             label="附件"
                             width="90">
              <template slot-scope="scope">
                <el-popover :popper-class="enclosure_details_list==''?'no-padding':''"
                            v-if="scope.row.fileCount"
                            placement="bottom"
                            width="250"
                            @show="open_enclosure_details(scope.row.auditPreviousDemandDataUuid)"
                            trigger="click">
                  <ul v-if="enclosure_details_list!=''"
                      class="fileList-ul">
                    <li class="tableFileList-title">文件名称</li>
                    <li v-for="(item,index) in enclosure_details_list"
                        :key="index"
                        class="pointer blue"
                        @click="download(item.attachmentUuid,item.fileName)">
                      {{item.fileName}}</li>
                  </ul>
                  <div slot="reference"
                       style="color: #1371cc;"
                       class="pointer"><i class="el-icon-folder-opened list-folder"></i>{{scope.row.fileCount}}
                  </div>
                </el-popover>

              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <div class="page"
             v-if="record_status==true">
          <el-pagination @size-change="handleSizeChange_record_list"
                         @current-change="handleCurrentChange_record_list"
                         :current-page="this.history_log.current"
                         :page-size="this.history_log.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="this.history_log.total">
          </el-pagination>
        </div>
        <!-- 分页 end-->

        <div class="remarks"
             style="margin-top:10px">
          <p>备注：</p>
          <el-input type="textarea"
                    style="padding:10px;width:100%"
                    v-model="audit_query.posy_remarks"></el-input>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="reject()"
                   :disabled="isDisable"
                   v-if="success_btn1==0"
                   plain>驳回</el-button>
        <el-button plain
                   v-if="success_btn1==1"
                   :loading="true">驳回中</el-button>

        <el-button type="primary"
                   v-if=" success_btn2==0"
                   :disabled="isDisable"
                   @click="adopt()">通过</el-button>
        <el-button type="primary"
                   v-if=" success_btn2==1"
                   :loading="true">通过中</el-button>
      </span>
    </el-dialog>

    <!-- 附件详情 -->
    <el-dialog width="20%"
               center
               :header-cell-style="{'background-color': '#F4FAFF',}"
               :visible.sync="dialogVisibl_enclosure_details"
               style="padding-bottom: 59px; ">

      <!-- 0模版资料 -->
      <el-table :data="enclosure_moban_list"
                v-if="moban_list==0"
                style="width: 100%;">
        <el-table-column prop="fileName"
                         label="文件名称">
          <template slot-scope="scope">
            <el-button @click="download(scope.row.attachmentUuid,scope.row.fileName)"
                       class="file_name"
                       type="text"
                       style="color: #1371cc"
                       size="small">
              {{ scope.row.fileName }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 附件资料 -->
      <!-- <el-table :data="enclosure_details_list"
                v-if="moban_list==1"
                style="width: 100%;">
        <el-table-column prop="fileName"
                         align="center"
                         label="文件名称">
          <template slot-scope="scope">
            <el-button @click="download(scope.row.attachmentUuid,scope.row.fileName)"
                       class="file_name"
                       type="text"
                       style="color: #1371cc"
                       size="small">
              {{ scope.row.fileName }}
            </el-button>
          </template>
        </el-table-column>
      </el-table> -->
    </el-dialog>

    <!-- 确认是否下发 -->
    <div class="whether"
         v-if="whether==true"
         style="padding-bottom: 10px; ">
      <div>
        <span class="close"
              @click="whether = false">×</span>
        <p>是否确认下发</p>
        <span slot="footer">
          <el-button size="small"
                     type="primary"
                     :disabled="isDisable"
                     @click="list_push()">确认</el-button>

          <el-button size="small"
                     @click="whether = false">取 消</el-button>
        </span>
      </div>

    </div>

    <!-- 操作记录 -->
    <el-dialog :visible.sync="history"
               center
               width="width">
      <div class="title_dlag">操作记录</div>

      <div class="dlag_conter4">
        <el-table :data="history_log.records"
                  v-loading="loading_history"
                  :header-cell-style="{'background-color': '#F4FAFF',}"
                  style="width: 100%;">

          <el-table-column prop="opOperate"
                           show-overflow-tooltip
                           label="操作类型">
          </el-table-column>
          <el-table-column prop="opUserName"
                           show-overflow-tooltip
                           label="操作人">
          </el-table-column>
          <el-table-column prop="opTime"
                           show-overflow-tooltip
                           label="操作时间">
          </el-table-column>
          <el-table-column prop="opInfo"
                           show-overflow-tooltip
                           label="备注">
          </el-table-column>
          <el-table-column prop="fileCount"
                           show-overflow-tooltip
                           label="附件">
            <template slot-scope="scope">

              <el-popover :popper-class="details_list==''?'no-padding':''"
                          v-if="scope.row.attachmentList"
                          placement="bottom"
                          width="250"
                          @show="open_enclosure_details_file(scope.row)"
                          trigger="click">
                <ul v-if="details_list!=''"
                    class="fileList-ul">
                  <li class="tableFileList-title">文件名称</li>
                  <li v-for="(item,index) in details_list"
                      :key="index"
                      class="pointer blue"
                      @click="download(item.attachmentUuid,item.fileName)">
                    {{item.fileName}}</li>
                </ul>
                <div slot="reference"
                     style="color: #1371cc;"
                     class="pointer"><i
                     class="el-icon-folder-opened list-folder"></i>{{scope.row.attachmentList.length}}
                </div>
              </el-popover>
              <p v-else>--</p>

            </template>
          </el-table-column>

        </el-table>

        <!-- 分页 -->
        <div class="page">
          <el-pagination @size-change="handleSizeChange_operation"
                         @current-change="handleCurrentChange_operation"
                         :current-page="this.history_log.current"
                         :page-size="this.history_log.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="this.history_log.total">
          </el-pagination>
        </div>
        <!-- 分页 end-->

      </div>
      <!-- <div slot="footer">
        <el-button @click="history = false"
                   plain
                   style="background: #FFFFFF;
    border: 1px solid #DCDFE6;">取 消</el-button>
        <el-button type="primary"
                   @click="history = false">确 定</el-button>
      </div> -->
    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";
import {
  data_pageList, data_push, data_save, add_pageList, data_pageListDone, data_delete, data_push_ing, data_edit_details, data_update, data_add_savePush, data_edit_savePush, loadcascader, saveTemp, operation_list_data, operation_record_list, operation_audit, operation_uploadData, select_loadcascader, enclosure_details, select_user_data,
  enclosure_sysLogById, enclosure_details_file, enclosure_downloadByFileId, operation_addExit, operation_addTitle,
  loadaudittorg
} from
  '@SDMOBILE/api/shandong/data'
import { fmtDate } from '@SDMOBILE/model/time.js';
import {
  task_personLiable,//责任人
} from
  '@SDMOBILE/api/shandong/task'

import { down_file, addDataTask_export } from
  '@SDMOBILE/api/shandong/ls'
import { Input } from 'element-ui';
export default {
  components: {},
  data () {
    return {
      edit_file_list2: [],//上传
      dqtoken: "",
      headers: '',
      activeName: 0,
      title: '新增审计资料任务',
      edit_title: '添加资料',//审核title
      dialogVisible: false,//新增弹窗
      dialogVisible2: false,//添加资料
      dialogVisibl_operation: false,//操作
      // color: '',   // 上传文件icon 颜色
      dialogVisibl_enclosure_details: false,//附件详情
      loading: false,
      loading_history: false,//操作记录
      whether: false,//是否下发
      success_btn_push: 0,
      sensitiveOptions: [],//添加资料 类型
      sensitiveDepartment: [],//添加资料 部门
      sensitiveDataSource: [],//添加资料 来源
      // addPeople: '',//添加人
      history: false,//查看记录

      search_title: '',//未完成 筛选title
      search_title2: '',//已完成

      disabled: true,//责任人点击

      // 添加资料
      add_data: {
        value_select: '',//select
        // typecode: 'PrjType',// PrjType 类型  Department 部门  DataSource 来源
        dataCategory: '',//类别
        dataName: '',// 资料名称
        dataNumber: '',//编号
        secondLevelDataNumber: '',//二级编号
        department: '',//部门
        source: '',//来源
        remarks: '',//备注
        addPeople: '',//添加人
        status: '',  // 是否沉淀
        addTime: '',//添加日期
        // fileList: [],//文件模版
        Url: '',// 上传模版url

      },
      // 添加日期
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        },
      },
      //新增资料 校验规则
      rules: {
        dataCategory: [{ required: true, message: '请选择类别', trigger: 'change' }],
        dataName: [{ required: true, message: '请输入资料名称', trigger: 'blur' }],
        // dataNumber: [{ required: true, message: '请输入资料编号', trigger: 'blur' }],
        // secondLevelDataNumber: [{ required: true, message: '请输入二级编号', trigger: 'blur' }],
        department: [{ required: true, message: '请选择部门', trigger: 'change' }],
        source: [{ required: true, message: '请选择来源', trigger: 'change' }],
        // remarks: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        status: [{ required: true, message: '请选择是否沉淀', trigger: 'change' }],
        // fileList: [{ required: true, message: '请上传模板', trigger: 'change' }],
        // addTime: [{ required: true, message: '请设置添加日期', trigger: 'change' }],
      },
      operation_table: [],//操作  资料列表
      operation_tableData: [],//操作  资料列表
      multipleSelection_operation: [],//操作全选
      operation_query: {
        pageNo: 1,
        pageSize: 10,
        dataCategory: '',//类型
        dataName: '',//名称
        addDataTaskUuid: '',//id
      },

      record_list: [],//操作记录 数据
      record_list_table: [],
      record_params: {
        id: '',
      },
      // 审核
      audit_query: {
        taskId: '',
        posy_remarks: '',//操作 备注
      },

      record_status: false,//查看操作记录

      projectNumber: '',//项目id 编号
      projectType: '1111',//项目类型
      addDataTaskUuid: '',//任务类型id
      // 未完成
      tableData: [],//未完成数据
      multipleSelection: [],//新增列表选中的数据
      tableData_list: [],//未完成列表
      params: {
        pageNo: 1,
        pageSize: 10,
      },

      // 新增任务 确认保存
      add_form: {
        title: '',//标题
        name: '',//发起人
      },

      // 下发
      push_id: '',


      multipleSelection_list: [], // 新增 任务弹窗里的全选
      task_list: [],// 新增任务初始化 数据

      task_list_records: [],//新增任务初始化 列表
      task_list_records_details: [],//编辑任务初始化 列表

      // 新增任务初始化  传递参数
      params_add: {
        pageNo: 1,
        pageSize: 10,
      },
      edit_details: [],//编辑 回显详情数据

      // 已完成
      tableData2: [],//已完成数据
      multipleSelection2: [],//新增列表选中的数据
      tableData_list2: [],//已完成列表
      params2: {
        pageNo: 1,
        pageSize: 10,
      },
      // 编辑资料模版
      edit_details_query: {
        pageNo: 1,
        pageSize: 10,
      },

      // 附件详情
      enclosure_details_list: [],//附件详情
      disabled: true,
      update_path: '',//上传后的文件返回
      filePath: "/auditData/temp/",//分路径
      success_btn: 0,//文件上传完成

      history_log: [],//查看 操作记录

      //列表 操作记录
      operation_query: {
        id: '',//
        pageNo: 1,
        pageSize: 10,
      },

      // 审核 操作日志
      record_query: {
        id: '',
        pageNo: 1,
        pageSize: 10,
      },

      fileList: [],//上传的文件

      edit_file_list: [],

      moban_list: 0,//模版附件
      enclosure_moban_list: [],//模版资料

      user_data: {},//添加资料回显
      is_add: '',//是否接口人
      // 是否显示新增
      isDisable: false,//防止重复提交


      success_btn1: 0,
      success_btn2: 0,
      selectprojectPeopleNum: {},



      details_list: [],//操作记录附件
    }
  },
  computed: {},
  watch: {},
  created () {
    this.headers = { 'TOKEN': sessionStorage.getItem('TOKEN') }
    this.dqtoken = sessionStorage.getItem("TOKEN");
    this.projectNumber = this.active_project;

    let params = {
      pageNo: this.params.pageNo,
      pageSize: this.params.pageSize,
      condition: {
        projectNumber: this.projectNumber,
        title: this.search_title,
      }
    }

    // 资料 未完成列表
    this.list_data_start(params);//未完成

    // 新增未完成任务列表
    this.add_add_csh();
    this.post_select_loadcascader_lx();//添加资料   类型 数据
    this.post_select_loadcascader_bm(this.selectprojectPeopleNum);//添加资料   部门 数据
    this.post_select_loadcascader_ly();//添加资料   领域 数据

    // 获取请求人
    this.task_personLiable_data();


    // 标题 是否显示 新增

    this.query_title()
  },
  mounted () { },
  props: ['active_project', 'userRole'],
  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      // return fmtDate(t, 'yyyy-MM-dd hh:mm:ss');
      return fmtDate(t, 'yyyy-MM-dd ');
    }
  },

  methods: {
    exportList (row) {
      // let formData = new FormData();
      // formData.append('addDataTaskUuid', row.addDataTaskUuid)
      addDataTask_export(row.addDataTaskUuid).then(resp => {
        const content = resp;
        const blob = new Blob([content],
          { type: 'application/octet-stream,charset=UTF-8' }
        )
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = row.title + ".zip"; //下载后文件名
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
    // 获取标题
    query_title () {
      let params_title = {
        id: this.projectNumber
      }
      operation_addTitle(params_title).then(resp => {
        this.add_form.title = resp.data.title//标题
        this.is_add = resp.data.isDelete//是否新增
        console.log(resp.data.isDelete);
      })
    },
    // 获取责任人
    task_personLiable_data () {
      task_personLiable().then(resp => {
        this.add_form.name = resp.data.realName//责任人name
        this.disabled = true
      })
    },
    // 关闭新增
    close_model () {
      this.get_out();
      this.success_btn_push = 0;

    },
    // 新增资料任务时退出
    get_out () {
      operation_addExit().then(resp => {
        console.log(resp);
      })
    },
    // 资料筛选
    search_list (index) {
      switch (index) {
        case 1:
          // 未完成
          let params = {
            pageNo: 1,
            pageSize: this.params.pageSize,
            condition: {
              projectNumber: this.projectNumber,
              title: this.search_title,
            }
          }
          break;
        default:
          // 已完成
          let param = {
            pageNo: 1,
            pageSize: this.params2.pageSize,
            condition: {
              dataTaskNumber: this.projectNumber,
              dataName: this.search_title2,
            }
          }
          this.list_data_end(param)//刷新已完成列表
          break;
      }
    },
    // 列表查看记录
    on_list (id) {
      this.operation_query.id = id
      this.operation_data()//操作记录
      this.loading_history = true;
      this.history = true;

    },
    // 操作记录
    operation_data () {
      let params = {
        condition: {
          auditDataTaskUuid: this.operation_query.id,
        },
        pageNo: this.operation_query.pageNo,
        pageSize: this.operation_query.pageSize,
      }
      enclosure_sysLogById(params).then(resp => {
        console.log(resp.data);
        this.history_log = resp.data
        this.loading_history = false;
      })
    },

    // 控制每每页
    handleSizeChange_operation (val) {
      this.operation_query.pageSize = val
    },
    // 操作记录分页
    handleCurrentChange_operation (val) {
      this.operation_query.pageNo = val
      this.operation_data()//操作记录
    },

    // 上传中回调
    beforeAvatarUpload (file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt50M = file.size / 1024 / 1024 < 50;
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt50M) {
        this.$message.error('上传模版不能超过 50MB!');
      }
      return isLt50M;
    },
    // 上传时
    up_ing () {
      this.success_btn = 1;//显示加载按钮  0成功  1 loaging
    },
    // 结果数 核实上传  删除
    handleRemoveApk (file, fileList) {
      file.response && this.fileList.remove(file.response.data);
      file.response && (this.key = Math.random())
    },

    // 上传成功回调
    // handleChangePic_verify (resp, file) {
    //   this.update_path = resp.data.filePath
    //   console.log(this.update_path);
    //   if (resp.code == 0) {
    //     this.add_data.Url = URL.createObjectURL(file.raw);

    //     this.$message({
    //       message: '上传成功',
    //       type: 'success'
    //     });
    //     this.success_btn = 0;//隐藏加载按钮
    //     return false
    //   } else {
    //     this.$message({
    //       message: resp.msg,
    //       type: 'error'
    //     });
    //   }
    // },
    // 顶部tab 切换事件
    handleClick (val, event) {
      this.search_title = '';//清空筛选
      this.search_title2 = '';//清空筛选

      switch (val.index) {
        case 0:
          // 未完成
          let params = {
            pageNo: this.params.pageNo,
            pageSize: this.params.pageSize,
            condition: {
              projectNumber: this.projectNumber,
              title: this.search_title,
            }
          }
          this.list_data_start(params)//未完成列表
          break;
        default:
          // 已完成
          let param = {
            pageNo: this.params2.pageNo,
            pageSize: this.params2.pageSize,
            condition: {
              dataTaskNumber: this.projectNumber,
              dataName: this.search_title2,
            }
          }
          this.list_data_end(param)//已完成列表
          break;
      }
    },
    // 关闭
    close () {
      this.dialogVisible = false;
      this.get_out();//关闭请求的接口
      // this.add_form.name = '';//清空name
      // this.add_form.title = '';//清空title

      // this.add_data.dataNumber = '';//编号
      // this.add_data.secondLevelDataNumber = '';//二级编号
      // this.add_data.addPeople = '';//添加人
      // this.add_data.addTime = '';//添加日期

    },
    // 未完成============================
    // 列表 未完成
    list_data_start (params) {
      this.loading = true
      data_pageList(params).then(resp => {
        this.tableData = resp.data;
        this.tableData_list = resp.data.records
        this.loading = false
      })
    },
    handleSizeChange_model () {
      this.params.pageSize = val
    },
    // 任务列表分页
    handleCurrentChange_model (val) {
      let params = {
        pageNo: val,
        pageSize: this.params.pageSize,
        condition: {
          projectNumber: this.projectNumber,
          title: this.search_title,
        }
      }
      this.list_data_start(params)
    },


    //新增任务 弹窗
    add_data_task () {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      // this.add_form.name = '';//清空name
      this.add_form.title = '';//清空title
      // 标题 是否显示 新增
      let params_title = {
        id: this.projectNumber
      }
      this.query_title(params_title)

      this.dialogVisible = true
      this.title = '新增审计资料任务';
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection();//清空
      })

      // this.$refs.multipleTable.clearSelection();//
    },

    // 新增  初始化模版 查看附件
    open_file_details (list) {
      // console.log(list);
      this.moban_list = 0;
      this.enclosure_moban_list = list;//模版资料
      // if (this.enclosure_moban_list.length == 0) {
      //   this.$message('暂无上传的附件');
      //   return false
      // } else {
      // this.dialogVisibl_enclosure_details = true;
      // }

    },
    // 操作记录查看附件
    open_enclosure_details_file (data) {
      this.details_list = data.attachmentList;
      console.log(this.details_list);
    },


    // 查看附件详情
    open_enclosure_details (id) {
      this.enclosure_details_list = [];//清空附件
      // 已完成列表 查看详情
      let params = {
        id: id,
      };
      // 附件详情
      enclosure_details_file(params).then(resp => {
        this.loading = true;
        this.enclosure_details_list = resp.data
        this.loading = false;
        // if (this.enclosure_details_list.length == 0) {
        //   this.$message('暂无上传的附件');
        //   return false
        // } else {
        //   this.dialogVisibl_enclosure_details = true;

        // }
      })

    },
    // 下载
    download (id, fileName) {
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


    // 添加资料
    add_data_click () {
      this.add_data = {}; //清空
      this.dialogVisible2 = true;
      this.edit_title = '添加资料'
    },
    // 新增任务初始化 列表
    add_add_csh () {
      this.loading = true;
      let params = {
        pageNo: this.params_add.pageNo,
        pageSize: this.params_add.pageSize,
        condition: {
          projectType: this.projectNumber,//项目id
        }

      }

      add_pageList(params).then(resp => {
        this.task_list = resp.data;
        this.task_list_records = resp.data.records;
        this.loading = false;
      })
    },

    // 新增任务初始化 列表 分页每页条数
    handleSizeChange_csh (val) {
      this.params_add.pageSize = val
    },
    // 新增任务初始化 列表 分页
    handleCurrentChange_csh (val) {
      this.params_add.pageNo = val;
      this.add_add_csh()
    },


    // 新增任务列表 里的全选
    handleSelectionChange_query (val) {
      this.multipleSelection_list = val;
    },
    // 确认保存添加的资料
    query_add_form (index) {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      // 新增保存 编辑 为空拦截
      if (this.add_form.title == '') {
        this.$message.info("请输入标题！");
        return false
      }
      if (this.multipleSelection_list.length == 0) {
        this.$message.info("请选择至少一条数据！");
        return false
      }
      let array1 = [];//数组1
      this.multipleSelection_list.forEach((item) => {
        array1.push(item);
      });
      // 新增确认
      if (index == 1) {
        let params = {
          demandDataList: array1,//勾选的数据
          title: this.add_form.title,//标题
          launchPeople: this.add_form.name,//发起人
          projectNumber: this.projectNumber,//项目id
        };
        this.query_save(params)//进行新增确认保存操作
      } else {
        // 编辑确认
        let params2 = {
          demandDataList: array1,//勾选的数据
          title: this.add_form.title,//标题
          launchPeople: this.add_form.name,//发起人
          projectNumber: this.projectNumber,//项目id
          addDataTaskUuid: this.addDataTaskUuid,
        };

        // 编辑保存
        this.query_update(params2);//编辑保存
      }

    },
    // 新增直接下发
    add_push_save () {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      // 新增保存
      if (this.add_form.title == '') {
        this.$message.info("请输入标题！");
        return false
      }
      // else if (this.add_form.name == '') {
      //   this.$message.info("请输入发起人！");
      //   return false
      // }
      if (this.multipleSelection_list.length == 0) {
        this.$message.info("请选择至少一条数据！");
        return false
      }
      this.success_btn_push = 1;

      let array1 = [];//数组1
      this.multipleSelection_list.forEach((item) => {
        array1.push(item);
      });
      // this.array1 = array1

      if (this.title == '新增审计资料任务') {
        let params_push = {
          demandDataList: array1,
          title: this.add_form.title,
          launchPeople: this.add_form.name,
          projectNumber: this.projectNumber,
          // addDataTaskUuid: this.addDataTaskUuid,
        };
        // 新增 直接下发
        data_add_savePush(params_push).then(resp => {
          this.success_btn_push = 0;
          console.log(resp);
          if (resp.code == 0) {
            this.$message({
              message: "下发成功",
              type: "success",
            });
            // 未完成
            let params = {
              pageNo: this.params.pageNo,
              pageSize: this.params.pageSize,
              condition: {
                projectNumber: this.projectNumber,
                title: this.search_title,
              }
            }
            this.list_data_start(params)//未完成列表
            this.dialogVisible = false;//关闭新增弹窗

            // this.add_form.name = '';//清空name
            // this.add_form.title = '';//清空name
            array1 = [];//清空

          } else {
            this.$message({
              message: resp.msg,
              type: "error",
            });
          }
        })
      } else {
        let params_push = {
          demandDataList: array1,
          title: this.add_form.title,
          launchPeople: this.add_form.name,
          projectNumber: this.projectNumber,
          addDataTaskUuid: this.addDataTaskUuid,
        };

        // 编辑下发
        data_edit_savePush(params_push).then(resp => {
          console.log(resp);
          if (resp.code == 0) {
            this.$message({
              message: "下发成功",
              type: "success",
            });
            // 未完成
            let params = {
              pageNo: this.params.pageNo,
              pageSize: this.params.pageSize,
              condition: {
                projectNumber: this.projectNumber,
                title: this.search_title,
              }
            }
            this.list_data_start(params)//未完成列表
            this.dialogVisible = false;//关闭新增弹窗

            // // this.add_form.name = '';//清空name
            // this.add_form.title = '';//清空name
            array1 = [];//清空

          } else {
            this.$message({
              message: resp.msg,
              type: "error",
            });
          }

        })
      }

    },
    // 新增确认
    query_save (params) {
      data_save(params).then(resp => {
        console.log(resp);
        if (resp.code == 0) {
          this.$message({
            message: "新增成功",
            type: "success",
          });

          // 未完成
          let params = {
            pageNo: this.params.pageNo,
            pageSize: this.params.pageSize,
            condition: {
              projectNumber: this.projectNumber,
              title: this.search_title,
            }
          }
          this.list_data_start(params)//未完成列表

          this.dialogVisible = false;//关闭新增弹窗
          // this.add_form.name = '';//清空name
          // this.add_form.title = '';//清空tltle
          this.array1 = [];//清空
        } else {
          this.$message({
            message: resp.msg,
            type: "error",
          });
        }
      })
    },
    // 编辑确认
    query_update (params2) {
      data_update(params2).then(resp => {
        // console.log(resp);
        if (resp.code == 0) {
          this.$message({
            message: "编辑成功",
            type: "success",
          });
          // 未完成
          let params = {
            pageNo: this.params.pageNo,
            pageSize: this.params.pageSize,
            condition: {
              projectNumber: this.projectNumber,
              title: this.search_title,
            }
          }
          this.list_data_start(params)//未完成列表



          this.dialogVisible = false;//关闭新增 编辑弹窗



        } else {
          this.$message({
            message: resp.data.msg,
            type: "error",
          });
        }
      })
    },


    // 添加资料===============================

    // 添加资料  类别
    post_select_loadcascader_lx () {
      let params = {
        // typecode: 'PrjType',//类型
        typecode: 'DataType',//类型
      }
      select_loadcascader(params).then(resp => {
        this.sensitiveOptions = resp.data;
      })
    },
    // 类别类型 change
    PrjType_change (val) {
      this.add_data.dataCategory = val;
      let params = {
        dataCategory: this.add_data.dataCategory
      }
      this.change_people(params);//审核回显 添加人

    },

    change_people (params) {
      //  if (this.edit_title = '详细信息') {

      //   alert(1)
      // } else {
      //   let params = {
      //     dataCategory: this.add_data.dataCategory,
      //   };
      //   alert(2)
      // }
      //根据类型查看新增的 资料信息
      select_user_data(params).then(resp => {
        console.log(resp.data);
        this.user_data = resp.data
        this.add_data.dataNumber = this.user_data.dataNumber;//编号
        this.add_data.secondLevelDataNumber = this.user_data.secondLevelDataNumber;//二级编号
        this.add_data.addPeople = this.user_data.addPeople;//添加人
        this.add_data.addTime = this.user_data.addTime;//添加日期
        this.disabled = true;
      });
    },

    // 添加资料   部门
    post_select_loadcascader_bm (data) {
      // let params = {
      //   typecode: 'Department',//部门
      // }
      loadaudittorg(data).then(resp => {
        this.sensitiveDepartment = resp.data;
        console.log(this.sensitiveDepartment);
      })
    },
    // 部门
    Department_change (val) {
      this.add_data.department = val
      console.log(this.add_data.department);


    },

    // 添加资料  来源
    post_select_loadcascader_ly () {
      let params = {
        typecode: 'DataSource',//来源
      }
      select_loadcascader(params).then(resp => {
        this.sensitiveDataSource = resp.data;
      })
    },
    // 添加资料  来源
    DataSource_change (val) {
      this.add_data.source = val
    },

    // 添加资料  是否沉淀 radio
    changeHandler (val) {
      this.add_data.status = val;
      // 1:沉淀 2：不沉淀
    },
    //添加资料 关闭清空
    resetForm (formName) {
      this.$refs[formName].resetFields();//清空添加的值
      this.$refs.upload.clearFiles();

    },

    // 新增上传附件
    handleChangePic_verify (file, fileList, name) {
      this.fileList = fileList;
      this.file = file.raw
    },

    //添加资料 保存按钮
    save_data_btn (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.fileList.length !== 0) {
            this.success_btn = 1;//显示加载按钮  0成功  1 loaging
            let formData = new FormData()
            formData.append('file', this.file.raw)
            this.fileList.forEach((item) => {
              formData.append('files', item.raw);
            })
            axios({
              method: 'post',
              url: '/wisdomaudit/attachment/fileUploads',
              headers: {
                TOKEN: this.dqtoken,
                'Content-Type': 'multipart/form-data'
              },
              data: formData,

            }).then(resp => {
              // 上传成功
              if (resp.data.code == 0) {
                this.success_btn = 0;//显示加载按钮  0成功  1 loaging
                // console.log(resp.data.data);
                this.Upload_file = resp.data.data;//上传成功大的文件

                let params = {
                  dataCategory: this.add_data.dataCategory,//类别
                  dataName: this.add_data.dataName,//资料名称
                  dataNumber: this.add_data.dataNumber,//编号
                  secondLevelDataNumber: this.add_data.secondLevelDataNumber,//二级编号
                  department: this.add_data.department,//部门
                  source: this.add_data.source,//来源
                  remarks: this.add_data.remarks,//备注
                  addPeople: this.addPeople,//添加人
                  addTime: this.add_data.addTime,//添加时间
                  status: this.add_data.status,//是否沉淀
                  attachmentList: this.Upload_file,//回调上传的文件路径
                  // enclosure: '111',//回调上传的文件路径
                  projectType: this.projectNumber,//项目id
                }
                this.save_data_up(params)//保存
              } else {
                // 上传失败
                this.$message({
                  message: resp.data.msg,
                  type: 'error'
                });
                this.success_btn = 0;//显示加载按钮  0成功  1 loaging
              }
            })
          } else {
            this.success_btn = 2;//显示加载按钮  0成功  1 loaging  2:确认中
            // 如果未上传
            let params = {
              dataCategory: this.add_data.dataCategory,//类别
              dataName: this.add_data.dataName,//资料名称
              dataNumber: this.add_data.dataNumber,//编号
              secondLevelDataNumber: this.add_data.secondLevelDataNumber,//二级编号
              department: this.add_data.department,//部门
              source: this.add_data.source,//来源
              remarks: this.add_data.remarks,//备注
              addPeople: this.addPeople,//添加人
              addTime: this.add_data.addTime,//添加时间
              status: this.add_data.status,//是否沉淀
              attachmentList: this.edit_file_list,//回调上传的文件路径
              // enclosure: '111',//回调上传的文件路径
              projectType: this.projectNumber,//项目id
            }
            this.save_data_up(params)
          }
        } else {
          this.$message.info("请填写信息");
          return false;
        }
      });
    },
    // 提交
    save_data_up (params) {
      saveTemp(params).then(resp => {
        console.log(resp.data);
        if (resp.code == 0) {
          this.$message({
            message: '添加资料成功',
            type: 'success'
          });
          this.success_btn = 0;
          this.dialogVisible2 = false;
          // 新增未完成任务列表
          this.add_add_csh();
        } else {
          this.$message({
            message: reesp.msg,
            type: error
          });
        }

      })
    },


    // 显示下发 确认
    yes_push (data) {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      this.push_id = data.addDataTaskUuid
      this.whether = true;//显示确认下发
    },

    // 未完成列表 确认任务下发
    list_push () {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      let params = {
        taskId: this.push_id,
      }
      data_push_ing(params).then(resp => {
        // console.log(resp.data);
        if (resp.code == 0) {
          this.$message({
            message: "下发成功",
            type: "success",
          });
          this.whether = false;//显示确认下发
          // 未完成
          let params = {
            pageNo: this.params.pageNo,
            pageSize: this.params.pageSize,
            condition: {
              projectNumber: this.projectNumber,
              title: this.search_title,
            }
          }
          this.list_data_start(params)//未完成列表
        } else {
          this.$message({
            message: resp.msg,
            type: "error",
          });
        }


      })
    },
    // 列表选择事件
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // 删除
    deleteRow (data) {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
      // console.log(data);
      this.$confirm(`将永久删除资料和关联的附件?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(data);
          let params = {
            ids: data.addDataTaskUuid,
          };
          this.remove(params)//删除
        })
        .catch(() => { });
    },
    // 删除接口
    remove (params) {
      data_delete(params).then(resp => {
        console.log(resp.data);
        if (resp.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success",
          });

          // 未完成
          let params = {
            pageNo: 1,
            pageSize: this.params.pageSize,
            condition: {
              projectNumber: this.projectNumber,
              title: this.search_title,
            }
          }
          this.list_data_start(params)//未完成列表


        } else {
          this.$message({
            message: resp.data.msg,
            type: "error",
          });
        }
      });
    },
    // 操作
    operation (data) {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
      this.dialogVisibl_operation = true;
      // console.log(data);
      this.addDataTaskUuid = data.addDataTaskUuid;
      let params = {
        pageNo: this.operation_query.pageNo,
        pageSize: this.operation_query.pageSize,
        condition: {
          dataName: this.operation_query.dataName,
          dataCategory: this.operation_query.dataCategory,
          dataTaskNumber: this.addDataTaskUuid,
        }
      }
      this.operation_list(params); // 操作 资料列表
    },
    // 操作 资料列表
    operation_list (params) {
      this.loading = true
      operation_list_data(params).then(resp => {
        this.operation_table = resp.data
        this.operation_tableData = resp.data.records
        this.loading = false
      })
    },
    // 操作 资料列表分页 控制每页条数
    handleSizeChange_list_data (val) {
      this.operation_query.pageSize = val
    },
    // 操作 资料列表 分页
    handleCurrentChange_list_data (val) {
      let params = {
        pageNo: val,
        pageSize: this.operation_query.pageSize,
        condition: {
          dataName: this.operation_query.dataName,
          dataCategory: this.operation_query.dataCategory,
          dataTaskNumber: this.addDataTaskUuid,
        }
      };
      this.operation_list(params); // 操作 资料列表
    },
    // 查询 资料列表
    search_operation_list () {
      if (this.operation_query.data_name == '' || this.operation_query.data_category == '') {
        this.$message.info("请输入标题或者选择类型 后进行查询！");
        return false
      }
      let params = {
        pageNo: this.operation_query.pageNo,
        pageSize: this.operation_query.pageSize,
        condition: {
          dataName: this.operation_query.dataName,
          dataCategory: this.operation_query.dataCategory,
          dataTaskNumber: this.addDataTaskUuid,
        }
      };
      this.operation_list(params); // 操作 资料列表
    },

    // 操作 资料列表 里的全选
    handleSelectionChange_operation (val) {
      this.multipleSelection_operation = val;
    },
    //查看操作 记录
    look_record (data, index) {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
      // console.log(index);
      // this.record_status = true;
      this.record_query.id = data.auditPreviousDemandDataUuid;
      this.dialogVisible2 = true//显示编辑
      this.edit_title = '详细信息'
      let params = {
        dataCategory: data.dataCategory
      }
      this.change_people(params);//审核回显 添加人
      this.add_data.dataCategory = data.dataCategory;//基本类型
      this.add_data.dataName = data.dataName;//资料名称
      this.add_data.dataNumber = data.dataNumber;//编号
      this.add_data.secondLevelDataNumber = data.secondLevelDataNumber;//二级编号
      this.add_data.source = data.source;//来源
      this.add_data.department = data.department;//部门
      this.add_data.remarks = data.remarks;//备注
      this.add_data.status = data.isDeleted;//是否沉淀 0.否 1.是
      this.add_data.addPeople = data.addPeople;//添加人
      this.add_data.addTime = data.createTime;//addTime
      var list = data.attachmentList//附件列表
      // 编辑回显
      if (list) {
        this.edit_file_list = [];
        // 回显
        list.forEach(item => {
          item.isDeleted = 0;
          item.url = item.filePath;
          item.name = item.fileName;
          this.edit_file_list.push(item);
        })
      }
    },
    // 审批操作记录  分页每页条数
    handleSizeChange_record_list (val) {
      this.record_query.pageSize = val
    },
    // 审批操作记录  分页
    handleCurrentChange_record_list (val) {
      let query_params = {
        condition: {
          logSysActiUuid: this.record_query.id
        },
        pageNo: val,
        pageSize: this.record_query.pageSize
      }
      this.post_operation_record(query_params)
    },


    // 操作记录
    post_operation_record (query_params) {
      operation_record_list(query_params).then(resp => {
        this.record_list = resp.data
        this.record_list_table = resp.data.records;
      })
    },
    // 通过
    adopt () {

      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
      if (this.multipleSelection_operation.length == 0) {
        this.$message.info("请选择一条数据进行操作");
        return
      }
      this.success_btn2 = 1;//显示加载按钮  0成功  1 loaging

      let array1 = [];//数组1
      this.multipleSelection_operation.forEach((item) => {
        array1.push(item);
      });
      let params2 = {
        status: 3,
        note: this.audit_query.posy_remarks,
        auditPreviousDemandData: array1,
      }
      this.audit(3, params2);//通过
    },
    // 驳回
    reject () {

      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      if (this.multipleSelection_operation.length == 0) {
        this.$message.info("请选择一条数据进行操作");
        return
      }
      this.success_btn1 = 1;//显示加载按钮  0成功  1 loaging
      // this.dialogVisible2 = false
      let array1 = [];//数组1
      this.multipleSelection_operation.forEach((item) => {
        array1.push(item);
      });

      let params2 = {
        status: 2,//
        note: this.audit_query.posy_remarks,
        auditPreviousDemandData: array1,
      }
      this.audit(2, params2)//2:驳回  3:通过
    },
    // 关闭审核
    editDialogClosed () {
      this.operation_query.dataCategory = '';//清空审核筛选
      this.operation_query.dataName = '';//清空审核筛选
      this.dialogVisibl_operation = false;//关闭
      this.success_btn1 = 0
      this.success_btn2 = 0
    },

    // 审核
    audit (index, params) {
      // 驳回
      if (index == 2) {
        operation_audit(params).then(resp => {
          this.success_btn1 = 0
          console.log(resp.data);
          if (resp.code == 0) {
            if (resp.data.result == 1) {
              this.$message({
                message: "驳回成功",
                type: "success",
              });
              let params2 = {
                pageNo: this.operation_query.pageNo,
                pageSize: this.operation_query.pageSize,
                condition: {
                  dataName: this.operation_query.dataName,
                  dataCategory: this.operation_query.dataCategory,
                  dataTaskNumber: this.addDataTaskUuid,
                }
              };
              this.audit_query.posy_remarks = ''//清空备注
              this.operation_list(params2); // 操作 资料列表
              let params = {
                pageNo: this.params.pageNo,
                pageSize: this.params.pageSize,
                condition: {
                  projectNumber: this.projectNumber,
                  title: this.search_title,
                }
              }
              this.list_data_start(params)
              this.dialogVisibl_operation = false;//关闭
            }
            if (resp.data.result == 3) {
              this.$message({
                message: "已审核通过的数据不可再次驳回！",
                type: "success",
              });
            }
          } else {
            this.$message({
              message: resp.data.msg,
              type: "error",
            });
          }
        })
      }
      // 通过
      if (index == 3) {
        operation_audit(params).then(resp => {
          console.log(resp.data);
          this.success_btn2 = 0
          if (resp.code == 0) {
            if (resp.data.result == 1) {
              this.$message({
                message: "通过成功",
                type: "success",
              });

              let params2 = {
                pageNo: this.operation_query.pageNo,
                pageSize: this.operation_query.pageSize,
                condition: {
                  dataName: this.operation_query.dataName,
                  dataCategory: this.operation_query.dataCategory,
                  dataTaskNumber: this.addDataTaskUuid,
                }
              };
              this.operation_list(params2); // 操作 资料列表
              this.audit_query.posy_remarks = ''//清空备注

              let params = {
                pageNo: this.params.pageNo,
                pageSize: this.params.pageSize,
                condition: {
                  projectNumber: this.projectNumber,
                  title: this.search_title,
                }
              }
              this.list_data_start(params)
              this.dialogVisibl_operation = false;//关闭
            }
            if (resp.data.result == 3) {
              this.$message({
                message: "已通过的数据不可再次通过！",
                type: "success",
              });
            }
          } else {
            this.$message({
              message: resp.data.msg,
              type: "error",
            });
          }
        })
      }

    },


    // 操作记录分页
    // 操作 资料列表 分页
    // handleCurrentChange_record (val) {
    //   let params = {
    //     pageNo: this.record_params.pageNo,
    //     pageSize: this.record_params.pageSize,
    //   }
    //   this.operation_list(params); // 操作 资料列表
    // },



    // 任务列表 显示编辑
    edit_common (data) {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
      // this.add_form.name = '';//清空name
      // this.add_form.title = '';//清空title
      // this.$refs.multipleTable.clearSelection();//清空
      this.title = '编辑审计资料任务';
      this.dialogVisible = true;//显示编辑

      // 资料任务id
      this.addDataTaskUuid = data.addDataTaskUuid
      let params_query = {
        condition: {
          addDataTaskUuid: this.addDataTaskUuid,
          projectType: this.active_project,
        },
        pageNo: this.edit_details_query.pageNo,
        pageSize: this.edit_details_query.pageSize,
      };
      this.edut_details(params_query);//编辑详情
    },
    // 编辑
    edut_details (params_query, index) {
      // 显示编辑 详情
      data_edit_details(params_query).then(resp => {
        // let data = resp.data.demandDataList;
        this.edit_details = resp.data
        this.add_form.title = this.edit_details.title;
        this.add_form.name = this.edit_details.launchPeople;
        this.task_list_records_details = resp.data.demandDataList

        // 显示模版列表数据
        let params2 = {
          pageNo: this.params_add.pageNo,
          pageSize: this.params_add.pageSize,
          projectType: this.projectType,
        }
        // 编辑回显 多选框
        for (let i = 0; i < this.task_list_records_details.length; i++) {
          if (this.task_list_records_details[i].status == 2) {
            this.$nextTick(() => {
              this.$refs.multipleTable.toggleRowSelection(this.task_list_records_details[i], true);
            })
          }
        }
      });
    },
    // 编辑分页每页
    handleSizeChange_details (val) {
      this.edit_details_query.pageSize = val
    },
    // 编辑分页
    handleCurrentChange_details (val) {
      let params = {
        condition: {
          addDataTaskUuid: this.addDataTaskUuid,
          projectType: this.active_project,
        },
        pageNo: val,
        pageSize: this.edit_details_query.pageSize,
      };
      this.edut_details(params);
    },
    // 已完成==========================
    // 已完成列表
    list_data_end (params2) {
      this.loading = true
      data_pageListDone(params2).then(resp => {
        this.tableData2 = resp.data;
        this.tableData_list2 = resp.data.records
        this.loading = false
      })
    },
    handleSizeChange_zj (val) {
      this.params2.pageSize = val
    },
    // 已完成 分页
    handleCurrentChange_zj (val) {

      let params = {
        pageNo: this.params2.pageNo,
        pageSize: this.params2.pageSize,
        condition: {
          dataTaskNumber: this.projectNumber,
          dataName: this.search_title2,

        }
      }
      this.list_data_end(params)//刷新已完成列表
    },


  }

}
</script>

<style scoped>
@import "../../../assets/styles/css/lhg.css";
/* @import "../../../assets/styles/css/yw.css"; */

>>> .foot .el-button {
  font-weight: normal;
}
>>> .el-dialog--center .el-dialog__body {
  padding: 0 !important;
}
>>> .el-dialog--center .el-dialog__body .el-form-item__label {
  font-size: 14px;
}
.sjzl >>> .is-plain {
  background: #ffffff !important;
  border: 1px solid #dcdfe6 !important;
}

.projectTab >>> .el-button,
.search >>> .el-input__inner {
  border-radius: 0px;
}
.search {
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.search >>> .el-input__inner {
  width: 220px !important;
}
.search >>> .el-input__inner {
  width: 180px;
  display: flex;
  float: right;
}
.search >>> .search_icon {
  position: absolute;
  top: 0;
  right: 0;
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
  border-radius: 0 5px 5px 0;
  /* background: #1371cc !important; */
}

.sjzl >>> .el-tabs__nav-wrap::after,
.sjzl >>> .el-tabs__active-bar {
  height: 4px;
}
/* 确认下发 */
.whether {
  position: fixed;
  transform: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  margin-top: 15vh;
  width: 170px;
  min-width: auto;
  background: #ffffff;
  border-radius: 8px !important;
  z-index: 9999;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
}
.whether div {
  position: relative;
}
.whether div p {
  width: 100%;
  padding: 10px 0;
  margin-bottom: 10px;

  box-sizing: border-box;
}
.whether div .close {
  position: absolute;
  right: -5px;
  top: -5px;
  cursor: pointer;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.5);
  transition: all 0.3s;
}
.whether div .close:hover {
  color: rgba(0, 0, 0, 0.8);
}
/* .whether .projectTab >>> .el-table th.el-table__cell > .cell,
.projectTab >>> .has-gutter .cell,
.projectTab >>> .el-table td.el-table__cell div {
  text-align: center;
  justify-content: center !important;
} */
.projectTab >>> .el-table {
  min-height: 500px;
}

.sjzl .conter {
  width: 100%;
  float: left;
}
.tab_ul {
  width: 100%;
  float: left;
  height: 50px;

  border-bottom: 2px solid #eeeeee;
}

.titleMes {
  padding: 10px 0 0;
  box-sizing: border-box;
}
.table {
}
.sjzl >>> .el-table__header {
  border-top: none !important;
}
/* .dlag_conter2 >>> .el-table .cell {
  display: flex;
  justify-content: center !important;
} */
/* 附件详情 */

.update {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
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

.update >>> .el-dialog__wrapper {
  position: absolute !important;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 0;
}
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}

.dlag_conter {
  padding: 20px;
  box-sizing: border-box;
}
.dlag_conter >>> .el-form-item {
  margin-bottom: 20px !important;
  display: flex;
}
.dlag_conter >>> .el-form-item__content {
  margin-left: 10px !important;
}
/* .sjzl >>> .el-dialog__footer {
  text-align: center !important;
} */

/* 新增资料 */
.dlag_conter2 {
  padding: 20px 20px 20px 0px;
}
.dlag_conter2 p {
  padding-top: 10px;
  min-width: 120px;
  text-align: right;
}

.dlag_conter2 >>> .el-input {
  width: 220px !important;
}
.dlag_conter2 >>> .el-form {
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.dlag_conter2 >>> .el-form-item__content {
  margin-left: 10px !important;
  display: flex;
  width: 100%;
  align-items: center;
}
.son {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
}

.dlag_conter2 >>> .el-form-item {
  margin-bottom: 20px !important;
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
  /* flex-wrap: wrap; */
}
.dlag_conter2 >>> .el-form-item__content {
}
.dlag_conter2 >>> .el-textarea {
  width: 80%;
}

.tt {
  font-size: 16px;
  padding: 20px 0;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
}
.sjzl >>> .el-dialog {
  min-width: 800px;
}
.addPeople {
  width: 220px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
.dlag_conter3 {
  padding: 20px;
  box-sizing: border-box;
}
.dlag_conter3 >>> .operation_header {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  justify-content: space-between;
}
.dlag_conter3 >>> .operation_header div {
  display: flex;
  align-items: center;
}
.dlag_conter3 >>> .operation_header div p {
  margin-left: 20px;
}
.dlag_conter3 >>> .operation_header div .el-input {
  width: 220px !important;
}
.dlag_conter3 >>> .operation_header div .el-select {
  width: 120px;
}

/* 为空提示 */
.dlag_conter2 >>> .el-form-item__error {
  left: 0 !important;
}
.cd >>> .el-form-item__error {
  left: 0 !important;
}
.dlag_conter2 >>> .el-form-item__error {
  left: 120px;
}
.cd >>> .el-form-item__error {
  left: 205px;
}
.remarks {
  width: 100%;
}
.remarks p {
  width: 100%;
  text-align: left;
  padding: 10px 0;
}
.dlag_conter2 >>> .el-input.is-disabled .el-input__inner {
  color: #606266 !important;
  background-color: rgba(0, 0, 0, 0.2) !important;
  background: none;
  opacity: 0.5;
}

/* 上传模版 */
.dlag_conter2 >>> .up .el-form-item__content {
  display: flex;
  align-items: flex-start !important;
}
.cd >>> .el-form-item {
  width: 100%;
}

.cd >>> .upload-demo {
  width: 80% !important;
}
.cd >>> .el-upload,
.cd >>> .el-upload-dragger {
  width: 100% !important;
}
@media screen and (min-width: 1920px) {
  .cd >>> .el-form-item__content p {
    width: 210px;
    box-sizing: border-box;
  }
}
@media screen and (max-width: 1920px) {
  .cd >>> .el-form-item__content p {
    box-sizing: border-box;
  }
}
.file_name:hover {
  color: #1371cc;
  cursor: pointer;
}

.shenhe {
  position: relative;
  display: flex;
}
.mose {
  width: 100%;
  height: 100%;
  z-index: 99;
  opacity: 0.5;
  position: absolute;
  left: 0;
  top: 0;
}
.dlag_conter4 {
  padding: 17px 20px;
}
</style>
