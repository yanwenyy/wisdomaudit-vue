<template>
  <div class="report anmition_show">
    <div class="header">
      <el-col :span="12">
        <p>审计项目：2021经费审计项目</p>
      </el-col>
      <el-col :span="12">
        <p>被审计单位：2021经费审计项目</p>
      </el-col>
    </div>

    <div class="conter">
      <div class="top">
        <el-row>
          <el-col>
            <p>经营评价：</p>
            <el-button type="primary"
                       @click="Correlation_zb()">关联指标</el-button>
          </el-col>

          <div class="text">
            <el-col>
              1.23o239139219830921832390131
            </el-col>
          </div>

        </el-row>

        <el-row>
          <el-col>

          </el-col>
        </el-row>
      </div>

      <div class="top">
        <el-row>
          <el-col>
            <p>管理建议：</p>
            <el-button type="primary"
                       @click="Correlation_wt">关联问题</el-button>
          </el-col>

          <div class="text">
            <el-col>
              1.23o239139219830921832390131
            </el-col>
          </div>

        </el-row>

        <el-row>
          <el-col>

          </el-col>
        </el-row>
      </div>

      <div class="bottom">
        <span slot="footer">
          <el-button size="small"
                     @click="dlag_Correlation_zb = false">
            取消</el-button>
          <el-button size="small"
                     type="primary"
                     @click="query_report()">生成报告</el-button>
        </span>

        <div class="flex_end">
          <p>附件：</p>
          <ul>
            <li> <a href="#">22222222222222222222</a><span>版本1.0</span><span>时间2011-1102</span></li>
            <li> <a href="#">222222222222</a><span>版本1.0</span><span>时间2011-1102</span></li>

          </ul>

        </div>
      </div>

    </div>

    <!-- 关联指标 -->
    <el-dialog title="关联指标"
               width="40%"
               popper-class="status_data_dlag_verify"
               :visible.sync="dlag_Correlation_zb"
               style="padding-bottom: 59px">
      <div class="dlag_conter3">
        <!-- 表单 -->
        <el-table :data="tableData1"
                  ref="multipleTable"
                  tooltip-effect="dark"
                  v-loading="loading"
                  style="width: 100%"
                  @selection-change="handleSelectionChange_zb">
          >
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column prop="name"
                           label="指标类型"> </el-table-column>

          <el-table-column prop="name"
                           label="依据"> </el-table-column>

          <el-table-column prop="name"
                           label="单位"> </el-table-column>

          <el-table-column prop="name"
                           label="资料提供部门"> </el-table-column>
          <el-table-column prop="name"
                           label="管理建议"> </el-table-column>

          <el-table-column prop="name"
                           label="指标值"> </el-table-column>
        </el-table>

        <span slot="footer"
              class="foot">
          <el-button size="small"
                     @click="dlag_Correlation_zb = false">
            取消</el-button>
          <el-button size="small"
                     type="primary"
                     @click="query_save_zb()">确定</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 关联问题 -->
    <el-dialog title="关联问题"
               width="40%"
               popper-class="status_data_dlag_verify"
               :visible.sync="dlag_Correlation_wt"
               style="padding-bottom: 59px">
      <div class="dlag_conter3">
        <!-- 表单 -->
        <el-table :data="tableData1"
                  ref="multipleTable"
                  tooltip-effect="dark"
                  v-loading="loading"
                  style="width: 100%"
                  @selection-change="handleSelectionChange_zb">
          >
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column prop="name"
                           label="指标类型"> </el-table-column>

          <el-table-column prop="name"
                           label="依据"> </el-table-column>

          <el-table-column prop="name"
                           label="单位"> </el-table-column>

          <el-table-column prop="name"
                           label="资料提供部门"> </el-table-column>
          <el-table-column prop="name"
                           label="管理建议"> </el-table-column>

          <el-table-column prop="name"
                           label="指标值"> </el-table-column>
        </el-table>

        <span slot="footer"
              class="foot">

          <el-button size="small"
                     @click="dlag_Correlation_wt = false">
            取消</el-button>
          <el-button size="small"
                     type="primary"
                     @click="query_save_wt()">确定</el-button>
        </span>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      loading: false,
      dlag_Correlation_zb: false,//添加关联指标
      dlag_Correlation_wt: false,//添加关联问题

      zb_list: [],//指标多选
      zb_list: [],//问题多选
      tableData1: [
        {
          name: '个人',

        },
        {
          name: '个人',

        },
        {
          name: '个人',

        },
        {
          name: '个人',

        },
        {
          name: '个人',

        },
      ],

    }
  },
  computed: {},
  watch: {},
  methods: {
    // 添加关联指标
    Correlation_zb () {
      this.dlag_Correlation_zb = true;//添加关联指标
    },
    // 指标确认保存
    query_save_zb () {
      this.dlag_Correlation_zb = false;//添加关联指标

    },
    // 指标多选
    handleSelectionChange_zb (val) {
      this.zb_list = val
    },


    // 添加关联问题
    Correlation_wt () {
      this.dlag_Correlation_wt = true;//添加关联问题
    },

    // 指标确认保存
    query_save_wt () {
      this.dlag_Correlation_wt = false;//添加关联问题

    },
    // 指标多选
    handleSelectionChange_zb (val) {
      this.wt_list = val
    },

    // 生成报告
    query_report () {

    },


  },
  created () {

  },
  mounted () {

  },
}
</script>

<style scoped>
.report {
}
.report >>> .header {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
}
.header >>> .el-row {
}
.top {
  padding: 20px;
  box-sizing: border-box;
}
.top >>> .el-row .el-col {
  width: 100%;
  display: flex;
  align-items: center;
}

.text {
  width: 100%;
  float: left;
  border: 1px solid rgba(0, 0, 0, 0.3);
  padding: 20px;
  box-sizing: border-box;
  margin-top: 20px;
}
.dlag_conter3 >>> .foot {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}
.bottom {
  display: flex;
  flex-wrap: wrap;
}
.bottom p {
  display: flex;
  margin-right: 5px;
}
.flex_end {
  display: flex;
  margin-left: 100px;
}
.flex_end ul {
  display: flex;
  flex-wrap: wrap;
}
.flex_end ul li {
  width: 100%;
  display: flex;
  color: #4f9fdd;
  margin-bottom: 20px;
}
.flex_end ul li span {
  margin: 0 10px;
  color: rgba(0, 0, 0, 0.7);
}
</style>
