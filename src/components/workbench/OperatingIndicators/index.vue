<template>
  <div class="sjzl">
    <!-- tab 切换 -->

    <el-tabs v-model="activeName"
             @tab-click="handleClick">
      <div class="projectTab">

        <el-row class="titleMes">
          <el-col :span="1.5"
                  class="add">
            <el-button type="primary"
                       @click="addData">新增指标</el-button>
          </el-col>

          <el-col :span="1.5">
            <el-button type="primary"
                       @click="quote">引用</el-button>
          </el-col>
        </el-row>

        <el-row class="titleMes"
                type="flex"
                justify="end">
          <el-col :span="1.5">
            <el-button class="btn"
                       v-if="!btn"
                       disabled>审核</el-button>
            <el-button class="btn"
                       v-if="!btn"
                       disabled>下发</el-button>

            <el-button type="primary"
                       v-if="btn"
                       @click="toExamine">审核</el-button>
            <el-button type="primary"
                       v-if="btn"
                       @click="Issue">下发</el-button>
          </el-col>
        </el-row>
        <el-table :data="tableData"
                  style="width: 100%"
                  @select="Selects">
          <el-table-column type="selection"
                           width="55"> </el-table-column>
          <el-table-column prop="date"
                           label="指标类型"> </el-table-column>
          <el-table-column prop="name"
                           label="指标名称"> </el-table-column>
          <el-table-column prop="province"
                           label="单位"> </el-table-column>
          <el-table-column prop="city"
                           label="提供资料部门"> </el-table-column>
          <el-table-column prop="address"
                           label="取数口径或公式">
          </el-table-column>
          <el-table-column prop="zip16"
                           label="指标值(2016)"> </el-table-column>
          <el-table-column prop="zip17"
                           label="指标值(2017)"> </el-table-column>
          <el-table-column prop="zip18"
                           label="指标值(2018)"> </el-table-column>
          <el-table-column prop="state"
                           label="状态"> </el-table-column>
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
    </el-tabs>
    <el-dialog :title="title"
               :append-to-body='true'
               :visible.sync="isAdd"
               v-if="isAdd"
               :destroy-on-close="true"
               width="800px"
               center>
      <el-divider></el-divider>
      <el-form :model="form">
        <el-row :gutter="80">
          <el-col :span="12">
            <el-form-item label="指标类型:"
                          required
                          :label-width="formLabelWidth">
              <el-input v-model="formState.name"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="父指标名:"
                          :label-width="formLabelWidth">
              <el-input v-model="formState.name"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="80">
          <el-col :span="12">
            <el-form-item label="指标单位:"
                          required
                          :label-width="formLabelWidth">
              <el-select v-model="value"
                         placeholder="请选择指标单位">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="资料提供部门:"
                          required
                          :label-width="formLabelWidth">
              <el-select v-model="department"
                         placeholder="请选择资料提供部门">
                <el-option v-for="item in departments"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="80">
          <el-col :span="12">
            <el-form-item label="联系人员:"
                          required
                          :label-width="formLabelWidth">
              <el-select v-model="contacts"
                         placeholder="请选择联系人员">
                <el-option v-for="item in contactss"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="指标名称:"
                          required
                          :label-width="formLabelWidth">
              <el-input v-model="formState.name"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="80">
          <el-col :span="12">
            <el-form-item label="指标编号:"
                          :label-width="formLabelWidth">
              <el-input v-model="formState.name"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="取数口径:"
                          :label-width="formLabelWidth">
              <el-input v-model="formState.name"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="指标状态:"
                          required
                          :label-width="formLabelWidth">
              <el-radio v-model="radio"
                        label="1">启用</el-radio>
              <el-radio v-model="radio"
                        label="2">停用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="isAdd = false">取 消</el-button>
        <el-button class="btns"
                   @click="isAdd = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="titles"
               :append-to-body='true'
               :visible.sync="isQuote"
               v-if="isQuote"
               :destroy-on-close="true"
               width="80%">
      <el-divider></el-divider>

      <el-row type="flex"
              :gutter="20"
              justify="space-between"
              class="search">
        <el-col :span="8"
                class="nameziliao">
          <div class="kuan">资料名称:</div>
          <el-input v-model="name"
                    placeholder="请输入关键字"></el-input>
        </el-col>
        <el-button type="primary">查询</el-button>
      </el-row>
      <div>
        <el-row type="flex"
                :gutter="20"
                justify="space-between"
                class="searchList">
          <el-col :span="8"
                  class="nameziliao">
            <div>查询结果</div>
          </el-col>
          <el-button type="primary"
                     @click="isQuote=false">确定</el-button>
        </el-row>
        <el-table :data="tableDatas"
                  border
                  style="width: 100%">
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column prop="date"
                           label="指标类型"
                           width="180">
          </el-table-column>
          <el-table-column prop="name"
                           label="指标名称"
                           width="180">
          </el-table-column>
          <el-table-column prop="address"
                           label="单位">
          </el-table-column>
          <el-table-column prop="bumen"
                           label="资料提供部门">
          </el-table-column>
          <el-table-column prop="gongshi"
                           label="取数口径或公式">
          </el-table-column>
          <el-table-column prop="times"
                           label="修改日期">
          </el-table-column>
          <el-table-column prop="zhuangtai"
                           label="状态">
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination background
                         layout="prev, pager, next"
                         :total="1000">
          </el-pagination>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      titles: "",
      radio: "1",
      value: "%",
      title: "",
      formState: {
        username: "",
        email: "",
        roleCheckedList: [],
        name: "",
        state: "启用",
        describe: "",
        time: "",
        route: "",
        url: "",
      },
      contacts: "方静",
      contactss: [
        {
          value: "方静",
          label: "方静",
        },
        {
          value: "小明",
          label: "小明",
        },
        {
          value: "。。。",
          label: "。。。",
        },
      ],
      department: "财务部",
      departments: [
        {
          value: "财务部",
          label: "财务部",
        },
        {
          value: "。。。",
          label: "。。。",
        },
      ],
      options: [
        {
          value: "%",
          label: "%",
        },
        {
          value: "分",
          label: "分",
        },
        {
          value: "元",
          label: "元",
        },
        {
          value: "万元",
          label: "万元",
        },
        {
          value: "亿元",
          label: "亿元",
        },
        {
          value: "万户",
          label: "万户",
        },
        {
          value: "万元/人",
          label: "万元/人",
        },
        {
          value: "家",
          label: "家",
        },
        {
          value: "个",
          label: "个",
        },
      ],
      tableDatas: [
        {
          date: '资产、捐赠及收入结构指标',
          name: '经营业绩考核得分',
          address: '分',
          bumen: '财务部',
          gongshi: '省公司下达当年度经营业绩效考核得分',
          times: '2021-10-10',
          zhuangtai: '启用',
        }, {
          date: '资产、捐赠及收入结构指标',
          name: '经营业绩考核得分',
          address: '分',
          bumen: '财务部',
          gongshi: '省公司下达当年度经营业绩效考核得分',
          times: '2021-10-10',
          zhuangtai: '启用',
        }, {
          date: '资产、捐赠及收入结构指标',
          name: '经营业绩考核得分',
          address: '分',
          bumen: '财务部',
          gongshi: '省公司下达当年度经营业绩效考核得分',
          times: '2021-10-10',
          zhuangtai: '启用',
        }, {
          date: '资产、捐赠及收入结构指标',
          name: '经营业绩考核得分',
          address: '分',
          bumen: '财务部',
          gongshi: '省公司下达当年度经营业绩效考核得分',
          times: '2021-10-10',
          zhuangtai: '启用',
        }, {
          date: '资产、捐赠及收入结构指标',
          name: '经营业绩考核得分',
          address: '分',
          bumen: '财务部',
          gongshi: '省公司下达当年度经营业绩效考核得分',
          times: '2021-10-10',
          zhuangtai: '启用',
        },
      ],
      isAdd: false,
      isQuote: false,
      btn: false,
      activeName: 0,
      // color: '',   // 上传文件icon 颜色
      toExamineIndex: [],
      toExamineData: [],
      tableData: [
        {
          index: "1",
          date: "资产、捐赠及收入结构指标",
          name: "经营业绩考核得分",
          province: "分",
          city: "财务部",
          address: "省公司下达当年度经营业绩效考核得分",
          zip16: "34%",
          zip17: "24%",
          zip18: "10%",
          state: "-",
        },
        {
          index: "2",
          date: "资产、捐赠及收入结构指标",
          name: "经营业绩考核得分",
          province: "分",
          city: "财务部",
          address: "省公司下达当年度经营业绩效考核得分",
          zip16: "34%",
          zip17: "24%",
          zip18: "10%",
          state: "-",
        },
        {
          index: "3",
          date: "资产、捐赠及收入结构指标",
          name: "经营业绩考核得分",
          province: "分",
          city: "财务部",
          address: "省公司下达当年度经营业绩效考核得分",
          zip16: "34%",
          zip17: "24%",
          zip18: "10%",
          state: "-",
        },
        {
          index: "4",
          date: "资产、捐赠及收入结构指标",
          name: "经营业绩考核得分",
          province: "分",
          city: "财务部",
          address: "省公司下达当年度经营业绩效考核得分",
          zip16: "34%",
          zip17: "24%",
          zip18: "10%",
          state: "-",
        },
        {
          index: "5",
          date: "资产、捐赠及收入结构指标",
          name: "经营业绩考核得分",
          province: "分",
          city: "财务部",
          address: "省公司下达当年度经营业绩效考核得分",
          zip16: "34%",
          zip17: "24%",
          zip18: "10%",
          state: "-",
        },
        {
          index: "6",
          date: "资产、捐赠及收入结构指标",
          name: "经营业绩考核得分",
          province: "分",
          city: "财务部",
          address: "省公司下达当年度经营业绩效考核得分",
          zip16: "34%",
          zip17: "24%",
          zip18: "10%",
          state: "-",
        },
        {
          index: "7",
          date: "资产、捐赠及收入结构指标",
          name: "经营业绩考核得分",
          province: "分",
          city: "财务部",
          address: "省公司下达当年度经营业绩效考核得分",
          zip16: "34%",
          zip17: "24%",
          zip18: "10%",
          state: "-",
        },
        {
          index: "8",
          date: "资产、捐赠及收入结构指标",
          name: "经营业绩考核得分",
          province: "分",
          city: "财务部",
          address: "省公司下达当年度经营业绩效考核得分",
          zip16: "34%",
          zip17: "24%",
          zip18: "10%",
          state: "-",
        },
        {
          index: "9",
          date: "资产、捐赠及收入结构指标",
          name: "经营业绩考核得分",
          province: "分",
          city: "财务部",
          address: "省公司下达当年度经营业绩效考核得分",
          zip16: "34%",
          zip17: "24%",
          zip18: "10%",
          state: "-",
        },
        {
          index: "10",
          date: "资产、捐赠及收入结构指标",
          name: "经营业绩考核得分",
          province: "分",
          city: "财务部",
          address: "省公司下达当年度经营业绩效考核得分",
          zip16: "34%",
          zip17: "24%",
          zip18: "10%",
          state: "-",
        },
      ],
    };
  },
  computed: {},
  watch: {},
  methods: {
    quote () {
      this.titles = "经营指标列表";
      this.isQuote = true;
    },
    addData () {
      this.title = "经营指标新增";
      this.isAdd = true;
    },
    toExamine () {
      for (let i = 0; i < this.toExamineData.length; i++) {
        this.tableData[this.toExamineData[i].index - 1].state = "反馈中";
        // console.log(this.tableData[this.toExamineData[i].index-1],9999999);
      }
    },
    Issue () {
      for (let i = 0; i < this.toExamineData.length; i++) {
        this.tableData[this.toExamineData[i].index - 1].state = "已下发";
        // console.log(this.tableData[this.toExamineData[i].index-1],9999999);
      }
    },
    Selects (selection, row) {
      if (selection.length == 0) {
        this.btn = false;
      }
      if (selection.length != 0) {
        this.btn = true;
      }
      this.toExamineData = selection;
    },
    handleClick (tab, event) {
      console.log(tab, event);
    },

    deleteRow (index, rows) {
      rows.splice(index, 1);
    },
  },
  created () { },
  mounted () { },
};
</script>

<style scoped>
.searchList {
  background: #eee;
  margin-top: 10px;
  padding: 1% 3% 1% 0;
}
.search {
  padding: 20px 10%;
  background: #eee;
}
.nameziliao {
  display: flex;
  align-items: center;
}
.kuan {
  width: 50%;
}
.add {
  margin-right: 10px;
}
.el-tabs {
  padding: 1%;
}

.el-form {
  padding: 0 30px;
}
.btns {
  background: dodgerblue !important;
  color: #fff !important;
}
.btn {
  background: #ccc !important;
  color: black !important;
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
.titleMes {
  padding: 10px 0 0;
  box-sizing: border-box;
}
.table {
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
</style>
