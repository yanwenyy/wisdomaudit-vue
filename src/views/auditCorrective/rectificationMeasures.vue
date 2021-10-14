<template>
  <div class="rectificationMeasures">
    <el-row>

      <el-col :span="5" offset="17">
        <el-input
            placeholder="请输入内容"
            v-model="form.info"
            class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button style="margin-left: 10%; border: 1px solid #ebeef2"
        >筛选</el-button
        >
      </el-col>
    </el-row>

    <el-table
        fit
        style="width: 100%"
        border
        :data="tableData"
        highlight-current-row
    >
      <el-table-column
          fixed="left"
          label="编号"
          width="100"
          type="index"
      />
      <el-table-column
          label="审计项目名称"
          width="200px"
          prop="name"
      />
      <el-table-column
          label="被审计对象"
          width="200px"
          prop="address"
      />
      <el-table-column
          label="项目类型"
          width="200px"
          prop="address"
      />
      <el-table-column
          label="项目负责人"
          width="200px"
          prop="address"
      />
      <el-table-column
          label="项目组长"
          width="200px"
          prop="address"
      />
      <el-table-column
          label="审计期间"
          width="200px"
          prop="date"
      />
      <el-table-column
          label="创建人"
          width="200px"
          prop="name"
      />

      <el-table-column
          label="创建日期"
          width="200px"
          prop="date"
      >
      </el-table-column>
      <el-table-column
          label="操作"
          width="250px"
          fixed="right"
          align="center"
      >
        <template slot-scope="scope">
          <el-button class="oper-btn " @click="toEditList">
            编辑
          </el-button>
        </template>
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
  data() {
    return {
      form:{},
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
  methods: {
    toEditList(){
      this.$router.push({name:'rectificationMeasuresEditList'})
    }
  }
}
</script>

<style scoped lang="scss">
.rectificationMeasures {
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
