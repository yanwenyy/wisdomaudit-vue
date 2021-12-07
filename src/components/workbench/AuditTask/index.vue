<template>
  <div class="sjzl anmition_show">
    <!-- {{managementProjectUuid}} -->
    <div class="conter">
      <div class="projectTab">
        <!-- tab -->
        <el-row :gutter="24"
                class="titleMes">

          <!-- 自建新增   -->
          <el-col :span="1.5">
            <el-button type="primary"
                       style="border:none;"
                       v-if="userRole==1 || userRole==2 "
                       @click="new_add_zj()">新增任务</el-button>
          </el-col>

          <!--自建任务 模型任务 筛选 -->
          <div class="search">
            <el-input placeholder="请输入模型或自建任务名称"
                      v-model="search_taskName"> </el-input>
            <div class="search_icon"
                 style=" background: rgb(12, 135, 214) !important;"
                 @click="search_list()">
              <i class="el-icon-search"
                 style="color: white;   "></i>
            </div>
            <!-- <el-button type="primary"
                      >筛选</el-button> -->
          </div>
        </el-row>
        <!-- tab end-->

        <!-- 自建任务 -->
        <div class="task_type">
          <!-- 表单 -->
          <el-table :data="tableData_list"
                    :header-cell-style="{'background-color': '#F4FAFF',}"
                    v-loading="loading"
                    style="width: 100%">
            <!-- 任务/自建任务名称 -->
            <el-table-column prop="taskName"
                             width="180"
                             show-overflow-tooltip
                             label="任务名称">
              <template slot-scope="scope">
                <p v-if="scope.row.taskName">
                  {{scope.row.taskName}}
                </p>
                <p v-else>
                  --
                </p>
              </template>
            </el-table-column>

            <!-- 专题 -->
            <el-table-column prop="belongSpcial"
                             show-overflow-tooltip
                             label="专题">
              <template slot-scope="scope">
                <p v-if="scope.row.belongSpcial">
                  {{scope.row.belongSpcial}}
                </p>
                <p v-else>
                  --
                </p>
              </template>
            </el-table-column>

            <!-- 类型 -->
            <el-table-column prop="taskType"
                             show-overflow-tooltip
                             label="类型">
              <template slot-scope="scope">
                {{
                  scope.row.taskType == 1
                    ? "模型任务":'自建任务'
                }}
              </template>
            </el-table-column>

            <!-- 责任人 -->
            <el-table-column prop="peopleName"
                             show-overflow-tooltip
                             label="责任人 ">
              <template slot-scope="scope">
                <p v-if="scope.row.peopleName">
                  {{scope.row.peopleName}}
                </p>
                <p v-else>
                  --
                </p>
              </template>
            </el-table-column>

            <!-- 问题数 -->
            <el-table-column prop="problemsNumber"
                             show-overflow-tooltip
                             label="问题数">
              <template slot-scope="scope">
                <!-- scope.row.taskType ：1 模型  2自建 -->
                <el-button v-if="scope.row.problemsNumber!==0"
                           @click="probleNum_click(scope.row.auditTaskUuid,scope.row.auditModelName)"
                           type="text"
                           style="color: #1371cc;background:none"
                           size="small">
                  {{ scope.row.problemsNumber }}
                </el-button>

                <el-button v-else
                           type="text"
                           style="background:none;cursor: not-allowed;"
                           size="small">
                  --
                </el-button>

              </template>
            </el-table-column>

            <!-- 结果数 -->
            <el-table-column prop="resultsNumber"
                             show-overflow-tooltip
                             label="结果数">
              <template slot-scope="scope">
                <el-button @click="data_num_click(scope.row)"
                           v-if="scope.row.taskType ==1 &&  scope.row.resultsNumber!==0"
                           type="text"
                           style="color: #1371cc;background:none"
                           size="small">
                  {{ scope.row.resultsNumber }}
                </el-button>

                <el-button v-else
                           type="text"
                           style="background:none;cursor: not-allowed;"
                           size="small">
                  --
                </el-button>

              </template>
            </el-table-column>
            <!-- 附件 -->
            <el-table-column prop="file_details_li"
                             label="附件"
                             width="90">

              <template slot-scope="scope">
                <!-- createUserUuid fileCount-->
                <el-popover placement="bottom"
                            width="350"
                            v-if="scope.row.fileCount"
                            @show="open_enclosure_details_data(scope.row.auditTaskUuid,scope.row.paramTaskUuid,)"
                            :popper-class="file_new==''?'no-padding':''"
                            trigger="click">

                  <ul class="fileList-ul">
                    <li class="tableFileList-title">现场提取资料 </li>
                    <li v-for="(item,index) in file_new.attachmentList1"
                        :key="index"
                        class="pointer blue"
                        @click="download(item.attachmentUuid,item.fileName)">
                      {{item.fileName}}</li>
                  </ul>

                  <ul class="fileList-ul">
                    <li class="tableFileList-title">最终审计核实结果数据</li>
                    <li v-for="(item,index) in file_new.attachmentList2"
                        :key="index"
                        class="pointer blue"
                        @click="download(item.attachmentUuid,item.fileName)">
                      {{item.fileName}}</li>
                  </ul>

                  <ul class="fileList-ul">
                    <li class="tableFileList-title">问题核实反馈资料 </li>
                    <li v-for="(item,index) in file_new.attachmentList3"
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

                <div v-if="!scope.row.fileCount">
                  --
                </div>
              </template>
            </el-table-column>

            <!-- 状态 -->
            <el-table-column prop="resultsNumber"
                             show-overflow-tooltip
                             label="运行状态">

              <template slot-scope="scope">
                <div v-if="scope.row.taskType == 1 && scope.row.runStatus!==0">
                  {{
                  scope.row.runStatus == 0
                    ? "未开始"
                    : scope.row.runStatus == 1
                    ? "运行中"
                    : scope.row.runStatus == 2
                    ? "已完成":'运行失败'
                }}
                </div>
                <div v-if="scope.row.taskType ==2">
                  --
                </div>
              </template>
            </el-table-column>

            <!-- 操作 -->
            <el-table-column label="操作"
                             width="250">
              <template slot-scope="scope">
                <div v-if="userRole==1 || userRole==2 "
                     style="display: flex;">

                  <!-- 模型 ---------->
                  <!-- 重新执行设置 -->
                  <el-button @click="setParameters(scope.row)"
                             type="text"
                             v-if=" scope.row.taskType == 1"
                             style="color: #0c87d6!important;
                               font-size: 14px !important;
"
                             size="small">
                    运行
                  </el-button>

                  <!-- 查看结果 -->
                  <el-button @click="data_num_click(scope.row)"
                             type="text"
                             v-if=" scope.row.taskType == 1"
                             style="color: #0c87d6!important;
                               font-size: 14px !important;
"
                             size="small">
                    查看结果
                  </el-button>

                  <!-- 模型 ===========---------->

                  <!-- 编辑 模型可以编辑-->
                  <div v-if="scope.row.status!==0">
                    <el-button @click="edit_data(scope.row)"
                               :disabled="isDisable"
                               v-if="scope.row.taskType ==2 && [scope.row.status==1 || scope.row.status==2]"
                               type="text"
                               style="color: #0c87d6!important;
                                 font-size: 14px !important;
