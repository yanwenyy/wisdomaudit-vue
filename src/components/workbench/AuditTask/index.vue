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
                       @click="new_add_zj()">新增</el-button>
          </el-col>

          <!--自建任务 模型任务 筛选 -->
          <div class="search">
            <el-input placeholder="请输入"
                      v-model="params.taskName"> </el-input>
            <div class="search_icon">
              <i class="el-icon-search"
                 style="color: rgba(0, 0, 0, 0.5)"></i>
            </div>
            <el-button type="primary"
                       @click="search_list(1)">筛选</el-button>
          </div>
        </el-row>
        <!-- tab end-->

        <!-- 自建任务 -->
        <div class="task_type">
          <!-- 表单 -->
          <el-table :data="tableData_list"
                    v-loading="loading"
                    style="width: 100%">

            <!-- <el-table-column type="index"
                             label="序号"
                             width="50">
            </el-table-column> -->
            <!-- 任务/自建任务名称 -->
            <el-table-column prop="taskName"
                             label="任务/自建任务名称"> </el-table-column>
            <!-- 专题 -->
            <el-table-column prop="belongField"
                             label="专题">
            </el-table-column>

            <!-- 类型 -->
            <el-table-column prop="taskType"
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
                             label="责任人 ">
              <!-- <template slot-scope="scope">
                <el-select v-model="scope.row.peopleName"
                           @change="changeHeader(scope.row)">
                  <el-option v-for="item in select_list"
                             :key="item.peopleTable.peopleTableUuid"
                             :label="item.peopleTable.peopleName"
                             :value="item.peopleTable.peopleName">
                  </el-option>
                </el-select>
              </template> -->
            </el-table-column>

            <!-- 问题数 -->
            <el-table-column prop="problemsNumber"
                             label="问题数">
              <template slot-scope="scope">
                <el-button @click="probleNum_click(scope.row.auditTaskUuid,scope.row.auditModelName)"
                           type="text"
                           style="color: #1371cc"
                           size="small">
                  {{ scope.row.problemsNumber }}
                </el-button>
              </template>
            </el-table-column>

            <!-- 结果数 -->
            <el-table-column prop="resultsNumber"
                             label="结果数">
              <template slot-scope="scope">
                <el-button @click="data_num_click(scope.row)"
                           type="text"
                           style="color: #1371cc"
                           size="small">
                  {{ scope.row.resultsNumber }}

                </el-button>
              </template>
            </el-table-column>
            <!-- 附件 -->
            <el-table-column prop="address"
                             label="附件"
                             width="90">
              <template slot-scope="scope">

                <div class="update">
                  <i class="update_icon">
                    <svg t="1631877671204"
                         class="icon"
                         viewBox="0 0 1024 1024"
                         version="1.1"
                         xmlns="http://www.w3.org/2000/svg"
                         p-id="9939"
                         width="200"
                         height="200">
                      <path d="M825.6 198.4H450.1l-14.4-28.7c-18.8-37.6-56.5-60.9-98.5-60.9H174.1C113.4 108.8 64 158.2 64 218.9v561.9c0 74.1 60.3 134.4 134.4 134.4h627.2c74.1 0 134.4-60.3 134.4-134.4v-448c0-74.1-60.3-134.4-134.4-134.4z m44.8 582.4c0 24.7-20.1 44.8-44.8 44.8H198.4c-24.7 0-44.8-20.1-44.8-44.8V467.2h716.8v313.6z m0-403.2H153.6V218.9c0-11.3 9.2-20.5 20.5-20.5h163.1c7.8 0 14.9 4.4 18.4 11.4l39.1 78.2h430.9c24.7 0 44.8 20.1 44.8 44.8v44.8z"
                            fill="#FD9D27"
                            p-id="9940"></path>
                    </svg>
                  </i>
                  <span @click="open_enclosure_details(scope.row)">2</span>

                </div>
              </template>
            </el-table-column>

            <!-- 状态 -->
            <!-- <el-table-column prop="resultsNumber"
                             label="运行状态">
              <template slot-scope="scope">
                {{
                  scope.row.runStatus == 0
                    ? "未开始"
                    : scope.row.runStatus == 1
                    ? "执行中"
                    : scope.row.runStatus == 2
                    ? "已完成":'运行失败'
                }}
              </template>
            </el-table-column> -->

            <el-table-column label="操作"
                             width="250">
              <template scope="scope">

                <!-- 模型 ---------->
                <!-- 重新执行设置 -->
                <el-button @click="setParameters(scope.row)"
                           type="text"
                           v-if=" scope.row.taskType == 1"
                           style="color: #1371cc"
                           size="small">
                  重新执行
                </el-button>

                <!-- 查看结果 -->
                <el-button @click="data_num_click(scope.row)"
                           type="text"
                           v-if=" scope.row.taskType == 1"
                           style="color:#1371CC"
                           size="small">
                  查看结果
                </el-button>

                <!-- 模型 ===========---------->

                <!-- 编辑 -->
                <el-button @click="edit_data(scope.row)"
                           type="text"
                           style="color:#1371CC"
                           size="small">编辑</el-button>

                <!-- 删除 -->
                <el-button @click="delete_model(scope.row.auditTaskUuid)"
                           type="
                           text"
                           style="color: red"
                           size="small">
                  删除
                </el-button>

              </template>
            </el-table-column>
          </el-table>
          <!-- 表单 end-->

          <!-- 分页 -->
          <div class="page">
            <el-pagination background
                           layout="prev, pager, next"
                           :page-sizes="[2, 4, 6, 8]"
                           :current-page="this.list_data.current"
                           @current-change="handleCurrentChange_zijian"
                           :page-size="this.list_data.size"
                           :total="this.list_data.total"></el-pagination>
          </div>
          <!-- 分页 end-->
        </div>
        <!-- 自建任务 end-->
      </div>
    </div>

    <!-- 模型任务 结果数 -->
    <el-dialog title="模型列表"
               width="90%"
               popper-class="status_data_dlag"
               :visible.sync="dialogVisible_data_num"
               style="padding-bottom: 59px">
      <div class="dlag_conter">
        <el-row :gutter="24">
          <!-- 结果分类  -->
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
            <el-button type="primary"
                       @click="task_verify()">核实</el-button>
            <el-button type="primary"
                       @click="download()">下载</el-button>
            <el-button type="primary"
                       @click="dialogVisible_data_num == false">返回</el-button>
          </el-col>
        </div>
        <!-- 表单 -->
        <el-table :data="status_data_list[0].result"
                  ref="multipleTable"
                  tooltip-effect="dark"
                  v-loading="loading"
                  style="width: 100%"
                  @selection-change="handleSelectionChange_operation">
          >
          <el-table-column v-for="(item,key) in status_data_list[0].columns"
                           :key="key"
                           :prop="item"
                           :label="item"
                           align="center">
          </el-table-column>
        </el-table>
        <!-- 表单 end-->

        <!-- 分页 -->
        <div class="page">
          <el-pagination background
                         layout="prev, pager, next"
                         :current-page="this.status_data_list_data.current"
                         @current-change="handleCurrentChange_toatl"
                         :page-size="this.status_data_list_data.size"
                         :total="this.status_data_list_data.total"></el-pagination>

        </div>
        <!-- 分页 end-->
      </div>
      <span slot="footer">
        <el-button size="small"
                   type="primary"
                   @click="query()">确 定</el-button>
        <el-button size="small"
                   @click="clearTopic(), (dialogVisible_data_num = false)">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 模型任务 核实明细结果  -->
    <el-dialog title="核实结果"
               width="40%"
               popper-class="status_data_dlag_verify"
               :visible.sync="dialogVisible_data_verify"
               style="padding-bottom: 59px">
      <div class="dlag_conter3">
        <el-form>
          <el-form-item prop="isProbleam">
            <p>是否问题：</p>
            <el-select v-model="verify.isProbleam"
                       @change="isProbleam_change">
              <el-option v-for="item in isProbleam"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="dataName">
            <p>核实信息：</p>
            <el-input type="textarea"
                      v-model="verify.handleIdea"
                      placeholder="请输入核实信息"></el-input>
          </el-form-item>

          <el-form-item prop="dataName">
            <p>上传文件：</p>
            <el-input v-model="verify.uodate_path"
                      disabled
                      style="width: 133px;margin-right: 10px;"
                      placeholder="附件"></el-input>
            <!-- <el-button size="small"
                       type="primary"
                       @click="update()">上传</el-button> -->

            <el-upload class="upload-demo"
                       action="https://jsonplaceholder.typicode.com/posts/"
                       :on-change="handleChange"
                       :file-list="fileList">
              <el-button size="small"
                         type="primary">点击上传</el-button>
            </el-upload>

          </el-form-item>
        </el-form>
        <span slot="footer"
              class="foot">
          <el-button size="small"
                     type="primary"
                     @click="verify_save()">保 存</el-button>
          <el-button size="small"
                     @click="dialogVisible_data_verify = false">
            返回</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 模型任务 问题数 -->
    <el-dialog :visible.sync="problemsDialogVisible"
               width="70%">
      <el-row style="margin-top:3%;background:#F2F2F2;padding:15px">
        <el-col :span="18"
                class="tableTitle">{{wt_title}}模型审计发现列表</el-col>
        <el-col :span="6">
          <el-button size="small"
                     type="primary"
                     style="float:right"
                     @click="add_list()">增加</el-button>

        </el-col>
      </el-row>
      <el-table :data="probleNum_list"
                ref="multipleTable"
                tooltip-effect="dark"
                style="width: 100%;margin-bottom:2%"
                @selection-change="handleSelectionChange_wts">
        <el-table-column type="selection"
                         width="55"> </el-table-column>
        <el-table-column prop="field"
                         label="领域"> </el-table-column>
        <el-table-column prop="problem"
                         label="问题"> </el-table-column>
        <el-table-column prop="basis"
                         label="依据"> </el-table-column>
        <el-table-column prop="describe"
                         label="描述"> </el-table-column>

        <el-table-column prop="problemDiscoveryTime"
                         label="发现时间">
          <template slot-scope="scope">
            {{scope.row.problemDiscoveryTime |filtedate }}
          </template>

        </el-table-column>

        <el-table-column prop="riskAmount"
                         label="风险金额（万元）"> </el-table-column>
        <el-table-column prop="problemFindPeople"
                         label="发现人"> </el-table-column>
        <el-table-column prop="name6"
                         label="操作">
          <template slot-scope="scope">

            <el-button size="small"
                       type="primary"
                       @click="edit_list(scope.row.problemListUuid)">修改</el-button>
            <el-button size="small"
                       type="primary"
                       @click="remove_list(scope.row.problemListUuid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="page">
        <el-pagination background
                       layout="prev, pager, next"
                       :page-sizes="[2, 4, 6, 8]"
                       :current-page="this.probleNum_data.current"
                       @current-change="handleCurrentChange_probleNum"
                       :page-size="this.probleNum_data.size"
                       :total="this.probleNum_data.total"></el-pagination>
      </div>
      <!-- 分页 end-->

    </el-dialog>

    <!-- 问题数新增 -->
    <el-dialog :visible.sync="dialogVisible_add_list"
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
              <el-input type="textarea"
                        v-model="problems_form.problem"
                        placeholder=""></el-input>

            </el-form-item>

            <el-form-item prop="basis"
                          style="margin-left:20px">
              <p>依据：</p>
              <el-input type="textarea"
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
              <!-- <el-select v-model="problems_form.problemDiscoveryTime"
                         @change="isProbleam_change">
                <el-option v-for="item in isProbleam"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select> -->
              <el-date-picker v-model="problems_form.problemDiscoveryTime"
                              type="date"
                              placeholder="发现时间">
              </el-date-picker>
            </el-form-item>

            <el-form-item prop="describe"
                          style="margin-left:20px">
              <p>描述：</p>
              <el-input type="textarea"
                        v-model="problems_form.describe"
                        placeholder=""></el-input>
            </el-form-item>
          </div>

          <div class="son">

            <el-form-item prop="problemFindPeople">
              <p>发现人：</p>
              <div v-model="problems_form.problemFindPeople">laoli</div>
            </el-form-item>

            <el-form-item prop="riskAmount"
                          style="margin-left:20px">
              <p>风险金额：</p>
              <el-input type="textarea"
                        v-model="problems_form.riskAmount"
                        placeholder=""></el-input>
            </el-form-item>
          </div>
          <div class="son">

            <el-form-item prop="associatedTask">
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
              <el-input v-model="verify.uodate_path"
                        disabled
                        style="width: 133px;margin-right: 10px;"
                        placeholder="附件"></el-input>

              <el-upload class="upload-demo"
                         action="https://jsonplaceholder.typicode.com/posts/"
                         :on-change="handleChange"
                         :file-list="fileList">
                <el-button size="small"
                           type="primary">点击上传</el-button>
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
    </el-dialog>

    <!-- 模型任务设置参数 -->
    <el-dialog :visible.sync="setParametersDialogVisible"
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

    <!-- 自建任务新增 -->
    <el-dialog :title="title"
               :visible.sync="dialogVisible_zj"
               @close="resetForm('save_zj_query')"
               style="padding-bottom: 59px">

      <div class="dlag_conter new">
        <el-form ref="save_zj_query"
                 :model="save_zj_query"
                 :inline="false">

          <!-- 任务名称 -->
          <el-form-item label-width="80px"
                        style="margin-bottom:30px!important"
                        prop="taskName"
                        :rules="{
              required: true,
              message: '此项不能为空',
              trigger: 'blur',
            }">
            <p><span>*</span>任务名称：</p>
            <el-input v-model="save_zj_query.taskName"
                      placeholder="请输入任务新增"></el-input>
          </el-form-item>
          <!-- 责任人 -->
          <el-form-item label-width="80px"
                        prop="peopleTableUuid"
                        :rules="{
              required: true,
              message: '此项不能为空',
              trigger: 'blur',
            }"
                        style="margin-bottom:30px!important">
            <p><span>*</span>责任人：</p>
            <el-select v-model="save_zj_query.peopleTableUuid"
                       @change="changeHeader2">
              <el-option v-for="item in select_list"
                         :key="item.peopleTableUuid"
                         :label="item.peopleName"
                         :value="item.peopleTableUuid">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 领域 -->
          <el-form-item label-width="80px"
                        prop="belongSpcial"
                        :rules="{
              required: true,
              message: '此项不能为空',
              trigger: 'blur',
            }"
                        style="margin-bottom:30px!important">
            <p><span>*</span>领域：</p>
            <el-select v-model="save_zj_query.belongSpcial"
                       @change="changeHeader_zj_ly">
              <el-option v-for="item in problems_slect"
                         :key="item.value"
                         :label="item.label"
                         :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 专题 -->
          <el-form-item label-width="80px"
                        prop="belongField"
                        :rules="{
              required: true,
              message: '此项不能为空',
              trigger: 'blur',
            }"
                        style="margin-bottom:30px!important">
            <p><span>*</span>专题：</p>
            <el-select v-model="save_zj_query.belongField "
                       @change="changeHeader_zj_zt">
              <el-option v-for="item in zt_slect"
                         :key="item.value"
                         :label="item.label"
                         :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 任务描述 -->
          <el-form-item label-width="80px"
                        style="margin-bottom:30px!important">
            <p>任务描述：</p>
            <el-input v-model="save_zj_query.taskDescription"
                      placeholder="请输入任务描述"></el-input>
          </el-form-item>
          <!-- 上传附件 -->
          <el-form-item label-width="80px"
                        prop="fileList"
                        style="margin-bottom:30px!important">
            <p><span>*</span>上传附件：</p>
            <el-upload class="upload-demo"
                       drag
                       ref="upload"
                       action="#"
                       :before-upload="beforeAvatarUpload"
                       v-model="save_zj_query.enclosure"
                       :on-change="handleChangePic"
                       :file-list="fileList"
                       :auto-upload="false"
                       multiple>
              <i class="el-icon-upload"></i>

              <div class="el-upload__text">
                支持上传或者拖拽文件到这里<em>点击上传</em>
              </div>
            </el-upload>
            <p class="el-form-item__error"
               v-if="!fileList">请上传文件</p>
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
                     v-if="title=='新增'"
                     @click="save_zj(1,'save_zj_query')">确 定</el-button>
          <el-button size="small"
                     type="primary"
                     v-else
                     @click="save_zj(2)">确 定</el-button>

          <el-button size="small"
                     @click="clearTopic(), (dialogVisible_zj = false)">取 消</el-button>
        </div>
      </span>
    </el-dialog>

    <!-- 附件详情 -->
    <el-dialog title="附件详情"
               width="40%"
               :visible.sync="dialogVisibl_enclosure_details"
               style="padding-bottom: 59px; ">
      <el-table :data="enclosure_details_list"
                style="width: 100%;">
        <!-- <el-table-column prop="dataTaskNumber"
                             label="流水单号">
            </el-table-column> -->
        <el-table-column type="index"
                         label="序号">
        </el-table-column>
        <el-table-column prop="name"
                         label="资料类型">
        </el-table-column>
        <el-table-column prop="name"
                         label="文件名称">
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
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
} from
  '@SDMOBILE/api/shandong/task'

