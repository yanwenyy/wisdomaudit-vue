<template>
  <div class="sjzl">
    <!-- tab 切换 -->

    <el-tabs v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane label="审计资料任务列表"
                   name="0">

        <div class="projectTab anmition_show">
          <el-row class="titleMes">
            <el-col :span="1.5">
              <el-button type="primary"
                         @click="add_data_task()">新增</el-button>
            </el-col>
          </el-row>
          <el-table :data="tableData_list"
                    v-loading="loading"
                    style="width: 100%;">
            <el-table-column prop="dataTaskNumber"
                             label="流水单号">
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

            <el-table-column label="操作">
              <template slot-scope="scope">
                <div v-if=" scope.row.status == 0">
                  <el-button @click.native.prevent="edit_data(scope.$index, tableData)"
                             type="text"
                             style="color:#1371CC"
                             size="small">
                    编辑
                  </el-button>
                  <el-button @click.native.prevent="push(scope.$index, tableData)"
                             type="text"
                             style="color:#1371CC"
                             size="small">
                    下发
                  </el-button>
                  <el-button @click.native.prevent="operation"
                             type="text"
                             style="color:#1371CC"
                             size="small">
                    操作
                  </el-button>
                </div>

                <div v-if=" scope.row.status == 1">
                  <el-button @click.native.prevent="edit_data(scope.$index, tableData)"
                             type="text"
                             style="color:#1371CC"
                             size="small">
                    审批
                  </el-button>

                  <el-button @click.native.prevent="operation"
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
                         :hide-on-single-page="false"
                         layout="prev, pager, next"
                         :page-sizes="[2, 4, 6, 8]"
                         :current-page="this.tableData.current"
                         @current-change="handleCurrentChange"
                         :page-size="this.tableData.size"
                         :total="this.tableData.total"></el-pagination>
        </div>
        <!-- 分页 end-->
      </el-tab-pane>
      <el-tab-pane label="已操作的资料列表"
                   name="1">
        <div class="projectTab anmition_show">

          <el-table :data="tableData_list"
                    style="width: 100%;">
            <el-table-column prop="dataTaskNumber"
                             label="流水单号">
            </el-table-column>
            <el-table-column prop=""
                             label="反馈日期">
            </el-table-column>
            <el-table-column prop=""
                             label="编号">
            </el-table-column>
            <el-table-column prop=""
                             label="二级编号">
            </el-table-column>
            <el-table-column prop="title"
                             label="资料名称">
            </el-table-column>
            <el-table-column prop=""
                             label="部门">
            </el-table-column>
            <el-table-column prop=""
                             label="备注">
            </el-table-column>
            <el-table-column prop=""
                             label=附件>
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
                <span>2</span>
              </div>
            </el-table-column>

          </el-table>
        </div>

        <!-- 分页 -->
        <div class="page">
          <el-pagination background
                         layout="prev, pager, next"
                         :total="1000">
          </el-pagination>
        </div>
        <!-- 分页 end-->
      </el-tab-pane>
    </el-tabs>

    <!-- 新增资料 -->
    <el-dialog :title="title"
               width="80%"
               :visible.sync="dialogVisible"
               style="padding-bottom: 59px; ">
      <div class="dlag_conter">
        <el-form ref="form"
                 :model="form"
                 label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label=发起人>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
        <el-form ref="form"
                 :model="form"
                 label-width="80px">
          <div style="display:flex;align-items: center;padding:10px 0;box-sizing: border-box;">
            <p>获取资料清单：</p>
            <el-button type="primary"
                       @click="add_data()">添加资料</el-button>
          </div>
        </el-form>
        <el-form ref="form"
                 :model="form"
                 label-width="80px">
          <el-table ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
            <el-table-column label="类别">
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column prop="name"
                             label="编号">
            </el-table-column>
            <el-table-column prop="address"
                             label="二级编号"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="address"
                             label="资料名称"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="address"
                             label="部门"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="address"
                             label="备注"
                             show-overflow-tooltip>
            </el-table-column>

          </el-table>
        </el-form>
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
                   @click="dialogVisible = false">取 消</el-button>
        <el-button size="small"
                   type="primary"
                   @click="query()">保存</el-button>
        <el-button size="small"
                   type="primary"
                   @click="query()">下发</el-button>
      </span>

    </el-dialog>

    <!-- 添加资料 -->
    <el-dialog title="添加资料"
               :visible.sync="dialogVisible2"
               style="padding-bottom: 59px; ">
      <div class="dlag_conter2">
        <el-form label-width="80px">

          <div class="son">
            <el-form-item label-width="80px">
              <p>类别：</p>
              <el-select v-model="value_select">
                <el-option v-for="item in sensitiveOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="80px">
              <p>资料名称：</p>
              <el-select v-model="value_select">
                <el-option v-for="item in sensitiveOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="son">

            <el-form-item label-width="80px">
              <p>编号 ：</p>
              <el-input v-model="value_name"
                        placeholder=""></el-input>
              <p>二级编号：</p>
              <el-input v-model="value_name"
                        placeholder=""></el-input>

            </el-form-item>
          </div>
          <div class="son">

            <el-form-item label-width="80px">
              <p>部门：</p>
              <el-select v-model="value_select">
                <el-option v-for="item in sensitiveOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
              <p>来源：</p>
              <el-select v-model="value_select"
                         placeholder="请选择资料名称">
                <el-option v-for="item in sensitiveOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="son">

            <el-form-item label-width="80px">
              <p>添加人：</p>
              <el-select v-model="value_select"
                         placeholder="请选择责任人">
                <el-option v-for="item in sensitiveOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
              <p>添加日期：</p>
              <el-select v-model="value_select"
                         placeholder="请选择资料名称">
                <el-option v-for="item in sensitiveOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="son">

            <el-form-item label-width="80px">
              <p style="padding:0">是否沉淀为常规需求资料：</p>
              <el-radio-group v-model="resource">
                <el-radio label="否"></el-radio>
                <el-radio label="是"></el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <div class="son">

            <el-form-item label-width="80px">
              <p>备注：</p>
              <el-input type="textarea"
                        v-model="value_name"
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
                   @click="query()">确定</el-button>

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
            <el-input v-model="value_name"
                      placeholder=""></el-input>

            <p>资料类型：</p>
            <el-select v-model="value_select">
              <el-option v-for="item in sensitiveOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <el-button type="primary">查询</el-button>
        </div>

        <el-table ref="multipleTable"
                  :data="tableData"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column label="类型"
                           width="120">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column prop="name"
                           label="编号"
                           width="120">
          </el-table-column>
          <el-table-column prop="address"
                           label="二级编号"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="address"
                           label="资料名称"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="address"
                           label="部门"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="address"
                           label="备注"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="address"
                           label="提供时间"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="type"
                           label="状态"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="address"
                           label="附件"
                           show-overflow-tooltip>
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <div class="page">
          <el-pagination background
                         layout="prev, pager, next"
                         :total="1000">
          </el-pagination>
        </div>
        <!-- 分页 end-->

        <div class="tt">操作记录</div>

        <!-- 操作记录 -->
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="date"
                           label="动作"
                           width="180">
          </el-table-column>
          <el-table-column prop="name"
                           label="操作人"
                           width="180">
          </el-table-column>
          <el-table-column prop="address"
                           label="操作时间">
          </el-table-column>
          <el-table-column prop="address"
                           label="备注">
          </el-table-column>
          <el-table-column prop="address"
                           label="附件">
          </el-table-column>

        </el-table>
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
                   @click="query()">通过</el-button>
        <el-button size="small"
                   @click="dialogVisible2 = false">驳回</el-button>

      </span>
    </el-dialog>

  </div>
