<template>
  <div class="sjzl anmition_show">
    <div class="conter">
      <div class="projectTab">
        <!-- tab -->
        <el-card>

          <el-row :gutter="24"
                  class="titleMes">

            <!-- 自建任务 / 模型任务 -->
            <el-col :span="1.5">
              <el-button type="primary"
                         :class="task_type == 0 ? 'active_tab':''"
                         @click="on_Task(0)">模型任务</el-button>
              <el-button type="primary"
                         :class="task_type == 1 ? 'active_tab':''"
                         @click="on_Task(1)">自建任务</el-button>

            </el-col>
            <!-- 自建任务 /  模型任务 end-->

            <!-- 模型引用 -->
            <el-col :span="1.5"
                    v-if="task_type == 0">
              <el-button type="primary"
                         @click="new_add_model()">选择模型</el-button>
            </el-col>

            <!-- 自建新增 -->
            <el-col :span="1.5"
                    v-if="task_type == 1">
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
                         v-if="task_type == 0"
                         @click="search_list(1)">筛选</el-button>

              <el-button type="primary"
                         v-if="task_type == 1"
                         @click="search_list(2)">筛选</el-button>
            </div>
          </el-row>
        </el-card>

        <!-- tab end-->

        <!-- 模型任务 -->
        <div class="task_type"
             v-if="task_type == 0"
             :class="task_type == 0 ? 'anmition_show' : ''">
          <!-- 表单 -->
          <el-table :data="tableData_list"
                    v-loading="loading"
                    style="width: 100%">

            <el-table-column type="index"
                             label="序号"
                             width="50">
            </el-table-column>
            <!-- 模型名称 -->
            <el-table-column prop="auditModelName"
                             label="模型名称">
            </el-table-column>
            <!-- <el-table-column prop="auditModelCategory"
                             label="模型分类"> -->
            <!-- <template slot-scope="auditModelCategory">
                {{
                  scope.row.type == 0
                    ? "个人"
                    : scope.row.type == 1
                    ? "企业"
                    : scope.row.type == 2
                    ? "财务"
                    : "其他"
                }}
              </template> -->
            <!-- </el-table-column> -->

            <!-- 专题和领域 -->
            <el-table-column prop="belongSpcial"
                             label="专题">
              <!-- <template slot-scope="scope">
                <el-button @click="data_num_click(scope.row)"
                           type="text"
                           style="color: #1371cc"
                           size="small">
                  {{ scope.row.belongSpcial }}
                </el-button>
              </template> -->
            </el-table-column>

            <!-- 领域 -->
            <el-table-column prop="belongField"
                             label="领域">
              <!-- <template slot-scope="scope">
                <el-button @click="data_num_click(scope.row)"
                           type="text"
                           style="color: #1371cc"
                           size="small">
                  {{ scope.row.belongField }}
                </el-button>
              </template> -->
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
            <!-- 问题数 -->
            <el-table-column prop="problemsNumber"
                             label="问题数">
              <template slot-scope="scope">
                <el-button @click="probleNum()"
                           type="text"
                           style="color: #1371cc"
                           size="small">
                  {{ scope.row.problemsNumber }}
                </el-button>
              </template>
            </el-table-column>
            <!-- 责任人 -->
            <el-table-column prop="peopleName"
                             label="责任人 ">
              <template slot-scope="scope">
                <el-select v-model="scope.row.peopleName"
                           @change="changeHeader(scope.row,1)">
                  <el-option v-for="item in select_list"
                             :key="item.peopleTable.peopleTableUuid"
                             :label="item.peopleTable.peopleName"
                             :value="item.peopleTable.peopleName">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <!-- 运行状态 -->
            <el-table-column prop="runStatus"
                             label="运行状态">
              <!-- <template slot-scope="scope">
                {{
                  scope.row.ing == 0
                    ? "未开始"
                    : scope.row.ing == 1
                    ? "已完成"
                    : scope.row.ing == 2
                    ? "执行中"
                    : "待开始"
                }}
              </template> -->
            </el-table-column>
            <!-- 运行开始时间 -->
            <el-table-column prop="taskStartTime"
                             label="运行开始时间">
              <template slot-scope="scope">
                <p>{{scope.row.taskStartTime |filtedate}}</p>
              </template>
            </el-table-column>

            <!-- 运行结束时间 -->
            <el-table-column prop="taskFinishTime"
                             label="运行结束时间">
              <template slot-scope="scope">
                <p>{{scope.row.taskFinishTime |filtedate}}</p>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column prop="edit"
                             label="操作">
              <template slot-scope="scope">
                <el-button @click.native.prevent="setParameters()"
                           type="text"
                           style="color: #1371cc"
                           size="small">
                  <!-- {{scope.row.ing == 0? "未开始"
                : scope.row.ing == 1? "设置参数"
                : scope.row.ing == 2 ? "执行中"
                : "待开始"}} -->
                  设置
                </el-button>

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
                           :current-page="this.tableData.current"
                           @current-change="handleCurrentChange_model"
                           :page-size="this.tableData.size"
                           :total="this.tableData.total"></el-pagination>

          </div>
          <!-- 分页 end-->
        </div>
        <!-- 模型任务 end-->

        <!-- 自建任务 -->
        <div class="task_type"
             v-if="task_type == 1"
             :class="task_type == 1 ? 'anmition_show' : ''">
          <!-- 表单 -->
          <el-table :data="tableData_list"
                    v-loading="loading"
                    style="width: 100%">

            <el-table-column type="index"
                             label="序号"
                             width="50">
            </el-table-column>
            <el-table-column prop="taskName"
                             label="任务名称"> </el-table-column>
            <el-table-column prop="taskDescription"
                             label="任务描述">
            </el-table-column>
            <el-table-column prop="task_text"
                             label="问题描述">
            </el-table-column>
            <el-table-column prop="basis"
                             label="依据"> </el-table-column>
            <el-table-column prop="peopleName"
                             label="责任人 ">
              <template slot-scope="scope">
                <el-select v-model="scope.row.peopleName"
                           @change="changeHeader(scope.row,2)">
                  <el-option v-for="item in select_list"
                             :key="item.peopleTable.peopleTableUuid"
                             :label="item.peopleTable.peopleName"
                             :value="item.peopleTable.peopleName">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column prop="address"
                             label="附件"
                             width="90">
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
                <span>2</span>
              </div>
            </el-table-column>

            <el-table-column label="操作">
              <template scope="scope">
                <!-- 编辑 -->
                <el-button @click="edit_data(scope.row)"
                           type="text"
                           style="color:#1371CC"
                           size="small">
                  编辑
                </el-button>
                <el-button @click="delete_zj(scope.row.auditTaskUuid)"
                           type="text"
                           style="color:red"
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
                           :hide-on-single-page="true"
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
          <ul class="status_data">
            <li>
              <el-button type="primary"
                         @click="quote()">结果1</el-button>
            </li>
            <li>
              <el-button type="primary"
                         @click="quote()">结果1</el-button>
            </li>
            <li>
              <el-button type="primary"
                         @click="quote()">结果1</el-button>
            </li>
          </ul>
        </el-row>
        <div class="cxjg"
             style="margin: 20px 0; display: flex">
          <el-col> 模型线索结果（XXX模型） </el-col>
          <el-col style="display: contents">
            <el-button type="primary"
                       @click="quote()">核实</el-button>
            <el-button type="primary"
                       @click="quote()">下载</el-button>
            <el-button type="primary"
                       @click="dialogVisible_data_num == false">返回</el-button>
          </el-col>
        </div>
        <!-- 表单 -->
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="date"
                           label="序号"> </el-table-column>
          <el-table-column prop="name"
                           label="合同名称"> </el-table-column>
          <el-table-column prop="type"
                           label="合同标题">
            <template slot-scope="scope">
              {{
                scope.row.type == 0
                  ? "个人"
                  : scope.row.type == 1
                  ? "企业"
                  : scope.row.type == 2
                  ? "财务"
                  : "其他"
              }}
            </template>
          </el-table-column>
          <el-table-column prop="data_num"
                           label="地区编码">
            <template slot-scope="scope">
              <el-button @click.native.prevent="data_num_click(scope.$index, tableData)"
                         type="text"
                         style="color: #1371cc"
                         size="small">
                {{ scope.row.data_num }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="wt_num"
                           label="签约厂家">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, tableData)"
                         type="text"
                         style="color: #1371cc"
                         size="small">
                {{ scope.row.wt_num }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="city"
                           label="盖章时间">
            <el-select v-model="value_select">
              <el-option v-for="item in sensitiveOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-table-column>

          <el-table-column prop="ing"
                           label="合同起草时间">
            <template slot-scope="scope">
              {{
                scope.row.ing == 0
                  ? "未开始"
                  : scope.row.ing == 1
                  ? "已完成"
                  : scope.row.ing == 2
                  ? "执行中"
                  : "待开始"
              }}
            </template>
          </el-table-column>
          <el-table-column prop="start_time"
                           label="合同金额">
          </el-table-column>
          <el-table-column prop="end_time"
                           label="合同履行时间">
          </el-table-column>

          <el-table-column prop="edit"
                           label="合同履行结束时间"
                           width="100">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, tableData)"
                         type="text"
                         style="color: #1371cc"
                         size="small">
                设置参数
              </el-button>
            </template>
          </el-table-column>

          <el-table-column prop="edit"
                           label="滞后天数"
                           width="100">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, tableData)"
                         type="text"
                         style="color: #1371cc"
                         size="small">
                设置参数
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="edit"
                           label="是否问题"
                           width="100">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, tableData)"
                         type="text"
                         style="color: #1371cc"
                         size="small">
                设置参数
              </el-button>
            </template>
          </el-table-column>

          <el-table-column prop="edit"
                           label="核实人"
                           width="100">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, tableData)"
                         type="text"
                         style="color: #1371cc"
                         size="small">
                设置参数
              </el-button>
            </template>
          </el-table-column>

          <el-table-column prop="edit"
                           label="核实信息"
                           width="100">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, tableData)"
                         type="text"
                         style="color: #1371cc"
                         size="small">
                设置参数
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="edit"
                           label="附件"
                           width="100">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, tableData)"
                         type="text"
                         style="color: #1371cc"
                         size="small">
                设置参数
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表单 end-->

        <!-- 分页 -->
        <div class="page">
          <el-pagination background
                         layout="prev, pager, next"
                         :total="1000">
          </el-pagination>
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

    <!-- 模型任务 问题数 -->
    <el-dialog :visible.sync="problemsDialogVisible"
               width="60%">
      <el-row style="margin-top:3%;background:#F2F2F2;padding:15px">
        <el-col :span="18"
                class="tableTitle">xxx模型审计发现列表</el-col>
        <el-col :span="6">
          <el-button type="primary">增加</el-button>
          <el-button type="primary">修改</el-button>
          <el-button type="primary">删除</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData1"
                ref="multipleTable"
                tooltip-effect="dark"
                style="width: 100%;margin-bottom:2%">
        <el-table-column type="selection"
                         width="55"> </el-table-column>
        <el-table-column prop="name"
                         label="领域"> </el-table-column>
        <el-table-column prop="name1"
                         label="审计发现"> </el-table-column>
        <el-table-column prop="name2"
                         label="依据"> </el-table-column>
        <el-table-column prop="name3"
                         label="描述"> </el-table-column>
        <el-table-column prop="name4"
                         label="发现时间"> </el-table-column>
        <el-table-column prop="name5"
                         label="风险金额（万元）"> </el-table-column>
        <el-table-column prop="name6"
                         label="发现人"> </el-table-column>

      </el-table>
    </el-dialog>

    <!-- 模型任务设置参数 -->
    <el-dialog :visible.sync="setParametersDialogVisible"
               width="60%">
      <el-card class="setParameters"> 参数设置 </el-card>
      <el-card class="parameters">
        <i class="el-icon-s-grid"></i>
        请输入参数值
      </el-card>
      <el-card class="parametersTab">
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
      </el-card>
    </el-dialog>

    <!-- 模型任务 引用 -->
    <el-dialog title="模型列表"
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

      <!-- 分页 -->
      <div class="page">
        <el-pagination background
                       layout="prev, pager, next"
                       :current-page="this.model_data.current"
                       @current-change="handleCurrentChange_model_add"
                       :page-size="this.model_data.size"
                       :total="this.model_data.total"></el-pagination>
      </div>
      <!-- 分页 end-->

      <span slot="footer">
        <el-button size="small"
                   type="primary"
                   @click="query()">确 定</el-button>
        <el-button size="small"
                   @click="clearTopic(), (dialogVisible_quote = false)">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 自建任务新增 -->
    <el-dialog :title="title"
               :visible.sync="dialogVisible_zj"
               style="padding-bottom: 59px">
      <div class="dlag_conter">
        <!-- 任务名称 -->
        <el-form label-width="80px">
          <p style="padding-top: 10px;">任务名称：</p>
          <el-input v-model="save_zj_query.taskName"
                    placeholder="请输入任务新增"></el-input>
        </el-form>
        <!-- 责任人 -->
        <el-form label-width="80px">
          <p style="padding-top: 10px;">责任人：</p>
          <!-- <el-select v-model="save_zj_query.peopleName"
                     @change="changeHeader2">
            <el-option v-for="item in select_list"
                       :key="item.peopleTableUuid"
                       :label="item.peopleName"
                       :value="item.peopleName">
            </el-option>
          </el-select> -->
          <el-select v-model="save_zj_query.peopleName"
                     @change="changeHeader2">
            <el-option v-for="item in select_list"
                       :key="item.peopleTable.peopleTableUuid"
                       :label="item.peopleTable.peopleName"
                       :value="item.peopleTable.peopleName">
            </el-option>
          </el-select>

        </el-form>

        <!-- 任务描述 -->
        <el-form label-width="80px">
          <p style="padding-top: 10px;">任务描述：</p>
          <el-input v-model="save_zj_query.taskDescription"
                    placeholder="请输入任务描述"></el-input>
        </el-form>
        <!-- 上传附件 -->
        <el-form label-width="80px">
          <p style="padding-top: 10px;">上传附件：</p>
          <el-upload class="upload-demo"
                     style="width: 300px"
                     drag
                     action="https://jsonplaceholder.typicode.com/posts/"
                     multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              支持上传或者拖拽文件到这里<em>点击上传</em>
            </div>
            <div class="el-upload__text">支持.ZIP.DOC</div>
          </el-upload>
        </el-form>
      </div>

      <span slot="footer">
        <el-button size="small"
                   type="primary"
                   v-if="title=='新增'"
                   @click="save_zj(1)">确 定</el-button>
        <el-button size="small"
                   type="primary"
                   v-else
                   @click="save_zj(2)">确 定</el-button>

        <el-button size="small"
                   @click="clearTopic(), (dialogVisible_zj = false)">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { task_pageList, task_model_pageList, task_selectModel, task_selectTable, quoteModel, task_add, task_remove, task_update, task_details, task_select_people, task_setChargePeople } from
  '@SDMOBILE/api/shandong/task'