"
                               size="small">编辑</el-button>

                    <!-- 删除 -->
                    <el-button @click="delete_model(scope.row.auditTaskUuid,scope.row.problemsNumber )"
                               v-if="scope.row.status==1 || scope.row.status==2"
                               type="
                           text"
                               style="color:#ff8a72!important;
                                 font-size: 14px !important;border:none;"
                               :disabled="isDisable"
                               size="small">
                      删除
                    </el-button>
                  </div>

                </div>
                <div v-else>
                  --
                </div>

              </template>
            </el-table-column>
          </el-table>
          <!-- 表单 end-->
          <!-- 分页 -->
          <div class="page">
            <el-pagination @size-change="handleSizeChange_zijian"
                           @current-change="handleCurrentChange_zijian"
                           :page-size="this.tableData.size"
                           :current-page="this.tableData.current"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="this.tableData.total">
            </el-pagination>
          </div>
          <!-- 分页 end-->
        </div>
        <!-- 自建任务 end-->
      </div>
    </div>

    <!-- 模型任务 结果数 -->
    <el-dialog width="90%"
               el-dialog
               @close="handleClose"
               :close-on-click-modal="false"
               popper-class="status_data_dlag"
               :visible.sync="dialogVisible_data_num"
               style="padding-bottom: 59px">
      <div class="title_dlag">查看结果</div>

      <div class="dlag_conter2">
        <!-- 结果分类  -->
        <el-row :gutter="24">
          <ul class="status_data">
            <li v-for="(item,index) in status_data"
                :key="index">

              <el-button type="primary"
                         v-if="item.tableType==1"
                         :class="data_active == index ? 'active':''"
                         @click="select_data(index)">主表</el-button>
              <el-button type="primary"
                         v-if="item.tableType!==1"
                         :class="data_active == index ? 'active':''"
                         @click="select_data(index)">附表{{index}}</el-button>
            </li>

          </ul>
        </el-row>

        <!-- 结果操作 -->
        <div class="cxjg"
             style="margin: 20px 0; display: flex">
          <el-col> 模型线索结果（{{jg_title}}模型） </el-col>
          <el-col style="display: contents">
            <el-button plain
                       v-if="userRole==1 || userRole==2 "
                       @click="task_verify()">核实</el-button>
            <!-- 下载核实结果 -->
            <!-- <el-button plain
                       @click="download()">下载</el-button> -->
            <!-- <el-button type="primary"
                       @click="dialogVisible_data_num = false">返回</el-button> -->
          </el-col>
        </div>
        <!-- 表单 -->
        <el-table :data="status_data_list[0].result"
                  ref="multipleTable"
                  tooltip-effect="dark"
                  style="width: 100%"
                  :header-cell-style="{'background-color': '#F4FAFF',}"
                  @selection-change="handleSelectionChange_operation">
          >
          <el-table-column type="selection"
                           width="55">
          </el-table-column>

          <!-- 动态 -->
          <el-table-column v-for="(item,key) in table_title"
                           v-if="item!='onlyuuid'"
                           :key="key"
                           :prop="item"
                           :label="item"
                           align="center">
          </el-table-column>

          <!-- 固定 -->
          <!-- 是否问题 -->
          <el-table-column prop="isProbleam"
                           label="是否问题">
            <template slot-scope="scope">
              {{
                  scope.row.isProbleam == 0
                    ? "否"
                    : scope.row.isProbleam == 1
                    ? "是":'--'
                  
                }}
            </template>
          </el-table-column>

          <!-- 核实人 -->
          <el-table-column prop="handlePersonName"
                           label="核实人">
            <template slot-scope="scope">
              <p v-if="scope.row.handlePersonName"> {{scope.row.handlePersonName }}</p>
              <p v-else>...</p>
            </template>
          </el-table-column>

          <!-- 核实信息-->
          <el-table-column prop="handleIdea"
                           label="核实信息">
            <template slot-scope="scope">
              <p v-if="scope.row.handleIdea"> {{scope.row.handleIdea }}</p>
              <p v-else>...</p>
            </template>
          </el-table-column>
          <!-- 附件 -->
          <el-table-column prop="count"
                           label=附件>
            <template slot-scope="scope">
              <el-popover placement="bottom"
                          width="250"
                          @show="open_enclosure_details(scope.row)"
                          trigger="click">
                <ul class="fileList-ul">
                  <li class="tableFileList-title">文件名称</li>
                  <li v-for="(item,index) in enclosure_details_list"
                      :key="index"
                      class="pointer blue"
                      @click="download(item.attachmentUuid,item.fileName)">
                    {{item.fileName}}</li>
                </ul>
                <div slot="reference"
                     style="color: #1371cc;"
                     class="pointer">
                  <i class="el-icon-folder-opened list-folder"></i>
                  {{scope.row.count}}
                </div>
              </el-popover>
            </template>
          </el-table-column>

        </el-table>
        <!-- 表单 end-->

        <!-- 分页 -->
        <div class="page">
          <el-pagination @size-change="handleSizeChange_toatl"
                         :current-page="this.status_data_list_data.current"
                         @current-change="handleCurrentChange_toatl"
                         :page-size="this.status_data_list_data.size"
                         :total="this.status_data_list_data.total"
                         layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>

        </div>
        <!-- 分页 end-->
      </div>
      <!-- <span slot="footer">
        <el-button size="small"
                   plain
                   @click="dialogVisible_data_num = false">上一步</el-button>
        <el-button size="small"
                   type="primary"
                   @click="query()">完成</el-button>
      </span> -->
    </el-dialog>

    <!-- 结果数 核实明细结果  -->
    <el-dialog width="40%"
               el-dialog
               :close-on-click-modal="false"
               @close="resetForm_verify('verify_model')"
               popper-class="status_data_dlag_verify"
               :visible.sync="dialogVisible_data_verify"
               style="padding-bottom: 59px">
      <div class="title_dlag">核实结果</div>

      <div class="dlag_conter3 verify">
        <el-form ref="verify_model"
                 :rules='rules_verify'
                 :model="verify_model"
                 :inline="false">
          <!-- 是否问题-->
          <el-form-item prop="isProbleam"
                        label="是否问题：">
            <el-select v-model="verify_model.isProbleam_data"
                       @change="isProbleam_change">
              <el-option v-for="item in isProbleam_data_select"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 核实信息 -->
          <el-form-item label="核实信息：">
            <el-input type="textarea"
                      v-model="verify_model.handleIdea"
                      placeholder="请输入核实信息"></el-input>
          </el-form-item>
          <!-- 上传文件 -->
          <el-form-item prop="dataName"
                        label="上传文件：">
            <el-upload class="upload-demo"
                       drag
                       ref="upload2"
                       :headers="headers"
                       action="#"
                       :on-change="handleChangePic_verify"
                       :on-remove="handleRemoveApk"
                       :file-list="edit_file_list2"
                       :auto-upload="false"
                       accept=".zip,.doc,.docx,.xls,.xlsx,.txt"
                       multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                点击上传或将文件拖到虚线框<br />支持.zip,.doc,.docx,.xls,.xlsx,.txt
              </div>
            </el-upload>

          </el-form-item>
        </el-form>
        <span slot="footer"
              center
              class="foot">
          <el-button type="primary"
                     v-if="success_btn2==1"
                     :loading="true">上传中</el-button>
          <div class=""
               v-if="success_btn2==0">
            <el-button size="small"
                       type="primary"
                       :disabled="isDisable"
                       @click="verify_save('verify_model')">保 存</el-button>
            <el-button size="small"
                       plain
                       @click="dialogVisible_data_verify = false">返回</el-button>
          </div>
        </span>

      </div>
    </el-dialog>

    <!-- 模型任务 问题数 -->
    <el-dialog :visible.sync="problemsDialogVisible"
               el-dialog
               :close-on-click-modal="false"
               width="70%">
      <div class="title_dlag">问题数</div>
      <div class="dlag_conter2 ">

        <el-row style="margin-top:3%;background:#F2F2F2;padding:15px">
          <el-col :span="18"
                  class="tableTitle">{{wt_title}}模型审计发现列表</el-col>
          <!-- <el-col :span="6">
          <el-button size="small"
                     type="primary"
                     style="float:right"
                     @click="add_list()">增加</el-button>

        </el-col> -->
        </el-row>
        <el-table :data="probleNum_list"
                  v-loading="loading"
                  :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
                  ref="multipleTable"
                  style="width: 100%;margin-bottom:2%">
          <!-- tooltip-effect="dark" -->
          <!-- @selection-change="handleSelectionChange_wts" -->
          <!-- <el-table-column type="selection"
                         align="center"> </el-table-column> -->
          <el-table-column prop="field"
                           show-overflow-tooltip
                           align="center"
                           label="领域"> </el-table-column>
          <el-table-column prop="problem"
                           align="center"
                           show-overflow-tooltip
                           label="问题"> </el-table-column>
          <el-table-column prop="basis"
                           show-overflow-tooltip
                           align="center"
                           label="依据"> </el-table-column>
          <el-table-column prop="describe"
                           align="center"
                           show-overflow-tooltip
                           label="描述"> </el-table-column>

          <el-table-column prop="problemDiscoveryTime"
                           align="center"
                           show-overflow-tooltip
                           label="发现时间">
            <template slot-scope="scope">
              {{scope.row.problemDiscoveryTime |filtedate }}
            </template>

          </el-table-column>

          <el-table-column prop="riskAmount"
                           align="center"
                           width="180"
                           show-overflow-tooltip
                           label="风险金额（万元）"> </el-table-column>
          <el-table-column prop="problemFindPeople"
                           align="center"
                           label="发现人"> </el-table-column>
          <!-- <el-table-column prop="name6"
                         align="center"
                         width="160"
                         label="操作">
          <template slot-scope="scope">

            <el-button size="small"
                       type="primary"
                       @click="edit_list(scope.row.problemListUuid)">修改</el-button>
            <el-button size="small"
                       type="primary"
                       @click="remove_list(scope.row.problemListUuid)">删除</el-button>
          </template>
        </el-table-column> -->
        </el-table>

      </div>
      <!-- 分页 -->
      <div class="page">
        <el-pagination @size-change="handleSizeChange_probleNum"
                       @current-change="handleCurrentChange_probleNum"
                       :current-page="this.probleNum_data.current"
                       :page-size="this.probleNum_data.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="this.probleNum_data.total">
        </el-pagination>

      </div>
      <!-- 分页 end-->

    </el-dialog>

    <!-- 问题数新增 -->
    <!-- <el-dialog :visible.sync="dialogVisible_add_list"
               :title="problems_title"
               width="60%">
      <el-row style="margin-top:3%;background:#F2F2F2;border-radius:3px;padding:15px">
        <el-col :span="18"
                class="tableTitle">问题</el-col>
      </el-row>
      <div class="dlag_conter3 ">
        <el-form :rules="rules"
                 ref="problems_form"
                 :model="problems_form">
          <div class="son">

            <el-form-item prop="field">
              <p>领域：</p>
              <el-select v-model="problems_form.field"
                         @change="problems_form_change">
                <el-option v-for="item in problems_slect"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

          </div>
          <div class="son">
            <el-form-item prop="problem">
              <p>问题：</p>
              <el-input type="input"
                        v-model="problems_form.problem"
                        placeholder=""></el-input>

            </el-form-item>

            <el-form-item prop="basis"
                          style="margin-left:20px">
              <p>依据：</p>
              <el-input type="input"
                        v-model="problems_form.basis"
                        placeholder=""></el-input>
              <el-button type="primary"
                         size="small"
                         @click="quote_knowledge()">引用知识库</el-button>
            </el-form-item>
          </div>

          <div class="son">
            <el-form-item prop="problemDiscoveryTime">
              <p>发现时间：</p>
             
              <el-date-picker v-model="problems_form.problemDiscoveryTime"
                              type="date"
                              placeholder="发现时间">
              </el-date-picker>
            </el-form-item>

            <el-form-item prop="describe"
                          style="margin-left:20px">
              <p>描述：</p>
              <el-input type="input"
                        v-model="problems_form.describe"
                        placeholder=""></el-input>
            </el-form-item>
          </div>

          <div class="son">

            <el-form-item prop="problemFindPeople">
              <p>发现人：</p>
              <el-input v-model="problems_form.problemFindPeople"
                        disabled></el-input>
            </el-form-item>

            <el-form-item prop="riskAmount"
                          style="margin-left:20px">
              <p>风险金额：</p>
              <el-input type="input"
                        v-model="problems_form.riskAmount"
                        placeholder=""></el-input>
            </el-form-item>
          </div>
          <div class="son">
            <el-form-item>
              <p>关联任务：</p>
              <el-select v-model="problems_form.associatedTask"
                         @change="problems_task_change">
                <el-option v-for="item in relation_task"
                           :key="item.auditModelUuid"
                           :label="item. auditModelName"
                           :value="item.auditModelUuid">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="son">

            <el-form-item prop="isProbleam">
              <p>上传附件：</p>
              <el-upload class="upload-demo"
                         drag
                         action="/wisdomaudit/attachment/fileUploads"
                         :on-success="handleChangePic_verify"
                         :before-remove="handleRemoveApk"
                         accept=".zip,.doc"
                         :file-list="fileList2"
                         multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  点击上传或将文件拖到虚线框<br />支持.zip .doc
                </div>
              </el-upload>
            </el-form-item>
          </div>

        </el-form>

        <span slot="footer"
              class="foot">
          <el-button size="small"
                     type="primary"
                     v-if=" this.problems_title == '新增'"
                     @click="add_list_save('problems_form')">保 存</el-button>

          <el-button size="small"
                     type="primary"
                     v-if=" this.problems_title == '修改'"
                     @click="add_list_update()">保 存</el-button>

          <el-button size="small"
                     @click="dialogVisible_add_list = false">
            返回</el-button>
        </span>

      </div>
    </el-dialog> -->

    <!-- 模型任务设置参数 -->
    <el-dialog center
               :close-on-click-modal="false"
               :visible.sync="setParametersDialogVisible"
               width="60%">
      <el-card class="setParameters"> 参数设置 </el-card>
      <el-card class="parameters">
        <i class="el-icon-s-grid"></i>
        请输入参数值
      </el-card>

      <Paramdrawnew :arr="arr"
                    ref="paramDrawRefNew"
                    :sql="sql"></Paramdrawnew>

      <!-- <el-card class="parametersTab">
        <el-form label-width="100px">
          <el-row>
            <el-form-item label="被审计单位">
              <el-select v-model="value_select">
                <el-option v-for="item in sensitiveOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="审计期间_开始">
              <el-input placeholder="请输入内容">
                <el-button slot="append"
                           icon="el-icon-error"></el-button>
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="审计期间_结束">
              <el-input placeholder="请输入内容">
                <el-button slot="append"
                           icon="el-icon-error"></el-button>
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="欠费金额大于">
              <el-input placeholder="请输入内容"> </el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </el-card> -->

      <span slot="footer">
        <el-button @click="play_data()"
                   type="primary"
                   style="color: #1371cc"
                   size="small">
          运行
        </el-button>
      </span>

    </el-dialog>

    <!-- 模型任务 引用 -->
    <!-- <el-dialog title="模型列表"
               :visible.sync="dialogVisible_quote"
               style="padding-bottom: 59px">
      <div class="dlag_conter">
        <el-row :gutter="24"
                class="titleMes">
          <div class="search"
               style="width: 100%; justify-content: flex-start; width: 300px"
               v-if="task_type == 0">
            <el-input placeholder="请输入模型名称"
                      v-model="params2.condition.modelName">
            </el-input>
            <div class="search_icon">
              <i class="el-icon-search"
                 style="color: rgba(0, 0, 0, 0.5)"></i>
            </div>

            <el-button type="primary"
                       @click="quote_list()">筛选</el-button>
          </div>
        </el-row>
        <div class="cxjg"
             style="margin: 20px 0">
          <el-col :span="1.5">
            查询结果
            <el-button type="primary"
                       @click="quote()">引用</el-button>
          </el-col>
        </div>
        <el-table :data="model_list"
                  ref="multipleTable"
                  tooltip-effect="dark"
                  @selection-change="handleSelectionChange"
                  style="width: 100%">
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column prop="modelName"
                           label="模型名称"> </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination background
                       layout="prev, pager, next"
                       :current-page="this.model_data.current"
                       @current-change="handleCurrentChange_model_add"
                       :page-size="this.model_data.size"
                       :total="this.model_data.total"></el-pagination>
      </div>
    </el-dialog> -->

    <!-- 自建任务新增 编辑-->
    <el-dialog :visible.sync="dialogVisible_zj"
               center
               :close-on-click-modal="false"
               @close="resetForm2('save_zj_query')"
               style="padding-bottom: 59px">
      <div class="title_dlag">{{title}}</div>

      <div class="dlag_conter new">
        <el-form ref="save_zj_query"
                 v-loading="loading_edit"
                 :model="save_zj_query"
                 :inline="false"
                 :rules='rules_task'>

          <!-- 任务名称 -->
          <el-form-item label="任务名称："
                        style="margin-bottom:30px!important">
            <el-input v-model="save_zj_query.taskName"
                      placeholder="请输入任务新增"></el-input>
          </el-form-item>
          <!-- 责任人 -->
          <el-form-item label="责任人："
                        style="margin-bottom:30px!important">
            <el-input v-model="save_zj_query.peopleName"
                      :disabled="disabled"></el-input>
          </el-form-item>

          <!-- 领域 -->
          <el-form-item prop="belongField"
                        label="领域："
                        style="margin-bottom:30px!important">
            <el-select v-model="save_zj_query.belongField"
                       @change="changeHeader_zj_ly">
              <el-option v-for="item in problems_slect"
                         :key="item.value"
                         :label="item.label"
                         :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 专题 -->
          <el-form-item label="专题："
                        prop="belongSpcial"
                        style="margin-bottom:30px!important">
            <el-select v-model="save_zj_query.belongSpcial  "
                       @change="changeHeader_zj_zt">
              <el-option v-for="item in zt_slect"
                         :key="item.value"
                         :label="item.label"
                         :value="item.label">
              </el-option>
            </el-select>
            <el-input v-model="save_zj_query.belongSpcial"
                      v-if="input_select==false"></el-input>
          </el-form-item>

          <!-- 任务描述 -->
          <el-form-item label="任务描述："
                        style="margin-bottom:30px!important">
            <el-input v-model="save_zj_query.taskDescription"
                      ref="bz"
                      placeholder="请输入任务描述"></el-input>
          </el-form-item>
          <!-- 上传附件 -->
          <el-form-item label="上传附件："
                        prop="fileList"
                        style="margin-bottom:30px!important">
            <el-upload class="upload-demo"
                       drag
                       ref="upload"
                       :headers="headers"
                       action="#"
                       v-model="save_zj_query.enclosure"
                       :on-change="handleChangePic"
                       :on-remove="handleRemove"
                       :file-list="edit_file_list"
                       :auto-upload="false"
                       accept=".zip,.doc,.docx,.xls,.xlsx,.txt"
                       multiple>
              <i class="el-icon-upload"></i>

              <div class="el-upload__text">
                点击上传或将文件拖到虚线框<br />支持.zip,.doc,.docx,.xls,.xlsx,.txt
              </div>
            </el-upload>
            <!-- <p v-if="isClientCertFile ==true"
               style="left:60px!important"
               class="el-form-item__error">请上传文件</p> -->
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer">
        <el-button type="primary"
                   v-if="success_btn==1"
                   :loading="true">上传中</el-button>
        <div class=""
             v-if="success_btn==0">
          <el-button size="small"
                     type="primary"
                     v-if="title=='新增任务'"
                     :disabled="isDisable"
                     @click="save_zj(1,'save_zj_query')">确 定</el-button>
          <el-button size="small"
                     type="primary"
                     v-else
                     :disabled="isDisable"
                     @click="save_zj(2)">确 定</el-button>

          <el-button size="small"
                     @click="dialogVisible_zj = false">取 消</el-button>
        </div>
      </span>
    </el-dialog>

    <!-- 附件详情 -->
    <el-dialog width="40%"
               :visible.sync="dialogVisibl_enclosure_details"
               style="padding-bottom: 59px; ">
      <div class="file_details">

        <el-table :data="enclosure_details_list"
                  :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
                  v-loading="loading_file"
                  style="width: 100%;">
          <!-- <el-table-column prop="dataTaskNumber"
                             label="流水单号">
            </el-table-column> -->
          <!-- <el-table-column type="index"
                         align="center"
                         label="序号">
        </el-table-column> -->
          <el-table-column prop="fiileType"
                           align="center"
                           label="资料类型">
          </el-table-column>
          <el-table-column prop="fileName"
                           align="center"
                           label="文件名称">
            <template slot-scope="scope">
              <el-button @click="download_click(scope.row.attachmentUuid,scope.row.fileName)"
                         type="text"
                         class="file_name"
                         size="small">
                {{ scope.row.fileName }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";
import {
  task_pageList,
  //task_model_pageList,
  quoteModel, task_add,
  task_remove, task_update,
  task_details,
  task_select_people,
  task_setChargePeople,
  task_data_verify,
  task_problems_list,//问题列表
  task_problems_save,//问题保存
  task_problems_update,//问题编辑
  task_problems_delete,//问题删除
  task_problems_details,//问题编辑回显
  task_problems_loadcascader,//公用模版 领域
  task_problems_relation,//关联任务
  Task_update_status,//更新
  task_select_repeat,//判断是否重复
  enclosure_details,//附件详情
  task_problems_uopload,//上传
  task_problems_uopload_details,//附件列表  编辑回显
  task_personLiable,//责任人
  projectRel_pgeList,//核实 新增表头
  projectRel_taskAttachment,//附件详情  新版
} from
  '@SDMOBILE/api/shandong/task'
import { down_file } from
  '@SDMOBILE/api/shandong/ls'
//task_findModelList_all
import { Task_run, Task_data_status, task_findModelList, task_selectModel, task_selectTable } from '@SDMOBILE/api/shandong/task_setting'

import { fmtDate } from '@SDMOBILE/model/time.js';
import Paramdrawnew from '@WISDOMAUDIT/components/workbench/AuditTask/paramdrawnew'//参数设置

export default {
  components: {
    Paramdrawnew
  },
  data () {
    return {
      dqtoken: "",
      headers: '',
      input_select: true,
      task_type: 0, //默认显示任务/自建任务
      tab: [{ name: "审计资料任务列表" }, { name: "已操作的资料列表" }], //任务切换
      dialogVisible_quote: false, //模型任务引用
      dialogVisible_zj: false, // 自建任务新增弹窗
      dialogVisible_data_num: false, //模型任务结果数
      setParametersDialogVisible: false, //模型任务设置参数
      problemsDialogVisible: false, //模型任务问题数
      dialogVisible_data_verify: false,//模型任务 核实 结果
      dialogVisible_add_list: false,//问题数新增
      dialogVisibl_enclosure_details: false,//附件详情
      multipleSelection_data_list: [],// 结果数 全选数据

      fileList: [],//上传的文件
      // 设置参数
      modelId: '',//外部引用模型id
      wts_data: [],// 问题数选择
      // 提交数据单
      task: {
        search: "", // 筛选
        zrr_id: "", //责任人
      },
      // 项目id
      managementProjectUuid: '',//项目管理id
      runTaskRelId: '',//参数任务id  运行需要的

      // 新增任务
      add_task: {
        name: "", //名称
        textare: "", //描述
      },
      // 责任人
      value_select: '',//select
      loading: false,
      tableData: [],//模型列表
      tableData_list: [],//任务列表数据
      search_taskName: '',//模糊查询
      // 模型/自建人任务 列表
      params: {
        // taskType: '',//1:模型任务 2:自建任务
        pageNo: 1,
        pageSize: 10,
      },
      multipleSelection: [],//新增列表选中的数据

      // 模型列表的新增模型列表
      params2: {
        condition: {
          modelName: '',//模糊查询
          peopleName: '',//责任人name
          peopleTableUuid: '',//责任人id
        },
        pageNo: 1,
        pageSize: 10,
      },
      model_data: [],//引入模型列表
      model_list: [],//引入模型列表数据 son

      // 新增自建任务 保存
      save_zj_query: {
        auditTaskUuid: '',//任务id
        taskDescription: "",
        taskName: "",
        taskType: 2,//任务类型
        enclosure: '',//附件
        peopleName: '',//责任人name
        peopleTableUuid: '',//责任人id
        belongField: '',// 领域
        belongSpcial: '',//专题

      },
      // 编辑数据
      edit_datails: [],

      title: '',//弹窗变量标题

      select_list: [],//责任人数据
      auditTaskUuid: '',//当前点击的项目id
      modelId: '',//modelid
      //  ------------------------------\
      arr: {},
      sql: '',

      // 新增任务验证
      rules_task: {
        // taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        // peopleTableUuid: [{ required: true, message: '请选择责任人', trigger: 'change' }],
        belongSpcial: [{ required: true, message: '请选择专题', trigger: 'change' }],
        belongField: [{ required: true, message: '请选择领域', trigger: 'change' }],
        // taskDescription: [{ required: true, message: '请输入任务描述', trigger: 'blur' }],
        // fileList: [{ required: true, message: '请上传文件', trigger: 'change' }],
      },

      // 问题数
      probleNum: {
        auditTaskUuid: '',
        pageNo: 1,
        pageSize: 10,
      },
      probleNum_data: [],
      probleNum_list: [],//问题列表
      problems_title: '',//问题 新增 编辑  标题

      // 问题 新增
      wt_title: '',//问题数title
      problems_form: {
        field: '',//领域
        problem: '',//问题
        basis: '',//依据
        problemDiscoveryTime: '',//发现时间
        describe: '', // 描述
        riskAmount: '',// 风险金额
        associatedTask: '',// 关联任务
        // 附件
      },
      //新增问题 校验规则
      rules: {
        field: [{ required: true, message: '请选择领域', trigger: 'change' }],
        problem: [{ required: true, message: '请输入问题', trigger: 'blur' }],
        basis: [{ required: true, message: '请输入依据', trigger: 'blur' }],
        problemDiscoveryTime: [{ required: true, message: '请选择发现时间', trigger: 'change' }],
        describe: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        riskAmount: [{ required: true, message: '请输入风险金额', trigger: 'change' }],
        // associatedTask: [{ required: true, message: '请选择关联任务', trigger: 'change' }],
      },
      problems_slect: [],//领域
      zt_slect: [],//专题
      relation_task: [],//关联任务
      paramDrawUuid: '',
      runTaskRelUuid: '',//参数任务id
      systemTime: '',//当前时间
      paramTaskUuid: '',//列表的 runTaskRelUuid  id

      status_data: [],//结果数分类

      status_data_list_data: [],//外层
      status_data_list: [
        {
          result: [],//内容
          columns: [],//表头
        }
      ],// 结果数list
      jg_title: '',//结果数模型title

      data_active: '',//选中
      loading_file: false,//附件loading
      enclosure_details_list: [],//附件详情

      success_btn: 0,//文件上传完成
      Upload_file: [],//上传后返回文件数组
      isClientCertFile: false,//判断是否上传文件

      edit_file_list: [],// 编辑回显 上传文件
      disabled: true,//责任人点击

      loading_edit: false,//编辑 loading
      verify_model: {
        isProbleam_data: '',//是否问题
        handleIdea: '',//核实信息
        resultDetailIds: '',//核实结果id
      },
      // 是否问题
      isProbleam_data_select: [
        {
          value: "0",
          label: "否",
        },
        {
          value: "1",
          label: "是",
        },
      ],


      fileList2: [],// 核实文件上传
      verify_files: [],//核实文件
      fileList_Delet: [],//删除  储存
      success_btn2: 0,//文件上传完成
      edit_file_list2: [],
      date_index: 0,
      // 结果数分页
      basePageParam_query: {
        pageNo: 1,
        pageSize: 10,
      },

      // 核实验证
      rules_verify: {
        isProbleam_data: [{ required: true, message: '请选择问题', trigger: 'change' }],
        handleIdea: [{ required: true, message: '请输入核实信息', trigger: 'blur' }],
      },
      // 新增核实 表头
      params_heshi: {
        pageNo: 1,
        pageSize: 10,
      },

      arr: [],//旧表单
      arr2: [],//新表单 //核实后的新表单数据
      loading_data: false,

      // 新版附件详情
      file_new: [],
      attachmentList1: [],
      attachmentList2: [],
      attachmentList3: [],
      isDisable: false,//防止重复提交

      is_hs: true,
      table_title: [],
    };
  },
  computed: {},
  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      // return fmtDate(t, 'yyyy-MM-dd hh:mm:ss');
      return fmtDate(t, 'yyyy-MM-dd ');
    }
  },
  props: ['active_project', 'userRole'],
  created () {
    this.dqtoken = sessionStorage.getItem("TOKEN");
    this.headers = { 'TOKEN': sessionStorage.getItem('TOKEN') }
    this.managementProjectUuid = this.active_project;
    // 模型  自建任务列表
    let params = {
      pageNo: this.params.pageNo,
      pageSize: this.params.pageSize,
      condition: {
        // auditModelCategory: this.params.auditModelCategory,
        managementProjectUuid: this.managementProjectUuid,
        taskName: this.search_taskName,
        // taskType: ''
      }
    }
    this.list_data(params); // 模型  自建任务列表

    // 获取请求人
    this.task_personLiable_data();

    let params2 = {
      typecode: 'Category',
    }
    this.lingyu(params2);//领域


    let params3 = {
      typecode: 'SPECIAL',
    }
    this.zhuanti(params3);//专题


    let params4 = {
      managementProjectUuid: this.managementProjectUuid,
    }
    this.task_problems_relation_data(params4);//关联任务




  },
  methods: {
    // 模型/自建任务列表  
    list_data (params) {
      this.loading = true;
      task_pageList(params).then(resp => {
        this.tableData = resp.data;
        this.tableData_list = resp.data.records
        this.loading = false;
      })
    },
    handleSizeChange_zijian (val) {
      this.params.pageSize = val
    },
    // 自建任务 列表分页
    handleCurrentChange_zijian (val) {
      // 资料列表
      let params = {
        pageNo: val,
        pageSize: this.params.pageSize,
        condition: {
          auditModelCategory: this.params.auditModelCategory,
          managementProjectUuid: this.managementProjectUuid,
          taskName: this.search_taskName,
          // taskType: 2//自建任务列表
        }
      }
      this.list_data(params);
    },

    // 获取责任人
    task_personLiable_data () {
      task_personLiable().then(resp => {
        this.save_zj_query.peopleName = resp.data.realName//责任人name
        this.save_zj_query.peopleTableUuid = resp.data.userId//责任人id
        this.disabled = true
      })
    },
    // 新增弹窗
    new_add_zj (index) {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
      // 1:新增  2:编辑
      //自建任务 新增
      this.dialogVisible_zj = true;
      this.title = '新增任务';
    },
    // 新增上传附件
    handleChangePic (file, fileList, name) {
      this.fileList = fileList;
      this.file = file.raw
    },

    // 自建任务 附件 删除
    handleRemove (file, index) {
      if (file.response) {
        this.fileList.remove(file.response.data);
        this.key = Math.random();
      } else {
        this.edit_file_list.remove(file);
        file.isDeleted = 1;
        this.fileList_Delet.push(file)
      }
    },
    // 删除 接口
    fileRemove (params) {
      task_fileRemove(params).then(resp => {

      })
    },
    // 新增自建任务 保存
    save_zj (index, save_zj_query) {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
      // 1:新增  2:编辑
      if (index == 1) {
        this.$refs[save_zj_query].validate((valid) => {
          if (valid) {
            this.title = '新增任务';
            if (this.fileList.length > 0) {
              this.success_btn = 1;//显示加载按钮  0成功  1 loaging
              // 上传
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
                  // 
                  this.Upload_file = resp.data.data;//上传成功大的文件
                  // 提交步骤
                  let params1 = {
                    managementProjectUuid: this.managementProjectUuid,//项目id
                    taskDescription: this.save_zj_query.taskDescription,//描述
                    taskName: this.save_zj_query.taskName,//名称
                    taskType: 2,//任务类型
                    enclosure: this.save_zj_query.enclosure,//附件
                    peopleName: this.save_zj_query.peopleName,//责任人
                    peopleTableUuid: this.save_zj_query.peopleTableUuid,//责任人id
                    belongSpcial: this.save_zj_query.belongSpcial,//领域
                    belongField: this.save_zj_query.belongField,//专题
                    attachmentList: this.Upload_file,//上传成功de 的文件
                  }

                  this.new_add(params1)//新增上传
                  //上传成功 end
                } else {
                  // 上传失败
                  this.$message({
                    message: resp.data.msg,
                    type: 'error'
                  });
                  this.success_btn = 1;//显示加载按钮  0成功  1 loaging

                }
              })//上传 end
            } else {
              //未上传文件 提交步骤
              let params1 = {
                managementProjectUuid: this.managementProjectUuid,//项目id
                taskDescription: this.save_zj_query.taskDescription,//描述
                taskName: this.save_zj_query.taskName,//名称
                taskType: 2,//任务类型
                enclosure: this.save_zj_query.enclosure,//附件
                peopleName: this.save_zj_query.peopleName,//责任人
                peopleTableUuid: this.save_zj_query.peopleTableUuid,//责任人id
                belongSpcial: this.save_zj_query.belongSpcial,//领域
                belongField: this.save_zj_query.belongField,//专题
                attachmentList: this.edit_file_list,//上传成功的 的文件
              }

              this.new_add(params1)//新增上传
            }
          } else {
            this.$message.info("请填写信息");
            return false;
          };//判断为空
        })//验证 end
        //  新增 end
      } else {
        // 编辑
        if (this.fileList.length > 0) {
          this.success_btn = 1;//显示加载按钮  0成功  1 loaging
          // 上传
          let formData = new FormData()
          formData.append('file', this.fileList)
          this.fileList.forEach((item) => {
            if (item.raw) {
              formData.append('files', item.raw);
            }
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
              // 
              this.Upload_file = resp.data.data;//上传成功大的文件
              // var upList = this.edit_file_list.concat(this.Upload_file);
              var upList = [...this.edit_file_list, ...this.Upload_file];
              if (this.Upload_file) {
                for (let p = 0; p < this.Upload_file.length; p++) {
                  this.Upload_file[p].isDeleted = 2
                }
              }


              this.edit_file_list.forEach((item) => {
                item.status = null;
              })
              this.fileList_Delet.forEach((item) => {
                item.status = null;
              })
              // var upList = this.edit_file_list.concat(this.Upload_file).concat(this.fileList_Delet);
              var upList = [...this.edit_file_list, ...this.Upload_file, ...this.fileList_Delet];
              // 编辑
              let params2 = {
                taskType: 2,//任务类型
                auditTaskUuid: this.save_zj_query.auditTaskUuid,//项目id
                taskDescription: this.save_zj_query.taskDescription,
                taskName: this.save_zj_query.taskName,
                // taskType: this.save_zj_query.taskType,//任务类型
                enclosure: this.save_zj_query.enclosure,//附件
                peopleName: this.save_zj_query.peopleName,//责任人
                peopleTableUuid: this.save_zj_query.peopleTableUuid,//责任人id
                belongSpcial: this.save_zj_query.belongSpcial,//领域
                belongField: this.save_zj_query.belongField,//专题
                attachmentList: upList,//上传成功de 的文件
              }

              this.edit_data_update(params2);//编辑
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

          this.edit_file_list.forEach((item) => {
            item.status = null;
          })
          this.fileList_Delet.forEach((item) => {
            item.status = null;
          })
          var upList = this.edit_file_list.concat(this.fileList_Delet);


          // 编辑未上传文件
          // 编辑
          let params2 = {
            taskType: 2,//任务类型
            auditTaskUuid: this.save_zj_query.auditTaskUuid,//项目id
            taskDescription: this.save_zj_query.taskDescription,
            taskName: this.save_zj_query.taskName,
            // taskType: this.save_zj_query.taskType,//任务类型
            enclosure: this.save_zj_query.enclosure,//附件
            peopleName: this.save_zj_query.peopleName,//责任人
            peopleTableUuid: this.save_zj_query.peopleTableUuid,//责任人id

            belongSpcial: this.save_zj_query.belongSpcial,//专题
            belongField: this.save_zj_query.belongField,//领域
            attachmentList: upList,//上传成功de 的文件
          }
          this.edit_data_update(params2);//编辑
        }

      }
    },
    // 新增上传
    new_add (params) {
      // 新增
      task_add(params).then(resp => {
        // 
        if (resp.code == 0) {
          this.$message({
            message: '新增成功',
            type: 'success'
          });
          this.dialogVisible_zj = false;//关闭当前弹窗
          // 刷新外层列表
          let params = {
            pageNo: this.params.pageNo,
            pageSize: this.params.pageSize,
            condition: {
              auditModelCategory: this.params.auditModelCategory,
              managementProjectUuid: this.managementProjectUuid,
              taskName: this.search_taskName,
              // taskType: 2,
            }
          }
          this.list_data(params);
        } else {
          this.$message({
            message: resp.msg,
            type: 'success'
          });
        }
      })
    },
    // 编辑上传
    edit_data_update (params) {
      // 编辑保存
      task_update(params).then(resp => {
        if (resp.code == 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.dialogVisible_zj = false;//关闭当前弹窗
          // 刷新自建列表
          let params = {
            pageNo: this.params.pageNo,
            pageSize: this.params.pageSize,
            condition: {
              auditModelCategory: this.params.auditModelCategory,
              managementProjectUuid: this.managementProjectUuid,
              taskName: this.search_taskName,
              // taskType: 2,
            }
          }
          this.list_data(params);
        } else {
          this.$message({
            message: resp.msg,
            type: 'success'
          });
        }
      })//编辑成功
    },

    // 新增任务关闭
    resetForm2 (save_zj_query) {
      this.$refs[save_zj_query].resetFields();
      this.$refs.upload.clearFiles();
      this.save_zj_query.belongSpcial = '';//领域
      this.save_zj_query.belongField = '';//领域

      this.save_zj_query.taskDescription = '';//清空备忘录
      this.save_zj_query.taskName = '';//清空name
      this.success_btn = 0;//显示加载按钮  0成功  1 loaging

      this.input_select = true;//专题 恢复默认

    },

    // 自建 任务--显示编辑详情
    edit_data (data) {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      this.loading_edit = true;
      this.title = '编辑任务';
      this.dialogVisible_zj = true;//显示新增编辑 弹窗
      this.save_zj_query.auditTaskUuid = data.auditTaskUuid;
      // this.save_zj_query.peopleName = data.peopleName;//责任人

      this.edit_file_list = [];//清回显
      this.fileList = [];
      this.fileList_Delet = [];


      let params = {
        id: data.auditTaskUuid,//任务id
      }
      // 编辑 回显 数据渲染
      task_details(params).then(resp => {
        this.edit_details = resp.data
        this.save_zj_query = this.edit_details
        // 
        let params2 = {
          pageNo: 1,
          pageSize: 10,
          condition: {
            businessUuid: data.auditTaskUuid
          }
        }
        this.file_details(params2, 1);//附件详情
        this.loading_edit = false;

      })
    },
    // 列表查看附件
    open_enclosure_details_data (auditTaskUuid, paramTaskUuid) {

      let params2 = {
        auditTaskUuid: auditTaskUuid,
        paramTaskUuid: paramTaskUuid,
      }
      this.file_list_details(params2)//新版详情
    },
    // 列表 附件详情  新版
    file_list_details (params) {
      this.file_new = [];
      projectRel_taskAttachment(params).then(resp => {
        console.log(resp);
        this.file_new = resp.data;
        this.attachmentList1 = resp.data.attachmentList1;
        this.attachmentList2 = resp.data.attachmentList2;
        this.attachmentList3 = resp.data.attachmentList3;



      })
    },
    // 结果附件
    open_enclosure_details (data) {
      let params2 = {
        pageNo: 1,
        pageSize: 10,
        condition: {
          businessUuid: data.resultDetailProjectRelId
        }
      }
      this.file_details(params2, 2);
    },
    // 附件详情
    file_details (params2, index) {
      this.loading_file = true;
      task_problems_uopload_details(params2).then(resp => {
        this.loading_file = false;
        // index=1  列表查看附件详情
        if (index == 2) {
          this.enclosure_details_list = resp.data
        } else {
          var list = resp.data//
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

        }

      })
    },
    //   已完成列表点击附件
    download (id, fileName) {
      let formData = new FormData()
      formData.append('fileId', id)
      down_file(formData).then(resp => {
        const content = resp;
        console.log(resp);
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

      })
    },

    // 模型任务列表 自建任务 筛选
    search_list () {
      let params2 = {
        pageNo: 1,
        pageSize: this.params.pageSize,
        condition: {
          // auditModelCategory: this.params.auditModelCategory,
          managementProjectUuid: this.managementProjectUuid,
          taskName: this.search_taskName,
          // taskType: ''
        }
      };
      // 模型列表 自建任务
      this.list_data(params2);
    },

    // 结果数=========================================
    // 结果弹窗 结果分类tab
    data_tab (params) {
      task_selectModel(params).then(resp => {
        if (resp.code == 0) {
          this.status_data = resp.data.reverse();
          // let datas = resp.data[0]
          // 结果列表
          let params3 = {
            basePageParam: {
              condition: {
                keyword: null,
                runResultTableUuid: this.status_data[0].runResultTableUuid,
                runTaskRelUuid: this.status_data[0].runTaskRelUuid,
                // runTaskRelUuid: this.status_data[0].paramTaskUuid,
                resultTableName: this.status_data[0].resultTableName,//- 实际表名
                resultShowName: this.status_data[0].resultShowName,
                tableType: 1,//  主副表标识, 主表 = 1、副表1 = 2、副表2 = 3···
                dataCount: 1
              },
              pageNo: this.basePageParam_query.pageNo, //当前页数
              pageSize: this.basePageParam_query.pageSize //分页数量
            },
            filterSql: "undefined",
          }
          this.data_tab_list(params3)// 结果列表
        }
      })
    },
    // 切换结果分类
    select_data (index) {
      this.date_index = index
      this.data_active = index
      // 结果列表
      let params3 = {
        basePageParam: {
          condition: {
            keyword: null,
            runResultTableUuid: this.status_data[this.date_index].runResultTableUuid,
            // runTaskRelUuid: this.status_data[this.date_index].runTaskRelUuid,
            // runTaskRelUuid: this.status_data[this.date_index].paramTaskUuid,
            runTaskRelUuid: this.paramTaskUuid,
            resultTableName: this.status_data[this.date_index].resultTableName,//- 实际表名
            resultShowName: this.status_data[this.date_index].resultShowName,
            tableType: this.status_data[this.date_index].tableType,//  主副表标识, 主表 = 1、副表1 = 2、副表2 = 3···
            dataCount: 1
          },
          pageNo: 1, //当前页数
          pageSize: this.basePageParam_query.pageSize //分页数量
        },
        filterSql: "undefined",
      }
      this.data_tab_list(params3)// 结果列表

    },
    // 结果弹窗 结果列表
    data_tab_list (params) {
      task_selectTable(params).then(resp => {
        this.status_data_list_data = resp.data;
        this.status_data_list = resp.data.records
        this.arr = resp.data.records[0].result; //原列表
        this.table_title = resp.data.records[0].columns;//动态表头

        console.log(this.status_data_list_data);
        this.new_table();//新接口 table


      })
    },

    // 合并 结果列表 新旧数表单
    merge () {
      this.arr.forEach(item => {
        this.arr2.forEach(i => {
          this.$set(item, 'is_show', true)//附件数
          // this.$set(item, 'isProbleam', 2)//是否问题 0否 1.是
          if (item.onlyuuid == i.resultDetailId) {
            this.$set(item, 'handleIdea', i.handleIdea)//核实意见
            this.$set(item, 'handlePersonName', i.handlePersonName)//核实人
            this.$set(item, 'isProbleam', i.isProbleam)//是否问题 0否 1.是
            this.$set(item, 'count', i.count)//附件数
            this.$set(item, 'resultDetailProjectRelId', i.resultDetailProjectRelId)//核实信息表主键
          }
        })
        // console.log(item);
        // this.$set(item, 'count', i.count)//附件数

      })

    },
    // 新增核实 表头
    new_table () {
      let params_query = {
        condition: {
          runTaskRelUuid: this.paramTaskUuid,
        },
        pageNo: this.params_heshi.pageNo,
        pageSize: this.params_heshi.pageSize,
      };
      projectRel_pgeList(params_query).then(resp => {
        this.arr2 = resp.data.records
        this.merge();//合并新旧
        var that = this;
        that.$nextTick(() => {
          this.status_data_list[0].result.forEach((item) => {
            // if (item.isProbleam == !undefined && item.isProbleam == 1) {
            //   this.$nextTick(() => this.$refs.multipleTable.toggleRowSelection(item, true))
            // }
            if (item.isProbleam == undefined) {
              this.$set(item, 'isProbleam', 2)//是不是问题 0不是  1是 2 操作用的
            }
          })
        })
      })
    },
    // 结果分页
    handleSizeChange_toatl (val) {
      this.basePageParam_query.pageSize = val;
    },
    // 结果分页
    handleCurrentChange_toatl (val) {
      this.basePageParam_query.pageNo = val;
      // 结果列表
      let params2 = {
        runTaskRelUuid: this.paramTaskUuid,
      }
      this.data_tab(params2);//结果分类

      var that = this;
      that.$nextTick(() => {
        this.status_data_list[0].result.forEach((item) => {
          if (item.isProbleam == undefined) {
            this.$set(item, 'isProbleam', 2)//是不是问题 0不是  1是 2 操作用的
          }
        })
      })
      // 结果列表
      let params3 = {
        basePageParam: {
          condition: {
            keyword: null,
            runResultTableUuid: this.status_data[this.date_index].runResultTableUuid,
            runTaskRelUuid: this.paramTaskUuid,
            resultTableName: this.status_data[this.date_index].resultTableName,//- 实际表名
            resultShowName: this.status_data[this.date_index].resultShowName,
            tableType: this.status_data[this.date_index].tableType,//  主副表标识, 主表 = 1、副表1 = 2、副表2 = 3···
            dataCount: 1
          },
          pageNo: this.basePageParam_query.pageNo, //当前页数
          pageSize: this.basePageParam_query.pageSize //分页数量
        },
        filterSql: "undefined",
      }
      this.data_tab_list(params3)// 结果列表
    },
    // 结果数列表 里的全选
    handleSelectionChange_operation (val) {
      this.multipleSelection_data_list = val;

    },
    // 关闭
    handleClose () {
      // this.basePageParam_query.pageNo = 1;
    },

    // 查看结果数
    data_num_click (data) {
      this.paramTaskUuid = data.paramTaskUuid
      if (data.runStatus == 2) {
        this.dialogVisible_data_num = true;//显示结果数
        this.jg_title = data.auditModelName
        let params2 = {
          runTaskRelUuid: this.paramTaskUuid,
        }
        this.data_tab(params2);//结果分类
      } else {
        this.$message.info("请选择已经完成的查看");
        return false
      }
    },
    // 结果数 核实显示弹窗
    task_verify () {
      if (this.multipleSelection_data_list.length == 0) {
        this.$message.info("请选择一条进行数据核实");
        return false
      }

      console.log(this.multipleSelection_data_list);
      var that = this

      if (this.multipleSelection_data_list.every(item => item.isProbleam !== 0)) {
        that.dialogVisible_data_verify = true;//显示核实弹窗
        return false

      } else {
        that.$message.info("请选择未核实的结果进行核实");
        return false
      }
    },
    // 是否问题 change
    isProbleam_change (val) {
      this.verify_model.isProbleam_data = val
    },

    // 新增上传附件
    handleChangePic_verify (file, fileList, name) {
      this.fileList2 = fileList;
      this.file = file.raw
    },

    // 结果数 核实上传  删除
    handleRemoveApk (file, fileList2) {
      if (file.response) {
        this.fileList2.remove(file.response.data);
        this.key = Math.random();
        // } else {
        //   this.edit_file_list.remove(file);
        //   file.isDeleted = 1;
        //   this.fileList_Delet.push(file)
        // }
      }
    },
    // 核实上传 保存附件
    verify_save (verify_model) {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      this.$refs[verify_model].validate((valid) => {
        if (valid) {
          if (this.fileList2.length > 0) {
            this.success_btn2 = 1;//显示加载按钮  0成功  1 loaging
            // 上传
            let formData = new FormData()
            formData.append('file', this.file.raw)
            this.fileList2.forEach((item) => {
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
                this.success_btn2 = 0;//显示加载按钮  0成功  1 loaging
                // 
                this.Upload_file2 = resp.data.data;//上传成功大的文件

                // var arr = this.multipleSelection_data_list.map(function (item, index) {
                //   return item.resultDetailId;
                // }).join(",");
                // 

                var arr = this.multipleSelection_data_list.map(function (item, index) {
                  return item.onlyuuid;
                }).join(",");
                // 
                // 提交
                let resultDetailProjectRelDto = {
                  handleIdea: this.verify_model.handleIdea,//核实信息
                  isProbleam: this.verify_model.isProbleam_data, //是否问题（0：否 1：是 ）
                  resultDetailIds: arr,//核实明细结果id （多个）
                  attachmentList: this.Upload_file2,//上传成功de 的文件
                  projectId: this.managementProjectUuid,
                  runTaskRelUuid: this.paramTaskUuid,//结果id

                };
                this.verify_preservation(resultDetailProjectRelDto)//保存

              } else {
                // 上传失败
                this.$message({
                  message: resp.data.msg,
                  type: 'error'
                });
                this.success_btn = 1;//显示加载按钮  0成功  1 loaging
              }
            })//上传 end
          } else {
            // 直接保存
            var arr = this.multipleSelection_data_list.map(function (item, index) {
              return item.onlyuuid;
            }).join(",");
            let resultDetailProjectRelDto = {
              handleIdea: this.verify_model.handleIdea,//核实信息
              isProbleam: this.verify_model.isProbleam_data, //是否问题（0：否 1：是 ）
              resultDetailIds: arr,//核实明细结果id （多个）
              attachmentList: this.edit_file_list2,//上传成功的 的文件
              projectId: this.managementProjectUuid,
              runTaskRelUuid: this.paramTaskUuid,//结果id

            };
            this.verify_preservation(resultDetailProjectRelDto)//保存
          }
        } else {
          this.$message.info("请填写信息");
          return false;
        }
      });
    },
    // 结果数 核实上传关闭
    resetForm_verify (verify_model) {
      this.$refs[verify_model].resetFields();
      this.verify_model = {};//清空输入
      this.$refs.upload2.clearFiles();
      this.success_btn2 = 0;//显示加载按钮  0成功  1 loaging
    },


    // 核实保存
    verify_preservation (resultDetailProjectRelDto) {
      task_data_verify(resultDetailProjectRelDto).then(resp => {

        if (resp.code == 0) {
          this.$message({
            message: "核实成功",
            type: "success",
          });
          this.dialogVisible_data_verify = false;//关闭核实  弹窗

          // 新表单
          // this.new_table();//新接口 table
          // 刷新任务列表
          let params1 = {
            pageNo: this.params.pageNo,
            pageSize: this.params.pageSize,
            condition: {
              auditModelCategory: this.params.auditModelCategory,
              managementProjectUuid: this.managementProjectUuid,
              taskName: this.search_taskName,
              // taskType: 2//自建任务列表
            }
          }
          this.list_data(params1);
          let params2 = {
            runTaskRelUuid: this.paramTaskUuid,
            // runTaskRelUuid: '8ee17c4b77c51747207aab278d804381'
          }
          this.data_tab(params2);//结果分类

          // 结果列表
          let params3 = {
            basePageParam: {
              condition: {
                keyword: null,
                runResultTableUuid: this.status_data[this.date_index].runResultTableUuid,
                runTaskRelUuid: this.paramTaskUuid,
                resultTableName: this.status_data[this.date_index].resultTableName,//- 实际表名
                resultShowName: this.status_data[this.date_index].resultShowName,
                tableType: this.status_data[this.date_index].tableType,//  主副表标识, 主表 = 1、副表1 = 2、副表2 = 3···
                dataCount: 1
              },
              pageNo: this.basePageParam_query.pageNo, //当前页数
              pageSize: this.basePageParam_query.pageSize //分页数量
            },
            filterSql: "undefined",
          }

          this.data_tab_list(params3)// 结果列表

        } else {
          this.$message({
            message: resp.msg,
            type: "error",
          });
        }
      })
    },



    // // 核实 确认
    // query () {
    //   if (this.multipleSelection_data_list.length == 0) {
    //     this.$message.info("请选择一条结果数进行确认");
    //     return
    //   }
    // },



    //核实下载
    // download () {
    // if (this.multipleSelection_data_list.length == 0) {
    //   this.$message.info("请选择一条进行数据核实");
    //   return false
    // }
    // },



    // 问题数==============================================
    // 查看问题
    probleNum_click (id, name) {

      this.problemsDialogVisible = true;//显示问题数弹窗
      this.auditTaskUuid = id
      this.wt_title = name
      let params = {

        condition: {
          auditTaskUuid: this.auditTaskUuid,
          managementProjectUuid: this.managementProjectUuid,
        },
        pageNo: this.probleNum.pageNo,
        pageSize: this.probleNum.pageSize,
      };
      this.task_problems_data(params);//问题数列表

    },
    // 问题数列表
    task_problems_data (params) {
      this.loading = true;
      task_problems_list(params).then(resp => {
        this.probleNum_data = resp.data
        this.probleNum_list = resp.data.records
        this.loading = false
      })
    },
    // 问题数分页 每页几条
    handleSizeChange_probleNum (val) {
      this.probleNum.pageSize = val
    },
    // 问题数分页
    handleCurrentChange_probleNum (val) {
      let params = {
        condition: {
          auditTaskUuid: this.auditTaskUuid,
        },
        pageNo: val,
        pageSize: this.probleNum.pageSize,
      };
      this.task_problems_data(params);
    },
    // 新增问题
    add_list () {
      this.dialogVisible_add_list = true;
      this.problems_title = '新增';
    },
    // 领域select
    lingyu (params) {
      task_problems_loadcascader(params).then(resp => {
        this.problems_slect = resp.data
      })
    },
    // 领域change
    changeHeader_zj_ly (val) {
      this.save_zj_query.belongField = val
    },
    // 专题select
    zhuanti (params) {
      task_problems_loadcascader(params).then(resp => {
        this.zt_slect = resp.data
      })
    },
    // 专题 change
    changeHeader_zj_zt (val) {
      this.save_zj_query.belongSpcial = val;
      if (val == '其他') {
        this.input_select = false;
        this.save_zj_query.belongSpcial = ''
      }

    },
    // 新增  问题数 保存
    add_list_save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let problemList = {
            auditTaskUuid: this.auditTaskUuid,
            field: this.problems_form.field,//领域
            problem: this.problems_form.problem,//问题
            basis: this.problems_form.basis,//依据
            problemDiscoveryTime: this.problems_form.problemDiscoveryTime,//发现时间
            describe: this.problems_form.describe, // 描述
            riskAmount: this.problems_form.riskAmount,// 风险金额
            associatedTask: this.problems_form.associatedTask,// 关联任务
            // 附件
          };
          this.add_task_problems_save(problemList)//
        } else {
          this.$message.info("请填写信息");
          return false;
        }
      })
    },
    // 关闭问题   清空值
    resetForm (formName) {
      this.$refs[formName].resetFields();

    },
    // 保存接口
    add_task_problems_save (problemList) {
      task_problems_save(problemList).then(resp => {

        if (resp.code == 0) {
          this.$message({
            message: "新增成功",
            type: "success",
          });
          this.dialogVisible_add_list = false;//关闭

          let params2 = {
            condition: {
              auditTaskUuid: this.auditTaskUuid,
            },
            pageNo: this.probleNum.pageNo,
            pageSize: this.probleNum.pageSize,
          };
          this.task_problems_data(params2);//问题 列表

        } else {
          this.$message({
            message: resp.msg,
            type: "error",
          });
        }
      })
    },
    //  关联任务
    problems_task_change (val) {
      this.problems_form.associatedTask = val
    },
    // 编辑
    edit_list (id) {
      this.dialogVisible_add_list = true;
      this.problems_title = '修改'
      let params = {
        id: id,
      }
      this.edit_details(params);//详情回显
    },
    // 问题详情 编辑回显
    edit_details (params) {
      task_problems_details(params).then(resp => {
        let data = resp.data
        this.problems_form.field = data.field;//领域
        this.problems_form.problem = data.problem;//问题
        this.problems_form.basis = data.basis;//依据
        this.problems_form.problemDiscoveryTime = data.problemDiscoveryTime;//发现时间
        this.problems_form.describe = data.describe;// 描述
        this.problems_form.riskAmount = data.riskAmount;// 风险金额
        this.problems_form.associatedTask = data.associatedTask;// 关联任务
      })
    },
    // 编辑保存
    add_list_update () {
      let problemList = {
        auditTaskUuid: this.auditTaskUuid,
        field: this.problems_form.field,//领域
        problem: this.problems_form.problem,//问题
        basis: this.problems_form.basis,//依据
        problemDiscoveryTime: this.problems_form.problemDiscoveryTime,//发现时间
        describe: this.problems_form.describe, // 描述
        riskAmount: this.problems_form.riskAmount,// 风险金额
        associatedTask: this.problems_form.associatedTask,// 关联任务
        // 附件
      };
      this.edit_list_data(problemList);
    },
    // 编辑问题数列表
    edit_list_data (problemList) {
      task_problems_update(problemList).then(resp => {
        if (resp.code == 0) {
          this.$message({
            message: "编辑成功",
            type: "success",
          });
          this.dialogVisible_add_list = false;//关闭借口
          let params2 = {
            condition: {
              auditTaskUuid: this.auditTaskUuid,
            },
            pageNo: this.probleNum.pageNo,
            pageSize: this.probleNum.pageSize,
          };
          this.task_problems_data(params2);//问题 成列表

        } else {
          this.$message({
            message: resp.msg,
            type: "error",
          });
        }


      })
    },
    // 新增问题  领域change
    problems_form_change (val) {
      this.problems_form.field = val;
    },
    // 删除
    remove_list (id) {
      this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            ids: id,
          }
          this.task_problems_delete_btn(params);
        })
        .catch(() => { });

    },
    // 删除接口
    task_problems_delete_btn (params) {
      task_problems_delete(params).then(resp => {

        if (resp.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success",
          });

          let params2 = {
            condition: {
              auditTaskUuid: this.auditTaskUuid,
            },
            pageNo: this.probleNum.pageNo,
            pageSize: this.probleNum.pageSize,
          };
          this.task_problems_data(params2);//问题 成列表

        } else {
          this.$message({
            message: resp.msg,
            type: "error",
          });
        }
      })
    },
    // 问题数选择
    handleSelectionChange_wts (val) {
      this.wts_data = val
    },
    // 关联任务
    task_problems_relation_data (params) {
      task_problems_relation(params).then(resp => {
        this.relation_task = resp.data
      })
    },
    // 引用知识库
    // quote_knowledge () {
    //   
    // },
    // 设置参数
    setParameters (data) {
      this.modelId = data.modelId;
      this.auditTaskUuid = data.auditTaskUuid;
      this.auditModelUuid = data.paramTaskUuid;
      let modelUuids = [this.modelId];
      // let modelUuids = ['3e9ea48186fef8481a88c85891908c4e'];
      task_findModelList(modelUuids).then(resp => {

        if (resp.code == 0) {

          // 有设置参数
          if (resp.data[0].parammModelRel.length !== 0) {

            this.arr = [JSON.parse(resp.data[0].parammModelRel[0].paramValue)];
            this.sql = resp.data[0].sqlValue;
            this.setParametersDialogVisible = true;//显示设置参数
            //  展现参数输入界面
            const timestamp = new Date().getTime();
            this.paramDrawUuid = timestamp;
            let _this = this
            setTimeout(() => {
              _this.$refs.paramDrawRefNew.createParamNodeHtml(
                _this.paramDrawUuid,
                "",
                "notModelPreview"
              );
            }, 200);
          } else {
            // 没有设置参数

            this.arr = [];
            this.sql = resp.data[0].sqlValue;
            this.setParametersDialogVisible = true;//显示设置参数
            //  展现参数输入界面
            const timestamp = new Date().getTime();
            this.paramDrawUuid = timestamp;
            let _this = this
            setTimeout(() => {
              _this.$refs.paramDrawRefNew.createParamNodeHtml(
                _this.paramDrawUuid,
                "",
                "notModelPreview"
              );
            }, 200);
            // this.$message({
            //   message: '暂无参数设置',
            // });
          }
        }
        else {
          this.$message({
            message: resp.msg,
            type: "error",
          });
        }
      })

    },
    //运行
    play_data () {
      let arr1 = this.arr;//
      let arr2 = this.$refs.paramDrawRefNew.paramInfoArr;
      let arr3 = [];//储存合并的值
      for (var s in arr1) {
        for (var x in arr2) {
          if (arr1[s].moduleParamId == arr2[x].dataId) {
            arr3.push(arr1[s].moduleParamId);
            arr1[s].paramValue = arr2[x].dataDefaultVal
          }
        }
      }
      let settingInfo = {
        sql: this.sql,
        paramsArr: this.arr,
      }
      let runTaskRel = {
        sourceUuid: this.modelId,
        settingInfo: JSON.stringify(settingInfo)
      }

      // 运行接口
      Task_run(runTaskRel).then(resp => {

        this.runTaskRelUuid = resp.data;//参数任务id
        if (resp.code == 0) {
          this.$message({
            message: "运行成功,请等待执行完成进行手动刷新",
            type: "success",
          });
          this.setParametersDialogVisible = false;//关闭设置参数

          this.systemTime = new Date() // 获取时间
          let params2 = {
            // auditTask: {
            // paramTaskContent:,
            auditTaskUuid: this.auditTaskUuid,//当前对象id
            paramTaskUuid: this.runTaskRelUuid,
            // runStatus: 1,
            taskStartTime: this.systemTime
            // }
          }
          this.update_setting(params2)//update


        } else {
          this.$message({
            message: resp.msg,
            type: "error",
          });
        }
      })

    },

    // 更新状态
    update_setting (params2) {
      Task_update_status(params2).then(resp => {

        if (resp.code == 0) {
          // this.$message({
          //   message: "运行成功",
          //   type: "success",
          // });
          // 模型列表
          let params = {
            pageNo: this.params.pageNo,
            pageSize: this.params.pageSize,
            condition: {
              auditModelCategory: this.params.auditModelCategory,
              managementProjectUuid: this.managementProjectUuid,
              taskName: this.search_taskName,
              // taskType: 1,
            }
          }
          this.list_data(params);//刷新列表
        }

      })
    },
    //查询任务状态
    task_status () {
      let params = {
        runTaskRelId: this.runTaskRelId,
      }
      Task_data_status(params).then(resp => {

      })
    },

    // 模型列表 获取责任人 
    changeHeader (val) {
      this.select_list.find((item) => {
        if (item.peopleTable.peopleName === val.peopleName) {//筛选出匹配数据
          let peopleTableUuid = item.peopleTable.peopleTableUuid.replace('{', '').replace('}', '').trim();
          this.save_zj_query.peopleTableUuid = peopleTableUuid;

        }
      })
      let params2 = {
        peopleName: val.peopleName,//责任人
        peopleTableUuid: this.save_zj_query.peopleTableUuid,//责任人id
        auditTaskUuid: val.auditTaskUuid,//项目id
        managementProjectUuid: this.managementProjectUuid,//项目id
      }
      // 保存责任人
      task_setChargePeople(params2).then(resp => {
        if (resp.code == 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          // 模型列表 获取责任人
          // 刷新模型列表
          let params = {
            pageNo: this.params.pageNo,
            pageSize: this.params.pageSize,
            condition: {
              auditModelCategory: this.params.auditModelCategory,
              managementProjectUuid: this.managementProjectUuid,
              taskName: this.search_taskName,
              // taskType: 1
            }
          }
          this.list_data(params);

        } else {
          this.$message({
            message: resp.msg,
            type: 'success'
          });
        }
      })
    },

    // 自建人物 设置责任人
    changeHeader2 (val) {
      this.save_zj_query.peopleTableUuid = val;
      // this.select_list.find((item) => {
      //   if (item.peopleTable.peopleName === val) {//筛选出匹配数据
      //     let peopleTableUuid = item.peopleTable.peopleTableUuid.replace('{', '').replace('}', '').trim();
      //     this.save_zj_query.peopleTableUuid = peopleTableUuid;
      //     
      //   }
      // })
      for (let i = 0; i < this.select_list.length; i++) {
        if (val == this.select_list[i].peopleTableUuid) {
          this.save_zj_query.peopleName = this.select_list[i].peopleName;
        }
      }
    },
    // 模型/自建 任务--删除
    delete_model (ids, problemsNumber) {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      this.$confirm('将永久删除任务和关联的附件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (problemsNumber !== 0) {
            this.$message.info("该任务已被问题关联，请勿删除");
            return false
          } else {
            let params = {
              ids: ids
            }
            task_remove(params).then(resp => {
              if (resp.code == 0) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                // 刷新自建列表
                let params = {
                  pageNo: this.params.pageNo,
                  pageSize: this.params.pageSize,
                  condition: {
                    auditModelCategory: this.params.auditModelCategory,
                    managementProjectUuid: this.managementProjectUuid,
                    taskName: this.search_taskName,
                    // taskType: ''
                  }
                }
                this.list_data(params);
              } else {
                this.$message({
                  message: resp.msg,
                  type: 'error'
                });
              }
            })
          }

        })
        .catch(() => { });
    },
  }
};
</script>
  
