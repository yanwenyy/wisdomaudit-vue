<template>
  <div class="sjzl anmition_show">
    <div class="conter">
      <div class="projectTab">
        <el-row :gutter="24" class="titleMes">
          <!-- 引用 -->
          <el-col :span="1.5" v-if="task_type == 0">
            <el-button type="primary" @click="quote()">引用</el-button>
          </el-col>

          <!-- 新增 -->
          <el-col :span="1.5" v-if="task_type == 1">
            <el-button type="primary" @click="new_add()">新增</el-button>
          </el-col>

          <!-- 自建任务 / 模型任务 -->
          <el-col :span="1.5">
            <el-button type="primary" v-if="task_type == 0" @click="on_Task(1)"
              >自建任务</el-button
            >
            <el-button type="primary" v-if="task_type == 1" @click="on_Task(0)"
              >模型任务</el-button
            >
          </el-col>
          <!-- 自建任务 /  模型任务 end-->
          <!--自建任务 筛选 -->
          <div class="search" v-if="task_type == 0">
            <el-input placeholder="请输入" v-model="task.search"> </el-input>
            <div class="search_icon">
              <i class="el-icon-search" style="color: rgba(0, 0, 0, 0.5)"></i>
            </div>

            <el-button type="primary" @click="search_list()">筛选</el-button>
          </div>
          <!-- 模型任务 -->
          <div class="search" v-if="task_type == 1">
            <el-input placeholder="请输入" v-model="task.search"> </el-input>
            <div class="search_icon">
              <i class="el-icon-search" style="color: rgba(0, 0, 0, 0.5)"></i>
            </div>

            <el-button type="primary" @click="search_list()">筛选</el-button>
          </div>
        </el-row>

        <!-- 模型任务 -->
        <div
          class="task_type"
          v-if="task_type == 0"
          :class="task_type == 0 ? 'anmition_show' : ''"
        >
          <!-- 表单 -->
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="序号"> </el-table-column>
            <el-table-column prop="name" label="模型名称"> </el-table-column>
            <el-table-column prop="type" label="模型分类">
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
            <el-table-column prop="data_num" label="结果数">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="
                    data_num_click(scope.$index, tableData)
                  "
                  type="text"
                  style="color: #1371cc"
                  size="small"
                >
                  {{ scope.row.data_num }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="wt_num" label="问题数">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="probleNum()"
                  type="text"
                  style="color: #1371cc"
                  size="small"
                >
                  {{ scope.row.wt_num }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="city" label="责任人 ">
              <el-select
                v-model="task.zrr_id"
                @change="$forceUpdate()"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value_zjr"
                  :label="item.label"
                  :value="item.value_zjr"
                >
                </el-option>
              </el-select>
            </el-table-column>

            <el-table-column prop="ing" label="运行状态">
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
            <el-table-column prop="start_time" label="运行开始时间">
            </el-table-column>
            <el-table-column prop="end_time" label="运行结束时间">
            </el-table-column>

            <el-table-column prop="edit" label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="setParameters()"
                  type="text"
                  style="color: #1371cc"
                  size="small"
                >
                  <!-- {{scope.row.ing == 0? "未开始"
                : scope.row.ing == 1? "设置参数"
                : scope.row.ing == 2 ? "执行中"
                : "待开始"}} -->
                  设置参数
                </el-button>
              </template>

              <!-- <el-button @click.native.prevent="deleteRow(scope.$index, tableData)"
                         type="text"
                         style="color:#1371CC"
                         size="small">
                编辑
              </el-button> -->
            </el-table-column>
          </el-table>
          <!-- 表单 end-->

          <!-- 分页 -->
          <div class="page">
            <el-pagination background layout="prev, pager, next" :total="1000">
            </el-pagination>
          </div>
          <!-- 分页 end-->
        </div>
        <!-- 模型任务 end-->

        <!-- 自建任务 -->
        <div
          class="task_type"
          v-if="task_type == 1"
          :class="task_type == 1 ? 'anmition_show' : ''"
        >
          <!-- 表单 -->
          <el-table :data="tableData2" style="width: 100%">
            <el-table-column prop="name" label="任务名称"> </el-table-column>
            <el-table-column prop="task_name" label="任务描述">
            </el-table-column>
            <el-table-column prop="task_text" label="问题描述">
            </el-table-column>
            <el-table-column prop="basis" label="依据"> </el-table-column>
            <el-table-column prop="city" label="责任人 ">
              <el-select
                v-model="task.zrr_id"
                @change="$forceUpdate()"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value_zjr"
                  :label="item.label"
                  :value="item.value_zjr"
                >
                </el-option>
              </el-select>
            </el-table-column>

            <el-table-column prop="address" label="附件" width="90">
              <div class="update">
                <icon class="update_icon">
                  <svg
                    t="1631877671204"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="9939"
                    width="200"
                    height="200"
                  >
                    <path
                      d="M825.6 198.4H450.1l-14.4-28.7c-18.8-37.6-56.5-60.9-98.5-60.9H174.1C113.4 108.8 64 158.2 64 218.9v561.9c0 74.1 60.3 134.4 134.4 134.4h627.2c74.1 0 134.4-60.3 134.4-134.4v-448c0-74.1-60.3-134.4-134.4-134.4z m44.8 582.4c0 24.7-20.1 44.8-44.8 44.8H198.4c-24.7 0-44.8-20.1-44.8-44.8V467.2h716.8v313.6z m0-403.2H153.6V218.9c0-11.3 9.2-20.5 20.5-20.5h163.1c7.8 0 14.9 4.4 18.4 11.4l39.1 78.2h430.9c24.7 0 44.8 20.1 44.8 44.8v44.8z"
                      fill="#FD9D27"
                      p-id="9940"
                    ></path>
                  </svg>
                </icon>
                <span>2</span>
              </div>
            </el-table-column>
          </el-table>
          <!-- 表单 end-->

          <!-- 分页 -->
          <div class="page">
            <el-pagination background layout="prev, pager, next" :total="1000">
            </el-pagination>
          </div>
          <!-- 分页 end-->
        </div>
        <!-- 自建任务 end-->
      </div>
    </div>

    <!-- 模型任务 结果数 -->
    <el-dialog
      title="模型列表"
      width="90%"
      popper-class="status_data_dlag"
      :visible.sync="dialogVisible_data_num"
      style="padding-bottom: 59px"
    >
      <div class="dlag_conter">
        <el-row :gutter="24">
          <ul class="status_data">
            <li>
              <el-button type="primary" @click="quote()">结果1</el-button>
            </li>
            <li>
              <el-button type="primary" @click="quote()">结果1</el-button>
            </li>
            <li>
              <el-button type="primary" @click="quote()">结果1</el-button>
            </li>
          </ul>
        </el-row>
        <div class="cxjg" style="margin: 20px 0; display: flex">
          <el-col> 模型线索结果（XXX模型） </el-col>
          <el-col style="display: contents">
            <el-button type="primary" @click="quote()">核实</el-button>
            <el-button type="primary" @click="quote()">下载</el-button>
            <el-button type="primary" @click="dialogVisible_data_num == false"
              >返回</el-button
            >
          </el-col>
        </div>
        <!-- 表单 -->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="序号"> </el-table-column>
          <el-table-column prop="name" label="合同名称"> </el-table-column>
          <el-table-column prop="type" label="合同标题">
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
          <el-table-column prop="data_num" label="地区编码">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="data_num_click(scope.$index, tableData)"
                type="text"
                style="color: #1371cc"
                size="small"
              >
                {{ scope.row.data_num }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="wt_num" label="签约厂家">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                style="color: #1371cc"
                size="small"
              >
                {{ scope.row.wt_num }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="city" label="盖章时间">
            <el-select
              v-model="task.zrr_id"
              @change="$forceUpdate()"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value_zjr"
                :label="item.label"
                :value="item.value_zjr"
              >
              </el-option>
            </el-select>
          </el-table-column>

          <el-table-column prop="ing" label="合同起草时间">
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
          <el-table-column prop="start_time" label="合同金额">
          </el-table-column>
          <el-table-column prop="end_time" label="合同履行时间">
          </el-table-column>

          <el-table-column prop="edit" label="合同履行结束时间" width="100">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                style="color: #1371cc"
                size="small"
              >
                设置参数
              </el-button>
            </template>
          </el-table-column>

          <el-table-column prop="edit" label="滞后天数" width="100">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                style="color: #1371cc"
                size="small"
              >
                设置参数
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="edit" label="是否问题" width="100">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                style="color: #1371cc"
                size="small"
              >
                设置参数
              </el-button>
            </template>
          </el-table-column>

          <el-table-column prop="edit" label="核实人" width="100">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                style="color: #1371cc"
                size="small"
              >
                设置参数
              </el-button>
            </template>
          </el-table-column>

          <el-table-column prop="edit" label="核实信息" width="100">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                style="color: #1371cc"
                size="small"
              >
                设置参数
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="edit" label="附件" width="100">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                style="color: #1371cc"
                size="small"
              >
                设置参数
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表单 end-->

        <!-- 分页 -->
        <div class="page">
          <el-pagination background layout="prev, pager, next" :total="1000">
          </el-pagination>
        </div>
        <!-- 分页 end-->
      </div>
      <span slot="footer">
        <el-button size="small" type="primary" @click="query()"
          >确 定</el-button
        >
        <el-button
          size="small"
          @click="clearTopic(), (dialogVisible_quote = false)"
          >取 消</el-button
        >
      </span>
    </el-dialog>

    <!-- 模型任务 问题数 -->
    <el-dialog
      :visible.sync="problemsDialogVisible"
      width="60%"
    >
      <el-row style="margin-top:3%;background:#F2F2F2;padding:15px">
        <el-col :span="18" class="tableTitle">xxx模型审计发现列表</el-col>
        <el-col :span="6">
          <el-button type="primary">增加</el-button>
          <el-button type="primary">修改</el-button>
          <el-button type="primary">删除</el-button>
        </el-col>
      </el-row>
      <el-table
          :data="tableData1"
          ref="multipleTable"
          tooltip-effect="dark"
          style="width: 100%;margin-bottom:2%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="name" label="领域"> </el-table-column>
          <el-table-column prop="name1" label="审计发现"> </el-table-column>
          <el-table-column prop="name2" label="依据"> </el-table-column>
          <el-table-column prop="name3" label="描述"> </el-table-column>
          <el-table-column prop="name4" label="发现时间"> </el-table-column>
          <el-table-column prop="name5" label="风险金额（万元）"> </el-table-column>
          <el-table-column prop="name6" label="发现人"> </el-table-column>

        </el-table>
    </el-dialog>

    <!-- 模型任务设置参数 -->
    <el-dialog :visible.sync="setParametersDialogVisible" width="60%">
      <el-card class="setParameters"> 参数设置 </el-card>
      <el-card class="parameters">
        <i class="el-icon-s-grid"></i>
        请输入参数值
      </el-card>
      <el-card class="parametersTab">
        <el-form label-width="100px">
          <el-row>
            <el-form-item label="被审计单位">
              <el-select placeholder="请选择"></el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="审计期间_开始">
              <el-input placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-error"></el-button>
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="审计期间_结束">
              <el-input placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-error"></el-button>
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
    <el-dialog
      title="模型列表"
      :visible.sync="dialogVisible_quote"
      style="padding-bottom: 59px"
    >
      <div class="dlag_conter">
        <el-row :gutter="24" class="titleMes">
          <div
            class="search"
            style="width: 100%; justify-content: flex-start; width: 300px"
            v-if="task_type == 0"
          >
            <el-input placeholder="请输入模型名称" v-model="task.search">
            </el-input>
            <div class="search_icon">
              <i class="el-icon-search" style="color: rgba(0, 0, 0, 0.5)"></i>
            </div>

            <el-button type="primary" @click="quote_list()">筛选</el-button>
          </div>
        </el-row>
        <div class="cxjg" style="margin: 20px 0">
          <el-col :span="1.5">
            查询结果
            <el-button type="primary" @click="quote()">引用</el-button>
          </el-col>
        </div>
        <el-table
          :data="tableData"
          ref="multipleTable"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="name" label="模型名称"> </el-table-column>
        </el-table>
      </div>

      <span slot="footer">
        <el-button size="small" type="primary" @click="query()"
          >确 定</el-button
        >
        <el-button
          size="small"
          @click="clearTopic(), (dialogVisible_quote = false)"
          >取 消</el-button
        >
      </span>
    </el-dialog>

    <!-- 自建任务新增 -->
    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      style="padding-bottom: 59px"
    >
      <div class="dlag_conter">
        <el-form label-width="80px">
          <p>自建任务新增：</p>
          <el-input
            v-model="add_task.name"
            placeholder="请输入任务新增"
          ></el-input>
        </el-form>
        <el-form label-width="80px">
          <p>责任人：</p>
          <el-select
            v-model="task.zrr_id"
            @change="$forceUpdate()"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value_zjr"
              :label="item.label"
              :value="item.value_zjr"
            >
            </el-option>
          </el-select>
        </el-form>
        <el-form label-width="80px">
          <p>任务描述：</p>
          <el-input
            v-model="add_task.textare"
            placeholder="请输入任务描述"
          ></el-input>
        </el-form>
        <el-form label-width="80px">
          <p>上传附件：</p>
          <el-upload
            class="upload-demo"
            style="width: 300px"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              支持上传或者拖拽文件到这里<em>点击上传</em>
            </div>
            <div class="el-upload__text">支持.ZIP.DOC</div>
          </el-upload>
        </el-form>
      </div>

      <span slot="footer">
        <el-button size="small" type="primary" @click="query()"
          >确 定</el-button
        >
        <el-button size="small" @click="clearTopic(), (dialogVisible = false)"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      task_type: 0, //默认显示任务/自建任务
      tab: [{ name: "审计资料任务列表" }, { name: "已操作的资料列表" }], //任务切换
      dialogVisible_quote: false, //模型任务引用
      dialogVisible: false, // 自建任务新增弹窗
      dialogVisible_data_num: false, //模型任务结果数
      setParametersDialogVisible: false, //模型任务设置参数
      problemsDialogVisible:false, //模型任务问题数
      multipleSelection: [],

      // 提交数据单
      task: {
        search: "", // 筛选
        zrr_id: "", //责任人
      },
      // 责任人
      options: [
        {
          value_zrr: "",
          label: "张三",
        },
        {
          value_zrr: "",
          label: "李四",
        },
        {
          value_zrr: "",
          label: "王五",
        },
      ],
      value_zrr: "",

      tableData: [
        {
          date: 1,
          name: "王小虎",
          type: 0,
          ing: 0,
          data_num: 1, //结果数
          wt_num: 2,
          start_time: "10-1",
          end_time: "10-11",
          address: "上海市普陀区金沙江路 1518 弄",
          edit: 1,
          zip: "1.zip",
        },
        {
          date: 2,
          name: "王小虎",
          type: 1,
          ing: 1,
          data_num: 1, //结果数
          wt_num: 2,
          start_time: "10-1",
          end_time: "10-11",
          address: "上海市普陀区金沙江路 1518 弄",
          edit: 2,
          zip: 200333,
        },
        {
          date: 3,
          name: "王小虎",
          ing: 2,
          data_num: 1, //结果数
          wt_num: 2,
          type: 2,
          start_time: "10-1",
          end_time: "10-11",
          address: "上海市普陀区金沙江路 1518 弄",
          edit: 3,
          zip: 200333,
        },
      ],
      tableData1:[
        {
          name:'个人',
          name1:'小金额',
          name2:'依据xxx法规xxx条',
          name3:'描述1',
          name4:'2021-02-22',
          name5:'55',
          name6:'小明'
        },
         {
          name:'个人',
          name1:'小金额',
          name2:'依据xxx法规xxx条',
          name3:'描述1',
          name4:'2021-02-22',
          name5:'55',
          name6:'小明'
        },
         {
          name:'个人',
          name1:'小金额',
          name2:'依据xxx法规xxx条',
          name3:'描述1',
          name4:'2021-02-22',
          name5:'55',
          name6:'小明'
        },
         {
          name:'个人',
          name1:'小金额',
          name2:'依据xxx法规xxx条',
          name3:'描述1',
          name4:'2021-02-22',
          name5:'55',
          name6:'小明'
        },
         {
          name:'个人',
          name1:'小金额',
          name2:'依据xxx法规xxx条',
          name3:'描述1',
          name4:'2021-02-22',
          name5:'55',
          name6:'小明'
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
          label: "李四",
        },
        {
          value_zrr: "",
          label: "王五",
        },
      ],
      value_zrr: "",
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 模型任务===========
    // 引用
    quote() {
      this.dialogVisible_quote = true;
    },
    // 查询引用列表
    quote_list() {
      console.log(222);
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 结果数
    data_num_click() {
      this.dialogVisible_data_num = true;
    },
    // 自建任务===========

    // 新增
    new_add() {
      this.dialogVisible = true;
    },
    // 筛选
    search_list() {
      console.log(this.task.search);
    },
    // 显示自建任务
    on_Task(index) {
      this.task_type = index;
    },
    //  确认新增
    clearTopic() {
      console.log("关闭新增");
    },
    // 确认新增
    quert() {
      this.dialogVisible = false;
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    setParameters() {
      this.setParametersDialogVisible = true;
    },
    // 问题数
    probleNum(){
      this.problemsDialogVisible= true;
    }
  },
  created() {},
  mounted() {},
};
</script>

<style scoped>
@import "../../../assets/styles/css/lhg.css";
.sjzl {
  display: flex;
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
  min-width: 100px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  cursor: pointer;
  background: #559ed4 !important;
  border-radius: 5px;
  color: #fff;
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
.tableTitle{
  font-size: 20px;
  font-weight:700;
}
</style>
