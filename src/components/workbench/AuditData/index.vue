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
                         @click="add_data()">新增</el-button>
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
            <el-button type="primary">添加资料</el-button>
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
        zip: 200333
      }, {
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-08',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-06',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-07',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }]
    }
  },
  computed: {},
  watch: {},
  methods: {

    handleClick (tab, event) {
      console.log(tab, event);
    },
    add_data () {
      this.dialogVisible = true
    },//新增任务
    // 确认
    query () {
      this.dialogVisible = false
    },
    // 删除
    deleteRow (index, rows) {
      rows.splice(index, 1);
    },

    // 编辑
    edit_data () {
      this.title = '编辑资料任务',

        this.dialogVisible = true

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
.sjzl >>> .el-button--primary {
  background-color: #42d7a5 !important;
  border: none;
}
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
.dlag_conter >>> .el-dialog__footer {
  text-align: center;
}
</style>
