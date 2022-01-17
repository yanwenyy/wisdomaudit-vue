<template>
  <div>
    <el-dialog center
               width="80%"
               title="选择指标"
               :visible.sync="visible"
               :append-to-body="true">
      <div>
        <div class="heder_btn">
          <el-button @click=""
                     type="primary"
                     @click="addIndex"
                     class="subBtn">新增指标</el-button>
        </div>

        <el-table :data="dataList"
                  border
                  highlight-current-row
                  @selection-change="selList"
                  :header-cell-style="{
          'text-align': 'left',
          'background-color': '#F4FAFF',
        }"
                  stripe
                  style="width: 100%;">
          <el-table-column :selectable="selectable"
                           algin="left"
                           type="selection"
                           width="55">
          </el-table-column>
          <el-table-column prop="indexTypeName"
                           show-overflow-tooltip
                           label="指标类型">
          </el-table-column>
          <el-table-column prop="indexName"
                           header-algin="left"
                           align="left"
                           label="指标名称">
          </el-table-column>
          <el-table-column prop="numericSymbolName"
                           header-algin="left"
                           algin="left"
                           label="单位">
          </el-table-column>
          <el-table-column prop="dataProvidingDepartmentName"
                           header-algin="left"
                           algin="left"
                           label="资料提供部门">
          </el-table-column>
          <!--<el-table-column-->
          <!--prop="accessCaliberFormulaName"-->
          <!--header-algin="left"-->
          <!--align="left"-->
          <!--label="取数口径或公式">-->
          <!--</el-table-column>-->
          <el-table-column prop="indexDescription"
                           header-algin="left"
                           align="left"
                           label="指标说明">
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination :current-page="page.current"
                         :page-size="page.size"
                         :page-sizes="[10, 20, 50, 100]"
                         :total="page.total"
                         @current-change="handleCurrentChange"
                         @size-change="handleSizeChange"
                         layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary"
                   @click="sub"
                   class="subBtn">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog center
               :append-to-body='true'
               :visible.sync="dialogFormVisible"
               :close-on-click-modal="false"
               width="50%"
               @close="dialogFormVisible = false,clearTemp()"
               class="qrd-dialog">
      <div class="title">新增指标</div>
      <el-form ref="dataForm"
               :rules="rules"
               :model="temp"
               label-position="right"
               class="zb-form">
        <el-form-item label="指标类型:"
                      prop="indexType">
          <el-select v-model="temp.indexType"
                     placeholder="请选择指标类型"
                     @change="
                      getName(
                        temp.indexType,
                        selectList.zblx,
                        'indexTypeName',
                      )
                    ">
            <el-option v-for="item in selectList.zblx"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指标名称:"
                      prop="indexName">
          <el-input v-model="temp.indexName"
                    placeholder="请输入指标名称" />
        </el-form-item>
        <el-form-item label="单位:"
                      prop="numericSymbol">
          <el-select v-model="temp.numericSymbol"
                     placeholder="请选择单位"
                     @change="
                      getName(
                        temp.numericSymbol,
                        selectList.dw,
                        'numericSymbolName',
                      )
                    ">
            <el-option v-for="item in selectList.dw"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资料提供部门:"
                      prop="dataProvidingDepartment">
          <el-select v-model="temp.dataProvidingDepartment"
                     placeholder="请选择资料提供部门"
                     @change="
                      getName2(
                        temp.dataProvidingDepartment	,
                        selectList.zltgbm,
                        'dataProvidingDepartmentName',
                      )
                    ">
            <el-option v-for="item in selectList.zltgbm"
                       :key="item.auditOrgUuid"
                       :label="item.orgName"
                       :value="item.auditOrgUuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指标说明:">
          <el-input rows="6"
                    type="textarea"
                    v-model="temp.indexDescription"></el-input>
        </el-form-item>
        <!--<el-form-item label="取数口径或公式:" prop="accessCaliberFormula">-->
        <!--<el-select v-model="temp.accessCaliberFormula" placeholder="请选择"-->
        <!--@change="-->
        <!--getName(-->
        <!--temp.accessCaliberFormula	,-->
        <!--selectList.qskjgs,-->
        <!--'accessCaliberFormulaName',-->
        <!--)-->
        <!--">-->
        <!--<el-option-->
        <!--v-for="item in selectList.qskjgs"-->
        <!--:key="item.value"-->
        <!--:label="item.label"-->
        <!--:value="item.value"-->
        <!--&gt;-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="是否同步到指标库:"
                      prop="isAddIndex">
          <el-radio-group v-model="temp.isAddIndex">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false,clearTemp()">取消</el-button>
        <el-button :disabled="isDisable"
                   type="primary"
                   @click="addSave"
                   class="subBtn">保存</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { indexManagement_addList, indexManagement_save, indexManagement_addSave } from
  '@SDMOBILE/api/shandong/ls'
import { select_loadcascader } from
  '@SDMOBILE/api/shandong/data'
