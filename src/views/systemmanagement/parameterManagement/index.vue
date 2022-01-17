<template>
  <div class="parameterManagement">
    <!-- 模糊查询分类名称 -->
    <el-row :gutter="24"
            style="padding: 5px">
      <el-col :span="20">
        <el-button style="background: #0c87d6; color: #fff"
                   @click="addDictionary">新增</el-button>
      </el-col>
      <el-col :span="4">
        <div class="search">
          <el-input placeholder="请输入分类名称"
                    v-model="maintainDictionaryList.condition.typename"
                    @keyup.enter.native="queryNameInput">
          </el-input>
          <div class="search_icon"
               style="background: rgb(12, 135, 214) !important"
               @click="queryNameInput">
            <i class="el-icon-search"
               style="color: white"></i>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 分类表格 -->
    <el-table ref="singleTable"
              highlight-current-row
              :data="maintableData"
              style="width: 100%"
              stripe
              :header-cell-style="{ 'background-color': '#F4FAFF' }">
      <el-table-column type="selection"
                       width="100"></el-table-column>
      <el-table-column type="index"
                       width="150"
                       label="序号"> </el-table-column>

      <el-table-column align="center"
                       property="typename"
                       label="分类名称">
      </el-table-column>
      <el-table-column align="center"
                       property="typecode"
                       label="分类编码">
      </el-table-column>
      <el-table-column align="center"
                       label="操作"
                       width="200px">
        <template slot-scope="scope">
          <el-button type="text"
                     style="color: #1371cc"
                     size="small"
                     @click="maintainDictionary(scope.row)">维护字典</el-button>
          <el-button type="text"
                     style="color: #1371cc"
                     size="small"
                     @click="editDictionary(scope.row.uuid)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="maintainDictionaryList.pageNo"
                :limit.sync="maintainDictionaryList.pageSize"
                @pagination="queryName" />
    <!-- 分页end -->

    <!-- 维护字典弹框 -->
    <el-dialog :append-to-body='true'
               :visible.sync="mainDialogVisible"
               width="50%"
               @open="openDialog"
               @close="handleClose">
      <div class="mainTitle">维护字典</div>

      <el-row :gutter="40"
              style="padding: 30px">
        <el-col :span="8"
                class="lefttree">
          <el-input placeholder="输入关键字进行过滤"
                    v-model="filterText">
          </el-input>

          <el-tree :data="orgTree"
                   :expand-on-click-node="false"
                   :filter-node-method="filterNode"
                   :props="defaultProps"
                   @node-click="getCheckedNodes"
                   class="filter-tree"
                   default-expand-all
                   highlight-current
                   node-key="value"
                   ref="tree">
            <span class="custom-tree-node content-style"
                  slot-scope="{ node, data }">
              <span>
                <i :class="['el-icon-lollipop']"></i>
                {{ node.label }}
              </span>
              <span>
                <i @click.stop="append(data)"
                   class="el-icon-plus icon-cursor content-style-i"
                   style="font-size: 18px"
                   title="增加"></i>
              </span>
            </span>
          </el-tree>
        </el-col>

        <el-col :span="16"
                class="righttable">
          <div class="probleminfo">
            <div style="
                border-radius: 10px;
                margin: 0 auto;
                height: 40px;
                line-height: 40px;
              ">
              <span style="
                  font-family: Microsoft YaHei;
                  font-weight: bold;
                  margin-left: 20px;
                  float: left;
                ">字典基本信息</span>
              <div style="float: right; margin-right: 40px">
                <el-button @click="edit"
                           class="el-icon-edit icon-cursor"
                           size="mini"
                           title="编辑"
                           type="primary"
                           v-show="editicon">编辑</el-button>
              </div>
            </div>
            <!-- 信息编辑 -->
            <template v-if="editpanel">
              <div class="edit">
                <el-form :model="form"
                         :rules="rules"
                         label-width="80px"
                         ref="formRef"
                         hide-required-asterisk>
                  <el-row>
                    <el-col :offset="2"
                            :span="20">
                      <el-form-item label="字典名称"
                                    prop="dictname">
                        <el-input v-model="form.dictname"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :offset="2"
                            :span="20">
                      <el-form-item label="字典编码"
                                    prop="dictcode">
                        <!-- <span v-if="this.form.uuid">{{
                          this.form.dictcode
                        }}</span> -->
                        <el-input v-model="form.dictcode"
                                  :disabled="isInput"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :offset="1"
                            :span="21">
                      <el-form-item align="center">
                        <el-button @click="formOnSubmit()"
                                   style="background: #0c87d6; color: #fff"
                                   :disabled="isdisabled">保存并关闭</el-button>
                        <el-button @click="formOnCancle()">取消</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </template>

            <template v-else>
              <div class="content-style">
                <el-row>
                  <el-col :offset="1"
                          :span="20"
                          style="margin-top: 20px">
                    <label class="label-style">字典名称</label>:
                    <span>{{ treeData.dictname }}</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :offset="1"
                          :span="20"
                          style="margin-top: 20px">
                    <label class="label-style">字典编码</label>:
                    <span>{{ treeData.dictcode }}</span>
                  </el-col>
                </el-row>
              </div>
            </template>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 新增编辑字典弹框 -->
    <el-dialog :append-to-body='true'
               :visible.sync="add_dictionary"
               width="30%"
               @close="closeDialog('dictionaryRef')">

      <div class="mainTitle"
           v-if="isAdd == 1">新增</div>
      <div class="mainTitle"
           v-if="isAdd == 2">编辑</div>

      <div class="formStyle">
        <el-form :model="dictionaryForm"
                 label-width="90px"
                 :rules="dictionaryRules"
                 ref="dictionaryRef">
          <el-form-item prop="typename"
                        label="分类名称:">
            <el-input v-model="dictionaryForm.typename"> </el-input>
          </el-form-item>
          <el-form-item prop="typecode"
                        label="分类编码:">
            <el-input v-model="dictionaryForm.typecode"
                      :disabled="editTypeDis"> </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="footerBtn">
        <el-button @click="add_dictionary = false">取消</el-button>
        <el-button @click="editSave"
                   style="background: #0c87d6; color: #fff"
                   :disabled="isdisabled">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  get_dictionary,
  dictionaryList_Code,
  addDictionaryList,
  dictionaryList_load,
  dictionaryChild_load,
  addDictionaryChild,
} from "@SDMOBILE/api/shandong/maintainDictionary";
import Pagination from "@WISDOMAUDIT/components/Pagination";
export default {
  components: { Pagination },
  data () {
    return {
      // 维护字典列表数据
      maintableData: [],
      total: 0, //列表总条数
      mainDialogVisible: false, //维护字典弹框
      add_dictionary: false, //增加编辑字典弹框
      isAdd: 0, //判断是增加还是编辑
      editTypeDis: false, //编辑分类编码禁用
      dictionaryForm: {
        //增加编辑字典弹框表单数据
        typename: "",
        typecode: "",
        typerank: 2,
      },
      orgTree: [], //树形数据
      treeData: {
        typeCode: "",
        pdictid: "",
        uuid: "",
        dictname: "",
        dictcode: "",
      },
      defaultProps: { children: "children", label: "label" },
      editicon: true,
      editpanel: false, //编辑字典页面
      form: {
        typecode: "",
        pdictid: "",
        uuid: "",
        dictname: "",
        dictcode: "",
        isUsed: "1",
      },
      filterText: "",
      rules: {
        dictname: [
          { required: true, message: "请输入字典名称", trigger: "blur" },
        ],
        dictcode: [
          { required: true, message: "请输入字典名称", trigger: "blur" },
        ],
      },
      dictionaryRules: {
        //增加编辑分类名称校验
        typename: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        typecode: [
          { required: true, message: "请输入分类编码", trigger: "blur" },
        ],
      },
      // 维护字典列表入参
      maintainDictionaryList: {
        condition: {
          typename: "",
        },
        pageNo: 1,
        pageSize: 10,
      },
      isdisabled: false,
      isInput: false, //编辑字典编码
    };
  },
  created () {
    //获取维护字典列表接口
    this.getDictionary(this.maintainDictionaryList);
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    // 模糊查询
    queryNameInput () {
      let query = {
        condition: {
          typename: this.maintainDictionaryList.condition.typename,
        },
        pageNo: 1,
        pageSize: 10,
      };
      this.getDictionary(query);
    },
    queryName () {
      this.maintainDictionaryList.condition.typename = "";
      this.getDictionary(this.maintainDictionaryList);
    },
    //参数管理table获取
    getDictionary (data) {
      get_dictionary(data).then((resp) => {
        this.maintableData = resp.data.records;
        this.total = resp.data.total;
      });
    },
    //新增字典按钮事件
    addDictionary () {
      this.isAdd = 1;
      this.add_dictionary = true;
    },
    //编辑字典按钮事件
    editDictionary (id) {
      this.editTypeDis = true;
      this.isAdd = 2;
      this.add_dictionary = true;
      //编辑回显接口
      dictionaryList_load(id).then((resp) => {
        console.log(resp);
        this.dictionaryForm = resp.data;
      });
    },
    //增加编辑字典完成按钮
    editSave () {
      this.$refs["dictionaryRef"].validate((valid) => {
        if (valid) {
          this.isdisabled = true;
          if (this.isAdd == 2) {
            // 增加编辑字典接口
            addDictionaryList(this.dictionaryForm).then((resp) => {
              this.add_dictionary = false;
              this.getDictionary(this.maintainDictionaryList);
            });
          }
          if (this.isAdd == 1) {
            this.dictionaryForm.uuid = "";
            // 增加编辑字典接口
            addDictionaryList(this.dictionaryForm).then((resp) => {
              this.add_dictionary = false;
              this.getDictionary(this.maintainDictionaryList);
            });
          }
          setTimeout(() => {
            this.isdisabled = false;
          }, 3000);
        }
      });
    },
    // 增加编辑字典弹框关闭事件
    closeDialog (dictionaryRef) {
      this.editTypeDis = false;
      this.$refs[dictionaryRef].resetFields();
    },
    //维护字典按钮事件
    maintainDictionary (rows) {
      this.mainDialogVisible = true;
      this.form.typecode = rows.typecode;
      dictionaryList_Code(rows.typecode).then((resp) => {
        this.orgTree = resp.data;
      });
    },
    //维护字典弹框弹开事件
    openDialog () { },
    // 弹框关闭事件
    handleClose () {
      this.treeData.typecode = "";
      this.treeData.pdictid = "";
      this.treeData.uuid = "";
      this.treeData.dictname = "";
      this.treeData.dictcode = "";

      this.form = {};
      this.editpanel = false;
      this.editicon = true;
    },

    //节点显示与隐藏
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    // 点击查看树信息
    getCheckedNodes (data) {
      if (this.editpanel) {
        return this.$message({
          showClose: true,
          message: "请将基本信息完成或者取消！",
          type: "warning",
        });
      } else {
        if (data.value === this.orgTree[0].value) {
          return this.$message({
            showClose: true,
            message: "根节点在此处不可查看！",
            type: "warning",
          });
        } else {
          this.editpanel = false;
          this.editicon = true;
          dictionaryChild_load(data.value).then((resp) => {
            this.treeData = resp.data;
            // console.log(this.treeData);
          });
        }
      }
    },

    // 增加
    append (data) {
      if (this.editpanel) {
        return this.$message({
          showClose: true,
          message: "请将基本信息完成或者取消！",
          type: "warning",
        });
      }
      this.form.pdictid = data.value;
      this.form.uuid = this.form.dictName = this.form.dictCode = "";
      this.editpanel = true;
      this.editicon = false;
      this.isInput = false;
    },

    // 编辑
    edit () {
      if (this.treeData.dictname !== "" && this.treeData.dictcode !== "") {
        this.editpanel = true;
        this.editicon = false;
        this.isInput = true;
        this.form = JSON.parse(JSON.stringify(this.treeData)); // clone到form，避免双向绑定
      } else {
        this.$message.warning("请选择要编辑的字典！");
      }
    },

    //新增编辑树形字典确认事件
    formOnSubmit () {
      this.$refs["formRef"].validate((valid) => {
        if (valid) {
          this.isdisabled = true;
          addDictionaryChild(this.form).then((resp) => {
            if (resp.code === 0) {
              this.form.uuid = resp.data.uuid;
              this.treeData = JSON.parse(JSON.stringify(this.form));
              this.$refs["formRef"].resetFields();
              this.form.pdictid =
                this.form.uuid =
                this.form.dictname =
                this.form.dictcode =
                "";
              this.editpanel = false;
              this.editicon = true;
              this.maintainDictionary(this.form);
            }
          });
          setTimeout(() => {
            this.isdisabled = false;
          }, 3000);
        }
      });
    },

    //取消编辑事件
    formOnCancle () {
      this.form.dictname = "";
      this.form.dictcode = "";
      // let that = this;
      // this.$nextTick(() => {
      //   that.$refs["formRef"].resetFields();
      // });
      this.editpanel = false;
      this.editicon = true;
    },
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.parameterManagement {
  padding: 1%;
  // border: 1px solid red;
}
.lefttree {
  height: 500px;
  overflow-y: auto;
  overflow-x: auto;
  .el-tree.filter-tree {
    margin-top: 15px;
  }
}
.el-tree .content-style {
  border: 0 none;
  padding-bottom: 0;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.righttable .content-style {
  padding-bottom: 20px;
}
.label-style {
  width: 120px;
}

.el-icon-lollipop {
  color: #ecd229;
}
.edit {
  width: 75%;
}
.formStyle {
  // border: 1px solid red;
  padding: 5%;
}
.footerBtn {
  width: 100%;
  padding: 2%;
  // border: 1px solid red;
  text-align: center;
}
</style>
<style scoped>
@import "../../../assets/styles/css/yw.css";
.edit >>> .el-form-item__label {
  width: 90px;
  height: 100%;
  display: block;
  text-align: right;
  float: left !important;
}
.edit >>> .el-form-item {
  width: 100%;
  margin-bottom: 20px !important;
}
.formStyle >>> .el-form {
  width: 400px;
  margin: 0 auto;
}
.formStyle {
  padding: 5%;
  float: left;
  width: 100%;
  text-align: center;
}
.mainTitle {
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid #d2d2d2;
}
.formStyle >>> .el-input__inner {
  width: 100%;
  /* padding-bottom: 15px; */
  box-sizing: border-box;
}
.formStyle >>> .el-form-item {
  float: left;
  width: 100%;
  margin-bottom: 20px !important;
}
.formStyle >>> .el-form-item__label {
  width: 90px;
  height: 100%;
  display: block;
  text-align: right;

  float: left !important;
}
.el-form-item__content {
  width: 290px;
  float: left;
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
  width: 100% !important;
  display: flex;
  float: right;
  border-radius: 0 !important;
}
.search >>> .search_icon {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0%;
  width: 36px;
  height: 36px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border-radius: 0 5px 5px 0;
}
.search >>> .el-input__inner::-webkit-input-placeholder {
  color: #c0c4cc !important;
}
.parameterManagement >>> .el-dialog__body {
  padding: 5px 0 !important;
}

.formStyle >>> .el-input.is-disabled .el-input__inner {
  background-color: #f5f7fa !important;
  color: #c0c4cc !important;
}
.lefttree >>> .el-input__inner::-webkit-input-placeholder {
  color: #c0c4cc !important;
}
.edit >>> .el-input.is-disabled .el-input__inner {
  background-color: #f5f7fa !important;
  color: #c0c4cc !important;
}
</style>