</template>

<script>
import { data_pageList, data_push, data_save, add_pageList } from
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
      form: {
        name: '',
      },
      tableData: [{
        date: '2016-05-03',
        name: '',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        type: 1,
      }, {
        date: '2016-05-02',
        name: '',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        type: 2

      }, {
        date: '2016-05-04',
        name: '',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        type: 3

      }, {
        date: '2016-05-01',
        name: '',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333, type: 3

      }, {
        date: '2016-05-08',
        name: '',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333, type: 1

      }, {
        date: '2016-05-06',
        name: '',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333, type: 1

      }, {
        date: '2016-05-07',
        name: '',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333, type: 1

      }],
      value_name: '',//input
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
        {
          value: "选项4",
          label: "张三",
        },
      ],
      resource: '',//radio


      tableData_list: [],
      params: {
        pageNo: 0,
        pageSize: 15,
        condition: {
          projectNumber: '项目001',
          status: "0,1",

        }
      }

    }
  },
  computed: {},
  watch: {},
  created () {
    // 资料列表
    let params = {
      pageNo: this.params.pageNo,
      pageSize: this.params.pageSize,
      condition: {
        projectNumber: this.params.condition.projectNumber,
        status: this.params.condition.status,

      }
    }
    this.list_data(params);
  },
  mounted () {

  },
  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      return fmtDate(t, 'yyyy-MM-dd hh:mm:ss');
    }
  },

  methods: {
    // 顶部tab 切换事件
    handleClick (val, event) {
      if (val.index == 0) {
        let params = {
          pageNo: val,
          pageSize: this.params.pageSize,
          condition: {
            projectNumber: this.params.condition.projectNumber,
            status: this.params.condition.status,
          }
        }
        this.list_data(params)
      } else {
        let params = {
          pageNo: val,
          pageSize: this.params.pageSize,
          condition: {
            projectNumber: this.params.condition.projectNumber,
            status: 2,
          }
        }
        this.list_data(params)
      }
    },
    // 列表
    list_data (params) {
      data_pageList(params).then(resp => {
        this.loading = true
        this.tableData = resp.data;
        this.tableData_list = resp.data.records
        this.loading = false
        // console.log(this.tableData);
      })
    },
    // 任务列表分页
    handleCurrentChange (val) {
      let params = {
        pageNo: val,
        pageSize: this.params.pageSize,
        condition: {
          projectNumber: this.params.condition.projectNumber,
          status: this.params.condition.status,
        }
      }
      this.list_data(params)
    },

    // 任务新增
    data_save () {

    },
    // 未完成任务下发
    push (index, rows) {
      console.log(rows.records[index].addDataTaskUuid);
      let params = {
        taskId: rows.records[index].addDataTaskUuid
      }
      data_push(params).then(resp => {
        console.log(params);
        // console.log(resp.data);
      })
    },
    //新增任务
    add_data_task () {
      this.dialogVisible = true

      let params = {
        pageNo: 0,
        pageSize: 15,
        projectType: '111'
      }
      // 新增未完成任务列表
      add_pageList(params).then(resp => {
        console.log(params);
        // console.log(resp.data);
      })
    },




    // 确认
    query () {
      this.dialogVisible = false
    },
    // 删除
    deleteRow (index, rows) {
      rows.splice(index, 1);
    },
    // 添加资料
    add_data () {
      this.dialogVisible2 = true;
    },

    // 编辑
    edit_data () {
      this.title = '编辑资料任务',
        this.dialogVisible = true
    },
    // 操作
    operation () {
      this.dialogVisibl_operation = true
    },

    // 新增资料弹窗
    // 全选
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    }


  },

}
</script>

<style scoped>
@import "../../../assets/styles/css/lhg.css";

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
</style>