import { loadaudittorg, } from "@SDMOBILE/api/shandong/projectmanagement.js";
export default {
  name: "search-list",
  data () {
    return {
      isDisable: false,
      selListShow: [],
      managementProjectUuid: '',
      visible: false,
      dialogFormVisible: false,
      temp: {
        indexType: '',
        indexTypeName: '',
        indexName: '',
        numericSymbol: '',
        numericSymbolName: '',
        dataProvidingDepartment: '',
        dataProvidingDepartmentName: '',
        accessCaliberFormula: '',
        accessCaliberFormulaName: '',
        isAddIndex: false
      },
      dataList: [],
      searchForm: {
        pageNo: 1,
        pageSize: 10,
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      selectList: {
        zblx: [],//指标类型
        dw: [],//单位
        zltgbm: [],//资料提供部门
        qskjgs: [],//取数口径或公式
      },

      options: [
        { value: "xxx1", label: "xxx1" },
        { value: "xxx2", label: "xxx2" },
      ],
      // 新增的表单验证
      rules: {
        indexType: [
          { required: true, message: "请填写指标类型", trigger: "change" },
        ],
        indexName: [
          { required: true, message: "请填写指标名称", trigger: "change" },
        ],
        numericSymbol: [
          { required: true, message: "请填写单位", trigger: "change" },
        ],
        dataProvidingDepartment: [
          { required: true, message: "请填写资料提供部门", trigger: "change" },
        ],
        accessCaliberFormula: [
          {
            required: true,
            message: "请填写取数口径或公式",
            trigger: "change",
          },
        ],
        isAddIndex: [
          {
            required: true,
            message: "请填写是否同步到指标库",
            trigger: "change",
          },
        ],
      },
    }
  },
  methods: {
    selectable (row, index) {
      if (row.ifChecked === true) {
        return false;
      } else {
        return true;
      }
    },
    //获取下拉框的name
    getName (id, list, name) {
      if (id) {
        this.$forceUpdate();
        this.temp[name] = list.find(
          (item) => item.value == id
        ).label;
      }
    },
    getName2 (id, list, name) {
      if (id) {
        this.$forceUpdate();
        this.temp[name] = list.find(
          (item) => item.auditOrgUuid == id
        ).orgName;
      }
    },
    //指标新增确定按钮点击
    addSave () {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 3000)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.isAddIndex === true) {
            this.temp.indexProjectId = '';
          } else {
            this.temp.indexProjectId = this.managementProjectUuid;
          }

          indexManagement_addSave(this.temp).then(resp => {
            if (resp.code == 0) {
              this.$message({
                message: "保存成功",
                type: "success",
              });
              this.dialogFormVisible = false;
              this.init(this.managementProjectUuid);
              this.clearTemp();
            } else {
              this.$message({
                message: resp.data.msg,
                type: "error",
              });
            }
          })
        } else {
          this.$message({
            message: '请完善信息',
            type: "error",
          });
          return false;
        }
      });

    },
    //清空指标新增数据
    clearTemp () {
      this.$refs['dataForm'].resetFields();
      this.temp = {
        indexType: '',
        indexName: '',
        numericSymbolName: '',
        dataProvidingDepartmentName: '',
        accessCaliberFormulaName: '',
        isAddIndex: true,
      }
    },
    //新增指标点击
    addIndex () {
      this.dialogFormVisible = true;
      this.getSelList("indexType", 'zblx')
      this.getSelList("IndexUnit", 'dw')
      loadaudittorg({}).then((resp) => {
        this.selectList.zltgbm = resp.data;
      });
      // this.getSelList("Department",'zltgbm')
      this.getSelList("caliberFormula", 'qskjgs')
    },
    // 初始化
    init (id) {
      this.managementProjectUuid = id;
      this.visible = true;
      let params = {
        pageNo: this.searchForm.pageNo,
        pageSize: this.searchForm.pageSize,
        condition: {
          managementProjectUuid: this.managementProjectUuid
        }
      };
      this.loading = true
      indexManagement_addList(params).then(resp => {
        var datas = resp.data;
        this.dataList = datas.records;
        this.page = {
          current: datas.current,
          size: datas.size,
          total: datas.total
        };
        this.loading = false
      })
    },
    //列表选择
    selList (row) {
      this.selListShow = row
    },
    //生成经营指标
    sub () {
      let params = {
        indexManagementList: this.selListShow,
        managementProjectUuid: this.managementProjectUuid,
      };
      this.loading = true;
      if (this.selListShow.length > 0) {
        indexManagement_save(params).then(resp => {
          if (resp.code == 0) {
            this.$message({
              message: "保存成功",
              type: "success",
            });
            this.visible = false;
            this.$emit('refreshAdd')
          } else {
            this.$message({
              message: resp.data.msg,
              type: "error",
            });
          }
        })
      } else {
        this.visible = false;
      }

    },
    //分页点击
    handleSizeChange (val) {
      this.searchForm.pageSize = val;
      this.init(this.managementProjectUuid);
    },
    handleCurrentChange (val) {
      this.searchForm.pageNo = val;
      this.init(this.managementProjectUuid);
    },
    //获取下拉列表
    getSelList (type, list) {
      select_loadcascader({ typecode: type }).then(resp => {
        var datas = resp.data;
        this.selectList[list] = datas;
      })
    }
  },
}
</script>

<style scoped>
@import "../../../assets/styles/css/yw.css";
.heder_btn {
  float: left;
  text-align: left;
}
.zb-form {
  margin-top: 20px;
}
>>> .zb-form .el-form-item {
  margin-bottom: 20px !important;
}
>>> .zb-form .el-form-item__content {
  width: 60%;
  display: inline-block;
  float: left!important;
}
>>> .zb-form .el-form-item__content .el-input,
>>> .zb-form .el-form-item__content .el-select {
  width: 100%;
}
>>> .zb-form .el-form-item__label {
  width: 20% !important;
  text-align: right !important;
  display: inline-block;
}
.page {
  text-align: right;
}
>>> .qrd-dialog .el-dialog__header,
>>> .qrd-dialog .el-dialog__body {
  padding: 0 !important;
}
>>> .qrd-dialog .el-dialog__headerbtn {
  top: 15px !important;
  right: 15px !important;
}
.qrd-dialog >>> .el-form-item__content {
  text-align: left;
}
</style>