//task_findModelList_all
import { Task_run, Task_data_status, task_findModelList, task_selectModel, task_selectTable, } from '@SDMOBILE/api/shandong/task_setting'

import { fmtDate } from '@SDMOBILE/model/time.js';
import Paramdrawnew from '@WISDOMAUDIT/components/workbench/AuditTask/paramdrawnew'//参数设置

export default {
  components: {
    Paramdrawnew
  },
  data () {
    return {
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
      verify: {
        isProbleam: '',//是否问题
        handleIdea: '',//核实信息
        resultDetailIds: '',//核实结果id
        uodat_path: '',
      },
      // 是否问题
      isProbleam: [
        {
          value: "0",
          label: "否",
        },
        {
          value: "1",
          label: "是",
        },
      ],
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
      // 模型/自建人任务 列表
      params: {
        // auditModelCategory: '',//类型
        // managementProjectUuid: '3757f078afa6161474430894936de6ed',//项目管理id
        taskName: '',//模糊查询
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
        // managementProjectUuid: "3757f078afa6161474430894936de6ed",//项目id
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
      peopleName: '请选择',//责任人默认值
      auditTaskUuid: '',//当前点击的项目id
      modelId: '',//modelid
      //  ------------------------------\
      arr: {},
      sql: '',

      // 新增任务验证
      rules_task: {
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        peopleName: [{ required: true, message: '请选择责任人', trigger: 'change' }],
        belongSpcial: [{ required: true, message: '请选择领域', trigger: 'change' }],
        belongField: [{ required: true, message: '请选择专题', trigger: 'change' }],

        // taskDescription: [{ required: true, message: '请输入任务描述', trigger: 'blur' }],
        belongSpcial: [{ required: true, message: '请选择领域', trigger: 'change' }],
        belongSpcial: [{ required: true, message: '请选择领域', trigger: 'change' }],
        belongSpcial: [{ required: true, message: '请选择领域', trigger: 'change' }],

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
        associatedTask: [{ required: true, message: '请选择关联任务', trigger: 'change' }],
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

      enclosure_details_list: [
        { name: '11' },
        { name: '22' }
      ],//附件详情



      success_btn: 0,//文件上传完成
      fileList: [],
      Upload_file: [],//上传后返回文件数组
      isClientCertFile: true,

    }
  },
  computed: {},
  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      // return fmtDate(t, 'yyyy-MM-dd hh:mm:ss');
      return fmtDate(t, 'yyyy-MM-dd ');
    }
  },
  props: ['active_project'],
  created () {
    this.managementProjectUuid = this.active_project;
    // 模型  自建任务列表
    let params = {
      pageNo: this.params.pageNo,
      pageSize: this.params.pageSize,
      condition: {
        // auditModelCategory: this.params.auditModelCategory,
        managementProjectUuid: this.managementProjectUuid,
        taskName: this.params.taskName,
        // taskType: ''
      }
    }
    this.list_data(params); // 模型  自建任务列表


    // 请求 责任人
    let params_people = {
      condition: {
        managementProjectUuid: this.managementProjectUuid,
      },
      pageNo: 1,
      pageSize: 10,
    }
    this.select_people(params_people)//请求责任人数据


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
    // 新增弹窗
    new_add_zj (index) {
      // 1:新增  2:编辑
      //自建任务 新增 
      this.dialogVisible_zj = true;
      this.title = '新增';
      // this.save_zj_query = [];
    },

    // 新增上传附件
    handleChangePic (file, fileList, name) {
      this.fileList = fileList;
      this.file = file.raw

      // this.imgFile["file"] = fileList;
      // console.log();
      //   if (typeof this.imgFile.file != "undefined" && this.imgFile.file.length > 0) {
      //     this.isClientCertFile = false;
      //   } else {
      //     this.isClientCertFile = true;
      //   }
    },
    // 上传验证 上传前调用
    beforeAvatarUpload (file) {
      this.success_btn = 1;//显示加载按钮  0成功  1 loaging
      this.fileList.append('file', file)
      return false
    },
    // 上传时
    up_ing (resp, file, fileList) {
      this.success_btn = 1;//显示加载按钮  0成功  1 loaging
    },

    // 新增自建任务 保存
    save_zj (index, save_zj_query) {
      // 1:新增  2:编辑
      if (index == 1) {
        this.$refs[save_zj_query].validate((valid) => {

          // if (this.fileList) {
          //   // this.$message.error("请上传文件")
          //   this.$refs.upload.focus()
          //   return
          // }

          if (valid) {
            this.title = '新增';


            // 上传
            let formData = new FormData()
            formData.append('file', this.file.raw)
            this.fileList.forEach((item) => {
              formData.append('files', item.raw);
            })

            this.$axios({
              method: 'post',
              url: 'http://10.10.112.56:1095/wisdomaudit/attachment/fileUploads',
              data: formData,
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(resp => {
              console.log(resp.data);
              if (resp.data.code == 0) {
                this.$message({
                  message: '上传成功',
                  type: 'success'
                });
                this.success_btn = 0;//显示加载按钮  0成功  1 loaging
                console.log(resp.data.data);
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
                  attachmentList: this.Upload_file,//上传成功大的文件
                }
                // console.log(params1);
                // 新增
                task_add(params1).then(resp => {
                  // console.log(resp);
                  if (resp.code == 0) {
                    this.$message({
                      message: '新增',
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
                        taskName: this.params.taskName,
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
              } else {
                this.$message({
                  message: resp.msg,
                  type: 'error'
                });
              }
            })

          } else {
            this.$message.info("请填写信息");
            return false;
          };
        })

      } else {
        let params2 = {
          taskType: 2,//任务类型
          auditTaskUuid: this.save_zj_query.auditTaskUuid,//项目id
          taskDescription: this.save_zj_query.taskDescription,
          taskName: this.save_zj_query.taskName,
          taskType: this.save_zj_query.taskType,//任务类型
          enclosure: this.save_zj_query.enclosure,//附件
          peopleName: this.save_zj_query.peopleName,//责任人
          peopleTableUuid: this.save_zj_query.peopleTableUuid,//责任人id
          belongSpcial: this.save_zj_query.belongSpcial,//领域
          belongField: this.save_zj_query.belongField,//专题

        }
        // 编辑保存  
        task_update(params2).then(resp => {
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
                taskName: this.params.taskName,
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
      }
    },
    resetForm (save_zj_query) {
      this.$refs[save_zj_query].resetFields();
    },

    // 自建 任务--显示编辑详情
    edit_data (data) {
      this.title = '编辑';
      this.dialogVisible_zj = true;//显示新增编辑 弹窗
      this.save_zj_query.auditTaskUuid = data.auditTaskUuid;
      this.save_zj_query.peopleName = data.peopleName;//责任人


      let params = {
        id: data.auditTaskUuid,//任务id
      }
      // 编辑数据渲染 
      task_details(params).then(resp => {
        this.edit_details = resp.data
        this.save_zj_query = this.edit_details
      })
    },

    // 查看附件详情
    open_enclosure_details (id) {
      console.log(id);
      this.dialogVisibl_enclosure_details = true;
      return false

      let params = {
        ids: id,
      };
      enclosure_details(params).then(resp => {
        this.enclosure_details_list = resp.data
        console.log(this.enclosure_details_list);
      })

    },

    // 请求责任人 select数据
    select_people (params_people) {
      task_select_people(params_people).then(resp => {
        this.select_list = resp.data.records;
        console.log(resp.data);
        console.log(this.select_list);
      })
    },

    // 模型任务列表 自建任务 筛选
    search_list () {
      let params = {
        pageNo: this.params.pageNo,
        pageSize: this.params.pageSize,
        condition: {
          // auditModelCategory: this.params.auditModelCategory,
          managementProjectUuid: this.managementProjectUuid,
          taskName: this.params.taskName,
          // taskType: ''
        }
      };
      // 模型列表 自建任务
      this.list_data(params);
    },
    // 模型/自建任务列表  
    list_data (params) {
      this.loading = true
      task_pageList(params).then(resp => {
        this.tableData = resp.data;
        this.tableData_list = resp.data.records
        this.loading = false
        console.log(this.tableData);
      })
    },


    // 结果数=========================================
    // 结果数列表 里的全选
    handleSelectionChange_operation (val) {
      this.multipleSelection_data_list = val;
    },

    // 查看结果数
    data_num_click (data) {
      this.paramTaskUuid = data.paramTaskUuid
      if (data.runStatus == 2) {
        this.dialogVisible_data_num = true;//显示结果数
        this.jg_title = data.auditModelName
        let params2 = {
          runTaskRelUuid: this.paramTaskUuid,
          // runTaskRelUuid: '3b7f19bedac4cd4bf3d9e0bd0eafd211',
        }
        this.data_tab(params2);//结果分类
      } else {
        this.$message.info("请选择已经完成的查看");
      }
    },

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
                runTaskRelUuid: this.status_data[0].paramTaskUuid,
                resultTableName: this.status_data[0].resultTableName,//- 实际表名
                resultShowName: this.status_data[0].resultShowName,
                tableType: 1,//  主副表标识, 主表 = 1、副表1 = 2、副表2 = 3···
                dataCount: 1
              },
              pageNo: 1, //当前页数
              pageSize: 10 //分页数量
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
      console.log(this.date_index);
      // 结果列表
      let params3 = {
        basePageParam: {
          condition: {
            keyword: null,
            runResultTableUuid: this.status_data[this.date_index].runResultTableUuid,
            runTaskRelUuid: this.status_data[this.date_index].runTaskRelUuid,
            runTaskRelUuid: this.status_data[this.date_index].paramTaskUuid,
            resultTableName: this.status_data[this.date_index].resultTableName,//- 实际表名
            resultShowName: this.status_data[this.date_index].resultShowName,
            tableType: this.status_data[this.date_index].tableType,//  主副表标识, 主表 = 1、副表1 = 2、副表2 = 3···
            dataCount: 1
          },
          pageNo: 1, //当前页数
          pageSize: 10 //分页数量
        },
        filterSql: "undefined",
      }
      this.data_tab_list(params3)// 结果列表

    },


    // 结果弹窗 结果列表
    data_tab_list (params) {
      task_selectTable(params).then(resp => {
        // this.loading = true
        this.status_data_list_data = resp.data;
        this.status_data_list = resp.data.records
        console.log(this.status_data_list);
        // this.loading = false

      })
    },
    // 结果分页
    handleCurrentChange_toatl (val) {
      // 结果列表
      let params3 = {
        basePageParam: {
          condition: {
            keyword: null,
            runResultTableUuid: this.status_data[this.date_index].runResultTableUuid,
            runTaskRelUuid: this.status_data[this.date_index].runTaskRelUuid,
            runTaskRelUuid: this.status_data[this.date_index].paramTaskUuid,
            resultTableName: this.status_data[this.date_index].resultTableName,//- 实际表名
            resultShowName: this.status_data[this.date_index].resultShowName,
            tableType: this.status_data[this.date_index].tableType,//  主副表标识, 主表 = 1、副表1 = 2、副表2 = 3···
            dataCount: 1
          },
          pageNo: val, //当前页数
          pageSize: 10 //分页数量
        },
        filterSql: "undefined",
      }
      this.data_tab_list(params3)// 结果列表
    },

    // 问题数==============================================
    probleNum_click (id, name) {
      this.problemsDialogVisible = true;//显示问题数弹窗
      this.auditTaskUuid = id
      this.wt_title = name
      let params = {
        condition: {
          auditTaskUuid: this.auditTaskUuid,
        },
        pageNo: this.probleNum.pageNo,
        pageSize: this.probleNum.pageSize,
      };
      this.task_problems_data(params);//问题数列表

    },
    // 问题数列表
    task_problems_data (params) {
      task_problems_list(params).then(resp => {
        this.probleNum_data = resp.data
        this.probleNum_list = resp.data.records
      })
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
    // 新增
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
      this.save_zj_query.belongSpcial = val
    },
    // 专题select
    zhuanti (params) {
      task_problems_loadcascader(params).then(resp => {
        this.zt_slect = resp.data
      })
    },
    // 专题 change
    changeHeader_zj_zt (val) {
      this.save_zj_query.belongField = val
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
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    // 保存接口
    add_task_problems_save (problemList) {
      task_problems_save(problemList).then(resp => {
        console.log(resp);
        if (resp.code == 0) {
          this.$message({
            message: "新增成功",
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
        console.log(resp);
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
    quote_knowledge () {
      console.log('引用知识库');
    },


    // 设置参数
    setParameters (data) {
      // this.all_setting();// 全部参数
      this.modelId = data.modelId;
      this.auditTaskUuid = data.auditTaskUuid;
      this.auditModelUuid = data.paramTaskUuid;
      let modelUuids = [this.modelId];
      task_findModelList(modelUuids).then(resp => {
        console.log(resp.data);
        if (resp.code == 0) {
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
      // console.log(this.$refs.paramDrawRefNew.paramInfoArr)
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
      this.run(runTaskRel);//运行
    },

    // 运行
    run (runTaskRel) {
      Task_run(runTaskRel).then(resp => {
        console.log(resp.data);
        this.runTaskRelUuid = resp.data;//参数任务id
        if (resp.code == 0) {
          this.$message({
            message: "运行成功,请等待执行完成进行手动刷新",
            type: "success",
          });
          this.setParametersDialogVisible = false;//关闭设置参数

          // 获取时间
          // let yy = new Date().getFullYear();
          // let mm = new Date().getMonth() + 1;
          // let dd = new Date().getDate();
          // let hh = new Date().getHours();
          // let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
          // let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
          // this.systemTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;

          this.systemTime = new Date()
          let params2 = {
            // auditTask: {
            // paramTaskContent:,
            auditTaskUuid: this.auditTaskUuid,//当前对象id
            // auditTaskUuid: "9903ce3a78c00744b57a30a759e79808",
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
        console.log(resp.data);
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
              taskName: this.params.taskName,
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
        console.log(resp);
      })
    },


    // 核实
    task_verify () {
      if (this.multipleSelection_data_list.length == 0) {
        this.$message.info("请选择一条进行数据核实");
        return false
      }
      this.dialogVisible_data_verify = true;//显示核实结果

    },
    // 是否问题 change
    isProbleam_change (val) {
      this.verify.isProbleam = val
    },
    // 核实文件上传
    handleChange (file, fileList) {
      // this.fileList = fileList.slice(-3);
    },

    // 核实保存 
    verify_save () {
      var arr = this.multipleSelection_data_list.map(function (item, index) {
        return item.resultDetailId;
      }).join(",");
      let resultDetailProjectRelDto = {
        handleIdea: this.verify.handleIdea,//核实信息
        isProbleam: this.verify.isProbleam, //是否问题（0：否 1：是 ）
        resultDetailIds: arr,//核实明细结果id （多个）
      };
      // 核实保存
      task_data_verify(resultDetailProjectRelDto).then(resp => {
        console.log(resp);
        if (resp.code == 0) {
          this.$message({
            message: "核实成功",
            type: "success",
          });
          this.dialogVisible_data_verify = false;//关闭核实  弹窗
        } else {
          this.$message({
            message: resp.msg,
            type: "error",
          });
        }
      })
    },

    //下载
    download () {

    },
    // 模型列表 获取责任人 
    changeHeader (val) {
      this.select_list.find((item) => {
        if (item.peopleTable.peopleName === val.peopleName) {//筛选出匹配数据
          let peopleTableUuid = item.peopleTable.peopleTableUuid.replace('{', '').replace('}', '').trim();
          this.save_zj_query.peopleTableUuid = peopleTableUuid;
          console.log(peopleTableUuid);
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
              taskName: this.params.taskName,
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
      console.log(val);
      this.save_zj_query.peopleTableUuid = val;

      // this.select_list.find((item) => {
      //   if (item.peopleTable.peopleName === val) {//筛选出匹配数据
      //     let peopleTableUuid = item.peopleTable.peopleTableUuid.replace('{', '').replace('}', '').trim();
      //     this.save_zj_query.peopleTableUuid = peopleTableUuid;
      //     console.log(this.save_zj_query.peopleTableUuid);
      //   }
      // })
      for (let i = 0; i < this.select_list.length; i++) {
        if (val == this.select_list[i].peopleTableUuid) {
          this.save_zj_query.peopleName = this.select_list[i].peopleName;
        }
      }



    },



    // 模型/自建 任务--删除
    delete_model (ids) {

      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            ids: ids
          }
          task_remove(params).then(resp => {
            console.log(resp);
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
                  taskName: this.params.taskName,
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
        })
        .catch(() => { });




    },

    //  关闭清空  
    clearTopic () {
      console.log("关闭");
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
          taskName: this.params.taskName,
          // taskType: 2//自建任务列表
        }
      }
      this.list_data(params);
    },

  },

};
</script>

<style scoped>
@import "../../../assets/styles/css/lhg.css";
.sjzl {
  display: flex;
}
.task_type >>> .el-table th.el-table__cell > .cell,
.task_type >>> .el-table td.el-table__cell div {
  text-align: center;
}

/* 当前选项 */
.active_tab {
  background: #1371cc !important;
}
.task_type >>> .el-table {
  min-height: 500px;
}
.titleMes {
  margin: 0;
  padding: 10px 0 0;
  box-sizing: border-box;
}
.sjzl >>> .el-button {
  background: none;
  border: none;
}
.sjzl >>> .el-table__header {
  border-top: none !important;
}
.sjzl .conter {
  width: 100%;
  float: left;
}

/* 内容  按钮 */
/* .sjzl >>> .el-button--primary {
  background-color: #42d7a5 !important;
  border: none;
} */
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
  width: 180px;
  display: flex;
  float: right;
}
.search >>> .search_icon {
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
}
.sjzl >>> .el-dialog__footer {
  text-align: center !important;
}
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
  padding-bottom: 33px;
  box-sizing: border-box;
}
.dlag_conter3 >>> .el-form-item__content {
  display: flex;
  margin-top: 20px;
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
  margin-top: 20px;
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
.new >>> .el-upload-dragger:focus {
  border: 1px dashed red;
}
</style>