<style scoped>
@import "../../../assets/styles/css/lhg.css";
>>> .el-dialog--center .el-dialog__body {
  padding: 0 !important;
}
.dlag_conter >>> .el-form-item__label {
  font-size: 14px !important;
  padding: 0 !important;
  width: 100px;
}

.task_type >>> .el-button:hover,
.task_type >>> .el-button,
.task_type >>> .el-button:focus {
  background: none;
  border-color: transparent !important;
}
/* 附件详情 */
.file_details {
  /* border: 1px solid red; */
  height: 200px;
  overflow-y: auto;
}
.title_dlag {
  text-align: center;
}
.sjzl >>> .is-plain {
  background: #ffffff !important;
  border: 1px solid #dcdfe6 !important;
}
/* 责任人 */
.dlag_conter >>> .el-input.is-disabled .el-input__inner {
  color: #606266 !important;
  background-color: rgba(0, 0, 0, 0.2) !important;
  background: none;
  opacity: 0.5;
}

.sjzl {
  display: flex;
}
/* 当前选项 */
.active_tab {
  background: #1371cc !important;
}
.task_type {
  margin-top: 10px;
}
.task_type >>> .el-table {
  min-height: 500px;
}
.titleMes {
  margin: 0;
  padding: 10px 0 0;
  box-sizing: border-box;
}
.sjzl >>> .el-table__header {
  border-top: none !important;
}
.sjzl .conter {
  width: 100%;
  float: left;
}

