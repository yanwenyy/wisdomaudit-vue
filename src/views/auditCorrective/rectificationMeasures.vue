<template>
  <div class="rectificationMeasures">
    <div style="width: 100%; overflow: hidden">
      <div style="float: right;">
        <el-form class="search-form" :inline="true" :model="searchFrom" @keyup.enter.native="init()">
          <el-form-item label="状态:">
            <el-select v-model="form.zt" placeholder="请选择">
              <el-option
                label="1"
                value="1"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目:">
            <el-select v-model="form.zt" placeholder="请选择">
              <el-option
                label="1"
                value="1"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题:">
            <el-input
              placeholder="请输入问题"
              v-model="form.info"
              class="input-with-select"
            >
              <el-button type="primary" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table
      style="width: 100%"
      :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
      border
      :data="tableData"
      highlight-current-row
    >
      <el-table-column
        fixed="left"
        label="序号"
        type="index"
      />
      <el-table-column
        label="项目名称"
        width="200px"
        prop="name"
        algin="left"
      />
      <el-table-column
        label="问题"
        width="200px"
        prop="address"
        algin="left"
      />
      <el-table-column
        label="项目类型"
        width="200px"
        prop="address"
      />
      <el-table-column
        label="整改时间"
        width="200px"
        prop="date"
        align="center"
      />
      <el-table-column
        label="整改责任部门及联系人"
        width="200px"
        align="center"
        prop="address"
      />
      <el-table-column
        label="状态"
        prop="date"
        align="center"
      />
      <el-table-column
        label="整改结果"
        prop="name"
        align="center"
      />
      <el-table-column
        label="操作"
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
      <el-pagination
        :current-page="page.current"
        :page-size="page.size"
        :page-sizes="[10, 50, 100]"
        :total="page.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <!-- 分页 end-->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {},
        page: {
          current: 1,
          size: 10,
          total: 0
        },
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
      toEditList() {
        this.$router.push({name: 'rectificationMeasuresEditList'})
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
<style scoped>
  @import '../../assets/styles/css/yw.css';
</style>
