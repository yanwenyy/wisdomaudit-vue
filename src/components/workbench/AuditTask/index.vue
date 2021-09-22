<template>
  <div class="sjzl anmition_show">

    <div class="conter">

      <div class="projectTab">
        <el-row :gutter="24"
                class="titleMes">
          <el-col :span="1.5">
            <el-button type="primary"
                       @click="new_add()">新增</el-button>
          </el-col>

          <el-col :span="1.5">
            <el-button type="primary"
                       v-if="task_type ==0"
                       style="background: #1371cc !important;"
                       @click="on_Task(1)">自建任务</el-button>
            <el-button type="primary"
                       v-if="task_type ==1"
                       style="background: #1371cc !important;"
                       @click="on_Task(0)">模型任务</el-button>

          </el-col>

          <div class="search">
            <el-input placeholder="请输入"> </el-input>
            <el-button class="search_icon">
              <i class="el-icon-search
"
                 style="color:#fff"></i>
            </el-button>

            <el-button type="primary">筛选</el-button>
          </div>
        </el-row>

        <!-- 模型任务 -->
        <div class="task_type "
             v-if="task_type ==0"
             :class="task_type ==0 ?'anmition_show':''">
          <!-- 表单 -->
          <el-table :data="tableData"
                    style="width: 100%;">
            <el-table-column prop="date"
                             label="序号">
            </el-table-column>
            <el-table-column prop="name"
                             label="模型名称">
            </el-table-column>
            <el-table-column prop="province"
                             label="模型分类">
            </el-table-column>
            <el-table-column prop="province"
                             label="结果数">
            </el-table-column>
            <el-table-column prop="province"
                             label="问题数">
            </el-table-column>
            <el-table-column prop="city"
                             label="责任人 ">
              <el-select v-model="value"
                         placeholder="请选择">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"
                           v-model="label">
                </el-option>
              </el-select>
            </el-table-column>

            <el-table-column prop="province"
                             label="运行状态">
            </el-table-column>
            <el-table-column prop="address"
                             label="运行开始时间">
            </el-table-column>
            <el-table-column prop="address"
                             label="运行结束时间">
            </el-table-column>

            <el-table-column prop="address"
                             label="操作"
                             width="100">
              <el-button @click.native.prevent="deleteRow(scope.$index, tableData)"
                         type="text"
                         style="color:#1371CC"
                         size="small">
                编辑
              </el-button>
            </el-table-column>
            <el-table-column prop="address"
                             label="依据"
                             width="120">
            </el-table-column>

            <el-table-column prop="address"
                             label=附件
                             width="90">
              <div class="update">
                <icon class="update_icon">
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
                </icon>
                <span>2</span>
              </div>
            </el-table-column>

            <el-table-column prop="address"
                             label="设置"
                             width="120">
            </el-table-column>
            <el-button @click.native.prevent="deleteRow(scope.$index, tableData)"
                       type="text"
                       style="color:#1371CC"
                       size="small">
              设置参数
            </el-button>
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
        <!-- 模型任务 end-->

        <!-- 自建任务 -->
        <div class="task_type "
             v-if="task_type ==1"
             :class="task_type ==1 ?'anmition_show':''">
          <!-- 表单 -->
          <el-table :data="tableData"
                    style="width: 100%;">
            <el-table-column prop="date"
                             label="任务名称">
            </el-table-column>
            <el-table-column prop="name"
                             label="任务描述">
            </el-table-column>
            <el-table-column prop="province"
                             label="领域">
            </el-table-column>
            <el-table-column prop="province"
                             label="专题">
            </el-table-column>
            <el-table-column prop="city"
                             label="责任人 ">
              <el-select v-model="value"
                         placeholder="请选择">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"
                           v-model="label">
                </el-option>
              </el-select>
            </el-table-column>

            <el-table-column prop="address"
                             label=附件
                             width="90">
              <div class="update">
                <icon class="update_icon">
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
                </icon>
                <span>2</span>
              </div>
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
        <!-- 自建任务 end-->

      </div>

    </div>

    <el-dialog title="新增"
               :visible.sync="dialogVisible"
               style="padding-bottom: 59px; ">
      <div class="dlag_conter">
        <el-form ref="form"
                 :model="form"
                 label-width="80px">
          <p>自建任务新增：</p>
          <el-input v-model="task"
                    placeholder="请输入任务新增"></el-input>
        </el-form>
        <el-form ref="form"
                 :model="form"
                 label-width="80px">
          <p>责任人：</p>
          <el-select v-model="model"
                     placeholder="请选择责任人">
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
          <p>任务描述：</p>
          <el-input v-model="task"
                    placeholder="请输入任务描述"></el-input>
        </el-form>
        <el-form ref="model"
                 :model="model"
                 label-width="80px">
          <p>上传附件：</p>
          <el-upload class="upload-demo"
                     style="width:300px"
                     drag
                     action="https://jsonplaceholder.typicode.com/posts/"
                     multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">支持上传或者拖拽文件到这里<em>点击上传</em></div>
            <div class="el-upload__text">支持.ZIP.DOC</div>
          </el-upload>
        </el-form>
      </div>

      <span slot="footer">
        <el-button size="small"
                   type="primary"
                   @click="query()">确 定</el-button>
        <el-button size="small"
                   @click="clearTopic(), (dialogVisible = false)">取 消</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      task_type: 0,//默认显示任务/自建任务
      color: 'white',   // 上传文件icon 颜色
      dialogVisible: false,// 新增弹窗
      tab: [{ name: '审计资料任务列表' }, { name: '已操作的资料列表' }],
      label: '黄金糕',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
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
    // 新增
    new_add () {
      this.dialogVisible = true;

    },
    // 显示自建任务
    on_Task (index) {
      this.task_type = index
    },
    //  确认新增
    clearTopic () {
      console.log('关闭新增');
    },
    // 确认新增
    quert () {
      this.dialogVisible = false;
    },
    deleteRow (index, rows) {
      rows.splice(index, 1);
    },


  },
  created () {

  },
  mounted () {

  },
}
</script>

<style scoped>
@import "../../../assets/styles/css/lhg.css";
.sjzl {
  display: flex;
}
.titleMes {
  margin: 0;
}
.sjzl .conter {
  width: 100%;
  float: left;
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

.search {
  display: flex;
  justify-content: flex-end;
  position: relative;
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
  background: #1371cc;
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
  background: #1371cc !important;
}

.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}

.dlag_conter {
  padding: 20px;
}
.dlag_conter p {
  margin-bottom: 10px;
  min-width: 120px;
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
.dlag_conter >>> .el-dialog__footer {
  text-align: center;
}
.dlag_conter >>> .el-upload-dragger {
  width: 300px;
}
</style>
