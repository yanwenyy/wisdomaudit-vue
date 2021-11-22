<template>
  <div>
    <div class="conter ">
      <!-- tab 切换 -->
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <!-- 资料清单 -->
        <el-tab-pane label="资料清单"
                     name="0">
          <!-- 新增 筛选-->
          <el-row class="titleMes">
            <el-col :span="1.5">
              <el-button type="primary"
                         style="border:none;"
                         @click="add_data_click()"
                         v-if="is_add==1">新增资料</el-button>
            </el-col>
            <!-- 筛选 -->
            <div class="search">
              <el-input placeholder="请输入资料标题"
                        v-model="search_title"> </el-input>
              <div class="search_icon"
                   style="background: rgb(12, 135, 214) !important;"
                   @click="search_list(1)">
                <i class="el-icon-search"
                   style="color: rgba(255, 255, 255, 1);"></i>
              </div>
            </div>
          </el-row>

          <el-table :data="tableData_list"
                    style="width: 100%;"
                    v-loading="loading"
                    :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}">

            <el-table-column type="index"
                             align="center"
                             label="序号">
            </el-table-column>
            <!-- 资料名称 -->
            <el-table-column prop="title"
                             align="center"
                             show-overflow-tooltip
                             label="资料名称">
              <template slot-scope="scope"
                        style="color: rgb(19, 113, 204);">
                {{  scope.row.title }}
              </template>

            </el-table-column>
            <!-- 资料分类 -->
            <el-table-column prop="title"
                             align="center"
                             show-overflow-tooltip
                             label="资料分类">
            </el-table-column>
            <!-- 来源项目 -->
            <el-table-column prop="title"
                             align="center"
                             show-overflow-tooltip
                             label="来源项目">
            </el-table-column>
            <!-- 资料简介 -->
            <el-table-column prop="title"
                             align="center"
                             show-overflow-tooltip
                             label="资料简介">
            </el-table-column>
            <!-- 创建人 -->
            <el-table-column prop="title"
                             align="center"
                             show-overflow-tooltip
                             label="创建人">
            </el-table-column>
            <!-- 创建时间 -->
            <el-table-column prop="title"
                             align="center"
                             show-overflow-tooltip
                             label="创建时间">
            </el-table-column>
            <!-- 下载总次数 -->
            <el-table-column prop="title"
                             align="center"
                             show-overflow-tooltip
                             label="下载总次数">
            </el-table-column>
            <!-- 操作 -->
            <el-table-column prop="title"
                             align="center"
                             show-overflow-tooltip
                             label="操作">
              <template slot-scope="scope">
                <el-button @click="edit(scope.row)"
                           type="text"
                           :disabled="isDisable"
                           style="color:#1371CC;background:none;border:none"
                           size="small">
                  编辑
                </el-button>

                <el-button @click="file_list(scope.row)"
                           type="text"
                           :disabled="isDisable"
                           style="color:#1371CC;background:none;border:none"
                           size="small">
                  文件管理
                </el-button>

                <el-button @click="remove(scope.row)"
                           type="text"
                           :disabled="isDisable"
                           style="color:red;background:none;border:none"
                           size="small">
                  删除
                </el-button>
              </template>
            </el-table-column>

          </el-table>
          <!-- 分页 -->
          <div class="page">
            <!-- <el-pagination @size-change="handleSizeChange_data"
                         @current-change="handleCurrentChange_data"
                         :page-size="this.tableData.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="this.tableData.total">
          </el-pagination> -->

          </div>
          <!-- 分页 end-->
        </el-tab-pane>
        <!-- 资料清单 end -->
        <!-- 主要发现 -->
        <el-tab-pane label="主要发现"
                     name="1">
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 资料清单 新增 -->
    <el-dialog title=""
               center
               :close-on-click-modal="false"
               @close="resetForm('add_data')"
               :visible.sync="dialogVisible"
               width="30%">
      <div class="title_dlag">{{edit_title}} </div>

      <div class="dlag_conter">

        <el-form label-width="80px"
                 :rules="rules"
                 :model="add_data"
                 ref="add_data">
          <el-form-item label="资料标题">
            <el-input v-model="add_data.title"
                      placeholder="请输入资料标题"></el-input>
          </el-form-item>

          <el-form-item label="资料分类">
            <el-select v-model="add_data.select"
                       placeholder="请选择资料分类">
              <el-option v-for="item in options_select"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="来源项目">
            <el-input v-model="add_data.source_project"
                      placeholder="请输入来源项目"></el-input>
          </el-form-item>

          <el-form-item label="资料简介">
            <el-input type="textarea"
                      v-model="add_data.source_project"
                      placeholder="请输入资料简介"></el-input>
          </el-form-item>

        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 资料清单 新增 end-->

    <!-- 文件管理 -->
    <el-dialog title=""
               center
               :close-on-click-modal="false"
               :visible.sync="dialogVisible_file"
               width="60%">
      <div class="title_dlag">文件管理 </div>

      <div class="dlag_conter list_conter">
        <!-- 左侧资料树 -->
        <div class="left_data_list">
          <el-tree :data="data_list"
                   :props="defaultProps"
                   class="pageTree"
                   @node-click="handleNodeClick">

            <span class="custom-tree-node content-style"
                  slot-scope="{ node, data }">
              <span>
                <i :class="['el-icon-folder-opened']"></i>
                {{ node.label }}
              </span>

            </span>
          </el-tree>

        </div>
        <!-- 左侧资料树 end-->

        <!-- 右侧内容 -->
        <div class="right_table">
          <el-row class="btn_type">
            <el-col :span="1.5">
              <el-button type="primary">文件下载</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="primary">文件上传</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="primary">删除</el-button>
            </el-col>
          </el-row>

          <!-- <el-table :data="file_table.records"
                    v-loading="loading_file_table"
                    :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
                    style="width: 100%;">
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
          </el-table> -->

        </div>

        <!-- 右侧内容 end-->
      </div>

      <div slot="footer">
        <el-button @click="dialogVisible_file = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogVisible_file = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 文件管理 end-->

  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      activeName: 0,//0:资料清单,1:主要发现
      is_add: 1,//新增
      search_title: '',//筛选
      loading: false,
      tableData_list: [
        { title: '1' }
      ],//
      isDisable: false,
      dialogVisible: false,//弹窗
      edit_title: '添加资料',//新增 编辑 资料清单 弹窗
      // 添加资料清单参数
      add_data: {
        title: '',//标题
        select: '',//分类
        source_project: '',//来源项目
        introduction: '',// 简介
      },
      // 验证 
      rules: {
        title: '',//
      },
      // 资料分类
      options_select: [],

      dialogVisible_file: false,//文件管理弹窗
      // 资料树
      data_list: [
        {
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      file_table: [
        // records:[],
      ],// 文件列表




    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {

  },
  methods: {
    // 顶部tab 切换事件
    handleClick (val, event) {
      if (val.index == 0) {
      } else {
        console.log(2);
      }
    },
    // 资料清单 没页
    handleSizeChange_data (val) {
      // this.tableData.size =val;
    },
    // 资料清单 分页
    handleCurrentChange_data () {

    },
    // 新增资料弹窗
    add_data_click () {
      this.dialogVisible = true;
    },
    // 关闭新增资料弹窗
    resetForm (add_data) {
      this.$refs[add_data].resetFields();//清空添加的值
      this.dialogVisible = false;
    },

    // 编辑
    edit () {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
    },
    // 文件管理
    file_list () {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)

      this.dialogVisible_file = true;
    },
    // 文件管理 资料树
    handleNodeClick (data) {
      console.log(data);
    },
    // 删除
    remove () {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
    },

  },

}
</script>
<style  scoped>
@import "../../../assets/styles/css/lhg.css";
.conter {
  padding: 20px;
  box-sizing: border-box;
}
.titleMes {
  padding: 10px 0 0;
  box-sizing: border-box;
}
/* search */
.projectTab >>> .el-button,
.search >>> .el-input__inner {
  border-radius: 0px;
}
.search {
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.search >>> .el-input__inner {
  width: 220px !important;
}
.search >>> .el-input__inner {
  width: 180px;
  display: flex;
  float: right;
}
.search >>> .search_icon {
  position: absolute;
  top: 0;
  right: 0;
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

/* search :end */

/* 分页 */
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}

/* 分页 end */

/* 弹窗 */
.dlag_conter {
  padding: 20px;
  box-sizing: border-box;
}

.dlag_conter >>> .el-textarea .el-textarea__inner {
  resize: none;
}
.dlag_conter >>> .el-form-item {
  margin-bottom: 20px !important;
  display: flex;
  justify-content: center;
}
.dlag_conter >>> .el-form-item__content {
  margin-left: 0 !important;
}
.dlag_conter >>> .el-input,
.dlag_conter >>> .el-textarea {
  width: 240px;
}

/* 附件管理 */
.list_conter {
  display: flex;
}
.left_data_list {
  border: 1px solid red;
  min-width: 300px;
}
.el-tree {
  background: transparent !important;
}
.el-tree-node__expand-icon {
  background: url("../../../assets/styles/image/buzou2.png") no-repeat;
}
.el-tree-node__expand-icon.is-leaf {
  background: none;
}
.el-icon-folder-opened {
  color: #0e87d6 !important;
}
/* 更换图标库 */
/* .pageTree >>> [class*=" el-icon-"],
[class^="el-icon-"] {
  font-family: "FontAwesome" !important;
} */
/*  动画取消 */
/* .pageTree >>> .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
} */
/*  收起 */
/* .pageTree >>> .el-icon-caret-right:before {
  content: "\f196";
  font-size: 18px;
} */
/* 展开 */
/* .pageTree >>> .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
  content: "\f147";
  font-size: 18px;
} */
.right_table {
  flex: 1;
  padding: 0 10px 0 20px;
  border: 1px solid blue;
  box-sizing: border-box;
}
.btn_type {
  border: 1px solid black;
  display: flex;
  justify-content: space-around;
}
</style>>
