<template>
  <div class="add-confirmation-popover">
    <el-form ref="form"
             :model="form">
      <el-row>
        <el-col :span="12">
          审计项目名称：2021年泰安分公司经责审计
        </el-col>
        <el-col :span="12">
          被审计单位：泰安分公司XXX领导
        </el-col>
      </el-row>
      <el-form-item label="审计(调查)事项：">
        <el-input type="textarea"
                  v-model="form.item"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="审计(调查)事项描述："
                    class="form-item-describe">
        <el-popover placement="bottom-start"
                    trigger="click"
                    @hide="popoverHide">
          <el-table :data="proData"
                    stripe>
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
            <el-table-column property="number"
                             label="序号"></el-table-column>
            <el-table-column property="field"
                             label="领域"></el-table-column>
            <el-table-column property="proName"
                             label="问题"></el-table-column>
            <el-table-column property="gist"
                             label="依据"></el-table-column>
            <el-table-column property="describe"
                             label="描述"></el-table-column>
            <el-table-column property="date"
                             label="发现日期"
                             width="130"></el-table-column>
            <el-table-column property="money"
                             label="涉及金额(元)"
                             width="130"></el-table-column>
            <el-table-column property="suggest"
                             label="管理建议"></el-table-column>
            <el-table-column property="discoverer"
                             label="发现人"></el-table-column>
          </el-table>
          <el-button slot="reference"
                     class="related-problem-btn">关联问题</el-button>
        </el-popover>
        <el-input type="textarea"
                  v-model="form.describe"
                  placeholder="请输入"
                  :autosize="{ minRows: 5, maxRows: 5}">
        </el-input>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item label="审计人员：">
            <el-input v-model="form.auditor"
                      placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6"
                :offset="1">
          <el-form-item label="复核人：">
            <el-input v-model="form.reviewer"
                      placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6"
                :offset="1">
          <el-form-item label="编制日期："
                        placeholder="请输入">
            <el-date-picker v-model="form.date"
                            type="date"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      form: {
        // name: "",
        // region: "",
        item: "测试测试测试",
        describe:
          "问题一、部分工程项目转资时点不准确。抽查发现山东移动2某设备割接入网时间为2019年3月28日，其转资时间为2019年1月30日，设备转资提前，涉及金额XX元。问题二、部分工程项目转资金额不准确。抽查发现山东移动2018年融合核心网电路某设备割接入网时间为2019年3月28日，其转资时间为2019年1月30日，设备转资提前，涉及金额XX元。",
        auditor: "小红",
        reviewer: "小明",
        date: new Date("2021-09-30"),
      },
      proData: [
        {
          number: 1,
          field: "政企",
          proName: "xxx",
          gist: "xxx",
          describe: "xxx",
          date: "2021-09-30",
          money: "123,4343",
          suggest: "管理建议",
          discoverer: "小明",
        },
        {
          number: 2,
          field: "政企",
          proName: "xxx",
          gist: "xxx",
          describe: "xxx",
          date: "2021-09-30",
          money: "123,4343",
          suggest: "管理建议",
          discoverer: "小明",
        },
        {
          number: 3,
          field: "政企",
          proName: "xxx",
          gist: "xxx",
          describe: "xxx",
          date: "2021-09-30",
          money: "123,4343",
          suggest: "管理建议",
          discoverer: "小明",
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    // 关联问题
    popoverHide () {
      this.form.describe =
        "问题一、部分工程项目转资时点不准确。抽查发现山东移动2某设备割接入网时间为2019年3月28日，其转资时间为2019年1月30日，设备转资提前，涉及金额XX元。问题二、部分工程项目转资金额不准确。抽查发现山东移动2018年融合核心网电路某设备割接入网时间为2019年3月28日，其转资时间为2019年1月30日，设备转资提前，涉及金额XX元。";
    },
  },
};
</script>

<style lang="scss" scoped>
.el-table__header {
  border: none !important;
}
.add-confirmation-popover {
  color: #383839;
  padding-top: 20px;
  .el-form-item {
    margin-top: 10px;
  }
  .form-item-describe {
    position: relative;
    margin-top: 20px;
    .related-problem-btn {
      border: 1px solid #dcdfe6;
      position: absolute;
      z-index: 1;
      top: -43px;
      left: 140px;
      font-weight: normal;
    }
  }
}
.add-confirmation-popover .form-item-describe ::v-deep .el-form-item__content {
  margin-top: 8px;
}
.add-confirmation-popover ::v-deep .el-form-item__label {
  font-size: 14px;
  color: #383839;
  font-weight: normal;
}
.el-table ::v-deep .el-table__header {
  border: none !important;
}
</style>
