<template>
  <div class="questionList">
    <el-row>

      <el-col :span="5"
              :offset="17">
        <el-input placeholder="请输入内容"
                  v-model="form.info"
                  class="input-with-select">
          <el-button slot="append"
                     icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button style="margin-left: 10%; border: 1px solid #ebeef2">筛选</el-button>
      </el-col>
    </el-row>

    <el-table fit
              style="width: 100%"
              stripe
              border
              :data="tableData"
              highlight-current-row>
      <el-table-column fixed="left"
                       label="序号"
                       width="100"
                       type="index" />
      <el-table-column label="领域"
                       width="200px"
                       prop="name" />
      <el-table-column label="问题"
                       width="200px"
                       prop="address" />
      <el-table-column label="依据"
                       width="200px"
                       prop="address" />
      <el-table-column label="描述"
                       width="200px"
                       prop="address" />
      <el-table-column label="发现日期"
                       width="200px"
                       prop="address" />
      <el-table-column label="风险金额(元)"
                       width="200px"
                       prop="date">
        <template slot-scope="scope">
          <span>20</span>
        </template>
      </el-table-column>

      <el-table-column label="管理建议"
                       width="200px"
                       prop="address" />

      <el-table-column label="发现人"
                       width="200px"
                       prop="date">
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
</template>

<script>
export default {
  data () {
    return {
      form: {},
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.questionList {
  padding: 1%;
  .addBtn {
    background: #4bdcb4 !important;
    color: #fff;
  }
}
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