/* 内容  按钮 */
.cxjg >>> .el-col {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}

/* .sjzl >>> .el-dialog {
  width: auto !important;
  max-width: 90%;
} */

/* 模型结果 */
.status_data {
  display: flex;
  padding: 10px;
  box-sizing: border-box;
}
.status_data li {
  margin: 0 5px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  cursor: pointer;
}
/* 附件详情 */

.update {
  display: flex;
  align-items: center;
  justify-content: center;
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
.titleMes .el-button {
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
.search >>> .el-button {
  border-radius: 0 5px 5px 0;
  /* background: #1371cc !important; */
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
.dlag_conter p {
  margin-bottom: 10px;
  min-width: 100px;
  text-align: right;
}
.dlag_conter >>> .el-form {
}

.dlag_conter >>> .el-form-item {
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  box-sizing: border-box;
}
.dlag_conter >>> .el-input {
  width: 300px;
}

.dlag_conter >>> .el-form-item__content {
  margin-left: 10px !important;
  display: flex;
  min-width: 400px;
  flex: inherit !important;
}
.upload-demo {
  width: 100%;
}
/* .sjzl >>> .el-dialog__footer {
  text-align: center !important;
} */
.dlag_conter >>> .el-upload-dragger {
  width: 300px;
}
.setParameters {
  margin: 0;
  height: 50px;
  background: #4476a7;
  margin-top: -10px;
  font-size: 15px;
  color: #fff;
  font-weight: 700;
  margin-bottom: 2%;
}
.parameters {
  font-size: 15px;
  background: #ecedf2;
  border: 0;
}
.parametersTab {
  margin-top: -0.7%;
  background: #dbdfe9;
  margin-bottom: 2%;
}
.parametersTab .el-select {
  position: relative;
  top: -35px;
  width: 400px;
}
.parametersTab .el-input {
  position: relative;
  top: -35px;
  width: 400px;
}
.parametersTab .el-form-item {
  margin-bottom: -25px !important;
}
.tableTitle {
  font-size: 20px;
  font-weight: 700;
}

/* 核实结果 */
.dlag_conter3 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding-bottom: 20px;
  box-sizing: border-box;
}
.dlag_conter3 >>> .el-form-item__content {
  display: flex;
  /* margin-top: 20px; */
}
.dlag_conter3 >>> .el-form-item__content textarea,
.dlag_conter3 >>> .el-form-item__content .el-input {
  width: 200px;
}
.dlag_conter3 >>> p {
  min-width: 80px;
}
.dlag_conter3 >>> .el-form-item__content .el-button {
  display: flex;
}
.dlag_conter3 >>> .foot {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}
.son {
  width: 100%;
  display: flex;
  margin-top: 10px;
}
.son >>> .el-form-item {
  min-width: 280px;
  display: flex;
  align-items: flex-start;
}
.son >>> .el-form-item .el-button {
  height: 40px;
  margin: 0 10px;
  line-height: 40px;
  padding: 0 10px;
}

.dlag_conter3 >>> .el-form-item__error {
  left: 80px;
}

.active {
  background: #1371cc !important;
}
.new >>> .el-form .el-form-item__error {
  left: 100px;
}
.new >>> .el-form p span {
  color: red;
}
.file_name:hover {
  color: #1371cc;
  cursor: pointer;
}

/* 核实  */
.verify {
  padding: 17px 20px;
  box-sizing: border-box;
}
.verify >>> .el-form-item__content textarea,
.verify >>> .el-form-item__content .el-input {
  width: 300px;
}
.verify >>> .el-form-item__label {
  width: 90px;
}

.cxjg >>> .el-button {
  background: #ffffff;
  border: 1px solid #dcdfe6;
}
.verify >>> .el-form-item__content {
  flex: 1;
}
.verify >>> .el-form-item__content span {
  color: red;
}
.verify >>> .el-upload {
  width: 100% !important;
}
.verify >>> .el-form-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px !important;
}

/* .dlag_conter >>> .el-upload-list__item-name {
  max-width: 285px;
  margin-right: 0;
}

.dlag_conter >>> .el-upload {
  width: 305px !important;
} */

.new >>> .el-upload-list__item {
  width: 320px !important;
}
.new >>> .el-upload-list__item-name {
  margin-right: 20px !important;
}
/* 新版附件详 */
.list-folder {
  color: orange;
  margin-right: 5px;
}
.no-padding {
  padding: 0 !important;
  border: none !important;
}
.tableFileList-title {
  padding: 5px 0;
  border-top: 1px solid #ddd;
  background: #f4faff;
}
.fileList-ul > li {
  padding-left: 10px;
  margin-bottom: 10px;
}
.pointer {
  cursor: pointer;
}
.dlag_conter2 {
  padding: 0 20px 20px;
  box-sizing: border-box;
}
</style>
 