<template>
  <div class="sjzl">
    <!-- tab 切换 -->
    <el-tabs v-model="activeName"
             @tab-click="handleClick">

      <!-- 未完成 -->
      <el-tab-pane label="审计资料任务列表"
                   name="0">
        <div class="projectTab anmition_show">
          <!-- 新增 -->
          <el-row class="titleMes">
            <el-col :span="1.5">
              <el-button type="primary"
                         @click="add_data_task()">新增</el-button>
            </el-col>
          </el-row>
          <el-table :data="tableData_list"
                    v-loading="loading"
                    style="width: 100%;">
            <!-- <el-table-column type="selection"
                             width="55">
            </el-table-column> -->
            <el-table-column type="index"
                             label="序号"
                             width="50">
            </el-table-column>
            <!-- <el-table-column prop="dataTaskNumber"
                             label="流水单号"> -->
            </el-table-column>
            <el-table-column prop="title"
                             label="标题">
            </el-table-column>
            <el-table-column prop="launchPeople"
                             label="发起人">
            </el-table-column>
            <el-table-column prop="addTime"
                             label="发起日期">

              <template slot-scope="scope">
                {{  scope.row.addTime |filtedate }}
              </template>

            </el-table-column>
            <el-table-column prop="status"
                             label="状态">
              <template slot-scope="scope">
                {{
                  scope.row.status == 0
                    ? "未开始"
                    : scope.row.status == 1
                    ? "已完成":"执行中"
                }}
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <div v-if=" scope.row.status == 0">
                  <el-button @click="edit_common(scope.row)"
                             type="text"
                             style="color:#1371CC"
                             size="small">
                    编辑
                  </el-button>
                  <el-button @click="list_push(scope.row)"
                             type="text"
                             style="color:#1371CC"
                             size="small">
                    下发
                  </el-button>
                  <el-button @click="operation(scope.row)"
                             type="text"
                             style="color:#1371CC"
                             size="small">
                    操作
                  </el-button>
                  <el-button @click="deleteRow(scope.row)"
                             type="text"
                             style="color:red"
                             size="small">
                    删除
                  </el-button>
                </div>

                <div v-if=" scope.row.status == 1">
                  <el-button @click="edit_data(scope.row,tableData)"
                             type="text"
                             style="color:#1371CC"
                             size="small">
                    审批
                  </el-button>
                  <el-button @click="deleteRow(scope.row)"
                             type="text"
                             style="color:red"
                             size="small">
                    删除
                  </el-button>
                </div>

              </template>

            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="page">
          <el-pagination background
                         :hide-on-single-page="true"
                         layout="prev, pager, next"
                         :page-sizes="[2, 4, 6, 8]"
                         :current-page="this.tableData.current"
                         @current-change="handleCurrentChange_model"
                         :page-size="this.tableData.size"
                         :total="this.tableData.total"></el-pagination>
        </div>
        <!-- 分页 end-->
      </el-tab-pane>

      <!-- 已完成 -->
      <el-tab-pane label="已操作的资料列表"
                   name="1">
        <div class="projectTab anmition_show">

          <el-table :data="tableData_list2"
                    v-loading="loading"
                    style="width: 100%;">
            <!-- <el-table-column prop="dataTaskNumber"
                             label="流水单号">
            </el-table-column> -->
            <el-table-column type="index"
                             label="序号"
                             width="50">
            </el-table-column>
            <el-table-column prop="createTime"
                             label="反馈日期">

              <template slot-scope="scope">
                <span>{{scope.row.createTime|filtedate}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dataNumber"
                             label="编号">
            </el-table-column>
            <el-table-column prop="secondLevelDataNumber"
                             label="二级编号">
            </el-table-column>
            <el-table-column prop="dataName"
                             label="资料名称">
            </el-table-column>
            <el-table-column prop="department"
                             label="部门">
            </el-table-column>
            <el-table-column prop="remarks"
                             label="备注">
            </el-table-column>
            <el-table-column prop=""
                             label=附件>
              <template slot-scope="scope">
                <div class="update">
                  <div class="update_icon">
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
                  </div>
                  <span>{{scope.row.enclosureCount}}</span>
                </div>
              </template>
            </el-table-column>

          </el-table>
        </div>

        <!-- 分页 -->
        <div class="page">
          <el-pagination background
                         :hide-on-single-page="true"
                         layout="prev, pager, next"
                         :page-sizes="[2, 4, 6, 8]"
                         :current-page="this.tableData2.current"
                         @current-change="handleCurrentChange_zj"
                         :page-size="this.tableData2.size"
                         :total="this.tableData2.total"></el-pagination>
        </div>
        <!-- 分页 end-->
      </el-tab-pane>
    </el-tabs>

    <!-- 新增资料 编辑资料-->
    <el-dialog :title="title"
               width="80%"
               :visible.sync="dialogVisible"
               style="padding-bottom: 59px; ">
      <div class="dlag_conter">
        <el-form ref="add_form"
                 :inline="false"
                 :model="add_form"
                 label-width="80px">
          <!-- 标题 -->
          <el-form-item label="标题"
                        prop="title"
                        :rules="{
              required: true,
              message: '此项不能为空',
              trigger: 'blur',
            }">
            <el-input v-model="add_form.title"></el-input>
          </el-form-item>
          <!-- 发起人 -->
          <el-form-item label="发起人"
                        prop="name"
                        :rules="{
              required: true,
              message: '此项不能为空',
              trigger: 'blur',
            }">
            <el-input v-model="add_form.name"></el-input>
          </el-form-item>
        </el-form>
        <el-form label-width="80px">
          <div style="display:flex;align-items: center;padding:10px 0;box-sizing: border-box;">
            <p>获取资料清单：</p>
            <el-button type="primary"
                       @click="add_data_click()">添加资料</el-button>
          </div>
        </el-form>

        <!-- 模版列表 新增-->
        <div v-if="title =='新增资料任务' ">
          <el-form label-width="80px">
            <el-table ref="multipleTable"
                      row-key="id"
                      :data="task_list_records"
                      tooltip-effect="dark"
                      v-loading="loading"
                      style="width: 100%"
                      @selection-change="handleSelectionChange_query">
              <el-table-column type="selection"
                               width="55">
              </el-table-column>
              <el-table-column prop="dataCategory"
                               label="类别">
                <!-- <template slot-scope="scope">{{ scope.row.dataCategory }}</template> -->
              </el-table-column>
              <el-table-column prop="dataNumber"
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
        </div>

        <!-- 模版列表 编辑 -->
        <div v-else>
          <el-form label-width="80px">
            <el-table ref="multipleTable"
                      row-key="id"
                      :data="task_list_records_details"
                      tooltip-effect="dark"
                      v-loading="loading"
                      style="width: 100%"
                      @selection-change="handleSelectionChange_query">
              <el-table-column type="selection"
                               width="55">
              </el-table-column>
              <el-table-column prop="dataCategory"
                               label="类别">
                <!-- <template slot-scope="scope">{{ scope.row.dataCategory }}</template> -->
              </el-table-column>
              <el-table-column prop="dataNumber"
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
        </div>

        <!-- 分页 -->
        <div class="page">

          <el-pagination background
                         layout="prev, pager, next"
                         :current-page="this.task_list.current"
                         @current-change="handleCurrentChange_csh"
                         :page-size="this.task_list.size"
                         :total="this.task_list.total"></el-pagination>

        </div>
        <!-- 分页 end-->
      </div>
      <span slot="footer">
        <el-button size="small"
                   @click="close()">取 消</el-button>
        <!-- 新增保存 -->
        <el-button size="small"
                   type="primary"
                   v-if="title=='新增资料任务'"
                   @click="query_add_form(1)">新增保存</el-button>
        <!-- 编辑保存 -->
        <el-button size="small"
                   type="primary"
                   v-else
                   @click="query_add_form(2)">编辑保存</el-button>
        <!-- 新增直接下发 -->
        <el-button size="small"
                   type="primary"
                   @click="add_push_save()">下发</el-button>
      </span>
    </el-dialog>

    <!-- 添加资料 -->
    <el-dialog title="添加资料"
               :visible.sync="dialogVisible2"
               style="padding-bottom: 59px; ">
      <div class="dlag_conter2">
        <el-form label-width="80px"
                 :rules="rules"
                 :model="add_data"
                 ref="add_data">

          <div class="son">
            <el-form-item label-width="80px"
                          prop="dataCategory">
              <p>类别：</p>
              <el-select v-model="add_data.dataCategory"
                         @change="PrjType_change"
                         placeholder="请选择类别">
                <el-option v-for="item in sensitiveOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label-width="80px"
                          prop="dataName">
              <p>资料名称：</p>
              <el-input v-model="add_data.dataName"
                        placeholder="请输入资料名称"></el-input>
            </el-form-item>
          </div>

          <div class="son">

            <el-form-item label-width="80px"
                          prop="dataNumber">
              <p>编号 ：</p>
              <el-input v-model="add_data.dataNumber"
                        placeholder="请输入编号"></el-input>
            </el-form-item>
            <el-form-item label-width="80px"
                          prop="secondLevelDataNumber">
              <p>二级编号：</p>
              <el-input v-model="add_data.secondLevelDataNumber"
                        placeholder="请输入二级编号"></el-input>
            </el-form-item>
          </div>
          <div class="son">
            <el-form-item label-width="80px"
                          prop="department">
              <p>部门：</p>
              <el-select v-model="add_data.department"
                         @change="Department_change"
                         placeholder="请选择资料部门">
                <el-option v-for="item in sensitiveDepartment"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="80px"
                          prop="source">
              <p>来源：</p>
              <el-select v-model="add_data.source"
                         @change="DataSource_change"
                         placeholder="请选择资料名称">
                <el-option v-for="item in sensitiveDataSource"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="son">

            <el-form-item label-width="80px"
                          prop="addPeople">
              <p>添加人：</p>

              <div class="addPeople">{{add_data.addPeople}}</div>
            </el-form-item>

            <el-form-item label-width="80px"
                          prop="addTime">
              <p>添加日期：</p>
              <div class="block">
                <el-date-picker v-model="add_data.addTime"
                                type="date"
                                placeholder="选择日期">
                </el-date-picker>
              </div>
            </el-form-item>
          </div>
          <div class="son cd">

            <el-form-item label-width="80px"
                          prop="status">
              <p style="padding:0">是否沉淀为常规需求资料：</p>
              <el-radio-group v-model="add_data.status"
                              @change="changeHandler">
                <el-radio label="1">否</el-radio>
                <el-radio label="2">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <div class="son">

            <el-form-item label-width="80px"
                          prop="remarks">
              <p>备注：</p>
              <el-input type="textarea"
                        v-model="add_data.remarks"
                        placeholder=""></el-input>
            </el-form-item>
          </div>

        </el-form>
      </div>
      <span slot="footer">
        <el-button size="small"
                   @click="dialogVisible2 = false">取 消</el-button>
        <el-button size="small"
                   type="primary"
                   @click="save_data_btn('add_data')">确定</el-button>

      </span>
    </el-dialog>

    <!-- 操作 -->
    <el-dialog title="操作"
               width="90%"
               :visible.sync="dialogVisibl_operation"
               style="padding-bottom: 59px; ">
      <div class="dlag_conter2">

        <div class="tt">资料列表</div>

        <div class="operation_header">
          <div>
            <p>资料名称：</p>
            <el-input v-model="operation_query.dataName"
                      placeholder="请输入资料名称"></el-input>
            <p>资料类型：</p>
            <el-select v-model="operation_query.dataCategory"
                       style="width:180px"
                       clearable
                       placeholder="请选择类别">
              <el-option v-for="item in sensitiveOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>

          </div>
          <el-button type="primary"
                     @click="search_operation_list()">查询</el-button>
        </div>

        <el-table ref="multipleTable"
                  :data="operation_tableData"
                  tooltip-effect="dark"
                  v-loading="loading"
                  style="width: 100%"
                  @selection-change="handleSelectionChange_operation">
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column label="类型"
                           prop="dataCategory"
                           width="120">
            <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
          </el-table-column>
          <el-table-column prop="dataNumber"
                           label="编号"
                           width="120">
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
          <el-table-column prop="createTime"
                           label="提供时间"
                           show-overflow-tooltip>
          </el-table-column>
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
          <el-table-column prop="enclosureCount"
                           label="附件"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="address"
                           label="操作">
            <template slot-scope="scope">
              <el-button size="small"
                         type="primary"
                         @click="look_record(scope.row)">查看</el-button>
              <el-button size="small"
                         type="primary"
                         @click="post(scope.row)">提交</el-button>
            </template>
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <div class="page">
          <el-pagination background
                         :hide-on-single-page="true"
                         layout="prev, pager, next"
                         :page-sizes="[2, 4, 6, 8]"
                         :current-page="this.operation_table.current"
                         @current-change="handleCurrentChange_list_data"
                         :page-size="this.operation_table.size"
                         :total="this.operation_table.total"></el-pagination>
        </div>
        <!-- 分页 end-->

        <div class="tt"
             v-if="record_status==true">操作记录</div>

        <!-- 操作记录 -->
        <div v-if="record_status==true">
          <el-table :data="record"
                    style="width: 100%">
            <el-table-column prop="op_operate"
                             label="动作"
                             width="180">
            </el-table-column>
            <el-table-column prop="op_user_name"
                             label="操作人"
                             width="180">
            </el-table-column>
            <el-table-column prop="op_time  "
                             label="操作时间">
            </el-table-column>
            <el-table-column prop="op_info"
                             label="备注">
            </el-table-column>
            <el-table-column prop="enclosurePath"
                             label="附件">
            </el-table-column>

          </el-table>
        </div>

        <!-- 分页 -->
        <!-- <div class="page">
         <el-pagination background
                         :hide-on-single-page="true"
                         layout="prev, pager, next"
                         :page-sizes="[2, 4, 6, 8]"
                         :current-page="this.record.current"
                         @current-change="handleCurrentChange_record"
                         :page-size="this.record.size"
                         :total="this.record.total"></el-pagination>
          </el-pagination>
        </div> -->
        <!-- 分页 end-->
        <div class="remarks">
          <p>备注：</p>
          <el-input type="textarea"
                    style="padding:10px;width:100%"
                    v-model="audit_query.posy_remarks"></el-input>

        </div>
      </div>

      <span slot="footer">

        <el-button size="small"
                   type="primary"
                   @click="adopt()">通过</el-button>
        <el-button size="small"
                   @click="reject()">驳回</el-button>

      </span>
    </el-dialog>

  </div>
