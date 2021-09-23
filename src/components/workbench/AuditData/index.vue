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
          <el-table :data="tableData"
                    style="width: 100%;">
            <el-table-column prop="date"
                             label="流水单号">
            </el-table-column>
            <el-table-column prop="name"
                             label="标题">
            </el-table-column>
            <el-table-column prop="province"
                             label="发起人">
            </el-table-column>
            <el-table-column prop="city"
                             label="发起日期">
            </el-table-column>
            <el-table-column prop="address"
                             label="状态">
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click.native.prevent="edit_data(scope.$index, tableData)"
                           type="text"
                           style="color:#1371CC"
                           size="small">
                  编辑
                </el-button>
                <el-button @click.native.prevent="deleteRow(scope.$index, tableData)"
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

                <el-popconfirm confirm-button-text='好的'
                               cancel-button-text='不用了'
                               icon="el-icon-info"
                               icon-color="red"
                               title="这是一段内容确定删除吗？">
                  <el-button slot="reference"
                             style="color:#DB454B;    font-size: 12px;">删除</el-button>
                </el-popconfirm>

                <!-- <el-button @click.native.prevent="deleteRow(scope.$index, tableData)"
                           type="text"
                           
                           size="small">
                  移除
                </el-button> -->
              </template>
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
      <el-tab-pane label="已操作的资料列表"
                   name="1">
        <div class="projectTab anmition_show">

          <el-table :data="tableData"
                    style="width: 100%;">
            <el-table-column prop="date"
                             label="流水单号">
            </el-table-column>
            <el-table-column prop="name"
                             label="反馈日期">
            </el-table-column>
            <el-table-column prop="province"
                             label="编号">
            </el-table-column>
            <el-table-column prop="city"
                             label="二级编号">
            </el-table-column>
            <el-table-column prop="address"
                             label="资料名称">
            </el-table-column>
            <el-table-column prop="address"
                             label="部门">
            </el-table-column>
            <el-table-column prop="address"
                             label="备注">
            </el-table-column>
            <el-table-column prop="address"
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
    <el-dialog :title="title"
               :visible.sync="dialogVisible2"
               style="padding-bottom: 59px; ">
      <div class="dlag_conter2">
        <el-form ref="form"
                 :model="form"
                 label-width="80px">
          <p>类别：</p>
          <el-select v-model="model"
                     placeholder="请选择责任人">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <p>资料名称：</p>
          <el-select v-model="model"
                     placeholder="请选择资料名称">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form>

        <el-form ref="form"
                 :model="form"
                 label-width="80px">
          <p>编号 ：</p>
          <el-input v-model="model"
                    placeholder=""></el-input>
          <p>二级编号：</p>
          <el-input v-model="model"
                    placeholder=""></el-input>

        </el-form>

        <el-form ref="form"
                 :model="form"
                 label-width="80px">
          <p>部门：</p>
          <el-select v-model="model"
                     placeholder="请选择责任人">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <p>来源：</p>
          <el-select v-model="model"
                     placeholder="请选择资料名称">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form>

        <el-form ref="form"
                 :model="form"
                 label-width="80px">
          <p>添加人：</p>
          <el-select v-model="model"
                     placeholder="请选择责任人">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <p>添加日期：</p>
          <el-select v-model="model"
                     placeholder="请选择资料名称">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form>

        <el-form ref="form"
                 style="    justify-content: flex-start;align-items: center;"
                 :model="form"
                 label-width="80px">
          <p>是否沉淀为常规需求资料：</p>
          <el-radio v-model="radio"
                    label="否"></el-radio>
          <el-radio v-model="radio"
                    label="是"></el-radio>
        </el-form>

        <el-form ref="form"
                 :model="form"
                 label-width="80px">
          <p>备注：</p>
          <el-input type="textarea"
                    v-model="model"
                    placeholder=""></el-input>
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
    <el-dialog title="资料列表"
               width="90%"
               :visible.sync="dialogVisibl_operation"
               style="padding-bottom: 59px; ">
      <div class="dlag_conter2">
        <div class="operation_header">
          <div>

            <p>资料名称：</p>
            <el-input v-model="model"
                      placeholder=""></el-input>

            <p>资料类型：</p>
            <el-select v-model="model"
                       placeholder="资料类型">
              <el-option v-for="item in options"
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
      </div>
      <span slot="footer">
        <el-button size="small"
                   @click="dialogVisible2 = false">取 消</el-button>
        <el-button size="small"
                   type="primary"
                   @click="query()">确定</el-button>

      </span>
    </el-dialog>

  </div>
</template>

<script>
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
      form: {
        name: '',
      },
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        type: 1,
      }, {
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        type: 2

      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        type: 3

      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333, type: 3

      }, {
        date: '2016-05-08',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333, type: 1

      }, {
        date: '2016-05-06',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333, type: 1

      }, {
        date: '2016-05-07',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333, type: 1

      }]
    }
  },
  computed: {},
  watch: {},
  methods: {

    handleClick (tab, event) {
      console.log(tab, event);
    },
    //新增任务
    add_data_task () {
      this.dialogVisible = true
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
  created () {

  },
  mounted () {

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
  width: 270px !important;
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

.dlag_conter2 >>> .el-form-item {
  margin-bottom: 20px !important;
  display: flex;
}
.dlag_conter2 >>> .el-form-item__content {
  margin-left: 10px !important;
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
.operation_header div .el-button {
}
</style>