import { fmtDate } from '@SDMOBILE/model/time.js';

export default {
  components: {},
  data () {
    return {
      task_type: 0, //默认显示任务/自建任务
      tab: [{ name: "审计资料任务列表" }, { name: "已操作的资料列表" }], //任务切换
      dialogVisible_quote: false, //模型任务引用
      dialogVisible_zj: false, // 自建任务新增弹窗
      dialogVisible_data_num: false, //模型任务结果数
      setParametersDialogVisible: false, //模型任务设置参数
      problemsDialogVisible: false, //模型任务问题数

      // 提交数据单
      task: {
        search: "", // 筛选
        zrr_id: "", //责任人
      },
      // 责任人
      options: [
        {
          value_zrr: "",
          label: "张三22222",
        },


      ],
      value_zrr: "",


      tableData1: [
        {
          name: '个人',
          name1: '小金额',
          name2: '依据xxx法规xxx条',
          name3: '描述1',
          name4: '2021-02-22',
          name5: '55',
          name6: '小明'
        },
        {
          name: '个人',
          name1: '小金额',
          name2: '依据xxx法规xxx条',
          name3: '描述1',
          name4: '2021-02-22',
          name5: '55',
          name6: '小明'
        },
        {
          name: '个人',
          name1: '小金额',
          name2: '依据xxx法规xxx条',
          name3: '描述1',
          name4: '2021-02-22',
          name5: '55',
          name6: '小明'
        },
        {
          name: '个人',
          name1: '小金额',
          name2: '依据xxx法规xxx条',
          name3: '描述1',
          name4: '2021-02-22',
          name5: '55',
          name6: '小明'
        },
        {
          name: '个人',
          name1: '小金额',
          name2: '依据xxx法规xxx条',
          name3: '描述1',
          name4: '2021-02-22',
          name5: '55',
          name6: '小明'
        },
      ],
      tableData2: [
        {
          date: 1,
          name: "王小虎",
          task_name: "任务名称",
          task_text: "任务描述",
          basis: "依据", //basis
          zr_name: "责任人",
          zip: "1.zip",
        },
        {
          date: 2,
          name: "王小虎",
          task_name: "任务名称",
          task_text: "任务描述",
          basis: "依据", //basis
          zr_name: "责任人",
          zip: "1.zip",
        },
        {
          date: 3,
          name: "王小虎",
          task_name: "任务名称",
          task_text: "任务描述",
          basis: "依据", //basis
          zr_name: "责任人",
          zip: "1.zip",
        },
      ],


      // 项目id
      managementProjectUuid: '8351286cd70c3f41c92f59ed425a4659',//项目管理id


      // 新增任务
      add_task: {
        name: "", //名称
        textare: "", //描述
      },
      // 责任人
      add_options: [
        {
          value_zrr: "",
          label: "张三",
        },

        {
          value_zrr: "",
          label: "王五",
        },
      ],
      value_zrr: "",
      value_select: '',//select
      sensitiveOptions: [
        {
          value: "选项1",
          label: "老李",
        },
        {
          value: "选项2",
          label: "老王",
        },
        {
          value: "选项3",
          label: "吴老二",
        },

      ],

      loading: false,
      tableData: [],//模型列表
      tableData_list: [],//任务列表数据
      // 模型/自建人任务 列表
      params: {
        auditModelCategory: '',
        // managementProjectUuid: '3757f078afa6161474430894936de6ed',//项目管理id
        taskName: '',//模糊查询
        taskType: '1',//1:模型任务 2:自建任务
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
      },
      // 编辑数据
      edit_datails: [],

      title: '',//弹窗变量标题

      select_list: [],//责任人数据
      peopleName: '请选择',//责任人默认值
      auditTaskUuid: '',//当前点击的项目id


    }
  },
  computed: {},
  watch: {},

  created () {
    // 模型  自建任务列表
    let params = {
      pageNo: this.params.pageNo,
      pageSize: this.params.pageSize,
      condition: {
        auditModelCategory: this.params.auditModelCategory,
        managementProjectUuid: this.managementProjectUuid,
        taskName: this.params.taskName,
        taskType: this.params.taskType
      }
    }
    this.list_data(params);


    // 请求 责任人
    let params_people = {
      condition: {
        managementProjectUuid: this.managementProjectUuid,
      },
      pageNo: 1,
      pageSize: 3,
    }
    this.select_people(params_people)//请求责任人数据




  },
  mounted () { },
  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      // return fmtDate(t, 'yyyy-MM-dd hh:mm:ss');
      return fmtDate(t, 'yyyy-MM-dd');

    }
  },


  methods: {
    // 请求责任人 select数据
    select_people (params_people) {
      task_select_people(params_people).then(resp => {
        this.select_list = resp.data.records;
        // console.log(this.select_list);
      })
    },

    //tab 切换模型任务   自建任务
    on_Task (index) {
      this.task_type = index;
      if (this.task_type == 0) {
        this.loading = true
        this.params.pageNo = 1;
        this.params.taskName = ''//清空筛选
        // 模型列表
        let params = {
          pageNo: this.params.pageNo,
          pageSize: this.params.pageSize,
          condition: {
            auditModelCategory: this.params.auditModelCategory,
            managementProjectUuid: this.managementProjectUuid,
            taskName: this.params.taskName,
            taskType: 1
          }
        }
        this.list_data(params);

      } else if (this.task_type == 1) {
        this.loading = true
        this.params.pageNo = 1;
        this.params.taskName = ''//清空筛选
        // 自建列表
        let params = {
          pageNo: this.params.pageNo,
          pageSize: this.params.pageSize,
          condition: {
            auditModelCategory: this.params.auditModelCategory,
            managementProjectUuid: this.managementProjectUuid,
            taskName: this.params.taskName,
            taskType: 2
          }
        }
        this.list_data(params);
      }
    },
    // 新增模型  
    new_add_model () {

      //模型任务  选择模型
      this.dialogVisible_quote = true;
      // 模型新增
      let params2 = {
        pageNo: this.params2.pageNo,
        pageSize: this.params2.pageSize,
        condition: {
          modelName: this.params2.condition.modelName,
        }
      }
      this.add_model_list(params2)



    },
    // 选择模型列表
    add_model_list (params) {
      task_model_pageList(params).then(resp => {
        this.model_data = resp.data
        this.model_list = resp.data.records
      })
    },
    // 模型任务列表 自建任务 筛选
    search_list (index) {
      let params = {
        pageNo: this.params.pageNo,
        pageSize: this.params.pageSize,
        condition: {
          auditModelCategory: this.params.auditModelCategory,
          managementProjectUuid: this.managementProjectUuid,
          taskName: this.params.taskName,
          taskType: index
        }
      };
      // 模型列表 自建任务
      this.list_data(params);
    },


    // 模型任务列表  
    list_data (params) {
      this.loading = true
      task_pageList(params).then(resp => {
        this.tableData = resp.data;
        this.tableData_list = resp.data.records
        this.loading = false
        // console.log(this.tableData);
      })
    },


    // 结果数
    data_num_click (id) {
      console.log(id);
      this.dialogVisible_data_num = true;
      this.data_tab();//结果分类tab
    },

    // 问题数
    probleNum () {
      this.problemsDialogVisible = true;
    },
    // 设置参数
    setParameters () {
      this.setParametersDialogVisible = true;
    },

    // 查询 选择模型列表  / 自建模型
    quote_list () {
      // console.log(this.params2.condition.modelName);
      let params = {
        pageNo: this.params2.pageNo,
        pageSize: this.params2.pageSize,
        condition: {
          modelName: this.params2.condition.modelName,
        }
      }
      this.add_model_list(params)
    },


    // 选择模型列表 确认引用
    quote () {
      if (this.multipleSelection.length == 0) {
        this.$message.info("请选择至少一条数据进行引用！");
        return false;
      }


      let array1 = [];//数组1
      this.multipleSelection.forEach((item) => {
        array1.push(item);
      });

      let params = {
        auditModelList: array1,
        projectId: "3757f078afa6161474430894936de6ed",
      };

      // this.quoteModel_btn(params);//确认引用
      //做比较的两个数组
      let array2 = this.tableData_list;//数组2
      let array3 = [];//储存合并的值
      for (var s in array1) {
        for (var x in array2) {
          if (array1[s].modelName == array2[x].auditModelName) {

            array3.push(array1[s].modelName);
          }
        }
      }
      console.log(array3); // 1, 3
      if (array3.length !== 0) {
        this.$message.info("请不要重复选择引入的模型");
        return false
      } else {
        this.quoteModel_btn(params);//确认引用
      }
    },
    // 确认引用方法
    quoteModel_btn (params) {
      quoteModel(params).then(resp => {

        // console.log(resp);
        if (resp.code == 0) {
          this.$message({
            message: '引用成功',
            type: 'success'
          });
          this.dialogVisible_quote = false;//关闭引用的弹窗

          // 模型列表
          let params = {
            pageNo: this.params.pageNo,
            pageSize: this.params.pageSize,
            condition: {
              auditModelCategory: this.params.auditModelCategory,
              managementProjectUuid: this.managementProjectUuid,
              taskName: this.params.taskName,
              taskType: 1
            }
          }
          this.list_data(params);//刷新外层模型列表
        } else {
          this.$message({
            message: resp.data.msg,
            type: 'error'
          });
        }
      })
    },
    // 模型 任务--删除
    delete_model (ids) {
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
              taskType: 1
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
    },



    // 模型列表 获取责任人 
    changeHeader (val, index) {
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
          if (index == 1) {
            // 刷新模型列表
            let params = {
              pageNo: this.params.pageNo,
              pageSize: this.params.pageSize,
              condition: {
                auditModelCategory: this.params.auditModelCategory,
                managementProjectUuid: this.managementProjectUuid,
                taskName: this.params.taskName,
                taskType: 1
              }
            }
            this.list_data(params);
          } else {
            // 自建人物
            // 刷新自建列表
            let params = {
              pageNo: this.params.pageNo,
              pageSize: this.params.pageSize,
              condition: {
                auditModelCategory: this.params.auditModelCategory,
                managementProjectUuid: this.managementProjectUuid,
                taskName: this.params.taskName,
                taskType: 2,
              }
            }
            this.list_data(params);
          }
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
      this.select_list.find((item) => {
        if (item.peopleTable.peopleName === val) {//筛选出匹配数据
          let peopleTableUuid = item.peopleTable.peopleTableUuid.replace('{', '').replace('}', '').trim();
          this.save_zj_query.peopleTableUuid = peopleTableUuid;
          console.log(this.save_zj_query.peopleTableUuid);
        }
      })
    },
    // 模型任务===========

    // 新增弹窗
    new_add_zj (index) {
      // 1:新增  2:编辑
      //自建任务 新增 
      this.dialogVisible_zj = true;
      this.title = '新增';
      this.save_zj_query = [];
    },

    // 新增自建任务 保存
    save_zj (index) {
      // 1:新增  2:编辑
      if (index == 1) {
        this.title = '新增';
        let params1 = {
          managementProjectUuid: this.managementProjectUuid,//项目id
          taskDescription: this.save_zj_query.taskDescription,//描述
          taskName: this.save_zj_query.taskName,//名称
          taskType: 2,//任务类型
          enclosure: this.save_zj_query.enclosure,//附件
          peopleName: this.save_zj_query.peopleName,//责任人
          peopleTableUuid: this.save_zj_query.peopleTableUuid,//责任人id
        }
        console.log(params1);
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
                taskType: 2,

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
        let params2 = {
          taskType: 2,//任务类型
          auditTaskUuid: this.save_zj_query.auditTaskUuid,//项目id
          taskDescription: this.save_zj_query.taskDescription,
          taskName: this.save_zj_query.taskName,
          taskType: this.save_zj_query.taskType,//任务类型
          enclosure: this.save_zj_query.enclosure,//附件
          peopleName: this.save_zj_query.peopleName,//责任人
          peopleTableUuid: this.save_zj_query.peopleTableUuid,//责任人id
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
                taskType: 2,

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

    // 自建 任务--删除
    delete_zj (ids) {
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
              taskType: 2
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
    },





    // 结果弹窗 结果分类tab
    // data_tab (params) {
    //   task_selectModel(params).then(resp => {
    //     this.loading = true
    //     // this.tableData = resp.data;
    //     // this.tableData_list = resp.data.records
    //     this.loading = false
    //     console.log(resp.data);
    //   })
    // },




    // 自建任务===========

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
          taskType: 2//自建任务列表
        }
      }
      this.list_data(params);
    },


    deleteRow (index, rows) {
      rows.splice(index, 1);
    },

    // 模型列表分页
    handleCurrentChange_model (val) {
      this.loading = true
      // 模型列表
      let params = {
        pageNo: val,
        pageSize: this.params.pageSize,
        condition: {
          auditModelCategory: this.params.auditModelCategory,
          managementProjectUuid: this.managementProjectUuid,
          taskName: this.params.taskName,
          taskType: 1
        }
      }
      this.list_data(params);

    },
    // 选择模型 新增 列表分页
    handleCurrentChange_model_add (val) {
      let params = {
        pageNo: val,
        pageSize: this.params2.pageSize,
        condition: {
          modelName: this.params2.condition.modelName,
        }
      }
      this.add_model_list(params)
    },
    //选择模型列表分页  全选
    handleSelectionChange (val) {
      this.multipleSelection = val;
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

.update {
  display: flex;
  align-items: center;
  justify-content: center;
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
.dlag_conter >>> .el-form-item {
  margin-bottom: 20px !important;
  display: flex;
}
.dlag_conter >>> .el-form-item__content {
  margin-left: 10px !important;
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
</style>