</template>

<script>
import { data_pageList, data_push, data_save, add_pageList, data_pageListDone, data_delete, data_push_ing, data_edit_details, data_update, data_savePush, loadcascader, saveTemp, operation_list_data, operation_record_list, operation_audit, operation_uploadData } from
  '@SDMOBILE/api/shandong/data'
import { fmtDate } from '@SDMOBILE/model/time.js';
export default {
  components: {},
  data () {
    return {
      activeName: 0,
      title: '新增资料任务',
      dialogVisible: false,//新增弹窗
      dialogVisible2: false,//添加资料
      dialogVisibl_operation: false,//操作
      // color: '',   // 上传文件icon 颜色
      loading: false,


      sensitiveOptions: [],//添加资料 类型
      sensitiveDepartment: [],//添加资料 部门
      sensitiveDataSource: [],//添加资料 来源

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
        addPeople: '老李',//添加人
        status: '',  // 是否沉淀
        addTime: '',//添加日期 
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
        dataNumber: [{ required: true, message: '请输入资料编号', trigger: 'blur' }],
        secondLevelDataNumber: [{ required: true, message: '请输入二级编号', trigger: 'blur' }],
        department: [{ required: true, message: '请选择部门', trigger: 'change' }],
        source: [{ required: true, message: '请选择来源', trigger: 'change' }],
        remarks: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        status: [{ required: true, message: '请选择是否沉淀', trigger: 'change' }],
        addTime: [{ required: true, message: '请设置添加日期', trigger: 'change' }],
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

      record: [],//操作记录 数据
      record_params: {
        id: '',
      },
      // 审核
      audit_query: {
        taskId: '',
        posy_remarks: '',//操作 备注
      },

      record_status: false,//查看操作记录




      projectNumber: '项目001',//项目id 编号
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

    }
  },
  computed: {},
  watch: {},
  created () {
    // 资料 未完成列表 
    let params = {
      pageNo: this.params.pageNo,
      pageSize: this.params.pageSize,
      condition: {
        projectNumber: this.projectNumber,
      }
    }
    this.list_data_start(params);//未完成

    let params2 = {
      pageNo: this.params_add.pageNo,
      pageSize: this.params_add.pageSize,
      projectType: this.projectType,
    }
    // 新增未完成任务列表
    this.add_add_csh(params2);


    this.post_select_loadcascader_lx();//添加资料   类型 数据
    this.post_select_loadcascader_bm();//添加资料   类型 数据
    this.post_select_loadcascader_ly();//添加资料   类型 数据

  },
  mounted () {

  },
  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      // return fmtDate(t, 'yyyy-MM-dd hh:mm:ss');
      return fmtDate(t, 'yyyy-MM-dd ');
    }
  },

  methods: {
    // 顶部tab 切换事件
    handleClick (val, event) {
      if (val.index == 0) {
        // 未完成
        let params = {
          pageNo: this.params.pageNo,
          pageSize: this.params.pageSize,
          condition: {
            projectNumber: this.projectNumber,
          }
        }
        this.list_data_start(params)//未完成列表
      } else {
        // 已完成
        let params = {
          pageNo: this.params2.pageNo,
          pageSize: this.params2.pageSize,
          condition: {
            dataTaskNumber: this.projectNumber,
          }
        }
        this.list_data_end(params)//已完成列表
      }
    },
    // 关闭
    close () {
      this.dialogVisible = false;
      this.add_form.name = '';//清空name
      this.add_form.title = '';//清空title
      // this.$refs.multipleTable.clearSelection();//清空
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
    // 任务列表分页
    handleCurrentChange_model (val) {
      let params = {
        pageNo: val,
        pageSize: this.params.pageSize,
        condition: {
          projectNumber: this.projectNumber,
        }
      }
      this.list_data_start(params)
    },


    //新增任务 弹窗
    add_data_task () {

      this.add_form.name = '';//清空name
      this.add_form.title = '';//清空title
      // this.$refs.multipleTable.clearSelection();//清空
      this.dialogVisible = true
      this.title = '新增资料任务';
    },

    // 添加资料
    add_data_click () {
      this.dialogVisible2 = true;
    },
    // 新增任务初始化 列表
    add_add_csh (params) {
      add_pageList(params).then(resp => {
        this.task_list = resp.data;
        this.task_list_records = resp.data.records;
      })
    },
    // 新增任务初始化 列表 分页
    handleCurrentChange_csh (val) {
      let params = {
        pageNo: val,
        pageSize: this.params_add.pageSize,
        projectType: this.projectType,
      }
      this.add_add_csh(params)
    },

    // 新增任务列表 里的全选
    handleSelectionChange_query (val) {
      this.multipleSelection_list = val;
    },
    // 确认保存添加的资料
    query_add_form (index) {
      // 新增保存 编辑 为空拦截
      if (this.add_form.title == '') {
        this.$message.info("请输入标题！");
        return false

      } else if (this.add_form.name == '') {
        this.$message.info("请输入发起人！");
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
          demandDataList: array1,
          title: this.add_form.title,
          launchPeople: this.add_form.name,
          projectNumber: this.projectNumber,
        };
        this.query_save(params)//进行新增确认保存操作
      } else {
        // 编辑确认
        let params2 = {
          demandDataList: array1,
          title: this.add_form.title,
          launchPeople: this.add_form.name,
          projectNumber: this.projectNumber,
          addDataTaskUuid: this.addDataTaskUuid,
        };

        // 编辑保存
        this.query_update(params2);//编辑保存
      }

    },
    // 新增直接下发
    add_push_save () {
      // 新增保存
      if (this.add_form.title == '') {
        this.$message.info("请输入标题！");
        return false

      } else if (this.add_form.name == '') {
        this.$message.info("请输入发起人！");
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
      // this.array1 = array1

      let params_push = {
        demandDataList: array1,
        title: this.add_form.title,
        launchPeople: this.add_form.name,
        projectNumber: this.projectNumber,
      };
      // 新增 直接下发
      data_savePush(params_push).then(resp => {
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
            }
          }
          this.list_data_start(params)//未完成列表
          this.dialogVisible = false;//关闭新增弹窗
          this.add_form.name = '';//清空name
          this.add_form.title = '';//清空name
          array1 = [];//清空

        } else {
          this.$message({
            message: resp.msg,
            type: "error",
          });
        }

      })

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
            }
          }
          this.list_data_start(params)//未完成列表
          this.dialogVisible = false;//关闭新增弹窗
          this.add_form.name = '';//清空name
          this.add_form.title = '';//清空name
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


    // 添加资料 ===============================

    // 添加资料  类型
    post_select_loadcascader_lx () {
      let params = {
        typecode: 'PrjType',//类型
      }
      select_loadcascader(params).then(resp => {
        this.sensitiveOptions = resp.data;
      })
    },
    // 类别类型
    PrjType_change (val) {
      console.log(val);
      this.add_data.dataCategory = val
    },


    // 添加资料   部门
    post_select_loadcascader_bm () {
      let params = {
        typecode: 'Department',//部门
      }
      loadcascader(params).then(resp => {
        this.sensitiveDepartment = resp.data;
      })
    },
    // 部门
    Department_change (val) {
      this.add_data.department = val
    },

    // 添加资料  来源
    post_select_loadcascader_ly () {
      let params = {
        typecode: 'DataSource',//来源
      }
      loadcascader(params).then(resp => {
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
    //添加资料 保存按钮
    save_data_btn (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            dataCategory: this.add_data.dataCategory,//类别
            dataName: this.add_data.dataName,//资料名称
            dataNumber: this.add_data.dataNumber,//编号
            secondLevelDataNumber: this.add_data.secondLevelDataNumber,//二级编号
            department: this.add_data.department,//部门
            source: this.add_data.source,//来源
            remarks: this.add_data.remarks,//备注
            addPeople: this.add_data.addPeople,//添加人 
            addTime: this.add_data.addTime,//添加时间
            status: this.add_data.status,//是否沉淀
          }
          saveTemp(params).then(resp => {
            console.log(resp.data);
            if (resp.code == 0) {
              this.$message({
                message: '添加资料成功',
                type: 'success'
              });
              this.dialogVisible2 = false;
              let params2 = {
                pageNo: this.params_add.pageNo,
                pageSize: this.params_add.pageSize,
                projectType: this.projectType,
              }
              // 新增未完成任务列表
              this.add_add_csh(params2);
            } else {
              this.$message({
                message: reesp.msg,
                type: error
              });
            }

          })
        } else {
          this.$message.info("请填写信息");
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },



    // 未完成列表 任务下发
    list_push (data) {
      let params = {
        taskId: data.addDataTaskUuid
      }
      data_push_ing(params).then(resp => {
        // console.log(resp.data);
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
      console.log(data);
      this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, "提示", {
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
            pageNo: this.params.pageNo,
            pageSize: this.params.pageSize,
            condition: {
              projectNumber: this.projectNumber,
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
    // 操作 资料列表 分页
    handleCurrentChange_list_data (val) {
      let params = {
        pageNo: this.operation_query.pageNo,
        pageSize: val,
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
      if (this.operation_query.data_name == '' && this.operation_query.data_category == '') {
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
    look_record (data) {
      this.record_status = true;
      let query_params = {
        id: data.auditPreviousDemandDataUuid
      }
      this.post_operation_record(query_params)//刷新 操作记录 列表

    },

    // 操作记录 
    post_operation_record (query_params) {
      operation_record_list(query_params).then(resp => {
        this.record = resp.data
      })
    },
    // 通过
    adopt () {
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
      // this.dialogVisible2 = false
      let array1 = [];//数组1
      this.multipleSelection_operation.forEach((item) => {
        array1.push(item);
      });

      let params2 = {
        status: 3,
        note: this.audit_query.posy_remarks,
        auditPreviousDemandData: array1,
      }
      this.audit(2, params2)//2:驳回  3:通过
    },

    // 提交
    post () {
      if (this.multipleSelection_operation.length > 1 || this.multipleSelection_operation.length == 0) {
        this.$message.info("请选择一条进行提交");
        return false
      }
      let params = {
        auditPreviousDemandDataUuid: this.multipleSelection_operation[0].auditPreviousDemandDataUuid,
        status: this.multipleSelection_operation[0].status,
      }
      // 提交数据接口
      operation_uploadData(params).then(resp => {
        console.log(resp);
        if (resp.code == 0) {
          this.$message({
            message: "提交成功",
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
        }
      })
    },
    // 审核
    audit (index, params) {
      // 驳回
      if (index == 2) {
        operation_audit(params).then(resp => {
          console.log(resp.data);
          if (resp.code == 0) {
            this.$message({
              message: "驳回",
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
          if (resp.code == 0) {
            this.$message({
              message: "通过",
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
      this.add_form.name = '';//清空name
      this.add_form.title = '';//清空title
      // this.$refs.multipleTable.clearSelection();//清空
      this.title = '编辑资料任务';
      this.dialogVisible = true;//显示编辑

      // 资料任务id 
      this.addDataTaskUuid = data.addDataTaskUuid
      let params = {
        id: this.addDataTaskUuid
      }
      // 显示编辑 详情
      data_edit_details(params).then(resp => {
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
    // 已完成 分页
    handleCurrentChange_zj (val) {
      // 已完成
      let params = {
        pageNo: val,
        pageSize: this.params2.pageSize,
        condition: {
          dataTaskNumber: this.projectNumber,
        }
      }
      this.list_data_end(params)//刷新已完成列表
    },


  },

}
</script>

<style scoped>
@import "../../../assets/styles/css/lhg.css";
.projectTab >>> .el-table th.el-table__cell > .cell,
.projectTab >>> .el-table td.el-table__cell div {
  text-align: center;
}
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
/* 内容  按钮 */
/* .sjzl >>> .el-button--primary {
  background-color: #42d7a5 !important;
  border: none;
} */
.titleMes {
  padding: 10px 0 0;
  box-sizing: border-box;
}
.table {
}
.sjzl >>> .el-button {
  background: none;
  border: none;
}
.sjzl >>> .el-table__header {
  border-top: none !important;
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
}
.dlag_conter >>> .el-form-item {
  display: flex;
}
.dlag_conter >>> .el-form-item__content {
  margin-left: 10px !important;
}
.sjzl >>> .el-dialog__footer {
  text-align: center !important;
}
/* 新增资料 */
.dlag_conter2 {
  padding: 20px;
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
.dlag_conter2 >>> .el-input {
  width: 300px;
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
  box-sizing: border-box;
  flex-wrap: wrap;
}
.dlag_conter2 >>> .el-form-item__content {
}
.dlag_conter2 >>> .el-textarea {
  width: 500px;
}

.operation_header {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  justify-content: space-between;
}
.operation_header div {
  display: flex;
}
.operation_header div .el-input {
  width: 120px !important;
}
.operation_header div .el-select {
  width: 120px;
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
  padding-top: 10px;
  width: 220px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

/* 为空提示 */
.dlag_conter2 >>> .el-form-item__error {
  left: 120px;
}
.cd >>> .el-form-item__error {
  left: 165px;
}
.remarks {
  width: 100%;
}
.remarks p {
  width: 100%;
  text-align: left;
  padding: 10px 0;
}
</style>
