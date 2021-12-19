<template>
  <div class="sjqrd">
    <div class="conter">
      <div class="two">
        <div class="projectTab">
          <el-row :gutter="24"
                  class="titleMes">
            <el-col :span="1.5">
              <el-button type="primary"
                         @click="addRow">新增确认单</el-button>
            </el-col>
          </el-row>
          <!-- 表单 -->
          <el-table :data="tableData"
                    style="width: 100%;">
            <el-table-column prop="number"
                             label="编号">
            </el-table-column>
            <el-table-column prop="item"
                             label="审计（调查）事项">
            </el-table-column>
            <el-table-column prop="responsible"
                             label="责任人">
            </el-table-column>
            <el-table-column prop="problemNum"
                             label="问题数">
            </el-table-column>
            <el-table-column prop="accessory"
                             label="确认单附件">
              <template slot-scope="scope">

                <el-dropdown>
                  <div class="update pointer">
                    <i class="el-icon-folder orange"></i>
                    <span class="blue">2</span>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item disabled>文件名称</el-dropdown-item>
                    <el-dropdown-item divided>文件.xls</el-dropdown-item>
                    <el-dropdown-item>文件2.xls</el-dropdown-item>
                    <el-dropdown-item>文件3.xls</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="handle-list">
                  <div class="blue pointer"
                       @click="editRow(scope.row)">编辑</div>
                  <el-upload :show-file-list="false">
                    <div class="blue pointer"
                         @click="uploadFile">上传附件</div>
                  </el-upload>
                  <div class="red pointer"
                       @click="deteleRow(scope.$index)">删除</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="最终版扫描件">
              <template slot-scope="scope">
                <el-upload :show-file-list="false"
                           v-if="!scope.row.scan">
                  <div class="blue pointer"
                       @click="uploadScan">上传</div>
                </el-upload>
                <div class="blue pointer"
                     v-else>{{scope.row.scan}}</div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 表单 end-->
        </div>

        <!-- 分页 -->
        <div class="page">
          <el-pagination background
                         layout="prev, pager, next"
                         :total="1000">
          </el-pagination>
        </div>
        <!-- 分页 end-->
      </div>
    </div>
    <!-- 新增确认单 -->
    <el-dialog title="新增确认单"
               :append-to-body='true'
               :visible.sync="addVisible"
               :destroy-on-close="true"
               width="70%">
      <AuditConfirmationAdd></AuditConfirmationAdd>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑确认单 -->
    <el-dialog title="编辑确认单"
               :append-to-body='true'
               :visible.sync="editVisible"
               :destroy-on-close="true"
               width="70%">
      <AuditConfirmationEdit></AuditConfirmationEdit>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AuditConfirmationAdd from "../AuditConfirmationAdd/index";
import AuditConfirmationEdit from "../AuditConfirmationEdit/index";
export default {
  components: {
    AuditConfirmationAdd,
    AuditConfirmationEdit,
  },
  data () {
    return {
      tableData: [
        {
          number: "001",
          item: "事项xxxx",
          responsible: "小明",
          problemNum: "5",
          accessory: "3",
          scan: "123.jpg",
        },
        {
          number: "002",
          item: "事项xxxx",
          responsible: "小明",
          problemNum: "5",
          accessory: "3",
        },
        {
          number: "003",
          item: "事项xxxx",
          responsible: "小明",
          problemNum: "5",
          accessory: "3",
        },
        {
          number: "004",
          item: "事项xxxx",
          responsible: "小明",
          problemNum: "5",
          accessory: "3",
        },
        {
          number: "005",
          item: "事项xxxx",
          responsible: "小明",
          problemNum: "5",
          accessory: "3",
        },
        {
          number: "006",
          item: "事项xxxx",
          responsible: "小明",
          problemNum: "5",
          accessory: "3",
        },
      ],
      addVisible: false,
      editVisible: false,
    };
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    // 新增
    addRow () {
      this.addVisible = true;
    },
    addSubmit () {
      this.addVisible = false;
      this.$message({
        message: "新增成功！",
        type: "success",
      });
    },
    // 编辑
    editRow () {
      this.editVisible = true;
    },
    editSubmit () {
      this.editVisible = false;
      this.$message({
        message: "编辑成功！",
        type: "success",
      });
    },
    getFile () { },
    // 上传附件
    uploadFile () { },
    // 删除
    deteleRow (index) {
      this.tableData.splice(index, 1);
    },
    // 上传扫描件
    uploadScan () { },
  },
};
</script>

<style lang="scss" scoped>
.sjqrd {
  .orange {
    color: #fd9d27;
  }
  .blue {
    color: #0d87d6;
  }
  .red {
    color: #db2526;
  }
  .pointer {
    cursor: pointer;
  }
  .conter {
    width: 100%;
    float: left;
  }
  .titleMes {
    padding: 10px 0 0;
    box-sizing: border-box;
  }
  >>> .el-table__header {
    border-top: none !important;
  }
  .update {
    display: flex;
    align-items: center;
    .update_icon {
      width: 15px;
      height: 15px;
      svg {
        float: left;
        width: 15px;
        height: 15px;
      }
    }
    span {
      color: #1371cc;
      margin-left: 5px;
    }
  }

  .handle-list {
    display: flex;
    flex-wrap: nowrap;
    padding-right: 5%;
    > div {
      padding-right: 10px;
      white-space: nowrap;
    }
  }

  .page {
    width: 100%;
    padding: 20px 10px;
    display: flex;
    justify-content: flex-end;
  }
}

.sjqrd .el-table ::v-deep .el-table__header {
  border: none !important;
}
</style>
